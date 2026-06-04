/* ═══════════════════════════════════════════════════════
   BIRTHDAY WEBSITE — SCRIPT.JS
   Premium animations, particles, balloons, confetti
═══════════════════════════════════════════════════════ */

'use strict';

/* ─── Preloader ─────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('hidden');
    // Burst confetti on load
    setTimeout(launchConfetti, 400);
  }, 2400);
});

/* ─── Birthday Date ──────────────────────────────────── */
const today = new Date();
// Fixed birthday: June 9, 2026
const birthdayFixed = new Date(2026, 5, 9); // Month is 0-indexed
document.getElementById('birthdayDate').textContent =
  birthdayFixed.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
document.getElementById('currentYear').textContent = today.getFullYear();

/* ─── Stars Background ────────────────────────────────── */
(function createStars() {
  const container = document.getElementById('starsContainer');
  for (let i = 0; i < 120; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const sz = Math.random() * 2.5 + 0.5;
    s.style.cssText = `
      width:${sz}px; height:${sz}px;
      top:${Math.random()*100}%;
      left:${Math.random()*100}%;
      --dur:${Math.random()*4+2}s;
      animation-delay:${Math.random()*5}s;
    `;
    container.appendChild(s);
  }
})();

/* ─── Balloons ────────────────────────────────────────── */
(function createBalloons() {
  const container = document.getElementById('balloonContainer');
  const colors = [
    'radial-gradient(circle at 35% 35%, #e8c97a, #9a7a2e)',
    'radial-gradient(circle at 35% 35%, #4a90d9, #1a4a90)',
    'radial-gradient(circle at 35% 35%, #c97ae8, #6a1a90)',
    'radial-gradient(circle at 35% 35%, #e87a7a, #901a1a)',
    'radial-gradient(circle at 35% 35%, #7ae8c9, #1a9060)',
    'radial-gradient(circle at 35% 35%, #fff, #ccc)',
  ];

  for (let i = 0; i < 22; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    const drift = (Math.random() - 0.5) * 200;
    b.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[i % colors.length]};
      width: ${Math.random()*24+40}px;
      height: ${Math.random()*24+52}px;
      animation-duration: ${Math.random()*12+10}s;
      animation-delay: ${Math.random()*12}s;
      --drift: ${drift}px;
    `;
    container.appendChild(b);
  }
})();

/* ─── Particle Canvas (glowing dots + lines) ──────────── */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticles() {
  particles = [];
  const count = Math.floor(W * H / 14000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 1.8 + 0.4,
      a:  Math.random(),
      gold: Math.random() > 0.65
    });
  }
}
createParticles();
window.addEventListener('resize', createParticles);

function drawParticles() {
  ctx.clearRect(0, 0, W, H);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.gold
      ? `rgba(201,168,76,${p.a * 0.7})`
      : `rgba(255,255,255,${p.a * 0.4})`;
    ctx.fill();

    // Connect nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        const alpha = (1 - dist / 110) * 0.08;
        ctx.strokeStyle = p.gold
          ? `rgba(201,168,76,${alpha})`
          : `rgba(255,255,255,${alpha * 0.6})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ─── Confetti System ─────────────────────────────────── */
const confettiColors = [
  '#c9a84c','#e8c97a','#ffffff','#4a90d9',
  '#c97ae8','#7ae8c9','#e87a7a','#f0d080'
];

let confettiPieces = [];
let confettiRunning = false;
let confettiCanvas, confettiCtx;

function initConfettiCanvas() {
  confettiCanvas = document.createElement('canvas');
  confettiCanvas.style.cssText =
    'position:fixed;inset:0;pointer-events:none;z-index:9998;';
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  document.body.appendChild(confettiCanvas);
  confettiCtx = confettiCanvas.getContext('2d');
  window.addEventListener('resize', () => {
    confettiCanvas.width  = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  });
}

function launchConfetti() {
  if (!confettiCanvas) initConfettiCanvas();
  confettiPieces = [];
  for (let i = 0; i < 180; i++) {
    confettiPieces.push({
      x:  Math.random() * window.innerWidth,
      y:  -Math.random() * window.innerHeight * 0.6 - 20,
      vx: (Math.random() - 0.5) * 5,
      vy: Math.random() * 4 + 2,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      alpha: 1,
      shape: Math.random() > 0.5 ? 'rect' : 'circle'
    });
  }
  if (!confettiRunning) animateConfetti();
}

function animateConfetti() {
  confettiRunning = true;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  let alive = false;

  for (const p of confettiPieces) {
    p.x  += p.vx;
    p.y  += p.vy;
    p.vy += 0.07; // gravity
    p.vx *= 0.99;
    p.rotation += p.rotSpeed;
    if (p.y < confettiCanvas.height + 20) {
      alive = true;
      confettiCtx.save();
      confettiCtx.globalAlpha = p.alpha;
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rotation * Math.PI / 180);
      confettiCtx.fillStyle = p.color;
      if (p.shape === 'rect') {
        confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        confettiCtx.beginPath();
        confettiCtx.arc(0, 0, p.w / 2.5, 0, Math.PI * 2);
        confettiCtx.fill();
      }
      confettiCtx.restore();
    }
  }

  if (alive) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

/* ─── Countdown Timer ────────────────────────────────── */
function updateCountdown() {
  const now      = new Date();
  const birthday = new Date(2026, 5, 9, 0, 0, 0); // June 9, 2026
  let diff = birthday - now;

  if (diff < 0) {
    // Birthday has arrived — count up from midnight of birthday
    const start   = new Date(2026, 5, 9, 0, 0, 0);
    diff          = now - start;
    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const mins    = Math.floor((diff % 3600000) / 60000);
    const secs    = Math.floor((diff % 60000) / 1000);
    const fmt = n => String(n).padStart(2, '0');
    document.getElementById('cd-days').textContent  = fmt(days);
    document.getElementById('cd-hours').textContent = fmt(hours);
    document.getElementById('cd-mins').textContent  = fmt(mins);
    document.getElementById('cd-secs').textContent  = fmt(secs);
    // Update label
    const label = document.querySelector('.section-title');
    if (label && label.closest('.countdown-section')) {
      label.textContent = '🎉 The Party Has Begun!';
    }
  } else {
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);
    const fmt = n => String(n).padStart(2, '0');
    document.getElementById('cd-days').textContent  = fmt(days);
    document.getElementById('cd-hours').textContent = fmt(hours);
    document.getElementById('cd-mins').textContent  = fmt(mins);
    document.getElementById('cd-secs').textContent  = fmt(secs);
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ─── Cake Candle Blow ────────────────────────────────── */
function blowCandles() {
  const flames = document.querySelectorAll('.flame');
  let allBlown = true;
  flames.forEach(f => { if (!f.classList.contains('blown')) allBlown = false; });
  if (allBlown) return;

  flames.forEach((f, i) => {
    setTimeout(() => {
      f.classList.add('blown');
    }, i * 120);
  });

  setTimeout(() => {
    document.getElementById('cakeMsg').classList.add('show');
    launchConfetti();
  }, flames.length * 120 + 400);
}

/* ─── Scroll-triggered Animations ───────────────────────── */
const observerOpts = { threshold: 0.15 };

function observeElements(selector, cls = 'visible') {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add(cls), delay);
        io.unobserve(el);
      }
    });
  }, observerOpts);

  document.querySelectorAll(selector).forEach(el => io.observe(el));
}

