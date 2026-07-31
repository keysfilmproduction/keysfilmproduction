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
