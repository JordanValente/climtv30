// ═══════════════ NAV: scroll & mobile toggle ═══════════════
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ═══════════════ Année dans le footer ═══════════════
document.getElementById('year').textContent = new Date().getFullYear();

// ═══════════════ Scroll reveal ═══════════════
const revealItems = document.querySelectorAll(
    '.service-card, .metric, .review, .zone-chip, .brand-tile, .process-step, .faq-item, .gallery-item, .brand-category'
);
revealItems.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                io.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);
revealItems.forEach(el => io.observe(el));

// ═══════════════ Contact form ═══════════════
const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        city: form.city.value.trim(),
        service: form.service.value,
        message: form.message.value.trim()
    };

    if (!data.name || !data.email || !data.phone) {
        alert('Merci de remplir les champs obligatoires.');
        return;
    }

    // Envoi via mailto en secours (pas de backend défini)
    const subject = encodeURIComponent(`Demande de devis — ${data.service}`);
    const body = encodeURIComponent(
        `Nom : ${data.name}\nTéléphone : ${data.phone}\nEmail : ${data.email}\nVille : ${data.city || '-'}\nPrestation : ${data.service}\n\nMessage :\n${data.message || '-'}`
    );

    // Ouvre le client mail
    window.location.href = `mailto:contact@climtv30.com?subject=${subject}&body=${body}`;

    success.classList.add('show');
    form.reset();

    setTimeout(() => success.classList.remove('show'), 8000);
});

// ═══════════════ Animation compteur pour métriques ═══════════════
const metrics = document.querySelectorAll('.metric-num[data-count]');
const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const suffix = el.textContent.replace(/[0-9]/g, '');
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const tick = () => {
        current += step;
        if (current >= target) {
            el.textContent = target + suffix;
        } else {
            el.textContent = current + suffix;
            requestAnimationFrame(tick);
        }
    };
    tick();
};
const counterObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 }
);
metrics.forEach(m => counterObserver.observe(m));

// ═══════════════ Parallax léger sur le hero visual ═══════════════
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && window.matchMedia('(min-width: 900px)').matches) {
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < 800) {
            heroVisual.style.transform = `translateY(${y * 0.08}px)`;
        }
    }, { passive: true });
}
