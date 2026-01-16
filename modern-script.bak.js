// =============================================
//  CRACOE - PREMIUM UI/UX WITH ADVANCED GSAP
//  Best-in-class animations for 2025
// =============================================

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Update time in top bar
function updateTime() {
  const timeElement = document.getElementById('lux-time');
  if (timeElement) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeElement.textContent = `INR ${hours}:${minutes}:${seconds} GMT +5:30`;
  }
}

// Update time every second
setInterval(updateTime, 1000);
updateTime();

// Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose = document.getElementById('menuClose');

if (menuToggle && menuOverlay && menuClose) {
  menuToggle.addEventListener('click', () => {
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    lenis.stop(); // Stop scrolling when menu is open
  });

  menuClose.addEventListener('click', () => {
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
    lenis.start(); // Resume scrolling
  });

  // Close menu on link click
  const menuLinks = document.querySelectorAll('.menu-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
      lenis.start();
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
      menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
      lenis.start();
    }
  });
}

// News Slider Functionality
class NewsSlider {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.news-slide');
    this.dots = document.querySelectorAll('.slider-dots .dot');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.progressBar = document.querySelector('.progress-bar');
    this.autoPlayInterval = null;
    this.progressInterval = null;
    this.autoPlayDuration = 5000; // 5 seconds per slide

    if (this.slides.length > 0) {
      this.init();
    }
  }

  init() {
    // Set up event listeners
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Pause on hover
    const sliderContainer = document.querySelector('.news-slider');
    sliderContainer?.addEventListener('mouseenter', () => this.pauseAutoPlay());
    sliderContainer?.addEventListener('mouseleave', () => this.startAutoPlay());

    // Touch/swipe support
    this.addSwipeSupport();

    // Start autoplay
    this.startAutoPlay();
  }

  goToSlide(index) {
    // Remove active class from current slide and dot
    this.slides[this.currentSlide]?.classList.remove('active');
    this.dots[this.currentSlide]?.classList.remove('active');

    // Update current slide
    this.currentSlide = index;

    // Add active class to new slide and dot
    this.slides[this.currentSlide]?.classList.add('active');
    this.dots[this.currentSlide]?.classList.add('active');

    // Move slider track
    const sliderTrack = document.querySelector('.slider-track');
    if (sliderTrack) {
      sliderTrack.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }

    // Reset progress
    this.resetProgress();
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  startAutoPlay() {
    this.pauseAutoPlay(); // Clear any existing intervals

    // Start progress animation
    this.startProgress();

    // Auto advance slides
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDuration);
  }

  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }
  }

  startProgress() {
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
      let progress = 0;
      const increment = 100 / (this.autoPlayDuration / 50);

      this.progressInterval = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
          progress = 100;
        }
        this.progressBar.style.width = `${progress}%`;
      }, 50);
    }
  }

  resetProgress() {
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }
  }

  addSwipeSupport() {
    const sliderContainer = document.querySelector('.slider-container');
    if (!sliderContainer) return;

    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    };

    this.handleSwipe = handleSwipe;
  }
}

// Initialize slider
const newsSlider = new NewsSlider();

// Smooth scroll for anchor links (using Lenis)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      lenis.scrollTo(target);
    }
  });
});

// =============================================
//  UNIQUE HERO INTERACTIONS (Liquid Chrome)
// =============================================
const heroUnique = document.querySelector('.hero-unique');
if (heroUnique) {
  // 1. Mouse Parallax for Background
  heroUnique.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    // Move the pseudo-elements (background gradient)
    // We can't select pseudo-elements directly, so we use CSS variables or a target element
    // For this implementation, we'll shift the 'hero-noise' and 'chrome-sphere'

    gsap.to('.hero-noise', {
      x: x * 2,
      y: y * 2,
      duration: 1,
      ease: 'power2.out'
    });

    gsap.to('.chrome-sphere', {
      x: x * -1.5,
      y: y * -1.5,
      duration: 1.5,
      ease: 'power2.out'
    });
  });

  // 2. Scroll Melt Effect
  gsap.to('.hero-content-unique', {
    scrollTrigger: {
      trigger: '.hero-unique',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: -100,
    opacity: 0,
    filter: 'blur(20px)',
    scale: 0.9,
    ease: 'none'
  });
}


