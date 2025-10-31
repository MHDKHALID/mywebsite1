// NextAgent.tech - Admin Dashboard JavaScript
// =============================================

(function() {
    'use strict';

    // Global Variables
    let currentLang = 'ar';
    let editingProductId = null;
    let editingTestimonialId = null;
    let editingBlogId = null;

    // ============ Initialize Admin Dashboard ============
    document.addEventListener('DOMContentLoaded', () => {
        // Check saved language
        const savedLang = localStorage.getItem('language') || 'ar';
        currentLang = savedLang;

    // Load all data
    loadDashboardStats();
    loadProducts();
    loadTestimonials();
    loadSurveys();
    loadMessages();
    loadBlogs();
    
    // Setup navigation
    setupAdminNavigation();
    
    // Setup modals
    setupModals();
    
    // Setup forms
    setupForms();
});

// ============ Admin Navigation ============
function setupAdminNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const sectionId = item.getAttribute('data-section');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding section
            const sections = document.querySelectorAll('.admin-section');
            sections.forEach(section => section.classList.remove('active'));
            
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// ============ Load Dashboard Statistics ============
async function loadDashboardStats() {
    try {
        // Load products count
        const productsRes = await fetch('tables/products?limit=1');
        const productsData = await productsRes.json();
        document.getElementById('totalProducts').textContent = productsData.total || 0;
        document.getElementById('productsBadge').textContent = productsData.total || 0;

        // Load testimonials count
        const testimonialsRes = await fetch('tables/testimonials?limit=1');
        const testimonialsData = await testimonialsRes.json();
        document.getElementById('totalTestimonials').textContent = testimonialsData.total || 0;
        document.getElementById('testimonialsBadge').textContent = testimonialsData.total || 0;

        // Load surveys count
        const surveysRes = await fetch('tables/survey_responses?limit=1');
        const surveysData = await surveysRes.json();
        document.getElementById('totalSurveys').textContent = surveysData.total || 0;
        document.getElementById('surveysBadge').textContent = surveysData.total || 0;

        // Load messages count
        const messagesRes = await fetch('tables/contact_messages?limit=1');
        const messagesData = await messagesRes.json();
        document.getElementById('totalMessages').textContent = messagesData.total || 0;
        document.getElementById('messagesBadge').textContent = messagesData.total || 0;

        // Load blogs count
        try {
            const blogsRes = await fetch('tables/blog_posts?limit=1');
            const blogsData = await blogsRes.json();
            const blogBadge = document.getElementById('blogBadge');
            if (blogBadge) {
                blogBadge.textContent = blogsData.total || 0;
            }
        } catch (error) {
            console.log('Blog table not loaded yet');
        }

        // Load recent activity
        loadRecentActivity();
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// ============ Load Recent Activity ============
async function loadRecentActivity() {
    const activityList = document.getElementById('recentActivityList');
    
    try {
        // Get recent surveys
        const surveysRes = await fetch('tables/survey_responses?limit=3&sort=-created_at');
        const surveysData = await surveysRes.json();
        
        // Get recent messages
        const messagesRes = await fetch('tables/contact_messages?limit=3&sort=-created_at');
        const messagesData = await messagesRes.json();
        
        const activities = [];
        
        // Add surveys
        if (surveysData.data) {
            surveysData.data.forEach(survey => {
                activities.push({
                    icon: '📋',
                    iconBg: '#fca311',
                    title: currentLang === 'ar' ? 'استبيان جديد' : 'New Survey',
                    description: survey.company_name,
                    time: formatTimeAgo(survey.created_at)
                });
            });
        }
        
        // Add messages
        if (messagesData.data) {
            messagesData.data.forEach(message => {
                activities.push({
                    icon: '✉️',
                    iconBg: '#274c77',
                    title: currentLang === 'ar' ? 'رسالة جديدة' : 'New Message',
                    description: message.name,
                    time: formatTimeAgo(message.created_at)
                });
            });
        }
        
        // Sort by time
        activities.sort((a, b) => a.time.localeCompare(b.time));
        
        if (activities.length > 0) {
            activityList.innerHTML = activities.slice(0, 5).map(activity => `
                <div class="activity-item">
                    <div class="activity-icon" style="background: ${activity.iconBg}; color: white;">
                        ${activity.icon}
                    </div>
                    <div class="activity-content">
                        <h4>${activity.title}</h4>
                        <p>${activity.description}</p>
                    </div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            `).join('');
        } else {
            activityList.innerHTML = `<p class="empty-state">${currentLang === 'ar' ? 'لا يوجد نشاط حديث' : 'No recent activity'}</p>`;
        }
        
    } catch (error) {
        console.error('Error loading recent activity:', error);
        activityList.innerHTML = `<p class="error">${currentLang === 'ar' ? 'حدث خطأ في التحميل' : 'Error loading activity'}</p>`;
    }
}

// ============ Load Products ============
async function loadProducts() {
    const tableBody = document.getElementById('productsTableBody');
    
    try {
        const response = await fetch('tables/products?limit=100');
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
            tableBody.innerHTML = result.data.map(product => {
                const title = currentLang === 'ar' ? product.title_ar : product.title_en;
                const date = formatDate(product.created_at);
                
                return `
                    <tr>
                        <td style="font-size: 2rem;">${product.icon}</td>
                        <td><strong>${title}</strong></td>
                        <td><span class="badge" style="background: var(--primary-color); color: white; padding: 5px 10px; border-radius: 5px;">${product.file_type}</span></td>
                        <td>${product.file_size}</td>
                        <td>${date}</td>
                        <td>
                            <div class="table-actions">
                                <button class="btn-icon edit" onclick="editProduct('${product.id}')" title="${currentLang === 'ar' ? 'تعديل' : 'Edit'}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon delete" onclick="deleteProduct('${product.id}')" title="${currentLang === 'ar' ? 'حذف' : 'Delete'}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        } else {
            tableBody.innerHTML = `<tr><td colspan="6" class="empty-state">${currentLang === 'ar' ? 'لا توجد منتجات' : 'No products found'}</td></tr>`;
        }
    } catch (error) {
        console.error('Error loading products:', error);
        tableBody.innerHTML = `<tr><td colspan="6" class="error">${currentLang === 'ar' ? 'حدث خطأ في التحميل' : 'Error loading products'}</td></tr>`;
    }
}

// ============ Load Testimonials ============
async function loadTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    
    try {
        const response = await fetch('tables/testimonials?limit=100');
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
            grid.innerHTML = result.data.map(testimonial => {
                const name = currentLang === 'ar' ? testimonial.name_ar : testimonial.name_en;
                const company = currentLang === 'ar' ? testimonial.company_ar : testimonial.company_en;
                const text = currentLang === 'ar' ? testimonial.testimonial_ar : testimonial.testimonial_en;
                const stars = '⭐'.repeat(testimonial.rating);
                
                return `
                    <div class="testimonial-card-admin">
                        <div class="card-actions">
                            <button class="btn-icon edit" onclick="editTestimonial('${testimonial.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon delete" onclick="deleteTestimonial('${testimonial.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="testimonial-content">
                            <p class="testimonial-text">${text.substring(0, 150)}...</p>
                            <div class="testimonial-author">
                                <div class="author-avatar">${testimonial.avatar}</div>
                                <div class="author-info">
                                    <h4>${name}</h4>
                                    <p>${company}</p>
                                </div>
                            </div>
                            <div class="testimonial-rating">${stars}</div>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            grid.innerHTML = `<p class="empty-state">${currentLang === 'ar' ? 'لا توجد آراء' : 'No testimonials found'}</p>`;
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
        grid.innerHTML = `<p class="error">${currentLang === 'ar' ? 'حدث خطأ في التحميل' : 'Error loading testimonials'}</p>`;
    }
}

// ============ Load Surveys ============
async function loadSurveys() {
    const tableBody = document.getElementById('surveysTableBody');
    
    try {
        const response = await fetch('tables/survey_responses?limit=100');
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
            tableBody.innerHTML = result.data.map(survey => {
                const date = formatDate(survey.created_at);
                
                return `
                    <tr>
                        <td><strong>${survey.company_name}</strong></td>
                        <td>${survey.industry}</td>
                        <td>${survey.full_name}</td>
                        <td>${survey.email}</td>
                        <td>${survey.revenue}</td>
                        <td>${date}</td>
                        <td>
                            <div class="table-actions">
                                <button class="btn-icon view" onclick="viewSurvey('${survey.id}')" title="${currentLang === 'ar' ? 'عرض' : 'View'}">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-icon delete" onclick="deleteSurvey('${survey.id}')" title="${currentLang === 'ar' ? 'حذف' : 'Delete'}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        } else {
            tableBody.innerHTML = `<tr><td colspan="7" class="empty-state">${currentLang === 'ar' ? 'لا توجد استبيانات' : 'No surveys found'}</td></tr>`;
        }
    } catch (error) {
        console.error('Error loading surveys:', error);
        tableBody.innerHTML = `<tr><td colspan="7" class="error">${currentLang === 'ar' ? 'حدث خطأ في التحميل' : 'Error loading surveys'}</td></tr>`;
    }
}

// ============ Load Messages ============
async function loadMessages() {
    const messagesList = document.getElementById('messagesList');
    
    try {
        const response = await fetch('tables/contact_messages?limit=100');
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
            messagesList.innerHTML = result.data.map(message => {
                const date = formatDate(message.created_at);
                
                return `
                    <div class="message-card" onclick="viewMessage('${message.id}')">
                        <div class="message-header">
                            <span class="message-sender">${message.name} - ${message.email}</span>
                            <span class="message-date">${date}</span>
                        </div>
                        <div class="message-subject">${message.subject}</div>
                        <div class="message-content">${message.message.substring(0, 150)}...</div>
                    </div>
                `;
            }).join('');
        } else {
            messagesList.innerHTML = `<p class="empty-state">${currentLang === 'ar' ? 'لا توجد رسائل' : 'No messages found'}</p>`;
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        messagesList.innerHTML = `<p class="error">${currentLang === 'ar' ? 'حدث خطأ في التحميل' : 'Error loading messages'}</p>`;
    }
}

// ============ Setup Modals ============
function setupModals() {
    // Add Product Button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            editingProductId = null;
            document.getElementById('productForm').reset();
            document.getElementById('productModalTitle').textContent = currentLang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product';
            openModal('productModal');
        });
    }

    // Add Testimonial Button
    const addTestimonialBtn = document.getElementById('addTestimonialBtn');
    if (addTestimonialBtn) {
        addTestimonialBtn.addEventListener('click', () => {
            editingTestimonialId = null;
            document.getElementById('testimonialForm').reset();
            document.getElementById('testimonialModalTitle').textContent = currentLang === 'ar' ? 'إضافة رأي جديد' : 'Add New Testimonial';
            openModal('testimonialModal');
        });
    }

    // Add Blog Button
    const addBlogBtn = document.getElementById('addBlogBtn');
    if (addBlogBtn) {
        addBlogBtn.addEventListener('click', () => {
            editingBlogId = null;
            document.getElementById('blogForm').reset();
            document.getElementById('blogModalTitle').textContent = currentLang === 'ar' ? 'إضافة مقال جديد' : 'Add New Article';
            openModal('blogModal');
        });
    }

    // Close modal buttons
    document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
                const modal = e.target.closest('.modal');
                if (modal) closeModal(modal.id);
            } else {
                const modalId = btn.getAttribute('data-modal');
                if (modalId && btn.classList.contains('btn-secondary')) {
                    closeModal(modalId);
                }
            }
        });
    });

    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

// ============ Setup Forms ============
function setupForms() {
    // Product Form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        try {
            let response;
            if (editingProductId) {
                response = await fetch(`tables/products/${editingProductId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                response = await fetch('tables/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            
            if (response.ok) {
                closeModal('productModal');
                loadProducts();
                loadDashboardStats();
                alert(currentLang === 'ar' ? 'تم الحفظ بنجاح!' : 'Saved successfully!');
            } else {
                throw new Error('Save failed');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert(currentLang === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving product');
        }
        });
    }

    // Testimonial Form
    const testimonialForm = document.getElementById('testimonialForm');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.rating = parseInt(data.rating);
        
        try {
            let response;
            if (editingTestimonialId) {
                response = await fetch(`tables/testimonials/${editingTestimonialId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                response = await fetch('tables/testimonials', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            
            if (response.ok) {
                closeModal('testimonialModal');
                loadTestimonials();
                loadDashboardStats();
                alert(currentLang === 'ar' ? 'تم الحفظ بنجاح!' : 'Saved successfully!');
            } else {
                throw new Error('Save failed');
            }
        } catch (error) {
            console.error('Error saving testimonial:', error);
            alert(currentLang === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving testimonial');
        }
        });
    }

    // Blog Form
    const blogForm = document.getElementById('blogForm');
    if (blogForm) {
        blogForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            // Convert tags to array
            data.tags = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];
            
            // Convert published to boolean
            data.published = !!data.published;
            
            try {
                let response;
                if (editingBlogId) {
                    response = await fetch(`tables/blog_posts/${editingBlogId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                } else {
                    response = await fetch('tables/blog_posts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                }
                
                if (response.ok) {
                    closeModal('blogModal');
                    loadBlogs();
                    loadDashboardStats();
                    alert(currentLang === 'ar' ? 'تم حفظ المقال بنجاح!' : 'Article saved successfully!');
                } else {
                    throw new Error('Save failed');
                }
            } catch (error) {
                console.error('Error saving blog post:', error);
                alert(currentLang === 'ar' ? 'حدث خطأ أثناء حفظ المقال' : 'Error saving article');
            }
        });
    }
}

// ============ Modal Functions ============
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============ CRUD Functions ============

// Edit Product
async function editProduct(productId) {
    try {
        const response = await fetch(`tables/products/${productId}`);
        const product = await response.json();
        
        editingProductId = productId;
        
        const form = document.getElementById('productForm');
        form.elements['title_ar'].value = product.title_ar;
        form.elements['title_en'].value = product.title_en;
        form.elements['description_ar'].value = product.description_ar;
        form.elements['description_en'].value = product.description_en;
        form.elements['file_type'].value = product.file_type;
        form.elements['file_size'].value = product.file_size;
        form.elements['download_url'].value = product.download_url;
        form.elements['icon'].value = product.icon;
        
        document.getElementById('productModalTitle').textContent = currentLang === 'ar' ? 'تعديل المنتج' : 'Edit Product';
        openModal('productModal');
    } catch (error) {
        console.error('Error loading product:', error);
        alert(currentLang === 'ar' ? 'حدث خطأ في التحميل' : 'Error loading product');
    }
}

// Delete Product
async function deleteProduct(productId) {
    if (!confirm(currentLang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
        return;
    }
    
    try {
        const response = await fetch(`tables/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadProducts();
            loadDashboardStats();
            alert(currentLang === 'ar' ? 'تم الحذف بنجاح!' : 'Deleted successfully!');
        } else {
            throw new Error('Delete failed');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert(currentLang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Error deleting product');
    }
}

// Edit Testimonial
async function editTestimonial(testimonialId) {
    try {
        const response = await fetch(`tables/testimonials/${testimonialId}`);
        const testimonial = await response.json();
        
        editingTestimonialId = testimonialId;
        
        const form = document.getElementById('testimonialForm');
        form.elements['name_ar'].value = testimonial.name_ar;
        form.elements['name_en'].value = testimonial.name_en;
        form.elements['company_ar'].value = testimonial.company_ar;
        form.elements['company_en'].value = testimonial.company_en;
        form.elements['testimonial_ar'].value = testimonial.testimonial_ar;
        form.elements['testimonial_en'].value = testimonial.testimonial_en;
        form.elements['rating'].value = testimonial.rating;
        form.elements['avatar'].value = testimonial.avatar;
        
        document.getElementById('testimonialModalTitle').textContent = currentLang === 'ar' ? 'تعديل الرأي' : 'Edit Testimonial';
        openModal('testimonialModal');
    } catch (error) {
        console.error('Error loading testimonial:', error);
        alert(currentLang === 'ar' ? 'حدث خطأ في التحميل' : 'Error loading testimonial');
    }
}

// Delete Testimonial
async function deleteTestimonial(testimonialId) {
    if (!confirm(currentLang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
        return;
    }
    
    try {
        const response = await fetch(`tables/testimonials/${testimonialId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadTestimonials();
            loadDashboardStats();
            alert(currentLang === 'ar' ? 'تم الحذف بنجاح!' : 'Deleted successfully!');
        } else {
            throw new Error('Delete failed');
        }
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        alert(currentLang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Error deleting testimonial');
    }
}

// View Survey
async function viewSurvey(surveyId) {
    try {
        const response = await fetch(`tables/survey_responses/${surveyId}`);
        const survey = await response.json();
        
        alert(`
الشركة: ${survey.company_name}
النشاط: ${survey.industry}
الاسم: ${survey.full_name}
البريد: ${survey.email}
الهاتف: ${survey.phone}
الدخل: ${survey.revenue}
التحديات: ${survey.challenges}
الأهداف: ${survey.goals || 'لا يوجد'}
        `);
    } catch (error) {
        console.error('Error loading survey:', error);
        alert(currentLang === 'ar' ? 'حدث خطأ في التحميل' : 'Error loading survey');
    }
}

// Delete Survey
async function deleteSurvey(surveyId) {
    if (!confirm(currentLang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
        return;
    }
    
    try {
        const response = await fetch(`tables/survey_responses/${surveyId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadSurveys();
            loadDashboardStats();
            alert(currentLang === 'ar' ? 'تم الحذف بنجاح!' : 'Deleted successfully!');
        } else {
            throw new Error('Delete failed');
        }
    } catch (error) {
        console.error('Error deleting survey:', error);
        alert(currentLang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Error deleting survey');
    }
}

// View Message
async function viewMessage(messageId) {
    try {
        const response = await fetch(`tables/contact_messages/${messageId}`);
        const message = await response.json();
        
        alert(`
من: ${message.name}
البريد: ${message.email}
الموضوع: ${message.subject}

الرسالة:
${message.message}
        `);
    } catch (error) {
        console.error('Error loading message:', error);
        alert(currentLang === 'ar' ? 'حدث خطأ في التحميل' : 'Error loading message');
    }
}

// ============ Utility Functions ============
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US', options);
}

function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} ${currentLang === 'ar' ? 'يوم' : 'day'}${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} ${currentLang === 'ar' ? 'ساعة' : 'hour'}${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} ${currentLang === 'ar' ? 'دقيقة' : 'minute'}${minutes > 1 ? 's' : ''}`;
    return currentLang === 'ar' ? 'الآن' : 'now';
}

// ============ Load Blogs ============
async function loadBlogs() {
    const blogGrid = document.getElementById('blogGrid');
    
    if (!blogGrid) return;
    
    try {
        const response = await fetch('tables/blog_posts?limit=100&sort=-created_at');
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            blogGrid.innerHTML = data.data.map(blog => `
                <div class="blog-card-admin">
                    <div class="blog-image">
                        <img src="${blog.featured_image || 'https://via.placeholder.com/400x250'}" alt="${blog.title_ar}">
                        <span class="blog-category">${blog.category}</span>
                    </div>
                    <div class="blog-content">
                        <h3>${blog.title_ar}</h3>
                        <p class="blog-excerpt">${blog.excerpt_ar}</p>
                        <div class="blog-meta">
                            <span><i class="fas fa-user"></i> ${blog.author}</span>
                            <span><i class="fas fa-calendar"></i> ${formatDate(blog.created_at)}</span>
                        </div>
                        <div class="blog-actions">
                            <button class="btn btn-sm btn-secondary" onclick="editBlog('${blog.id}')">
                                <i class="fas fa-edit"></i> ${currentLang === 'ar' ? 'تعديل' : 'Edit'}
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteBlog('${blog.id}')">
                                <i class="fas fa-trash"></i> ${currentLang === 'ar' ? 'حذف' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            blogGrid.innerHTML = `<div class="empty-state">
                <i class="fas fa-blog"></i>
                <p>${currentLang === 'ar' ? 'لا توجد مقالات بعد' : 'No articles yet'}</p>
            </div>`;
        }
        
        // Update badge
        document.getElementById('blogBadge').textContent = data.total || 0;
        
    } catch (error) {
        console.error('Error loading blogs:', error);
        blogGrid.innerHTML = `<div class="error-state">${currentLang === 'ar' ? 'خطأ في تحميل المقالات' : 'Error loading articles'}</div>`;
    }
}

    // ============ Blog CRUD Functions ============
    
    // Edit Blog Post
    async function editBlog(blogId) {
        try {
            const response = await fetch(`tables/blog_posts/${blogId}`);
            const blog = await response.json();
            
            editingBlogId = blogId;
            
            const form = document.getElementById('blogForm');
            form.elements['title_ar'].value = blog.title_ar;
            form.elements['title_en'].value = blog.title_en;
            form.elements['slug'].value = blog.slug;
            form.elements['excerpt_ar'].value = blog.excerpt_ar;
            form.elements['excerpt_en'].value = blog.excerpt_en;
            form.elements['content_ar'].value = blog.content_ar;
            form.elements['content_en'].value = blog.content_en;
            form.elements['category'].value = blog.category;
            form.elements['author'].value = blog.author;
            form.elements['image_url'].value = blog.image_url;
            form.elements['tags'].value = Array.isArray(blog.tags) ? blog.tags.join(', ') : '';
            form.elements['published'].checked = blog.published;
            
            document.getElementById('blogModalTitle').textContent = currentLang === 'ar' ? 'تعديل المقال' : 'Edit Article';
            openModal('blogModal');
        } catch (error) {
            console.error('Error loading blog post:', error);
            alert(currentLang === 'ar' ? 'حدث خطأ في تحميل المقال' : 'Error loading article');
        }
    }
    
    // Delete Blog Post
    async function deleteBlog(blogId) {
        if (!confirm(currentLang === 'ar' ? 'هل أنت متأكد من حذف هذا المقال؟' : 'Are you sure you want to delete this article?')) {
            return;
        }
        
        try {
            const response = await fetch(`tables/blog_posts/${blogId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadBlogs();
                loadDashboardStats();
                alert(currentLang === 'ar' ? 'تم حذف المقال بنجاح!' : 'Article deleted successfully!');
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            console.error('Error deleting blog post:', error);
            alert(currentLang === 'ar' ? 'حدث خطأ أثناء حذف المقال' : 'Error deleting article');
        }
    }

    // ============ Export Global Functions ============
    // Make CRUD functions available globally for onclick handlers
    window.editProduct = editProduct;
    window.deleteProduct = deleteProduct;
    window.editTestimonial = editTestimonial;
    window.deleteTestimonial = deleteTestimonial;
    window.deleteSurvey = deleteSurvey;
    window.editBlog = editBlog;
    window.deleteBlog = deleteBlog;

})();