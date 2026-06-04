/* ===== CIRCLEMATH — script.js ===== */

/* ---- PRELOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    initCounters();
    initProgressBars();
  }, 1200);
});

/* ---- NAVBAR ---- */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
}

/* ---- HERO CANVAS (floating particles) ---- */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '108,99,255' : '0,212,255';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  // Draw floating circles
  function drawCircles() {
    const circles = [
      { x: W * 0.15, y: H * 0.3, r: 60, color: '108,99,255', a: 0.06 },
      { x: W * 0.85, y: H * 0.6, r: 90, color: '0,212,255', a: 0.04 },
      { x: W * 0.5, y: H * 0.8, r: 40, color: '255,107,157', a: 0.05 },
    ];
    circles.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${c.color},${c.a * 3})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawCircles();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ---- TYPED TEXT ---- */
(function initTyped() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const texts = ['Lingkaran SMA/SMK', 'Keliling & Luas', 'Sudut & Busur', 'Persamaan Lingkaran'];
  let ti = 0, ci = 0, deleting = false;

  function type() {
    const current = texts[ti];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) { deleting = true; setTimeout(type, 2000); return; }
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) { deleting = false; ti = (ti + 1) % texts.length; }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  setTimeout(type, 800);
})();

/* ---- SCROLL REVEAL ---- */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
})();

/* ---- COUNTER ANIMATION ---- */
function initCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}

/* ---- PROGRESS BARS ---- */
function initProgressBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.pb-fill').forEach(bar => {
          const w = bar.dataset.width;
          setTimeout(() => { bar.style.width = w + '%'; }, 200);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  const section = document.querySelector('.dash-progress-section');
  if (section) observer.observe(section);
}

/* ---- TABS ---- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
    // Re-trigger reveal for newly shown content
    document.getElementById('tab-' + tab).querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => el.classList.add('visible'), 50);
    });
  });
});

/* ---- ACCORDION ---- */
document.querySelectorAll('.acc-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    const body = item.querySelector('.acc-body');
    const isOpen = item.classList.contains('open');
    // Close siblings
    const siblings = item.parentElement.querySelectorAll('.acc-item');
    siblings.forEach(sib => {
      sib.classList.remove('open');
      const b = sib.querySelector('.acc-body');
      if (b) b.style.display = 'none';
    });
    if (!isOpen) {
      item.classList.add('open');
      body.style.display = 'block';
    }
  });
});

/* ---- SOAL TOGGLE ---- */
document.querySelectorAll('.soal-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.soal-card');
    const answer = card.querySelector('.soal-answer');
    const isOpen = btn.classList.contains('open');
    btn.classList.toggle('open', !isOpen);
    answer.style.display = isOpen ? 'none' : 'block';
    btn.textContent = '';
    btn.innerHTML = isOpen
      ? 'Lihat Jawaban <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>'
      : 'Sembunyikan <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>';
  });
});