observeElements('.quality-card');
observeElements('.wish-card');
observeElements('.timeline-item');
observeElements('.fs-sticker-card');
observeElements('.fs-quote-card');

/* ─── Scroll Top Button ───────────────────────────────── */
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollBtn.classList.add('visible');
  } else {
    scrollBtn.classList.remove('visible');
  }
});

/* ─── Music — Web Audio API Birthday Melody ─────────────
   Plays a warm piano-style "Happy Birthday" tune.
   No external URLs — always works offline too!
──────────────────────────────────────────────────────── */
let audioCtx     = null;
let musicPlaying = false;
let musicNodes   = [];
let melodyTimer  = null;

const musicBtn   = document.getElementById('musicBtn');
const musicIcon  = document.getElementById('musicIcon');
const musicLabel = document.getElementById('musicLabel');

// Happy Birthday notes: [note_hz, duration_beats]
const HB_MELODY = [
  // "Hap-py birth-day to you"
  [261.63,0.75],[261.63,0.25],[293.66,1],[261.63,1],[349.23,1],[329.63,2],
  // "Hap-py birth-day to you"
  [261.63,0.75],[261.63,0.25],[293.66,1],[261.63,1],[392.00,1],[349.23,2],
  // "Hap-py birth-day dear Pa-pa"
  [261.63,0.75],[261.63,0.25],[523.25,1],[440.00,1],[349.23,1],[329.63,1],[293.66,2],
  // "Hap-py birth-day to you"
  [466.16,0.75],[466.16,0.25],[440.00,1],[349.23,1],[392.00,1],[349.23,3],
];

