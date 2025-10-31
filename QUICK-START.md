# 🚀 NextAgent.tech - Quick Start Guide

Welcome to NextAgent.tech! This guide will help you get started quickly.

---

## 📍 Website Structure

### Main Pages

1. **Homepage** (`index.html`)
   - URL: `/` or `/index.html`
   - Main landing page with all services
   - Survey form
   - Contact information

2. **Blog** (`blog.html`)
   - URL: `/blog.html`
   - Articles about AI & Automation
   - Category filtering
   - Newsletter subscription

3. **Booking** (`booking.html`)
   - URL: `/booking.html`
   - Book free consultation
   - Multi-step form
   - Service selection

4. **Admin Dashboard** (`admin.html`)
   - URL: `/admin.html`
   - Manage all content
   - View submissions
   - Statistics dashboard

---

## 🎯 For Website Visitors

### How to Navigate

1. **Language Switching**
   - Click the language button (AR/EN) in the top right
   - The website will switch between Arabic and English
   - Your preference is saved automatically

2. **Booking a Consultation**
   - Click "احجز استشارة" / "Book Consultation"
   - Fill out the 2-step form
   - Select your preferred service and time
   - Submit and receive confirmation

3. **Reading the Blog**
   - Go to Blog page
   - Filter by category (AI, Healthcare, Marketing, etc.)
   - Click any article to read
   - Subscribe to newsletter for updates

4. **Downloading Free Resources**
   - Scroll to "المنتجات" / "Products" section
   - Click on any product card
   - Click "تحميل الملف" / "Download File"
   - Resources open in Google Drive

5. **Contact Us**
   - Use the contact form at the bottom
   - Call: +33 376 905 001
   - Email: salse@nextagent.tech
   - WhatsApp: Click the floating green button

---

## 🛠️ For Admin Users

### Accessing Admin Dashboard

1. Navigate to: `/admin.html`
2. The dashboard loads automatically

### Managing Products

1. Click "المنتجات" / "Products" in sidebar
2. Click "إضافة منتج جديد" / "Add New Product"
3. Fill in the form (Arabic & English titles required)
4. Enter Google Drive download link
5. Click "حفظ" / "Save"

**Editing Products:**
- Click the edit icon (✏️) on any product
- Modify the information
- Save changes

**Deleting Products:**
- Click the delete icon (🗑️)
- Confirm deletion

### Managing Testimonials

1. Click "آراء العملاء" / "Testimonials"
2. Click "إضافة رأي جديد" / "Add New Testimonial"
3. Fill in client information
4. Enter testimonial text (Arabic & English)
5. Select rating (1-5 stars)
6. Save

### Viewing Survey Responses

1. Click "الاستبيانات" / "Surveys"
2. See all survey submissions
3. Click "عرض" / "View" to see full details
4. Export to CSV (optional)

### Viewing Contact Messages

1. Click "الرسائل" / "Messages"
2. Browse all contact form submissions
3. Click any message to view details

### Managing Blog Posts

1. Click "المدونة" / "Blog"
2. View all published articles
3. Edit or delete existing posts
4. Add new articles with:
   - Bilingual titles and content
   - Category selection
   - Tags
   - Featured image URL

---

## 📊 Understanding the Dashboard

### Statistics Cards

**Products Badge:**
- Shows total number of downloadable products
- Updates in real-time

**Testimonials Badge:**
- Total client testimonials
- All published reviews

**Surveys Badge:**
- Total consultation requests
- From survey form submissions

**Messages Badge:**
- Total contact form messages
- From contact section

### Recent Activity

Shows the latest:
- Survey submissions
- Contact messages
- Ordered by date (newest first)

---

## 🎨 Customization Guide

### Changing Colors

The website uses 3 main colors defined in `css/style.css`:

```css
--primary-color: #fca311;    /* Orange - Main CTA */
--secondary-color: #274c77;  /* Blue - Headers */
--tertiary-color: #283618;   /* Green - Accents */
```

To change:
1. Open `css/style.css`
2. Find `:root` section at the top
3. Replace hex color codes
4. Save file

### Updating Contact Information

**Email:**
- Search for: `salse@nextagent.tech`
- Replace in: `index.html`, `blog.html`, `booking.html`

**Phone:**
- Search for: `+33 376 905 001`
- Replace in all HTML files

**Address:**
- Search for: "باريس - فرنسا" / "Paris - France"
- Update in footer sections

### Adding Your Logo

1. Replace the emoji `🤖` in:
   - `.logo-icon` elements
2. OR upload your logo image:
   - Add to `/images/` folder
   - Update HTML: `<img src="images/logo.png" alt="NextAgent">`

---

## 🔌 API Integration

### RESTful Endpoints

All data is managed through RESTful API:

**Get All Products:**
```javascript
fetch('tables/products?limit=100')
```

**Get Single Product:**
```javascript
fetch('tables/products/{id}')
```

**Create Product:**
```javascript
fetch('tables/products', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(productData)
})
```

**Update Product:**
```javascript
fetch('tables/products/{id}', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(updatedData)
})
```

**Delete Product:**
```javascript
fetch('tables/products/{id}', {
    method: 'DELETE'
})
```

Same pattern applies to all tables:
- `tables/testimonials`
- `tables/survey_responses`
- `tables/contact_messages`
- `tables/blog_posts`
- `tables/bookings`

---

## 📱 Mobile Optimization

### Mobile Menu

- Hamburger menu appears on screens < 992px
- Tap to open/close navigation
- Smooth slide-in animation
- Touch-friendly buttons

### Mobile Forms

- Stack vertically on small screens
- Large touch targets
- Auto-scroll to form sections
- Validation feedback

### WhatsApp Button

- Fixed position on mobile
- Always accessible
- Opens WhatsApp app directly
- Positioned for thumb reach

---

## 🔍 SEO Best Practices

### Meta Tags (Already Included)

✅ Page titles
✅ Meta descriptions
✅ Open Graph tags (Facebook)
✅ Twitter Card tags
✅ Canonical URLs
✅ Alt text for images

### Files Included

✅ `robots.txt` - Search engine directives
✅ `sitemap.xml` - Complete site structure
✅ Semantic HTML5 markup
✅ Structured headings (H1-H6)

### Next Steps for SEO

1. Submit sitemap to Google Search Console
2. Submit to Bing Webmaster Tools
3. Set up Google Analytics
4. Monitor search rankings
5. Create more blog content

---

## 🐛 Troubleshooting

### Forms Not Submitting

**Check:**
1. All required fields are filled
2. Email format is valid
3. Date/time is selected (booking form)
4. Internet connection is active

### Language Toggle Not Working

**Solution:**
1. Clear browser cache
2. Check localStorage is enabled
3. Reload the page

### Products Not Loading

**Check:**
1. Database connection is active
2. Products table has data
3. Browser console for errors
4. API endpoints are accessible

### Admin Dashboard Issues

**Common Fixes:**
1. Clear browser cache
2. Check JavaScript console
3. Ensure proper API permissions
4. Verify table schemas exist

---

## 📞 Support

Need help? Contact us:

- **Email:** salse@nextagent.tech
- **Phone:** +33 376 905 001
- **WhatsApp:** [Click to Chat](https://wa.me/33376905001)

---

## 🎓 Video Tutorials (Coming Soon)

- How to manage products
- How to add blog posts
- How to customize colors
- How to view analytics
- How to export data

---

**Last Updated:** 2025-01-31
**Version:** 2.0.0

**Happy Managing! 🚀**