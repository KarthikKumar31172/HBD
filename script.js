/* =============================================
   script.js — Birthday Website for Akhila 🎂
   ============================================= */

// ---- Confetti ----
const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');
confettiCanvas.width  = window.innerWidth;
confettiCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});

const COLORS = [
  '#f472b6', '#fb7185', '#a855f7', '#fbbf24',
  '#60a5fa', '#34d399', '#f59e0b', '#e879f9'
];

class ConfettiPiece {
  constructor() { this.reset(); }
  reset() {
    this.x      = Math.random() * confettiCanvas.width;
    this.y      = Math.random() * -confettiCanvas.height;
    this.size   = Math.random() * 10 + 5;
    this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.speed  = Math.random() * 2 + 1;
    this.angle  = Math.random() * Math.PI * 2;
    this.spin   = (Math.random() - 0.5) * 0.1;
    this.drift  = (Math.random() - 0.5) * 1.5;
    this.type   = Math.floor(Math.random() * 3); // 0=rect, 1=circle, 2=star
    this.opacity = Math.random() * 0.6 + 0.4;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    if (this.type === 0) {
      ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size * 0.6);
    } else if (this.type === 1) {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      drawStar(ctx, 0, 0, 5, this.size / 2, this.size / 4);
    }
    ctx.restore();
  }
  update() {
    this.y     += this.speed;
    this.x     += this.drift;
    this.angle += this.spin;
    if (this.y > confettiCanvas.height + 20) this.reset();
  }
}

function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();
  ctx.fill();
}

const confetti = Array.from({ length: 120 }, () => new ConfettiPiece());
let confettiActive = true;

function animateConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  if (confettiActive) {
    confetti.forEach(p => { p.update(); p.draw(); });
  }
  requestAnimationFrame(animateConfetti);
}
animateConfetti();

// ---- Floating Hearts ----
const heartsContainer = document.getElementById('heartsContainer');
const HEART_EMOJIS = ['💖','💕','💗','💓','💝','💞','✨','🌸','🌺','⭐','🦋'];

function spawnHeart() {
  const heart = document.createElement('span');
  heart.classList.add('heart-float');
  heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  heart.style.left    = Math.random() * 100 + 'vw';
  heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
  const dur = (Math.random() * 6 + 6).toFixed(1);
  heart.style.animationDuration  = dur + 's';
  heart.style.animationDelay     = (Math.random() * 2) + 's';
  heartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), (parseFloat(dur) + 2) * 1000);
}
setInterval(spawnHeart, 800);

// ---- Scroll Reveal ----
const revealEls = document.querySelectorAll(
  '.wish-card, .fact-card, .gallery-card, .wish-letter, .age-number, .age-tagline, .section-title, .section-desc'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

// ---- Counting Numbers ----
function animateCount(el, target, duration = 2000) {
  let start = null;
  const formatted = target > 9999
    ? v => Number(v).toLocaleString()
    : v => Math.floor(v);

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatted(target * eased);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = formatted(target);
  }
  requestAnimationFrame(step);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.fact-num').forEach(el => {
        animateCount(el, parseInt(el.dataset.target));
      });
      countObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

const ageReveal = document.getElementById('ageReveal');
if (ageReveal) countObserver.observe(ageReveal);

// ---- Candle Blowing ----
let blownCount = 0;
const totalCandles = 5;

function blowCandle(candle) {
  if (candle.classList.contains('blown')) return;
  candle.classList.add('blown');
  blownCount++;

  // mini burst of confetti
  burstConfetti(3);

  if (blownCount >= totalCandles) {
    setTimeout(() => {
      const popup = document.getElementById('wishPopup');
      popup.style.display = 'block';
      triggerBurst();
    }, 500);
  }
}

// ---- Confetti Burst ----
function burstConfetti(multiplier = 1) {
  confetti.forEach(p => {
    p.y     = Math.random() * confettiCanvas.height * 0.5;
    p.speed = (Math.random() * 4 + 2) * multiplier;
  });
}

function triggerBurst() {
  confettiActive = true;
  burstConfetti(2);
  spawnHeart(); spawnHeart(); spawnHeart();
  setTimeout(() => { /* let it keep going */ }, 5000);
}

// ---- YouTube IFrame Player Music ----
let ytPlayer = null;
let ytReady  = false;
musicPlaying = false;

const YOUTUBE_VIDEO_ID = 'w2kiivDgi_Y';
const musicBtn = document.getElementById('musicBtn');

