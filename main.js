// NextAgent.tech - Main JavaScript File
// ========================================

// Global Variables
let currentLang = 'ar';

// ============ DOM Elements ============
const html = document.documentElement;
const body = document.body;
const langToggle = document.getElementById('langToggle');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const surveyForm = document.getElementById('surveyForm');
const contactForm = document.getElementById('contactForm');

// ============ Initialize on Page Load ============
document.addEventListener('DOMContentLoaded', () => {
    // Check saved language preference
    const savedLang = localStorage.getItem('language') || 'ar';
    currentLang = savedLang;
    applyLanguage(currentLang);

    // Load dynamic content
    loadProducts();
    loadTestimonials();

    // Setup event listeners
    setupEventListeners();

    // Smooth scroll for navigation links
    setupSmoothScroll();

    // Header scroll effect
    setupHeaderScroll();
});

// ============ Language Toggle ============
function applyLanguage(lang) {
    currentLang = lang;
    
    if (lang === 'ar') {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        body.setAttribute('dir', 'rtl');
        langToggle.querySelector('.lang-text').textContent = 'EN';
    } else {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        body.setAttribute('dir', 'ltr');
        langToggle.querySelector('.lang-text').textContent = 'AR';
    }

    // Update all translatable elements
    updateTranslations();
    
    // Save preference
    localStorage.setItem('language', lang);
}

function updateTranslations() {
    const elements = document.querySelectorAll('[data-ar][data-en]');
    
    elements.forEach(element => {
        const arText = element.getAttribute('data-ar');
        const enText = element.getAttribute('data-en');
        
        if (currentLang === 'ar') {
            element.textContent = arText;
        } else {
            element.textContent = enText;
        }
    });
}

// ============ Load Products from API ============
async function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    try {
        const response = await fetch('tables/products?limit=100');
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
            productsGrid.innerHTML = '';
            
            result.data.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });
        } else {
            productsGrid.innerHTML = `<p class="no-data" data-ar="لا توجد منتجات متاحة حالياً" data-en="No products available at the moment">${currentLang === 'ar' ? 'لا توجد منتجات متاحة حالياً' : 'No products available at the moment'}</p>`;
        }
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = `<p class="error" data-ar="حدث خطأ أثناء تحميل المنتجات" data-en="Error loading products">${currentLang === 'ar' ? 'حدث خطأ أثناء تحميل المنتجات' : 'Error loading products'}</p>`;
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const title = currentLang === 'ar' ? product.title_ar : product.title_en;
    const description = currentLang === 'ar' ? product.description_ar : product.description_en;
    
    card.innerHTML = `
        <div class="product-icon">${product.icon}</div>
        <h3>${title}</h3>
        <p>${description}</p>
        <div class="product-meta">
            <span><i class="fas fa-file"></i> ${product.file_type}</span>
            <span><i class="fas fa-download"></i> ${product.file_size}</span>
        </div>
        <a href="${product.download_url}" target="_blank" class="download-btn" data-ar="تحميل الملف" data-en="Download File">
            <i class="fas fa-download"></i>
            <span>${currentLang === 'ar' ? 'تحميل الملف' : 'Download File'}</span>
        </a>
    `;
    
    return card;
}

// ============ Load Testimonials from API ============
async function loadTestimonials() {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    
    try {
        const response = await fetch('tables/testimonials?limit=100');
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
            testimonialsGrid.innerHTML = '';
            
            result.data.forEach(testimonial => {
                const testimonialCard = createTestimonialCard(testimonial);
                testimonialsGrid.appendChild(testimonialCard);
            });
        } else {
            testimonialsGrid.innerHTML = `<p class="no-data" data-ar="لا توجد آراء متاحة حالياً" data-en="No testimonials available at the moment">${currentLang === 'ar' ? 'لا توجد آراء متاحة حالياً' : 'No testimonials available at the moment'}</p>`;
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
        testimonialsGrid.innerHTML = `<p class="error" data-ar="حدث خطأ أثناء تحميل الآراء" data-en="Error loading testimonials">${currentLang === 'ar' ? 'حدث خطأ أثناء تحميل الآراء' : 'Error loading testimonials'}</p>`;
    }
}

