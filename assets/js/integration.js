/**
 * ملف تكامل التحسينات البرمجية مع صفحات المشروع
 * يقوم بتضمين جميع ملفات CSS و JavaScript الجديدة في صفحات المشروع
 */

document.addEventListener('DOMContentLoaded', function() {
    // تضمين ملفات CSS
    loadStylesheet('/assets/css/dark-mode.css');
    loadStylesheet('/assets/css/hover-effects.css');
    
    // تضمين ملفات JavaScript
    loadScript('/assets/js/dark-mode.js');
    loadScript('/assets/js/sidebar-enhancements.js');
    loadScript('/assets/js/interactive-dashboard.js');
    loadScript('/assets/js/button-activator.js');
    
    // تهيئة الصفحة
    initializePage();
});

// دالة لتحميل ملف CSS
function loadStylesheet(path) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = path;
    document.head.appendChild(link);
}

// دالة لتحميل ملف JavaScript
function loadScript(path) {
    const script = document.createElement('script');
    script.src = path;
    script.defer = true;
    document.body.appendChild(script);
}

// دالة لتهيئة الصفحة
function initializePage() {
    // إضافة فئة الانتقال للصفحة
    document.querySelector('main')?.classList.add('page-transition');
    
    // تحديد نوع الصفحة
    const pageType = determinePageType();
    
    // تطبيق التهيئة المناسبة حسب نوع الصفحة
    switch (pageType) {
        case 'login':
            enhanceLoginPage();
            break;
        case 'register':
            enhanceRegisterPage();
            break;
        case 'admin-dashboard':
            enhanceAdminDashboard();
            break;
        case 'supervisor-dashboard':
            enhanceSupervisorDashboard();
            break;
        case 'user-dashboard':
            enhanceUserDashboard();
            break;
        case 'create-invitation':
            enhanceCreateInvitation();
            break;
        case 'design-gallery':
            enhanceDesignGallery();
            break;
        case 'support':
            enhanceSupportPage();
            break;
        case 'faq-management':
            enhanceFAQManagement();
            break;
        default:
            enhanceGenericPage();
            break;
    }
    
    // تطبيق التحسينات العامة
    applyCommonEnhancements();
}

// دالة لتحديد نوع الصفحة
function determinePageType() {
    const path = window.location.pathname;
    
    if (path.includes('login.html')) {
        return 'login';
    } else if (path.includes('register.html')) {
        return 'register';
    } else if (path.includes('admin/index.html')) {
        return 'admin-dashboard';
    } else if (path.includes('supervisor/index.html')) {
        return 'supervisor-dashboard';
    } else if (path.includes('user/index.html')) {
        return 'user-dashboard';
    } else if (path.includes('create_invitation.html')) {
        return 'create-invitation';
    } else if (path.includes('design_gallery.html')) {
        return 'design-gallery';
    } else if (path.includes('support.html')) {
        return 'support';
    } else if (path.includes('faq_management.html')) {
        return 'faq-management';
    } else {
        return 'generic';
    }
}

// دالة لتطبيق التحسينات العامة
function applyCommonEnhancements() {
    // إضافة زر العودة للأعلى
    addBackToTopButton();
    
    // تحسين الروابط
    enhanceLinks();
    
    // تحسين الصور
    enhanceImages();
    
    // تحسين النماذج
    enhanceForms();
    
    // تحسين الجداول
    enhanceTables();
    
    // تحسين التنبيهات
    enhanceAlerts();
    
    // تحسين النوافذ المنبثقة
    enhanceModals();
    
    // تحسين التبويبات
    enhanceTabs();
    
    // تحسين القوائم المنسدلة
    enhanceDropdowns();
    
    // تحسين الأزرار
    enhanceButtons();
    
    // تحسين البطاقات
    enhanceCards();
    
    // تحسين الشريط العلوي
    enhanceHeader();
    
    // تحسين الشريط الجانبي
    enhanceSidebar();
    
    // تحسين التذييل
    enhanceFooter();
    
    // تحسين التوافق مع الأجهزة المحمولة
    enhanceMobileCompatibility();
    
    // تحسين الوصول
    enhanceAccessibility();
    
    // تحسين الأداء
    enhancePerformance();
    
    // تحسين الأمان
    enhanceSecurity();
    
    // تحسين SEO
    enhanceSEO();
    
    // تحسين التوافق مع المتصفحات
    enhanceBrowserCompatibility();
    
    // تحسين التوافق مع أنظمة التشغيل
    enhanceOSCompatibility();
    
    // تحسين التوافق مع الأجهزة
    enhanceDeviceCompatibility();
    
    // تحسين التوافق مع الشبكات
    enhanceNetworkCompatibility();
    
    // تحسين التوافق مع السرعات
    enhanceSpeedCompatibility();
    
    // تحسين التوافق مع الذاكرة
    enhanceMemoryCompatibility();
    
    // تحسين التوافق مع المعالجات
    enhanceProcessorCompatibility();
    
    // تحسين التوافق مع الرسوميات
    enhanceGraphicsCompatibility();
    
    // تحسين التوافق مع الصوت
    enhanceAudioCompatibility();
    
    // تحسين التوافق مع الفيديو
    enhanceVideoCompatibility();
    
    // تحسين التوافق مع الكاميرا
    enhanceCameraCompatibility();
    
    // تحسين التوافق مع الميكروفون
    enhanceMicrophoneCompatibility();
    
    // تحسين التوافق مع السماعات
    enhanceSpeakerCompatibility();
    
    // تحسين التوافق مع الطابعات
    enhancePrinterCompatibility();
    
    // تحسين التوافق مع الماسحات الضوئية
    enhanceScannerCompatibility();
    
    // تحسين التوافق مع أجهزة التخزين
    enhanceStorageCompatibility();
    
    // تحسين التوافق مع أجهزة الشبكة
    enhanceNetworkDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة الطاقة
    enhancePowerDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة الأمان
    enhanceSecurityDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة البيومترية
    enhanceBiometricDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة الاستشعار
    enhanceSensorDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة التحكم
    enhanceControlDeviceCompatibility();
}

// دالة لتحسين صفحة تسجيل الدخول
function enhanceLoginPage() {
    // تحسين نموذج تسجيل الدخول
    const loginForm = document.querySelector('form');
    if (loginForm) {
        // إضافة التحقق من صحة النموذج
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // التحقق من صحة النموذج
            const username = document.getElementById('username');
            const password = document.getElementById('password');
            
            if (username && password && username.value && password.value) {
                // محاكاة تسجيل الدخول
                window.location.href = 'admin/index.html';
            } else {
                // عرض رسالة خطأ
                showNotification('يرجى إدخال اسم المستخدم وكلمة المرور', 'danger');
            }
        });
        
        // إضافة تأثيرات التحويم للأزرار
        const buttons = loginForm.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            button.classList.add('btn-hover-effect');
        });
    }
    
    // إضافة تأثيرات للحقول
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
        });
    });
}

// دالة لتحسين صفحة التسجيل
function enhanceRegisterPage() {
    // تحسين نموذج التسجيل
    const registerForm = document.querySelector('form');
    if (registerForm) {
        // إضافة التحقق من صحة النموذج
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // التحقق من صحة النموذج
            const username = document.getElementById('username');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm-password');
            
            if (username && email && password && confirmPassword && 
                username.value && email.value && password.value && confirmPassword.value) {
                
                if (password.value !== confirmPassword.value) {
                    // عرض رسالة خطأ
                    showNotification('كلمات المرور غير متطابقة', 'danger');
                    return;
                }
                
                // محاكاة التسجيل
                showNotification('تم التسجيل بنجاح', 'success');
                
                // إعادة توجيه بعد ثانيتين
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                // عرض رسالة خطأ
                showNotification('يرجى إدخال جميع الحقول المطلوبة', 'danger');
            }
        });
        
        // إضافة تأثيرات التحويم للأزرار
        const buttons = registerForm.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            button.classList.add('btn-hover-effect');
        });
    }
    
    // إضافة تأثيرات للحقول
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
        });
    });
    
    // إضافة مقياس قوة كلمة المرور
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        // إنشاء عنصر مقياس قوة كلمة المرور
        const strengthMeter = document.createElement('div');
        strengthMeter.className = 'password-strength-meter mt-2';
        strengthMeter.innerHTML = `
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <small class="form-text text-muted strength-text">قوة كلمة المرور: ضعيفة</small>
        `;
        
        // إضافة مقياس قوة كلمة المرور بعد حقل كلمة المرور
        passwordInput.parentNode.appendChild(strengthMeter);
        
        // إضافة حدث تغيير القيمة
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }
}

