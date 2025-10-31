// Cookie Consent Management System
// GDPR Compliant Cookie Consent Banner

(function() {
    'use strict';

    // Cookie consent configuration
    const COOKIE_CONFIG = {
        consentCookie: 'nextagent_cookie_consent',
        preferencesCookie: 'nextagent_cookie_preferences',
        expiryDays: 365,
        categories: {
            essential: { required: true, default: true },
            functional: { required: false, default: false },
            analytics: { required: false, default: false },
            marketing: { required: false, default: false }
        }
    };

    // Cookie consent state
    let consentGiven = false;
    let preferences = {};

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Check if consent already given
        checkExistingConsent();

        // If no consent, show banner
        if (!consentGiven) {
            createConsentBanner();
            showConsentBanner();
        } else {
            // Show settings button for users who already consented
            showSettingsButton();
            // Apply cookie preferences
            applyCookiePreferences();
        }

        // Add event listeners
        setupEventListeners();
    }

    function checkExistingConsent() {
        const consent = getCookie(COOKIE_CONFIG.consentCookie);
        if (consent) {
            consentGiven = true;
            preferences = JSON.parse(getCookie(COOKIE_CONFIG.preferencesCookie) || '{}');
            
            // Set defaults if preferences are empty
            if (Object.keys(preferences).length === 0) {
                preferences = {
                    essential: true,
                    functional: false,
                    analytics: false,
                    marketing: false
                };
            }
        }
    }

    function createConsentBanner() {
        // Check if banner already exists
        if (document.querySelector('.cookie-consent')) return;

        const lang = document.documentElement.getAttribute('dir') === 'rtl' ? 'ar' : 'en';
        
        const bannerHTML = `
            <div class="cookie-consent-overlay"></div>
            <div class="cookie-consent">
                <div class="cookie-consent-content">
                    <div class="cookie-consent-header">
                        <i class="fas fa-cookie-bite"></i>
                        <h3>
                            <span class="ar">نحن نستخدم ملفات تعريف الارتباط</span>
                            <span class="en">We Use Cookies</span>
                        </h3>
                    </div>
                    <div class="cookie-consent-body">
                        <p class="ar">
                            نستخدم ملفات تعريف الارتباط وتقنيات التتبع المماثلة لتحسين تجربتك على موقعنا، وتحليل حركة المرور، وتخصيص المحتوى والإعلانات. 
                            من خلال النقر على "قبول الكل"، فإنك توافق على استخدامنا لملفات تعريف الارتباط. 
                            يمكنك إدارة تفضيلاتك في أي وقت من خلال النقر على "تخصيص".
                        </p>
                        <p class="en">
                            We use cookies and similar tracking technologies to enhance your experience on our website, analyze traffic, and personalize content and ads. 
                            By clicking "Accept All", you consent to our use of cookies. 
                            You can manage your preferences at any time by clicking "Customize".
                        </p>
                        <p>
                            <a href="privacy.html">
                                <span class="ar">اقرأ سياسة الخصوصية الكاملة</span>
                                <span class="en">Read Full Privacy Policy</span>
                            </a>
                        </p>
                    </div>
                    <div class="cookie-consent-actions">
                        <button class="btn-accept-all" onclick="CookieConsent.acceptAll()">
                            <span class="ar">قبول الكل</span>
                            <span class="en">Accept All</span>
                        </button>
                        <button class="btn-reject-all" onclick="CookieConsent.rejectAll()">
                            <span class="ar">رفض الكل</span>
                            <span class="en">Reject All</span>
                        </button>
                        <button class="btn-customize" onclick="CookieConsent.showSettings()">
                            <span class="ar">تخصيص</span>
                            <span class="en">Customize</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', bannerHTML);
    }

    function createSettingsModal() {
        // Check if modal already exists
        if (document.querySelector('.cookie-settings-modal')) return;

        const modalHTML = `
            <div class="cookie-settings-modal">
                <div class="cookie-settings-header">
                    <h3>
                        <i class="fas fa-cog"></i>
                        <span class="ar">إعدادات ملفات تعريف الارتباط</span>
                        <span class="en">Cookie Settings</span>
                    </h3>
                    <button class="cookie-settings-close" onclick="CookieConsent.hideSettings()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cookie-settings-body">
                    <p class="cookie-settings-description ar">
                        يمكنك التحكم في ملفات تعريف الارتباط التي نستخدمها على موقعنا. ملفات تعريف الارتباط الأساسية ضرورية لتشغيل الموقع ولا يمكن تعطيلها. 
                        يمكنك اختيار تمكين أو تعطيل الفئات الأخرى حسب تفضيلاتك.
                    </p>
                    <p class="cookie-settings-description en">
                        You can control which cookies we use on our website. Essential cookies are necessary for the site to function and cannot be disabled. 
                        You can choose to enable or disable other categories according to your preferences.
                    </p>

                    <!-- Essential Cookies -->
                    <div class="cookie-category" data-category="essential">
                        <div class="cookie-category-header" onclick="CookieConsent.toggleCategory(this)">
                            <div class="cookie-category-title">
                                <i class="fas fa-shield-alt"></i>
                                <h4>
                                    <span class="ar">ملفات تعريف الارتباط الأساسية</span>
                                    <span class="en">Essential Cookies</span>
                                </h4>
                                <i class="fas fa-chevron-down cookie-category-expand"></i>
                            </div>
                            <div class="cookie-category-toggle">
                                <span class="cookie-category-required">
                                    <span class="ar">مطلوب</span>
                                    <span class="en">Required</span>
                                </span>
                            </div>
                        </div>
                        <div class="cookie-category-body">
                            <p class="ar">
                                هذه الملفات ضرورية لتشغيل الموقع بشكل صحيح ولا يمكن تعطيلها. 
                                تتضمن ملفات تعريف الارتباط الخاصة بتسجيل الدخول، الأمان، وتفضيلات اللغة.
                            </p>
                            <p class="en">
                                These cookies are necessary for the website to function properly and cannot be disabled. 
                                They include cookies for login, security, and language preferences.
                            </p>
                        </div>
                    </div>

                    <!-- Functional Cookies -->
                    <div class="cookie-category" data-category="functional">
                        <div class="cookie-category-header" onclick="CookieConsent.toggleCategory(this)">
                            <div class="cookie-category-title">
                                <i class="fas fa-cogs"></i>
                                <h4>
                                    <span class="ar">ملفات تعريف الارتباط الوظيفية</span>
                                    <span class="en">Functional Cookies</span>
                                </h4>
                                <i class="fas fa-chevron-down cookie-category-expand"></i>
                            </div>
                            <div class="cookie-category-toggle">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="cookie-functional" data-category="functional">
                                    <span class="toggle-slider round"></span>
                                </label>
                            </div>
                        </div>
                        <div class="cookie-category-body">
                            <p class="ar">
                                تساعدنا هذه الملفات على تذكر اختياراتك وتفضيلاتك لتحسين تجربتك. 
                                على سبيل المثال: تفضيلات العرض، الإعدادات الشخصية.
                            </p>
                            <p class="en">
                                These cookies help us remember your choices and preferences to enhance your experience. 
                                For example: display preferences, personal settings.
                            </p>
                        </div>
                    </div>

                    <!-- Analytics Cookies -->
                    <div class="cookie-category" data-category="analytics">
                        <div class="cookie-category-header" onclick="CookieConsent.toggleCategory(this)">
                            <div class="cookie-category-title">
                                <i class="fas fa-chart-line"></i>
                                <h4>
                                    <span class="ar">ملفات تعريف الارتباط التحليلية</span>
                                    <span class="en">Analytics Cookies</span>
                                </h4>
                                <i class="fas fa-chevron-down cookie-category-expand"></i>
                            </div>
                            <div class="cookie-category-toggle">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="cookie-analytics" data-category="analytics">
                                    <span class="toggle-slider round"></span>
                                </label>
                            </div>
                        </div>
                        <div class="cookie-category-body">
                            <p class="ar">
                                تساعدنا على فهم كيفية استخدام الزوار لموقعنا وتحسين أدائه. 
                                نستخدم Google Analytics وأدوات مماثلة لجمع بيانات مجهولة الهوية.
                            </p>
                            <p class="en">
                                Help us understand how visitors use our website and improve its performance. 
                                We use Google Analytics and similar tools to collect anonymized data.
                            </p>
                        </div>
                    </div>

                    <!-- Marketing Cookies -->
                    <div class="cookie-category" data-category="marketing">
                        <div class="cookie-category-header" onclick="CookieConsent.toggleCategory(this)">
                            <div class="cookie-category-title">
                                <i class="fas fa-bullhorn"></i>
                                <h4>
                                    <span class="ar">ملفات تعريف الارتباط التسويقية</span>
                                    <span class="en">Marketing Cookies</span>
                                </h4>
                                <i class="fas fa-chevron-down cookie-category-expand"></i>
                            </div>
                            <div class="cookie-category-toggle">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="cookie-marketing" data-category="marketing">
                                    <span class="toggle-slider round"></span>
                                </label>
                            </div>
                        </div>
                        <div class="cookie-category-body">
                            <p class="ar">
                                تستخدم لتتبع الزوار عبر المواقع وعرض إعلانات مخصصة. 
                                قد يتم مشاركة هذه البيانات مع شركاء الإعلانات.
                            </p>
                            <p class="en">
                                Used to track visitors across websites and display personalized ads. 
                                This data may be shared with advertising partners.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="cookie-settings-footer">
                    <button class="btn-cancel" onclick="CookieConsent.hideSettings()">
                        <span class="ar">إلغاء</span>
                        <span class="en">Cancel</span>
                    </button>
                    <button class="btn-save" onclick="CookieConsent.savePreferences()">
                        <span class="ar">حفظ التفضيلات</span>
                        <span class="en">Save Preferences</span>
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Set current preferences
        setCurrentPreferences();
    }

    function setCurrentPreferences() {
        for (const category in preferences) {
            if (category !== 'essential') {
                const checkbox = document.getElementById(`cookie-${category}`);
                if (checkbox) {
                    checkbox.checked = preferences[category] || false;
                }
            }
        }
    }

    function showSettingsButton() {
        // Check if button already exists
        if (document.querySelector('.cookie-settings-btn')) return;

        const buttonHTML = `
            <button class="cookie-settings-btn visible" onclick="CookieConsent.showSettings()">
                <i class="fas fa-cookie-bite"></i>
                <span class="ar">إعدادات الخصوصية</span>
                <span class="en">Cookie Settings</span>
            </button>
        `;

        document.body.insertAdjacentHTML('beforeend', buttonHTML);
    }

    function setupEventListeners() {
        // Close modal on overlay click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('cookie-consent-overlay')) {
                hideSettings();
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hideSettings();
            }
        });
    }

    function showConsentBanner() {
        setTimeout(() => {
            const banner = document.querySelector('.cookie-consent');
            const overlay = document.querySelector('.cookie-consent-overlay');
            if (banner) banner.classList.add('active');
            if (overlay) overlay.classList.add('active');
        }, 500);
    }

    function hideConsentBanner() {
        const banner = document.querySelector('.cookie-consent');
        const overlay = document.querySelector('.cookie-consent-overlay');
        if (banner) banner.classList.remove('active');
        if (overlay) overlay.classList.remove('active');

        // Remove banner after animation
        setTimeout(() => {
            if (banner) banner.remove();
            if (overlay) overlay.remove();
        }, 400);
    }

    function showSettings() {
        createSettingsModal();
        setTimeout(() => {
            const modal = document.querySelector('.cookie-settings-modal');
            const overlay = document.querySelector('.cookie-consent-overlay');
            if (modal) modal.classList.add('active');
            if (overlay) overlay.classList.add('active');
        }, 50);
    }

    function hideSettings() {
        const modal = document.querySelector('.cookie-settings-modal');
        const overlay = document.querySelector('.cookie-consent-overlay');
        if (modal) modal.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }

    function toggleCategory(element) {
        const category = element.closest('.cookie-category');
        category.classList.toggle('expanded');
    }

    function acceptAll() {
        preferences = {
            essential: true,
            functional: true,
            analytics: true,
            marketing: true
        };
        saveConsent();
        hideConsentBanner();
        showSettingsButton();
        applyCookiePreferences();
    }

    function rejectAll() {
        preferences = {
            essential: true,
            functional: false,
            analytics: false,
            marketing: false
        };
        saveConsent();
        hideConsentBanner();
        showSettingsButton();
        applyCookiePreferences();
    }

    function savePreferences() {
        // Get preferences from checkboxes
        preferences = {
            essential: true,
            functional: document.getElementById('cookie-functional')?.checked || false,
            analytics: document.getElementById('cookie-analytics')?.checked || false,
            marketing: document.getElementById('cookie-marketing')?.checked || false
        };
        
        saveConsent();
        hideSettings();
        hideConsentBanner();
        showSettingsButton();
        applyCookiePreferences();
    }

    function saveConsent() {
        // Save consent cookie
        setCookie(COOKIE_CONFIG.consentCookie, 'true', COOKIE_CONFIG.expiryDays);
        
        // Save preferences cookie
        setCookie(COOKIE_CONFIG.preferencesCookie, JSON.stringify(preferences), COOKIE_CONFIG.expiryDays);
        
        consentGiven = true;
    }

    function applyCookiePreferences() {
        // Apply analytics cookies (Google Analytics)
        if (preferences.analytics) {
            loadGoogleAnalytics();
        } else {
            disableGoogleAnalytics();
        }

        // Apply marketing cookies
        if (preferences.marketing) {
            loadMarketingScripts();
        } else {
            disableMarketingScripts();
        }

        // Dispatch event for other scripts to listen to
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
            detail: preferences 
        }));
    }

    function loadGoogleAnalytics() {
        // Only load if not already loaded
        if (window.ga) return;

        // Example: Load Google Analytics
        // Replace 'UA-XXXXX-Y' with your actual GA ID
        /*
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-XXXXX-Y';
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-XXXXX-Y');
        */
        
        console.log('Analytics cookies enabled');
    }

    function disableGoogleAnalytics() {
        // Disable Google Analytics
        window['ga-disable-UA-XXXXX-Y'] = true;
        console.log('Analytics cookies disabled');
    }

    function loadMarketingScripts() {
        // Load marketing/advertising scripts
        console.log('Marketing cookies enabled');
    }

    function disableMarketingScripts() {
        // Disable marketing scripts
        console.log('Marketing cookies disabled');
    }

    // Cookie utility functions
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length);
            }
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    }

    // Expose public API
    window.CookieConsent = {
        acceptAll: acceptAll,
        rejectAll: rejectAll,
        showSettings: showSettings,
        hideSettings: hideSettings,
        savePreferences: savePreferences,
        toggleCategory: toggleCategory,
        getPreferences: function() { return preferences; },
        hasConsent: function(category) { return preferences[category] || false; }
    };

})();
