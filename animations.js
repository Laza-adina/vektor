document.addEventListener('DOMContentLoaded', () => {

    // --- NAVBAR DYNAMIQUE ---
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // --- BURGER MENU MOBILE ---
    const burger = document.querySelector('.burger');
    const navMobile = document.getElementById('navMobile');
    const navClose = document.getElementById('navClose');

    if (burger && navMobile) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('open');
            navMobile.classList.toggle('open');
            document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            burger.classList.remove('open');
            navMobile.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    if (navMobile) {
        navMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('open');
                navMobile.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // --- SCROLL REVEAL ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-up');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- CAROUSEL ---
    const carouselContainer = document.querySelector('.carousel-container');
    const cards = document.querySelectorAll('.carousel-card');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentIndex = 1;

    if (cards.length > 0) {
        function updateCarousel() {
            cards.forEach((card, index) => {
                card.classList.remove('active', 'prev-card', 'next-card');
                if (index === currentIndex) {
                    card.classList.add('active');
                } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
                    card.classList.add('prev-card');
                } else if (index === (currentIndex + 1) % cards.length) {
                    card.classList.add('next-card');
                }
            });
        }

        if (prevBtn && nextBtn) {
            nextBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % cards.length; updateCarousel(); });
            prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + cards.length) % cards.length; updateCarousel(); });
        }

        let startX = 0;
        if (carouselContainer) {
            carouselContainer.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
            carouselContainer.addEventListener('touchend', (e) => {
                const diff = startX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    currentIndex = diff > 0
                        ? (currentIndex + 1) % cards.length
                        : (currentIndex - 1 + cards.length) % cards.length;
                    updateCarousel();
                }
            });
        }

        let autoPlay = setInterval(() => { currentIndex = (currentIndex + 1) % cards.length; updateCarousel(); }, 6000);
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlay));
            carouselContainer.addEventListener('mouseleave', () => {
                autoPlay = setInterval(() => { currentIndex = (currentIndex + 1) % cards.length; updateCarousel(); }, 6000);
            });
        }

        updateCarousel();
    }

    // --- FAQ ACCORDÉON ---
    const faqHeaders = document.querySelectorAll('.accordion-header');

    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const isActive = item.classList.contains('accordion-active');

            // Fermer tous les autres
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                otherItem.classList.remove('accordion-active');
                const otherContent = otherItem.querySelector('.accordion-content');
                otherContent.style.maxHeight = null;
            });

            // Ouvrir celui cliqué s'il était fermé
            if (!isActive) {
                item.classList.add('accordion-active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // --- ANIMATION PROCESS ---
    const processSteps = document.querySelectorAll('.process-step-block');
    const processLineFill = document.getElementById('processLineFill');
    const processRight = document.querySelector('.process-right');

    if (processSteps.length > 0) {
        if (processLineFill && processRight) {
            window.addEventListener('scroll', () => {
                const rect = processRight.getBoundingClientRect();
                const windowH = window.innerHeight;
                const total = processRight.offsetHeight;
                const scrolled = windowH - rect.top;
                const percent = Math.min(Math.max(scrolled / (total + windowH * 0.5), 0), 1);
                processLineFill.style.height = (percent * 100) + '%';
            });
        }

        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('focused');
            });
        }, { rootMargin: '-15% 0px -15% 0px', threshold: 0.2 });

        processSteps.forEach(step => stepObserver.observe(step));
    }

    // --- TAGS MATTER.JS (SECTION MOSAÏQUE) ---
    const canvas = document.getElementById('tagsCanvas');

    if (canvas) {
        const { Engine, Render, Runner, Bodies, Body, World, Events } = Matter;

        const W = canvas.parentElement.offsetWidth;
        const isMobile = window.innerWidth < 768;
        const H = isMobile ? 750 : 650;
        canvas.width = W;
        canvas.height = H;

        const engine = Engine.create({ gravity: { x: 0, y: 2 } });
        const world = engine.world;

        const render = Render.create({
            canvas: canvas,
            engine: engine,
            options: { width: W, height: H, background: 'transparent', wireframes: false }
        });

        const ground = Bodies.rectangle(W / 2, H + 25, W * 2, 50, { isStatic: true, render: { fillStyle: 'transparent' } });
        const wallL  = Bodies.rectangle(-25, H / 2, 50, H * 2, { isStatic: true, render: { fillStyle: 'transparent' } });
        const wallR  = Bodies.rectangle(W + 25, H / 2, 50, H * 2, { isStatic: true, render: { fillStyle: 'transparent' } });
        World.add(world, [ground, wallL, wallR]);

        // Palette de couleurs Fluo / Néon Premium (Fond transparent, Bordure & Texte éclatants)
        const tagColors = [
            { bg: 'rgba(235, 180, 235, 0.08)', stroke: '#ebb4eb', text: '#ebb4eb' }, // Rose/Mauve Signature
            { bg: 'rgba(57, 255, 20, 0.08)',   stroke: '#39FF14', text: '#39FF14' }, // Vert Fluo / Cyber Lime
            { bg: 'rgba(0, 245, 255, 0.08)',   stroke: '#00F5FF', text: '#00F5FF' }, // Bleu Cyan Électrique
            { bg: 'rgba(255, 0, 127, 0.08)',   stroke: '#FF007F', text: '#FF007F' }, // Rose Néon / Hot Pink
            { bg: 'rgba(255, 239, 0, 0.08)',   stroke: '#FFEF00', text: '#FFEF00' }, // Jaune Fluo
            { bg: 'rgba(189, 0, 255, 0.08)',   stroke: '#BD00FF', text: '#BD00FF' }, // Violet Fluo / Purple
            { bg: 'rgba(255, 95, 0, 0.08)',    stroke: '#FF5F00', text: '#FF5F00' }, // Orange Néon
            { bg: 'rgba(0, 255, 204, 0.08)',   stroke: '#00FFCC', text: '#00FFCC' }  // Menthe/Aqua Fluo
        ];

        const tags = ['Food', 'Beauté', 'Mode', 'Sport', 'Tech', 'Voyage', 'Lifestyle', 'Home'];
        const ph = isMobile ? 75 : 85;
        const pw = isMobile ? Math.floor(W * 0.52) : Math.floor(W * 0.22);
        const fontSize = isMobile ? 24 : 26;
        const bodies = [];

        tags.forEach((label, i) => {
            const x = Math.random() * (W * 0.5) + W * 0.25;
            const y = -100 - i * 100;
            
            // Sélection automatique de la couleur fluo correspondante
            const color = tagColors[i % tagColors.length];

            const body = Bodies.rectangle(x, y, pw, ph, {
                restitution: 0.35, friction: 0.4, frictionAir: 0.03,
                render: { fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 },
                label: label
            });
            Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
            
            // On enregistre l'objet avec sa couleur associée
            bodies.push({ body, label, color });
            World.add(world, body);
        });

        // Fonction de dessin modifiée pour accepter la couleur dynamique
        function drawPill(ctx, x, y, angle, w, h, label, color) {
            const rad = h / 2;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(-w / 2 + rad, -h / 2);
            ctx.lineTo(w / 2 - rad, -h / 2);
            ctx.arc(w / 2 - rad, 0, rad, -Math.PI / 2, Math.PI / 2);
            ctx.lineTo(-w / 2 + rad, h / 2);
            ctx.arc(-w / 2 + rad, 0, rad, Math.PI / 2, -Math.PI / 2);
            ctx.closePath();
            
            // Remplissage avec la couleur fluo transparente (effet de lueur)
            ctx.fillStyle = color.bg;
            ctx.fill();
            
            // Bordure fluo
            ctx.strokeStyle = color.stroke;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Texte fluo coordonné
            ctx.fillStyle = color.text;
            ctx.font = `600 ${fontSize}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label.toUpperCase(), 0, 0);
            ctx.restore();
        }

        Events.on(render, 'afterRender', () => {
            const ctx = render.context;
            // On passe bien la variable "color" à la fonction de dessin
            bodies.forEach(({ body, label, color }) => drawPill(ctx, body.position.x, body.position.y, body.angle, pw, ph, label, color));
        });

        canvas.addEventListener('wheel', (e) => { window.scrollBy(0, e.deltaY); }, { passive: true });

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    Render.run(render);
                    Runner.run(Runner.create(), engine);
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        sectionObserver.observe(canvas);

        window.addEventListener('resize', () => {
            const newW = canvas.parentElement.offsetWidth;
            render.canvas.width = newW;
            render.options.width = newW;
            Body.setPosition(ground, { x: newW / 2, y: H + 25 });
            Body.setPosition(wallR, { x: newW + 25, y: H / 2 });
        });
    }

});