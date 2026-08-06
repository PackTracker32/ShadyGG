const menu=document.querySelector('.menu');const nav=document.querySelector('.nav-links');if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
window.addEventListener('load',()=>setTimeout(()=>document.querySelector('.loader')?.classList.add('hide'),350));