function createTestimonialCard(testimonial) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    
    const name = currentLang === 'ar' ? testimonial.name_ar : testimonial.name_en;
    const company = currentLang === 'ar' ? testimonial.company_ar : testimonial.company_en;
    const text = currentLang === 'ar' ? testimonial.testimonial_ar : testimonial.testimonial_en;
    
    const stars = '⭐'.repeat(testimonial.rating);
    
    card.innerHTML = `
        <div class="testimonial-content">
            <p class="testimonial-text">${text}</p>
            <div class="testimonial-author">
                <div class="author-avatar">${testimonial.avatar}</div>
                <div class="author-info">
                    <h4>${name}</h4>
                    <p>${company}</p>
                </div>
            </div>
            <div class="testimonial-rating">${stars}</div>
        </div>
    `;
    
    return card;
}

// ============ Survey Form Submission ============
async function handleSurveySubmit(e) {
    e.preventDefault();
    
    const submitBtn = surveyForm.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('surveyMessage');
    const originalBtnText = submitBtn.textContent;
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
    
    const formData = {
        company_name: document.getElementById('companyName').value,
        industry: document.getElementById('industry').value,
        full_name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        revenue: document.getElementById('revenue').value,
        challenges: document.getElementById('challenges').value,
        goals: document.getElementById('goals').value
    };
    
    try {
        const response = await fetch('tables/survey_responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            messageDiv.className = 'form-message success';
            messageDiv.textContent = currentLang === 'ar' 
                ? 'شكراً لك! تم إرسال الاستبيان بنجاح. سنتواصل معك قريباً.'
                : 'Thank you! Survey submitted successfully. We will contact you soon.';
            messageDiv.style.display = 'block';
            
            // Reset form
            surveyForm.reset();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.error('Error submitting survey:', error);
        messageDiv.className = 'form-message error';
        messageDiv.textContent = currentLang === 'ar'
            ? 'حدث خطأ أثناء إرسال الاستبيان. يرجى المحاولة مرة أخرى.'
            : 'Error submitting survey. Please try again.';
        messageDiv.style.display = 'block';
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}

// ============ Contact Form Submission ============
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const messageDiv = contactForm.querySelector('.form-message') || createMessageDiv(contactForm);
    const originalBtnText = submitBtn.textContent;
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
    
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
    };
    
    try {
        const response = await fetch('tables/contact_messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            messageDiv.className = 'form-message success';
            messageDiv.textContent = currentLang === 'ar'
                ? 'شكراً لك! تم إرسال رسالتك بنجاح. سنرد عليك في أقرب وقت.'
                : 'Thank you! Your message has been sent successfully. We will reply soon.';
            messageDiv.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.error('Error submitting contact form:', error);
        messageDiv.className = 'form-message error';
        messageDiv.textContent = currentLang === 'ar'
            ? 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.'
            : 'Error sending message. Please try again.';
        messageDiv.style.display = 'block';
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}

function createMessageDiv(form) {
    const div = document.createElement('div');
    div.className = 'form-message';
    form.appendChild(div);
    return div;
}

// ============ Event Listeners Setup ============
function setupEventListeners() {
    // Language toggle
    langToggle.addEventListener('click', () => {
        const newLang = currentLang === 'ar' ? 'en' : 'ar';
        applyLanguage(newLang);
    });

    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Form submissions
    if (surveyForm) {
        surveyForm.addEventListener('submit', handleSurveySubmit);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// ============ Smooth Scroll ============
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            if (targetId === '#') return;
            
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

// ============ Header Scroll Effect ============
function setupHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    });
}

// ============ Utility Functions ============

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    if (currentLang === 'ar') {
        return date.toLocaleDateString('ar-EG', options);
    } else {
        return date.toLocaleDateString('en-US', options);
    }
}

// Debounce function for performance
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

// ============ Console Welcome Message ============
console.log('%c🤖 NextAgent.tech', 'font-size: 24px; font-weight: bold; color: #fca311;');
console.log('%cWelcome to NextAgent.tech - AI Agents & Automation Platform', 'font-size: 14px; color: #274c77;');
console.log('%cFor inquiries: salse@nextagent.tech', 'font-size: 12px; color: #666;');