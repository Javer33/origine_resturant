
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const backtop = document.querySelector('.backtop');
  const toggle = document.querySelector('.menu-toggle');
  const mobile = document.querySelector('.mobile-panel');

  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    if (backtop) backtop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobile.classList.remove('open');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  if (backtop) backtop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Menu category filtering
  const filters = document.querySelectorAll('.filter');
  const items = document.querySelectorAll('.menu-item');
  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');
      const cat = filter.dataset.category;
      items.forEach(item => {
        item.classList.toggle('hidden', cat !== 'all' && item.dataset.category !== cat);
      });
    });
  });

  // Menu item detail toggles
  document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.menu-item');
      const open = item.classList.toggle('open');
      btn.textContent = open ? 'Hide details ↑' : 'Taste & origin ↓';
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // Reservation validation + confirmation
  const form = document.querySelector('#reservationForm');
  const confirmation = document.querySelector('.confirmation');
  if (form && confirmation) {
    const date = form.querySelector('[name="date"]');
    if (date) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth()+1).padStart(2,'0');
      const dd = String(today.getDate()).padStart(2,'0');
      date.min = `${yyyy}-${mm}-${dd}`;
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('.error').forEach(el => el.textContent = '');

      const required = form.querySelectorAll('[required]');
      required.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          const err = input.parentElement.querySelector('.error');
          if (err) err.textContent = 'Please complete this field.';
        }
      });

      const email = form.querySelector('[name="email"]');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        valid = false;
        email.parentElement.querySelector('.error').textContent = 'Enter a valid email address.';
      }

      const guests = form.querySelector('[name="guests"]');
      if (guests && (Number(guests.value) < 1 || Number(guests.value) > 12)) {
        valid = false;
        guests.parentElement.querySelector('.error').textContent = 'Please choose 1–12 guests.';
      }

      if (!valid) return;

      const submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      submit.textContent = 'Confirming…';

      setTimeout(() => {
        form.style.display = 'none';
        confirmation.classList.add('show');
        confirmation.scrollIntoView({behavior:'smooth', block:'center'});
      }, 650);
    });
  }

  // Contact form
  const contactForm = document.querySelector('#contactForm');
  const contactStatus = document.querySelector('#contactStatus');
  if (contactForm && contactStatus) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      contactStatus.textContent = 'Thank you — your message has been received. ORIGINE will be in touch shortly.';
      contactStatus.style.display = 'block';
      contactForm.reset();
    });
  }
});
