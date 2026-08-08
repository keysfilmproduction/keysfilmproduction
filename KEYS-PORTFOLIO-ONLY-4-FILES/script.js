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


// Final shared VIEW MORE portfolio: both columns expand together.
(function(){
  const data=window.KEYS_PORTFOLIO||{};
  const filmGrid=document.getElementById('film-grid'), eventGrid=document.getElementById('event-grid'), more=document.getElementById('portfolio-view-more');
  if(!filmGrid||!eventGrid||!more) return;
  const initial=12;
  let allMedia=[]; let current=0;
  function addImage(grid,item,category,index){
    const b=document.createElement('button'); b.type='button'; b.className='work-thumb'+(index>=initial?' hidden-work':''); b.dataset.index=allMedia.length;
    const im=document.createElement('img'); im.src=item.src; im.alt=item.title+' - '+category; b.appendChild(im);
    b.addEventListener('click',()=>openLightbox(Number(b.dataset.index))); grid.appendChild(b); allMedia.push({type:'image',src:item.src,title:item.title,category});
  }
  function addVideo(grid,src,title,index){
    const b=document.createElement('button'); b.type='button'; b.className='work-thumb video-thumb'+(index>=initial?' hidden-work':''); b.dataset.index=allMedia.length;
    const v=document.createElement('video'); v.src=src; v.muted=true; v.preload='metadata'; v.playsInline=true; b.appendChild(v);
    b.addEventListener('click',()=>openLightbox(Number(b.dataset.index))); grid.appendChild(b); allMedia.push({type:'video',src,title,category:'Event Management'});
  }
  (data.film||[]).forEach((x,i)=>addImage(filmGrid,x,'Film Production',i));
  (data.event||[]).forEach((x,i)=>addImage(eventGrid,x,'Event Management',i));
  // Existing wedding videos stay part of Event Management.
  ['assets/wedding/wedding-1.mp4','assets/wedding/wedding-2.mp4','assets/wedding/wedding-3.mp4'].forEach((src,i)=>addVideo(eventGrid,src,'Wedding Video '+(i+1),12+i));
  let expanded=false;
  more.addEventListener('click',()=>{
    expanded=!expanded; document.querySelectorAll('.hidden-work').forEach(el=>el.style.display=expanded?'block':''); more.textContent=expanded?'VIEW LESS':'VIEW MORE';
  });
  const lb=document.createElement('div'); lb.className='portfolio-lightbox'; lb.innerHTML='<button class="portfolio-lightbox-close" aria-label="Close">×</button><button class="portfolio-lightbox-prev" aria-label="Previous">‹</button><div class="portfolio-lightbox-media"></div><button class="portfolio-lightbox-next" aria-label="Next">›</button>'; document.body.appendChild(lb);
  const media=lb.querySelector('.portfolio-lightbox-media');
  function render(){ const x=allMedia[current]; media.innerHTML=''; if(!x)return; if(x.type==='video'){const v=document.createElement('video');v.src=x.src;v.controls=true;v.autoplay=true;v.playsInline=true;media.appendChild(v)}else{const im=document.createElement('img');im.src=x.src;im.alt=x.title;media.appendChild(im)} }
  function openLightbox(i){current=i;render();lb.classList.add('open');document.body.style.overflow='hidden'}
  function close(){lb.classList.remove('open');media.innerHTML='';document.body.style.overflow=''}
  lb.querySelector('.portfolio-lightbox-close').onclick=close; lb.querySelector('.portfolio-lightbox-prev').onclick=()=>{current=(current-1+allMedia.length)%allMedia.length;render()}; lb.querySelector('.portfolio-lightbox-next').onclick=()=>{current=(current+1)%allMedia.length;render()};
  lb.addEventListener('click',e=>{if(e.target===lb)close()}); document.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')lb.querySelector('.portfolio-lightbox-prev').click();if(e.key==='ArrowRight')lb.querySelector('.portfolio-lightbox-next').click()});
})();
