const messages = [
  "е као",
  "срећан Свети Димитрије<3",
  "срећних 2950 сати везе<3",
  "маало више ако ово читаш ујутру",
  "воооОооОолим те<333"
];

const messagesEl = document.getElementById('messages');
const heartsEl = document.getElementById('hearts');
let idx = 0;
let autoplay = true;
let sending = false;

function makeBubble(text, who = 'you'){
  const row = document.createElement('div');
  row.className = `message-row ${who}`;

  if(who === 'you'){
    const img = document.createElement('img');
    img.src = './avatar.jpg';
    img.alt = 'avatar';
    img.className = 'avatar';
    row.appendChild(img);

    const bubble = document.createElement('div');
    bubble.className = `bubble ${who} enter`;
    bubble.innerHTML = text;
    row.appendChild(bubble);
  } else {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${who} enter`;
    bubble.innerHTML = text;
    row.appendChild(bubble);
  }

  return row;
}

function makeTyping(){
  const row = document.createElement('div');
  row.className = 'message-row you';

  const img = document.createElement('img');
  img.src = './avatar.jpg';
  img.alt = 'avatar';
  img.className = 'avatar';
  row.appendChild(img);

  const wrap = document.createElement('div');
  wrap.className = 'typing bubble you enter';
  const d1 = document.createElement('span'); d1.className='dot';
  const d2 = document.createElement('span'); d2.className='dot';
  const d3 = document.createElement('span'); d3.className='dot';
  wrap.appendChild(d1); wrap.appendChild(d2); wrap.appendChild(d3);
  row.appendChild(wrap);
  return row;
}

function scrollToBottom(){
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function sendNext(){
  if(sending) return;
  if(idx >= messages.length){ stopAutoplay(); if(resetBtn) resetBtn.disabled = false; return; }
  if(resetBtn) resetBtn.disabled = true;
  sending = true;

  const typing = makeTyping();
  messagesEl.appendChild(typing);
  scrollToBottom();

  const typingDelay = 900 + Math.random()*600;
  setTimeout(()=>{
    typing.remove();
    const bubble = makeBubble(messages[idx], 'you');
    messagesEl.appendChild(bubble);
    bubble.classList.add('enter');
    scrollToBottom();
    spawnHearts(Math.min(6, 2 + Math.floor(Math.random()*4)));

    idx++;
    sending = false;
    if(idx >= messages.length){ stopAutoplay(); if(resetBtn) resetBtn.disabled = false; }
    else if(autoplay) setTimeout(sendNext, 700 + Math.random()*700);
  }, typingDelay);
}

function startAutoplay(){
  if(autoplay) return;
  autoplay = true;
  setTimeout(sendNext, 400);
}

function stopAutoplay(){
  autoplay = false;
  const ap = document.getElementById('autoplay');
  if(ap) ap.textContent = 'Auto';
}

function prev(){
  if(sending) return;
  if(messagesEl.lastChild) messagesEl.removeChild(messagesEl.lastChild);
  idx = Math.max(0, idx-1);
}

function spawnHearts(count = 4){
  for(let i=0;i<count;i++){
    const h = document.createElement('div');
    h.className = 'heart';
    h.textContent = '❤';
    h.style.left = (20 + Math.random()*60) + '%';
    h.style.bottom = (8 + Math.random()*10) + 'px';
    h.style.fontSize = (12 + Math.random()*18) + 'px';
    h.style.animationDuration = (2.5 + Math.random()*1.6) + 's';
    heartsEl.appendChild(h);
    h.addEventListener('animationend', ()=> h.remove());
  }
}

let heartsInterval = null;
function startFloatingHearts(){
  if(heartsInterval) return;
  heartsInterval = setInterval(()=>{
    const h = document.createElement('div');
    h.className = 'heart';
    h.textContent = '❤';
    h.style.left = (5 + Math.random()*90) + '%';
    h.style.bottom = (10 + Math.random()*20) + 'px';
    h.style.fontSize = (10 + Math.random()*20) + 'px';
    h.style.opacity = 0.9;
    h.style.animationDuration = (3 + Math.random()*3) + 's';
    h.style.setProperty('--drift', (Math.random()*80 - 40) + 'px');
    heartsEl.appendChild(h);
    h.addEventListener('animationend', ()=> h.remove());
  }, 700);
}

const textInput = document.getElementById('textInput');
const sendBtn = document.getElementById('sendBtn');
function sendFromInput(){
  const v = (textInput.value || '').trim();
  if(!v) return;
  const row = document.createElement('div');
  row.className = 'message-row me';
  const bubble = document.createElement('div');
  bubble.className = 'bubble me enter';
  bubble.innerText = v;
  row.appendChild(bubble);
  messagesEl.appendChild(row);
  scrollToBottom();
  textInput.value = '';
  spawnHearts(3);
}
sendBtn.addEventListener('click', sendFromInput);
textInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') sendFromInput(); });

startFloatingHearts();

const resetBtn = document.getElementById('resetBtn');
if(resetBtn){
  resetBtn.addEventListener('click', ()=>{ resetSequence(); });
  resetBtn.disabled = true;
}

messagesEl.addEventListener('click', ()=>{ stopAutoplay(); sendNext(); });

if(autoplay) setTimeout(sendNext, 700);

function resetSequence(){
  if(resetBtn) resetBtn.disabled = true;
  stopAutoplay();
  messagesEl.classList.add('fading');
  messagesEl.addEventListener('transitionend', function onEnd(e){
    if(e.propertyName !== 'opacity') return;
    messagesEl.removeEventListener('transitionend', onEnd);
    messagesEl.innerHTML = '';
    messagesEl.classList.remove('fading');
    idx = 0; sending = false; autoplay = true;
    setTimeout(sendNext, 500);
  }, {once:true});
  setTimeout(()=>{
    if(messagesEl.classList.contains('fading')){
      messagesEl.innerHTML = '';
      messagesEl.classList.remove('fading');
      idx = 0; sending = false; autoplay = true;
      setTimeout(sendNext, 500);
    }
  }, 800);
}

