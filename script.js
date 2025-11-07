// Chat-style message sender with typing indicator and floating hearts
const messages = [
  "е као",
  "срећан Свети Димитрије<3",
  "срећних 2950 сати везе<3",
  "воооОооОолим те<333"
];

const messagesEl = document.getElementById('messages');
const heartsEl = document.getElementById('hearts');
let idx = 0;
let autoplay = true; // start auto-sending by default
let sending = false;

function makeBubble(text, who = 'you'){
  // wrap bubble + optional avatar in a message-row
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
    // right-aligned bubble (no avatar)
    const bubble = document.createElement('div');
    bubble.className = `bubble ${who} enter`;
    bubble.innerHTML = text;
    row.appendChild(bubble);
  }

  return row;
}

function makeTyping(){
  // create a message-row with avatar + typing bubble
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
  // disable Reset while running
  if(resetBtn) resetBtn.disabled = true;
  sending = true;

  // show typing bubble
  const typing = makeTyping();
  messagesEl.appendChild(typing);
  scrollToBottom();

  // after a short delay, replace typing with sent bubble
  const typingDelay = 900 + Math.random()*600;
  setTimeout(()=>{
    typing.remove();
    const bubble = makeBubble(messages[idx], 'you');
    messagesEl.appendChild(bubble);
    bubble.classList.add('enter');
    scrollToBottom();
    // little pop of hearts for each sent message
    spawnHearts(Math.min(6, 2 + Math.floor(Math.random()*4)));

    idx++;
    sending = false;
    // if finished, enable Reset and stop autoplay
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
  // go back one message by removing last bubble if any
  if(sending) return;
  if(messagesEl.lastChild) messagesEl.removeChild(messagesEl.lastChild);
  idx = Math.max(0, idx-1);
}

function spawnHearts(count = 4){
  for(let i=0;i<count;i++){
    const h = document.createElement('div');
    h.className = 'heart';
    h.textContent = '❤';
    // random start position
    h.style.left = (20 + Math.random()*60) + '%';
    h.style.bottom = (8 + Math.random()*10) + 'px';
    h.style.fontSize = (12 + Math.random()*18) + 'px';
    h.style.animationDuration = (2.5 + Math.random()*1.6) + 's';
    heartsEl.appendChild(h);
    // remove after animation
    h.addEventListener('animationend', ()=> h.remove());
  }
}

// continuous floating hearts across the screen
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
    // small random horizontal drift
    h.style.setProperty('--drift', (Math.random()*80 - 40) + 'px');
    heartsEl.appendChild(h);
    h.addEventListener('animationend', ()=> h.remove());
  }, 700);
}

// wire up input bar
const textInput = document.getElementById('textInput');
const sendBtn = document.getElementById('sendBtn');
function sendFromInput(){
  const v = (textInput.value || '').trim();
  if(!v) return;
  // create a right-aligned 'me' row so typed message appears as sent
  const row = document.createElement('div');
  row.className = 'message-row me';
  const bubble = document.createElement('div');
  bubble.className = 'bubble me enter';
  bubble.innerText = v;
  row.appendChild(bubble);
  messagesEl.appendChild(row);
  scrollToBottom();
  textInput.value = '';
  // spawn a couple hearts for fun
  spawnHearts(3);
}
sendBtn.addEventListener('click', sendFromInput);
textInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') sendFromInput(); });

// start continuous hearts
startFloatingHearts();

// wire up Reset button and initialize state
const resetBtn = document.getElementById('resetBtn');
if(resetBtn){
  resetBtn.addEventListener('click', ()=>{ resetSequence(); });
  resetBtn.disabled = true;
}

// clicking messages advances (keeps ability to tap to advance but stops autoplay)
messagesEl.addEventListener('click', ()=>{ stopAutoplay(); sendNext(); });

// start autoplay automatically
if(autoplay) setTimeout(sendNext, 700);

function resetSequence(){
  if(resetBtn) resetBtn.disabled = true;
  stopAutoplay();
  // fade out messages then clear and restart
  messagesEl.classList.add('fading');
  messagesEl.addEventListener('transitionend', function onEnd(e){
    if(e.propertyName !== 'opacity') return;
    messagesEl.removeEventListener('transitionend', onEnd);
    messagesEl.innerHTML = '';
    messagesEl.classList.remove('fading');
    idx = 0; sending = false; autoplay = true;
    setTimeout(sendNext, 500);
  }, {once:true});
  // fallback
  setTimeout(()=>{
    if(messagesEl.classList.contains('fading')){
      messagesEl.innerHTML = '';
      messagesEl.classList.remove('fading');
      idx = 0; sending = false; autoplay = true;
      setTimeout(sendNext, 500);
    }
  }, 800);
}

