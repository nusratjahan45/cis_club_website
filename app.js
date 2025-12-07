document.addEventListener('DOMContentLoaded', () => {
    // Initialize Global Components
    initMobileMenu();
    initScrollToTop();
    setActiveNavLink();
    
    // Initialize Page-Specific Components (Safe checks included)
    initHeroSlider();
    initEventFilters();
    initJoinForm();
    initContactForm();
    initGallery();
    initFAQ();
});

/* --- Navigation & Layout --- */

function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    
    if (btn && menu) {
        btn.addEventListener('click', () => {
            const isHidden = menu.classList.contains('hidden');
            if (isHidden) {
                menu.classList.remove('hidden');
            } else {
                menu.classList.add('hidden');
            }
        });
    }
}

function setActiveNavLink() {
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';
    
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === page || (page === 'index.html' && href === './') || (page === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function initScrollToTop() {
    const btn = document.getElementById('scroll-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* --- Home Page Slider --- */

function initHeroSlider() {
    // Check if slider exists on this page
    const sliderContainer = document.querySelector('.hero-slider');
    if (!sliderContainer) return;

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    
    if (slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.opacity = i === index ? '1' : '0';
            slide.style.zIndex = i === index ? '10' : '0';
        });
        
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.remove('bg-white/50', 'w-3');
                dot.classList.add('bg-blue-500', 'w-8');
            } else {
                dot.classList.add('bg-white/50', 'w-3');
                dot.classList.remove('bg-blue-500', 'w-8');
            }
        });
        currentSlide = index;
    }

    function next() {
        showSlide((currentSlide + 1) % totalSlides);
    }

    function prev() {
        showSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);
    
    // Dot navigation
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => showSlide(i));
    });

    // Auto play
    setInterval(next, 6000);
}

/* --- Events Filtering --- */

function initEventFilters() {
    const filterContainer = document.getElementById('filter-buttons');
    if (!filterContainer) return;

    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('event-search');
    const events = document.querySelectorAll('.event-card');

    function filterEvents() {
        const activeBtn = document.querySelector('.filter-btn.bg-blue-600');
        // Ensure activeBtn exists before accessing properties
        const activeCategory = activeBtn ? activeBtn.getAttribute('data-category') : 'All';
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        events.forEach(card => {
            const category = card.getAttribute('data-category');
            const titleEl = card.querySelector('h3');
            const descEl = card.querySelector('p');
            
            const title = titleEl ? titleEl.textContent.toLowerCase() : '';
            const desc = descEl ? descEl.textContent.toLowerCase() : '';
            
            const matchesCategory = activeCategory === 'All' || category === activeCategory;
            const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex'; 
                card.classList.add('animate-fade-in');
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Reset classes
            filterBtns.forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white', 'shadow-lg');
                b.classList.add('bg-slate-700', 'text-slate-300');
            });
            // Set active
            btn.classList.remove('bg-slate-700', 'text-slate-300');
            btn.classList.add('bg-blue-600', 'text-white', 'shadow-lg');
            
            filterEvents();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterEvents);
    }
}

/* --- Form Validation --- */

function validateField(input, condition, errorMsg) {
    if (!input) return false;
    const group = input.closest('.input-group');
    
    // Find error message container inside the group
    let errorDisplay = null;
    if (group) {
        errorDisplay = group.querySelector('.error-message');
    }
    
    if (!condition) {
        if (group) group.classList.add('error');
        if (errorDisplay) errorDisplay.textContent = errorMsg;
        return false;
    } else {
        if (group) group.classList.remove('error');
        return true;
    }
}

function initJoinForm() {
    const form = document.getElementById('join-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const fullName = form.querySelector('input[name="fullName"]');
        const studentId = form.querySelector('input[name="studentId"]');
        const email = form.querySelector('input[name="email"]');
        const major = form.querySelector('select[name="major"]');

        // Validation Logic
        if (fullName) {
            const validName = validateField(fullName, fullName.value.trim() !== '', "Full Name is required");
            if (!validName) isValid = false;
        }

        if (studentId) {
            const validId = validateField(studentId, /^\d+$/.test(studentId.value.trim()), "Student ID must be numeric");
            if (!validId) isValid = false;
        }

        if (email) {
            const validEmail = validateField(email, /\S+@\S+\.\S+/.test(email.value.trim()), "Invalid email address");
            if (!validEmail) isValid = false;
        }

        if (major) {
            const validMajor = validateField(major, major.value !== "", "Please select a major");
            if (!validMajor) isValid = false;
        }

        if (isValid) {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                const originalText = btn.innerHTML;
                btn.textContent = 'Submitting...';
                btn.disabled = true;
            }

            // Simulate API call
            setTimeout(() => {
                const successMsg = document.getElementById('join-success');
                const content = document.getElementById('join-content');
                
                if (successMsg) successMsg.classList.remove('hidden');
                if (content) content.style.display = 'none';
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500);
        }
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('input[name="name"]');
        const email = form.querySelector('input[name="email"]');
        const message = form.querySelector('textarea[name="message"]');

        let isValid = true;
        if (name) if (!validateField(name, name.value.trim() !== '', "Name is required")) isValid = false;
        if (email) if (!validateField(email, /\S+@\S+\.\S+/.test(email.value.trim()), "Invalid email address")) isValid = false;
        if (message) if (!validateField(message, message.value.trim() !== '', "Message is required")) isValid = false;

        if (isValid) {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) btn.textContent = 'Sending...';
            
            setTimeout(() => {
                form.reset();
                if (btn) btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg> Send Message';
                alert('Message sent successfully!');
            }, 1500);
        }
    });
}

/* --- Gallery Lightbox --- */

function initGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return; // Exit if not on gallery page

    const items = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    if (!lightbox || !lightboxImg) return;

    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        const url = items[index].getAttribute('data-url');
        const caption = items[index].getAttribute('data-caption');
        
        lightboxImg.src = url;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightbox.classList.remove('hidden');
        // Small delay to allow display:block to apply before opacity transition
        setTimeout(() => lightbox.classList.remove('opacity-0'), 10);
    }

    function closeLightbox() {
        lightbox.classList.add('opacity-0');
        setTimeout(() => lightbox.classList.add('hidden'), 300);
    }

    function showNext(e) {
        if(e) e.stopPropagation();
        currentIndex = (currentIndex + 1) % items.length;
        openLightbox(currentIndex);
    }

    function showPrev(e) {
        if(e) e.stopPropagation();
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        openLightbox(currentIndex);
    }

    items.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    if (nextBtn) nextBtn.addEventListener('click', showNext);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
}

/* --- FAQ Accordion --- */

function initFAQ() {
    const faqContainer = document.querySelector('.faq-container');
    if (!faqContainer) return;

    const items = document.querySelectorAll('.faq-item');
    
    items.forEach(item => {
        const btn = item.querySelector('.faq-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close others (Accordion behavior)
                items.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                    }
                });
                
                // Toggle current
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        }
    });
}
