/**
 * تحسين الأمان
 * يوفر تحسينات للأمان في التطبيق
 */

// كائن لإدارة الأمان
const Security = {
    // إعدادات افتراضية
    settings: {
        // ما إذا كان يجب تفعيل تحسينات الأمان تلقائياً
        autoEnable: true,
        
        // ما إذا كان يجب تحسين التحقق من المدخلات
        enhanceInputValidation: true,
        
        // ما إذا كان يجب تنفيذ حماية ضد هجمات XSS
        implementXssProtection: true,
        
        // ما إذا كان يجب تنفيذ حماية ضد هجمات CSRF
        implementCsrfProtection: true,
        
        // ما إذا كان يجب تحسين إدارة الجلسات
        enhanceSessionManagement: true,
        
        // مدة عدم النشاط قبل تسجيل الخروج التلقائي (بالدقائق)
        autoLogoutTime: 30,
        
        // ما إذا كان يجب تفعيل خيار "تذكرني"
        enableRememberMe: true,
        
        // مدة تذكر المستخدم (بالأيام)
        rememberMeDuration: 30,
        
        // ما إذا كان يجب تفعيل تجديد الجلسة التلقائي
        enableAutoSessionRenewal: true,
        
        // فترة تجديد الجلسة (بالدقائق)
        sessionRenewalInterval: 15
    },
    
    // حالة النظام
    state: {
        // ما إذا كان نظام الأمان مفعلاً
        enabled: false,
        
        // ما إذا كان التحقق من المدخلات محسناً
        inputValidationEnhanced: false,
        
        // ما إذا كانت حماية XSS مفعلة
        xssProtectionImplemented: false,
        
        // ما إذا كانت حماية CSRF مفعلة
        csrfProtectionImplemented: false,
        
        // ما إذا كانت إدارة الجلسات محسنة
        sessionManagementEnhanced: false,
        
        // ما إذا كان تسجيل الخروج التلقائي مفعلاً
        autoLogoutEnabled: false,
        
        // ما إذا كان خيار "تذكرني" مفعلاً
        rememberMeEnabled: false,
        
        // ما إذا كان تجديد الجلسة التلقائي مفعلاً
        autoSessionRenewalEnabled: false,
        
        // وقت آخر نشاط للمستخدم
        lastActivityTime: Date.now(),
        
        // مؤقت تسجيل الخروج التلقائي
        autoLogoutTimer: null,
        
        // مؤقت تجديد الجلسة
        sessionRenewalTimer: null,
        
        // رمز CSRF الحالي
        csrfToken: '',
        
        // العناصر التي تم تحسينها
        enhancedElements: {}
    },
    
    /**
     * تهيئة نظام الأمان
     * @param {Object} options خيارات التهيئة
     */
    init: function(options = {}) {
        // دمج الخيارات مع الإعدادات الافتراضية
        this.settings = { ...this.settings, ...options };
        
        // تفعيل نظام الأمان إذا كان مطلوباً
        if (this.settings.autoEnable) {
            this.enable();
        }
        
        console.log('تم تهيئة نظام الأمان');
    },
    
    /**
     * تفعيل نظام الأمان
     */
    enable: function() {
        // تفعيل نظام الأمان
        this.state.enabled = true;
        
        // تحسين التحقق من المدخلات إذا كان مطلوباً
        if (this.settings.enhanceInputValidation) {
            this.enhanceInputValidation();
        }
        
        // تنفيذ حماية ضد هجمات XSS إذا كان مطلوباً
        if (this.settings.implementXssProtection) {
            this.implementXssProtection();
        }
        
        // تنفيذ حماية ضد هجمات CSRF إذا كان مطلوباً
        if (this.settings.implementCsrfProtection) {
            this.implementCsrfProtection();
        }
        
        // تحسين إدارة الجلسات إذا كان مطلوباً
        if (this.settings.enhanceSessionManagement) {
            this.enhanceSessionManagement();
        }
        
        console.log('تم تفعيل نظام الأمان');
    },
    
    /**
     * تعطيل نظام الأمان
     */
    disable: function() {
        // تعطيل نظام الأمان
        this.state.enabled = false;
        
        // إزالة تحسينات التحقق من المدخلات
        this.removeInputValidationEnhancements();
        
        // إزالة حماية XSS
        this.removeXssProtection();
        
        // إزالة حماية CSRF
        this.removeCsrfProtection();
        
        // إزالة تحسينات إدارة الجلسات
        this.removeSessionManagementEnhancements();
        
        console.log('تم تعطيل نظام الأمان');
    },
    
    /**
     * تحسين التحقق من المدخلات
     */
    enhanceInputValidation: function() {
        // التحقق من أن التحقق من المدخلات غير محسن بالفعل
        if (this.state.inputValidationEnhanced) {
            return;
        }
        
        // تحديد النماذج
        const forms = document.querySelectorAll('form');
        
        // تحسين التحقق من المدخلات للنماذج
        forms.forEach(form => {
            // إضافة مستمع حدث التقديم
            form.addEventListener('submit', this.validateForm.bind(this));
            
            // تحديد حقول النموذج
            const formFields = form.querySelectorAll('input, select, textarea');
            
            // تحسين التحقق من المدخلات لحقول النموذج
            formFields.forEach(field => {
                // إضافة مستمع حدث تغيير القيمة
                field.addEventListener('input', this.validateField.bind(this));
                field.addEventListener('blur', this.validateField.bind(this));
                
                // إضافة قواعد التحقق من المدخلات
                this.addValidationRules(field);
                
                // تخزين العنصر في حالة النظام
                if (!this.state.enhancedElements.validatedFields) {
                    this.state.enhancedElements.validatedFields = [];
                }
                
                this.state.enhancedElements.validatedFields.push(field);
            });
            
            // تخزين النموذج في حالة النظام
            if (!this.state.enhancedElements.validatedForms) {
                this.state.enhancedElements.validatedForms = [];
            }
            
            this.state.enhancedElements.validatedForms.push(form);
        });
        
        // تعيين حالة تحسين التحقق من المدخلات
        this.state.inputValidationEnhanced = true;
        
        console.log(`تم تحسين التحقق من المدخلات لـ ${forms.length} نموذج`);
    },
    
    /**
     * إضافة قواعد التحقق من المدخلات
     * @param {HTMLElement} field حقل النموذج
     */
    addValidationRules: function(field) {
        // تحديد نوع الحقل
        const type = field.type;
        const name = field.name;
        
        // إضافة قواعد التحقق من المدخلات حسب نوع الحقل
        switch (type) {
            case 'email':
                // إضافة نمط للتحقق من صحة البريد الإلكتروني
                field.setAttribute('pattern', '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
                field.setAttribute('title', 'يرجى إدخال عنوان بريد إلكتروني صالح');
                break;
                
            case 'password':
                // إضافة قواعد لكلمة المرور
                field.setAttribute('minlength', '8');
                field.setAttribute('title', 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل');
                break;
                
            case 'tel':
                // إضافة نمط للتحقق من صحة رقم الهاتف
                field.setAttribute('pattern', '(\\+[0-9]{1,3})?[0-9]{9,}');
                field.setAttribute('title', 'يرجى إدخال رقم هاتف صالح');
                break;
                
            case 'url':
                // إضافة نمط للتحقق من صحة عنوان URL
                field.setAttribute('pattern', 'https?://.*');
                field.setAttribute('title', 'يرجى إدخال عنوان URL صالح');
                break;
                
            case 'number':
                // إضافة قيود للأرقام
                if (!field.hasAttribute('min')) {
                    field.setAttribute('min', '0');
                }
                break;
                
            case 'date':
                // إضافة قيود للتاريخ
                if (!field.hasAttribute('min')) {
                    const today = new Date().toISOString().split('T')[0];
                    field.setAttribute('min', today);
                }
                break;
        }
        
        // إضافة قواعد التحقق من المدخلات حسب اسم الحقل
        if (name.includes('name')) {
            // إضافة قواعد للأسماء
            field.setAttribute('pattern', '[\\p{L}\\s]{2,}');
            field.setAttribute('title', 'يجب أن يتكون الاسم من حرفين على الأقل');
        } else if (name.includes('zip') || name.includes('postal')) {
            // إضافة قواعد للرمز البريدي
            field.setAttribute('pattern', '[0-9]{5}');
            field.setAttribute('title', 'يجب أن يتكون الرمز البريدي من 5 أرقام');
        }
    },
    
    /**
     * التحقق من صحة النموذج
     * @param {Event} event حدث التقديم
     */
    validateForm: function(event) {
        // التحقق من أن نظام الأمان مفعل
        if (!this.state.enabled || !this.state.inputValidationEnhanced) {
            return;
        }
        
        // الحصول على النموذج
        const form = event.target;
        
        // التحقق من صحة النموذج
        const isValid = form.checkValidity();
        
        // إذا كان النموذج غير صالح، منع التقديم
        if (!isValid) {
            event.preventDefault();
            event.stopPropagation();
            
            // إضافة فئة CSS للنموذج
            form.classList.add('was-validated');
            
            // عرض رسائل الخطأ
            this.showValidationErrors(form);
        } else {
            // التحقق من وجود رمز CSRF
            if (this.state.csrfProtectionImplemented && !this.validateCsrfToken(form)) {
                event.preventDefault();
                event.stopPropagation();
                
                console.error('خطأ في التحقق من رمز CSRF');
                
                // عرض رسالة خطأ
                this.showError('خطأ في التحقق من رمز CSRF');
            }
        }
    },
    
    /**
     * التحقق من صحة الحقل
     * @param {Event} event حدث تغيير القيمة
     */
    validateField: function(event) {
        // التحقق من أن نظام الأمان مفعل
        if (!this.state.enabled || !this.state.inputValidationEnhanced) {
            return;
        }
        
        // الحصول على الحقل
        const field = event.target;
        
        // التحقق من صحة الحقل
        const isValid = field.checkValidity();
        
        // إضافة فئة CSS للحقل
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            
            // عرض رسالة الخطأ
            this.showFieldError(field);
        }
        
        // تنظيف المدخلات
        if (this.state.xssProtectionImplemented) {
            field.value = this.sanitizeInput(field.value);
        }
    },
    
    /**
     * عرض رسائل الخطأ للنموذج
     * @param {HTMLFormElement} form النموذج
     */
    showValidationErrors: function(form) {
        // تحديد حقول النموذج
        const formFields = form.querySelectorAll('input, select, textarea');
        
        // عرض رسائل الخطأ لحقول النموذج
        formFields.forEach(field => {
            // التحقق من صحة الحقل
            const isValid = field.checkValidity();
            
            // إضافة فئة CSS للحقل
            if (isValid) {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            } else {
                field.classList.remove('is-valid');
                field.classList.add('is-invalid');
                
                // عرض رسالة الخطأ
                this.showFieldError(field);
            }
        });
    },
    
    /**
     * عرض رسالة الخطأ للحقل
     * @param {HTMLElement} field حقل النموذج
     */
    showFieldError: function(field) {
        // البحث عن حاوية رسالة الخطأ
        let errorContainer = field.nextElementSibling;
        
        // إذا لم تكن حاوية رسالة الخطأ موجودة، إنشاء واحدة
        if (!errorContainer || !errorContainer.classList.contains('invalid-feedback')) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'invalid-feedback';
            
            // إضافة حاوية رسالة الخطأ بعد الحقل
            field.parentNode.insertBefore(errorContainer, field.nextSibling);
        }
        
        // تحديد رسالة الخطأ
        let errorMessage = '';
        
        if (field.validity.valueMissing) {
            errorMessage = 'هذا الحقل مطلوب';
        } else if (field.validity.typeMismatch) {
            errorMessage = 'يرجى إدخال قيمة صالحة';
        } else if (field.validity.patternMismatch) {
            errorMessage = field.getAttribute('title') || 'يرجى إدخال قيمة تطابق النمط المطلوب';
        } else if (field.validity.tooShort) {
            errorMessage = `يجب أن يتكون هذا الحقل من ${field.getAttribute('minlength')} أحرف على الأقل`;
        } else if (field.validity.tooLong) {
            errorMessage = `يجب أن يتكون هذا الحقل من ${field.getAttribute('maxlength')} أحرف على الأكثر`;
        } else if (field.validity.rangeUnderflow) {
            errorMessage = `يجب أن تكون القيمة ${field.getAttribute('min')} أو أكبر`;
        } else if (field.validity.rangeOverflow) {
            errorMessage = `يجب أن تكون القيمة ${field.getAttribute('max')} أو أقل`;
        } else if (field.validity.stepMismatch) {
            errorMessage = `يجب أن تكون القيمة مضاعفاً لـ ${field.getAttribute('step')}`;
        } else if (field.validity.badInput) {
            errorMessage = 'يرجى إدخال قيمة صالحة';
        } else {
            errorMessage = 'هذا الحقل غير صالح';
        }
        
        // تعيين رسالة الخطأ
        errorContainer.textContent = errorMessage;
    },
    
    /**
     * عرض رسالة خطأ عامة
     * @param {string} message رسالة الخطأ
     */
    showError: function(message) {
        // إنشاء حاوية رسالة الخطأ
        const errorContainer = document.createElement('div');
        errorContainer.className = 'alert alert-danger alert-dismissible fade show';
        errorContainer.role = 'alert';
        errorContainer.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="إغلاق"></button>
        `;
        
        // إضافة حاوية رسالة الخطأ إلى الصفحة
        document.body.insertBefore(errorContainer, document.body.firstChild);
        
        // إزالة رسالة الخطأ بعد 5 ثوانٍ
        setTimeout(() => {
            errorContainer.remove();
        }, 5000);
    },
    
    /**
     * إزالة تحسينات التحقق من المدخلات
     */
    removeInputValidationEnhancements: function() {
        // التحقق من أن التحقق من المدخلات محسن
        if (!this.state.inputValidationEnhanced) {
            return;
        }
        
        // إزالة مستمعي الأحداث من النماذج
        if (this.state.enhancedElements.validatedForms) {
            this.state.enhancedElements.validatedForms.forEach(form => {
                form.removeEventListener('submit', this.validateForm);
            });
            
            this.state.enhancedElements.validatedForms = [];
        }
        
        // إزالة مستمعي الأحداث من حقول النماذج
        if (this.state.enhancedElements.validatedFields) {
            this.state.enhancedElements.validatedFields.forEach(field => {
                field.removeEventListener('input', this.validateField);
                field.removeEventListener('blur', this.validateField);
                
                // إزالة فئات CSS
                field.classList.remove('is-valid', 'is-invalid');
                
                // إزالة رسائل الخطأ
                const errorContainer = field.nextElementSibling;
                
                if (errorContainer && errorContainer.classList.contains('invalid-feedback')) {
                    errorContainer.remove();
                }
            });
            
            this.state.enhancedElements.validatedFields = [];
        }
        
        // تعيين حالة تحسين التحقق من المدخلات
        this.state.inputValidationEnhanced = false;
        
        console.log('تم إزالة تحسينات التحقق من المدخلات');
    },
    
    /**
     * تنفيذ حماية ضد هجمات XSS
     */
    implementXssProtection: function() {
        // التحقق من أن حماية XSS غير مفعلة بالفعل
        if (this.state.xssProtectionImplemented) {
            return;
        }
        
        // تحديد حقول النماذج
        const formFields = document.querySelectorAll('input[type="text"], input[type="search"], textarea');
        
        // تنفيذ حماية ضد هجمات XSS لحقول النماذج
        formFields.forEach(field => {
            // إضافة مستمع حدث تغيير القيمة
            field.addEventListener('input', this.sanitizeFieldValue.bind(this));
            
            // تخزين العنصر في حالة النظام
            if (!this.state.enhancedElements.xssProtectedFields) {
                this.state.enhancedElements.xssProtectedFields = [];
            }
            
            this.state.enhancedElements.xssProtectedFields.push(field);
        });
        
        // تعيين حالة تنفيذ حماية XSS
        this.state.xssProtectionImplemented = true;
        
        console.log(`تم تنفيذ حماية ضد هجمات XSS لـ ${formFields.length} حقل`);
    },
    
    /**
     * تنظيف قيمة الحقل
     * @param {Event} event حدث تغيير القيمة
     */
    sanitizeFieldValue: function(event) {
        // التحقق من أن نظام الأمان مفعل
        if (!this.state.enabled || !this.state.xssProtectionImplemented) {
            return;
        }
        
        // الحصول على الحقل
        const field = event.target;
        
        // تنظيف قيمة الحقل
        field.value = this.sanitizeInput(field.value);
    },
    
    /**
     * تنظيف المدخلات
     * @param {string} input المدخلات
     * @returns {string} المدخلات المنظفة
     */
    sanitizeInput: function(input) {
        // التحقق من أن المدخلات نص
        if (typeof input !== 'string') {
            return input;
        }
        
        // تنظيف المدخلات
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/`/g, '&#96;')
            .replace(/\(/g, '&#40;')
            .replace(/\)/g, '&#41;')
            .replace(/\{/g, '&#123;')
            .replace(/\}/g, '&#125;')
            .replace(/\[/g, '&#91;')
            .replace(/\]/g, '&#93;')
            .replace(/;/g, '&#59;')
            .replace(/\//g, '&#47;')
            .replace(/\\/g, '&#92;');
    },
    
    /**
     * إزالة حماية XSS
     */
    removeXssProtection: function() {
        // التحقق من أن حماية XSS مفعلة
        if (!this.state.xssProtectionImplemented) {
            return;
        }
        
        // إزالة مستمعي الأحداث من حقول النماذج
        if (this.state.enhancedElements.xssProtectedFields) {
            this.state.enhancedElements.xssProtectedFields.forEach(field => {
                field.removeEventListener('input', this.sanitizeFieldValue);
            });
            
            this.state.enhancedElements.xssProtectedFields = [];
        }
        
        // تعيين حالة تنفيذ حماية XSS
        this.state.xssProtectionImplemented = false;
        
        console.log('تم إزالة حماية XSS');
    },
    
    /**
     * تنفيذ حماية ضد هجمات CSRF
     */
    implementCsrfProtection: function() {
        // التحقق من أن حماية CSRF غير مفعلة بالفعل
        if (this.state.csrfProtectionImplemented) {
            return;
        }
        
        // إنشاء رمز CSRF
        this.generateCsrfToken();
        
        // تحديد النماذج
        const forms = document.querySelectorAll('form');
        
        // تنفيذ حماية ضد هجمات CSRF للنماذج
        forms.forEach(form => {
            // إضافة حقل رمز CSRF
            this.addCsrfTokenField(form);
            
            // تخزين النموذج في حالة النظام
            if (!this.state.enhancedElements.csrfProtectedForms) {
                this.state.enhancedElements.csrfProtectedForms = [];
            }
            
            this.state.enhancedElements.csrfProtectedForms.push(form);
        });
        
        // تعيين حالة تنفيذ حماية CSRF
        this.state.csrfProtectionImplemented = true;
        
        console.log(`تم تنفيذ حماية ضد هجمات CSRF لـ ${forms.length} نموذج`);
    },
    
    /**
     * إنشاء رمز CSRF
     */
    generateCsrfToken: function() {
        // إنشاء رمز CSRF عشوائي
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        // تخزين رمز CSRF
        this.state.csrfToken = token;
        
        // تخزين رمز CSRF في ملف تعريف الارتباط
        document.cookie = `csrf_token=${token}; path=/; secure; samesite=strict`;
        
        return token;
    },
    
    /**
     * إضافة حقل رمز CSRF
     * @param {HTMLFormElement} form النموذج
     */
    addCsrfTokenField: function(form) {
        // البحث عن حقل رمز CSRF
        let csrfField = form.querySelector('input[name="csrf_token"]');
        
        // إذا لم يكن حقل رمز CSRF موجوداً، إنشاء واحد
        if (!csrfField) {
            csrfField = document.createElement('input');
            csrfField.type = 'hidden';
            csrfField.name = 'csrf_token';
            
            // إضافة حقل رمز CSRF إلى النموذج
            form.appendChild(csrfField);
        }
        
        // تعيين قيمة حقل رمز CSRF
        csrfField.value = this.state.csrfToken;
    },
    
    /**
     * التحقق من رمز CSRF
     * @param {HTMLFormElement} form النموذج
     * @returns {boolean} ما إذا كان رمز CSRF صالحاً
     */
    validateCsrfToken: function(form) {
        // البحث عن حقل رمز CSRF
        const csrfField = form.querySelector('input[name="csrf_token"]');
        
        // إذا لم يكن حقل رمز CSRF موجوداً، إرجاع خطأ
        if (!csrfField) {
            return false;
        }
        
        // التحقق من قيمة حقل رمز CSRF
        return csrfField.value === this.state.csrfToken;
    },
    
    /**
     * إزالة حماية CSRF
     */
    removeCsrfProtection: function() {
        // التحقق من أن حماية CSRF مفعلة
        if (!this.state.csrfProtectionImplemented) {
            return;
        }
        
        // إزالة حقول رمز CSRF من النماذج
        if (this.state.enhancedElements.csrfProtectedForms) {
            this.state.enhancedElements.csrfProtectedForms.forEach(form => {
                const csrfField = form.querySelector('input[name="csrf_token"]');
                
                if (csrfField) {
                    csrfField.remove();
                }
            });
            
            this.state.enhancedElements.csrfProtectedForms = [];
        }
        
        // إزالة رمز CSRF من ملف تعريف الارتباط
        document.cookie = 'csrf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        // تعيين حالة تنفيذ حماية CSRF
        this.state.csrfProtectionImplemented = false;
        
        console.log('تم إزالة حماية CSRF');
    },
    
    /**
     * تحسين إدارة الجلسات
     */
    enhanceSessionManagement: function() {
        // التحقق من أن إدارة الجلسات غير محسنة بالفعل
        if (this.state.sessionManagementEnhanced) {
            return;
        }
        
        // تفعيل تسجيل الخروج التلقائي
        this.enableAutoLogout();
        
        // تفعيل خيار "تذكرني"
        if (this.settings.enableRememberMe) {
            this.enableRememberMe();
        }
        
        // تفعيل تجديد الجلسة التلقائي
        if (this.settings.enableAutoSessionRenewal) {
            this.enableAutoSessionRenewal();
        }
        
        // إضافة مستمعي الأحداث
        this.setupSessionEventListeners();
        
        // تعيين حالة تحسين إدارة الجلسات
        this.state.sessionManagementEnhanced = true;
        
        console.log('تم تحسين إدارة الجلسات');
    },
    
    /**
     * تفعيل تسجيل الخروج التلقائي
     */
    enableAutoLogout: function() {
        // التحقق من أن تسجيل الخروج التلقائي غير مفعل بالفعل
        if (this.state.autoLogoutEnabled) {
            return;
        }
        
        // تحديث وقت آخر نشاط
        this.updateLastActivityTime();
        
        // إنشاء مؤقت تسجيل الخروج التلقائي
        this.state.autoLogoutTimer = setInterval(() => {
            // حساب مدة عدم النشاط
            const inactivityTime = (Date.now() - this.state.lastActivityTime) / (1000 * 60);
            
            // إذا كانت مدة عدم النشاط أكبر من الحد المسموح به، تسجيل الخروج
            if (inactivityTime >= this.settings.autoLogoutTime) {
                this.logout();
            }
        }, 60000); // التحقق كل دقيقة
        
        // تعيين حالة تفعيل تسجيل الخروج التلقائي
        this.state.autoLogoutEnabled = true;
        
        console.log('تم تفعيل تسجيل الخروج التلقائي');
    },
    
    /**
     * تحديث وقت آخر نشاط
     */
    updateLastActivityTime: function() {
        // تحديث وقت آخر نشاط
        this.state.lastActivityTime = Date.now();
    },
    
    /**
     * تسجيل الخروج
     */
    logout: function() {
        // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
        window.location.href = '/login.html';
    },
    
    /**
     * تفعيل خيار "تذكرني"
     */
    enableRememberMe: function() {
        // التحقق من أن خيار "تذكرني" غير مفعل بالفعل
        if (this.state.rememberMeEnabled) {
            return;
        }
        
        // البحث عن نموذج تسجيل الدخول
        const loginForm = document.querySelector('form[action*="login"]');
        
        // إذا كان نموذج تسجيل الدخول موجوداً، إضافة خيار "تذكرني"
        if (loginForm) {
            // البحث عن زر تسجيل الدخول
            const submitButton = loginForm.querySelector('button[type="submit"], input[type="submit"]');
            
            // إذا كان زر تسجيل الدخول موجوداً، إضافة خيار "تذكرني" قبله
            if (submitButton) {
                // إنشاء حاوية خيار "تذكرني"
                const rememberMeContainer = document.createElement('div');
                rememberMeContainer.className = 'form-check mb-3';
                
                // إنشاء خيار "تذكرني"
                const rememberMeCheckbox = document.createElement('input');
                rememberMeCheckbox.type = 'checkbox';
                rememberMeCheckbox.id = 'remember-me';
                rememberMeCheckbox.name = 'remember_me';
                rememberMeCheckbox.className = 'form-check-input';
                
                // إنشاء تسمية خيار "تذكرني"
                const rememberMeLabel = document.createElement('label');
                rememberMeLabel.htmlFor = 'remember-me';
                rememberMeLabel.className = 'form-check-label';
                rememberMeLabel.textContent = 'تذكرني';
                
                // إضافة خيار "تذكرني" وتسميته إلى الحاوية
                rememberMeContainer.appendChild(rememberMeCheckbox);
                rememberMeContainer.appendChild(rememberMeLabel);
                
                // إضافة حاوية خيار "تذكرني" قبل زر تسجيل الدخول
                submitButton.parentNode.insertBefore(rememberMeContainer, submitButton);
                
                // تخزين خيار "تذكرني" في حالة النظام
                if (!this.state.enhancedElements.rememberMeElements) {
                    this.state.enhancedElements.rememberMeElements = [];
                }
                
                this.state.enhancedElements.rememberMeElements.push(rememberMeContainer);
            }
        }
        
        // تعيين حالة تفعيل خيار "تذكرني"
        this.state.rememberMeEnabled = true;
        
        console.log('تم تفعيل خيار "تذكرني"');
    },
    
    /**
     * تفعيل تجديد الجلسة التلقائي
     */
    enableAutoSessionRenewal: function() {
        // التحقق من أن تجديد الجلسة التلقائي غير مفعل بالفعل
        if (this.state.autoSessionRenewalEnabled) {
            return;
        }
        
        // إنشاء مؤقت تجديد الجلسة
        this.state.sessionRenewalTimer = setInterval(() => {
            // تجديد الجلسة
            this.renewSession();
        }, this.settings.sessionRenewalInterval * 60000); // التجديد كل فترة محددة
        
        // تعيين حالة تفعيل تجديد الجلسة التلقائي
        this.state.autoSessionRenewalEnabled = true;
        
        console.log('تم تفعيل تجديد الجلسة التلقائي');
    },
    
    /**
     * تجديد الجلسة
     */
    renewSession: function() {
        // إرسال طلب لتجديد الجلسة
        fetch('/api/renew-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': this.state.csrfToken
            }
        })
        .then(response => {
            if (response.ok) {
                console.log('تم تجديد الجلسة بنجاح');
            } else {
                console.error('فشل تجديد الجلسة');
            }
        })
        .catch(error => {
            console.error('خطأ في تجديد الجلسة:', error);
        });
    },
    
    /**
     * إضافة مستمعي الأحداث للجلسة
     */
    setupSessionEventListeners: function() {
        // إضافة مستمعي الأحداث لتحديث وقت آخر نشاط
        document.addEventListener('mousemove', this.updateLastActivityTime.bind(this));
        document.addEventListener('keydown', this.updateLastActivityTime.bind(this));
        document.addEventListener('click', this.updateLastActivityTime.bind(this));
        document.addEventListener('scroll', this.updateLastActivityTime.bind(this));
        
        // تخزين مستمعي الأحداث في حالة النظام
        if (!this.state.enhancedElements.sessionEventListeners) {
            this.state.enhancedElements.sessionEventListeners = [
                { element: document, event: 'mousemove', handler: this.updateLastActivityTime },
                { element: document, event: 'keydown', handler: this.updateLastActivityTime },
                { element: document, event: 'click', handler: this.updateLastActivityTime },
                { element: document, event: 'scroll', handler: this.updateLastActivityTime }
            ];
        }
    },
    
    /**
     * إزالة تحسينات إدارة الجلسات
     */
    removeSessionManagementEnhancements: function() {
        // التحقق من أن إدارة الجلسات محسنة
        if (!this.state.sessionManagementEnhanced) {
            return;
        }
        
        // إزالة تسجيل الخروج التلقائي
        if (this.state.autoLogoutEnabled) {
            clearInterval(this.state.autoLogoutTimer);
            this.state.autoLogoutEnabled = false;
        }
        
        // إزالة خيار "تذكرني"
        if (this.state.rememberMeEnabled && this.state.enhancedElements.rememberMeElements) {
            this.state.enhancedElements.rememberMeElements.forEach(element => {
                element.remove();
            });
            
            this.state.enhancedElements.rememberMeElements = [];
            this.state.rememberMeEnabled = false;
        }
        
        // إزالة تجديد الجلسة التلقائي
        if (this.state.autoSessionRenewalEnabled) {
            clearInterval(this.state.sessionRenewalTimer);
            this.state.autoSessionRenewalEnabled = false;
        }
        
        // إزالة مستمعي الأحداث
        if (this.state.enhancedElements.sessionEventListeners) {
            this.state.enhancedElements.sessionEventListeners.forEach(listener => {
                listener.element.removeEventListener(listener.event, listener.handler);
            });
            
            this.state.enhancedElements.sessionEventListeners = [];
        }
        
        // تعيين حالة تحسين إدارة الجلسات
        this.state.sessionManagementEnhanced = false;
        
        console.log('تم إزالة تحسينات إدارة الجلسات');
    }
};

// تهيئة نظام الأمان عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    Security.init();
    
    console.log('تم تهيئة نظام الأمان');
});

// تصدير كائن Security للاستخدام في ملفات أخرى
window.Security = Security;
