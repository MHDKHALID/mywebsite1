// NextAgent.tech - Blog JavaScript
// ==================================

(function() {
    'use strict';

    let currentLang = 'ar';
    let allPosts = [];
    let currentCategory = 'all';

    // ============ Initialize Blog ============
    document.addEventListener('DOMContentLoaded', () => {
        // Check saved language
        const savedLang = localStorage.getItem('language') || 'ar';
        currentLang = savedLang;

        // Load blog posts
        loadBlogPosts();

        // Setup filters
        setupFilters();

        // Setup newsletter form
        setupNewsletterForm();
    });

    // ============ Load Blog Posts ============
    async function loadBlogPosts() {
        const blogGrid = document.getElementById('blogGrid');
        
        try {
            const response = await fetch('tables/blog_posts?limit=100');
            const result = await response.json();
            
            if (result.data && result.data.length > 0) {
                allPosts = result.data.filter(post => post.published);
                displayPosts(allPosts);
            } else {
                blogGrid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <i class="fas fa-blog"></i>
                        <h3 data-ar="لا توجد مقالات حالياً" data-en="No articles at the moment">${currentLang === 'ar' ? 'لا توجد مقالات حالياً' : 'No articles at the moment'}</h3>
                        <p data-ar="تابعنا قريباً لقراءة مقالات جديدة" data-en="Stay tuned for new articles">${currentLang === 'ar' ? 'تابعنا قريباً لقراءة مقالات جديدة' : 'Stay tuned for new articles'}</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading blog posts:', error);
            blogGrid.innerHTML = `<p class="error" style="grid-column: 1 / -1;">${currentLang === 'ar' ? 'حدث خطأ في تحميل المقالات' : 'Error loading articles'}</p>`;
        }
    }

    // ============ Display Posts ============
    function displayPosts(posts) {
        const blogGrid = document.getElementById('blogGrid');
        
        if (posts.length === 0) {
            blogGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-search"></i>
                    <h3 data-ar="لا توجد مقالات في هذا التصنيف" data-en="No articles in this category">${currentLang === 'ar' ? 'لا توجد مقالات في هذا التصنيف' : 'No articles in this category'}</h3>
                </div>
            `;
            return;
        }
        
        blogGrid.innerHTML = posts.map(post => createBlogCard(post)).join('');
    }

    // ============ Create Blog Card ============
    function createBlogCard(post) {
        const title = currentLang === 'ar' ? post.title_ar : post.title_en;
        const excerpt = currentLang === 'ar' ? post.excerpt_ar : post.excerpt_en;
        const category = post.category;
        const date = formatDate(post.created_at);
        
        // Create tags HTML
        const tagsHTML = post.tags && post.tags.length > 0 
            ? `<div class="blog-card-tags">${post.tags.slice(0, 3).map(tag => `<span class="blog-tag">${tag}</span>`).join('')}</div>`
            : '';
        
        return `
            <article class="blog-card" onclick="viewPost('${post.id}')">
                <div class="blog-card-image-wrapper">
                    <img src="${post.image_url}" alt="${title}" class="blog-card-image" loading="lazy">
                    <span class="blog-card-category">${category}</span>
                </div>
                <div class="blog-card-content">
                    <h2 class="blog-card-title">${title}</h2>
                    ${tagsHTML}
                    <p class="blog-card-excerpt">${excerpt}</p>
                    <div class="blog-card-meta">
                        <span class="blog-card-author">
                            <i class="fas fa-user"></i>
                            ${post.author}
                        </span>
                        <span class="blog-card-date">
                            <i class="fas fa-calendar"></i>
                            ${date}
                        </span>
                    </div>
                </div>
            </article>
        `;
    }

    // ============ Setup Filters ============
    function setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter posts
                const category = btn.getAttribute('data-category');
                currentCategory = category;
                
                if (category === 'all') {
                    displayPosts(allPosts);
                } else {
                    const filtered = allPosts.filter(post => post.category === category);
                    displayPosts(filtered);
                }
            });
        });
    }

    // ============ View Post ============
    function viewPost(postId) {
        // In a real implementation, this would navigate to a post detail page
        // For now, we'll show an alert
        window.location.href = `post.html?id=${postId}`;
    }

    // Export viewPost to window for onclick handler
    window.viewPost = viewPost;

    // ============ Setup Newsletter Form ============
    function setupNewsletterForm() {
        const form = document.getElementById('newsletterForm');
        
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = form.querySelector('input[type="email"]').value;
                
                try {
                    // Here you would typically send to a newsletter service
                    // For demo purposes, we'll just show success message
                    alert(currentLang === 'ar' 
                        ? 'شكراً لاشتراكك! سنرسل لك أحدث المقالات قريباً.' 
                        : 'Thank you for subscribing! We\'ll send you the latest articles soon.');
                    
                    form.reset();
                } catch (error) {
                    console.error('Error subscribing:', error);
                    alert(currentLang === 'ar' 
                        ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' 
                        : 'An error occurred. Please try again.');
                }
            });
        }
    }

    // ============ Format Date ============
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        
        if (currentLang === 'ar') {
            return date.toLocaleDateString('ar-EG', options);
        } else {
            return date.toLocaleDateString('en-US', options);
        }
    }

})();