// Warm chords underneath
const CHORDS = [
  [261.63, 329.63, 392.00], // C maj
  [261.63, 329.63, 392.00],
  [293.66, 369.99, 440.00], // D min
  [261.63, 329.63, 392.00],
  [349.23, 440.00, 523.25], // F maj
  [392.00, 493.88, 587.33], // G maj
  [261.63, 329.63, 392.00],
];

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playNote(freq, startTime, duration, type = 'sine', gain = 0.18, decay = 0.85) {
  const osc     = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  const masterGain = audioCtx.createGain();

  // Soft filter for piano-like tone
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1800;
  filter.Q.value = 0.5;

  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(masterGain);
  masterGain.connect(audioCtx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  // Attack-decay-release envelope
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.03);
  gainNode.gain.exponentialRampToValueAtTime(gain * decay, startTime + duration * 0.7);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  masterGain.gain.value = 0.6;

  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);

  musicNodes.push(osc);
  return osc;
}

function playHarmonic(freq, startTime, duration, gain = 0.06) {
  // Add overtone for richer piano sound
  playNote(freq * 2, startTime, duration * 0.5, 'sine', gain * 0.4);
  playNote(freq * 3, startTime, duration * 0.4, 'sine', gain * 0.15);
}

function playMelody() {
  if (!audioCtx || !musicPlaying) return;

  const bpm      = 72;
  const beat     = 60 / bpm;
  let   time     = audioCtx.currentTime + 0.1;
  const totalDur = HB_MELODY.reduce((s, n) => s + n[1] * beat, 0);

  // Play melody notes
  HB_MELODY.forEach(([freq, beats]) => {
    const dur = beats * beat;
    playNote(freq, time, dur, 'sine', 0.22);
    playHarmonic(freq, time, dur);
    time += dur;
  });

  // Play soft chord backing
  let chordTime = audioCtx.currentTime + 0.1;
  CHORDS.forEach(chord => {
    chord.forEach(freq => {
      playNote(freq, chordTime, beat * 2, 'sine', 0.04);
    });
    chordTime += beat * 2;
  });

  // Loop melody
  melodyTimer = setTimeout(() => {
    if (musicPlaying) playMelody();
  }, (totalDur + 0.5) * 1000);
}

function stopMusic() {
  musicPlaying = false;
  clearTimeout(melodyTimer);
  musicNodes.forEach(n => { try { n.stop(); } catch(e) {} });
  musicNodes = [];
}

function toggleMusic() {
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  if (musicPlaying) {
    stopMusic();
    musicIcon.textContent  = '🎵';
    musicLabel.textContent = 'Play Music';
    musicBtn.classList.remove('playing');
  } else {
    musicPlaying = true;
    playMelody();
    musicIcon.textContent  = '🔇';
    musicLabel.textContent = 'Stop Music';
    musicBtn.classList.add('playing');
  }
}

// Remove old autoplay attempt references
let autoplayAttempted = false;
function attemptAutoplay() { /* disabled — user clicks the button */ }

/* ─── Smooth Scroll for nav link ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ─── Parallax glow orbs on mousemove ────────────────────── */
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  const orb1 = document.querySelector('.orb1');
  const orb2 = document.querySelector('.orb2');
  if (orb1) orb1.style.transform = `translateX(calc(-50% + ${x * 0.5}px)) translateY(${y * 0.5}px)`;
  if (orb2) orb2.style.transform = `translateX(${x}px) translateY(${y * 0.8}px)`;
});

/* ─── Floating rings gentle animation enhancement ────────── */
document.querySelectorAll('.floating-ring').forEach((ring, i) => {
  ring.style.animationDuration = `${8 + i * 2}s`;
});

/* ─── Gallery: Masonry click → Lightbox + Tilt ──────── */
const mgCaptions = [
  'Our Beautiful Memories ✨','A Thousand Words 💛','Together Always 🌟',
  'Cherished Moments 🏡','Pure Joy ☀️','Love & Laughter ❤️',
  'Golden Days 👑','Forever in My Heart 💫','My Greatest Blessing 🙏',
  'Strength & Grace 💪','My Hero 🛡️','Precious Times 🌅',
  'Adventures Together 🌄','Side by Side 🤝'
];