// دالة لتحديث مقياس قوة كلمة المرور
function updatePasswordStrength(password) {
    // الحصول على عناصر مقياس قوة كلمة المرور
    const progressBar = document.querySelector('.password-strength-meter .progress-bar');
    const strengthText = document.querySelector('.password-strength-meter .strength-text');
    
    if (!progressBar || !strengthText) return;
    
    // حساب قوة كلمة المرور
    let strength = 0;
    
    // التحقق من طول كلمة المرور
    if (password.length >= 8) {
        strength += 25;
    }
    
    // التحقق من وجود أحرف كبيرة وصغيرة
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
        strength += 25;
    }
    
    // التحقق من وجود أرقام
    if (password.match(/\d/)) {
        strength += 25;
    }
    
    // التحقق من وجود رموز خاصة
    if (password.match(/[^a-zA-Z\d]/)) {
        strength += 25;
    }
    
    // تحديث مقياس قوة كلمة المرور
    progressBar.style.width = strength + '%';
    progressBar.setAttribute('aria-valuenow', strength);
    
    // تحديث لون مقياس قوة كلمة المرور
    if (strength < 25) {
        progressBar.className = 'progress-bar bg-danger';
        strengthText.textContent = 'قوة كلمة المرور: ضعيفة جداً';
    } else if (strength < 50) {
        progressBar.className = 'progress-bar bg-warning';
        strengthText.textContent = 'قوة كلمة المرور: ضعيفة';
    } else if (strength < 75) {
        progressBar.className = 'progress-bar bg-info';
        strengthText.textContent = 'قوة كلمة المرور: متوسطة';
    } else {
        progressBar.className = 'progress-bar bg-success';
        strengthText.textContent = 'قوة كلمة المرور: قوية';
    }
}

// دالة لتحسين لوحة تحكم المدير
function enhanceAdminDashboard() {
    // تهيئة الرسوم البيانية
    initCharts();
    
    // تحسين الإحصائيات
    enhanceStats();
    
    // تحسين الجداول
    enhanceTables();
    
    // تحسين التنبيهات
    enhanceAlerts();
    
    // تحسين البطاقات
    enhanceCards();
    
    // تحسين الشريط الجانبي
    enhanceSidebar();
    
    // تحسين الشريط العلوي
    enhanceHeader();
    
    // تحسين التذييل
    enhanceFooter();
    
    // تحسين الأزرار
    enhanceButtons();
    
    // تحسين القوائم المنسدلة
    enhanceDropdowns();
    
    // تحسين التبويبات
    enhanceTabs();
    
    // تحسين النوافذ المنبثقة
    enhanceModals();
    
    // تحسين النماذج
    enhanceForms();
    
    // تحسين الصور
    enhanceImages();
    
    // تحسين الروابط
    enhanceLinks();
    
    // تحسين التوافق مع الأجهزة المحمولة
    enhanceMobileCompatibility();
    
    // تحسين الوصول
    enhanceAccessibility();
    
    // تحسين الأداء
    enhancePerformance();
    
    // تحسين الأمان
    enhanceSecurity();
    
    // تحسين SEO
    enhanceSEO();
    
    // تحسين التوافق مع المتصفحات
    enhanceBrowserCompatibility();
    
    // تحسين التوافق مع أنظمة التشغيل
    enhanceOSCompatibility();
    
    // تحسين التوافق مع الأجهزة
    enhanceDeviceCompatibility();
    
    // تحسين التوافق مع الشبكات
    enhanceNetworkCompatibility();
    
    // تحسين التوافق مع السرعات
    enhanceSpeedCompatibility();
    
    // تحسين التوافق مع الذاكرة
    enhanceMemoryCompatibility();
    
    // تحسين التوافق مع المعالجات
    enhanceProcessorCompatibility();
    
    // تحسين التوافق مع الرسوميات
    enhanceGraphicsCompatibility();
    
    // تحسين التوافق مع الصوت
    enhanceAudioCompatibility();
    
    // تحسين التوافق مع الفيديو
    enhanceVideoCompatibility();
    
    // تحسين التوافق مع الكاميرا
    enhanceCameraCompatibility();
    
    // تحسين التوافق مع الميكروفون
    enhanceMicrophoneCompatibility();
    
    // تحسين التوافق مع السماعات
    enhanceSpeakerCompatibility();
    
    // تحسين التوافق مع الطابعات
    enhancePrinterCompatibility();
    
    // تحسين التوافق مع الماسحات الضوئية
    enhanceScannerCompatibility();
    
    // تحسين التوافق مع أجهزة التخزين
    enhanceStorageCompatibility();
    
    // تحسين التوافق مع أجهزة الشبكة
    enhanceNetworkDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة الطاقة
    enhancePowerDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة الأمان
    enhanceSecurityDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة البيومترية
    enhanceBiometricDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة الاستشعار
    enhanceSensorDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة التحكم
    enhanceControlDeviceCompatibility();
}

// دالة لتحسين لوحة تحكم المشرف
function enhanceSupervisorDashboard() {
    // تهيئة الرسوم البيانية
    initCharts();
    
    // تحسين الإحصائيات
    enhanceStats();
    
    // تحسين الجداول
    enhanceTables();
    
    // تحسين التنبيهات
    enhanceAlerts();
    
    // تحسين البطاقات
    enhanceCards();
    
    // تحسين الشريط الجانبي
    enhanceSidebar();
    
    // تحسين الشريط العلوي
    enhanceHeader();
    
    // تحسين التذييل
    enhanceFooter();
    
    // تحسين الأزرار
    enhanceButtons();
    
    // تحسين القوائم المنسدلة
    enhanceDropdowns();
    
    // تحسين التبويبات
    enhanceTabs();
    
    // تحسين النوافذ المنبثقة
    enhanceModals();
    
    // تحسين النماذج
    enhanceForms();
    
    // تحسين الصور
    enhanceImages();
    
    // تحسين الروابط
    enhanceLinks();
    
    // تحسين التوافق مع الأجهزة المحمولة
    enhanceMobileCompatibility();
    
    // تحسين الوصول
    enhanceAccessibility();
    
    // تحسين الأداء
    enhancePerformance();
    
    // تحسين الأمان
    enhanceSecurity();
    
    // تحسين SEO
    enhanceSEO();
    
    // تحسين التوافق مع المتصفحات
    enhanceBrowserCompatibility();
    
    // تحسين التوافق مع أنظمة التشغيل
    enhanceOSCompatibility();
    
    // تحسين التوافق مع الأجهزة
    enhanceDeviceCompatibility();
    
    // تحسين التوافق مع الشبكات
    enhanceNetworkCompatibility();
    
    // تحسين التوافق مع السرعات
    enhanceSpeedCompatibility();
    
    // تحسين التوافق مع الذاكرة
    enhanceMemoryCompatibility();
    
    // تحسين التوافق مع المعالجات
    enhanceProcessorCompatibility();
    
    // تحسين التوافق مع الرسوميات
    enhanceGraphicsCompatibility();
    
    // تحسين التوافق مع الصوت
    enhanceAudioCompatibility();
    
    // تحسين التوافق مع الفيديو
    enhanceVideoCompatibility();
    
    // تحسين التوافق مع الكاميرا
    enhanceCameraCompatibility();
    
    // تحسين التوافق مع الميكروفون
    enhanceMicrophoneCompatibility();
    
    // تحسين التوافق مع السماعات
    enhanceSpeakerCompatibility();
    
    // تحسين التوافق مع الطابعات
    enhancePrinterCompatibility();
    
    // تحسين التوافق مع الماسحات الضوئية
    enhanceScannerCompatibility();
    
    // تحسين التوافق مع أجهزة التخزين
    enhanceStorageCompatibility();
    
    // تحسين التوافق مع أجهزة الشبكة
    enhanceNetworkDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة الطاقة
    enhancePowerDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة الأمان
    enhanceSecurityDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة البيومترية
    enhanceBiometricDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة الاستشعار
    enhanceSensorDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة التحكم
    enhanceControlDeviceCompatibility();
}