/* ---- CIRCLE VISUALIZER ---- */
(function initVisualizer() {
  const canvas = document.getElementById('circleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const slider = document.getElementById('radiusSlider');

  // Make canvas resolution match its CSS display size
  function resizeCanvas() {
    const area = canvas.parentElement;
    const size = Math.min(area.clientWidth - 24, 380);
    canvas.width = size;
    canvas.height = size;
    drawCircle(parseInt(slider.value));
  }
  window.addEventListener('resize', resizeCanvas);

  function drawCircle(r) {
    const W = canvas.width, H = canvas.height;
    // Scale radius so it fits within the canvas
    const maxR = Math.min(W, H) / 2 - 40;
    r = Math.round(r * maxR / 150);
    const cx = W / 2, cy = H / 2;
    ctx.clearRect(0, 0, W, H);

    // Background grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Glow fill
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, 'rgba(108,99,255,0.12)');
    grad.addColorStop(1, 'rgba(0,212,255,0.02)');
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Outer glow
    ctx.shadowColor = 'rgba(108,99,255,0.6)';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    const strokeGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    strokeGrad.addColorStop(0, '#6C63FF');
    strokeGrad.addColorStop(1, '#00D4FF');
    ctx.strokeStyle = strokeGrad;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Radius line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r, cy);
    ctx.strokeStyle = 'rgba(108,99,255,0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#6C63FF';
    ctx.shadowColor = 'rgba(108,99,255,0.8)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Radius label
    ctx.fillStyle = '#6C63FF';
    ctx.font = '600 13px Inter';
    ctx.fillText('r = ' + r, cx + r / 2 - 15, cy - 10);

    // Diameter label
    ctx.beginPath();
    ctx.moveTo(cx - r, cy + 20);
    ctx.lineTo(cx + r, cy + 20);
    ctx.strokeStyle = 'rgba(0,212,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#00D4FF';
    ctx.font = '600 12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('d = ' + (r * 2), cx, cy + 36);
    ctx.textAlign = 'left';
  }

  function updateValues(r) {
    const d = r * 2;
    const k = (2 * Math.PI * r).toFixed(2);
    const l = (Math.PI * r * r).toFixed(2);
    document.getElementById('radiusVal').textContent = r;
    document.getElementById('vRadius').textContent = r;
    document.getElementById('vDiameter').textContent = d;
    document.getElementById('vKeliling').textContent = k;
    document.getElementById('vLuas').textContent = l;
    document.getElementById('vfR').textContent = r;
    document.getElementById('vfR2').textContent = r;
    document.getElementById('vfK').textContent = '= ' + k;
    document.getElementById('vfL').textContent = '= ' + l;
  }

  slider.addEventListener('input', () => {
    const r = parseInt(slider.value);
    drawCircle(r);
    updateValues(r);
  });

  // Initial draw after layout settles
  setTimeout(resizeCanvas, 100);
})();

/* ---- KUIS DATA ---- */
const allQuestions = [
  {
    q: 'Sebuah lingkaran memiliki jari-jari 7 cm. Berapakah kelilingnya? (π = 22/7)',
    opts: ['44 cm', '22 cm', '154 cm', '88 cm'],
    ans: 0
  },
  {
    q: 'Luas lingkaran dengan diameter 14 cm adalah... (π = 22/7)',
    opts: ['154 cm²', '308 cm²', '44 cm²', '616 cm²'],
    ans: 0
  },
  {
    q: 'Jika keliling lingkaran = 88 cm, maka jari-jarinya adalah... (π = 22/7)',
    opts: ['14 cm', '7 cm', '28 cm', '21 cm'],
    ans: 0
  },
  {
    q: 'Sudut pusat AOB = 60°. Berapakah sudut keliling ACB yang menghadap busur yang sama?',
    opts: ['30°', '60°', '120°', '90°'],
    ans: 0
  },
  {
    q: 'Persamaan lingkaran dengan pusat O(0,0) dan jari-jari 5 adalah...',
    opts: ['x² + y² = 25', 'x² + y² = 5', '(x+5)² + (y+5)² = 25', 'x² + y² = 10'],
    ans: 0
  },
  {
    q: 'Bagian lingkaran yang dibatasi oleh dua jari-jari dan sebuah busur disebut...',
    opts: ['Juring', 'Tembereng', 'Apotema', 'Tali busur'],
    ans: 0
  },
  {
    q: 'Jarak terpendek dari pusat lingkaran ke tali busur disebut...',
    opts: ['Apotema', 'Jari-jari', 'Diameter', 'Busur'],
    ans: 0
  },
  {
    q: 'Panjang busur dengan sudut pusat 90° dan r = 14 cm adalah... (π = 22/7)',
    opts: ['22 cm', '44 cm', '88 cm', '11 cm'],
    ans: 0
  },
  {
    q: 'Persamaan lingkaran dengan pusat (2, -3) dan r = 4 adalah...',
    opts: ['(x-2)² + (y+3)² = 16', '(x+2)² + (y-3)² = 16', '(x-2)² + (y-3)² = 16', '(x+2)² + (y+3)² = 4'],
    ans: 0
  },
  {
    q: 'Luas juring dengan sudut pusat 120° dan r = 21 cm adalah... (π = 22/7)',
    opts: ['462 cm²', '231 cm²', '924 cm²', '154 cm²'],
    ans: 0
  }
];

