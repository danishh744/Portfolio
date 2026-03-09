document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'var(--nav-bg, rgba(10, 10, 12, 0.8))';
            navbar.style.borderBottom = '1px solid var(--glass-border)';
            if (document.body.classList.contains('light-mode')) {
                navbar.style.background = 'rgba(240, 242, 245, 0.8)';
            }
        } else {
            navbar.style.background = 'transparent';
            navbar.style.borderBottom = 'none';
        }
    });

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        let theme = 'dark';

        if (document.body.classList.contains('light-mode')) {
            theme = 'light';
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }

        localStorage.setItem('theme', theme);

        // Update navbar background if scrolled
        if (window.scrollY > 50) {
            if (theme === 'light') {
                navbar.style.background = 'rgba(240, 242, 245, 0.8)';
            } else {
                navbar.style.background = 'rgba(10, 10, 12, 0.8)';
            }
        }
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.querySelector('i').classList.toggle('fa-bars');
            menuBtn.querySelector('i').classList.toggle('fa-times');
        });

        // Close menu when clicking a link
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.querySelector('i').classList.add('fa-bars');
                menuBtn.querySelector('i').classList.remove('fa-times');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuBtn.querySelector('i').classList.add('fa-bars');
                menuBtn.querySelector('i').classList.remove('fa-times');
            }
        });
    }


    // Simple scroll reveal
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Animate progress bars if visible
                if (entry.target.classList.contains('skill-card')) {
                    const progress = entry.target.querySelector('.progress');
                    const width = progress.getAttribute('data-width');
                    progress.style.width = width;
                }
            }
        });
    }, observerOptions);

    // Observe skill cards
    document.querySelectorAll('.skill-card').forEach(card => {
        observer.observe(card);
    });

    // Contact Form handling
    const contactForm = document.getElementById('portfolio-contact');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            const originalBg = btn.style.background;

            btn.style.transform = 'rotate(360deg)';
            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    btn.textContent = 'Message Sent!';
                    btn.style.background = 'green';
                    btn.classList.add('btn-success');
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    console.error('Formspree Error:', errorData);
                    alert('Submission Error: ' + (errorData.errors ? errorData.errors[0].message : 'Please check your Formspree ID or activation.'));
                    btn.textContent = 'Error!';
                    btn.style.background = 'red';
                }
            } catch (error) {
                console.error('Submission Error:', error);
                alert('Connection Error: Please ensure you are running the site on a server (like Live Server) and not as a local file.');
                btn.textContent = 'Error!';
                btn.style.background = 'red';
            } finally {


                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.opacity = '1';
                    btn.disabled = false;
                    btn.classList.remove('btn-success');
                    btn.style.background = '';
                }, 3000);
            }
        });
    }


    // Smooth Scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });



    // Initial animations for hero elements
    const heroElements = document.querySelectorAll('.sub-reveal, .name-reveal, .title-reveal, .tagline, .cta-buttons');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });
});
