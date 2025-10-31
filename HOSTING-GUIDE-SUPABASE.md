# 🚀 دليل Supabase - الحل الموصى به

## لماذا Supabase؟
- ✅ **مجاني** حتى 500MB و 2GB bandwidth
- ✅ **قاعدة بيانات PostgreSQL** قوية وسريعة
- ✅ **API جاهز** تلقائياً لكل جدول
- ✅ **لا يحتاج برمجة backend**
- ✅ **Dashboard سهل** لإدارة البيانات
- ✅ **Real-time subscriptions** إذا احتجتها مستقبلاً

---

## 📝 الخطوات الكاملة

### 1. إنشاء مشروع Supabase

1. اذهب إلى https://supabase.com/
2. اضغط "Start your project"
3. سجل دخول بـ GitHub
4. اضغط "New Project"
5. املأ البيانات:
   - **Name**: NextAgent
   - **Database Password**: اختر كلمة سر قوية (احفظها!)
   - **Region**: Europe (West) - أقرب لفرنسا
6. اضغط "Create new project"
7. انتظر 2-3 دقائق حتى ينتهي الإعداد

---

### 2. إنشاء الجداول (Tables)

#### في Supabase Dashboard:
1. اذهب إلى **SQL Editor** (من القائمة اليسرى)
2. اضغط **New Query**
3. انسخ والصق هذا الكود:

```sql
-- ========================================
-- NextAgent.tech Database Schema
-- ========================================

-- 1. Blog Posts Table
CREATE TABLE blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt_ar TEXT,
    excerpt_en TEXT,
    content_ar TEXT,
    content_en TEXT,
    category TEXT,
    tags TEXT[],
    image_url TEXT,
    author TEXT,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    file_type TEXT,
    file_size TEXT,
    download_url TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Testimonials Table
CREATE TABLE testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    company_ar TEXT,
    company_en TEXT,
    testimonial_ar TEXT,
    testimonial_en TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Bookings Table
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT,
    date DATE,
    time TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Survey Responses Table
CREATE TABLE survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL,
    industry TEXT,
    monthly_revenue TEXT,
    challenges TEXT[],
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Contact Messages Table
CREATE TABLE contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- Indexes for Performance
-- ========================================
CREATE INDEX idx_blog_posts_published ON blog_posts(published, created_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_bookings_date ON bookings(date, time);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);

-- ========================================
-- Row Level Security (RLS) Policies
-- ========================================

-- Blog Posts: Public read access for published posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published blog posts" ON blog_posts
    FOR SELECT USING (published = true);

-- Products: Public read access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read products" ON products
    FOR SELECT USING (true);

-- Testimonials: Public read access
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read testimonials" ON testimonials
    FOR SELECT USING (true);

-- Bookings: Anyone can create
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create bookings" ON bookings
    FOR INSERT WITH CHECK (true);

-- Survey Responses: Anyone can create
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create survey responses" ON survey_responses
    FOR INSERT WITH CHECK (true);

-- Contact Messages: Anyone can create
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- ========================================
-- Functions
-- ========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

4. اضغط **Run** (Ctrl + Enter)
5. يجب أن ترى "Success. No rows returned"

---

### 3. إضافة البيانات التجريبية

#### في نفس SQL Editor:

```sql
-- ========================================
-- Sample Data for NextAgent.tech
-- ========================================