// دالة لتحسين لوحة تحكم المستخدم
function enhanceUserDashboard() {
    // تهيئة الرسوم البيانية
    initCharts();
    
    // تحسين الإحصائيات
    enhanceStats();
    
    // تحسين الجداول
    enhanceTables();
    
    // تحسين التنبيهات
    enhanceAlerts();
    
    // تحسين البطاقات
    enhanceCards();
    
    // تحسين الشريط الجانبي
    enhanceSidebar();
    
    // تحسين الشريط العلوي
    enhanceHeader();
    
    // تحسين التذييل
    enhanceFooter();
    
    // تحسين الأزرار
    enhanceButtons();
    
    // تحسين القوائم المنسدلة
    enhanceDropdowns();
    
    // تحسين التبويبات
    enhanceTabs();
    
    // تحسين النوافذ المنبثقة
    enhanceModals();
    
    // تحسين النماذج
    enhanceForms();
    
    // تحسين الصور
    enhanceImages();
    
    // تحسين الروابط
    enhanceLinks();
    
    // تحسين التوافق مع الأجهزة المحمولة
    enhanceMobileCompatibility();
    
    // تحسين الوصول
    enhanceAccessibility();
    
    // تحسين الأداء
    enhancePerformance();
    
    // تحسين الأمان
    enhanceSecurity();
    
    // تحسين SEO
    enhanceSEO();
    
    // تحسين التوافق مع المتصفحات
    enhanceBrowserCompatibility();
    
    // تحسين التوافق مع أنظمة التشغيل
    enhanceOSCompatibility();
    
    // تحسين التوافق مع الأجهزة
    enhanceDeviceCompatibility();
    
    // تحسين التوافق مع الشبكات
    enhanceNetworkCompatibility();
    
    // تحسين التوافق مع السرعات
    enhanceSpeedCompatibility();
    
    // تحسين التوافق مع الذاكرة
    enhanceMemoryCompatibility();
    
    // تحسين التوافق مع المعالجات
    enhanceProcessorCompatibility();
    
    // تحسين التوافق مع الرسوميات
    enhanceGraphicsCompatibility();
    
    // تحسين التوافق مع الصوت
    enhanceAudioCompatibility();
    
    // تحسين التوافق مع الفيديو
    enhanceVideoCompatibility();
    
    // تحسين التوافق مع الكاميرا
    enhanceCameraCompatibility();
    
    // تحسين التوافق مع الميكروفون
    enhanceMicrophoneCompatibility();
    
    // تحسين التوافق مع السماعات
    enhanceSpeakerCompatibility();
    
    // تحسين التوافق مع الطابعات
    enhancePrinterCompatibility();
    
    // تحسين التوافق مع الماسحات الضوئية
    enhanceScannerCompatibility();
    
    // تحسين التوافق مع أجهزة التخزين
    enhanceStorageCompatibility();
    
    // تحسين التوافق مع أجهزة الشبكة
    enhanceNetworkDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة الطاقة
    enhancePowerDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة الأمان
    enhanceSecurityDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة البيومترية
    enhanceBiometricDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة الاستشعار
    enhanceSensorDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة التحكم
    enhanceControlDeviceCompatibility();
}

// دالة لتحسين صفحة إنشاء الدعوة
function enhanceCreateInvitation() {
    // تحسين نموذج إنشاء الدعوة
    const invitationForm = document.querySelector('form');
    if (invitationForm) {
        // إضافة التحقق من صحة النموذج
        invitationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // التحقق من صحة النموذج
            const requiredFields = invitationForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                }
            });
            
            if (isValid) {
                // محاكاة إنشاء الدعوة
                showNotification('تم إنشاء الدعوة بنجاح', 'success');
                
                // إعادة تعيين النموذج بعد ثانيتين
                setTimeout(() => {
                    invitationForm.reset();
                    
                    // إزالة فئات التحقق
                    const fields = invitationForm.querySelectorAll('.form-control');
                    fields.forEach(field => {
                        field.classList.remove('is-valid', 'is-invalid');
                    });
                }, 2000);
            } else {
                // عرض رسالة خطأ
                showNotification('يرجى إدخال جميع الحقول المطلوبة', 'danger');
            }
        });
        
        // إضافة تأثيرات التحويم للأزرار
        const buttons = invitationForm.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            button.classList.add('btn-hover-effect');
        });
    }
    
    // تحسين الخطوات
    const steps = document.querySelectorAll('.step');
    if (steps.length > 0) {
        // إضافة تأثيرات الانتقال
        steps.forEach(step => {
            step.classList.add('step-transition');
        });
        
        // إضافة أحداث الأزرار
        const nextButtons = document.querySelectorAll('.btn-next');
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                // الحصول على الخطوة الحالية
                const currentStep = this.closest('.step');
                if (!currentStep) return;
                
                // التحقق من صحة الحقول في الخطوة الحالية
                const requiredFields = currentStep.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('is-invalid');
                    } else {
                        field.classList.remove('is-invalid');
                        field.classList.add('is-valid');
                    }
                });
                
                if (!isValid) {
                    // عرض رسالة خطأ
                    showNotification('يرجى إدخال جميع الحقول المطلوبة', 'danger');
                    return;
                }
                
                // إخفاء الخطوة الحالية
                currentStep.classList.remove('active');
                
                // إظهار الخطوة التالية
                const nextStep = currentStep.nextElementSibling;
                if (nextStep && nextStep.classList.contains('step')) {
                    nextStep.classList.add('active');
                    
                    // تحديث شريط التقدم
                    updateProgressBar();
                }
            });
        });
        
        // إضافة أحداث أزرار الرجوع
        const prevButtons = document.querySelectorAll('.btn-prev');
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                // الحصول على الخطوة الحالية
                const currentStep = this.closest('.step');
                if (!currentStep) return;
                
                // إخفاء الخطوة الحالية
                currentStep.classList.remove('active');
                
                // إظهار الخطوة السابقة
                const prevStep = currentStep.previousElementSibling;
                if (prevStep && prevStep.classList.contains('step')) {
                    prevStep.classList.add('active');
                    
                    // تحديث شريط التقدم
                    updateProgressBar();
                }
            });
        });
    }
    
    // تحسين اختيار نوع المناسبة
    const eventTypeCards = document.querySelectorAll('.event-type-card');
    if (eventTypeCards.length > 0) {
        eventTypeCards.forEach(card => {
            card.addEventListener('click', function() {
                // إزالة الفئة النشطة من جميع البطاقات
                eventTypeCards.forEach(c => c.classList.remove('active'));
                
                // إضافة الفئة النشطة للبطاقة الحالية
                this.classList.add('active');
                
                // تحديث حقل نوع المناسبة
                const eventTypeInput = document.getElementById('event-type');
                if (eventTypeInput) {
                    eventTypeInput.value = this.getAttribute('data-event-type');
                }
                
                // عرض الحقول المخصصة للنوع المحدد
                showCustomFields(this.getAttribute('data-event-type'));
            });
        });
    }
}

// دالة لتحديث شريط التقدم
function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    
    // الحصول على الخطوات
    const steps = document.querySelectorAll('.step');
    if (steps.length === 0) return;
    
    // الحصول على الخطوة النشطة
    const activeStep = document.querySelector('.step.active');
    if (!activeStep) return;
    
    // حساب التقدم
    const stepIndex = Array.from(steps).indexOf(activeStep);
    const progress = ((stepIndex + 1) / steps.length) * 100;
    
    // تحديث شريط التقدم
    progressBar.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', progress);
}

// دالة لعرض الحقول المخصصة للنوع المحدد
function showCustomFields(eventType) {
    // إخفاء جميع الحقول المخصصة
    const customFieldsContainers = document.querySelectorAll('.custom-fields');
    customFieldsContainers.forEach(container => {
        container.style.display = 'none';
    });
    
    // إظهار الحقول المخصصة للنوع المحدد
    const selectedContainer = document.querySelector(`.custom-fields[data-event-type="${eventType}"]`);
    if (selectedContainer) {
        selectedContainer.style.display = 'block';
    }
}

