let current=0;
const slides=[...document.querySelectorAll('.hero-slide')];
const dots=[...document.querySelectorAll('.dots button')];
function goSlide(n){current=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle('active',i===current));dots.forEach((d,i)=>d.classList.toggle('active',i===current))}
function nextSlide(){goSlide(current+1)}
function prevSlide(){goSlide(current-1)}
setInterval(nextSlide,6000);
const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav nav');
if(menuBtn && nav){
 menuBtn.addEventListener('click',()=>{nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',nav.classList.contains('open'));});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
}


const portfolioTabs=[...document.querySelectorAll('.portfolio-tab')];
const portfolioBlocks=[...document.querySelectorAll('.portfolio-block')];
portfolioTabs.forEach(tab=>tab.addEventListener('click',()=>{
 const filter=tab.dataset.filter;
 portfolioTabs.forEach(t=>t.classList.toggle('active',t===tab));
 portfolioBlocks.forEach(block=>block.classList.toggle('is-hidden',filter!=='all' && block.dataset.category!==filter));
}));
