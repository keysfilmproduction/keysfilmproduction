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

// Portfolio image lightbox with next/back buttons and touch swipe
(function(){
  const items=[...document.querySelectorAll('.portfolio-item[data-lightbox]')];
  const box=document.getElementById('portfolioLightbox');
  const image=document.getElementById('lightboxImage');
  if(!items.length || !box || !image) return;
  let currentIndex=0, startX=0, startY=0;
  function show(i){
    currentIndex=(i+items.length)%items.length;
    image.src=items[currentIndex].dataset.lightbox;
    box.classList.add('open'); box.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function close(){box.classList.remove('open'); box.setAttribute('aria-hidden','true'); document.body.style.overflow=''; image.src='';}
  function next(){show(currentIndex+1)}
  function prev(){show(currentIndex-1)}
  items.forEach((item,i)=>item.addEventListener('click',e=>{e.preventDefault();show(i)}));
  box.querySelector('.lightbox-close').addEventListener('click',close);
  box.querySelector('.lightbox-next').addEventListener('click',next);
  box.querySelector('.lightbox-prev').addEventListener('click',prev);
  box.addEventListener('click',e=>{if(e.target===box) close()});
  document.addEventListener('keydown',e=>{if(!box.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')prev()});
  image.addEventListener('touchstart',e=>{const t=e.changedTouches[0];startX=t.clientX;startY=t.clientY},{passive:true});
  image.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-startX,dy=t.clientY-startY;if(Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)){dx<0?next():prev()}},{passive:true});
})();