// دالة لتحسين صفحة معرض التصاميم
function enhanceDesignGallery() {
    // تحسين بطاقات التصاميم
    const designCards = document.querySelectorAll('.design-card');
    if (designCards.length > 0) {
        designCards.forEach(card => {
            // إضافة تأثيرات التحويم
            card.classList.add('hover-effect');
            
            // إضافة حدث النقر
            card.addEventListener('click', function() {
                // الحصول على معرف التصميم
                const designId = this.getAttribute('data-design-id');
                
                // عرض تفاصيل التصميم
                showDesignDetails(designId);
            });
        });
    }
    
    // تحسين فلترة التصاميم
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // إزالة الفئة النشطة من جميع الأزرار
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // إضافة الفئة النشطة للزر الحالي
                this.classList.add('active');
                
                // الحصول على فئة الفلترة
                const filterCategory = this.getAttribute('data-filter');
                
                // فلترة التصاميم
                filterDesigns(filterCategory);
            });
        });
    }
    
    // تحسين البحث في التصاميم
    const searchInput = document.getElementById('design-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // الحصول على قيمة البحث
            const searchValue = this.value.trim().toLowerCase();
            
            // بحث في التصاميم
            searchDesigns(searchValue);
        });
    }
    
    // تحسين فرز التصاميم
    const sortSelect = document.getElementById('design-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            // الحصول على قيمة الفرز
            const sortValue = this.value;
            
            // فرز التصاميم
            sortDesigns(sortValue);
        });
    }
}

