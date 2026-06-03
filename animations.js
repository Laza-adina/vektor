document.addEventListener('DOMContentLoaded', () => {

    // --- NAVBAR DYNAMIQUE (SCROLL BEHAVIOR) ---
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
    const navLinks = document.querySelector('.nav-links');

    if (burger) {
        burger.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'rgba(34, 34, 34, 0.8)';;
                navLinks.style.padding = '20px';
                navLinks.style.gap = '20px';
            }
        });
    }

    // --- SCROLL REVEAL (INTERSECTION OBSERVER) ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-up');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: "0px 0px 0px 0px"
    });

    revealElements.forEach(element => revealObserver.observe(element));

    // --- CAROUSEL DE CARDS ---
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
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % cards.length;
                updateCarousel();
            });

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                updateCarousel();
            });
        }

        let startX = 0;
        let endX = 0;

        if (carouselContainer) {
            carouselContainer.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            carouselContainer.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                handleSwipe();
            });
        }

        function handleSwipe() {
            const threshold = 50;
            if (startX - endX > threshold) {
                currentIndex = (currentIndex + 1) % cards.length;
                updateCarousel();
            } else if (endX - startX > threshold) {
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                updateCarousel();
            }
        }

        let autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        }, 6000);

        if (carouselContainer) {
            carouselContainer.addEventListener('touchstart', () => clearInterval(autoPlayInterval));
            carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
            carouselContainer.addEventListener('mouseleave', () => {
                autoPlayInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % cards.length;
                    updateCarousel();
                }, 6000);
            });
        }

        updateCarousel();
    }

    // --- ACCORDÉON INTERACTIF ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const isOpen = currentItem.classList.contains('accordion-active');

            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('accordion-active');
            });

            if (!isOpen) {
                currentItem.classList.add('accordion-active');
            }
        });
    });

    // --- VALIDATION DU FORMULAIRE DE CONTACT ---
    const form = document.getElementById('contactForm');
    const successBanner = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            const inputsToValidate = form.querySelectorAll('[required]');
            
            inputsToValidate.forEach(input => {
                const inputGroup = input.parentElement;
                
                if (input.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        inputGroup.classList.add('error');
                        isFormValid = false;
                    } else {
                        inputGroup.classList.remove('error');
                    }
                } else {
                    if (input.value.trim() === '') {
                        inputGroup.classList.add('error');
                        isFormValid = false;
                    } else {
                        inputGroup.classList.remove('error');
                    }
                }
            });

            if (isFormValid) {
                successBanner.style.display = 'block';
                form.reset();
                setTimeout(() => {
                    successBanner.style.display = 'none';
                }, 5000);
            }
        });

        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.parentElement.classList.remove('error');
                }
            });
        });
    }

    // --- ANIMATION FOCUS STEP BY STEP (PROCESS) ---
    const processSteps = document.querySelectorAll('.process-step-block');

    if (processSteps.length > 0) {
        const processObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('focused');
                } else {
                    entry.target.classList.remove('focused');
                }
            });
        }, {
            rootMargin: "-30% 0px -30% 0px",
            threshold: 0.2
        });

        processSteps.forEach(step => processObserver.observe(step));
    }

});

// --- TAGS PHYSIQUE MATTER.JS ---
const canvas = document.getElementById('tagsCanvas');

if (canvas) {
    const { Engine, Render, Runner, Bodies, Body, World, Mouse, MouseConstraint, Events } = Matter;

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
        options: {
            width: W,
            height: H,
            background: 'transparent',
            wireframes: false
        }
    });

    // Murs invisibles
    const ground = Bodies.rectangle(W / 2, H + 25, W * 2, 50, { isStatic: true, render: { fillStyle: 'transparent' } });
    const wallL  = Bodies.rectangle(-25, H / 2, 50, H * 2, { isStatic: true, render: { fillStyle: 'transparent' } });
    const wallR  = Bodies.rectangle(W + 25, H / 2, 50, H * 2, { isStatic: true, render: { fillStyle: 'transparent' } });
    World.add(world, [ground, wallL, wallR]);

    const tags = ['Food', 'Beauté', 'Mode', 'Sport', 'Tech', 'Voyage', 'Lifestyle', 'Home'];

    const ph = isMobile ? 75 : 85;
    const pw = isMobile ? Math.floor(W * 0.52) : Math.floor(W * 0.22);
    const fontSize = isMobile ? 24 : 26;
    const r = ph / 2; // border radius = moitié hauteur = pill parfaite

    const bodies = [];

    tags.forEach((label, i) => {
        const x = Math.random() * (W * 0.5) + W * 0.25;
        const y = -100 - i * 100;

        // Corps physique rectangle SANS chamfer — on dessine nous-mêmes
        const body = Bodies.rectangle(x, y, pw, ph, {
            restitution: 0.35,
            friction: 0.4,
            frictionAir: 0.03,
            render: { fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 },
            label: label
        });

        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
        bodies.push({ body, label });
        World.add(world, body);
    });


    // Fonction dessin pill propre
    function drawPill(ctx, x, y, angle, w, h, label) {
        const rad = h / 2;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Path pill parfaite
        ctx.beginPath();
        ctx.moveTo(-w / 2 + rad, -h / 2);
        ctx.lineTo(w / 2 - rad, -h / 2);
        ctx.arc(w / 2 - rad, 0, rad, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(-w / 2 + rad, h / 2);
        ctx.arc(-w / 2 + rad, 0, rad, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();

        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = `600 ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label.toUpperCase(), 0, 0);

        ctx.restore();
    }

    Events.on(render, 'afterRender', () => {
        const ctx = render.context;
        bodies.forEach(({ body, label }) => {
            drawPill(ctx, body.position.x, body.position.y, body.angle, pw, ph, label);
        });
    });

    // Scroll dans la section : écoute le wheel et transmet au document
    canvas.addEventListener('wheel', (e) => {
        window.scrollBy(0, e.deltaY);
    }, { passive: true });

    // Observer
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

    // Resize
    window.addEventListener('resize', () => {
        const newW = canvas.parentElement.offsetWidth;
        render.canvas.width = newW;
        render.options.width = newW;
        Body.setPosition(ground, { x: newW / 2, y: H + 25 });
        Body.setPosition(wallR, { x: newW + 25, y: H / 2 });
    });
}