// Shuffle helper
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---- KUIS ENGINE ---- */
let quizState = {
  questions: [],
  current: 0,
  score: 0,
  correct: 0,
  wrong: 0,
  timer: null,
  timeLeft: 15,
  answered: false
};

const startBtn = document.getElementById('startKuis');
const retryBtn = document.getElementById('retryKuis');

startBtn.addEventListener('click', startQuiz);
retryBtn.addEventListener('click', startQuiz);

function startQuiz() {
  quizState.questions = shuffle(allQuestions);
  quizState.current = 0;
  quizState.score = 0;
  quizState.correct = 0;
  quizState.wrong = 0;
  showScreen('kuisPlay');
  showQuestion();
}

function showScreen(id) {
  document.querySelectorAll('.kuis-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showQuestion() {
  const q = quizState.questions[quizState.current];
  quizState.answered = false;

  document.getElementById('qNum').textContent = 'Soal ' + (quizState.current + 1);
  document.getElementById('qTotal').textContent = quizState.questions.length;
  document.getElementById('questionText').textContent = q.q;

  // Progress bar
  const pct = (quizState.current / quizState.questions.length) * 100;
  document.getElementById('kuisProgressFill').style.width = pct + '%';

  // Options — shuffle display order but track correct
  const labels = ['A', 'B', 'C', 'D'];
  const indices = shuffle([0, 1, 2, 3]);
  const grid = document.getElementById('optionsGrid');
  grid.innerHTML = '';

  indices.forEach((origIdx, displayIdx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-label">${labels[displayIdx]}</span>${q.opts[origIdx]}`;
    btn.addEventListener('click', () => selectAnswer(btn, origIdx === q.ans, grid));
    grid.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  clearInterval(quizState.timer);
  quizState.timeLeft = 15;
  updateTimerUI(15);

  quizState.timer = setInterval(() => {
    quizState.timeLeft--;
    updateTimerUI(quizState.timeLeft);
    if (quizState.timeLeft <= 0) {
      clearInterval(quizState.timer);
      if (!quizState.answered) {
        quizState.wrong++;
        // Highlight correct answer
        highlightCorrect();
        setTimeout(nextQuestion, 1200);
      }
    }
  }, 1000);
}

function updateTimerUI(t) {
  document.getElementById('timerNum').textContent = t;
  const circle = document.getElementById('timerCircle');
  const pct = t / 15;
  circle.style.strokeDashoffset = 113 * (1 - pct);
  circle.style.stroke = t <= 5 ? '#ef4444' : 'url(#tr1)';
}

function selectAnswer(btn, isCorrect, grid) {
  if (quizState.answered) return;
  quizState.answered = true;
  clearInterval(quizState.timer);

  if (isCorrect) {
    btn.classList.add('correct');
    quizState.correct++;
    quizState.score += 10;
  } else {
    btn.classList.add('wrong');
    quizState.wrong++;
    highlightCorrect(grid);
  }

  // Disable all
  grid.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
  setTimeout(nextQuestion, 1200);
}

function highlightCorrect(grid) {
  if (!grid) grid = document.getElementById('optionsGrid');
  const q = quizState.questions[quizState.current];
  grid.querySelectorAll('.option-btn').forEach(btn => {
    if (btn.textContent.trim().slice(1) === q.opts[q.ans]) {
      btn.classList.add('correct');
    }
  });
}

function nextQuestion() {
  quizState.current++;
  if (quizState.current < quizState.questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  showScreen('kuisResult');
  const pct = Math.round((quizState.correct / quizState.questions.length) * 100);
  document.getElementById('finalScore').textContent = quizState.score;
  document.getElementById('rBenar').textContent = quizState.correct;
  document.getElementById('rSalah').textContent = quizState.wrong;
  document.getElementById('rPct').textContent = pct + '%';

  // Animate ring
  const ring = document.getElementById('resultRing');
  const offset = 314 * (1 - pct / 100);
  setTimeout(() => { ring.style.transition = 'stroke-dashoffset 1.2s ease'; ring.style.strokeDashoffset = offset; }, 100);

  // Title & motivasi
  let title, motivasi;
  if (pct >= 90) { title = '🏆 Luar Biasa!'; motivasi = 'Kamu menguasai materi lingkaran dengan sangat baik. Pertahankan!'; }
  else if (pct >= 70) { title = '🎉 Bagus Sekali!'; motivasi = 'Pemahaman kamu sudah baik. Sedikit lagi untuk sempurna!'; }
  else if (pct >= 50) { title = '👍 Cukup Baik!'; motivasi = 'Kamu sudah paham sebagian besar materi. Terus belajar ya!'; }
  else { title = '💪 Jangan Menyerah!'; motivasi = 'Pelajari kembali materinya dan coba lagi. Kamu pasti bisa!'; }

  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultMotivasi').textContent = motivasi;

  // Save to localStorage
  saveDashboard(quizState.score, pct);

  // Confetti for high score
  if (pct >= 80) launchConfetti();
}

/* ---- DASHBOARD ---- */
function saveDashboard(score, pct) {
  const data = JSON.parse(localStorage.getItem('circlemath') || '{"scores":[],"best":0,"total":0}');
  data.scores.push(score);
  data.total++;
  if (score > data.best) data.best = score;
  data.last = score;
  data.lastPct = pct;
  localStorage.setItem('circlemath', JSON.stringify(data));
  updateDashboardUI(data);
}

function updateDashboardUI(data) {
  if (!data) data = JSON.parse(localStorage.getItem('circlemath') || 'null');
  if (!data) return;
  const avg = data.scores.length ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length) : 0;
  document.getElementById('dashBest').textContent = data.best || '—';
  document.getElementById('dashLast').textContent = data.last || '—';
  document.getElementById('dashTotal').textContent = data.total || 0;
  document.getElementById('dashAvg').textContent = avg || '—';
}

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
  const data = JSON.parse(localStorage.getItem('circlemath') || 'null');
  if (data) updateDashboardUI(data);
});

/* ---- CONFETTI ---- */
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#6C63FF', '#00D4FF', '#FF6B9D', '#FFB347', '#22c55e', '#fff'];
  const pieces = [];

  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 4 + 2,
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 8,
      alpha: 1
    });
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vrot;
      if (frame > 120) p.alpha -= 0.015;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (frame < 200) requestAnimationFrame(draw);
    else { canvas.style.display = 'none'; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }
  draw();
}

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- RIPPLE EFFECT ---- */
document.querySelectorAll('.ripple').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;
      border-radius:50%;
      background:rgba(255,255,255,0.3);
      transform:scale(0);
      animation:rippleAnim 0.6s linear;
      left:${e.clientX - rect.left - 50}px;
      top:${e.clientY - rect.top - 50}px;
      width:100px; height:100px;
      pointer-events:none;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple keyframe dynamically
const style = document.createElement('style');
style.textContent = `@keyframes rippleAnim { to { transform: scale(4); opacity: 0; } }`;
document.head.appendChild(style);

/* ---- MOUSE PARALLAX on hero ---- */
document.addEventListener('mousemove', e => {
  const orbs = document.querySelectorAll('.hero-orb');
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 0.4;
    orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

/* ---- INIT OPEN ACCORDIONS ---- */
document.querySelectorAll('.acc-item.open .acc-body').forEach(b => { b.style.display = 'block'; });