-- Insert Blog Posts
INSERT INTO blog_posts (title_ar, title_en, slug, excerpt_ar, excerpt_en, content_ar, content_en, category, tags, image_url, author, published) VALUES
('كيف تحول الذكاء الاصطناعي عملك في 2025', 'How AI Can Transform Your Business in 2025', 'ai-transform-business-2025', 'اكتشف كيف يمكن للذكاء الاصطناعي أن يحدث ثورة في عملك ويزيد من كفاءتك بنسبة تصل إلى 70% في العام القادم.', 'Discover how AI can revolutionize your business and increase efficiency by up to 70% in the coming year.', '<h2>مقدمة عن الذكاء الاصطناعي في الأعمال</h2><p>الذكاء الاصطناعي أصبح ضرورة وليس رفاهية للشركات الحديثة...</p>', '<h2>Introduction to AI in Business</h2><p>Artificial Intelligence has become a necessity, not a luxury for modern businesses...</p>', 'AI & Technology', ARRAY['الذكاء الاصطناعي', 'الأتمتة', 'التحول الرقمي'], 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', 'فريق NextAgent', true),

('5 طرق لأتمتة خدمة العملاء بالروبوتات الذكية', '5 Ways to Automate Customer Service with Chatbots', 'automate-customer-service-chatbots', 'تعلم كيفية تحسين خدمة العملاء وتقليل وقت الاستجابة بنسبة 90% باستخدام الروبوتات الذكية.', 'Learn how to improve customer service and reduce response time by 90% using AI-powered chatbots.', '<h2>لماذا الروبوتات الذكية؟</h2><p>خدمة العملاء على مدار الساعة أصبحت واقعاً...</p>', '<h2>Why Chatbots?</h2><p>24/7 customer service has become a reality...</p>', 'AI & Technology', ARRAY['روبوتات المحادثة', 'خدمة العملاء', 'الأتمتة'], 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80', 'أحمد السعيد', true),

('الذكاء الاصطناعي في الرعاية الصحية: مستقبل الطب', 'AI in Healthcare: The Future of Medicine', 'ai-healthcare-future-medicine', 'كيف يساعد الذكاء الاصطناعي في تشخيص الأمراض مبكراً وتحسين رعاية المرضى بدقة تصل إلى 95%.', 'How AI helps in early disease diagnosis and improves patient care with up to 95% accuracy.', '<h2>الذكاء الاصطناعي يغير الطب</h2><p>من تشخيص الأمراض إلى اكتشاف الأدوية الجديدة...</p>', '<h2>AI is Changing Medicine</h2><p>From disease diagnosis to discovering new drugs...</p>', 'Healthcare', ARRAY['الرعاية الصحية', 'التشخيص الطبي', 'الذكاء الاصطناعي'], 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80', 'د. سارة محمد', true),

('استراتيجيات التسويق بالذكاء الاصطناعي لعام 2025', 'AI Marketing Strategies for 2025', 'ai-marketing-strategies-2025', 'اكتشف أحدث استراتيجيات التسويق المدعومة بالذكاء الاصطناعي التي تضاعف معدلات التحويل.', 'Discover the latest AI-powered marketing strategies that double conversion rates.', '<h2>التسويق الذكي</h2><p>استخدم البيانات والذكاء الاصطناعي لاستهداف العملاء بدقة...</p>', '<h2>Smart Marketing</h2><p>Use data and AI to target customers with precision...</p>', 'Marketing', ARRAY['التسويق الرقمي', 'الذكاء الاصطناعي', 'تحليل البيانات'], 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', 'ليلى حسن', true);

-- Insert Products
INSERT INTO products (title_ar, title_en, description_ar, description_en, file_type, file_size, download_url, icon) VALUES
('دليل الذكاء الاصطناعي للمبتدئين', 'AI Beginner Guide', 'دليل شامل للمبتدئين في عالم الذكاء الاصطناعي', 'Comprehensive guide for AI beginners', 'PDF', '2.5 MB', 'https://drive.google.com/file/d/example1', '📚'),
('قالب خطة التسويق الرقمي', 'Digital Marketing Plan Template', 'قالب جاهز لإنشاء خطة تسويق رقمي احترافية', 'Ready template for professional digital marketing plan', 'DOCX', '1.2 MB', 'https://drive.google.com/file/d/example2', '📊'),
('دليل أتمتة العمليات التجارية', 'Business Process Automation Guide', 'تعلم كيفية أتمتة عملياتك التجارية', 'Learn how to automate your business processes', 'PDF', '3.1 MB', 'https://drive.google.com/file/d/example3', '⚙️');

-- Insert Testimonials
INSERT INTO testimonials (name_ar, name_en, company_ar, company_en, testimonial_ar, testimonial_en, rating, avatar) VALUES
('محمد أحمد', 'Mohammed Ahmed', 'عيادة النور الطبية', 'Al-Nour Medical Clinic', 'خدمة ممتازة! ساعدونا في أتمتة نظام الحجوزات وتحسين تجربة المرضى بشكل كبير.', 'Excellent service! They helped us automate the booking system and greatly improve patient experience.', 5, 'M'),
('فاطمة علي', 'Fatima Ali', 'صالون الجمال الملكي', 'Royal Beauty Salon', 'الروبوت الذكي الذي صمموه لنا زاد من كفاءة خدمة العملاء بنسبة 80%!', 'The chatbot they designed increased our customer service efficiency by 80%!', 5, 'F'),
('خالد محمود', 'Khaled Mahmoud', 'متجر الإلكترونيات الذكية', 'Smart Electronics Store', 'استثمار يستحق كل قرش. نظام التسويق الآلي ضاعف مبيعاتنا.', 'Worth every penny. The automated marketing system doubled our sales.', 5, 'K');
```

اضغط **Run**

---

### 4. الحصول على API Keys

1. في Supabase Dashboard، اذهب إلى **Settings** → **API**
2. ستجد:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (نسخة طويلة)

**احفظ هذه المعلومات!**

---

### 5. تعديل الموقع للعمل مع Supabase

#### أنشئ ملف جديد: `js/supabase-config.js`

```javascript
// Supabase Configuration
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

// Initialize Supabase Client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabaseClient;
```

#### أضف في كل صفحة HTML قبل `</body>`:

```html
<!-- Supabase -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/supabase-config.js"></script>

<!-- باقي السكريبتات -->
<script src="js/main.js"></script>
<script src="js/blog.js"></script>
```

---

### 6. تعديل `js/blog.js`

**استبدل الكود الحالي بهذا:**

```javascript
// NextAgent.tech - Blog JavaScript with Supabase
(function() {
    'use strict';

    let currentLang = 'ar';
    let allPosts = [];
    let currentCategory = 'all';

    document.addEventListener('DOMContentLoaded', () => {
        const savedLang = localStorage.getItem('language') || 'ar';
        currentLang = savedLang;

        loadBlogPosts();
        setupFilters();
        setupNewsletterForm();
    });

    // ============ Load Blog Posts from Supabase ============
    async function loadBlogPosts() {
        const blogGrid = document.getElementById('blogGrid');
        
        try {
            // Fetch from Supabase
            const { data, error } = await supabaseClient
                .from('blog_posts')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;

            if (data && data.length > 0) {
                allPosts = data;
                displayPosts(allPosts);
            } else {
                blogGrid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <i class="fas fa-blog"></i>
                        <h3>${currentLang === 'ar' ? 'لا توجد مقالات حالياً' : 'No articles at the moment'}</h3>
                        <p>${currentLang === 'ar' ? 'تابعنا قريباً لقراءة مقالات جديدة' : 'Stay tuned for new articles'}</p>
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
                    <h3>${currentLang === 'ar' ? 'لا توجد مقالات في هذا التصنيف' : 'No articles in this category'}</h3>
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
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
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
        window.location.href = `post.html?id=${postId}`;
    }

    // ============ Setup Newsletter Form ============
    function setupNewsletterForm() {
        const form = document.getElementById('newsletterForm');
        
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = form.querySelector('input[type="email"]').value;
                
                alert(currentLang === 'ar' 
                    ? 'شكراً لاشتراكك! سنرسل لك أحدث المقالات قريباً.' 
                    : 'Thank you for subscribing! We\'ll send you the latest articles soon.');
                
                form.reset();
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

    // Export functions
    window.viewPost = viewPost;

})();
```

---

### 7. تعديل `js/admin.js` للمقالات

**ابحث عن دالة loadBlogs() واستبدلها:**

```javascript
async function loadBlogs() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;
    
    try {
        const { data, error } = await supabaseClient
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;
        
        if (data && data.length > 0) {
            blogGrid.innerHTML = data.map(blog => `
                <div class="blog-card-admin">
                    <div class="blog-image">
                        <img src="${blog.image_url || 'https://via.placeholder.com/400x250'}" alt="${blog.title_ar}">
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
        const { count } = await supabaseClient
            .from('blog_posts')
            .select('*', { count: 'exact', head: true });
        document.getElementById('blogBadge').textContent = count || 0;
        
    } catch (error) {
        console.error('Error loading blogs:', error);
        blogGrid.innerHTML = `<div class="error-state">
            ${currentLang === 'ar' ? 'خطأ في تحميل المقالات' : 'Error loading articles'}
        </div>`;
    }
}
```

**استبدل دالة Blog Form Handler:**

```javascript
// Blog Form في setupForms()
const blogForm = document.getElementById('blogForm');
if (blogForm) {
    blogForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Convert tags to array
        data.tags = data.tags ? data.tags.split(',').map(tag => tag.trim()) : [];
        data.published = !!data.published;
        
        try {
            let result;
            if (editingBlogId) {
                // Update
                const { data: updatedData, error } = await supabaseClient
                    .from('blog_posts')
                    .update(data)
                    .eq('id', editingBlogId)
                    .select();
                
                if (error) throw error;
                result = updatedData;
            } else {
                // Insert
                const { data: insertedData, error } = await supabaseClient
                    .from('blog_posts')
                    .insert([data])
                    .select();
                
                if (error) throw error;
                result = insertedData;
            }
            
            closeModal('blogModal');
            loadBlogs();
            loadDashboardStats();
            alert(currentLang === 'ar' ? 'تم حفظ المقال بنجاح!' : 'Article saved successfully!');
        } catch (error) {
            console.error('Error saving blog post:', error);
            alert(currentLang === 'ar' ? 'حدث خطأ أثناء حفظ المقال' : 'Error saving article');
        }
    });
}
```

**استبدل editBlog() و deleteBlog():**

```javascript
// Edit Blog
async function editBlog(blogId) {
    try {
        const { data: blog, error } = await supabaseClient
            .from('blog_posts')
            .select('*')
            .eq('id', blogId)
            .single();
        
        if (error) throw error;
        
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

// Delete Blog
async function deleteBlog(blogId) {
    if (!confirm(currentLang === 'ar' ? 'هل أنت متأكد من حذف هذا المقال؟' : 'Are you sure you want to delete this article?')) {
        return;
    }
    
    try {
        const { error } = await supabaseClient
            .from('blog_posts')
            .delete()
            .eq('id', blogId);
        
        if (error) throw error;
        
        loadBlogs();
        loadDashboardStats();
        alert(currentLang === 'ar' ? 'تم حذف المقال بنجاح!' : 'Article deleted successfully!');
    } catch (error) {
        console.error('Error deleting blog post:', error);
        alert(currentLang === 'ar' ? 'حدث خطأ أثناء حذف المقال' : 'Error deleting article');
    }
}
```

---

### 8. رفع الموقع

الآن بعد تعديل الكود للعمل مع Supabase، يمكنك رفع الموقع على أي استضافة ثابتة مجانية:

#### **الخيار 1: Netlify (مُوصى به)**

1. اذهب إلى https://www.netlify.com/
2. سجل دخول بـ GitHub
3. اسحب مجلد الموقع واتركه (Drag & Drop)
4. سيتم نشر الموقع فوراً
5. ستحصل على رابط مثل: `https://nextagent.netlify.app`

#### **الخيار 2: Vercel**

```bash
npm install -g vercel
vercel
```

#### **الخيار 3: GitHub Pages**

```bash
# Create repository on GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/nextagent.git
git push -u origin main

# Enable GitHub Pages في Settings
```

---

### 9. ربط Domain الخاص بك

#### إذا اشتريت نطاق (Domain) مثل nextagent.tech:

1. في Netlify/Vercel، اذهب إلى **Domain Settings**
2. اضغط **Add custom domain**
3. أدخل `nextagent.tech`
4. ستحصل على DNS records
5. اذهب إلى مزود النطاق (GoDaddy, Namecheap, etc.)
6. أضف هذه السجلات:

```
Type    Name    Value
A       @       75.2.60.5
CNAME   www     your-site.netlify.app
```

7. انتظر 1-24 ساعة لنشر التغييرات

---

## 🎉 انتهى!

الآن موقعك يعمل مع:
- ✅ Supabase (قاعدة بيانات PostgreSQL قوية)
- ✅ استضافة ثابتة مجانية (Netlify/Vercel)
- ✅ HTTPS تلقائي
- ✅ CDN عالمي سريع
- ✅ لوحة تحكم لإدارة البيانات

---

## 📞 للدعم

إذا واجهت أي مشكلة:
1. تحقق من Console في المتصفح (F12)
2. تأكد من Supabase URL و API Key صحيحة
3. تأكد من RLS Policies مناسبة
4. راجع Supabase Logs في Dashboard

**تهانينا! موقعك الآن على استضافة مجانية مع قاعدة بيانات قوية! 🚀**
