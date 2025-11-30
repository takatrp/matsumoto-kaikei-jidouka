document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('site-nav');
    const backdrop = document.getElementById('nav-backdrop');
    const body = document.body;

    function toggleMenu() {
        const isOpen = nav.classList.contains('open');
        nav.classList.toggle('open', !isOpen);
        navToggle.classList.toggle('active', !isOpen);
        backdrop.classList.toggle('show', !isOpen); // Assuming CSS handles .show {display:block}
        body.style.overflow = isOpen ? '' : 'hidden';
        navToggle.setAttribute('aria-expanded', !isOpen);
    }

    navToggle.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('open')) toggleMenu();
        });
    });

    // --- Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lbImg = lightbox.querySelector('img');
    const lbPrev = lightbox.querySelector('.lb-prev');
    const lbNext = lightbox.querySelector('.lb-next');
    const lbClose = lightbox.querySelector('.lb-close');

    const screens = Array.from(document.querySelectorAll('.screen img'));
    let currentIndex = -1;

    function openLightbox(index) {
        if (index < 0 || index >= screens.length) return;
        currentIndex = index;
        lbImg.src = screens[index].src; // Or dataset.src if lazy loaded differently
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        body.style.overflow = '';
        currentIndex = -1;
    }

    function nextImage(direction) {
        if (currentIndex === -1) return;
        let newIndex = currentIndex + direction;
        if (newIndex < 0) newIndex = screens.length - 1;
        if (newIndex >= screens.length) newIndex = 0;
        openLightbox(newIndex);
    }

    screens.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lbPrev.addEventListener('click', (e) => { e.stopPropagation(); nextImage(-1); });
    lbNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(1); });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') nextImage(-1);
        if (e.key === 'ArrowRight') nextImage(1);
    });

    // --- PDF Viewer ---
    const pdfBtn = document.getElementById('open-pdf');
    const pdfBox = document.getElementById('pdfbox');
    const pdfClose = document.getElementById('pdf-close');
    const pdfFrame = document.getElementById('pdf-frame');

    if (pdfBtn && pdfBox) {
        pdfBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const pdfUrl = '自動化実例集.pdf'; // Ensure this path is correct
            // Simple detection for mobile to use Google Docs viewer if needed, or just direct link
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            if (isMobile) {
                // On mobile, opening a PDF in an iframe is flaky. Better to open in new tab or use Google Viewer
                // For now, let's try the Google Viewer approach for better compatibility
                // Note: This requires the PDF to be publicly accessible. If it's local, this won't work.
                // Since this is a local file test, we'll just set the src.
                pdfFrame.src = pdfUrl;
            } else {
                pdfFrame.src = pdfUrl;
            }

            pdfBox.classList.add('open');
            pdfBox.setAttribute('aria-hidden', 'false');
        });

        pdfClose.addEventListener('click', () => {
            pdfBox.classList.remove('open');
            pdfBox.setAttribute('aria-hidden', 'true');
            pdfFrame.src = '';
        });

        pdfBox.addEventListener('click', (e) => {
            if (e.target === pdfBox) pdfClose.click();
        });
    }
});
