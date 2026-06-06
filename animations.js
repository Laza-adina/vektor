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

            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                otherItem.classList.remove('accordion-active');
                const otherContent = otherItem.querySelector('.accordion-content');
                otherContent.style.maxHeight = null;
            });

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

    // --- TAGS MATTER.JS ---
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

        // Couleurs pleines comme l'image de référence
        const tags = [
            { label: 'Food',      fill: '#ffffff', text: '#222222', border: true  },
            { label: 'Beauté',    fill: '#a8e063', text: '#222222', border: false },
            { label: 'Mode',      fill: '#ff5c35', text: '#ffffff', border: false },
            { label: 'Sport',     fill: '#ff5c35', text: '#ffffff', border: false },
            { label: 'Tech',      fill: '#8b5cf6', text: '#ffffff', border: false },
            { label: 'Voyage',    fill: '#ffffff', text: '#222222', border: true  },
            { label: 'Lifestyle', fill: '#8b5cf6', text: '#ffffff', border: false },
            { label: 'Home',      fill: '#a8e063', text: '#222222', border: false },
        ];

        const ph = isMobile ? 70 : 80;
        const pw = isMobile ? Math.floor(W * 0.48) : Math.floor(W * 0.20);
        const fontSize = isMobile ? 22 : 24;
        const bodies = [];

        tags.forEach((tag, i) => {
            const x = Math.random() * (W * 0.5) + W * 0.25;
            const y = -100 - i * 100;

            const body = Bodies.rectangle(x, y, pw, ph, {
                restitution: 0.4,
                friction: 0.35,
                frictionAir: 0.025,
                render: { fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 },
                label: tag.label
            });

            Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);
            bodies.push({ body, tag });
            World.add(world, body);
        });

        function drawPill(ctx, x, y, angle, w, h, tag) {
            const rad = h / 2;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);

            // Ombre douce
            ctx.shadowColor = 'rgba(0,0,0,0.15)';
            ctx.shadowBlur = 16;
            ctx.shadowOffsetY = 6;

            // Forme pill
            ctx.beginPath();
            ctx.moveTo(-w / 2 + rad, -h / 2);
            ctx.lineTo(w / 2 - rad, -h / 2);
            ctx.arc(w / 2 - rad, 0, rad, -Math.PI / 2, Math.PI / 2);
            ctx.lineTo(-w / 2 + rad, h / 2);
            ctx.arc(-w / 2 + rad, 0, rad, Math.PI / 2, -Math.PI / 2);
            ctx.closePath();

            // Fond plein
            ctx.fillStyle = tag.fill;
            ctx.fill();

            // Contour si fond blanc
            ctx.shadowColor = 'transparent';
            if (tag.border) {
                ctx.strokeStyle = 'rgba(0,0,0,0.18)';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // Texte
            ctx.fillStyle = tag.text;
            ctx.font = `700 ${fontSize}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(tag.label.toUpperCase(), 0, 0);

            ctx.restore();
        }

        Events.on(render, 'afterRender', () => {
            const ctx = render.context;
            bodies.forEach(({ body, tag }) => {
                drawPill(ctx, body.position.x, body.position.y, body.angle, pw, ph, tag);
            });
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