// دالة لعرض تفاصيل التصميم
function showDesignDetails(designId) {
    // الحصول على بيانات التصميم
    // هذه مجرد محاكاة، في التطبيق الفعلي يتم الحصول على البيانات من الخادم
    const designData = {
        id: designId,
        name: 'تصميم رقم ' + designId,
        description: 'وصف تفصيلي للتصميم رقم ' + designId,
        designer: 'المصمم ' + (designId % 5 + 1),
        category: 'الفئة ' + (designId % 3 + 1),
        rating: (designId % 5 + 1),
        image: 'https://via.placeholder.com/800x600?text=تصميم+' + designId
    };
    
    // إنشاء نافذة منبثقة لعرض تفاصيل التصميم
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'designModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'designModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="designModalLabel">${designData.name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <img src="${designData.image}" class="img-fluid" alt="${designData.name}">
                        </div>
                        <div class="col-md-6">
                            <h6>الوصف</h6>
                            <p>${designData.description}</p>
                            <h6>المصمم</h6>
                            <p>${designData.designer}</p>
                            <h6>الفئة</h6>
                            <p>${designData.category}</p>
                            <h6>التقييم</h6>
                            <div class="rating">
                                ${getRatingStars(designData.rating)}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                    <button type="button" class="btn btn-primary">استخدام هذا التصميم</button>
                </div>
            </div>
        </div>
    `;
    
    // إضافة النافذة المنبثقة إلى الصفحة
    document.body.appendChild(modal);
    
    // عرض النافذة المنبثقة
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // إضافة حدث الإغلاق
    modal.addEventListener('hidden.bs.modal', function() {
        // إزالة النافذة المنبثقة من الصفحة
        this.remove();
    });
}

// دالة للحصول على نجوم التقييم
function getRatingStars(rating) {
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star text-warning"></i>';
        } else {
            stars += '<i class="far fa-star text-warning"></i>';
        }
    }
    
    return stars;
}

// دالة لفلترة التصاميم
function filterDesigns(category) {
    // الحصول على جميع بطاقات التصاميم
    const designCards = document.querySelectorAll('.design-card');
    
    designCards.forEach(card => {
        // الحصول على فئة البطاقة
        const cardCategory = card.getAttribute('data-category');
        
        // التحقق من تطابق الفئة
        if (category === 'all' || cardCategory === category) {
            // إظهار البطاقة
            card.style.display = 'block';
        } else {
            // إخفاء البطاقة
            card.style.display = 'none';
        }
    });
}

// دالة للبحث في التصاميم
function searchDesigns(searchValue) {
    // الحصول على جميع بطاقات التصاميم
    const designCards = document.querySelectorAll('.design-card');
    
    designCards.forEach(card => {
        // الحصول على اسم التصميم
        const designName = card.querySelector('.card-title').textContent.toLowerCase();
        
        // الحصول على وصف التصميم
        const designDescription = card.querySelector('.card-text').textContent.toLowerCase();
        
        // الحصول على اسم المصمم
        const designerName = card.querySelector('.designer-name').textContent.toLowerCase();
        
        // التحقق من تطابق البحث
        if (designName.includes(searchValue) || designDescription.includes(searchValue) || designerName.includes(searchValue)) {
            // إظهار البطاقة
            card.style.display = 'block';
        } else {
            // إخفاء البطاقة
            card.style.display = 'none';
        }
    });
}

// دالة لفرز التصاميم
function sortDesigns(sortValue) {
    // الحصول على حاوية التصاميم
    const designsContainer = document.querySelector('.designs-container');
    if (!designsContainer) return;
    
    // الحصول على جميع بطاقات التصاميم
    const designCards = Array.from(designsContainer.querySelectorAll('.design-card'));
    
    // فرز البطاقات
    designCards.sort((a, b) => {
        switch (sortValue) {
            case 'name-asc':
                return a.querySelector('.card-title').textContent.localeCompare(b.querySelector('.card-title').textContent, 'ar');
            case 'name-desc':
                return b.querySelector('.card-title').textContent.localeCompare(a.querySelector('.card-title').textContent, 'ar');
            case 'rating-asc':
                return parseInt(a.getAttribute('data-rating')) - parseInt(b.getAttribute('data-rating'));
            case 'rating-desc':
                return parseInt(b.getAttribute('data-rating')) - parseInt(a.getAttribute('data-rating'));
            case 'date-asc':
                return new Date(a.getAttribute('data-date')) - new Date(b.getAttribute('data-date'));
            case 'date-desc':
                return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
            default:
                return 0;
        }
    });
    
    // إعادة ترتيب البطاقات
    designCards.forEach(card => designsContainer.appendChild(card));
}

// دالة لتحسين صفحة الدعم الفني
function enhanceSupportPage() {
    // تحسين نموذج إنشاء تذكرة
    const ticketForm = document.querySelector('.ticket-form');
    if (ticketForm) {
        // إضافة التحقق من صحة النموذج
        ticketForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // التحقق من صحة النموذج
            const requiredFields = ticketForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                }
            });
            
            if (isValid) {
                // محاكاة إنشاء تذكرة
                showNotification('تم إنشاء التذكرة بنجاح', 'success');
                
                // إعادة تعيين النموذج بعد ثانيتين
                setTimeout(() => {
                    ticketForm.reset();
                    
                    // إزالة فئات التحقق
                    const fields = ticketForm.querySelectorAll('.form-control');
                    fields.forEach(field => {
                        field.classList.remove('is-valid', 'is-invalid');
                    });
                }, 2000);
            } else {
                // عرض رسالة خطأ
                showNotification('يرجى إدخال جميع الحقول المطلوبة', 'danger');
            }
        });
        
        // إضافة تأثيرات التحويم للأزرار
        const buttons = ticketForm.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            button.classList.add('btn-hover-effect');
        });
    }
    
    // تحسين التبويبات
    const tabLinks = document.querySelectorAll('[data-bs-toggle="tab"], [data-toggle="tab"]');
    if (tabLinks.length > 0) {
        tabLinks.forEach(tabLink => {
            // إضافة تأثيرات التحويم
            tabLink.classList.add('nav-link-hover-effect');
            
            // إضافة حدث النقر
            tabLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // إزالة الفئة النشطة من جميع التبويبات
                tabLinks.forEach(link => {
                    link.classList.remove('active');
                    link.setAttribute('aria-selected', 'false');
                });
                
                // إضافة الفئة النشطة للتبويب الحالي
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                // إخفاء جميع محتويات التبويبات
                const tabContents = document.querySelectorAll('.tab-pane');
                tabContents.forEach(content => {
                    content.classList.remove('show', 'active');
                });
                
                // إظهار محتوى التبويب الحالي
                const target = document.querySelector(this.getAttribute('href') || this.getAttribute('data-bs-target'));
                if (target) {
                    target.classList.add('show', 'active');
                }
            });
        });
    }
    
    // تحسين الأسئلة الشائعة
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            // إضافة حدث النقر
            const header = item.querySelector('.faq-header');
            if (header) {
                header.addEventListener('click', function() {
                    // تبديل حالة العنصر
                    item.classList.toggle('active');
                    
                    // تبديل أيقونة السهم
                    const icon = this.querySelector('i');
                    if (icon) {
                        if (item.classList.contains('active')) {
                            icon.className = 'fas fa-chevron-up';
                        } else {
                            icon.className = 'fas fa-chevron-down';
                        }
                    }
                    
                    // تبديل حالة المحتوى
                    const content = item.querySelector('.faq-content');
                    if (content) {
                        if (item.classList.contains('active')) {
                            content.style.maxHeight = content.scrollHeight + 'px';
                        } else {
                            content.style.maxHeight = '0';
                        }
                    }
                });
            }
        });
    }
    
    // تحسين قائمة التذاكر
    const ticketItems = document.querySelectorAll('.ticket-item');
    if (ticketItems.length > 0) {
        ticketItems.forEach(item => {
            // إضافة تأثيرات التحويم
            item.classList.add('hover-effect');
            
            // إضافة حدث النقر
            item.addEventListener('click', function() {
                // الحصول على معرف التذكرة
                const ticketId = this.getAttribute('data-ticket-id');
                
                // عرض تفاصيل التذكرة
                showTicketDetails(ticketId);
            });
        });
    }
}

// دالة لعرض تفاصيل التذكرة
function showTicketDetails(ticketId) {
    // الحصول على بيانات التذكرة
    // هذه مجرد محاكاة، في التطبيق الفعلي يتم الحصول على البيانات من الخادم
    const ticketData = {
        id: ticketId,
        subject: 'موضوع التذكرة رقم ' + ticketId,
        description: 'وصف تفصيلي للتذكرة رقم ' + ticketId,
        status: ['مفتوحة', 'قيد المعالجة', 'مغلقة'][ticketId % 3],
        priority: ['منخفضة', 'متوسطة', 'عالية'][ticketId % 3],
        date: new Date().toLocaleDateString('ar'),
        user: 'المستخدم ' + (ticketId % 5 + 1),
        messages: [
            {
                user: 'المستخدم ' + (ticketId % 5 + 1),
                message: 'رسالة من المستخدم في التذكرة رقم ' + ticketId,
                date: new Date().toLocaleDateString('ar')
            },
            {
                user: 'فريق الدعم',
                message: 'رسالة من فريق الدعم في التذكرة رقم ' + ticketId,
                date: new Date().toLocaleDateString('ar')
            }
        ]
    };
    
    // إنشاء نافذة منبثقة لعرض تفاصيل التذكرة
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'ticketModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'ticketModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="ticketModalLabel">${ticketData.subject}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
                </div>
                <div class="modal-body">
                    <div class="ticket-details">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <strong>رقم التذكرة:</strong> ${ticketData.id}
                            </div>
                            <div class="col-md-6">
                                <strong>التاريخ:</strong> ${ticketData.date}
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <strong>الحالة:</strong> <span class="badge bg-${getStatusColor(ticketData.status)}">${ticketData.status}</span>
                            </div>
                            <div class="col-md-6">
                                <strong>الأولوية:</strong> <span class="badge bg-${getPriorityColor(ticketData.priority)}">${ticketData.priority}</span>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <strong>الوصف:</strong>
                                <p>${ticketData.description}</p>
                            </div>
                        </div>
                        <hr>
                        <h6>المحادثة</h6>
                        <div class="ticket-messages">
                            ${getTicketMessages(ticketData.messages)}
                        </div>
                        <hr>
                        <h6>إضافة رد</h6>
                        <div class="reply-form">
                            <div class="form-group mb-3">
                                <textarea class="form-control" rows="3" placeholder="اكتب ردك هنا..."></textarea>
                            </div>
                            <button type="button" class="btn btn-primary">إرسال</button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                    <button type="button" class="btn btn-success">تحديث الحالة</button>
                </div>
            </div>
        </div>
    `;
    
    // إضافة النافذة المنبثقة إلى الصفحة
    document.body.appendChild(modal);
    
    // عرض النافذة المنبثقة
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // إضافة حدث الإغلاق
    modal.addEventListener('hidden.bs.modal', function() {
        // إزالة النافذة المنبثقة من الصفحة
        this.remove();
    });
}

// دالة للحصول على لون الحالة
function getStatusColor(status) {
    switch (status) {
        case 'مفتوحة':
            return 'primary';
        case 'قيد المعالجة':
            return 'warning';
        case 'مغلقة':
            return 'success';
        default:
            return 'secondary';
    }
}

// دالة للحصول على لون الأولوية
function getPriorityColor(priority) {
    switch (priority) {
        case 'منخفضة':
            return 'success';
        case 'متوسطة':
            return 'warning';
        case 'عالية':
            return 'danger';
        default:
            return 'secondary';
    }
}

// دالة للحصول على رسائل التذكرة
function getTicketMessages(messages) {
    let messagesHTML = '';
    
    messages.forEach(message => {
        messagesHTML += `
            <div class="message ${message.user === 'فريق الدعم' ? 'message-support' : 'message-user'}">
                <div class="message-header">
                    <strong>${message.user}</strong>
                    <span>${message.date}</span>
                </div>
                <div class="message-body">
                    ${message.message}
                </div>
            </div>
        `;
    });
    
    return messagesHTML;
}

// دالة لتحسين صفحة إدارة الأسئلة الشائعة
function enhanceFAQManagement() {
    // تحسين نموذج إضافة سؤال
    const faqForm = document.querySelector('.faq-form');
    if (faqForm) {
        // إضافة التحقق من صحة النموذج
        faqForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // التحقق من صحة النموذج
            const requiredFields = faqForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                }
            });
            
            if (isValid) {
                // محاكاة إضافة سؤال
                showNotification('تم إضافة السؤال بنجاح', 'success');
                
                // إعادة تعيين النموذج بعد ثانيتين
                setTimeout(() => {
                    faqForm.reset();
                    
                    // إزالة فئات التحقق
                    const fields = faqForm.querySelectorAll('.form-control');
                    fields.forEach(field => {
                        field.classList.remove('is-valid', 'is-invalid');
                    });
                }, 2000);
            } else {
                // عرض رسالة خطأ
                showNotification('يرجى إدخال جميع الحقول المطلوبة', 'danger');
            }
        });
        
        // إضافة تأثيرات التحويم للأزرار
        const buttons = faqForm.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            button.classList.add('btn-hover-effect');
        });
    }
    
    // تحسين قائمة الأسئلة
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            // إضافة تأثيرات التحويم
            item.classList.add('hover-effect');
            
            // إضافة أزرار التحرير والحذف
            const actions = item.querySelector('.faq-actions');
            if (actions) {
                // إضافة زر التحرير
                const editButton = document.createElement('button');
                editButton.className = 'btn btn-sm btn-primary me-2';
                editButton.innerHTML = '<i class="fas fa-edit"></i>';
                editButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // الحصول على معرف السؤال
                    const faqId = item.getAttribute('data-faq-id');
                    
                    // عرض نموذج تحرير السؤال
                    showEditFAQForm(faqId);
                });
                
                // إضافة زر الحذف
                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-sm btn-danger';
                deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                deleteButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // الحصول على معرف السؤال
                    const faqId = item.getAttribute('data-faq-id');
                    
                    // عرض تأكيد الحذف
                    showDeleteFAQConfirmation(faqId);
                });
                
                // إضافة الأزرار إلى العنصر
                actions.appendChild(editButton);
                actions.appendChild(deleteButton);
            }
        });
    }
    
    // تحسين فلترة الأسئلة
    const filterSelect = document.getElementById('faq-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            // الحصول على قيمة الفلترة
            const filterValue = this.value;
            
            // فلترة الأسئلة
            filterFAQs(filterValue);
        });
    }
    
    // تحسين البحث في الأسئلة
    const searchInput = document.getElementById('faq-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // الحصول على قيمة البحث
            const searchValue = this.value.trim().toLowerCase();
            
            // بحث في الأسئلة
            searchFAQs(searchValue);
        });
    }
}

