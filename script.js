/* ── Floating Particles Engine ── */
const pWrap = document.getElementById('particles');
const emojis = ['💕', '🌸', '💗', '🌷', '✨', '💖', '🌿', '💝', '⭐', '🌟'];

for (let i = 0; i < 28; i++) {
  const el = document.createElement('div');
  el.className = 'particle';
  const isEmoji = Math.random() > 0.5;
  
  if (isEmoji) {
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.fontSize = (0.6 + Math.random() * 1) + 'rem';
  } else {
    el.style.width = (2 + Math.random() * 4) + 'px';
    el.style.height = el.style.width;
    el.style.background = `rgba(255, ${100 + Math.floor(Math.random() * 80)}, ${150 + Math.floor(Math.random() * 60)}, 0.6)`;
  }
  
  el.style.left = Math.random() * 100 + 'vw';
  el.style.animationDuration = (10 + Math.random() * 14) + 's';
  el.style.animationDelay = (Math.random() * 14) + 's';
  pWrap.appendChild(el);
}

/* ── Pixel Animation Grid Intro ── */
const GLYPHS = {
  I: [[0,1,0],[0,1,0],[0,1,0],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
  L: [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
  O: [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
  V: [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0]],
  E: [[1,1,1],[1,0,0],[1,0,0],[1,1,0],[1,0,0],[1,0,0],[1,1,1]],
  U: [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
};
const WORDS = ['I', 'LOVE', 'U'];
const COL_STEP = 55, ROW_STEP = 25, WORD_PAUSE = 160;
const intro = document.getElementById('intro');
let globalCol = 0, lastDelay = 0;

WORDS.forEach((word, wi) => {
  if (wi > 0) {
    const gap = document.createElement('div');
    gap.style.cssText = 'height:16px;width:100%;flex-shrink:0;';
    intro.appendChild(gap);
  }
  
  const glyphCols = [];
  let firstChar = true;
  
  for (const ch of word) {
    const g = GLYPHS[ch];
    if (!firstChar) glyphCols.push(Array(7).fill(false));
    const numCols = g[0].length;
    for (let c = 0; c < numCols; c++) glyphCols.push(g.map(row => row[c] === 1));
    firstChar = false;
  }
  
  const wrap = document.createElement('div');
  wrap.className = 'word-wrap';
  intro.appendChild(wrap);
  
  const rowDivs = Array.from({ length: 7 }, () => {
    const d = document.createElement('div');
    d.className = 'px-row';
    wrap.appendChild(d);
    return d;
  });
  
  glyphCols.forEach((col, ci) => {
    col.forEach((filled, ri) => {
      const el = document.createElement('div');
      if (filled) {
        const delayMs = (globalCol * COL_STEP) + (ri * ROW_STEP) + (wi * WORD_PAUSE) + 120;
        el.className = 'px';
        el.style.animationDelay = `${delayMs}ms, ${delayMs + 450}ms`;
        lastDelay = Math.max(lastDelay, delayMs + 450);
      } else {
        el.className = 'empty';
      }
      rowDivs[ri].appendChild(el);
    });
    globalCol++;
  });
});

const holdMs = 1200;
setTimeout(() => {
  intro.style.transition = 'opacity 1s ease';
  intro.style.opacity = '0';
  setTimeout(() => {
    intro.style.display = 'none';
    document.getElementById('main').classList.add('show');
    initReveal();
  }, 1000);
}, lastDelay + holdMs);

/* ── Envelope Control Interactions ── */
function openEnvelope(e) {
  const env = document.getElementById('envelope');
  const letter = document.getElementById('letterCard');
  if (env.classList.contains('opening') || env.classList.contains('opened')) return;

  // Heart burst creation
  const emojiBurst = ['💗', '💕', '✨', '🌸', '💖', '🌷'];
  const rect = env.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  
  for (let i = 0; i < 10; i++) {
    const sp = document.createElement('div');
    sp.className = 'env-sparkle';
    sp.textContent = emojiBurst[Math.floor(Math.random() * emojiBurst.length)];
    const angle = (Math.PI * 2 * i / 10) + (Math.random() * 0.5);
    const dist1 = 30 + Math.random() * 50;
    const dist2 = 70 + Math.random() * 80;
    
    sp.style.cssText = `
      left: ${cx}px; top: ${cy}px; position: fixed;
      --tx: ${Math.cos(angle) * dist1}px;
      --ty: ${Math.sin(angle) * dist1 - 20}px;
      --tx2: ${Math.cos(angle) * dist2}px;
      --ty2: ${Math.sin(angle) * dist2 - 60}px;
      animation-delay: ${i * 0.04}s;
    `;
    document.body.appendChild(sp);
    setTimeout(() => sp.remove(), 900 + i * 40);
  }

  env.classList.add('opening');

  setTimeout(() => {
    env.classList.remove('opening');
    env.classList.add('opened');
    letter.classList.add('visible-letter');
  }, 650);
}

/* ── Scroll Intersection Observer (Reveal Effect) ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { 
        e.target.classList.add('visible'); 
        obs.unobserve(e.target); 
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => obs.observe(el));
}

/* ── Lightbox Systems ── */
function openLightbox(src) {
  document.getElementById('lbImg').src = src;
  document.getElementById('lightbox').classList.add('open');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

document.addEventListener('keydown', e => { 
  if (e.key === 'Escape') closeLightbox(); 
});

/* ── 3D Ellipse Dynamic Photos Carousel (Optimized Version) ── */
(function() {
  const PHOTOS = [
    { src: 'photos/photo1.png', caption: '🤍' },
    { src: 'photos/photo2.jpg', caption: '❤️' },
    { src: 'photos/photo3.jpg', caption: '🌷' },
    { src: 'photos/photo4.jpg', caption: '❤️' },
    { src: 'photos/photo5.jpg', caption: '🤍' },
    { src: 'photos/photo6.jpg', caption: '🌷' },
    { src: 'photos/photo7.jpg', caption: '🤍' },
    { src: 'photos/photo8.jpg', caption: '❤️' },
    { src: 'photos/photo9.jpg', caption: '🌷' },
    { src: 'photos/photo10.heic', caption: '❤️' },
    { src: 'photos/photo11.heic', caption: '🤍' },
    { src: 'photos/photo12.heic', caption: '🌷' },
  ];
  
  const N = PHOTOS.length;
  const scene = document.getElementById('carousel');
  const W = () => scene.offsetWidth;
  const RX = () => W() * 1; 
  const RY = 70; 
  const CX = () => W() / 2;
  const CY = 170; 

  let angle = 0; 
  let velX = 0;
  let dragging = false;
  let lastX = 0;
  let lastT = 0;
  let isMoving = false; // ตรวจสอบว่ามีการเคลื่อนที่จริงๆ ไหม เพื่อลดการประมวลผลไร้ประโยชน์

  // Card Node Injector
  const items = PHOTOS.map((p, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'carousel-item';
    // บังคับให้การ์ดใช้ GPU ในการเรนเดอร์ 3D ช่วยลดอาการแลค
    wrap.style.willChange = 'transform, opacity'; 

    const pol = document.createElement('div');
    pol.className = 'polaroid';

    const img = document.createElement('img');
    img.className = 'photo-frame';
    img.src = p.src; 
    img.alt = p.caption;
    img.loading = 'lazy'; // ช่วยให้โหลดรูปแบบค่อยเป็นค่อยไป ไม่แย่งแรมเครื่อง

    const cap = document.createElement('div');
    cap.className = 'caption';
    cap.textContent = p.caption;

    pol.appendChild(img); 
    pol.appendChild(cap);
    wrap.appendChild(pol);

    wrap.addEventListener('click', () => {
      if (Math.abs(velX) < 0.005) openLightbox(p.src);
    });

    scene.appendChild(wrap);
    return wrap;
  });

  // Spatial Positioning Engine
  function place() {
    const rx = RX();
    items.forEach((item, i) => {
      const theta = angle + (2 * Math.PI * i / N);
      const x = rx * Math.sin(theta);
      const y = CY - (scene.offsetHeight / 2) + RY * Math.cos(theta);

      const depth = (Math.cos(theta) + 1) / 2; 
      const scale = 0.5 + depth * 0.55; 
      const opacity = 0.35 + depth * 0.65;
      const zIndex = Math.round(depth * 100);

      // ใช้ translate3d แทน translate ปกติ เพื่อเปิดใช้ Hardware Acceleration ของการ์ดจอ
      item.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0) scale(${scale})`;
      item.style.opacity = opacity;
      item.style.zIndex = zIndex;

      item.classList.toggle('front-item', depth > 0.92);
    });
  }

  // Physics Loop
  function tick() {
    if (!dragging) {
      velX *= 0.92; // ปรับแรงเฉื่อยให้หยุดนุ่มนวลขึ้น
      if (Math.abs(velX) < 0.0001) {
        velX = 0;
        isMoving = false;
      }
    }
    
    if (dragging || isMoving || velX !== 0) {
      angle += velX;
      place();
    }
    requestAnimationFrame(tick);
  }
  tick();

  // Interaction State Handling
  function onStart(e) {
    dragging = true;
    isMoving = true;
    lastX = e.touches ? e.touches[0].clientX : e.clientX;
    lastT = performance.now();
    velX = 0;
  }
  
  function onMove(e) {
    if (!dragging) return;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const now = performance.now();
    const dt = now - lastT || 1;
    const dx = cx - lastX;
    
    // ปรับสเกลความเร็วในการลากให้เสถียรขึ้น ไม่กระตุกตามความแรงมือ
    velX = (dx / W()) * 2.2; 
    angle += velX;
    
    lastX = cx;
    lastT = now;
  }
  
  function onEnd() { 
    dragging = false; 
  }

  // Event Bindings
  scene.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove); // ย้ายมาผูกกับ window เพื่อให้ลากหลุดขอบแล้วไม่ค้าง
  window.addEventListener('mouseup', onEnd);
  scene.addEventListener('touchstart', onStart, { passive: true });
  scene.addEventListener('touchmove', onMove, { passive: true });
  scene.addEventListener('touchend', onEnd);
})();
