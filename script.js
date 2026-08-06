const menu=document.querySelector('.menu');
const nav=document.querySelector('.nav-links');
if(menu&&nav){
  menu.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    menu.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
}

document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting)entry.target.classList.add('on');
}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

window.addEventListener('load',()=>setTimeout(()=>document.querySelector('.loader')?.classList.add('hide'),300));

// Atmospheric smoke and enhanced embers. Pure CSS/JS, so no extra asset files are needed.
const atmosphere=document.createElement('div');
atmosphere.className='atmosphere';
atmosphere.setAttribute('aria-hidden','true');
atmosphere.innerHTML='<span class="smoke-cloud"></span>'.repeat(5)+'<div class="ember-field"></div>';
document.body.appendChild(atmosphere);
const emberField=atmosphere.querySelector('.ember-field');
for(let i=0;i<58;i++){
  const ember=document.createElement('i');
  ember.className='ember-particle';
  ember.style.left=`${Math.random()*100}%`;
  ember.style.setProperty('--size',`${1.5+Math.random()*3.4}px`);
  ember.style.setProperty('--speed',`${7+Math.random()*12}s`);
  ember.style.setProperty('--delay',`${-Math.random()*18}s`);
  ember.style.setProperty('--drift',`${-90+Math.random()*180}px`);
  emberField.appendChild(ember);
}

// Easy-to-update milestone value. Change only this number as the channel grows.
const CURRENT_SUBSCRIBERS=0;
document.querySelectorAll('[data-subscriber-count]').forEach(el=>el.textContent=CURRENT_SUBSCRIBERS.toLocaleString());
document.querySelectorAll('[data-goal]').forEach(el=>{
  const goal=Number(el.dataset.goal)||1;
  const percent=Math.min(100,Math.max(0,(CURRENT_SUBSCRIBERS/goal)*100));
  const bar=el.querySelector('.progress span');
  const value=el.querySelector('[data-progress-value]');
  if(bar)requestAnimationFrame(()=>bar.style.width=`${percent}%`);
  if(value)value.textContent=`${CURRENT_SUBSCRIBERS} / ${goal}`;
});