// دالة لعرض نموذج تحرير السؤال
function showEditFAQForm(faqId) {
    // الحصول على بيانات السؤال
    // هذه مجرد محاكاة، في التطبيق الفعلي يتم الحصول على البيانات من الخادم
    const faqData = {
        id: faqId,
        question: 'سؤال رقم ' + faqId,
        answer: 'إجابة السؤال رقم ' + faqId,
        category: 'الفئة ' + (faqId % 3 + 1)
    };
    
    // إنشاء نافذة منبثقة لعرض نموذج تحرير السؤال
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'editFAQModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'editFAQModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editFAQModalLabel">تحرير السؤال</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
                </div>
                <div class="modal-body">
                    <form id="edit-faq-form">
                        <input type="hidden" name="faq-id" value="${faqData.id}">
                        <div class="mb-3">
                            <label for="edit-faq-question" class="form-label">السؤال</label>
                            <input type="text" class="form-control" id="edit-faq-question" name="question" value="${faqData.question}" required>
                        </div>
                        <div class="mb-3">
                            <label for="edit-faq-answer" class="form-label">الإجابة</label>
                            <textarea class="form-control" id="edit-faq-answer" name="answer" rows="3" required>${faqData.answer}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="edit-faq-category" class="form-label">الفئة</label>
                            <select class="form-select" id="edit-faq-category" name="category" required>
                                <option value="الفئة 1" ${faqData.category === 'الفئة 1' ? 'selected' : ''}>الفئة 1</option>
                                <option value="الفئة 2" ${faqData.category === 'الفئة 2' ? 'selected' : ''}>الفئة 2</option>
                                <option value="الفئة 3" ${faqData.category === 'الفئة 3' ? 'selected' : ''}>الفئة 3</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
                    <button type="button" class="btn btn-primary" id="save-faq-button">حفظ</button>
                </div>
            </div>
        </div>
    `;
    
    // إضافة النافذة المنبثقة إلى الصفحة
    document.body.appendChild(modal);
    
    // عرض النافذة المنبثقة
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // إضافة حدث النقر لزر الحفظ
    const saveButton = document.getElementById('save-faq-button');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            // التحقق من صحة النموذج
            const form = document.getElementById('edit-faq-form');
            if (form) {
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('is-invalid');
                    } else {
                        field.classList.remove('is-invalid');
                        field.classList.add('is-valid');
                    }
                });
                
                if (isValid) {
                    // محاكاة تحديث السؤال
                    showNotification('تم تحديث السؤال بنجاح', 'success');
                    
                    // إغلاق النافذة المنبثقة
                    modalInstance.hide();
                } else {
                    // عرض رسالة خطأ
                    showNotification('يرجى إدخال جميع الحقول المطلوبة', 'danger');
                }
            }
        });
    }
    
    // إضافة حدث الإغلاق
    modal.addEventListener('hidden.bs.modal', function() {
        // إزالة النافذة المنبثقة من الصفحة
        this.remove();
    });
}

// دالة لعرض تأكيد حذف السؤال
function showDeleteFAQConfirmation(faqId) {
    // إنشاء نافذة منبثقة لعرض تأكيد الحذف
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'deleteFAQModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'deleteFAQModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteFAQModalLabel">تأكيد الحذف</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
                </div>
                <div class="modal-body">
                    <p>هل أنت متأكد من حذف السؤال رقم ${faqId}؟</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
                    <button type="button" class="btn btn-danger" id="confirm-delete-button">حذف</button>
                </div>
            </div>
        </div>
    `;
    
    // إضافة النافذة المنبثقة إلى الصفحة
    document.body.appendChild(modal);
    
    // عرض النافذة المنبثقة
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // إضافة حدث النقر لزر التأكيد
    const confirmButton = document.getElementById('confirm-delete-button');
    if (confirmButton) {
        confirmButton.addEventListener('click', function() {
            // محاكاة حذف السؤال
            showNotification('تم حذف السؤال بنجاح', 'success');
            
            // إغلاق النافذة المنبثقة
            modalInstance.hide();
        });
    }
    
    // إضافة حدث الإغلاق
    modal.addEventListener('hidden.bs.modal', function() {
        // إزالة النافذة المنبثقة من الصفحة
        this.remove();
    });
}

// دالة لفلترة الأسئلة
function filterFAQs(category) {
    // الحصول على جميع عناصر الأسئلة
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        // الحصول على فئة السؤال
        const itemCategory = item.getAttribute('data-category');
        
        // التحقق من تطابق الفئة
        if (category === 'all' || itemCategory === category) {
            // إظهار السؤال
            item.style.display = 'block';
        } else {
            // إخفاء السؤال
            item.style.display = 'none';
        }
    });
}

// دالة للبحث في الأسئلة
function searchFAQs(searchValue) {
    // الحصول على جميع عناصر الأسئلة
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        // الحصول على نص السؤال
        const question = item.querySelector('.faq-question').textContent.toLowerCase();
        
        // الحصول على نص الإجابة
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        // التحقق من تطابق البحث
        if (question.includes(searchValue) || answer.includes(searchValue)) {
            // إظهار السؤال
            item.style.display = 'block';
        } else {
            // إخفاء السؤال
            item.style.display = 'none';
        }
    });
}

// دالة لتحسين الصفحة العامة
function enhanceGenericPage() {
    // تحسين الشريط الجانبي
    enhanceSidebar();
    
    // تحسين الشريط العلوي
    enhanceHeader();
    
    // تحسين التذييل
    enhanceFooter();
    
    // تحسين الأزرار
    enhanceButtons();
    
    // تحسين القوائم المنسدلة
    enhanceDropdowns();
    
    // تحسين التبويبات
    enhanceTabs();
    
    // تحسين النوافذ المنبثقة
    enhanceModals();
    
    // تحسين النماذج
    enhanceForms();
    
    // تحسين الصور
    enhanceImages();
    
    // تحسين الروابط
    enhanceLinks();
    
    // تحسين التوافق مع الأجهزة المحمولة
    enhanceMobileCompatibility();
    
    // تحسين الوصول
    enhanceAccessibility();
    
    // تحسين الأداء
    enhancePerformance();
    
    // تحسين الأمان
    enhanceSecurity();
    
    // تحسين SEO
    enhanceSEO();
    
    // تحسين التوافق مع المتصفحات
    enhanceBrowserCompatibility();
    
    // تحسين التوافق مع أنظمة التشغيل
    enhanceOSCompatibility();
    
    // تحسين التوافق مع الأجهزة
    enhanceDeviceCompatibility();
    
    // تحسين التوافق مع الشبكات
    enhanceNetworkCompatibility();
    
    // تحسين التوافق مع السرعات
    enhanceSpeedCompatibility();
    
    // تحسين التوافق مع الذاكرة
    enhanceMemoryCompatibility();
    
    // تحسين التوافق مع المعالجات
    enhanceProcessorCompatibility();
    
    // تحسين التوافق مع الرسوميات
    enhanceGraphicsCompatibility();
    
    // تحسين التوافق مع الصوت
    enhanceAudioCompatibility();
    
    // تحسين التوافق مع الفيديو
    enhanceVideoCompatibility();
    
    // تحسين التوافق مع الكاميرا
    enhanceCameraCompatibility();
    
    // تحسين التوافق مع الميكروفون
    enhanceMicrophoneCompatibility();
    
    // تحسين التوافق مع السماعات
    enhanceSpeakerCompatibility();
    
    // تحسين التوافق مع الطابعات
    enhancePrinterCompatibility();
    
    // تحسين التوافق مع الماسحات الضوئية
    enhanceScannerCompatibility();
    
    // تحسين التوافق مع أجهزة التخزين
    enhanceStorageCompatibility();
    
    // تحسين التوافق مع أجهزة الشبكة
    enhanceNetworkDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة الطاقة
    enhancePowerDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة الأمان
    enhanceSecurityDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة البيومترية
    enhanceBiometricDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة الاستشعار
    enhanceSensorDeviceCompatibility();
    
    // تحسين التوافق مع أجهزة التحكم
    enhanceControlDeviceCompatibility();
}

// دالة لإضافة زر العودة للأعلى
function addBackToTopButton() {
    // إنشاء زر العودة للأعلى
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.setAttribute('aria-label', 'العودة للأعلى');
    
    // إضافة الزر إلى الصفحة
    document.body.appendChild(backToTopButton);
    
    // إضافة حدث النقر
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // إظهار/إخفاء الزر عند التمرير
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
}

// دالة لتحسين الروابط
function enhanceLinks() {
    // الحصول على جميع الروابط
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        // تجاهل الروابط التي تم تحسينها بالفعل
        if (link.getAttribute('data-enhanced') === 'true') return;
        
        // إضافة تأثيرات التحويم
        link.classList.add('link-hover-effect');
        
        // إضافة سمة التحسين
        link.setAttribute('data-enhanced', 'true');
    });
}

// دالة لتحسين الصور
function enhanceImages() {
    // الحصول على جميع الصور
    const images = document.querySelectorAll('img');
    
    images.forEach(image => {
        // تجاهل الصور التي تم تحسينها بالفعل
        if (image.getAttribute('data-enhanced') === 'true') return;
        
        // إضافة فئة الصورة المتجاوبة
        image.classList.add('img-fluid');
        
        // إضافة تأثيرات التحويم
        image.classList.add('image-hover-effect');
        
        // إضافة سمة التحسين
        image.setAttribute('data-enhanced', 'true');
    });
}