// =============================================
//  PARTICLE NETWORK CANVAS - Hero Background
// =============================================
const particleCanvas = document.getElementById('particle-canvas');
if (particleCanvas) {
  const ctx = particleCanvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Resize canvas
  const resize = () => {
    width = particleCanvas.width = window.innerWidth;
    height = particleCanvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction - attract
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 200) {
        const angle = Math.atan2(dy, dx);
        const force = (200 - dist) / 200;
        this.vx += Math.cos(angle) * force * 0.05;
        this.vy += Math.sin(angle) * force * 0.05;
      }

      // Friction
      this.vx *= 0.99;
      this.vy *= 0.99;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < 150; i++) {
    particles.push(new Particle());
  }

  // Track mouse
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animation loop
  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

// GSAP Animations
// Hero Title Reveal
gsap.from('.hero-title .title-line', {
  y: 100,
  opacity: 0,
  duration: 1.2,
  stagger: 0.2,
  ease: 'power4.out',
  delay: 0.5
});

// ---------------------------------------------
// Services Wave Slider Animation
// ---------------------------------------------
const servicesSection = document.querySelector('.services-wave-section');
const servicesTrack = document.querySelector('.services-track');

if (servicesSection && servicesTrack) {
  // Horizontal Scroll + Wave Motion
  const trackWidth = servicesTrack.scrollWidth;
  const windowWidth = window.innerWidth;
  const scrollAmount = trackWidth - windowWidth + (windowWidth * 0.2); // Add some padding

  if (window.innerWidth > 768) { // Only enable on desktop
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: servicesSection,
        pin: true,
        start: "top top",
        end: () => `+=${scrollAmount}`,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });

    // Horizontal Move
    tl.to(servicesTrack, {
      x: -scrollAmount,
      ease: "none"
    });

    // Wave Motion for Cards
    const cards = gsap.utils.toArray('.service-wave-card');
    cards.forEach((card, i) => {
      // Randomize phase for organic wave feel
      const speed = 1 + (i * 0.1);

      gsap.to(card, {
        y: 50,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 0.3
      });
    });
  }
}

// Fade in sections
const sections = document.querySelectorAll('.services-section, .impact-section, .team-section, .cta-section');
sections.forEach(section => {
  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: 'top 85%',
    },
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });
});

// Service Cards Stagger
const serviceCards = document.querySelectorAll('.service-card');
gsap.from(serviceCards, {
  scrollTrigger: {
    trigger: '.services-grid',
    start: 'top 80%',
  },
  y: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: 'power3.out'
});

// Floating cards animation
const floatingCards = document.querySelectorAll('.floating-card');
floatingCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.animationPlayState = 'paused';
  });

  card.addEventListener('mouseleave', () => {
    card.style.animationPlayState = 'running';
  });
});

// Counter animation for stats
const animateCounter = (element, target, duration = 2000) => {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
};

// Observe stats
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Get target from data attribute or text content
      const targetVal = entry.target.getAttribute('data-target') || entry.target.textContent;
      const number = parseInt(targetVal.replace(/\D/g, ''));

      if (number) {
        entry.target.textContent = '0';
        // Use the new decryption effect
        if (typeof decryptNumber === 'function') {
          decryptNumber(entry.target, number);
        } else {
          animateCounter(entry.target, number);
        }
      }
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
  statsObserver.observe(stat);
});

// Add loading class removal
window.addEventListener('load', () => {
  document.body.classList.remove('loading');
});

// Magnetic Cursor - DISABLED
// const cursor = document.createElement('div');
// cursor.className = 'custom-cursor';
// cursor.style.cssText = `
//   position: fixed;
//   width: 20px;
//   height: 20px;
//   border-radius: 50%;
//   background: rgba(59, 130, 246, 0.5);
//   pointer-events: none;
//   z-index: 9999;
//   mix-blend-mode: difference;
//   transition: transform 0.2s ease, width 0.3s ease, height 0.3s ease;
//   display: none;
//   left: 0;
//   top: 0;
// `;

// document.body.appendChild(cursor);

// let mouseX = 0;
// let mouseY = 0;
// let cursorX = 0;
// let cursorY = 0;

// document.addEventListener('mousemove', (e) => {
//   mouseX = e.clientX;
//   mouseY = e.clientY;
// });

// function animateCursor() {
//   const dx = mouseX - cursorX;
//   const dy = mouseY - cursorY;

//   cursorX += dx * 0.15; // Increased responsiveness
//   cursorY += dy * 0.15;

//   cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;

//   requestAnimationFrame(animateCursor);
// }

// Only show custom cursor on desktop
// if (window.innerWidth > 1024) {
//   cursor.style.display = 'block';
//   animateCursor();
// }

