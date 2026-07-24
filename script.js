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

if (form) form.addEventListener('submit', (e) => {
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
if (heroVisual && window.matchMedia('(min-width: 960px)').matches) {
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < 800) {
            heroVisual.style.transform = `translateY(${y * 0.06}px)`;
        }
    }, { passive: true });
}

// ═══════════════ Lightbox pour les chantiers ═══════════════
const chantierImgs = Array.from(document.querySelectorAll('.chantier-item img'));
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbCounter = document.getElementById('lbCounter');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
let currentIdx = 0;

const showImage = (i) => {
    if (!chantierImgs.length) return;
    currentIdx = (i + chantierImgs.length) % chantierImgs.length;
    lbImage.src = chantierImgs[currentIdx].src;
    lbImage.alt = chantierImgs[currentIdx].alt;
    lbCounter.textContent = `${currentIdx + 1} / ${chantierImgs.length}`;
};

const openLightbox = (i) => {
    showImage(i);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

chantierImgs.forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(i));
});

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lbPrev) lbPrev.addEventListener('click', () => showImage(currentIdx - 1));
if (lbNext) lbNext.addEventListener('click', () => showImage(currentIdx + 1));
if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIdx - 1);
    if (e.key === 'ArrowRight') showImage(currentIdx + 1);
});

// ═══════════════ Google Reviews (Places API — New) ═══════════════
const gCfg = window.GOOGLE_REVIEWS_CONFIG || {};
const gApiConfigured = gCfg.apiKey && gCfg.placeId
    && !gCfg.apiKey.startsWith('REMPLACER')
    && !gCfg.placeId.startsWith('REMPLACER');

const buildStars = (rating) => {
    const full = Math.round(rating);
    return '★★★★★☆☆☆☆☆'.slice(5 - full, 10 - full);
};

const timeAgoFr = (date) => {
    const diff = (Date.now() - new Date(date).getTime()) / 1000;
    const day = 86400;
    if (diff < day * 30) return `Il y a ${Math.max(1, Math.floor(diff / day))} j.`;
    if (diff < day * 365) return `Il y a ${Math.floor(diff / (day * 30))} mois`;
    const years = Math.floor(diff / (day * 365));
    return `Il y a ${years} an${years > 1 ? 's' : ''}`;
};

const renderReviews = (data) => {
    const grid = document.getElementById('reviewsGrid');
    const summary = document.getElementById('reviewsSummary');
    const starsEl = document.getElementById('reviewsStars');
    const avgEl = document.getElementById('reviewsAvg');
    const countEl = document.getElementById('reviewsCount');
    const linkEl = document.getElementById('reviewsGoogleLink');

    if (!grid || !data.reviews || !data.reviews.length) return;

    if (typeof data.rating === 'number') {
        starsEl.textContent = buildStars(data.rating);
        avgEl.textContent = data.rating.toFixed(1);
        countEl.textContent = `(${data.userRatingCount || data.reviews.length} avis)`;
        if (data.googleMapsUri) linkEl.href = data.googleMapsUri;
        summary.hidden = false;
    }

    grid.innerHTML = data.reviews.slice(0, 6).map(r => {
        const name = (r.authorAttribution && r.authorAttribution.displayName) || 'Client';
        const photo = r.authorAttribution && r.authorAttribution.photoUri;
        const initial = name.charAt(0).toUpperCase();
        const text = (r.originalText && r.originalText.text) || (r.text && r.text.text) || '';
        const stars = buildStars(r.rating || 5);
        const when = r.publishTime ? timeAgoFr(r.publishTime) : '';
        const avatar = photo
            ? `<img class="review-avatar" src="${photo}" alt="${name}" referrerpolicy="no-referrer">`
            : `<div class="review-avatar">${initial}</div>`;
        return `
            <article class="review reveal in">
                <div class="review-stars">${stars}</div>
                <p class="review-text">« ${text.replace(/</g, '&lt;')} »</p>
                <div class="review-author">
                    ${avatar}
                    <div><strong>${name}</strong><span>${when}</span></div>
                </div>
            </article>`;
    }).join('');
};

const loadGoogleReviews = async () => {
    if (!gApiConfigured) return;
    try {
        const res = await fetch(
            `https://places.googleapis.com/v1/places/${encodeURIComponent(gCfg.placeId)}?languageCode=fr`,
            {
                headers: {
                    'X-Goog-Api-Key': gCfg.apiKey,
                    'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews,googleMapsUri'
                }
            }
        );
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        renderReviews(data);
    } catch (err) {
        console.warn('Google Reviews non chargés :', err.message);
        // Les avis fallback restent affichés
    }
};

// Chargement paresseux : on n'appelle l'API qu'à l'approche de la section
if (gApiConfigured) {
    const reviewsSection = document.getElementById('avis');
    const reviewsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadGoogleReviews();
            reviewsObserver.disconnect();
        }
    }, { rootMargin: '200px' });
    if (reviewsSection) reviewsObserver.observe(reviewsSection);
}
