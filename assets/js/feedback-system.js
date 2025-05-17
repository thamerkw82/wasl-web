/**
 * نظام التغذية الراجعة المحسن
 * يوفر تحسينات لعرض رسائل النجاح والفشل والتنبيهات
 */

// كائن لإدارة التغذية الراجعة
const FeedbackSystem = {
    // إعدادات افتراضية
    settings: {
        // مدة عرض الإشعارات (بالمللي ثانية)
        notificationDuration: 5000,
        
        // ما إذا كان يجب تفعيل الأصوات
        enableSounds: true,
        
        // ما إذا كان يجب تفعيل الاهتزاز على الأجهزة المحمولة
        enableVibration: true,
        
        // ما إذا كان يجب تفعيل التنبيهات المتقدمة
        enableAdvancedNotifications: true,
        
        // موضع الإشعارات
        notificationPosition: 'top-right', // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
        
        // أنواع الإشعارات
        notificationTypes: {
            success: {
                icon: '<i class="fas fa-check-circle"></i>',
                color: '#4CAF50',
                sound: 'success.mp3'
            },
            error: {
                icon: '<i class="fas fa-times-circle"></i>',
                color: '#F44336',
                sound: 'error.mp3'
            },
            warning: {
                icon: '<i class="fas fa-exclamation-triangle"></i>',
                color: '#FF9800',
                sound: 'warning.mp3'
            },
            info: {
                icon: '<i class="fas fa-info-circle"></i>',
                color: '#2196F3',
                sound: 'info.mp3'
            }
        },
        
        // رسائل الخطأ المخصصة
        customErrorMessages: {
            required: 'هذا الحقل مطلوب',
            email: 'يرجى إدخال بريد إلكتروني صالح',
            minLength: 'يجب أن يحتوي هذا الحقل على {min} أحرف على الأقل',
            maxLength: 'يجب أن يحتوي هذا الحقل على {max} أحرف كحد أقصى',
            pattern: 'يرجى إدخال قيمة بالتنسيق الصحيح',
            number: 'يرجى إدخال رقم صالح',
            url: 'يرجى إدخال رابط صالح',
            date: 'يرجى إدخال تاريخ صالح',
            time: 'يرجى إدخال وقت صالح',
            passwordMatch: 'كلمات المرور غير متطابقة',
            fileSize: 'حجم الملف كبير جداً (الحد الأقصى: {max})',
            fileType: 'نوع الملف غير مدعوم',
            serverError: 'حدث خطأ في الخادم، يرجى المحاولة مرة أخرى'
        },
        
        // رسائل النجاح المخصصة
        customSuccessMessages: {
            save: 'تم الحفظ بنجاح',
            update: 'تم التحديث بنجاح',
            delete: 'تم الحذف بنجاح',
            create: 'تم الإنشاء بنجاح',
            upload: 'تم الرفع بنجاح',
            send: 'تم الإرسال بنجاح',
            login: 'تم تسجيل الدخول بنجاح',
            register: 'تم التسجيل بنجاح',
            logout: 'تم تسجيل الخروج بنجاح'
        }
    },
    
    // حالة النظام
    state: {
        // ما إذا كان نظام التغذية الراجعة مفعلاً
        enabled: false,
        
        // قائمة الإشعارات النشطة
        activeNotifications: [],
        
        // عداد الإشعارات
        notificationCounter: 0,
        
        // حاوية الإشعارات
        notificationContainer: null,
        
        // العناصر التي تم تحسينها
        enhancedElements: {}
    },
    
    /**
     * تهيئة نظام التغذية الراجعة
     * @param {Object} options خيارات التهيئة
     */
    init: function(options = {}) {
        // دمج الخيارات مع الإعدادات الافتراضية
        this.settings = { ...this.settings, ...options };
        
        // إنشاء حاوية الإشعارات
        this.createNotificationContainer();
        
        // تحسين نماذج الإدخال
        this.enhanceInputForms();
        
        // تحسين أزرار الإجراءات
        this.enhanceActionButtons();
        
        // تفعيل نظام التغذية الراجعة
        this.state.enabled = true;
        
        console.log('تم تهيئة نظام التغذية الراجعة');
    },
    
    /**
     * إنشاء حاوية الإشعارات
     */
    createNotificationContainer: function() {
        // التحقق من وجود حاوية الإشعارات
        let container = document.getElementById('notification-container');
        
        if (!container) {
            // إنشاء حاوية الإشعارات
            container = document.createElement('div');
            container.id = 'notification-container';
            
            // تعيين نمط حاوية الإشعارات
            container.style.position = 'fixed';
            container.style.zIndex = '9999';
            
            // تعيين موضع حاوية الإشعارات
            switch (this.settings.notificationPosition) {
                case 'top-right':
                    container.style.top = '20px';
                    container.style.right = '20px';
                    break;
                case 'top-left':
                    container.style.top = '20px';
                    container.style.left = '20px';
                    break;
                case 'bottom-right':
                    container.style.bottom = '20px';
                    container.style.right = '20px';
                    break;
                case 'bottom-left':
                    container.style.bottom = '20px';
                    container.style.left = '20px';
                    break;
                case 'top-center':
                    container.style.top = '20px';
                    container.style.left = '50%';
                    container.style.transform = 'translateX(-50%)';
                    break;
                case 'bottom-center':
                    container.style.bottom = '20px';
                    container.style.left = '50%';
                    container.style.transform = 'translateX(-50%)';
                    break;
            }
            
            // إضافة حاوية الإشعارات إلى الصفحة
            document.body.appendChild(container);
        }
        
        // تخزين حاوية الإشعارات في حالة النظام
        this.state.notificationContainer = container;
    },
    
    /**
     * تحسين نماذج الإدخال
     */
    enhanceInputForms: function() {
        // تحديد جميع النماذج
        const forms = document.querySelectorAll('form');
        
        // تحسين كل نموذج
        forms.forEach(form => {
            // التحقق من أن النموذج لم يتم تحسينه بالفعل
            if (form.hasAttribute('data-enhanced')) {
                return;
            }
            
            // إضافة مستمع حدث تقديم النموذج
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
            
            // تحسين حقول الإدخال في النموذج
            const inputs = form.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                // إضافة مستمع حدث تغيير القيمة
                input.addEventListener('input', this.handleInputChange.bind(this));
                
                // إضافة مستمع حدث فقدان التركيز
                input.addEventListener('blur', this.validateInput.bind(this));
                
                // إنشاء عنصر لعرض رسائل الخطأ
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.style.color = '#F44336';
                errorElement.style.fontSize = '12px';
                errorElement.style.marginTop = '5px';
                errorElement.style.display = 'none';
                
                // إضافة عنصر رسائل الخطأ بعد حقل الإدخال
                input.parentNode.insertBefore(errorElement, input.nextSibling);
                
                // تخزين عنصر رسائل الخطأ في حالة النظام
                if (!this.state.enhancedElements.errorElements) {
                    this.state.enhancedElements.errorElements = {};
                }
                
                this.state.enhancedElements.errorElements[input.id || input.name] = errorElement;
            });
            
            // تعيين سمة تحسين النموذج
            form.setAttribute('data-enhanced', 'true');
            
            // تخزين النموذج في حالة النظام
            if (!this.state.enhancedElements.enhancedForms) {
                this.state.enhancedElements.enhancedForms = [];
            }
            
            this.state.enhancedElements.enhancedForms.push(form);
        });
    },
    
    /**
     * تحسين أزرار الإجراءات
     */
    enhanceActionButtons: function() {
        // تحديد أزرار الإجراءات
        const actionButtons = document.querySelectorAll('[data-action]');
        
        // تحسين كل زر
        actionButtons.forEach(button => {
            // التحقق من أن الزر لم يتم تحسينه بالفعل
            if (button.hasAttribute('data-enhanced')) {
                return;
            }
            
            // الحصول على نوع الإجراء
            const actionType = button.getAttribute('data-action');
            
            // إضافة مستمع حدث النقر
            button.addEventListener('click', event => {
                // منع السلوك الافتراضي
                event.preventDefault();
                
                // الحصول على رسالة التأكيد
                const confirmMessage = button.getAttribute('data-confirm');
                
                // التحقق من وجود رسالة تأكيد
                if (confirmMessage) {
                    // عرض مربع حوار التأكيد
                    if (confirm(confirmMessage)) {
                        // تنفيذ الإجراء
                        this.handleAction(actionType, button);
                    }
                } else {
                    // تنفيذ الإجراء
                    this.handleAction(actionType, button);
                }
            });
            
            // تعيين سمة تحسين الزر
            button.setAttribute('data-enhanced', 'true');
            
            // تخزين الزر في حالة النظام
            if (!this.state.enhancedElements.enhancedButtons) {
                this.state.enhancedElements.enhancedButtons = [];
            }
            
            this.state.enhancedElements.enhancedButtons.push(button);
        });
    },
    
    /**
     * معالجة تقديم النموذج
     * @param {Event} event حدث تقديم النموذج
     */
    handleFormSubmit: function(event) {
        // الحصول على النموذج
        const form = event.target;
        
        // التحقق من صحة النموذج
        const isValid = this.validateForm(form);
        
        // التحقق من صحة النموذج
        if (!isValid) {
            // منع تقديم النموذج
            event.preventDefault();
            
            // عرض إشعار خطأ
            this.showNotification('يرجى تصحيح الأخطاء في النموذج', 'error');
        } else {
            // الحصول على نوع النموذج
            const formType = form.getAttribute('data-form-type');
            
            // عرض إشعار نجاح
            if (formType && this.settings.customSuccessMessages[formType]) {
                this.showNotification(this.settings.customSuccessMessages[formType], 'success');
            } else {
                this.showNotification('تم تقديم النموذج بنجاح', 'success');
            }
        }
    },
    
    /**
     * معالجة تغيير قيمة حقل الإدخال
     * @param {Event} event حدث تغيير القيمة
     */
    handleInputChange: function(event) {
        // الحصول على حقل الإدخال
        const input = event.target;
        
        // التحقق من صحة حقل الإدخال
        this.validateInput({ target: input });
    },
    
    /**
     * التحقق من صحة النموذج
     * @param {HTMLFormElement} form النموذج
     * @returns {boolean} ما إذا كان النموذج صالحاً
     */
    validateForm: function(form) {
        // الحصول على حقول الإدخال في النموذج
        const inputs = form.querySelectorAll('input, select, textarea');
        
        // التحقق من صحة كل حقل إدخال
        let isValid = true;
        
        inputs.forEach(input => {
            // التحقق من صحة حقل الإدخال
            const inputIsValid = this.validateInput({ target: input });
            
            // تحديث حالة صحة النموذج
            isValid = isValid && inputIsValid;
        });
        
        return isValid;
    },
    
    /**
     * التحقق من صحة حقل الإدخال
     * @param {Event|Object} event حدث فقدان التركيز أو كائن يحتوي على حقل الإدخال
     * @returns {boolean} ما إذا كان حقل الإدخال صالحاً
     */
    validateInput: function(event) {
        // الحصول على حقل الإدخال
        const input = event.target;
        
        // الحصول على عنصر رسائل الخطأ
        const errorElement = this.state.enhancedElements.errorElements[input.id || input.name];
        
        // التحقق من وجود عنصر رسائل الخطأ
        if (!errorElement) {
            return true;
        }
        
        // إعادة تعيين رسائل الخطأ
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        
        // التحقق من صحة حقل الإدخال
        let isValid = true;
        let errorMessage = '';
        
        // التحقق من الحقل المطلوب
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            errorMessage = this.settings.customErrorMessages.required;
        }
        // التحقق من نوع البريد الإلكتروني
        else if (input.type === 'email' && input.value.trim() && !this.validateEmail(input.value)) {
            isValid = false;
            errorMessage = this.settings.customErrorMessages.email;
        }
        // التحقق من الحد الأدنى للطول
        else if (input.hasAttribute('minlength') && input.value.length < parseInt(input.getAttribute('minlength'))) {
            isValid = false;
            errorMessage = this.settings.customErrorMessages.minLength.replace('{min}', input.getAttribute('minlength'));
        }
        // التحقق من الحد الأقصى للطول
        else if (input.hasAttribute('maxlength') && input.value.length > parseInt(input.getAttribute('maxlength'))) {
            isValid = false;
            errorMessage = this.settings.customErrorMessages.maxLength.replace('{max}', input.getAttribute('maxlength'));
        }
        // التحقق من النمط
        else if (input.hasAttribute('pattern') && input.value.trim() && !new RegExp(input.getAttribute('pattern')).test(input.value)) {
            isValid = false;
            errorMessage = this.settings.customErrorMessages.pattern;
        }
        // التحقق من نوع الرقم
        else if (input.type === 'number' && input.value.trim() && isNaN(input.value)) {
            isValid = false;
            errorMessage = this.settings.customErrorMessages.number;
        }
        // التحقق من نوع الرابط
        else if (input.type === 'url' && input.value.trim() && !this.validateUrl(input.value)) {
            isValid = false;
            errorMessage = this.settings.customErrorMessages.url;
        }
        // التحقق من نوع التاريخ
        else if (input.type === 'date' && input.value.trim() && isNaN(new Date(input.value).getTime())) {
            isValid = false;
            errorMessage = this.settings.customErrorMessages.date;
        }
        // التحقق من نوع الوقت
        else if (input.type === 'time' && input.value.trim() && !this.validateTime(input.value)) {
            isValid = false;
            errorMessage = this.settings.customErrorMessages.time;
        }
        // التحقق من تطابق كلمة المرور
        else if (input.hasAttribute('data-match') && input.value !== document.getElementById(input.getAttribute('data-match')).value) {
            isValid = false;
            errorMessage = this.settings.customErrorMessages.passwordMatch;
        }
        // التحقق من نوع الملف
        else if (input.type === 'file' && input.files.length > 0) {
            // التحقق من حجم الملف
            if (input.hasAttribute('data-max-size') && input.files[0].size > parseInt(input.getAttribute('data-max-size'))) {
                isValid = false;
                errorMessage = this.settings.customErrorMessages.fileSize.replace('{max}', this.formatFileSize(parseInt(input.getAttribute('data-max-size'))));
            }
            // التحقق من نوع الملف
            else if (input.hasAttribute('accept') && !this.validateFileType(input.files[0], input.getAttribute('accept'))) {
                isValid = false;
                errorMessage = this.settings.customErrorMessages.fileType;
            }
        }
        
        // عرض رسالة الخطأ
        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
            
            // إضافة فئة CSS للحقل غير الصالح
            input.classList.add('is-invalid');
            
            // إزالة فئة CSS للحقل الصالح
            input.classList.remove('is-valid');
        } else {
            // إضافة فئة CSS للحقل الصالح
            input.classList.add('is-valid');
            
            // إزالة فئة CSS للحقل غير الصالح
            input.classList.remove('is-invalid');
        }
        
        return isValid;
    },
    
    /**
     * التحقق من صحة البريد الإلكتروني
     * @param {string} email البريد الإلكتروني
     * @returns {boolean} ما إذا كان البريد الإلكتروني صالحاً
     */
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    /**
     * التحقق من صحة الرابط
     * @param {string} url الرابط
     * @returns {boolean} ما إذا كان الرابط صالحاً
     */
    validateUrl: function(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    },
    
    /**
     * التحقق من صحة الوقت
     * @param {string} time الوقت
     * @returns {boolean} ما إذا كان الوقت صالحاً
     */
    validateTime: function(time) {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
        return timeRegex.test(time);
    },
    
    /**
     * التحقق من صحة نوع الملف
     * @param {File} file الملف
     * @param {string} acceptTypes أنواع الملفات المقبولة
     * @returns {boolean} ما إذا كان نوع الملف صالحاً
     */
    validateFileType: function(file, acceptTypes) {
        // تقسيم أنواع الملفات المقبولة
        const types = acceptTypes.split(',').map(type => type.trim());
        
        // التحقق من نوع الملف
        for (const type of types) {
            if (type.startsWith('.')) {
                // التحقق من امتداد الملف
                if (file.name.toLowerCase().endsWith(type.toLowerCase())) {
                    return true;
                }
            } else if (type.includes('*')) {
                // التحقق من نوع MIME
                const mimeRegex = new RegExp(type.replace('*', '.*'));
                if (mimeRegex.test(file.type)) {
                    return true;
                }
            } else {
                // التحقق من نوع MIME المحدد
                if (file.type === type) {
                    return true;
                }
            }
        }
        
        return false;
    },
    
    /**
     * تنسيق حجم الملف
     * @param {number} size حجم الملف بالبايت
     * @returns {string} حجم الملف المنسق
     */
    formatFileSize: function(size) {
        const units = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت', 'تيرابايت'];
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    },
    
    /**
     * معالجة الإجراء
     * @param {string} actionType نوع الإجراء
     * @param {HTMLElement} button زر الإجراء
     */
    handleAction: function(actionType, button) {
        // التحقق من نوع الإجراء
        switch (actionType) {
            case 'save':
            case 'update':
            case 'delete':
            case 'create':
            case 'upload':
            case 'send':
            case 'login':
            case 'register':
            case 'logout':
                // عرض إشعار نجاح
                this.showNotification(this.settings.customSuccessMessages[actionType], 'success');
                break;
            
            default:
                // عرض إشعار نجاح عام
                this.showNotification('تم تنفيذ الإجراء بنجاح', 'success');
                break;
        }
    },
    
    /**
     * عرض إشعار
     * @param {string} message رسالة الإشعار
     * @param {string} type نوع الإشعار (success, error, warning, info)
     */
    showNotification: function(message, type = 'info') {
        // التحقق من وجود حاوية الإشعارات
        if (!this.state.notificationContainer) {
            this.createNotificationContainer();
        }
        
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.id = `notification-${this.state.notificationCounter++}`;
        
        // تعيين نمط الإشعار
        notification.style.backgroundColor = this.settings.notificationTypes[type].color;
        notification.style.color = '#fff';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        notification.style.marginBottom = '10px';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.justifyContent = 'space-between';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'opacity 0.3s, transform 0.3s';
        notification.style.maxWidth = '400px';
        notification.style.width = '100%';
        
        // إنشاء محتوى الإشعار
        const content = document.createElement('div');
        content.className = 'notification-content';
        content.style.display = 'flex';
        content.style.alignItems = 'center';
        
        // إنشاء أيقونة الإشعار
        const icon = document.createElement('div');
        icon.className = 'notification-icon';
        icon.style.marginRight = '10px';
        icon.innerHTML = this.settings.notificationTypes[type].icon;
        
        // إنشاء نص الإشعار
        const text = document.createElement('div');
        text.className = 'notification-text';
        text.textContent = message;
        
        // إنشاء زر إغلاق الإشعار
        const closeButton = document.createElement('button');
        closeButton.className = 'notification-close';
        closeButton.innerHTML = '&times;';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = '#fff';
        closeButton.style.fontSize = '20px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.marginLeft = '10px';
        
        // إضافة مستمع حدث النقر على زر الإغلاق
        closeButton.addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        // إضافة العناصر إلى الإشعار
        content.appendChild(icon);
        content.appendChild(text);
        notification.appendChild(content);
        notification.appendChild(closeButton);
        
        // إضافة الإشعار إلى حاوية الإشعارات
        this.state.notificationContainer.appendChild(notification);
        
        // إظهار الإشعار
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // تشغيل الصوت إذا كان مفعلاً
        if (this.settings.enableSounds) {
            this.playSound(type);
        }
        
        // تفعيل الاهتزاز إذا كان مفعلاً
        if (this.settings.enableVibration && 'vibrate' in navigator) {
            navigator.vibrate(200);
        }
        
        // إضافة الإشعار إلى قائمة الإشعارات النشطة
        this.state.activeNotifications.push(notification);
        
        // إخفاء الإشعار بعد مدة محددة
        setTimeout(() => {
            this.hideNotification(notification);
        }, this.settings.notificationDuration);
    },
    
    /**
     * إخفاء إشعار
     * @param {HTMLElement} notification عنصر الإشعار
     */
    hideNotification: function(notification) {
        // إخفاء الإشعار
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        
        // إزالة الإشعار بعد انتهاء التأثير
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            // إزالة الإشعار من قائمة الإشعارات النشطة
            this.state.activeNotifications = this.state.activeNotifications.filter(n => n !== notification);
        }, 300);
    },
    
    /**
     * تشغيل صوت
     * @param {string} type نوع الإشعار
     */
    playSound: function(type) {
        // التحقق من وجود صوت للنوع المحدد
        if (this.settings.notificationTypes[type].sound) {
            // إنشاء عنصر الصوت
            const audio = new Audio(`/assets/sounds/${this.settings.notificationTypes[type].sound}`);
            
            // تشغيل الصوت
            audio.play().catch(error => {
                console.warn('فشل تشغيل الصوت:', error);
            });
        }
    },
    
    /**
     * عرض رسالة خطأ
     * @param {string} message رسالة الخطأ
     */
    showError: function(message) {
        this.showNotification(message, 'error');
    },
    
    /**
     * عرض رسالة نجاح
     * @param {string} message رسالة النجاح
     */
    showSuccess: function(message) {
        this.showNotification(message, 'success');
    },
    
    /**
     * عرض رسالة تحذير
     * @param {string} message رسالة التحذير
     */
    showWarning: function(message) {
        this.showNotification(message, 'warning');
    },
    
    /**
     * عرض رسالة معلومات
     * @param {string} message رسالة المعلومات
     */
    showInfo: function(message) {
        this.showNotification(message, 'info');
    },
    
    /**
     * عرض مربع حوار تأكيد
     * @param {string} message رسالة التأكيد
     * @param {Function} onConfirm دالة التأكيد
     * @param {Function} onCancel دالة الإلغاء
     */
    showConfirmDialog: function(message, onConfirm, onCancel) {
        // التحقق من دعم مربع حوار التأكيد المتقدم
        if (this.settings.enableAdvancedNotifications) {
            // إنشاء خلفية مربع الحوار
            const overlay = document.createElement('div');
            overlay.className = 'dialog-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.right = '0';
            overlay.style.bottom = '0';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '9999';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            
            // إنشاء مربع الحوار
            const dialog = document.createElement('div');
            dialog.className = 'confirm-dialog';
            dialog.style.backgroundColor = '#fff';
            dialog.style.borderRadius = '5px';
            dialog.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            dialog.style.padding = '20px';
            dialog.style.maxWidth = '400px';
            dialog.style.width = '100%';
            
            // إنشاء عنوان مربع الحوار
            const title = document.createElement('h3');
            title.className = 'dialog-title';
            title.textContent = 'تأكيد';
            title.style.margin = '0 0 15px 0';
            
            // إنشاء محتوى مربع الحوار
            const content = document.createElement('p');
            content.className = 'dialog-content';
            content.textContent = message;
            content.style.margin = '0 0 20px 0';
            
            // إنشاء أزرار مربع الحوار
            const buttons = document.createElement('div');
            buttons.className = 'dialog-buttons';
            buttons.style.display = 'flex';
            buttons.style.justifyContent = 'flex-end';
            
            // إنشاء زر الإلغاء
            const cancelButton = document.createElement('button');
            cancelButton.className = 'dialog-button dialog-button-cancel';
            cancelButton.textContent = 'إلغاء';
            cancelButton.style.backgroundColor = '#f1f1f1';
            cancelButton.style.border = 'none';
            cancelButton.style.borderRadius = '3px';
            cancelButton.style.padding = '8px 15px';
            cancelButton.style.marginLeft = '10px';
            cancelButton.style.cursor = 'pointer';
            
            // إضافة مستمع حدث النقر على زر الإلغاء
            cancelButton.addEventListener('click', () => {
                // إزالة مربع الحوار
                document.body.removeChild(overlay);
                
                // استدعاء دالة الإلغاء
                if (typeof onCancel === 'function') {
                    onCancel();
                }
            });
            
            // إنشاء زر التأكيد
            const confirmButton = document.createElement('button');
            confirmButton.className = 'dialog-button dialog-button-confirm';
            confirmButton.textContent = 'تأكيد';
            confirmButton.style.backgroundColor = '#4CAF50';
            confirmButton.style.color = '#fff';
            confirmButton.style.border = 'none';
            confirmButton.style.borderRadius = '3px';
            confirmButton.style.padding = '8px 15px';
            confirmButton.style.cursor = 'pointer';
            
            // إضافة مستمع حدث النقر على زر التأكيد
            confirmButton.addEventListener('click', () => {
                // إزالة مربع الحوار
                document.body.removeChild(overlay);
                
                // استدعاء دالة التأكيد
                if (typeof onConfirm === 'function') {
                    onConfirm();
                }
            });
            
            // إضافة الأزرار إلى مربع الحوار
            buttons.appendChild(cancelButton);
            buttons.appendChild(confirmButton);
            
            // إضافة العناصر إلى مربع الحوار
            dialog.appendChild(title);
            dialog.appendChild(content);
            dialog.appendChild(buttons);
            
            // إضافة مربع الحوار إلى الخلفية
            overlay.appendChild(dialog);
            
            // إضافة الخلفية إلى الصفحة
            document.body.appendChild(overlay);
        } else {
            // استخدام مربع حوار التأكيد الافتراضي
            if (confirm(message)) {
                // استدعاء دالة التأكيد
                if (typeof onConfirm === 'function') {
                    onConfirm();
                }
            } else {
                // استدعاء دالة الإلغاء
                if (typeof onCancel === 'function') {
                    onCancel();
                }
            }
        }
    },
    
    /**
     * عرض مربع حوار إدخال
     * @param {string} message رسالة الإدخال
     * @param {string} defaultValue القيمة الافتراضية
     * @param {Function} onConfirm دالة التأكيد
     * @param {Function} onCancel دالة الإلغاء
     */
    showPromptDialog: function(message, defaultValue = '', onConfirm, onCancel) {
        // التحقق من دعم مربع حوار الإدخال المتقدم
        if (this.settings.enableAdvancedNotifications) {
            // إنشاء خلفية مربع الحوار
            const overlay = document.createElement('div');
            overlay.className = 'dialog-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.right = '0';
            overlay.style.bottom = '0';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '9999';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            
            // إنشاء مربع الحوار
            const dialog = document.createElement('div');
            dialog.className = 'prompt-dialog';
            dialog.style.backgroundColor = '#fff';
            dialog.style.borderRadius = '5px';
            dialog.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            dialog.style.padding = '20px';
            dialog.style.maxWidth = '400px';
            dialog.style.width = '100%';
            
            // إنشاء عنوان مربع الحوار
            const title = document.createElement('h3');
            title.className = 'dialog-title';
            title.textContent = 'إدخال';
            title.style.margin = '0 0 15px 0';
            
            // إنشاء محتوى مربع الحوار
            const content = document.createElement('p');
            content.className = 'dialog-content';
            content.textContent = message;
            content.style.margin = '0 0 10px 0';
            
            // إنشاء حقل الإدخال
            const input = document.createElement('input');
            input.className = 'dialog-input';
            input.type = 'text';
            input.value = defaultValue;
            input.style.width = '100%';
            input.style.padding = '8px';
            input.style.border = '1px solid #ddd';
            input.style.borderRadius = '3px';
            input.style.marginBottom = '20px';
            
            // إنشاء أزرار مربع الحوار
            const buttons = document.createElement('div');
            buttons.className = 'dialog-buttons';
            buttons.style.display = 'flex';
            buttons.style.justifyContent = 'flex-end';
            
            // إنشاء زر الإلغاء
            const cancelButton = document.createElement('button');
            cancelButton.className = 'dialog-button dialog-button-cancel';
            cancelButton.textContent = 'إلغاء';
            cancelButton.style.backgroundColor = '#f1f1f1';
            cancelButton.style.border = 'none';
            cancelButton.style.borderRadius = '3px';
            cancelButton.style.padding = '8px 15px';
            cancelButton.style.marginLeft = '10px';
            cancelButton.style.cursor = 'pointer';
            
            // إضافة مستمع حدث النقر على زر الإلغاء
            cancelButton.addEventListener('click', () => {
                // إزالة مربع الحوار
                document.body.removeChild(overlay);
                
                // استدعاء دالة الإلغاء
                if (typeof onCancel === 'function') {
                    onCancel();
                }
            });
            
            // إنشاء زر التأكيد
            const confirmButton = document.createElement('button');
            confirmButton.className = 'dialog-button dialog-button-confirm';
            confirmButton.textContent = 'تأكيد';
            confirmButton.style.backgroundColor = '#4CAF50';
            confirmButton.style.color = '#fff';
            confirmButton.style.border = 'none';
            confirmButton.style.borderRadius = '3px';
            confirmButton.style.padding = '8px 15px';
            confirmButton.style.cursor = 'pointer';
            
            // إضافة مستمع حدث النقر على زر التأكيد
            confirmButton.addEventListener('click', () => {
                // إزالة مربع الحوار
                document.body.removeChild(overlay);
                
                // استدعاء دالة التأكيد
                if (typeof onConfirm === 'function') {
                    onConfirm(input.value);
                }
            });
            
            // إضافة مستمع حدث الضغط على مفتاح Enter
            input.addEventListener('keypress', event => {
                if (event.key === 'Enter') {
                    // إزالة مربع الحوار
                    document.body.removeChild(overlay);
                    
                    // استدعاء دالة التأكيد
                    if (typeof onConfirm === 'function') {
                        onConfirm(input.value);
                    }
                }
            });
            
            // إضافة الأزرار إلى مربع الحوار
            buttons.appendChild(cancelButton);
            buttons.appendChild(confirmButton);
            
            // إضافة العناصر إلى مربع الحوار
            dialog.appendChild(title);
            dialog.appendChild(content);
            dialog.appendChild(input);
            dialog.appendChild(buttons);
            
            // إضافة مربع الحوار إلى الخلفية
            overlay.appendChild(dialog);
            
            // إضافة الخلفية إلى الصفحة
            document.body.appendChild(overlay);
            
            // تركيز حقل الإدخال
            setTimeout(() => {
                input.focus();
                input.select();
            }, 100);
        } else {
            // استخدام مربع حوار الإدخال الافتراضي
            const value = prompt(message, defaultValue);
            
            if (value !== null) {
                // استدعاء دالة التأكيد
                if (typeof onConfirm === 'function') {
                    onConfirm(value);
                }
            } else {
                // استدعاء دالة الإلغاء
                if (typeof onCancel === 'function') {
                    onCancel();
                }
            }
        }
    },
    
    /**
     * عرض مربع حوار تنبيه
     * @param {string} message رسالة التنبيه
     * @param {Function} onClose دالة الإغلاق
     */
    showAlertDialog: function(message, onClose) {
        // التحقق من دعم مربع حوار التنبيه المتقدم
        if (this.settings.enableAdvancedNotifications) {
            // إنشاء خلفية مربع الحوار
            const overlay = document.createElement('div');
            overlay.className = 'dialog-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.right = '0';
            overlay.style.bottom = '0';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '9999';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            
            // إنشاء مربع الحوار
            const dialog = document.createElement('div');
            dialog.className = 'alert-dialog';
            dialog.style.backgroundColor = '#fff';
            dialog.style.borderRadius = '5px';
            dialog.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            dialog.style.padding = '20px';
            dialog.style.maxWidth = '400px';
            dialog.style.width = '100%';
            
            // إنشاء عنوان مربع الحوار
            const title = document.createElement('h3');
            title.className = 'dialog-title';
            title.textContent = 'تنبيه';
            title.style.margin = '0 0 15px 0';
            
            // إنشاء محتوى مربع الحوار
            const content = document.createElement('p');
            content.className = 'dialog-content';
            content.textContent = message;
            content.style.margin = '0 0 20px 0';
            
            // إنشاء أزرار مربع الحوار
            const buttons = document.createElement('div');
            buttons.className = 'dialog-buttons';
            buttons.style.display = 'flex';
            buttons.style.justifyContent = 'flex-end';
            
            // إنشاء زر الإغلاق
            const closeButton = document.createElement('button');
            closeButton.className = 'dialog-button dialog-button-close';
            closeButton.textContent = 'إغلاق';
            closeButton.style.backgroundColor = '#4CAF50';
            closeButton.style.color = '#fff';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '3px';
            closeButton.style.padding = '8px 15px';
            closeButton.style.cursor = 'pointer';
            
            // إضافة مستمع حدث النقر على زر الإغلاق
            closeButton.addEventListener('click', () => {
                // إزالة مربع الحوار
                document.body.removeChild(overlay);
                
                // استدعاء دالة الإغلاق
                if (typeof onClose === 'function') {
                    onClose();
                }
            });
            
            // إضافة الأزرار إلى مربع الحوار
            buttons.appendChild(closeButton);
            
            // إضافة العناصر إلى مربع الحوار
            dialog.appendChild(title);
            dialog.appendChild(content);
            dialog.appendChild(buttons);
            
            // إضافة مربع الحوار إلى الخلفية
            overlay.appendChild(dialog);
            
            // إضافة الخلفية إلى الصفحة
            document.body.appendChild(overlay);
            
            // تركيز زر الإغلاق
            setTimeout(() => {
                closeButton.focus();
            }, 100);
        } else {
            // استخدام مربع حوار التنبيه الافتراضي
            alert(message);
            
            // استدعاء دالة الإغلاق
            if (typeof onClose === 'function') {
                onClose();
            }
        }
    }
};

// تهيئة نظام التغذية الراجعة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    FeedbackSystem.init();
    
    console.log('تم تهيئة نظام التغذية الراجعة');
});

// تصدير كائن FeedbackSystem للاستخدام في ملفات أخرى
window.FeedbackSystem = FeedbackSystem;