// Click to open lightbox
document.querySelectorAll('.mg-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (!img || item.classList.contains('mg-err')) return;
    const idx = parseInt(item.dataset.idx || 0);
    openLightbox(idx);
  });
});

// 3D tilt on mousemove
document.querySelectorAll('.mg-item').forEach(item => {
  item.addEventListener('mousemove', e => {
    const r   = item.getBoundingClientRect();
    const x   = (e.clientX - r.left) / r.width  - 0.5;
    const y   = (e.clientY - r.top)  / r.height - 0.5;
    item.style.transform = `translateY(-6px) scale(1.02) rotateY(${x*10}deg) rotateX(${-y*8}deg)`;
    item.style.transition = 'transform 0.1s ease';
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
    item.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1)';
  });
});

// Scroll reveal for gallery items
observeElements('.mg-item');

// Scroll animation for mg items
const mgObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0) scale(1)';
      }, parseInt(entry.target.dataset.idx || 0) * 80);
      mgObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.mg-item').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(40px) scale(0.95)';
  el.style.transition= 'opacity 0.6s ease, transform 0.6s ease';
  mgObserver.observe(el);
});

// Lightbox
let lbIndex   = 0;
const allImgs = () => [...document.querySelectorAll('.mg-item img')];

function openLightbox(idx) {
  lbIndex = idx;
  const imgs = allImgs();
  document.getElementById('lbImg').src = imgs[idx] ? imgs[idx].src : '';
  document.getElementById('lbCaption').textContent = mgCaptions[idx] || '';
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function lbNav(dir) {
  const imgs = allImgs();
  lbIndex = (lbIndex + dir + imgs.length) % imgs.length;
  document.getElementById('lbImg').src = imgs[lbIndex].src;
  document.getElementById('lbCaption').textContent = mgCaptions[lbIndex] || '';
}

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowRight') lbNav(1);
  if (e.key === 'ArrowLeft')  lbNav(-1);
});

function placeholderHTML(n) { return ''; } // kept for compatibility

/* ─── Typewriter effect for hero subtitle ───────────────── */
(function typewriterHero() {
  const el = document.querySelector('.hero-subtitle');
  if (!el) return;
  const text = el.innerHTML;
  el.innerHTML = '';
  el.style.opacity = '1';
  let i = 0;
  const timer = setInterval(() => {
    el.innerHTML = text.slice(0, i) + (i < text.length ? '<span style="border-right:2px solid rgba(201,168,76,0.7)">&nbsp;</span>' : '');
    i++;
    if (i > text.length) clearInterval(timer);
  }, 28);
  // Start after initial animation delay
  el.style.animationName = 'none';
  setTimeout(() => { el.style.opacity = '0'; }, 0);
  setTimeout(() => { el.style.opacity = '1'; }, 1800);
})();

/* ─── Periodic confetti bursts ───────────────────────────── */
setInterval(() => { launchConfetti(); }, 45000);

/* ════════════════════════════════════════════════════════
   🎆 CONTINUOUS FIREWORKS SYSTEM
════════════════════════════════════════════════════════ */
let fwCanvas, fwCtx;
let fireworks  = [];
let fwParticles = [];

function initFireworks() {
  fwCanvas = document.createElement('canvas');
  fwCanvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9997;';
  fwCanvas.width  = window.innerWidth;
  fwCanvas.height = window.innerHeight;
  document.body.appendChild(fwCanvas);
  fwCtx = fwCanvas.getContext('2d');
  window.addEventListener('resize', () => {
    fwCanvas.width  = window.innerWidth;
    fwCanvas.height = window.innerHeight;
  });
  animateFireworks();
  // Launch a new firework every 1.2 seconds continuously
  setInterval(launchFirework, 1200);
  // Extra burst every 4 seconds
  setInterval(() => {
    for (let i = 0; i < 3; i++) setTimeout(launchFirework, i * 300);
  }, 4000);
}

const fwColors = [
  '#FFD700','#FFA500','#FF6B6B','#4ECDC4','#45B7D1',
  '#96CEB4','#FFEAA7','#DDA0DD','#98FB98','#FFB6C1',
  '#c9a84c','#e8c97a','#ffffff','#87CEEB','#FF69B4'
];

