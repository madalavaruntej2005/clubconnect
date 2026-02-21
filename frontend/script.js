// =============================================
// ClubConnect — script.js
// Interactivity: counters, scroll, nav, reveal
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // ── Hamburger menu ────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close mobile menu when link clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // ── Active nav on scroll ──────────────────
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // ── Animated counters ─────────────────────
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = start.toLocaleString();
    }, 16);
  }

  // Use IntersectionObserver to trigger once in view
  const statsCard = document.getElementById('statsCard');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target, 10));
      });
    }
  }, { threshold: 0.5 });

  if (statsCard) counterObserver.observe(statsCard);

  // ── Scroll reveal for cards & rows ───────
  const revealTargets = document.querySelectorAll(
    '.skill-card, .club-card, .lb-row, .scroll-reveal'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay by index within parent
        const siblings = [...entry.target.parentElement.children];
        const index    = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 80}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  // ── Smooth CTA button effect (ripple) ────
  document.querySelectorAll('.btn-primary, .btn-secondary, .join-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute; width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(255,255,255,0.3); border-radius:50%;
        transform:scale(0); animation:ripple-anim 0.5s ease forwards;
        pointer-events:none;
      `;
      this.style.position = 'relative';
      this.style.overflow  = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-anim {
      to { transform: scale(3); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // ── Notification bell click ────────────────
  const notifBtn = document.getElementById('notifBtn');
  const notifDot = document.getElementById('notifDot');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      notifDot.style.display = notifDot.style.display === 'none' ? 'block' : 'none';
      alert('🔔 You have 3 new skill exchange requests!');
    });
  }

  // ── Hero badge text rotation ───────────────
  const badges = ['Now live at your college', '38 Active Clubs', '860 Skills & counting'];
  let badgeIndex = 0;
  const heroBadge = document.getElementById('heroBadge');
  if (heroBadge) {
    setInterval(() => {
      badgeIndex = (badgeIndex + 1) % badges.length;
      heroBadge.style.opacity = '0';
      setTimeout(() => {
        heroBadge.innerHTML = `<span class="badge-dot"></span> ${badges[badgeIndex]}`;
        heroBadge.style.opacity = '1';
      }, 300);
    }, 3500);
  }

  // ── Join club button feedback ──────────────
  document.querySelectorAll('.join-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (this.textContent === 'Joined ✓') {
        this.textContent = 'Join';
        this.style.background = 'var(--purple)';
      } else {
        this.textContent = 'Joined ✓';
        this.style.background = '#16a34a';
      }
    });
  });

  // ── Smooth scroll for anchor links ─────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  console.log('%cClubConnect 🚀', 'color:#7c3aed;font-size:22px;font-weight:800;');
  console.log('%cFrontend loaded. React app at http://localhost:5173', 'color:#16a34a;');
});
