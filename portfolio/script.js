/* ============================================================
   AI ENGINEER PORTFOLIO — script.js
   High-Aura Futuristic Interactive Experience
   Vanilla ES6+ · No Dependencies · Production-Ready
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================
     00. 3D/4D INTRO LOADER ENGINE
  ========================================================== */
  (() => {
    document.body.classList.add('loading');
    
    const wrapper = document.querySelector('#loader-wrapper');
    const bar = document.querySelector('#loaderProgressBar');
    const pct = document.querySelector('#loaderPercentage');
    const statusText = document.querySelector('#loaderStatus');
    
    if (!wrapper || !bar || !pct || !statusText) return;
    
    const statusLogs = [
      "Initializing neural networks...",
      "Loading AI agent workflows & LangGraph pipelines...",
      "Analyzing dataset schemas & vector coordinates...",
      "Setting up local SLM model benchmarks...",
      "Configuring interactive 3D elements...",
      "System online. Launching portfolio..."
    ];
    
    const duration = 5500; // 5.5 seconds
    const startTime = performance.now();
    
    const updateLoader = (now) => {
      const elapsed = now - startTime;
      const progress = clamp(elapsed / duration, 0, 1);
      
      const percent = Math.floor(progress * 100);
      bar.style.width = `${percent}%`;
      pct.textContent = `${percent}%`;
      
      if (percent < 15) {
        statusText.textContent = statusLogs[0];
      } else if (percent < 35) {
        statusText.textContent = statusLogs[1];
      } else if (percent < 55) {
        statusText.textContent = statusLogs[2];
      } else if (percent < 75) {
        statusText.textContent = statusLogs[3];
      } else if (percent < 90) {
        statusText.textContent = statusLogs[4];
      } else {
        statusText.textContent = statusLogs[5];
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateLoader);
      } else {
        // Loading complete!
        wrapper.classList.add('loaded');
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 150);
      }
    };
    
    requestAnimationFrame(updateLoader);
  })();

  /* ----------------------------------------------------------
     0. GLOBAL CONSTANTS & HELPERS
  ---------------------------------------------------------- */
  const CYAN = { r: 0, g: 240, b: 255 };

  /** Clamp a number between min and max */
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  /** Linear interpolation */
  const lerp = (a, b, t) => a + (b - a) * t;

  /** easeOutQuad easing — decelerating to zero velocity */
  const easeOutQuad = (t) => t * (2 - t);

  /** Detect coarse-pointer (touch-only) devices */
  const canHover = window.matchMedia('(hover: hover)').matches;

  /* ==========================================================
     1. NEURAL NETWORK PARTICLE SYSTEM (Canvas)
  ========================================================== */
  (() => {
    const canvas = document.querySelector('#particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const PARTICLE_COUNT = 120;
    const CONNECT_DIST = 150;      // px – max distance for connections
    const MOUSE_RADIUS = 200;      // px – cursor influence zone
    const MOUSE_STRENGTH = 0.02;   // attraction strength toward cursor

    let width, height;
    let mouse = { x: -9999, y: -9999, active: false };

    /** Resize canvas to fill the full viewport */
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    /* ---------- Particle class ---------- */
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = 1 + Math.random() * 2;                   // 1-3 px
        this.alpha = 0.3 + Math.random() * 0.5;                // 0.3-0.8
        this.vx = (Math.random() - 0.5) * 0.6;                // slow drift
        this.vy = (Math.random() - 0.5) * 0.6;
      }

      /** Move, wrap edges, react to mouse */
      update() {
        // Mouse attraction
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS && dist > 0) {
            this.vx += (dx / dist) * MOUSE_STRENGTH;
            this.vy += (dy / dist) * MOUSE_STRENGTH;
          }
        }

        // Gentle velocity damping to prevent runaway speeds
        this.vx *= 0.99;
        this.vy *= 0.99;

        this.x += this.vx;
        this.y += this.vy;

        // Edge wrapping
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CYAN.r},${CYAN.g},${CYAN.b},${this.alpha})`;
        ctx.fill();
      }
    }

    /* ---------- Create particle pool ---------- */
    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

    /* ---------- Draw connections ---------- */
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            // Base opacity fades with distance
            let opacity = 1 - dist / CONNECT_DIST;

            // Brighten connections near cursor
            if (mouse.active) {
              const midX = (a.x + b.x) / 2;
              const midY = (a.y + b.y) / 2;
              const mDist = Math.sqrt(
                (midX - mouse.x) ** 2 + (midY - mouse.y) ** 2
              );
              if (mDist < MOUSE_RADIUS) {
                opacity = clamp(opacity + (1 - mDist / MOUSE_RADIUS) * 0.5, 0, 1);
              }
            }

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${CYAN.r},${CYAN.g},${CYAN.b},${opacity * 0.35})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    /* ---------- Animation loop ---------- */
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawConnections();
      requestAnimationFrame(animate);
    };

    /* ---------- Mouse tracking ---------- */
    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    document.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    // Kick off
    animate();
  })();

  /* ==========================================================
     2. 3D CARD TILT EFFECT
  ========================================================== */
  (() => {
    if (!canHover) return; // Skip on touch devices

    const cards = document.querySelectorAll('.tilt-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;  // cursor X relative to card
        const y = e.clientY - rect.top;   // cursor Y relative to card
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Rotation: ±10 deg — note rotateX uses Y offset and vice versa
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transition = 'transform 0.1s ease-out';
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;

        // Dynamic light effect — radial gradient following cursor
        const pctX = ((x / rect.width) * 100).toFixed(1);
        const pctY = ((y / rect.height) * 100).toFixed(1);
        card.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(0,240,255,0.12) 0%, transparent 60%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s ease, background 0.5s ease';
        card.style.transform = 'none';
        card.style.background = '';
      });
    });
  })();

  /* ==========================================================
     3. SCROLL ANIMATIONS (Intersection Observer)
  ========================================================== */
  (() => {
    const targets = document.querySelectorAll('.fade-element, .slide-left, .slide-right');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;

            // Honour per-element stagger delay
            const delay = el.dataset.delay;
            if (delay) {
              el.style.transitionDelay = delay;
            }

            el.classList.add('animate-in');
            observer.unobserve(el); // Fire once
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => observer.observe(el));
  })();

  /* ==========================================================
     4. TYPING EFFECT
  ========================================================== */
  (() => {
    const el = document.querySelector('#typing-text');
    if (!el) return;

    const words = [
      'AI Engineer',
      'Data Scientist',
      'ML Architect',
      'Agent Builder',
      'RAG Specialist',
    ];

    const TYPE_SPEED = 80;     // ms per character (typing)
    const DELETE_SPEED = 40;   // ms per character (deleting)
    const PAUSE_AFTER = 2000;  // ms pause after full word
    const PAUSE_BEFORE = 500;  // ms pause before next word

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const tick = () => {
      const current = words[wordIndex];

      if (!isDeleting) {
        // Typing forward
        charIndex++;
        el.textContent = current.substring(0, charIndex);

        if (charIndex === current.length) {
          // Word complete — pause then start deleting
          isDeleting = true;
          setTimeout(tick, PAUSE_AFTER);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        // Deleting
        charIndex--;
        el.textContent = current.substring(0, charIndex);

        if (charIndex === 0) {
          // Deletion complete — move to next word
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(tick, PAUSE_BEFORE);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    };

    // Begin after loader finishes
    setTimeout(tick, 5800);
  })();

  /* ==========================================================
     5. ANIMATED COUNTERS
  ========================================================== */
  (() => {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const DURATION = 2000; // ms

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;

      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = clamp(elapsed / DURATION, 0, 1);
        const eased = easeOutQuad(progress);
        const value = Math.round(eased * target);

        el.textContent = `${value}+`;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => observer.observe(c));
  })();

  /* ==========================================================
     6. NAVBAR BEHAVIOR
  ========================================================== */
  (() => {
    const navbar = document.querySelector('#navbar');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    /* --- Scrolled state --- */
    const handleNavScroll = () => {
      if (!navbar) return;
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    /* --- Active link highlighting --- */
    const sections = Array.from(navLinks)
      .map((link) => {
        const id = link.getAttribute('href').substring(1);
        return document.getElementById(id);
      })
      .filter(Boolean);

    const highlightActiveLink = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;

      let currentSection = '';
      sections.forEach((section) => {
        if (section.offsetTop <= scrollPos) {
          currentSection = section.id;
        }
      });

      navLinks.forEach((link) => {
        const id = link.getAttribute('href').substring(1);
        if (id === currentSection) {
          link.classList.add('nav-active');
        } else {
          link.classList.remove('nav-active');
        }
      });
    };

    window.addEventListener('scroll', () => {
      handleNavScroll();
      highlightActiveLink();
    }, { passive: true });

    // Initial call
    handleNavScroll();
    highlightActiveLink();

    /* --- Hamburger toggle --- */
    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('nav-open');
      });
    }

    /* --- Smooth scroll & close mobile menu on link click --- */
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        // Close mobile menu
        if (navMenu) navMenu.classList.remove('nav-open');
      });
    });
  })();

  /* ==========================================================
     7. PROJECT FILTER
  ========================================================== */
  (() => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('[data-category]');
    if (!filterBtns.length || !projectCards.length) return;

    const TRANSITION_MS = 300;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach((card, i) => {
          const matches = filter === 'all' || card.dataset.category === filter;

          if (!matches) {
            // Hide with animation
            card.style.transition = `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`;
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
              card.style.display = 'none';
            }, TRANSITION_MS);
          } else {
            // Show with staggered animation
            card.style.display = '';
            // Force reflow so transition fires after display change
            void card.offsetHeight;
            const stagger = i * 60; // 60ms stagger per card
            card.style.transition = `opacity ${TRANSITION_MS}ms ease ${stagger}ms, transform ${TRANSITION_MS}ms ease ${stagger}ms`;
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }
        });
      });
    });
  })();

  /* ==========================================================
     8. MOUSE GLOW EFFECT ON SECTIONS
  ========================================================== */
  (() => {
    const glowSections = document.querySelectorAll('.glow-section');
    if (!glowSections.length) return;

    glowSections.forEach((section) => {
      section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        section.style.setProperty('--mouse-x', `${x}px`);
        section.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  })();

  /* ==========================================================
     9. SMOOTH SCROLL PROGRESS BAR
  ========================================================== */
  (() => {
    // Create progress bar if it doesn't exist
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.classList.add('scroll-progress');
      Object.assign(progressBar.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        height: '3px',
        width: '0%',
        background: 'linear-gradient(90deg, #00f0ff, #a855f7)',
        zIndex: '10000',
        transition: 'width 0.1s linear',
        pointerEvents: 'none',
      });
      document.body.prepend(progressBar);
    }

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${pct}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  })();

  /* ==========================================================
     10. PARALLAX FLOATING ELEMENTS
  ========================================================== */
  (() => {
    const shapes = document.querySelectorAll('.geo-shape');
    if (!shapes.length) return;

    const handleParallax = () => {
      const scrollY = window.scrollY;
      shapes.forEach((shape) => {
        const speed = parseFloat(shape.dataset.speed) || 0.05;
        const yOffset = scrollY * speed;
        shape.style.transform = `translateY(${yOffset}px)`;
      });
    };

    window.addEventListener('scroll', handleParallax, { passive: true });
    handleParallax();
  })();

  /* ==========================================================
     11. PAGE LOAD ANIMATION
  ========================================================== */
  (() => {
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 300);
  })();

  /* ==========================================================
     12. CONTACT FORM (Visual Feedback)
  ========================================================== */
  (() => {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Create success message overlay
      const msg = document.createElement('div');
      msg.classList.add('form-success');
      Object.assign(msg.style, {
        position: 'absolute',
        inset: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: 'rgba(10,10,30,0.95)',
        borderRadius: 'inherit',
        zIndex: '10',
        opacity: '0',
        transition: 'opacity 0.4s ease',
      });

      msg.innerHTML = `
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
             stroke="#00f0ff" stroke-width="2" stroke-linecap="round"
             stroke-linejoin="round" style="margin-bottom:16px;">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <p style="color:#00f0ff;font-size:1.2rem;font-weight:600;margin:0;">
          Message Sent Successfully!
        </p>
        <p style="color:rgba(255,255,255,0.6);font-size:0.9rem;margin-top:8px;">
          I'll get back to you soon.
        </p>
      `;

      // Ensure parent is positioned for absolute overlay
      form.style.position = 'relative';
      form.appendChild(msg);

      // Trigger fade-in
      requestAnimationFrame(() => {
        msg.style.opacity = '1';
      });

      // Remove overlay & reset form after 2.5s
      setTimeout(() => {
        msg.style.opacity = '0';
        setTimeout(() => {
          msg.remove();
          form.reset();
        }, 400);
      }, 2500);
    });
  })();

  /* ==========================================================
     13. FOOTER MINI PARTICLE CANVAS
  ========================================================== */
  (() => {
    const canvas = document.querySelector('#footer-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const PARTICLE_COUNT = 40;
    const CONNECT_DIST = 120;
    let width, height;

    const resize = () => {
      const footer = canvas.parentElement;
      width = canvas.width = footer.offsetWidth;
      height = canvas.height = footer.offsetHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class MiniParticle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = 1 + Math.random() * 1.5;
        this.alpha = 0.2 + Math.random() * 0.4;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${this.alpha})`;
        ctx.fill();
      }
    }

    const particles = Array.from({ length: PARTICLE_COUNT }, () => new MiniParticle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const opacity = (1 - dist / CONNECT_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  })();

  /* ==========================================================
     14. BACK TO TOP BUTTON
  ========================================================== */
  (() => {
    const btn = document.querySelector('#backToTop');
    if (!btn) return;

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  /* ==========================================================
     15. ABOUT 3D INTERACTIVE PARTICLE SPHERE
  ========================================================== */
  (() => {
    const canvas = document.querySelector('#about3DCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = 350;
    let height = canvas.height = 350;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width * (window.devicePixelRatio || 1);
      height = canvas.height = rect.height * (window.devicePixelRatio || 1);
    };

    window.addEventListener('resize', resize);
    resize();

    // 3D coordinates configuration
    const fov = 250;
    const radius = Math.min(width, height) * 0.18; // dynamic radius based on screen size
    const nodes = [];
    const nodeCount = 75;

    // Distribute points evenly on a 3D sphere surface using Fibonacci Spiral
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < nodeCount; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / nodeCount);
      
      nodes.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        px: 0, // projected 2D coordinates
        py: 0
      });
    }

    // Interactive tracking
    let rotateX = 0.003;
    let rotateY = 0.003;
    let currentRotateX = rotateX;
    let currentRotateY = rotateY;
    let targetRotateX = rotateX;
    let targetRotateY = rotateY;

    // Track mouse position over the canvas's parent
    const wrapper = canvas.parentElement;
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Map offset to rotation speed
      targetRotateX = y * 0.0001;
      targetRotateY = x * 0.0001;
    });

    wrapper.addEventListener('mouseleave', () => {
      targetRotateX = 0.003;
      targetRotateY = 0.003;
    });

    const animate = () => {
      // Ease rotation speeds towards target
      currentRotateX += (targetRotateX - currentRotateX) * 0.08;
      currentRotateY += (targetRotateY - currentRotateY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Rotate nodes in 3D space
      const cosX = Math.cos(currentRotateX);
      const sinX = Math.sin(currentRotateX);
      const cosY = Math.cos(currentRotateY);
      const sinY = Math.sin(currentRotateY);

      nodes.forEach(node => {
        // Rotate around Y axis
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.z * cosY + node.x * sinY;

        // Rotate around X axis
        let y2 = node.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.y * sinX;

        node.x = x1;
        node.y = y2;
        node.z = z2;

        // Projection
        const scale = fov / (fov + z2);
        node.px = node.x * scale + width / 2;
        node.py = node.y * scale + height / 2;
      });

      // Draw connections
      const maxConnectDistance = radius * 1.25;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];

          // 3D distance
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dz = n1.z - n2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxConnectDistance) {
            // Check average depth (z-index) for depth cue styling
            const avgZ = (n1.z + n2.z) / 2;
            const normalizedZ = (avgZ + radius) / (2 * radius); // 0 (front) to 1 (back)
            
            // Fading lines based on depth and distance
            const baseAlpha = 1 - (dist / maxConnectDistance);
            const depthAlpha = (1 - normalizedZ) * 0.6 + 0.1; // brighter in front, fainter in back
            const alpha = baseAlpha * depthAlpha;

            ctx.beginPath();
            ctx.moveTo(n1.px, n1.py);
            ctx.lineTo(n2.px, n2.py);

            // Interpolate color between cyan (front) and purple (back)
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.25})`;
            if (normalizedZ > 0.5) {
              ctx.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.25})`;
            }

            ctx.lineWidth = (1 - normalizedZ) * 1.2 + 0.3; // thicker lines in front
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(node => {
        const normalizedZ = (node.z + radius) / (2 * radius);
        const size = (1 - normalizedZ) * 4 + 1.5; // larger in front
        const alpha = (1 - normalizedZ) * 0.7 + 0.3;

        // Glowing node effect
        ctx.beginPath();
        ctx.arc(node.px, node.py, size, 0, Math.PI * 2);
        // Purple for back, cyan for front
        if (normalizedZ > 0.5) {
          ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
        }
        ctx.fill();

        // Node aura glow
        if (normalizedZ < 0.3) {
          ctx.beginPath();
          ctx.arc(node.px, node.py, size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.15})`;
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  })();

  /* ==========================================================
     16. EXPERIENCE SECTION 3D SCROLL EFFECT
  ========================================================== */
  (() => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;

    window.addEventListener('scroll', () => {
      const winHeight = window.innerHeight;

      timelineItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenterY = rect.top + rect.height / 2;
        const distFromCenter = itemCenterY - (winHeight / 2);
        
        let rotateX = -(distFromCenter / winHeight) * 20;
        rotateX = Math.max(-15, Math.min(15, rotateX));

        let scale = 1 - Math.abs(distFromCenter / winHeight) * 0.05;
        scale = Math.max(0.95, Math.min(1, scale));

        const content = item.querySelector('.timeline-content');
        if (content) {
          content.style.transform = `perspective(1000px) rotateX(${rotateX}deg) scale(${scale})`;
          content.style.transition = 'transform 0.1s ease-out';
        }
      });
    });
  })();

  /* ==========================================================
     17. PROJECT CARDS 3D SCROLL PARALLAX
  ========================================================== */
  (() => {
    const projectCards = document.querySelectorAll('.project-card');
    if (!projectCards.length) return;

    window.addEventListener('scroll', () => {
      const winHeight = window.innerHeight;

      projectCards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const cardCenterY = rect.top + rect.height / 2;
        const distFromCenter = cardCenterY - (winHeight / 2);

        // Alternating rotateY for left/right depth feel
        const direction = (i % 2 === 0) ? 1 : -1;
        let rotateY = direction * (distFromCenter / winHeight) * 8;
        rotateY = Math.max(-8, Math.min(8, rotateY));

        let translateZ = -Math.abs(distFromCenter / winHeight) * 30;
        translateZ = Math.max(-30, translateZ);

        card.style.transform = `perspective(1200px) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
        card.style.transition = 'transform 0.15s ease-out';
      });
    });
  })();

  /* ==========================================================
     18. SECTION TITLES PARALLAX FLOAT
  ========================================================== */
  (() => {
    const sectionTitles = document.querySelectorAll('.section-title');
    if (!sectionTitles.length) return;

    window.addEventListener('scroll', () => {
      const winHeight = window.innerHeight;

      sectionTitles.forEach(title => {
        const rect = title.getBoundingClientRect();
        const titleCenterY = rect.top + rect.height / 2;
        const progress = (titleCenterY - winHeight / 2) / winHeight;
        
        const translateY = progress * -15;
        const scale = 1 + Math.abs(progress) * 0.03;

        title.style.transform = `translateY(${translateY}px) scale(${Math.min(scale, 1.05)})`;
        title.style.transition = 'transform 0.2s ease-out';
      });
    });
  })();

  /* ==========================================================
     ✅  ALL SYSTEMS INITIALISED
  ========================================================== */
  console.log(
    '%c⚡ Portfolio Engine Online',
    'color:#00f0ff;font-size:14px;font-weight:bold;'
  );
});
