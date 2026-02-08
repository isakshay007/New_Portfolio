// ===================================
// Main JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 50,
        disable: false,
        startEvent: 'DOMContentLoaded',
        mirror: false
    });

    // Refresh AOS after a short delay to ensure hero section animates
    setTimeout(() => {
        AOS.refresh();
    }, 100);

    // ===================================
    // Typing Animation for Role Text
    // ===================================
    const typedRoleElement = document.getElementById('typed-role');
    const roles = [
        'GenAI Engineer',
        'Full Stack Software Engineer',
        'Backend Engineer',
        'Graduate Student at Northeastern, Boston, MA'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeRole() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typedRoleElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typedRoleElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(typeRole, typingSpeed);
    }

    if (typedRoleElement) {
        setTimeout(typeRole, 1000);
    }

    // ===================================
    // Custom Cursor - Fast Glow Effect
    // ===================================
    const cursorInner = document.querySelector('.cursor-inner');
    const cursorOuter = document.querySelector('.cursor-outer');

    if (cursorInner && cursorOuter && window.innerWidth > 998) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            cursorInner.style.transform = `translate(${x - 5}px, ${y - 5}px)`;
            cursorOuter.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
        });

        document.addEventListener('click', (e) => {
            createSparkle(e.clientX, e.clientY);
        });

        function createSparkle(x, y) {
            const sparkleCount = 8;
            for (let i = 0; i < sparkleCount; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'cursor-sparkle';
                sparkle.style.left = x + 'px';
                sparkle.style.top = y + 'px';

                const angle = (i / sparkleCount) * 360;
                const distance = 30 + Math.random() * 20;
                sparkle.style.setProperty('--tx', Math.cos(angle * Math.PI / 180) * distance + 'px');
                sparkle.style.setProperty('--ty', Math.sin(angle * Math.PI / 180) * distance + 'px');

                document.body.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 600);
            }
        }

        const hoverElements = document.querySelectorAll('a, button, .skill-pill, .skill-tag, .project-tag');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorInner.classList.add('hover');
                cursorOuter.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorInner.classList.remove('hover');
                cursorOuter.classList.remove('hover');
            });
        });
    }

    // ===================================
    // Theme Toggle
    // ===================================
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    } else if (savedTheme === 'dark') {
        document.body.classList.remove('light-mode');
    }

    themeToggle?.addEventListener('click', () => {
        themeToggle.classList.add('switching');
        const moonIcon = themeToggle.querySelector('.moon-icon');

        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');

        if (!isLight && moonIcon) {
            moonIcon.style.animation = 'moonRise 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
            moonIcon.addEventListener('animationend', () => {
                moonIcon.style.animation = '';
            }, { once: true });
        }

        setTimeout(() => {
            themeToggle.classList.remove('switching');
        }, 600);
    });

    // ===================================
    // Mobile Menu
    // ===================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
// ===================================
    // LIGHTNING FAST NAVIGATION TRACKING
    // ===================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a[href^="#"]');
    
    let activeSection = '';
    let isManualScroll = false;

    // Get current section - INSTANT
    function getCurrentSection() {
        const scrollPos = window.scrollY + 150;
        
        if (window.scrollY < 100) return 'home';

        let current = 'home';
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            
            if (scrollPos >= top && scrollPos < bottom) {
                current = section.getAttribute('id');
            }
        });

        // Last section handling
        const docHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        if (window.scrollY + windowHeight >= docHeight - 50) {
            current = sections[sections.length - 1].getAttribute('id');
        }

        return current;
    }

    // Update nav - INSTANT, NO DELAYS
    function updateActiveNavLink(sectionId) {
        if (activeSection === sectionId) return;
        
        console.log(`⚡ ${activeSection || 'none'} → ${sectionId}`);
        activeSection = sectionId;

        [...navLinks, ...mobileLinks].forEach(link => {
            const linkSection = link.getAttribute('href')?.substring(1);
            
            link.classList.remove('active', 'animating');
            
            if (linkSection === sectionId) {
                link.classList.add('active', 'animating');
                
                // Remove animating after quick flow completes (0.6s)
                setTimeout(() => link.classList.remove('animating'), 600);
            }
        });
    }

    // INSTANT scroll tracking with requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (isManualScroll || ticking) return;
        
        ticking = true;
        requestAnimationFrame(() => {
            updateActiveNavLink(getCurrentSection());
            ticking = false;
        });
    }, { passive: true });

    // Handle clicks - INSTANT
    const allNavLinks = document.querySelectorAll('a[href^="#"]');
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                isManualScroll = true;
                updateActiveNavLink(targetId);
                
                const offset = targetSection.offsetTop - 100;
                window.scrollTo({ top: offset, behavior: 'smooth' });
                
                setTimeout(() => isManualScroll = false, 800);
            }
        });
    });

    // Initialize instantly
    updateActiveNavLink(getCurrentSection());
    console.log('⚡ Lightning fast navigation ready!');
    // ===================================
    // Back to Top Button
    // ===================================
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn?.classList.add('visible');
        } else {
            backToTopBtn?.classList.remove('visible');
        }
    });

    backToTopBtn?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===================================
    // Navbar Scroll Effect
    // ===================================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 100) {
            navbar?.style.setProperty('box-shadow', '0 10px 30px rgba(0, 0, 0, 0.3)');
        } else {
            navbar?.style.setProperty('box-shadow', 'none');
        }
    });

    // ===================================
    // Intersection Observer for Animations
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-category, .project-card, .timeline-item, .education-card').forEach(el => {
        observer.observe(el);
    });

    console.log('Portfolio loaded successfully! 🚀');
    console.log(' Enhanced navigation with flow animation initialized!');
});

// ===================================
// Preloader
// ===================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});