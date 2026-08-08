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


// Portfolio split: View More + click-to-enlarge image gallery.
(function(){
  const moreButtons=[...document.querySelectorAll('.portfolio-view-more')];
  moreButtons.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const category=btn.closest('.portfolio-category');
      const hidden=[...category.querySelectorAll('.work-more-hidden')];
      const expanded=category.classList.toggle('portfolio-expanded');
      hidden.forEach(el=>el.style.display=expanded?'block':'none');
      btn.textContent=expanded?'VIEW LESS':'VIEW MORE';
    });
  });

  const box=document.getElementById('portfolioLightbox');
  const image=box?.querySelector('.portfolio-lightbox-image');
  if(!box || !image) return;
  let gallery=[]; let index=0;
  function render(n){
    if(!gallery.length) return;
    index=(n+gallery.length)%gallery.length;
    image.src=gallery[index].href;
    image.alt=gallery[index].querySelector('img')?.alt || 'Portfolio work';
  }
  function open(link){
    const cat=link.closest('.portfolio-category');
    gallery=[...cat.querySelectorAll('a[data-lightbox]')];
    index=gallery.indexOf(link);
    box.classList.add('open'); box.setAttribute('aria-hidden','false');
    render(index); document.body.style.overflow='hidden';
  }
  function close(){box.classList.remove('open');box.setAttribute('aria-hidden','true');image.src='';document.body.style.overflow='';}
  document.querySelectorAll('a[data-lightbox]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();open(link)}));
  box.querySelector('.portfolio-lightbox-close')?.addEventListener('click',close);
  box.querySelector('.portfolio-lightbox-prev')?.addEventListener('click',()=>render(index-1));
  box.querySelector('.portfolio-lightbox-next')?.addEventListener('click',()=>render(index+1));
  box.addEventListener('click',e=>{if(e.target===box) close()});
  document.addEventListener('keydown',e=>{if(!box.classList.contains('open')) return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')render(index-1);if(e.key==='ArrowRight')render(index+1)});
})();