function launchFirework() {
  const x = Math.random() * fwCanvas.width;
  const targetY = Math.random() * fwCanvas.height * 0.55 + 50;
  fireworks.push({
    x, y: fwCanvas.height,
    tx: x, ty: targetY,
    vx: (Math.random() - 0.5) * 2,
    vy: -(fwCanvas.height - targetY) / 40,
    color: fwColors[Math.floor(Math.random() * fwColors.length)],
    trail: [],
    done: false
  });
}

function explodeFirework(fw) {
  const count = Math.floor(Math.random() * 60) + 60;
  const style = Math.random();
  for (let i = 0; i < count; i++) {
    const angle  = (Math.PI * 2 / count) * i + Math.random() * 0.3;
    const speed  = Math.random() * 5 + 2;
    // Different explosion shapes
    const vx = style < 0.33
      ? Math.cos(angle) * speed                        // circle burst
      : style < 0.66
      ? Math.cos(angle) * speed * (Math.random() + 0.3) // star burst
      : (Math.random() - 0.5) * speed * 2;              // scatter

    const vy = style < 0.33
      ? Math.sin(angle) * speed
      : style < 0.66
      ? Math.sin(angle) * speed * (Math.random() + 0.3)
      : (Math.random() - 0.5) * speed * 2;

    fwParticles.push({
      x: fw.x, y: fw.y,
      vx, vy,
      alpha: 1,
      color: Math.random() > 0.3 ? fw.color : fwColors[Math.floor(Math.random()*fwColors.length)],
      r: Math.random() * 2.5 + 1,
      gravity: 0.06 + Math.random() * 0.04,
      tail: Math.random() > 0.5,
      sparkle: Math.random() > 0.6
    });
  }
  // Gold shimmer ring
  if (Math.random() > 0.4) {
    for (let i = 0; i < 20; i++) {
      const a = (Math.PI * 2 / 20) * i;
      fwParticles.push({
        x: fw.x, y: fw.y,
        vx: Math.cos(a) * 7,
        vy: Math.sin(a) * 7,
        alpha: 0.9,
        color: '#FFD700',
        r: 1.5, gravity: 0.05,
        tail: false, sparkle: true
      });
    }
  }
}

function animateFireworks() {
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

  // Draw rockets
  fireworks = fireworks.filter(fw => !fw.done);
  for (const fw of fireworks) {
    fw.trail.push({ x: fw.x, y: fw.y });
    if (fw.trail.length > 12) fw.trail.shift();

    // Draw trail
    for (let t = 0; t < fw.trail.length; t++) {
      const alpha = (t / fw.trail.length) * 0.5;
      fwCtx.beginPath();
      fwCtx.arc(fw.trail[t].x, fw.trail[t].y, 2, 0, Math.PI * 2);
      fwCtx.fillStyle = fw.color.replace(')', `,${alpha})`).replace('rgb','rgba').replace('#', 'rgba(').replace(/^rgba\(([0-9a-f]{6})\,/, (m, hex) => {
        const r = parseInt(hex.substr(0,2),16), g = parseInt(hex.substr(2,2),16), b = parseInt(hex.substr(4,2),16);
        return `rgba(${r},${g},${b},`;
      });
      // simpler: just use a preset
      fwCtx.fillStyle = `rgba(255,220,100,${alpha})`;
      fwCtx.fill();
    }

    // Move rocket
    fw.x += fw.vx; fw.y += fw.vy;

    // Bright head
    fwCtx.beginPath();
    fwCtx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
    fwCtx.fillStyle = '#fff';
    fwCtx.shadowColor = fw.color;
    fwCtx.shadowBlur  = 10;
    fwCtx.fill();
    fwCtx.shadowBlur  = 0;

    // Check if reached target
    if (fw.y <= fw.ty) {
      explodeFirework(fw);
      fw.done = true;
    }
  }

  // Draw explosion particles
  fwParticles = fwParticles.filter(p => p.alpha > 0.02);
  for (const p of fwParticles) {
    p.x     += p.vx;
    p.y     += p.vy;
    p.vy    += p.gravity;
    p.vx    *= 0.97;
    p.alpha -= p.sparkle ? 0.012 : 0.018;

    fwCtx.save();
    fwCtx.globalAlpha = Math.max(0, p.alpha);

    if (p.sparkle && Math.random() > 0.7) {
      // Draw sparkle star shape
      fwCtx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i;
        fwCtx.moveTo(p.x, p.y);
        fwCtx.lineTo(p.x + Math.cos(angle) * p.r * 3, p.y + Math.sin(angle) * p.r * 3);
      }
      fwCtx.strokeStyle = p.color;
      fwCtx.lineWidth   = 1;
      fwCtx.stroke();
    } else {
      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      fwCtx.fillStyle   = p.color;
      fwCtx.shadowColor = p.color;
      fwCtx.shadowBlur  = 4;
      fwCtx.fill();
    }
    fwCtx.restore();
  }

  requestAnimationFrame(animateFireworks);
}

