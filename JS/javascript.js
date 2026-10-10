/* =========================================================
   SIRAME — Script compartido
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menú móvil ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMobile?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Nav: sombra al hacer scroll ---------- */
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Resaltar enlace activo ---------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile a').forEach((link) => {
    const linkPath = (link.getAttribute('href') || '').split('#')[0];
    if (linkPath && linkPath === currentPath) {
      link.classList.add('is-active');
    }
  });

  /* ---------- Estado del equipo en la ficha (index) ---------- */
  const tagStatus = document.getElementById('tagStatus');
  const floatStatusText = document.getElementById('floatStatusText');

  if (tagStatus) {
    const estados = [
      { texto: 'Disponible', color: '--green' },
      { texto: 'En mantenimiento', color: '--gold' },
      { texto: 'En traslado', color: '--blue-gray' },
      { texto: 'Dañado', color: '--red' },
    ];
    let estadoIndex = 0;
    const rootStyles = getComputedStyle(document.documentElement);

    function actualizarEstado() {
      estadoIndex = (estadoIndex + 1) % estados.length;
      const estado = estados[estadoIndex];
      tagStatus.style.opacity = '0';
      if (floatStatusText) floatStatusText.textContent = `Actualizando: ${estado.texto}`;
      window.setTimeout(() => {
        tagStatus.textContent = estado.texto;
        tagStatus.style.color = rootStyles.getPropertyValue(estado.color).trim();
        tagStatus.style.opacity = '1';
      }, 250);
    }

    tagStatus.style.setProperty('transition', 'opacity .25s ease');
    window.setInterval(actualizarEstado, 3200);
  }

  /* ---------- Formulario: solicitar acceso ---------- */
  const accessForm = document.getElementById('accessForm');
  const accessCard = document.getElementById('accessCard');
  const accessConfirm = document.getElementById('accessConfirm');
  const accessConfirmText = document.getElementById('accessConfirmText');

  if (accessForm && accessCard && accessConfirm) {
    accessForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!accessForm.checkValidity()) {
        accessForm.reportValidity();
        return;
      }

      const nombre = accessForm.querySelector('#nombre').value.trim();
      const rol = accessForm.querySelector('#rol').value;
      const primerNombre = nombre.split(' ')[0] || '';

      if (accessConfirmText) {
        accessConfirmText.textContent = `Gracias${primerNombre ? ', ' + primerNombre : ''}. Recibimos tu solicitud para el rol de ${rol}. Administración se comunicará a tu correo institucional para habilitar tu acceso.`;
      }

      accessCard.classList.add('is-hidden');
      accessConfirm.classList.remove('is-hidden');
      accessConfirm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Formulario: contacto ---------- */
  const contactForm = document.getElementById('contactForm');
  const contactCard = document.getElementById('contactCard');
  const contactConfirm = document.getElementById('contactConfirm');
  const contactConfirmText = document.getElementById('contactConfirmText');

  if (contactForm && contactCard && contactConfirm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const nombre = contactForm.querySelector('#contactoNombre').value.trim();
      const primerNombre = nombre.split(' ')[0] || '';

      if (contactConfirmText) {
        contactConfirmText.textContent = `Gracias${primerNombre ? ', ' + primerNombre : ''}. Recibimos tu mensaje y te responderemos a la brevedad a tu correo.`;
      }

      contactCard.classList.add('is-hidden');
      contactConfirm.classList.remove('is-hidden');
      contactConfirm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Contadores animados ---------- */
  const statNumbers = document.querySelectorAll('.stat__number');

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && statNumbers.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    statNumbers.forEach((el) => observer.observe(el));
  } else {
    statNumbers.forEach((el) => { el.textContent = el.dataset.count; });
  }

  /* ---------- Revelar elementos al hacer scroll ---------- */
  const reveals = document.querySelectorAll('.module-card, .step-item, .price-card, .role-photo-card, .addon-card, .faq-item, .arch-layer');
  if ('IntersectionObserver' in window && reveals.length) {
    reveals.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity .6s cubic-bezier(0.22,1,0.36,1), transform .6s cubic-bezier(0.22,1,0.36,1)';
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Efecto spotlight en tarjetas ---------- */
  document.querySelectorAll('.module-card, .step-item').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  /* ---------- Cursor personalizado (solo desktop) ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .module-card, .step-item, .price-card, .doodle-btn').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
  }

});