document.addEventListener("DOMContentLoaded", function () {
    // Initialize Navigation Logic
    // highlightActiveTab(); // Deprecated for single page
    setupScrollSpy();
    setupMobileMenu();
    setupInterestTabs();
    setupBackToTop();
    setupProjectsSlider();

    // Init AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

    // Init Background
    initParticles();

    // Smooth fade-in
    document.body.classList.add('loaded');
});

function setupScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.tab-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active class to corresponding link
                const activeLink = document.querySelector(`.tab-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

function setupMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.mobile-menu-overlay');

    // Check if extensions exist in DOM
    if (!btn || !overlay) return;

    // Clear previous clones if any
    overlay.innerHTML = '';

    const tabsContainer = document.querySelector('.research-tabs');
    if (!tabsContainer) return;

    const tabsContent = tabsContainer.innerHTML;

    overlay.innerHTML = `
        <div style="position:absolute; top:20px; right:20px; font-size:2rem; cursor:pointer;" class="close-menu">&times;</div>
        <div style="padding: 20px; display: flex; flex-direction: column; align-items: center; width: 100%;">
            ${tabsContent}
        </div>
    `;

    // Style cloned links for mobile
    const links = overlay.querySelectorAll('.tab-link');
    links.forEach(l => {
        l.style.display = 'flex';
        l.style.fontSize = '1.3rem';
        l.style.margin = '15px 0';
        l.style.width = '100%';
        l.style.justifyContent = 'center';

        // Close menu on click
        l.addEventListener('click', () => {
            overlay.classList.remove('open');
        });
    });

    btn.addEventListener('click', () => { overlay.classList.add('open'); });
    const close = overlay.querySelector('.close-menu');
    if (close) { close.addEventListener('click', () => { overlay.classList.remove('open'); }); }
}

function initParticles() {
    if (typeof tsParticles === 'undefined') return;

    tsParticles.load("tsparticles", {
        fpsLimit: 60,
        interactivity: {
            events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: true, mode: "grab" },
                resize: true
            },
            modes: {
                push: { quantity: 2 },
                grab: { distance: 140, links: { opacity: 1 } }
            }
        },
        particles: {
            color: { value: "#64ffda" }, // Cyan
            links: {
                color: "#8892b0", // Light Blue-Grey
                distance: 150,
                enable: true,
                opacity: 0.4,
                width: 1
            },
            collisions: { enable: false },
            move: {
                enable: true,
                speed: 0.8,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
            },
            number: {
                density: { enable: true, area: 800 },
                value: 60
            },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 2 } }
        },
        detectRetina: true
    });
}

function toggleAbstract(element) {
    var abstract = element.parentElement.nextElementSibling;
    if (abstract.style.display === "none" || !abstract.style.display) {
        abstract.style.display = "block";
        element.classList.add('active');
    } else {
        abstract.style.display = "none";
        element.classList.remove('active');
    }
}

function setupInterestTabs() {
    const tabBtns = document.querySelectorAll('.interest-tab-btn');
    const tabPanels = document.querySelectorAll('.interest-panel');

    if (!tabBtns.length || !tabPanels.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            // Hide all panels
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Show target panel
            const targetId = btn.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

function setupBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
}

function setupProjectsSlider() {
    const slider = document.querySelector('.projects-slider');
    const grid = document.querySelector('.projects-grid');
    const leftArrow = document.querySelector('.slider-arrow-left');
    const rightArrow = document.querySelector('.slider-arrow-right');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (!slider || !grid || !leftArrow || !rightArrow) return;
    
    const cards = grid.querySelectorAll('.project-card');
    const totalCards = cards.length;
    const maxIndex = totalCards - 2; // Can slide until last 2 cards are visible
    let currentIndex = 0;
    
    // Create dots for each position
    for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('aria-label', `Go to position ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToIndex(i));
        dotsContainer.appendChild(dot);
    }
    
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    
    function updateSlider() {
        // Calculate exact offset in pixels
        const containerWidth = slider.offsetWidth;
        const gap = 30; // 30px gap from CSS
        const cardWidth = (containerWidth - gap) / 2; // Each card is half container minus half gap
        const slideDistance = cardWidth + gap; // Move by one card width + one gap
        const offset = -currentIndex * slideDistance;
        grid.style.transform = `translateX(${offset}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Update arrows
        leftArrow.disabled = currentIndex === 0;
        rightArrow.disabled = currentIndex === maxIndex;
    }
    
    function goToIndex(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateSlider();
    }
    
    leftArrow.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
    
    rightArrow.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });
    
    // Update on window resize
    window.addEventListener('resize', updateSlider);
    
    updateSlider();
}

// Blog post display functionality
function showBlogPost(postId) {
    if (typeof BLOG_POSTS === 'undefined' || !BLOG_POSTS[postId]) {
        console.error('Blog post not found:', postId);
        return;
    }
    
    const post = BLOG_POSTS[postId];
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'blog-post-modal';
    modal.innerHTML = `
        <div class="blog-post-container glass-panel">
            <button class="close-post-btn" onclick="closeBlogPost()" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
            <article class="blog-post-content">
                <header class="blog-post-header">
                    <span class="post-meta">${post.date}</span>
                    <h1>${post.title}</h1>
                </header>
                <div class="blog-post-body">
                    ${post.content}
                </div>
            </article>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBlogPost();
        }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', handleEscKey);
}

function closeBlogPost() {
    const modal = document.querySelector('.blog-post-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscKey);
    }
}

function handleEscKey(e) {
    if (e.key === 'Escape') {
        closeBlogPost();
    }
}
