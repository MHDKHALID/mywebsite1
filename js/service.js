// NextAgent.tech - Service Pages JavaScript
// ==========================================

let currentLang = 'ar';

// ============ Initialize Service Page ============
document.addEventListener('DOMContentLoaded', () => {
    // Check saved language
    const savedLang = localStorage.getItem('language') || 'ar';
    currentLang = savedLang;

    // Setup FAQ accordions
    setupFAQ();

    // Smooth scroll for anchor links
    setupAnchorScroll();
});

// ============ Setup FAQ Accordion ============
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ============ Setup Anchor Scroll ============
function setupAnchorScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            if (targetId === '#' || !targetId) return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}