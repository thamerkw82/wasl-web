// ملف مشاركة الوظائف المشتركة بين جميع الصفحات
// يتم استيراد هذا الملف في جميع الصفحات لتوفير الوظائف الأساسية المشتركة

// استيراد المكتبات والوحدات المطلوبة
import './user-preferences.js';
import './real-time-updates.js';
import './ajax-data-manager.js';

// كائن للوظائف المشتركة
const SharedFunctions = {
    // إعدادات عامة
    settings: {
        apiBaseUrl: '/api',
        defaultLanguage: 'ar',
        defaultTheme: 'light',
        defaultDirection: 'rtl',
        animationsEnabled: true,
        debugMode: false
    },
    
    /**
     * تهيئة الوظائف المشتركة
     * @param {Object} options خيارات التهيئة
     */
    init: function(options = {}) {
        // دمج الخيارات مع الإعدادات الافتراضية
        this.settings = { ...this.settings, ...options };
        
        // تهيئة مكونات المشاركة
        this.initializeComponents();
        
        // إعداد مستمعي الأحداث العامة
        this.setupEventListeners();
        
        // تهيئة واجهة المستخدم
        this.initializeUI();
        
        // تهيئة تفضيلات المستخدم
        if (window.UserPreferences) {
            window.UserPreferences.init();
        }
        
        // تهيئة نظام تحديث البيانات في الوقت الفعلي
        if (window.RealTimeUpdates) {
            window.RealTimeUpdates.init();
        }
        
        // تهيئة نظام إدارة بيانات AJAX
        if (window.AjaxDataManager) {
            window.AjaxDataManager.init({
                apiBaseUrl: this.settings.apiBaseUrl
            });
        }
        
        console.log('تم تهيئة الوظائف المشتركة');
    },
    
    /**
     * تهيئة المكونات المشتركة
     */
    initializeComponents: function() {
        // تهيئة مكونات Bootstrap
        this.initializeBootstrapComponents();
        
        // تهيئة مكونات مخصصة
        this.initializeCustomComponents();
    },
    
    /**
     * تهيئة مكونات Bootstrap
     */
    initializeBootstrapComponents: function() {
        // تهيئة التلميحات
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        
        // تهيئة النوافذ المنبثقة
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function(popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
        
        // تهيئة القوائم المنسدلة
        const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
        dropdownElementList.map(function(dropdownToggleEl) {
            return new bootstrap.Dropdown(dropdownToggleEl);
        });
    },
    
    /**
     * تهيئة المكونات المخصصة
     */
    initializeCustomComponents: function() {
        // تهيئة مكون البحث
        this.initializeSearchComponent();
        
        // تهيئة مكون الإشعارات
        this.initializeNotificationsComponent();
        
        // تهيئة مكون التنقل
        this.initializeNavigationComponent();
    },
    
    /**
     * تهيئة مكون البحث
     */
    initializeSearchComponent: function() {
        const searchForms = document.querySelectorAll('.search-form');
        
        searchForms.forEach(form => {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                
                const searchInput = form.querySelector('.search-input');
                const searchQuery = searchInput.value.trim();
                
                if (searchQuery) {
                    this.performSearch(searchQuery);
                }
            });
        });
    },
    
    /**
     * تنفيذ البحث
     * @param {string} query استعلام البحث
     */
    performSearch: function(query) {
        console.log(`تنفيذ البحث: ${query}`);
        
        // استخدام نظام إدارة بيانات AJAX للبحث
        if (window.AjaxDataManager) {
            const searchResultsContainer = document.querySelector('.search-results');
            
            if (searchResultsContainer) {
                window.AjaxDataManager.getData('/search', { query: query }, searchResultsContainer)
                    .then(data => {
                        console.log('نتائج البحث:', data);
                    })
                    .catch(error => {
                        console.error('خطأ في البحث:', error);
                    });
            } else {
                // إعادة توجيه إلى صفحة نتائج البحث
                window.location.href = `/search-results.html?query=${encodeURIComponent(query)}`;
            }
        } else {
            // إعادة توجيه إلى صفحة نتائج البحث
            window.location.href = `/search-results.html?query=${encodeURIComponent(query)}`;
        }
    },
    
    /**
     * تهيئة مكون الإشعارات
     */
    initializeNotificationsComponent: function() {
        const notificationButtons = document.querySelectorAll('.notifications-button');
        
        notificationButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.loadNotifications();
            });
        });
    },
    
    /**
     * تحميل الإشعارات
     */
    loadNotifications: function() {
        console.log('تحميل الإشعارات');
        
        // استخدام نظام إدارة بيانات AJAX لتحميل الإشعارات
        if (window.AjaxDataManager) {
            const notificationsContainer = document.querySelector('.notifications-container');
            
            if (notificationsContainer) {
                window.AjaxDataManager.getData('/notifications', {}, notificationsContainer)
                    .then(data => {
                        console.log('الإشعارات:', data);
                    })
                    .catch(error => {
                        console.error('خطأ في تحميل الإشعارات:', error);
                    });
            }
        }
    },
    
    /**
     * تهيئة مكون التنقل
     */
    initializeNavigationComponent: function() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            // تحديد الرابط النشط
            if (link.href === window.location.href) {
                link.classList.add('active');
            }
            
            // إضافة تأثير التحميل عند النقر
            link.addEventListener('click', (event) => {
                // تجاهل الروابط الخارجية والروابط التي تفتح في نافذة جديدة
                if (link.target === '_blank' || link.hostname !== window.location.hostname) {
                    return;
                }
                
                // تجاهل الروابط التي تحتوي على سلوك خاص
                if (link.dataset.behavior) {
                    return;
                }
                
                // إظهار تأثير التحميل
                this.showPageLoadingIndicator();
            });
        });
    },
    
    /**
     * إظهار مؤشر تحميل الصفحة
     */
    showPageLoadingIndicator: function() {
        // التحقق من وجود مؤشر تحميل
        let loadingIndicator = document.getElementById('page-loading-indicator');
        
        if (!loadingIndicator) {
            // إنشاء مؤشر تحميل
            loadingIndicator = document.createElement('div');
            loadingIndicator.id = 'page-loading-indicator';
            loadingIndicator.innerHTML = `
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">جاري التحميل...</span>
                </div>
            `;
            
            // تعيين نمط مؤشر التحميل
            loadingIndicator.style.position = 'fixed';
            loadingIndicator.style.top = '0';
            loadingIndicator.style.left = '0';
            loadingIndicator.style.width = '100%';
            loadingIndicator.style.height = '100%';
            loadingIndicator.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
            loadingIndicator.style.display = 'flex';
            loadingIndicator.style.justifyContent = 'center';
            loadingIndicator.style.alignItems = 'center';
            loadingIndicator.style.zIndex = '9999';
            
            // إضافة مؤشر التحميل إلى الصفحة
            document.body.appendChild(loadingIndicator);
        } else {
            // إظهار مؤشر التحميل
            loadingIndicator.style.display = 'flex';
        }
    },
    
    /**
     * إعداد مستمعي الأحداث العامة
     */
    setupEventListeners: function() {
        // مستمع لحدث تحميل الصفحة
        window.addEventListener('load', () => {
            // إخفاء مؤشر تحميل الصفحة
            const loadingIndicator = document.getElementById('page-loading-indicator');
            
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        });
        
        // مستمع لحدث تغيير حجم النافذة
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });
        
        // مستمع لحدث التمرير
        window.addEventListener('scroll', () => {
            this.handleWindowScroll();
        });
        
        // مستمع لحدث النقر خارج العناصر
        document.addEventListener('click', (event) => {
            this.handleOutsideClick(event);
        });
    },
    
    /**
     * معالجة تغيير حجم النافذة
     */
    handleWindowResize: function() {
        // تحديث تخطيط الصفحة عند تغيير حجم النافذة
        this.updateResponsiveLayout();
    },
    
    /**
     * تحديث تخطيط الصفحة المتجاوب
     */
    updateResponsiveLayout: function() {
        const windowWidth = window.innerWidth;
        
        // تحديث الفئات بناءً على حجم النافذة
        if (windowWidth < 576) {
            document.body.classList.add('xs-screen');
            document.body.classList.remove('sm-screen', 'md-screen', 'lg-screen', 'xl-screen');
        } else if (windowWidth < 768) {
            document.body.classList.add('sm-screen');
            document.body.classList.remove('xs-screen', 'md-screen', 'lg-screen', 'xl-screen');
        } else if (windowWidth < 992) {
            document.body.classList.add('md-screen');
            document.body.classList.remove('xs-screen', 'sm-screen', 'lg-screen', 'xl-screen');
        } else if (windowWidth < 1200) {
            document.body.classList.add('lg-screen');
            document.body.classList.remove('xs-screen', 'sm-screen', 'md-screen', 'xl-screen');
        } else {
            document.body.classList.add('xl-screen');
            document.body.classList.remove('xs-screen', 'sm-screen', 'md-screen', 'lg-screen');
        }
    },
    
    /**
     * معالجة تمرير النافذة
     */
    handleWindowScroll: function() {
        // تحديث عناصر الواجهة عند التمرير
        this.updateScrollDependentUI();
    },
    
    /**
     * تحديث عناصر الواجهة المعتمدة على التمرير
     */
    updateScrollDependentUI: function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // تحديث شريط التنقل
        const navbar = document.querySelector('.navbar');
        
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        }
        
        // تحديث زر التمرير لأعلى
        const scrollTopButton = document.querySelector('.scroll-to-top');
        
        if (scrollTopButton) {
            if (scrollTop > 300) {
                scrollTopButton.classList.add('show');
            } else {
                scrollTopButton.classList.remove('show');
            }
        }
    },
    
    /**
     * معالجة النقر خارج العناصر
     * @param {Event} event حدث النقر
     */
    handleOutsideClick: function(event) {
        // إغلاق القوائم المنسدلة المفتوحة عند النقر خارجها
        const dropdowns = document.querySelectorAll('.dropdown.show');
        
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target)) {
                const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
                
                if (dropdownToggle) {
                    const bsDropdown = bootstrap.Dropdown.getInstance(dropdownToggle);
                    
                    if (bsDropdown) {
                        bsDropdown.hide();
                    }
                }
            }
        });
    },
    
    /**
     * تهيئة واجهة المستخدم
     */
    initializeUI: function() {
        // تهيئة التخطيط المتجاوب
        this.updateResponsiveLayout();
        
        // تهيئة عناصر الواجهة المعتمدة على التمرير
        this.updateScrollDependentUI();
        
        // تهيئة زر التمرير لأعلى
        this.initializeScrollToTopButton();
        
        // تهيئة النماذج
        this.initializeForms();
    },
    
    /**
     * تهيئة زر التمرير لأعلى
     */
    initializeScrollToTopButton: function() {
        const scrollTopButton = document.querySelector('.scroll-to-top');
        
        if (scrollTopButton) {
            scrollTopButton.addEventListener('click', (event) => {
                event.preventDefault();
                
                // التمرير إلى أعلى الصفحة بسلاسة
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    },
    
    /**
     * تهيئة النماذج
     */
    initializeForms: function() {
        const forms = document.querySelectorAll('form:not(.search-form)');
        
        forms.forEach(form => {
            // إضافة التحقق من صحة النموذج
            form.addEventListener('submit', (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                
                form.classList.add('was-validated');
            });
            
            // تهيئة حقول النموذج
            this.initializeFormFields(form);
        });
    },
    
    /**
     * تهيئة حقول النموذج
     * @param {HTMLFormElement} form النموذج
     */
    initializeFormFields: function(form) {
        // تهيئة حقول التاريخ
        const dateInputs = form.querySelectorAll('input[type="date"]');
        
        dateInputs.forEach(input => {
            // إضافة سمات للتحقق من صحة التاريخ
            if (!input.hasAttribute('min')) {
                const today = new Date().toISOString().split('T')[0];
                input.setAttribute('min', today);
            }
        });
        
        // تهيئة حقول البريد الإلكتروني
        const emailInputs = form.querySelectorAll('input[type="email"]');
        
        emailInputs.forEach(input => {
            // إضافة نمط للتحقق من صحة البريد الإلكتروني
            input.setAttribute('pattern', '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
        });
        
        // تهيئة حقول رقم الهاتف
        const phoneInputs = form.querySelectorAll('input[type="tel"]');
        
        phoneInputs.forEach(input => {
            // إضافة نمط للتحقق من صحة رقم الهاتف
            input.setAttribute('pattern', '(\\+[0-9]{1,3})?[0-9]{9,}');
        });
    },
    
    /**
     * عرض إشعار
     * @param {string} message نص الإشعار
     * @param {string} type نوع الإشعار (success, info, warning, danger)
     * @param {number} duration مدة عرض الإشعار بالمللي ثانية
     */
    showNotification: function(message, type = 'info', duration = 3000) {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show notification`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="إغلاق"></button>
        `;
        
        // تعيين نمط الإشعار
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '20px';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        
        // إضافة الإشعار إلى الصفحة
        document.body.appendChild(notification);
        
        // إزالة الإشعار بعد المدة المحددة
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
        
        return notification;
    },
    
    /**
     * عرض رسالة تأكيد
     * @param {string} message نص الرسالة
     * @param {Function} confirmCallback دالة استدعاء التأكيد
     * @param {Function} cancelCallback دالة استدعاء الإلغاء
     */
    showConfirmation: function(message, confirmCallback, cancelCallback = null) {
        // إنشاء عنصر التأكيد
        const confirmation = document.createElement('div');
        confirmation.className = 'confirmation-dialog';
        confirmation.innerHTML = `
            <div class="confirmation-content">
                <p>${message}</p>
                <div class="confirmation-buttons">
                    <button class="btn btn-secondary cancel-button">إلغاء</button>
                    <button class="btn btn-primary confirm-button">تأكيد</button>
                </div>
            </div>
        `;
        
        // تعيين نمط التأكيد
        confirmation.style.position = 'fixed';
        confirmation.style.top = '0';
        confirmation.style.left = '0';
        confirmation.style.width = '100%';
        confirmation.style.height = '100%';
        confirmation.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        confirmation.style.display = 'flex';
        confirmation.style.justifyContent = 'center';
        confirmation.style.alignItems = 'center';
        confirmation.style.zIndex = '9999';
        
        // تعيين نمط محتوى التأكيد
        const content = confirmation.querySelector('.confirmation-content');
        content.style.backgroundColor = 'white';
        content.style.padding = '20px';
        content.style.borderRadius = '5px';
        content.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        content.style.maxWidth = '400px';
        content.style.width = '100%';
        
        // إضافة التأكيد إلى الصفحة
        document.body.appendChild(confirmation);
        
        // إضافة مستمعي الأحداث
        const confirmButton = confirmation.querySelector('.confirm-button');
        const cancelButton = confirmation.querySelector('.cancel-button');
        
        confirmButton.addEventListener('click', () => {
            // إزالة التأكيد
            confirmation.remove();
            
            // استدعاء دالة التأكيد
            if (typeof confirmCallback === 'function') {
                confirmCallback();
            }
        });
        
        cancelButton.addEventListener('click', () => {
            // إزالة التأكيد
            confirmation.remove();
            
            // استدعاء دالة الإلغاء
            if (typeof cancelCallback === 'function') {
                cancelCallback();
            }
        });
        
        return confirmation;
    },
    
    /**
     * تنسيق التاريخ
     * @param {string|Date} date التاريخ
     * @param {string} format صيغة التنسيق
     * @returns {string} التاريخ المنسق
     */
    formatDate: function(date, format = 'yyyy-MM-dd') {
        // تحويل التاريخ إلى كائن Date
        const dateObj = date instanceof Date ? date : new Date(date);
        
        // التحقق من صحة التاريخ
        if (isNaN(dateObj.getTime())) {
            return '';
        }
        
        // الحصول على مكونات التاريخ
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const seconds = dateObj.getSeconds();
        
        // تنسيق التاريخ حسب الصيغة
        return format
            .replace('yyyy', year)
            .replace('MM', month.toString().padStart(2, '0'))
            .replace('dd', day.toString().padStart(2, '0'))
            .replace('HH', hours.toString().padStart(2, '0'))
            .replace('mm', minutes.toString().padStart(2, '0'))
            .replace('ss', seconds.toString().padStart(2, '0'));
    },
    
    /**
     * تنسيق الرقم
     * @param {number} number الرقم
     * @param {number} decimals عدد الأرقام العشرية
     * @param {string} decimalSeparator فاصل الأرقام العشرية
     * @param {string} thousandsSeparator فاصل الآلاف
     * @returns {string} الرقم المنسق
     */
    formatNumber: function(number, decimals = 0, decimalSeparator = '.', thousandsSeparator = ',') {
        // التحقق من صحة الرقم
        if (isNaN(number)) {
            return '';
        }
        
        // تقريب الرقم
        const roundedNumber = Number(Math.round(number + 'e' + decimals) + 'e-' + decimals);
        
        // تقسيم الرقم إلى جزء صحيح وجزء عشري
        const parts = roundedNumber.toString().split('.');
        
        // تنسيق الجزء الصحيح
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
        
        // تنسيق الجزء العشري
        if (decimals > 0) {
            if (parts.length === 1) {
                parts.push('0'.repeat(decimals));
            } else {
                parts[1] = parts[1].padEnd(decimals, '0');
            }
        }
        
        // دمج الأجزاء
        return parts.join(decimalSeparator);
    },
    
    /**
     * تحويل النص إلى HTML آمن
     * @param {string} text النص
     * @returns {string} HTML آمن
     */
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    /**
     * اختصار النص
     * @param {string} text النص
     * @param {number} maxLength الحد الأقصى للطول
     * @param {string} suffix لاحقة للنص المختصر
     * @returns {string} النص المختصر
     */
    truncateText: function(text, maxLength = 100, suffix = '...') {
        if (!text || text.length <= maxLength) {
            return text;
        }
        
        return text.substring(0, maxLength) + suffix;
    },
    
    /**
     * الحصول على معلمات URL
     * @param {string} url عنوان URL
     * @returns {Object} معلمات URL
     */
    getUrlParams: function(url = window.location.href) {
        const params = {};
        const urlObj = new URL(url);
        const searchParams = new URLSearchParams(urlObj.search);
        
        for (const [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        
        return params;
    },
    
    /**
     * إنشاء عنوان URL مع معلمات
     * @param {string} baseUrl عنوان URL الأساسي
     * @param {Object} params المعلمات
     * @returns {string} عنوان URL كامل
     */
    buildUrl: function(baseUrl, params = {}) {
        const url = new URL(baseUrl, window.location.origin);
        
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });
        
        return url.toString();
    },
    
    /**
     * تحميل ملف
     * @param {string} url عنوان URL للملف
     * @param {string} filename اسم الملف
     */
    downloadFile: function(url, filename = '') {
        const link = document.createElement('a');
        link.href = url;
        
        if (filename) {
            link.download = filename;
        }
        
        link.target = '_blank';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    
    /**
     * نسخ نص إلى الحافظة
     * @param {string} text النص
     * @returns {Promise} وعد بنتيجة النسخ
     */
    copyToClipboard: function(text) {
        return navigator.clipboard.writeText(text)
            .then(() => {
                this.showNotification('تم نسخ النص بنجاح', 'success');
                return true;
            })
            .catch(error => {
                console.error('فشل نسخ النص:', error);
                this.showNotification('فشل نسخ النص', 'danger');
                return false;
            });
    },
    
    /**
     * تسجيل الخروج
     */
    logout: function() {
        this.showConfirmation('هل أنت متأكد من رغبتك في تسجيل الخروج؟', () => {
            // استخدام نظام إدارة بيانات AJAX لتسجيل الخروج
            if (window.AjaxDataManager) {
                window.AjaxDataManager.getData('/logout')
                    .then(() => {
                        // إعادة توجيه إلى صفحة تسجيل الدخول
                        window.location.href = '/login.html';
                    })
                    .catch(error => {
                        console.error('خطأ في تسجيل الخروج:', error);
                        
                        // إعادة توجيه إلى صفحة تسجيل الدخول على أي حال
                        window.location.href = '/login.html';
                    });
            } else {
                // إعادة توجيه إلى صفحة تسجيل الدخول
                window.location.href = '/login.html';
            }
        });
    }
};

// تصدير كائن SharedFunctions للاستخدام في ملفات أخرى
export default SharedFunctions;

// تعيين الكائن في النافذة للوصول العالمي
window.SharedFunctions = SharedFunctions;

// تهيئة الوظائف المشتركة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    SharedFunctions.init();
});