// Interactive hover effects for buttons - DISABLED (cursor removed)
// const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .service-link, .btn-link, a');
// buttons.forEach(button => {
//   button.addEventListener('mouseenter', () => {
//     cursor.style.width = '50px';
//     cursor.style.height = '50px';
//     cursor.style.transform = `translate(${cursorX - 25}px, ${cursorY - 25}px)`;
//     cursor.style.background = 'rgba(59, 130, 246, 0.2)';
//   });

//   button.addEventListener('mouseleave', () => {
//     cursor.style.width = '20px';
//     cursor.style.height = '20px';
//     cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
//     cursor.style.background = 'rgba(59, 130, 246, 0.5)';
//   });
// });

// Enhanced Service Card Interactions - Advanced Cinematic Effects
const allServiceCards = document.querySelectorAll('.service-card');
const servicesGrid = document.querySelector('.services-grid');

if (servicesGrid) {
  // Spotlight tracking for entire grid
  let spotlightX = 0;
  let spotlightY = 0;

  servicesGrid.addEventListener('mousemove', (e) => {
    const rect = servicesGrid.getBoundingClientRect();
    spotlightX = e.clientX - rect.left;
    spotlightY = e.clientY - rect.top;

    // Update spotlight position
    servicesGrid.style.setProperty('--spotlight-x', `${spotlightX}px`);
    servicesGrid.style.setProperty('--spotlight-y', `${spotlightY}px`);

    // Move the spotlight element
    const spotlight = servicesGrid.querySelector('::before');
    if (servicesGrid.classList.contains('spotlight-active')) {
      servicesGrid.style.setProperty('--spotlight-x', `${spotlightX}px`);
      servicesGrid.style.setProperty('--spotlight-y', `${spotlightY}px`);
    }
  });

  servicesGrid.addEventListener('mouseenter', () => {
    servicesGrid.classList.add('spotlight-active');
  });

  servicesGrid.addEventListener('mouseleave', () => {
    servicesGrid.classList.remove('spotlight-active');
  });

  // Enhanced interactions for each card
  allServiceCards.forEach(card => {
    let bounds = card.getBoundingClientRect();
    let currentRotateX = 0;
    let currentRotateY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let magneticX = 0;
    let magneticY = 0;
    let targetMagneticX = 0;
    let targetMagneticY = 0;
    let animationFrameId = null;
    let isHovering = false;

    // Update bounds on resize
    window.addEventListener('resize', () => {
      bounds = card.getBoundingClientRect();
    });

    function animate() {
      const lerpFactor = 0.1;

      // Smooth 3D rotation
      currentRotateX += (targetRotateX - currentRotateX) * lerpFactor;
      currentRotateY += (targetRotateY - currentRotateY) * lerpFactor;

      // Smooth magnetic pull
      magneticX += (targetMagneticX - magneticX) * lerpFactor;
      magneticY += (targetMagneticY - magneticY) * lerpFactor;

      if (Math.abs(targetRotateX - currentRotateX) > 0.01 ||
        Math.abs(targetRotateY - currentRotateY) > 0.01 ||
        Math.abs(targetMagneticX - magneticX) > 0.01 ||
        Math.abs(targetMagneticY - magneticY) > 0.01) {

        // Update CSS custom properties for 3D rotation
        card.style.setProperty('--rotate-x', `${currentRotateX}deg`);
        card.style.setProperty('--rotate-y', `${currentRotateY}deg`);

        // Apply magnetic offset (subtle pull towards cursor)
        card.style.transform = `translate(${magneticX}px, ${magneticY}px)`;

      } else if (!isHovering &&
        Math.abs(currentRotateX) < 0.01 &&
        Math.abs(currentRotateY) < 0.01 &&
        Math.abs(magneticX) < 0.01 &&
        Math.abs(magneticY) < 0.01) {
        // Stop animation when settled and not hovering
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    card.addEventListener('mouseenter', () => {
      servicesGrid.classList.add('has-hover');
      card.classList.add('is-hovered');
      isHovering = true;
      bounds = card.getBoundingClientRect(); // Refresh bounds
      if (!animationFrameId) animate();
    });

    card.addEventListener('mouseleave', () => {
      servicesGrid.classList.remove('has-hover');
      card.classList.remove('is-hovered');
      isHovering = false;

      // Reset targets
      targetRotateX = 0;
      targetRotateY = 0;
      targetMagneticX = 0;
      targetMagneticY = 0;

      // Reset CSS custom properties
      card.style.setProperty('--rotate-x', '0deg');
      card.style.setProperty('--rotate-y', '0deg');
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
      card.style.transform = 'translate(0, 0)';

      const glow = card.querySelector('.card-glow');
      if (glow) glow.style.opacity = '0';
    });

    // 3D Tilt Effect with Mouse Tracking + Magnetic Pull
    card.addEventListener('mousemove', (e) => {
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;

      // Calculate rotation (max 10 degrees for dramatic effect)
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;

      targetRotateX = ((y - centerY) / centerY) * -10;
      targetRotateY = ((x - centerX) / centerX) * 10;

      // Magnetic pull effect (subtle)
      const magneticStrength = 8;
      targetMagneticX = ((x - centerX) / centerX) * magneticStrength;
      targetMagneticY = ((y - centerY) / centerY) * magneticStrength;

      // Update CSS custom properties for mouse position (for gradients)
      const mouseXPercent = (x / bounds.width) * 100;
      const mouseYPercent = (y / bounds.height) * 100;
      card.style.setProperty('--mouse-x', `${mouseXPercent}%`);
      card.style.setProperty('--mouse-y', `${mouseYPercent}%`);

      // Move spotlight glow
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
        glow.style.opacity = '1';
      }
    });

    // Ripple effect on click
    card.addEventListener('click', (e) => {
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;

      // Create ripple element
      const ripple = document.createElement('div');
      ripple.className = 'card-ripple active';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = '10px';
      ripple.style.height = '10px';

      card.appendChild(ripple);

      // Remove after animation
      setTimeout(() => {
        ripple.remove();
      }, 800);
    });

    // Add glow element if it doesn't exist
    if (!card.querySelector('.card-glow')) {
      const glow = document.createElement('div');
      glow.className = 'card-glow';
      glow.style.cssText = `
        position: absolute;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        mix-blend-mode: overlay;
      `;
      card.appendChild(glow);
    }
  });
}

// Who We Are - Holographic Perception Animation
const whoWeAreSection = document.querySelector('.who-we-are-section');
if (whoWeAreSection) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: whoWeAreSection,
      start: 'top top',
      end: '+=300%', // Longer scroll for more steps
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onEnter: () => whoWeAreSection.classList.add('is-active'),
      onLeaveBack: () => whoWeAreSection.classList.remove('is-active')
    }
  });

  // 1. Expand the lens (Full Screen Fill) with Glitch Shake
  tl.to('.lens-mask', {
    clipPath: 'circle(150% at 50% 50%)',
    duration: 2,
    ease: 'power2.inOut'
  }, 0.5);

  // 2. Title Glitch & Scale
  tl.to('.lens-title-wrapper', {
    scale: 2,
    opacity: 0,
    duration: 1,
    ease: 'power2.in'
  }, 0.5);

  // 3. Holographic Grid Tilt
  tl.to('.holo-grid-bg', {
    rotateX: 0, // Flatten out
    scale: 1,
    opacity: 0.1,
    duration: 2
  }, 1);

  // 4. Parallax the image inside
  tl.fromTo('.lens-image',
    { scale: 1.4 },
    { scale: 1, duration: 2, ease: 'power2.out' },
    0.5
  );

  // 5. Materialize Cards (Digital Reveal)
  const cards = document.querySelectorAll('.float-card');
  cards.forEach((card, i) => {
    // Set initial state via JS ensuring they are ready to animate
    gsap.set(card, { clipPath: 'inset(0 100% 0 0)', opacity: 1 });

    tl.to(card, {
      clipPath: 'inset(0 0% 0 0)', // Swipe reveal
      y: 0,
      duration: 1,
      ease: 'power4.out'
    }, 1.5 + (i * 0.2));

    // Scramble Text Effect on headers (Custom)
    const headerText = card.querySelector('.scramble-text');
    if (headerText) {
      const originalText = headerText.textContent;
      const chars = 'XO01/>_[-';

      tl.to(headerText, {
        duration: 0.8,
        onUpdate: function () {
          const progress = this.progress();
          const len = originalText.length;
          const revealed = Math.floor(progress * len);
          let output = originalText.substring(0, revealed);

          // Add random chars for the rest
          for (let k = revealed; k < len; k++) {
            output += chars[Math.floor(Math.random() * chars.length)];
          }
          headerText.textContent = output;
        }
      }, 1.8 + (i * 0.2));
    }
  });

  // 6. HUD Circles Rotate faster
  tl.to('.hud-circle', {
    rotation: 360,
    duration: 3,
    ease: 'none'
  }, 0);
}

