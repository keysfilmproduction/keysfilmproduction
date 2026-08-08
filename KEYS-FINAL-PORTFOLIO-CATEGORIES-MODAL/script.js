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


// FINAL Our Real Work: compact front preview + ONE shared VIEW MORE modal.
(function(){
  const data=window.KEYS_PORTFOLIO||{};
  const filmFront=document.getElementById('film-front');
  const eventFront=document.getElementById('event-front');
  const more=document.getElementById('portfolio-view-more');
  if(!filmFront||!eventFront||!more) return;

  const filmCats=[
    ['Music Video',[15]],['Product Shoot',[16]],['Line Production',[17]],['Casting',[18]],
    ['Commercial Shoot',[19]],['Corporate Film',[20]],['Ad Shoot',[21]]
  ];
  const eventCats=[
    ['Corporate Conference',[39,40]],
    ['Annual General Meeting',[22,29]],
    ['Product Launch',[28,35]],
    ['Exhibition Stall',[103,107]],
    ['Brand Activation',[15,18]],
    ['Award Ceremony',[29,31]],
    ['Industrial & Commercial Shoot',[2,3]],
    ['Government Event',[43,46]],
    ['Promotional Event',[13,17]],
    ['Wedding Events',[52,117]],
    ['Concerts & Special Events',[58,63]],
    ['Fashion & Cultural Events',[65,66]],
    ['Road Show & Branding',[81,80]]
  ];

  const allMedia=[];
  function makeMedia(type,src,title,category){ return {type,src,title,category}; }
  function getItems(cat,indices){ return indices.map(i=>cat[i]).filter(Boolean); }
  function addFrontCategory(parent,title,items,catName){
    const wrap=document.createElement('div'); wrap.className='work-category';
    const h=document.createElement('div'); h.className='work-category-title'; h.textContent=title; wrap.appendChild(h);
    const grid=document.createElement('div'); grid.className='work-category-grid';
    items.forEach(item=>{
      const b=document.createElement('button'); b.type='button'; b.className='work-thumb';
      const im=document.createElement('img'); im.src=item.src; im.alt=item.title+' - '+catName; b.appendChild(im);
      const m=makeMedia('image',item.src,item.title,catName); allMedia.push(m);
      b.addEventListener('click',()=>openLightbox(allMedia.indexOf(m))); grid.appendChild(b);
    });
    wrap.appendChild(grid); parent.appendChild(wrap);
  }

  filmCats.forEach(([title,idx])=>addFrontCategory(filmFront,title,getItems(data.film||[],idx),'Film Production'));
  eventCats.forEach(([title,idx])=>addFrontCategory(eventFront,title,getItems(data.event||[],idx),'Event Management'));

  const modal=document.createElement('div'); modal.className='portfolio-gallery-modal';
  modal.innerHTML='<div class="portfolio-gallery-inner"><div class="portfolio-gallery-top"><h3>Our Complete Work</h3><button class="portfolio-gallery-close" type="button">CLOSE</button></div><div class="portfolio-gallery-split"><div class="portfolio-gallery-column"><h4>FILM PRODUCTION</h4><div id="modal-film"></div></div><div class="portfolio-gallery-divider"></div><div class="portfolio-gallery-column"><h4>EVENT MANAGEMENT</h4><div id="modal-event"></div></div></div></div>';
  document.body.appendChild(modal);
  const modalFilm=modal.querySelector('#modal-film'), modalEvent=modal.querySelector('#modal-event');

  function addModalCategory(parent,title,items,catName){
    const section=document.createElement('div'); section.className='portfolio-modal-category';
    const h=document.createElement('h5'); h.textContent=title; section.appendChild(h);
    const grid=document.createElement('div'); grid.className='portfolio-modal-grid';
    items.forEach(item=>{
      const b=document.createElement('button'); b.type='button'; b.className='work-thumb';
      const im=document.createElement('img'); im.src=item.src; im.alt=item.title+' - '+catName; b.appendChild(im);
      const m=makeMedia('image',item.src,item.title,catName); allMedia.push(m);
      b.addEventListener('click',()=>openLightbox(allMedia.indexOf(m))); grid.appendChild(b);
    });
    section.appendChild(grid); parent.appendChild(section);
  }

  const usedFilm=new Set(); filmCats.forEach(([,idx])=>idx.forEach(i=>usedFilm.add(i)));
  const usedEvent=new Set(); eventCats.forEach(([,idx])=>idx.forEach(i=>usedEvent.add(i)));
  filmCats.forEach(([t,idx])=>addModalCategory(modalFilm,t,getItems(data.film||[],idx),'Film Production'));
  eventCats.forEach(([t,idx])=>addModalCategory(modalEvent,t,getItems(data.event||[],idx),'Event Management'));

  const remainingFilm=(data.film||[]).filter((_,i)=>!usedFilm.has(i));
  const remainingEvent=(data.event||[]).filter((_,i)=>!usedEvent.has(i));
  if(remainingFilm.length) addModalCategory(modalFilm,'More Film Production Work',remainingFilm,'Film Production');
  if(remainingEvent.length) addModalCategory(modalEvent,'More Event Management Work',remainingEvent,'Event Management');

  const weddingVideos=['assets/wedding/wedding-1.mp4','assets/wedding/wedding-2.mp4','assets/wedding/wedding-3.mp4'];
  const videoSection=document.createElement('div'); videoSection.className='portfolio-modal-category';
  const vh=document.createElement('h5'); vh.textContent='Wedding Videos'; videoSection.appendChild(vh);
  const vg=document.createElement('div'); vg.className='portfolio-modal-grid';
  weddingVideos.forEach((src,i)=>{
    const b=document.createElement('button'); b.type='button'; b.className='work-thumb video-thumb';
    const v=document.createElement('video'); v.src=src; v.muted=true; v.preload='metadata'; v.playsInline=true; b.appendChild(v);
    const m=makeMedia('video',src,'Wedding Video '+(i+1),'Event Management'); allMedia.push(m);
    b.addEventListener('click',()=>openLightbox(allMedia.indexOf(m))); vg.appendChild(b);
  });
  videoSection.appendChild(vg); modalEvent.appendChild(videoSection);

  more.addEventListener('click',()=>{modal.classList.add('open');document.body.style.overflow='hidden'});
  function closeModal(){modal.classList.remove('open'); if(!document.querySelector('.portfolio-lightbox.open')) document.body.style.overflow=''}
  modal.querySelector('.portfolio-gallery-close').addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});

  const lb=document.createElement('div'); lb.className='portfolio-lightbox';
  lb.innerHTML='<button class="portfolio-lightbox-close" aria-label="Close">×</button><button class="portfolio-lightbox-prev" aria-label="Previous">‹</button><div class="portfolio-lightbox-media"></div><button class="portfolio-lightbox-next" aria-label="Next">›</button>';
  document.body.appendChild(lb);
  const media=lb.querySelector('.portfolio-lightbox-media'); let current=0;
  function render(){const x=allMedia[current];media.innerHTML='';if(!x)return;if(x.type==='video'){const v=document.createElement('video');v.src=x.src;v.controls=true;v.autoplay=true;v.playsInline=true;media.appendChild(v)}else{const im=document.createElement('img');im.src=x.src;im.alt=x.title;media.appendChild(im)}}
  function openLightbox(i){current=i;render();lb.classList.add('open');document.body.style.overflow='hidden'}
  function closeLightbox(){lb.classList.remove('open');media.innerHTML='';if(!modal.classList.contains('open'))document.body.style.overflow=''}
  lb.querySelector('.portfolio-lightbox-close').onclick=closeLightbox;
  lb.querySelector('.portfolio-lightbox-prev').onclick=()=>{current=(current-1+allMedia.length)%allMedia.length;render()};
  lb.querySelector('.portfolio-lightbox-next').onclick=()=>{current=(current+1)%allMedia.length;render()};
  lb.addEventListener('click',e=>{if(e.target===lb)closeLightbox()});
  document.addEventListener('keydown',e=>{
    if(lb.classList.contains('open')){if(e.key==='Escape')closeLightbox();if(e.key==='ArrowLeft')lb.querySelector('.portfolio-lightbox-prev').click();if(e.key==='ArrowRight')lb.querySelector('.portfolio-lightbox-next').click()}
    else if(modal.classList.contains('open')&&e.key==='Escape')closeModal();
  });
})();
