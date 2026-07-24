/* ═══════════════════════════════════════════════════════
   FOREVER SISTER – BIRTHDAY WISHES
   Interactive Features & Animations
   Pure Vanilla JavaScript – No Dependencies
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════
  // CONFIGURATION
  // ═══════════════════════════════════════
  const CONFIG = {
    typing: { charSpeed: 55, lineDelay: 1200 },
    letter: { charSpeed: 35 },
    hearts: { interval: 700, max: 25 },
    balloons: { interval: 1100, max: 12 },
    flowers: { interval: 1400, max: 18 },
    sparkle: { throttle: 40 },
    confetti: { count: 180, staggerMs: 2500 },
    fireworks: { maxBursts: 12, interval: 1200, particles: 28 },
    carousel: { autoInterval: 3500, scrollAmount: 300 },
    colors: {
      sparkle: ['#ff4081', '#ffd700', '#e91e63', '#ff6f00', '#ab47bc', '#ff80ab'],
      confetti: ['#e91e63', '#ff4081', '#ffd700', '#4caf50', '#2196f3', '#ab47bc', '#ff6f00', '#ff80ab'],
      firework: ['#ff1744', '#f50057', '#d500f9', '#651fff', '#00e5ff', '#76ff03', '#ffd600', '#ff9100'],
      hearts: ['❤️', '💕', '💖', '💗', '💝', '💓'],
      flowers: ['🌸', '🌺', '🌹', '🌷', '💐', '🌼']
    }
  };

  // ═══════════════════════════════════════
  // DOM REFERENCES
  // ═══════════════════════════════════════
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const refs = {
    progressBar: $('#progress-bar'),
    loadingScreen: $('#loading-screen'),
    typingText: $('#typing-text'),
    letterText: $('#letter-text'),
    musicBtn: $('#music-btn'),
    modeBtn: $('#mode-btn'),
    confettiContainer: $('#confetti-container'),
    fireworksContainer: $('#fireworks-container'),
    carousel: $('#carousel'),
    carouselPrev: $('.carousel-prev'),
    carouselNext: $('.carousel-next'),
    cake: $('#birthday-cake'),
    heroContinueBtn: $('#hero-continue-btn'),
    startBtn: $('#start-btn'),
    replayBtn: $('#replay-btn'),
    lightbox: $('#lightbox'),
    lightboxClose: $('#lightbox-close'),
    lightboxImgContainer: $('#lightbox-img-container'),
    mouseSparkles: $('#mouseSparkles')
  };

  // ═══════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════
  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max + 1));
  const pick = (arr) => arr[randInt(0, arr.length - 1)];

  function throttle(fn, ms) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= ms) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  function debounce(fn, ms) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  // ═══════════════════════════════════════
  // 0. LOADING SCREEN
  // ═══════════════════════════════════════
  if (refs.loadingScreen) {
    setTimeout(() => {
      refs.loadingScreen.classList.add('hidden');
    }, 1200);
  }

  // ═══════════════════════════════════════
  // 1. SMOOTH SCROLL NAVIGATION
  // ═══════════════════════════════════════
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = $(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ═══════════════════════════════════════
  // 2. SCROLL PROGRESS BAR
  // ═══════════════════════════════════════
  function updateProgress() {
    if (!refs.progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    refs.progressBar.style.width = `${progress}%`;
  }
  window.addEventListener('scroll', throttle(updateProgress, 30), { passive: true });

  // ═══════════════════════════════════════
  // 3. SCROLL REVEAL (IntersectionObserver)
  // ═══════════════════════════════════════
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stagger children
        const children = entry.target.querySelectorAll('.reveal-child');
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('active'), i * 150);
        });
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  $$('.reveal').forEach(el => revealObserver.observe(el));

  // ═══════════════════════════════════════
  // 4. TYPING ANIMATION (Hero Section)
  // ═══════════════════════════════════════
  let heroTyped = false;

  function typeHeroText() {
    if (!refs.typingText || heroTyped) return;
    heroTyped = true;

    const lines = [
      "Every friendship has a story...",
      "Ours became a family.",
      "Happy Birthday ❤️"
    ];

    refs.typingText.innerHTML = '';
    let lineIdx = 0;

    function typeLine() {
      if (lineIdx >= lines.length) {
        // Show continue button
        if (refs.heroContinueBtn) {
          refs.heroContinueBtn.style.opacity = '1';
          refs.heroContinueBtn.style.pointerEvents = 'auto';
          refs.heroContinueBtn.style.transition = 'opacity 1s ease';
        }
        return;
      }

      const line = lines[lineIdx];
      const p = document.createElement('span');
      p.className = 'typing-line';
      if (lineIdx === lines.length - 1) {
        p.style.marginTop = '0.5rem';
        p.classList.add('gradient-text');
        p.style.fontSize = '120%';
      }
      refs.typingText.appendChild(p);

      // Add cursor
      const cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      p.appendChild(cursor);

      let charIdx = 0;

      function typeChar() {
        if (charIdx < line.length) {
          // Insert char before cursor
          const textNode = document.createTextNode(line[charIdx]);
          p.insertBefore(textNode, cursor);
          charIdx++;
          setTimeout(typeChar, CONFIG.typing.charSpeed);
        } else {
          // Remove cursor from this line
          cursor.remove();
          lineIdx++;
          setTimeout(typeLine, CONFIG.typing.lineDelay);
        }
      }

      typeChar();
    }

    typeLine();
  }

  // ═══════════════════════════════════════
  // 5. TYPEWRITER (Letter Section)
  // ═══════════════════════════════════════
  let letterTyped = false;

  function typeLetterText() {
    if (!refs.letterText || letterTyped) return;
    letterTyped = true;

    const sentences = [
      "Some people become family by birth.",
      "But a few beautiful souls become family by heart.",
      "You are one of those rare people.",
      "Thank you for every laugh.",
      "Thank you for every smile.",
      "Thank you for always being there.",
      "I don't need blood to call you my sister.",
      "My heart already did that long ago."
    ];

    refs.letterText.innerHTML = '';
    let sentIdx = 0;

    function typeSentence() {
      if (sentIdx >= sentences.length) {
        // Add blinking cursor at the end
        const cursor = document.createElement('span');
        cursor.className = 'letter-cursor';
        refs.letterText.appendChild(cursor);
        return;
      }

      const sentence = sentences[sentIdx];
      const p = document.createElement('p');
      p.className = 'typed-line';
      p.style.animationDelay = '0s';
      refs.letterText.appendChild(p);

      // Add cursor
      const cursor = document.createElement('span');
      cursor.className = 'letter-cursor';
      p.appendChild(cursor);

      let charIdx = 0;

      function typeChar() {
        if (charIdx < sentence.length) {
          const textNode = document.createTextNode(sentence[charIdx]);
          p.insertBefore(textNode, cursor);
          charIdx++;
          setTimeout(typeChar, CONFIG.letter.charSpeed);
        } else {
          cursor.remove();
          p.style.opacity = '1';
          p.style.transform = 'translateY(0)';
          sentIdx++;
          setTimeout(typeSentence, 400);
        }
      }

      // Trigger reveal animation
      requestAnimationFrame(() => {
        p.style.opacity = '1';
        p.style.transform = 'translateY(0)';
      });

      typeChar();
    }

    typeSentence();
  }

  // ═══════════════════════════════════════
  // 6. FLOATING HEARTS
  // ═══════════════════════════════════════
  const heartIntervals = new Map();

  function createHeart(container) {
    if (!container) return;
    const existing = container.querySelectorAll('.floating-heart');
    if (existing.length >= CONFIG.hearts.max) return;

    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = pick(CONFIG.colors.hearts);

    const size = rand(18, 36);
    const duration = rand(4, 8);
    const left = rand(2, 98);

    Object.assign(heart.style, {
      left: `${left}%`,
      bottom: '-40px',
      fontSize: `${size}px`,
      animation: `floatUp ${duration}s ease-out forwards`,
      opacity: '0.7'
    });

    container.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000);
  }

  function startHearts(section) {
    if (heartIntervals.has(section)) return;
    const id = setInterval(() => createHeart(section), CONFIG.hearts.interval);
    heartIntervals.set(section, id);
    // Create a few immediately
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createHeart(section), i * 200);
    }
  }

  function stopHearts(section) {
    if (heartIntervals.has(section)) {
      clearInterval(heartIntervals.get(section));
      heartIntervals.delete(section);
    }
  }

  // ═══════════════════════════════════════
  // 7. FLOATING BALLOONS
  // ═══════════════════════════════════════
  let balloonInterval = null;

  function createBalloon() {
    const homeSection = $('#home');
    if (!homeSection) return;
    if (homeSection.querySelectorAll('.balloon').length >= CONFIG.balloons.max) return;

    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.textContent = '🎈';

    const hue = rand(0, 360);
    const duration = rand(8, 14);

    Object.assign(balloon.style, {
      position: 'absolute',
      left: `${rand(5, 95)}%`,
      bottom: '-80px',
      fontSize: `${rand(35, 55)}px`,
      filter: `hue-rotate(${hue}deg)`,
      animation: `floatBalloon ${duration}s ease-in-out forwards`,
      pointerEvents: 'none',
      zIndex: '1'
    });

    homeSection.appendChild(balloon);
    setTimeout(() => balloon.remove(), duration * 1000);
  }

  function startBalloons() {
    if (!balloonInterval) {
      balloonInterval = setInterval(createBalloon, CONFIG.balloons.interval);
      createBalloon(); // Create one immediately
    }
  }

  function stopBalloons() {
    clearInterval(balloonInterval);
    balloonInterval = null;
  }

  // ═══════════════════════════════════════
  // 8. MOUSE SPARKLE TRAIL
  // ═══════════════════════════════════════
  const handleMouseSparkle = throttle((e) => {
    const sparkle = document.createElement('div');
    sparkle.className = 'mouse-sparkle';

    const size = rand(4, 12);
    const color = pick(CONFIG.colors.sparkle);
    const isEmoji = Math.random() > 0.6;

    if (isEmoji) {
      sparkle.textContent = '✨';
      sparkle.style.fontSize = `${size + 4}px`;
    } else {
      Object.assign(sparkle.style, {
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        boxShadow: `0 0 ${size}px ${color}`
      });
    }

    Object.assign(sparkle.style, {
      left: `${e.clientX}px`,
      top: `${e.clientY}px`,
      transition: 'all 0.6s ease-out'
    });

    (refs.mouseSparkles || document.body).appendChild(sparkle);

    requestAnimationFrame(() => {
      sparkle.style.transform = `translate(${rand(-30, 30)}px, ${rand(-30, 30)}px) scale(0)`;
      sparkle.style.opacity = '0';
    });

    setTimeout(() => sparkle.remove(), 650);
  }, CONFIG.sparkle.throttle);

  document.addEventListener('mousemove', handleMouseSparkle);

  // ═══════════════════════════════════════
  // 9. BACKGROUND MUSIC – Direct YouTube Iframe
  // ═══════════════════════════════════════
  const YT_VIDEO_ID = 'vWtWgL1-51w';
  const musicContainer = document.getElementById('music-player-container');
  let isMusicPlaying = false;
  let musicIframe = null;

  function createMusicIframe() {
    // Remove existing iframe if any
    if (musicIframe && musicIframe.parentNode) {
      musicIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.width = '320';
    iframe.height = '180';
    iframe.src = `https://www.youtube.com/embed/${YT_VIDEO_ID}?autoplay=1&loop=1&playlist=${YT_VIDEO_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`;
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; encrypted-media';
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.border = 'none';

    if (musicContainer) {
      musicContainer.appendChild(iframe);
    }

    musicIframe = iframe;
  }

  function destroyMusicIframe() {
    if (musicIframe && musicIframe.parentNode) {
      musicIframe.remove();
      musicIframe = null;
    }
  }

  // Auto-start music on first user interaction
  function onFirstInteraction() {
    if (isMusicPlaying) {
      removeFirstInteractionListeners();
      return;
    }
    createMusicIframe();
    isMusicPlaying = true;
    if (refs.musicBtn) {
      refs.musicBtn.textContent = '🎵';
      refs.musicBtn.classList.add('music-playing');
    }
    removeFirstInteractionListeners();
  }

  function removeFirstInteractionListeners() {
    ['click', 'touchstart', 'keydown'].forEach(evt => {
      document.removeEventListener(evt, onFirstInteraction, { capture: true });
    });
  }

  // Register first-interaction listeners (music starts on first click/touch/key)
  ['click', 'touchstart', 'keydown'].forEach(evt => {
    document.addEventListener(evt, onFirstInteraction, { capture: true, passive: true });
  });

  // Manual toggle via 🎵 button
  if (refs.musicBtn) {
    refs.musicBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent double-trigger with first-interaction listener

      if (!isMusicPlaying) {
        createMusicIframe();
        refs.musicBtn.textContent = '🎵';
        refs.musicBtn.classList.add('music-playing');
        isMusicPlaying = true;
      } else {
        destroyMusicIframe();
        refs.musicBtn.textContent = '🔇';
        refs.musicBtn.classList.remove('music-playing');
        isMusicPlaying = false;
      }
    });
  }

  // ═══════════════════════════════════════
  // 10. DARK / LIGHT MODE TOGGLE
  // ═══════════════════════════════════════
  if (refs.modeBtn) {
    // Load saved preference
    const savedMode = localStorage.getItem('birthday-theme');
    if (savedMode === 'light') {
      document.body.classList.add('light-mode');
      refs.modeBtn.textContent = '☀️';
    }

    refs.modeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      refs.modeBtn.textContent = isLight ? '☀️' : '🌙';
      localStorage.setItem('birthday-theme', isLight ? 'light' : 'dark');
    });
  }

  // ═══════════════════════════════════════
  // 11. CONFETTI (Finale)
  // ═══════════════════════════════════════
  let confettiTriggered = false;

  function triggerConfetti() {
    if (confettiTriggered || !refs.confettiContainer) return;
    confettiTriggered = true;

    for (let i = 0; i < CONFIG.confetti.count; i++) {
      setTimeout(() => {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';

        const size = rand(6, 14);
        const color = pick(CONFIG.colors.confetti);
        const isCircle = Math.random() > 0.5;
        const duration = rand(3, 6);
        const drift = rand(-120, 120);
        const rotation = rand(0, 720);

        Object.assign(piece.style, {
          width: `${size}px`,
          height: `${isCircle ? size : size * 0.6}px`,
          backgroundColor: color,
          borderRadius: isCircle ? '50%' : '2px',
          left: `${rand(0, 100)}%`,
          top: '-15px',
          boxShadow: `0 0 ${size/2}px ${color}`,
          animation: `confettiFall ${duration}s cubic-bezier(.25,.46,.45,.94) forwards`,
          animationDelay: `${rand(0, 0.5)}s`
        });

        // Use Web Animation API for the drift
        piece.animate([
          { transform: 'translateX(0) rotate(0deg)', opacity: 1 },
          { transform: `translateX(${drift}px) rotate(${rotation}deg)`, opacity: 0 }
        ], {
          duration: duration * 1000,
          easing: 'ease-out',
          fill: 'forwards'
        });

        refs.confettiContainer.appendChild(piece);
        setTimeout(() => piece.remove(), duration * 1000 + 500);
      }, rand(0, CONFIG.confetti.staggerMs));
    }
  }

  // ═══════════════════════════════════════
  // 12. FIREWORKS (Finale)
  // ═══════════════════════════════════════
  let fireworksTriggered = false;

  function triggerFireworks() {
    if (fireworksTriggered || !refs.fireworksContainer) return;
    fireworksTriggered = true;

    let bursts = 0;

    const fireworkTimer = setInterval(() => {
      if (bursts >= CONFIG.fireworks.maxBursts) {
        clearInterval(fireworkTimer);
        return;
      }
      bursts++;
      createFireworkBurst();
    }, CONFIG.fireworks.interval);

    // Fire one immediately
    createFireworkBurst();
  }

  function createFireworkBurst() {
    const x = rand(10, 90);
    const y = rand(10, 55);
    const baseColor = pick(CONFIG.colors.firework);

    for (let i = 0; i < CONFIG.fireworks.particles; i++) {
      const particle = document.createElement('div');
      particle.className = 'firework-particle';

      const particleSize = rand(3, 6);
      const angle = (Math.PI * 2 / CONFIG.fireworks.particles) * i + rand(-0.2, 0.2);
      const velocity = rand(30, 120);
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      const duration = rand(600, 1400);

      Object.assign(particle.style, {
        left: `${x}%`,
        top: `${y}%`,
        width: `${particleSize}px`,
        height: `${particleSize}px`,
        backgroundColor: baseColor,
        boxShadow: `0 0 ${particleSize * 2}px ${baseColor}, 0 0 ${particleSize * 4}px ${baseColor}`
      });

      refs.fireworksContainer.appendChild(particle);

      particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${vx}px, ${vy + 40}px) scale(0.1)`, opacity: 0 }
      ], {
        duration,
        easing: 'cubic-bezier(.25,.46,.45,.94)',
        fill: 'forwards'
      });

      setTimeout(() => particle.remove(), duration + 100);
    }
  }

  // ═══════════════════════════════════════
  // 13. PHOTO GALLERY
  // ═══════════════════════════════════════
  $$('.photo-card').forEach((card, index) => {
    // Stagger reveal
    card.style.transitionDelay = `${index * 0.15}s`;

    // Dynamic aspect ratio calculation based on original image dimensions
    const img = card.querySelector('img');
    if (img) {
      const adjustAspectRatio = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        if (ratio) {
          card.style.aspectRatio = ratio.toFixed(4);
          if (ratio > 1.2) {
            card.classList.add('landscape');
            card.classList.remove('portrait');
          } else {
            card.classList.add('portrait');
            card.classList.remove('landscape');
          }
        }
      };
      if (img.complete) {
        adjustAspectRatio();
      } else {
        img.addEventListener('load', adjustAspectRatio);
      }
    }

    // Hover effects
    card.addEventListener('mouseenter', () => {
      const rotation = rand(-4, 4);
      card.style.transform = `translateY(-10px) scale(1.05) rotate(${rotation}deg)`;
      card.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.zIndex = '';
    });

    // Lightbox (when real images are added)
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (!img || !refs.lightbox) return;

      refs.lightboxImgContainer.innerHTML = '';
      const clone = img.cloneNode();
      clone.style.maxWidth = '90vw';
      clone.style.maxHeight = '85vh';
      clone.style.borderRadius = '12px';
      clone.style.boxShadow = '0 0 40px rgba(255,255,255,0.1)';
      refs.lightboxImgContainer.appendChild(clone);
      refs.lightbox.classList.add('active');
    });
  });

  // Close lightbox
  if (refs.lightbox) {
    refs.lightbox.addEventListener('click', (e) => {
      if (e.target === refs.lightbox || e.target === refs.lightboxClose) {
        refs.lightbox.classList.remove('active');
      }
    });
  }

  // ═══════════════════════════════════════
  // 14. WISH CARDS – Shimmer Effect
  // ═══════════════════════════════════════
  $$('.wish-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.18}s`;

    // Create shimmer overlay
    const shimmer = document.createElement('div');
    shimmer.className = 'card-shimmer';
    Object.assign(shimmer.style, {
      animation: `shimmerSweep 4s infinite`,
      animationDelay: `${index * 0.8 + 2}s`
    });
    card.appendChild(shimmer);
  });

  // ═══════════════════════════════════════
  // 15. PHOTO CAROUSEL (Friends Section)
  // ═══════════════════════════════════════
  if (refs.carousel) {
    let autoScroll = null;
    let isPaused = false;

    // Dynamically adjust carousel card width to match image aspect ratios
    const carouselCards = refs.carousel.querySelectorAll('.carousel-card');
    carouselCards.forEach(card => {
      const img = card.querySelector('img');
      if (img) {
        const adjustCarouselWidth = () => {
          const ratio = img.naturalWidth / img.naturalHeight;
          if (ratio) {
            // Keep height fixed (370px), calculate width based on ratio
            // Clamp the width between 240px and 550px for UI consistency
            const calculatedWidth = Math.max(240, Math.min(550, 370 * ratio));
            card.style.flex = `0 0 ${calculatedWidth}px`;
          }
        };
        if (img.complete) {
          adjustCarouselWidth();
        } else {
          img.addEventListener('load', adjustCarouselWidth);
        }
      }
    });

    function scrollCarousel(direction) {
      // Use dynamic scroll amount based on average card width or config value
      const amount = direction * CONFIG.carousel.scrollAmount;
      refs.carousel.scrollBy({ left: amount, behavior: 'smooth' });

      // Loop around
      setTimeout(() => {
        if (direction > 0 && refs.carousel.scrollLeft + refs.carousel.clientWidth >= refs.carousel.scrollWidth - 10) {
          refs.carousel.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }, 400);
    }

    function startAutoScroll() {
      if (autoScroll) return;
      autoScroll = setInterval(() => {
        if (!isPaused) scrollCarousel(1);
      }, CONFIG.carousel.autoInterval);
    }

    function stopAutoScroll() {
      clearInterval(autoScroll);
      autoScroll = null;
    }

    startAutoScroll();

    refs.carousel.addEventListener('mouseenter', () => { isPaused = true; });
    refs.carousel.addEventListener('mouseleave', () => { isPaused = false; });

    if (refs.carouselPrev) {
      refs.carouselPrev.addEventListener('click', () => scrollCarousel(-1));
    }
    if (refs.carouselNext) {
      refs.carouselNext.addEventListener('click', () => scrollCarousel(1));
    }
  }

  // ═══════════════════════════════════════
  // 16. INTERACTIVE CANDLE BLOW (Finale)
  // ═══════════════════════════════════════
  let candlesBlown = false;
  let blownCount = 0;

  function createCandlePop(candle) {
    const rect = candle.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + window.scrollY;

    for (let i = 0; i < 8; i++) {
      const star = document.createElement('div');
      star.className = 'mouse-sparkle';
      star.textContent = pick(['⭐', '✨', '💖']);
      Object.assign(star.style, {
        position: 'absolute',
        left: `${cx}px`,
        top: `${cy}px`,
        fontSize: `${rand(10, 18)}px`,
        zIndex: '10000',
        pointerEvents: 'none',
        transition: 'all 0.6s ease-out'
      });
      document.body.appendChild(star);

      const angle = (Math.PI * 2 / 8) * i;
      const dist = rand(30, 60);

      requestAnimationFrame(() => {
        star.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`;
        star.style.opacity = '0';
      });

      setTimeout(() => star.remove(), 700);
    }
  }

  function triggerWishGranted() {
    const blowPrompt = document.getElementById('blow-prompt');
    const blowMessage = document.getElementById('blow-message');

    // Stop bouncing animation
    const cakeWrapper = document.querySelector('.cake-wrapper');
    if (cakeWrapper) {
      cakeWrapper.style.animation = 'none';
    }

    // Hide prompt, show wish granted
    if (blowPrompt) {
      blowPrompt.style.opacity = '0';
      blowPrompt.style.transition = 'opacity 0.5s ease';
    }

    if (blowMessage) {
      blowMessage.classList.remove('hidden');
      blowMessage.classList.add('visible');
    }

    // Huge sparkle burst from the cake!
    const rect = refs.cake.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2 + window.scrollY;

    for (let i = 0; i < 35; i++) {
      const star = document.createElement('div');
      star.className = 'mouse-sparkle';
      star.textContent = pick(['⭐', '✨', '🌟', '💫', '🎉', '🥳', '💖']);
      Object.assign(star.style, {
        position: 'absolute',
        left: `${cx}px`,
        top: `${cy}px`,
        fontSize: `${rand(14, 28)}px`,
        zIndex: '10000',
        pointerEvents: 'none',
        transition: 'all 1.2s ease-out'
      });
      document.body.appendChild(star);

      const angle = (Math.PI * 2 / 35) * i;
      const dist = rand(100, 240);

      requestAnimationFrame(() => {
        star.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`;
        star.style.opacity = '0';
      });

      setTimeout(() => star.remove(), 1300);
    }

    // Trigger extra confetti burst
    confettiTriggered = false;
    triggerConfetti();
  }

  // Attach individual click/touch listeners to each candle
  const candles = document.querySelectorAll('.candle');
  candles.forEach(candle => {
    // Add hover pop animation style dynamically
    candle.style.cursor = 'pointer';

    candle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (candlesBlown) return;

      const flame = candle.querySelector('.flame');
      if (flame && flame.classList.contains('lit')) {
        flame.classList.remove('lit');
        flame.classList.add('blown');

        // Add smoke puff
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        candle.appendChild(smoke);
        setTimeout(() => smoke.remove(), 1500);

        // Tactile sparkle pop around the candle
        createCandlePop(candle);

        blownCount++;

        // If all candles blown, trigger final celebration
        if (blownCount === candles.length) {
          candlesBlown = true;
          triggerWishGranted();
        }
      }
    });
  });

  // ═══════════════════════════════════════
  // 17. FALLING FLOWERS
  // ═══════════════════════════════════════
  const flowerIntervals = new Map();

  function createFlower(container) {
    if (!container) return;
    if (container.querySelectorAll('.falling-flower').length >= CONFIG.flowers.max) return;

    const flower = document.createElement('div');
    flower.className = 'falling-flower';
    flower.textContent = pick(CONFIG.colors.flowers);

    const duration = rand(6, 12);
    const driftDuration = rand(3, 5);

    Object.assign(flower.style, {
      left: `${rand(0, 100)}%`,
      top: '-40px',
      fontSize: `${rand(14, 28)}px`,
      animation: `fallDown ${duration}s linear forwards, driftSide ${driftDuration}s ease-in-out infinite alternate`
    });

    container.appendChild(flower);
    setTimeout(() => flower.remove(), duration * 1000);
  }

  function startFlowers(section) {
    if (flowerIntervals.has(section)) return;
    const id = setInterval(() => createFlower(section), CONFIG.flowers.interval);
    flowerIntervals.set(section, id);
    createFlower(section);
  }

  function stopFlowers(section) {
    if (flowerIntervals.has(section)) {
      clearInterval(flowerIntervals.get(section));
      flowerIntervals.delete(section);
    }
  }

  // ═══════════════════════════════════════
  // 18. PARTICLE BACKGROUND (Home)
  // ═══════════════════════════════════════
  const particlesContainer = $('#home-particles');
  if (particlesContainer) {
    for (let i = 0; i < 40; i++) {
      const dot = document.createElement('div');
      const size = rand(2, 5);

      Object.assign(dot.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: pick(['rgba(233,30,99,0.3)', 'rgba(255,215,0,0.3)', 'rgba(171,71,188,0.3)', 'rgba(255,255,255,0.15)']),
        left: `${rand(0, 100)}%`,
        top: `${rand(0, 100)}%`,
        animation: `float ${rand(5, 15)}s ease-in-out infinite`,
        animationDelay: `${rand(0, 5)}s`,
        boxShadow: `0 0 ${size * 2}px currentColor`
      });

      particlesContainer.appendChild(dot);
    }
  }

  // ═══════════════════════════════════════
  // 19. SECTION-SPECIFIC OBSERVERS
  // ═══════════════════════════════════════
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;

      if (entry.isIntersecting) {
        // ── Section entered viewport ──
        switch (id) {
          case 'home':
            startBalloons();
            startHearts(entry.target);
            break;
          case 'hero':
            typeHeroText();
            startHearts(entry.target);
            startFlowers(entry.target);
            break;
          case 'wishes':
            startFlowers(entry.target);
            break;
          case 'letter':
            typeLetterText();
            break;
          case 'finale':
            triggerConfetti();
            setTimeout(triggerFireworks, 800);
            startHearts(entry.target);
            break;
        }
      } else {
        // ── Section left viewport ──
        switch (id) {
          case 'home':
            stopBalloons();
            stopHearts(entry.target);
            break;
          case 'hero':
            stopHearts(entry.target);
            stopFlowers(entry.target);
            break;
          case 'wishes':
            stopFlowers(entry.target);
            break;
          case 'finale':
            stopHearts(entry.target);
            break;
        }
      }
    });
  }, { threshold: 0.2 });

  $$('section').forEach(sec => sectionObserver.observe(sec));

  // ═══════════════════════════════════════
  // 20. INITIAL SETUP
  // ═══════════════════════════════════════

  // Trigger initial progress update
  updateProgress();

  // Reveal home section elements immediately
  setTimeout(() => {
    $$('#home .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('active'), i * 200);
    });
  }, 1400); // After loading screen

  // Start balloons on home
  setTimeout(startBalloons, 1500);

  // Start hearts on home if visible
  const homeSection = $('#home');
  if (homeSection) {
    setTimeout(() => startHearts(homeSection), 1600);
  }

  // ═══════════════════════════════════════
  // REPLAY FUNCTIONALITY
  // ═══════════════════════════════════════
  if (refs.replayBtn) {
    refs.replayBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Reset typing animations
      heroTyped = false;
      letterTyped = false;
      confettiTriggered = false;
      fireworksTriggered = false;

      if (refs.typingText) refs.typingText.innerHTML = '';
      if (refs.letterText) refs.letterText.innerHTML = '';
      if (refs.heroContinueBtn) {
        refs.heroContinueBtn.style.opacity = '0';
        refs.heroContinueBtn.style.pointerEvents = 'none';
      }

      // Clear confetti/fireworks
      if (refs.confettiContainer) refs.confettiContainer.innerHTML = '';
      if (refs.fireworksContainer) refs.fireworksContainer.innerHTML = '';

      // Reset interactive candles
      candlesBlown = false;
      blownCount = 0;
      const flames = document.querySelectorAll('.flame');
      flames.forEach(flame => {
        flame.classList.remove('blown');
        flame.classList.add('lit');
      });
      const blowPrompt = document.getElementById('blow-prompt');
      const blowMessage = document.getElementById('blow-message');
      if (blowPrompt) {
        blowPrompt.style.opacity = '1';
      }
      if (blowMessage) {
        blowMessage.classList.remove('visible');
        blowMessage.classList.add('hidden');
      }
      if (refs.cake) {
        refs.cake.style.animation = 'cakeBounce 3s ease-in-out infinite';
      }

      // Re-observe sections for one-time triggers
      $$('section').forEach(sec => sectionObserver.observe(sec));

      // Reset reveal animations for re-triggering
      $$('.reveal:not(#home .reveal)').forEach(el => {
        el.classList.remove('active');
        revealObserver.observe(el);
      });

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ═══════════════════════════════════════
  // PERFORMANCE: Pause animations when tab hidden
  // ═══════════════════════════════════════
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopBalloons();
      heartIntervals.forEach((_, section) => stopHearts(section));
      flowerIntervals.forEach((_, section) => stopFlowers(section));
    }
  });

});
