/**
 * Hudson Pressure Pros - Main JavaScript
 * Version: 2.0 - Optimized for Performance & Accessibility
 */

(function() {
    'use strict';

    // ==========================================================================
    // Utility Functions
    // ==========================================================================

    /**
     * Debounce function for performance
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Check if reduced motion is preferred
     */
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // ==========================================================================
    // Mobile Menu
    // ==========================================================================

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    let isMenuOpen = false;

    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen);
        mobileMenuBtn.setAttribute('aria-label', isMenuOpen ? 'Close menu' : 'Open menu');
        mainNav.classList.toggle('active', isMenuOpen);
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';

        // Trap focus in mobile menu when open
        if (isMenuOpen) {
            mainNav.querySelector('a, button').focus();
        }
    }

    function closeMobileMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.setAttribute('aria-label', 'Open menu');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);

        // Close menu when clicking a link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMobileMenu();
                mobileMenuBtn.focus();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    // ==========================================================================
    // Mobile Dropdown Toggle
    // ==========================================================================

    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdown = toggle.closest('.nav-dropdown');
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

                // Close other dropdowns
                dropdownToggles.forEach(otherToggle => {
                    if (otherToggle !== toggle) {
                        otherToggle.setAttribute('aria-expanded', 'false');
                        otherToggle.closest('.nav-dropdown').classList.remove('active');
                    }
                });

                toggle.setAttribute('aria-expanded', !isExpanded);
                dropdown.classList.toggle('active', !isExpanded);
            }
        });
    });

    // ==========================================================================
    // Sticky Mobile CTA
    // ==========================================================================

    const mobileCta = document.getElementById('mobile-cta');
    let lastScrollY = 0;
    let ticking = false;

    function updateMobileCta() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Show after scrolling past hero section
        if (mobileCta) {
            if (scrollY > windowHeight * 0.5) {
                mobileCta.classList.add('visible');
                mobileCta.setAttribute('aria-hidden', 'false');
            } else {
                mobileCta.classList.remove('visible');
                mobileCta.setAttribute('aria-hidden', 'true');
            }
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateMobileCta);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ==========================================================================
    // Smooth Scroll
    // ==========================================================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();

                // Close mobile menu if open
                closeMobileMenu();

                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

                if (prefersReducedMotion()) {
                    window.scrollTo(0, targetPosition);
                } else {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }

                // Set focus to target for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        });
    });

    // ==========================================================================
    // Form Validation
    // ==========================================================================

    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        const validators = {
            'first-name': {
                validate: (value) => value.trim().length >= 2,
                message: 'Please enter your first name (at least 2 characters)'
            },
            'last-name': {
                validate: (value) => value.trim().length >= 2,
                message: 'Please enter your last name (at least 2 characters)'
            },
            'email': {
                validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: 'Please enter a valid email address'
            },
            'phone': {
                validate: (value) => /^[\d\s\-\(\)\+]{10,}$/.test(value.replace(/\s/g, '')),
                message: 'Please enter a valid phone number'
            },
            'address': {
                validate: (value) => value.trim().length >= 5,
                message: 'Please enter your property address'
            }
        };

        function validateField(field) {
            const validator = validators[field.id];
            if (!validator) return true;

            const isValid = validator.validate(field.value);
            const errorElement = field.nextElementSibling;

            if (!isValid) {
                field.classList.add('error');
                field.setAttribute('aria-invalid', 'true');
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.textContent = validator.message;
                }
            } else {
                field.classList.remove('error');
                field.setAttribute('aria-invalid', 'false');
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.textContent = '';
                }
            }

            return isValid;
        }

        // Real-time validation on blur
        contactForm.querySelectorAll('input[required]').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(field);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;
            const requiredFields = this.querySelectorAll('input[required]');

            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                // Focus first invalid field
                const firstError = this.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                }
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('.btn-submit');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Collect form data
            const formData = new FormData(this);
            const data = {
                firstName: formData.get('first-name'),
                lastName: formData.get('last-name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                services: formData.getAll('services'),
                message: formData.get('message')
            };

            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                // Show success message
                alert('Thank you for your quote request! We will contact you within 24 hours.');
                this.reset();

                // Track conversion (analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'Lead',
                        'event_label': 'Quote Request'
                    });
                }

                // In production, send to server:
                // fetch('/api/contact', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data)
                // });
            }, 1000);
        });
    }

    // ==========================================================================
    // Phone Number Formatting
    // ==========================================================================

    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 10) {
                value = value.slice(0, 10);
            }

            if (value.length >= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            }

            e.target.value = value;
        });
    }

    // ==========================================================================
    // Lazy Loading Images
    // ==========================================================================

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }

                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }

                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ==========================================================================
    // Intersection Observer for Animations
    // ==========================================================================

    if (!prefersReducedMotion() && 'IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        });

        document.querySelectorAll('.service-card, .benefit-item, .area-card, .testimonial-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            animationObserver.observe(el);
        });

        // CSS for animated elements
        const style = document.createElement('style');
        style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
        document.head.appendChild(style);
    }

    // ==========================================================================
    // FAQ Accordion Accessibility
    // ==========================================================================

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const summary = item.querySelector('summary');

        if (summary) {
            // Announce state change to screen readers
            item.addEventListener('toggle', () => {
                const isOpen = item.open;
                summary.setAttribute('aria-expanded', isOpen);
            });
        }
    });

    // ==========================================================================
    // Click-to-Call Tracking
    // ==========================================================================

    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
            // Track phone call clicks for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Contact',
                    'event_label': 'Phone Call',
                    'value': 1
                });
            }

            // Facebook Pixel tracking
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Contact');
            }
        });
    });

    // ==========================================================================
    // Header Shadow on Scroll
    // ==========================================================================

    const header = document.querySelector('.header');

    const updateHeaderShadow = debounce(() => {
        if (header) {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }
        }
    }, 10);

    window.addEventListener('scroll', updateHeaderShadow, { passive: true });

    // ==========================================================================
    // Gallery Filters (if on gallery page)
    // ==========================================================================

    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length && galleryItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');

                // Filter items
                const filter = btn.dataset.filter;

                galleryItems.forEach(item => {
                    const shouldShow = filter === 'all' || item.dataset.category === filter;

                    if (prefersReducedMotion()) {
                        item.style.display = shouldShow ? 'block' : 'none';
                    } else {
                        if (shouldShow) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 10);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.95)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    }
                });

                // Announce to screen readers
                const count = document.querySelectorAll(`.gallery-item${filter === 'all' ? '' : `[data-category="${filter}"]`}`).length;
                const announcement = document.createElement('div');
                announcement.setAttribute('role', 'status');
                announcement.setAttribute('aria-live', 'polite');
                announcement.className = 'visually-hidden';
                announcement.textContent = `Showing ${count} ${filter === 'all' ? 'items' : filter + ' items'}`;
                document.body.appendChild(announcement);
                setTimeout(() => announcement.remove(), 1000);
            });
        });

        // Set initial aria-pressed states
        filterBtns.forEach(btn => {
            btn.setAttribute('aria-pressed', btn.classList.contains('active'));
        });
    }

    // ==========================================================================
    // Print Page Tracking
    // ==========================================================================

    window.addEventListener('beforeprint', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'print', {
                'event_category': 'Engagement',
                'event_label': document.title
            });
        }
    });

    // ==========================================================================
    // Service Worker Registration (for PWA support)
    // ==========================================================================

    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                // Service worker registration failed, but that's okay
            });
        });
    }

    // ==========================================================================
    // Console Welcome Message
    // ==========================================================================

    console.log(
        '%cHudson Pressure Pros',
        'color: #1e3a5f; font-size: 24px; font-weight: bold;'
    );
    console.log(
        '%cVeteran Owned & Operated | (727) 998-4211',
        'color: #c4652a; font-size: 14px;'
    );
    console.log('Website loaded successfully!');

})();