// دالة لتحسين النماذج
function enhanceForms() {
    // الحصول على جميع النماذج
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // تجاهل النماذج التي تم تحسينها بالفعل
        if (form.getAttribute('data-enhanced') === 'true') return;
        
        // إضافة التحقق من صحة النموذج
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // التحقق من صحة النموذج
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                }
            });
            
            if (isValid) {
                // محاكاة إرسال النموذج
                showNotification('تم إرسال النموذج بنجاح', 'success');
                
                // إعادة تعيين النموذج بعد ثانيتين
                setTimeout(() => {
                    form.reset();
                    
                    // إزالة فئات التحقق
                    const fields = form.querySelectorAll('.form-control');
                    fields.forEach(field => {
                        field.classList.remove('is-valid', 'is-invalid');
                    });
                }, 2000);
            } else {
                // عرض رسالة خطأ
                showNotification('يرجى إدخال جميع الحقول المطلوبة', 'danger');
            }
        });
        
        // إضافة تأثيرات التحويم للأزرار
        const buttons = form.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            button.classList.add('btn-hover-effect');
        });
        
        // إضافة سمة التحسين
        form.setAttribute('data-enhanced', 'true');
    });
}

// دالة لتحسين الجداول
function enhanceTables() {
    // الحصول على جميع الجداول
    const tables = document.querySelectorAll('.table');
    
    tables.forEach(table => {
        // تجاهل الجداول التي تم تحسينها بالفعل
        if (table.getAttribute('data-enhanced') === 'true') return;
        
        // إضافة فئة الجدول المتجاوب
        table.classList.add('table-responsive');
        
        // إضافة تأثيرات التحويم لصفوف الجدول
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.classList.add('table-row-hover-effect');
        });
        
        // إضافة سمة التحسين
        table.setAttribute('data-enhanced', 'true');
    });
}

// دالة لتحسين التنبيهات
function enhanceAlerts() {
    // الحصول على جميع التنبيهات
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        // تجاهل التنبيهات التي تم تحسينها بالفعل
        if (alert.getAttribute('data-enhanced') === 'true') return;
        
        // إضافة زر الإغلاق إذا لم يكن موجوداً
        if (!alert.querySelector('.btn-close')) {
            const closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.className = 'btn-close';
            closeButton.setAttribute('data-bs-dismiss', 'alert');
            closeButton.setAttribute('aria-label', 'إغلاق');
            
            alert.appendChild(closeButton);
            
            // إضافة فئة قابلية الإغلاق
            alert.classList.add('alert-dismissible');
        }
        
        // إضافة تأثير الظهور
        alert.classList.add('fade', 'show');
        
        // إضافة سمة التحسين
        alert.setAttribute('data-enhanced', 'true');
    });
}

// دالة لتحسين النوافذ المنبثقة
function enhanceModals() {
    // الحصول على جميع أزرار النوافذ المنبثقة
    const modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"], [data-toggle="modal"]');
    
    modalTriggers.forEach(trigger => {
        // تجاهل الأزرار التي تم تحسينها بالفعل
        if (trigger.getAttribute('data-enhanced') === 'true') return;
        
        // إضافة تأثيرات التحويم
        trigger.classList.add('btn-hover-effect');
        
        // إضافة سمة التحسين
        trigger.setAttribute('data-enhanced', 'true');
    });
}

// دالة لتحسين التبويبات
function enhanceTabs() {
    // الحصول على جميع التبويبات
    const tabLinks = document.querySelectorAll('[data-bs-toggle="tab"], [data-toggle="tab"]');
    
    tabLinks.forEach(tabLink => {
        // تجاهل التبويبات التي تم تحسينها بالفعل
        if (tabLink.getAttribute('data-enhanced') === 'true') return;
        
        // إضافة تأثيرات التحويم
        tabLink.classList.add('nav-link-hover-effect');
        
        // إضافة سمة التحسين
        tabLink.setAttribute('data-enhanced', 'true');
    });
}

// دالة لتحسين القوائم المنسدلة
function enhanceDropdowns() {
    // الحصول على جميع القوائم المنسدلة
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    
    dropdowns.forEach(dropdown => {
        // تجاهل القوائم المنسدلة التي تم تحسينها بالفعل
        if (dropdown.getAttribute('data-enhanced') === 'true') return;
        
        // إضافة تأثيرات التحويم
        dropdown.classList.add('dropdown-hover-effect');
        
        // إضافة سمة التحسين
        dropdown.setAttribute('data-enhanced', 'true');
    });
}

// دالة لتحسين الأزرار
function enhanceButtons() {
    // الحصول على جميع الأزرار
    const buttons = document.querySelectorAll('button, .btn');
    
    buttons.forEach(button => {
        // تجاهل الأزرار التي تم تحسينها بالفعل
        if (button.getAttribute('data-enhanced') === 'true') return;
        
        // إضافة تأثيرات التحويم
        button.classList.add('btn-hover-effect');
        
        // إضافة سمة التحسين
        button.setAttribute('data-enhanced', 'true');
    });
}

// دالة لتحسين البطاقات
function enhanceCards() {
    // الحصول على جميع البطاقات
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // تجاهل البطاقات التي تم تحسينها بالفعل
        if (card.getAttribute('data-enhanced') === 'true') return;
        
        // إضافة تأثيرات التحويم
        card.classList.add('hover-effect');
        
        // إضافة سمة التحسين
        card.setAttribute('data-enhanced', 'true');
    });
}

// دالة لتحسين الشريط العلوي
function enhanceHeader() {
    // الحصول على الشريط العلوي
    const header = document.querySelector('.header');
    
    if (header && header.getAttribute('data-enhanced') !== 'true') {
        // إضافة تأثير التمرير
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // إضافة سمة التحسين
        header.setAttribute('data-enhanced', 'true');
    }
}

// دالة لتحسين الشريط الجانبي
function enhanceSidebar() {
    // الحصول على الشريط الجانبي
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebar && sidebar.getAttribute('data-enhanced') !== 'true') {
        // إضافة تأثيرات التحويم لعناصر القائمة
        const navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.add('nav-link-hover-effect');
        });
        
        // إضافة سمة التحسين
        sidebar.setAttribute('data-enhanced', 'true');
    }
}

// دالة لتحسين التذييل
function enhanceFooter() {
    // الحصول على التذييل
    const footer = document.querySelector('.footer');
    
    if (footer && footer.getAttribute('data-enhanced') !== 'true') {
        // إضافة تأثيرات التحويم للروابط
        const links = footer.querySelectorAll('a');
        links.forEach(link => {
            link.classList.add('link-hover-effect');
        });
        
        // إضافة سمة التحسين
        footer.setAttribute('data-enhanced', 'true');
    }
}

// دالة لتحسين التوافق مع الأجهزة المحمولة
function enhanceMobileCompatibility() {
    // إضافة وسم التحكم في العرض
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(meta);
    }
}

// دالة لتحسين الوصول
function enhanceAccessibility() {
    // إضافة سمات ARIA للعناصر
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
    
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) {
                input.setAttribute('aria-labelledby', label.id || `label-${input.id}`);
                if (!label.id) {
                    label.id = `label-${input.id}`;
                }
            } else {
                input.setAttribute('aria-label', input.placeholder || input.name || 'حقل إدخال');
            }
        }
    });
}

// دالة لتحسين الأداء
function enhancePerformance() {
    // إضافة سمة التحميل الكسول للصور
    const images = document.querySelectorAll('img');
    images.forEach(image => {
        if (!image.getAttribute('loading')) {
            image.setAttribute('loading', 'lazy');
        }
    });
}

// دالة لتحسين الأمان
function enhanceSecurity() {
    // إضافة سمات الأمان للروابط الخارجية
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        if (!link.getAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
        if (!link.getAttribute('target')) {
            link.setAttribute('target', '_blank');
        }
    });
}

// دالة لتحسين SEO
function enhanceSEO() {
    // إضافة وسم الوصف
    const description = document.querySelector('meta[name="description"]');
    if (!description) {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = 'منصة الدعوات الإلكترونية الشاملة - إنشاء وإدارة الدعوات الإلكترونية بكل سهولة';
        document.head.appendChild(meta);
    }
    
    // إضافة وسم الكلمات المفتاحية
    const keywords = document.querySelector('meta[name="keywords"]');
    if (!keywords) {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = 'دعوات إلكترونية, بطاقات دعوة, مناسبات, أعراس, حفلات, اجتماعات, ندوات, إدارة المناسبات';
        document.head.appendChild(meta);
    }
}

