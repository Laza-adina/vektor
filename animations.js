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