// Called automatically by YouTube API when ready
window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('ytPlayer', {
    videoId: YOUTUBE_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      loop: 1,
      playlist: YOUTUBE_VIDEO_ID,
      modestbranding: 1,
      rel: 0,
      fs: 0,
      iv_load_policy: 3,
      disablekb: 1,
    },
    events: {
      onReady: (e) => {
        ytReady = true;
        e.target.setVolume(60);
        // If user already clicked, start immediately
        if (musicPlaying) e.target.playVideo();
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.PLAYING) {
          musicBtn.textContent = '🔊';
          musicBtn.classList.add('playing');
          musicPlaying = true;
        } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
          musicBtn.textContent = '🎵';
          musicBtn.classList.remove('playing');
        }
      }
    }
  });
};

function toggleMusic() {
  if (!ytReady) {
    // Player not loaded yet — show a gentle pulse
    musicBtn.style.animation = 'pulse-glow 0.5s ease 3';
    return;
  }
  const state = ytPlayer.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    ytPlayer.pauseVideo();
    musicBtn.textContent = '🎵';
    musicBtn.classList.remove('playing');
    musicPlaying = false;
  } else {
    ytPlayer.playVideo();
    musicBtn.textContent = '🔊';
    musicBtn.classList.add('playing');
    musicPlaying = true;
  }
}

// ---- Parallax on Hero ----
const heroBg = document.getElementById('heroBgImg');
window.addEventListener('scroll', () => {
  if (heroBg) {
    const scrollY = window.scrollY;
    heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.3}px)`;
  }
});

// ---- Dynamic Cursor Trail ----
const trailColors = ['#f472b6', '#a855f7', '#fbbf24', '#60a5fa'];
let trailIndex = 0;

document.addEventListener('mousemove', (e) => {
  const trail = document.createElement('div');
  trail.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    width: 8px;
    height: 8px;
    background: ${trailColors[trailIndex % trailColors.length]};
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    opacity: 0.8;
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
    animation: fadeTrail 0.6s ease forwards;
  `;
  document.body.appendChild(trail);
  trailIndex++;
  setTimeout(() => trail.remove(), 600);
});

// Add trail animation keyframe dynamically
const trailStyle = document.createElement('style');
trailStyle.textContent = `
  @keyframes fadeTrail {
    from { opacity: 0.8; transform: translate(-50%,-50%) scale(1); }
    to   { opacity: 0;   transform: translate(-50%,-50%) scale(0.1); }
  }
`;
document.head.appendChild(trailStyle);

// ---- Page Load Welcome Burst ----
window.addEventListener('load', () => {
  setTimeout(() => {
    burstConfetti(1.5);
    for (let i = 0; i < 5; i++) {
      setTimeout(spawnHeart, i * 200);
    }
  }, 500);
});

// ---- Photo Slideshow ----
let currentSlide = 0;
const totalSlides = 3;
let slideTimer = null;

function updateSlideshow() {
  document.querySelectorAll('.slide').forEach((s, i) => {
    s.classList.toggle('active', i === currentSlide);
  });
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function changeSlide(dir) {
  currentSlide = (currentSlide + dir + totalSlides) % totalSlides;
  updateSlideshow();
  resetSlideTimer();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlideshow();
  resetSlideTimer();
}

function resetSlideTimer() {
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(() => changeSlide(1), 4000);
}

// Auto-advance slideshow every 4 seconds
slideTimer = setInterval(() => changeSlide(1), 4000);

// Keyboard arrow support
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') changeSlide(1);
  if (e.key === 'ArrowLeft')  changeSlide(-1);
});

// Touch/swipe support for mobile
let touchStartX = 0;
const slideshowWrapper = document.getElementById('slideshowWrapper');
if (slideshowWrapper) {
  slideshowWrapper.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  slideshowWrapper.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) changeSlide(diff > 0 ? 1 : -1);
  }, { passive: true });
}

// ---- Auto-start music on first interaction ----
let musicStarted = false;
document.addEventListener('click', () => {
  if (!musicStarted && !musicPlaying && ytReady) {
    ytPlayer.playVideo();
    musicPlaying = true;
    musicStarted = true;
  }
}, { once: true });

// ---- Twinkling stars in age section ----
function createStarTwinkle() {
  const starsBg = document.querySelector('.stars-bg');
  if (!starsBg) return;
  const star = document.createElement('div');
  star.style.cssText = `
    position: absolute;
    width: ${Math.random() * 3 + 1}px;
    height: ${Math.random() * 3 + 1}px;
    background: white;
    border-radius: 50%;
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    opacity: 0;
    animation: twinkle ${Math.random() * 2 + 1}s ease-in-out infinite;
    animation-delay: ${Math.random() * 3}s;
  `;
  starsBg.appendChild(star);
}

const twinkleStyle = document.createElement('style');
twinkleStyle.textContent = `
  @keyframes twinkle {
    0%, 100% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 1; transform: scale(1.5); }
  }
`;
document.head.appendChild(twinkleStyle);

for (let i = 0; i < 60; i++) createStarTwinkle();