// Start fireworks after preloader
setTimeout(initFireworks, 2800);

/* ════════════════════════════════════════════════════════
   🎈 FLOATING STICKERS (Father-Son + Party)
════════════════════════════════════════════════════════ */
(function createFloatingStickers() {
  const stickerEmojis = [
    // Father-Son
    '👨‍👦','👨‍👦‍👦','🤲','🙏','👑','🛡️','💪','❤️',
    // Party
    '🎉','🎊','🎈','🎆','🎇','🥂','🍰','🎂',
    // Love & warmth
    '💛','⭐','🌟','✨','💫','🎁','🎀','🎵',
    // Fun small ones
    '🌸','🌺','🍀','🦋','🕊️','☀️','🌙','💎'
  ];

  const container = document.createElement('div');
  container.id    = 'stickerContainer';
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:3;overflow:hidden;';
  document.body.appendChild(container);

  function spawnSticker() {
    const el   = document.createElement('div');
    const emoji = stickerEmojis[Math.floor(Math.random() * stickerEmojis.length)];
    const size  = Math.random() * 22 + 18; // 18–40px
    const left  = Math.random() * 98;
    const dur   = Math.random() * 14 + 12; // 12–26s
    const delay = Math.random() * 3;
    const drift = (Math.random() - 0.5) * 160;
    const spin  = Math.random() > 0.5 ? 360 : -360;

    el.textContent = emoji;
    el.style.cssText = `
      position: absolute;
      bottom: -60px;
      left: ${left}%;
      font-size: ${size}px;
      animation: stickerFloat ${dur}s ${delay}s linear forwards;
      --drift: ${drift}px;
      --spin:  ${spin}deg;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
      opacity: 0;
    `;
    container.appendChild(el);
    // Remove after animation
    setTimeout(() => el.remove(), (dur + delay) * 1000 + 500);
  }

  // Spawn stickers continuously
  for (let i = 0; i < 20; i++) setTimeout(spawnSticker, i * 800);
  setInterval(spawnSticker, 700);
})();

/* ════════════════════════════════════════════════════════
   🎊 PARTY STREAMERS (horizontal ribbons)
════════════════════════════════════════════════════════ */
(function createStreamers() {
  const container = document.createElement('div');
  container.id    = 'streamerContainer';
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2;overflow:hidden;';
  document.body.appendChild(container);

  const colors = ['#FFD700','#FF6B6B','#4ECDC4','#c97ae8','#98FB98','#FFB6C1','#e8c97a','#87CEEB'];

  function spawnStreamer() {
    const el    = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const w     = Math.random() * 60 + 30;
    const h     = Math.random() * 4 + 2;
    const top   = Math.random() * 100;
    const dur   = Math.random() * 6 + 5;
    const fromLeft = Math.random() > 0.5;

    el.style.cssText = `
      position: absolute;
      top: ${top}%;
      ${fromLeft ? 'left:-100px' : 'right:-100px'};
      width: ${w}px;
      height: ${h}px;
      background: ${color};
      border-radius: 2px;
      opacity: 0.7;
      animation: streamerFly ${dur}s linear forwards;
      --dir: ${fromLeft ? '110vw' : '-110vw'};
      transform: rotate(${(Math.random()-0.5)*30}deg);
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000 + 200);
  }

  // Start streamers after a short delay
  setTimeout(() => {
    for (let i = 0; i < 8; i++) setTimeout(spawnStreamer, i * 400);
    setInterval(spawnStreamer, 600);
  }, 3000);
})();

console.log('%c♛ Happy Birthday, Papa! ♛',
  'color: #c9a84c; font-size: 24px; font-family: serif; font-weight: bold; text-shadow: 0 0 10px gold;');