// CTA Magnetic Tilt
// CTA Magnetic Tilt with Smooth LERP
const ctaCard = document.querySelector('.cta-glass-card');
if (ctaCard) {
  let bounds = ctaCard.getBoundingClientRect();
  let currentRotateX = 0;
  let currentRotateY = 0;
  let targetRotateX = 0;
  let targetRotateY = 0;

  // Update bounds on resize
  window.addEventListener('resize', () => {
    bounds = ctaCard.getBoundingClientRect();
  });

  ctaCard.addEventListener('mousemove', (e) => {
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    targetRotateX = ((y - centerY) / centerY) * -10;
    targetRotateY = ((x - centerX) / centerX) * 10;
  });

  ctaCard.addEventListener('mouseleave', () => {
    targetRotateX = 0;
    targetRotateY = 0;
  });

  // Smooth animation loop
  function animateCard() {
    // Linear interpolation (LERP) for smoothness
    // formula: current = current + (target - current) * factor
    const lerpFactor = 0.1;

    currentRotateX += (targetRotateX - currentRotateX) * lerpFactor;
    currentRotateY += (targetRotateY - currentRotateY) * lerpFactor;

    // Only update DOM if changes are significant (performance)
    if (Math.abs(targetRotateX - currentRotateX) > 0.01 || Math.abs(targetRotateY - currentRotateY) > 0.01) {
      ctaCard.style.transform = `
        perspective(1000px) 
        rotateX(${currentRotateX}deg) 
        rotateY(${currentRotateY}deg) 
        scale3d(1.02, 1.02, 1.02)
      `;
    }

    requestAnimationFrame(animateCard);
  }

  animateCard();
}

