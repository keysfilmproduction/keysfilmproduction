let current = 0;
const slides = [...document.querySelectorAll('.hero-slide')];
const dots = [...document.querySelectorAll('.dots button')];
function goSlide(n){
  if(!slides.length) return;
  current=(n+slides.length)%slides.length;
  slides.forEach((s,i)=>s.classList.toggle('active',i===current));
  dots.forEach((d,i)=>d.classList.toggle('active',i===current));
}
function nextSlide(){goSlide(current+1)}
function prevSlide(){goSlide(current-1)}
if(slides.length > 1) setInterval(nextSlide,6000);
const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav nav');
if(menuBtn && nav){
  menuBtn.addEventListener('click',()=>{
    nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded',nav.classList.contains('open'));
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
}


// FINAL review carousel: exactly ONE original review screenshot visible at a time.
(function(){
  const track=document.querySelector('.reviews-track');
  const items=[...document.querySelectorAll('.reviews-track img')];
  const dots=[...document.querySelectorAll('.review-dots button')];
  const prev=document.querySelector('.review-prev');
  const next=document.querySelector('.review-next');
  if(!track || items.length<1) return;
  let index=0, timer;
  function render(n){
    index=(n+items.length)%items.length;
    track.style.transform='translate3d('+(-index*(100/items.length))+'%,0,0)';
    dots.forEach((d,k)=>d.classList.toggle('active',k===index));
  }
  function restart(){clearInterval(timer);timer=setInterval(()=>render(index+1),4500)}
  prev?.addEventListener('click',()=>{render(index-1);restart()});
  next?.addEventListener('click',()=>{render(index+1);restart()});
  dots.forEach((d,k)=>d.addEventListener('click',()=>{render(k);restart()}));
  let sx=0;
  track.parentElement.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  track.parentElement.addEventListener('touchend',e=>{let dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45){render(index+(dx<0?1:-1));restart()}},{passive:true});
  render(0); restart();
})();


// Final portfolio: clean two-column front gallery + one shared modal for VIEW MORE.
(function(){
  const data=window.KEYS_PORTFOLIO||{};
  const filmGrid=document.getElementById('film-grid');
  const eventGrid=document.getElementById('event-grid');
  const more=document.getElementById('portfolio-view-more');
  if(!filmGrid||!eventGrid||!more) return;
  const INITIAL=12;
  const media=[];

  function addThumb(grid,item,category,index,visible){
    const b=document.createElement('button');
    b.type='button'; b.className='work-thumb'+(visible?'':'hidden-work');
    b.dataset.mediaIndex=media.length;
    const im=document.createElement('img');
    im.src=item.src; im.alt=category+' work'; im.loading=visible?'eager':'lazy';
    b.appendChild(im); grid.appendChild(b);
    media.push({type:'image',src:item.src,category});
    b.addEventListener('click',()=>openViewer(Number(b.dataset.mediaIndex)));
  }

  // Front: exactly 12 each. Remaining media stays inside the modal only.
  (data.film||[]).forEach((item,i)=>addThumb(filmGrid,item,'Film Production',i<INITIAL));
  (data.event||[]).forEach((item,i)=>addThumb(eventGrid,item,'Event Management',i<INITIAL));

  // Existing wedding videos are available inside the Event Management modal.
  const weddingVideos=['assets/wedding/wedding-1.mp4','assets/wedding/wedding-2.mp4','assets/wedding/wedding-3.mp4'];
  weddingVideos.forEach((src)=>media.push({type:'video',src,category:'Event Management'}));

  const modal=document.createElement('div');
  modal.className='portfolio-gallery-modal';
  modal.innerHTML=`
    <div class="portfolio-modal-panel" role="dialog" aria-modal="true" aria-label="Our Work Gallery">
      <button class="portfolio-modal-close" type="button" aria-label="Close">×</button>
      <div class="portfolio-modal-head"><div class="section-kicker">OUR WORK</div><h3>Our Real Work</h3></div>
      <div class="portfolio-modal-split">
        <div class="portfolio-modal-column"><h4>FILM PRODUCTION</h4><div class="portfolio-modal-grid" id="modal-film-grid"></div></div>
        <div class="portfolio-modal-divider"></div>
        <div class="portfolio-modal-column"><h4>EVENT MANAGEMENT</h4><div class="portfolio-modal-grid" id="modal-event-grid"></div></div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  const modalFilm=modal.querySelector('#modal-film-grid');
  const modalEvent=modal.querySelector('#modal-event-grid');
  const closeBtn=modal.querySelector('.portfolio-modal-close');

  function modalItem(item,idx){
    const b=document.createElement('button'); b.type='button'; b.className='work-thumb modal-thumb'; b.dataset.mediaIndex=idx;
    if(item.type==='video'){
      const v=document.createElement('video'); v.src=item.src; v.muted=true; v.preload='metadata'; v.playsInline=true; b.appendChild(v);
      b.classList.add('video-thumb');
    }else{
      const im=document.createElement('img'); im.src=item.src; im.alt=item.category+' work'; im.loading='lazy'; b.appendChild(im);
    }
    b.addEventListener('click',()=>openViewer(idx)); return b;
  }
  (data.film||[]).forEach((item,i)=>modalFilm.appendChild(modalItem({type:'image',src:item.src,category:'Film Production'},i)));
  (data.event||[]).forEach((item,i)=>modalEvent.appendChild(modalItem({type:'image',src:item.src,category:'Event Management'},(data.film||[]).length+i)));
  const filmCount=(data.film||[]).length;
  weddingVideos.forEach((src,i)=>modalEvent.appendChild(modalItem({type:'video',src,category:'Event Management'},filmCount+(data.event||[]).length+i)));

  more.addEventListener('click',()=>{modal.classList.add('open');document.body.style.overflow='hidden';});
  function closeModal(){modal.classList.remove('open');document.body.style.overflow='';}
  closeBtn.addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});

  let viewerIndex=0;
  const viewer=document.createElement('div'); viewer.className='portfolio-media-viewer';
  viewer.innerHTML='<button class="portfolio-viewer-close" type="button" aria-label="Close">×</button><button class="portfolio-viewer-prev" type="button" aria-label="Previous">‹</button><div class="portfolio-viewer-media"></div><button class="portfolio-viewer-next" type="button" aria-label="Next">›</button>';
  document.body.appendChild(viewer);
  const viewerMedia=viewer.querySelector('.portfolio-viewer-media');
  function renderViewer(){
    viewerMedia.innerHTML=''; const x=media[viewerIndex]; if(!x)return;
    if(x.type==='video'){const v=document.createElement('video');v.src=x.src;v.controls=true;v.autoplay=true;v.playsInline=true;viewerMedia.appendChild(v)}
    else{const im=document.createElement('img');im.src=x.src;im.alt=x.category+' work';viewerMedia.appendChild(im)}
  }
  function openViewer(i){viewerIndex=(i+media.length)%media.length;renderViewer();viewer.classList.add('open');document.body.style.overflow='hidden';}
  function closeViewer(){viewer.classList.remove('open');viewerMedia.innerHTML=''; if(!modal.classList.contains('open'))document.body.style.overflow='';}
  viewer.querySelector('.portfolio-viewer-close').onclick=closeViewer;
  viewer.querySelector('.portfolio-viewer-prev').onclick=()=>{viewerIndex=(viewerIndex-1+media.length)%media.length;renderViewer()};
  viewer.querySelector('.portfolio-viewer-next').onclick=()=>{viewerIndex=(viewerIndex+1)%media.length;renderViewer()};
  viewer.addEventListener('click',e=>{if(e.target===viewer)closeViewer()});
  document.addEventListener('keydown',e=>{
    if(viewer.classList.contains('open')){
      if(e.key==='Escape')closeViewer(); if(e.key==='ArrowLeft')viewer.querySelector('.portfolio-viewer-prev').click(); if(e.key==='ArrowRight')viewer.querySelector('.portfolio-viewer-next').click();
    }else if(modal.classList.contains('open')&&e.key==='Escape'){closeModal();}
  });
})();