// دالة لتحسين التوافق مع المتصفحات
function enhanceBrowserCompatibility() {
    // إضافة وسم التوافق مع IE
    const ieCompat = document.querySelector('meta[http-equiv="X-UA-Compatible"]');
    if (!ieCompat) {
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', 'X-UA-Compatible');
        meta.content = 'IE=edge';
        document.head.appendChild(meta);
    }
}

// دالة لتحسين التوافق مع أنظمة التشغيل
function enhanceOSCompatibility() {
    // إضافة وسم لون الواجهة للأجهزة المحمولة
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = '#007bff';
        document.head.appendChild(meta);
    }
}

// دالة لتحسين التوافق مع الأجهزة
function enhanceDeviceCompatibility() {
    // إضافة وسم الأيقونة للأجهزة المحمولة
    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleTouchIcon) {
        const link = document.createElement('link');
        link.rel = 'apple-touch-icon';
        link.href = '/assets/img/logo.png';
        document.head.appendChild(link);
    }
}

// دالة لتحسين التوافق مع الشبكات
function enhanceNetworkCompatibility() {
    // إضافة وسم التحميل المسبق للموارد
    const preconnect = document.querySelector('link[rel="preconnect"]');
    if (!preconnect) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://fonts.googleapis.com';
        document.head.appendChild(link);
    }
}

// دالة لتحسين التوافق مع السرعات
function enhanceSpeedCompatibility() {
    // إضافة وسم التحميل المسبق للخطوط
    const preload = document.querySelector('link[rel="preload"][as="font"]');
    if (!preload) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap';
        link.as = 'font';
        link.setAttribute('crossorigin', '');
        document.head.appendChild(link);
    }
}

// دالة لتحسين التوافق مع الذاكرة
function enhanceMemoryCompatibility() {
    // إضافة وسم التحميل الكسول للإطارات
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        if (!iframe.getAttribute('loading')) {
            iframe.setAttribute('loading', 'lazy');
        }
    });
}

// دالة لتحسين التوافق مع المعالجات
function enhanceProcessorCompatibility() {
    // إضافة وسم التحميل غير المتزامن للنصوص البرمجية
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
        if (!script.getAttribute('async') && !script.getAttribute('defer')) {
            script.setAttribute('defer', '');
        }
    });
}

// دالة لتحسين التوافق مع الرسوميات
function enhanceGraphicsCompatibility() {
    // إضافة وسم التحميل الكسول للصور
    const images = document.querySelectorAll('img');
    images.forEach(image => {
        if (!image.getAttribute('loading')) {
            image.setAttribute('loading', 'lazy');
        }
    });
}

// دالة لتحسين التوافق مع الصوت
function enhanceAudioCompatibility() {
    // إضافة وسم التحميل الكسول للصوتيات
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
        if (!audio.getAttribute('preload')) {
            audio.setAttribute('preload', 'none');
        }
    });
}

// دالة لتحسين التوافق مع الفيديو
function enhanceVideoCompatibility() {
    // إضافة وسم التحميل الكسول للفيديوهات
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        if (!video.getAttribute('preload')) {
            video.setAttribute('preload', 'none');
        }
        if (!video.getAttribute('loading')) {
            video.setAttribute('loading', 'lazy');
        }
    });
}

// دالة لتحسين التوافق مع الكاميرا
function enhanceCameraCompatibility() {
    // إضافة وسم التحميل الكسول للكاميرا
    const cameras = document.querySelectorAll('video[autoplay]');
    cameras.forEach(camera => {
        if (!camera.getAttribute('playsinline')) {
            camera.setAttribute('playsinline', '');
        }
    });
}

// دالة لتحسين التوافق مع الميكروفون
function enhanceMicrophoneCompatibility() {
    // إضافة وسم التحميل الكسول للميكروفون
    const microphones = document.querySelectorAll('audio[autoplay]');
    microphones.forEach(microphone => {
        if (!microphone.getAttribute('muted')) {
            microphone.setAttribute('muted', '');
        }
    });
}

// دالة لتحسين التوافق مع السماعات
function enhanceSpeakerCompatibility() {
    // إضافة وسم التحميل الكسول للسماعات
    const speakers = document.querySelectorAll('audio');
    speakers.forEach(speaker => {
        if (!speaker.getAttribute('controlsList')) {
            speaker.setAttribute('controlsList', 'nodownload');
        }
    });
}

// دالة لتحسين التوافق مع الطابعات
function enhancePrinterCompatibility() {
    // إضافة وسم التحميل الكسول للطابعات
    const printButtons = document.querySelectorAll('button[onclick*="print"]');
    printButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.print();
        });
    });
}

// دالة لتحسين التوافق مع الماسحات الضوئية
function enhanceScannerCompatibility() {
    // إضافة وسم التحميل الكسول للماسحات الضوئية
    const scanButtons = document.querySelectorAll('button[onclick*="scan"]');
    scanButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('جاري فتح الماسح الضوئي...');
        });
    });
}

// دالة لتحسين التوافق مع أجهزة التخزين
function enhanceStorageCompatibility() {
    // إضافة وسم التحميل الكسول لأجهزة التخزين
    const downloadButtons = document.querySelectorAll('a[download]');
    downloadButtons.forEach(button => {
        if (!button.getAttribute('target')) {
            button.setAttribute('target', '_blank');
        }
    });
}

// دالة لتحسين التوافق مع أجهزة الشبكة
function enhanceNetworkDeviceCompatibility() {
    // إضافة وسم التحميل الكسول لأجهزة الشبكة
    const networkButtons = document.querySelectorAll('button[onclick*="network"]');
    networkButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('جاري الاتصال بالشبكة...');
        });
    });
}

// دالة لتحسين التوافق مع أجهزة الطاقة
function enhancePowerDeviceCompatibility() {
    // إضافة وسم التحميل الكسول لأجهزة الطاقة
    const powerButtons = document.querySelectorAll('button[onclick*="power"]');
    powerButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('جاري التحكم في الطاقة...');
        });
    });
}

// دالة لتحسين التوافق مع أجهزة الأمان
function enhanceSecurityDeviceCompatibility() {
    // إضافة وسم التحميل الكسول لأجهزة الأمان
    const securityButtons = document.querySelectorAll('button[onclick*="security"]');
    securityButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('جاري التحقق من الأمان...');
        });
    });
}

// دالة لتحسين التوافق مع أجهزة البيومترية
function enhanceBiometricDeviceCompatibility() {
    // إضافة وسم التحميل الكسول لأجهزة البيومترية
    const biometricButtons = document.querySelectorAll('button[onclick*="biometric"]');
    biometricButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('جاري التحقق من البصمة...');
        });
    });
}

// دالة لتحسين التوافق مع أجهزة الاستشعار
function enhanceSensorDeviceCompatibility() {
    // إضافة وسم التحميل الكسول لأجهزة الاستشعار
    const sensorButtons = document.querySelectorAll('button[onclick*="sensor"]');
    sensorButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('جاري قراءة المستشعرات...');
        });
    });
}

// دالة لتحسين التوافق مع أجهزة التحكم
function enhanceControlDeviceCompatibility() {
    // إضافة وسم التحميل الكسول لأجهزة التحكم
    const controlButtons = document.querySelectorAll('button[onclick*="control"]');
    controlButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('جاري التحكم في الأجهزة...');
        });
    });
}

// دالة لعرض إشعار
function showNotification(message, type = 'info') {
    // التحقق من وجود عنصر الإشعارات
    let notificationsContainer = document.getElementById('notifications-container');
    
    // إنشاء عنصر الإشعارات إذا لم يكن موجوداً
    if (!notificationsContainer) {
        notificationsContainer = document.createElement('div');
        notificationsContainer.id = 'notifications-container';
        notificationsContainer.style.position = 'fixed';
        notificationsContainer.style.top = '20px';
        notificationsContainer.style.left = '20px';
        notificationsContainer.style.zIndex = '9999';
        document.body.appendChild(notificationsContainer);
    }
    
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.role = 'alert';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="إغلاق"></button>
    `;
    
    // إضافة الإشعار إلى الحاوية
    notificationsContainer.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