// Cinematic Preloader
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  const counter = document.querySelector('.counter');
  const progressFill = document.querySelector('.progress-fill');

  if (!preloader) return;

  let count = 0;
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 5) + 1;
    if (count > 100) count = 100;

    counter.textContent = count < 10 ? `0${count}` : count;
    progressFill.style.width = `${count}%`;

    if (count === 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('loaded');
        // Trigger hero reveal after preloader
        gsap.from('.hero-title .title-line', {
          y: 100,
          opacity: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power4.out',
          delay: 0.5
        });
      }, 500);
    }
  }, 30);
}

// Digital Decryption Effect for Stats
function decryptNumber(element, finalNumber) {
  const chars = '0123456789$#%&X';
  let iterations = 0;
  const maxIterations = 20;

  const interval = setInterval(() => {
    element.textContent = finalNumber.toString().split('').map((char, index) => {
      if (index < iterations) {
        return finalNumber.toString()[index];
      }
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');

    if (iterations >= finalNumber.toString().length) {
      clearInterval(interval);
      element.textContent = finalNumber;
    }

    iterations += 1 / 3;
  }, 50);
}

// Override existing animateCounter
window.animateCounter = function (element, target) {
  decryptNumber(element, target);
};

// Liquid Distortion Effect
const liquidFilter = document.querySelector('#liquidFilter feTurbulence');
if (liquidFilter) {
  document.addEventListener('mousemove', (e) => {
    const freqX = 0.01 + (e.clientX / window.innerWidth) * 0.01;
    const freqY = 0.01 + (e.clientY / window.innerHeight) * 0.01;

    gsap.to(liquidFilter, {
      attr: { baseFrequency: `${freqX} ${freqY}` },
      duration: 1,
      ease: 'power2.out'
    });
  });
}

// Initialize
window.addEventListener('load', initPreloader);

// Kinetic Void CTA Animation
const kineticSection = document.querySelector('.cta-section.kinetic-void');
if (kineticSection) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: kineticSection,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });

  // Parallax text movement
  tl.to('.kinetic-title-row.row-1', { x: '-20%', ease: 'none' }, 0);
  tl.to('.kinetic-title-row.row-2', { x: '20%', ease: 'none' }, 0);

  // Button magnetic effect
  const voidBtn = document.querySelector('.void-button');
  if (voidBtn) {
    voidBtn.addEventListener('mousemove', (e) => {
      const rect = voidBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(voidBtn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to('.btn-text', {
        x: x * 0.1,
        y: y * 0.1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    voidBtn.addEventListener('mouseleave', () => {
      gsap.to([voidBtn, '.btn-text'], {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  }
}

// Neon Monolith Interaction
const monolithStage = document.querySelector('.monolith-stage');
const monolithWrapper = document.querySelector('.monolith-wrapper');
const monolithParticles = document.querySelector('.monolith-particles');

if (monolithStage && monolithWrapper) {
  monolithStage.addEventListener('mousemove', (e) => {
    const rect = monolithStage.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Subtle tilt
    const rotateX = (y / rect.height) * -15;
    const rotateY = (x / rect.width) * 15;

    monolithWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  monolithStage.addEventListener('mouseleave', () => {
    monolithWrapper.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  });
}

// Particle System for Monolith
if (monolithParticles) {
  setInterval(() => {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random properties
    const size = Math.random() * 4 + 1;
    const left = Math.random() * 100;
    const duration = Math.random() * 2 + 2;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.bottom = '0';
    particle.style.animationDuration = `${duration}s`;

    monolithParticles.appendChild(particle);

    // Cleanup
    setTimeout(() => {
      particle.remove();
    }, duration * 1000);
  }, 200);
}

// 3D Command Deck Parallax
const deckScene = document.querySelector('.deck-scene');
const deckContent = document.querySelector('.deck-content');

if (deckScene && deckContent) {
  deckScene.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;

    // Rotate the entire deck slightly
    gsap.to(deckContent, {
      rotationY: x * 10, // Look left/right
      rotationX: -y * 10, // Look up/down
      duration: 1,
      ease: 'power2.out'
    });
  });

  // Reset on leave
  deckScene.addEventListener('mouseleave', () => {
    gsap.to(deckContent, {
      rotationY: 0,
      rotationX: 0,
      duration: 1,
      ease: 'power2.out'
    });
  });
}

// Neural Nexus Canvas Animation
const neuralCanvas = document.getElementById('neural-canvas');
if (neuralCanvas) {
  const ctx = neuralCanvas.getContext('2d');
  let width, height;
  let particles = [];

  // Resize
  const resize = () => {
    width = neuralCanvas.width = window.innerWidth;
    height = neuralCanvas.height = window.innerHeight; // Full height of section
  };
  window.addEventListener('resize', resize);
  resize();

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction (repel)
      const dx = this.x - mouseX; // mouseX from global scope
      const dy = this.y - mouseY; // mouseY from global scope
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        const angle = Math.atan2(dy, dx);
        const force = (150 - dist) / 150;
        this.vx += Math.cos(angle) * force * 0.5;
        this.vy += Math.sin(angle) * force * 0.5;
      }

      // Center attraction (form the nexus)
      const centerX = width / 2;
      const centerY = height / 2;
      const dxCenter = centerX - this.x;
      const dyCenter = centerY - this.y;
      this.vx += dxCenter * 0.00005;
      this.vy += dyCenter * 0.00005;

      // Friction
      this.vx *= 0.98;
      this.vy *= 0.98;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.fill();
    }
  }

  // Init Particles
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  const animateNexus = () => {
    ctx.clearRect(0, 0, width, height);

    // Update and Draw Particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw Connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${1 - dist / 150})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(animateNexus);
  };

  animateNexus();
}

// Cybernetic HUD Boot Sequence
const hudSection = document.querySelector('.cyber-hud');
if (hudSection) {
  const hudContainer = document.querySelector('.hud-container');
  const hudBars = document.querySelectorAll('.bar-fill');

  // Initially hide
  gsap.set(hudContainer, { opacity: 0, scale: 0.9 });
  gsap.set(hudBars, { width: 0 });

  ScrollTrigger.create({
    trigger: hudSection,
    start: 'top 60%',
    onEnter: () => {
      // Boot up animation
      const tl = gsap.timeline();

      tl.to(hudContainer, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      })
        .to(hudBars, {
          width: (i, target) => target.style.width, // Animate to inline style width
          duration: 1.5,
          stagger: 0.2,
          ease: 'power2.out'
        }, '-=0.2');

      // Glitch effect on numbers
      const numbers = document.querySelectorAll('.hud-number, .hud-row-val');
      numbers.forEach(num => {
        const finalVal = parseInt(num.getAttribute('data-target') || '0');
        let currentVal = 0;

        const interval = setInterval(() => {
          currentVal += Math.ceil(finalVal / 20);
          if (currentVal >= finalVal) {
            currentVal = finalVal;
            clearInterval(interval);
          }
          // Random chars for "decryption" look
          num.innerText = Math.random() > 0.5 ? currentVal : String.fromCharCode(65 + Math.random() * 26) + currentVal;
          if (currentVal === finalVal) num.innerText = finalVal + (num.innerText.includes('%') ? '%' : '');
        }, 50);
      });
    }
  });
}

// Holographic News Feed Animation
const newsSection = document.querySelector('.holo-feed');
if (newsSection) {
  const newsCards = document.querySelectorAll('.news-card');

  gsap.fromTo(newsCards,
    {
      y: 100,
      opacity: 0,
      rotationX: 15
    },
    {
      y: 0,
      opacity: 1,
      rotationX: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: newsSection,
        start: 'top 70%',
      }
    }
  );
}



// =============================================
//  CINEMATIC HERO SECTION - Enhanced
// =============================================
const heroSection = document.querySelector('.hero-cinematic');
if (heroSection) {
  const title = document.querySelector('.hero-main-title');
  const subtitle = document.querySelector('.hero-cinematic p');
  const scrollIndicator = document.querySelector('.hero-scroll-indicator');
  const bgLayer = document.querySelector('.hero-bg-layer');

  // Initial cinematic reveal
  const heroTimeline = gsap.timeline({ delay: 0.3 });

  heroTimeline
    .from(title, {
      y: 120,
      opacity: 0,
      rotateX: 45,
      transformPerspective: 1000,
      duration: 1.8,
      ease: 'power4.out'
    })
    .from(subtitle, {
      opacity: 0,
      letterSpacing: '1em',
      filter: 'blur(20px)',
      duration: 1.5,
      ease: 'power3.out'
    }, '-=1.2')
    .from(scrollIndicator, {
      opacity: 0,
      y: -30,
      duration: 1,
      ease: 'power2.out'
    }, '-=0.8');

  // Smooth 3D mouse tilt effect
  let mouseXPos = 0;
  let mouseYPos = 0;
  let currentX = 0;
  let currentY = 0;

  heroSection.addEventListener('mousemove', (e) => {
    mouseXPos = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseYPos = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Smooth animation loop for tilt
  function animateHeroTilt() {
    currentX += (mouseXPos - currentX) * 0.05;
    currentY += (mouseYPos - currentY) * 0.05;

    if (title) {
      gsap.set(title, {
        rotationY: currentX * 8,
        rotationX: -currentY * 8,
        transformPerspective: 1000
      });
    }

    if (bgLayer) {
      gsap.set(bgLayer, {
        x: currentX * 30,
        y: currentY * 30
      });
    }

    requestAnimationFrame(animateHeroTilt);
  }
  animateHeroTilt();

  // Parallax on scroll
  gsap.to(bgLayer, {
    y: 300,
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  // Fade out hero content on scroll
  gsap.to([title, subtitle], {
    opacity: 0,
    y: -100,
    ease: 'power2.in',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: '50% top',
      scrub: 1
    }
  });
}

// 2. Horizontal Scroll with VELOCITY SKEW
const horizontalScrollSection = document.querySelector('.horizontal-scroll-section');
const horizontalTrack = document.querySelector('.horizontal-track');

if (horizontalScrollSection && horizontalTrack) {
  let getScrollAmount = () => -(horizontalTrack.scrollWidth - window.innerWidth);

  // Create the tween
  const tween = gsap.to(horizontalTrack, {
    x: getScrollAmount,
    ease: 'none',
  });

  // Main Pinning ScrollTrigger
  ScrollTrigger.create({
    trigger: horizontalScrollSection,
    start: 'top top',
    end: () => `+=${horizontalTrack.scrollWidth - window.innerWidth}`,
    pin: true,
    animation: tween,
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      // Skew based on velocity (self.getVelocity())
      const velocity = self.getVelocity();
      // Limit skew to prevent breaking
      const skewAmount = gsap.utils.clamp(-5, 5, velocity / 300);

      gsap.to(horizontalTrack, {
        skewX: skewAmount,
        overwrite: 'auto',
        duration: 0.1,
        ease: 'power1.out'
      });
    }
  });

  // Reset skew when stopped
  ScrollTrigger.addEventListener('scrollEnd', () => {
    gsap.to(horizontalTrack, { skewX: 0, duration: 0.3, ease: 'power2.out' });
  });
}

// 3. Cybernetic Impact - GLITCH DECRYPT COUNTERS
const impactSection = document.querySelector('.impact-sticky-section');
if (impactSection) {
  const stats = document.querySelectorAll('.impact-stat-item');
  const chars = 'ABCDEF1234567890!@#$%^&*()';

  // Animate container in
  gsap.from(stats, {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    scrollTrigger: {
      trigger: impactSection,
      start: 'center center',
    }
  });

  stats.forEach(stat => {
    const counter = stat.querySelector('.impact-count');
    const finalVal = +counter.getAttribute('data-target');

    // Glitch Logic
    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      once: true, // Only run once
      onEnter: () => {
        let iterations = 0;
        const interval = setInterval(() => {
          // Generate random glitch text
          counter.innerText = finalVal.toString().split('')
            .map((letter, index) => {
              if (index < iterations) return finalVal.toString()[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

          if (iterations >= finalVal.toString().length) {
            clearInterval(interval);
            counter.innerText = finalVal + (finalVal === 98 ? '%' : '+');
          }

          iterations += 1 / 4; // Speed of decode
        }, 30);
      }
    });
  });
}

// 4. Who We Are - Lens Effect with Easing
const lensContainer = document.querySelector('.lens-container');
if (lensContainer) {
  const lensMask = lensContainer.querySelector('.lens-mask');
  const lensContent = lensContainer.querySelector('.lens-content');

  // Smooth mouse follower
  const mouse = { x: 0, y: 0 };
  const pos = { x: 0, y: 0 };
  const speed = 0.1;

  lensContainer.addEventListener('mousemove', (e) => {
    const rect = lensContainer.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left - rect.width / 2);
    mouse.y = (e.clientY - rect.top - rect.height / 2);
  });

  lensContainer.addEventListener('mouseleave', () => {
    mouse.x = 0;
    mouse.y = 0;
  });

  // Animation Loop for smoothness
  gsap.ticker.add(() => {
    pos.x += (mouse.x - pos.x) * speed;
    pos.y += (mouse.y - pos.y) * speed;

    if (lensMask) {
      gsap.set(lensMask, { x: pos.x * 0.2, y: pos.y * 0.2 });
      gsap.set(lensContent, { x: pos.x * -0.1, y: pos.y * -0.1 }); // Parallax
    }
  });
}

console.log('🚀 CRACOE - ADVANCED ANIMATIONS ONLINE');


// =============================================
//  ADVANCED INTERACTIVITY (Phase 2 - 2025)
// =============================================

// 5. Magnetic Custom Cursor (DISABLED)
/*
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

const cursorDot = document.createElement('div');
cursorDot.classList.add('custom-cursor-dot');
document.body.appendChild(cursorDot);

const moveCursor = (e) => {
  // Smooth follow for outer ring
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.5,
    ease: 'power3.out'
  });
  // Instant follow for inner dot
  gsap.to(cursorDot, {
    x: e.clientX,
    y: e.clientY,
    duration: 0,
  });
};

window.addEventListener('mousemove', moveCursor);

// Hover states for cursor
const interactiveElements = document.querySelectorAll('a, button, .market-card');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor-hover');
    gsap.to(cursor, { scale: 1.5, duration: 0.3 });
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor-hover');
    gsap.to(cursor, { scale: 1, duration: 0.3 });
  });
});
*/


// =============================================
//  MARKET CARDS - 3D Tilt & Magnetic Effects
// =============================================
const marketCards = document.querySelectorAll('.market-card');

marketCards.forEach(card => {
  const cardInner = card.querySelector('.market-card-inner');
  const arrow = card.querySelector('.market-arrow');

  let bounds;
  let mouseX = 0;
  let mouseY = 0;

  card.addEventListener('mouseenter', () => {
    bounds = card.getBoundingClientRect();
    gsap.to(card, {
      scale: 1.02,
      duration: 0.4,
      ease: 'power2.out'
    });
  });

  card.addEventListener('mousemove', (e) => {
    if (!bounds) return;

    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    // Calculate center-relative position
    const xPct = (x / bounds.width - 0.5) * 2;
    const yPct = (y / bounds.height - 0.5) * 2;

    // 3D tilt
    gsap.to(cardInner, {
      rotationY: xPct * 12,
      rotationX: -yPct * 12,
      transformPerspective: 1000,
      duration: 0.4,
      ease: 'power2.out'
    });

    // Magnetic pull
    gsap.to(card, {
      x: xPct * 8,
      y: yPct * 8,
      duration: 0.4,
      ease: 'power2.out'
    });

    // Animate arrow
    gsap.to(arrow, {
      x: xPct * 10,
      y: yPct * 10,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(cardInner, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    });

    gsap.to(card, {
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    });

    gsap.to(arrow, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    });
  });
});

// Market section reveal
gsap.from(marketCards, {
  y: 100,
  opacity: 0,
  rotationX: 45,
  stagger: 0.15,
  duration: 1.2,
  ease: 'power4.out',
  scrollTrigger: {
    trigger: '.market-section',
    start: 'top 70%',
  }
});