/**
 * main-integration.js
 * ملف التكامل الرئيسي لتوحيد جميع الميزات والتنسيقات
 * هذا الملف يضمن تطبيق جميع الميزات من الإصدارات المختلفة مع الحفاظ على العناصر الدستورية
 */

document.addEventListener('DOMContentLoaded', function() {
    // التأكد من تحميل جميع العناصر الدستورية قبل تطبيق التحسينات
    ensureConstitutionalElementsLoaded();
    
    // تطبيق الوضع الليلي إذا كان مفعلاً
    applyDarkModeIfEnabled();
    
    // تطبيق تحسينات القائمة الجانبية
    initSidebarEnhancements();
    
    // تطبيق تأثيرات التحويم
    enhanceHoverEffects();
    
    // تهيئة لوحة الإحصائيات التفاعلية
    initInteractiveDashboard();
    
    // تطبيق تحسينات التوافق مع الأجهزة المحمولة
    initMobileCompatibility();
    
    // تطبيق تحسينات إمكانية الوصول
    initAccessibility();
    
    // تطبيق التصميم الموحد
    applyUnifiedDesign();
    
    // تفعيل نظام التنبيهات
    initNotifications();
    
    // تفعيل نظام التوصيات
    initRecommendationSystem();
    
    // تفعيل نظام التعليقات
    initFeedbackSystem();
    
    // تفعيل دعم وضع عدم الاتصال
    initOfflineSupport();
    
    // تفعيل محسن الأداء
    initPerformanceOptimizer();
    
    // تفعيل نظام مراقبة النظام
    initSystemMonitoring();
    
    // تفعيل نظام تصدير البيانات
    initDataExport();
    
    // تفعيل تخصيص لوحة التحكم
    initDashboardCustomization();
    
    // تفعيل روبوت المحادثة
    initChatbot();
    
    // تفعيل التنبؤ بالحضور
    initAttendancePrediction();
    
    // تفعيل تفضيلات المستخدم
    initUserPreferences();
    
    // تفعيل التحديثات في الوقت الفعلي
    initRealTimeUpdates();
    
    // تفعيل مدير بيانات AJAX
    initAjaxDataManager();
    
    // تفعيل الأمان
    initSecurity();
    
    console.log('تم تطبيق جميع الميزات والتحسينات بنجاح!');
});

/**
 * التأكد من تحميل جميع العناصر الدستورية
 * هذه الوظيفة تتحقق من وجود جميع العناصر الدستورية قبل تطبيق أي تحسينات
 */
function ensureConstitutionalElementsLoaded() {
    // التحقق من وجود القائمة الجانبية
    const sidebar = document.querySelector('.main-sidebar');
    if (!sidebar) {
        console.error('العنصر الدستوري (القائمة الجانبية) غير موجود!');
        return false;
    }
    
    // التحقق من وجود الهيدر
    const header = document.querySelector('.main-header');
    if (!header) {
        console.error('العنصر الدستوري (الهيدر) غير موجود!');
        return false;
    }
    
    // التحقق من وجود الفوتر
    const footer = document.querySelector('.main-footer');
    if (!footer) {
        console.error('العنصر الدستوري (الفوتر) غير موجود!');
        return false;
    }
    
    // التحقق من وجود القائمة المنسدلة
    const dropdown = document.querySelector('.profile-dropdown');
    if (!dropdown) {
        console.error('العنصر الدستوري (القائمة المنسدلة) غير موجود!');
        return false;
    }
    
    console.log('تم التحقق من وجود جميع العناصر الدستورية بنجاح.');
    return true;
}

/**
 * تطبيق الوضع الليلي إذا كان مفعلاً
 * هذه الوظيفة تتحقق من تفضيلات المستخدم وتطبق الوضع الليلي إذا كان مفعلاً
 */
function applyDarkModeIfEnabled() {
    // التحقق من تفضيلات المستخدم في localStorage
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        
        // تحديث زر تبديل الوضع الليلي إذا كان موجوداً
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = true;
        }
    }
    
    // إضافة مستمع لزر تبديل الوضع الليلي
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
}

/**
 * تطبيق التصميم الموحد على جميع الصفحات
 * هذه الوظيفة تضمن توحيد التصميم مع الحفاظ على العناصر الدستورية
 */
function applyUnifiedDesign() {
    // إضافة فئة للجسم للإشارة إلى تطبيق التصميم الموحد
    document.body.classList.add('unified-design');
    
    // تطبيق إصلاحات التوافق مع مختلف الأجهزة
    applyResponsiveFixes();
    
    // إضافة رابط لملف CSS الموحد إذا لم يكن موجوداً
    if (!document.querySelector('link[href*="unified-styles.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '../assets/css/unified-styles.css';
        document.head.appendChild(link);
    }
}

/**
 * تطبيق إصلاحات التوافق مع مختلف الأجهزة
 * هذه الوظيفة تعالج مشاكل الأحجام غير المتناسقة
 */
function applyResponsiveFixes() {
    // التحقق من حجم الشاشة وتطبيق الإصلاحات المناسبة
    const width = window.innerWidth;
    
    if (width < 768) {
        // إصلاحات للأجهزة المحمولة
        document.body.classList.add('mobile-view');
        document.body.classList.remove('tablet-view', 'desktop-view');
    } else if (width < 992) {
        // إصلاحات للأجهزة اللوحية
        document.body.classList.add('tablet-view');
        document.body.classList.remove('mobile-view', 'desktop-view');
    } else {
        // إصلاحات للشاشات الكبيرة
        document.body.classList.add('desktop-view');
        document.body.classList.remove('mobile-view', 'tablet-view');
    }
    
    // معالجة مشكلة الأجزاء الكبيرة والصغيرة
    const cards = document.querySelectorAll('.card, .dashboard-stat, .info-box');
    cards.forEach(card => {
        card.style.height = 'auto';
        card.style.minHeight = '120px';
    });
    
    // توحيد أحجام الجداول
    const tables = document.querySelectorAll('.table');
    tables.forEach(table => {
        const parent = table.parentElement;
        if (!parent.classList.contains('table-responsive')) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('table-responsive');
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
}

// تطبيق التصميم الموحد عند تحميل الصفحة
window.addEventListener('load', function() {
    applyUnifiedDesign();
});

// إعادة تطبيق إصلاحات التوافق عند تغيير حجم النافذة
window.addEventListener('resize', function() {
    applyResponsiveFixes();
});
