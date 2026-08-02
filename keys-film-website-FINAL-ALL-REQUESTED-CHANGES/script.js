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


// Client review slider: one original screenshot at a time, auto-advancing.
(function(){
  const track=document.querySelector('.reviews-track');
  const slides=[...document.querySelectorAll('.reviews-track img')];
  const dots=[...document.querySelectorAll('.review-dots button')];
  const prev=document.querySelector('.review-prev');
  const next=document.querySelector('.review-next');
  if(!track || !slides.length) return;
  let i=0;
  function show(n){
    i=(n+slides.length)%slides.length;
    track.style.transform='translateX(-'+(i*33.3333333333)+'%)';
    dots.forEach((d,k)=>d.classList.toggle('active',k===i));
  }
  prev&&prev.addEventListener('click',()=>show(i-1));
  next&&next.addEventListener('click',()=>show(i+1));
  dots.forEach((d,k)=>d.addEventListener('click',()=>show(k)));
  setInterval(()=>show(i+1),5000);
  show(0);
})();

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
