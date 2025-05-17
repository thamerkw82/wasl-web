/**
 * تحسين إمكانية الوصول (Accessibility)
 * يوفر تحسينات لإمكانية الوصول للمستخدمين ذوي الاحتياجات الخاصة
 */

// كائن لإدارة إمكانية الوصول
const Accessibility = {
    // إعدادات افتراضية
    settings: {
        // ما إذا كان يجب تفعيل تحسينات إمكانية الوصول تلقائياً
        autoEnable: true,
        
        // ما إذا كان يجب إضافة سمات ARIA تلقائياً
        addAriaAttributes: true,
        
        // ما إذا كان يجب تحسين التباين اللوني
        enhanceColorContrast: true,
        
        // ما إذا كان يجب دعم قارئات الشاشة
        supportScreenReaders: true,
        
        // ما إذا كان يجب إضافة اختصارات لوحة المفاتيح
        addKeyboardShortcuts: true,
        
        // ما إذا كان يجب إضافة شريط أدوات إمكانية الوصول
        showAccessibilityToolbar: true,
        
        // ما إذا كان يجب تفعيل وضع التباين العالي
        highContrastMode: false,
        
        // ما إذا كان يجب تفعيل وضع تكبير النص
        largeTextMode: false,
        
        // ما إذا كان يجب تفعيل وضع قراءة النص
        readTextMode: false,
        
        // ما إذا كان يجب تفعيل وضع التنقل بلوحة المفاتيح
        keyboardNavigationMode: false
    },
    
    // حالة النظام
    state: {
        // ما إذا كان نظام إمكانية الوصول مفعلاً
        enabled: false,
        
        // ما إذا كانت سمات ARIA مضافة
        ariaAttributesAdded: false,
        
        // ما إذا كان التباين اللوني محسناً
        colorContrastEnhanced: false,
        
        // ما إذا كان دعم قارئات الشاشة مفعلاً
        screenReadersSupported: false,
        
        // ما إذا كانت اختصارات لوحة المفاتيح مضافة
        keyboardShortcutsAdded: false,
        
        // ما إذا كان شريط أدوات إمكانية الوصول مضافاً
        accessibilityToolbarAdded: false,
        
        // ما إذا كان وضع التباين العالي مفعلاً
        highContrastModeEnabled: false,
        
        // ما إذا كان وضع تكبير النص مفعلاً
        largeTextModeEnabled: false,
        
        // ما إذا كان وضع قراءة النص مفعلاً
        readTextModeEnabled: false,
        
        // ما إذا كان وضع التنقل بلوحة المفاتيح مفعلاً
        keyboardNavigationModeEnabled: false,
        
        // العناصر التي تم تحسينها
        enhancedElements: {}
    },
    
    /**
     * تهيئة نظام إمكانية الوصول
     * @param {Object} options خيارات التهيئة
     */
    init: function(options = {}) {
        // دمج الخيارات مع الإعدادات الافتراضية
        this.settings = { ...this.settings, ...options };
        
        // تفعيل نظام إمكانية الوصول إذا كان مطلوباً
        if (this.settings.autoEnable) {
            this.enable();
        }
        
        console.log('تم تهيئة نظام إمكانية الوصول');
    },
    
    /**
     * تفعيل نظام إمكانية الوصول
     */
    enable: function() {
        // تفعيل نظام إمكانية الوصول
        this.state.enabled = true;
        
        // إضافة سمات ARIA إذا كان مطلوباً
        if (this.settings.addAriaAttributes) {
            this.addAriaAttributes();
        }
        
        // تحسين التباين اللوني إذا كان مطلوباً
        if (this.settings.enhanceColorContrast) {
            this.enhanceColorContrast();
        }
        
        // دعم قارئات الشاشة إذا كان مطلوباً
        if (this.settings.supportScreenReaders) {
            this.supportScreenReaders();
        }
        
        // إضافة اختصارات لوحة المفاتيح إذا كان مطلوباً
        if (this.settings.addKeyboardShortcuts) {
            this.addKeyboardShortcuts();
        }
        
        // إضافة شريط أدوات إمكانية الوصول إذا كان مطلوباً
        if (this.settings.showAccessibilityToolbar) {
            this.addAccessibilityToolbar();
        }
        
        // إضافة فئة CSS لتفعيل نظام إمكانية الوصول
        document.documentElement.classList.add('accessibility-enabled');
        
        console.log('تم تفعيل نظام إمكانية الوصول');
    },
    
    /**
     * تعطيل نظام إمكانية الوصول
     */
    disable: function() {
        // تعطيل نظام إمكانية الوصول
        this.state.enabled = false;
        
        // إزالة سمات ARIA
        this.removeAriaAttributes();
        
        // إزالة تحسينات التباين اللوني
        this.removeColorContrastEnhancements();
        
        // إزالة دعم قارئات الشاشة
        this.removeScreenReaderSupport();
        
        // إزالة اختصارات لوحة المفاتيح
        this.removeKeyboardShortcuts();
        
        // إزالة شريط أدوات إمكانية الوصول
        this.removeAccessibilityToolbar();
        
        // إزالة فئة CSS لتفعيل نظام إمكانية الوصول
        document.documentElement.classList.remove('accessibility-enabled');
        
        console.log('تم تعطيل نظام إمكانية الوصول');
    },
    
    /**
     * إضافة سمات ARIA
     */
    addAriaAttributes: function() {
        // التحقق من أن سمات ARIA غير مضافة بالفعل
        if (this.state.ariaAttributesAdded) {
            return;
        }
        
        // إضافة سمات ARIA للعناصر
        this.addAriaToButtons();
        this.addAriaToLinks();
        this.addAriaToForms();
        this.addAriaToImages();
        this.addAriaToTables();
        this.addAriaToLandmarks();
        
        // تعيين حالة إضافة سمات ARIA
        this.state.ariaAttributesAdded = true;
        
        console.log('تم إضافة سمات ARIA');
    },
    
    /**
     * إضافة سمات ARIA للأزرار
     */
    addAriaToButtons: function() {
        // تحديد الأزرار
        const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"], input[type="reset"], .btn');
        
        // إضافة سمات ARIA للأزرار
        buttons.forEach(button => {
            // إضافة دور الزر إذا لم يكن موجوداً
            if (!button.hasAttribute('role')) {
                button.setAttribute('role', 'button');
            }
            
            // إضافة سمة aria-label إذا لم يكن للزر نص
            if (!button.textContent.trim() && !button.hasAttribute('aria-label') && !button.hasAttribute('aria-labelledby')) {
                // استخدام قيمة السمة value أو alt أو title إذا كانت موجودة
                const label = button.value || button.getAttribute('alt') || button.getAttribute('title') || 'زر';
                button.setAttribute('aria-label', label);
            }
            
            // إضافة سمة aria-disabled إذا كان الزر معطلاً
            if (button.disabled) {
                button.setAttribute('aria-disabled', 'true');
            }
            
            // تخزين العنصر في حالة النظام
            if (!this.state.enhancedElements.ariaButtons) {
                this.state.enhancedElements.ariaButtons = [];
            }
            
            this.state.enhancedElements.ariaButtons.push(button);
        });
        
        console.log(`تم إضافة سمات ARIA لـ ${buttons.length} زر`);
    },
    
    /**
     * إضافة سمات ARIA للروابط
     */
    addAriaToLinks: function() {
        // تحديد الروابط
        const links = document.querySelectorAll('a');
        
        // إضافة سمات ARIA للروابط
        links.forEach(link => {
            // إضافة سمة aria-label إذا لم يكن للرابط نص
            if (!link.textContent.trim() && !link.hasAttribute('aria-label') && !link.hasAttribute('aria-labelledby')) {
                // استخدام قيمة السمة title أو href إذا كانت موجودة
                const label = link.getAttribute('title') || link.getAttribute('href') || 'رابط';
                link.setAttribute('aria-label', label);
            }
            
            // إضافة سمة aria-current للرابط النشط
            if (link.classList.contains('active') || link.classList.contains('current') || link.getAttribute('href') === window.location.pathname) {
                link.setAttribute('aria-current', 'page');
            }
            
            // تخزين العنصر في حالة النظام
            if (!this.state.enhancedElements.ariaLinks) {
                this.state.enhancedElements.ariaLinks = [];
            }
            
            this.state.enhancedElements.ariaLinks.push(link);
        });
        
        console.log(`تم إضافة سمات ARIA لـ ${links.length} رابط`);
    },
    
    /**
     * إضافة سمات ARIA للنماذج
     */
    addAriaToForms: function() {
        // تحديد النماذج
        const forms = document.querySelectorAll('form');
        
        // إضافة سمات ARIA للنماذج
        forms.forEach(form => {
            // إضافة دور النموذج
            form.setAttribute('role', 'form');
            
            // تحديد حقول النموذج
            const formFields = form.querySelectorAll('input, select, textarea');
            
            // إضافة سمات ARIA لحقول النموذج
            formFields.forEach(field => {
                // إضافة سمة aria-required إذا كان الحقل مطلوباً
                if (field.required) {
                    field.setAttribute('aria-required', 'true');
                }
                
                // إضافة سمة aria-invalid إذا كان الحقل غير صالح
                if (!field.validity.valid) {
                    field.setAttribute('aria-invalid', 'true');
                }
                
                // البحث عن تسمية الحقل
                const fieldId = field.id;
                const label = form.querySelector(`label[for="${fieldId}"]`);
                
                // إضافة سمة aria-labelledby إذا كانت هناك تسمية
                if (label) {
                    // التأكد من أن التسمية لها معرف
                    if (!label.id) {
                        label.id = `label-${fieldId}`;
                    }
                    
                    field.setAttribute('aria-labelledby', label.id);
                }
                // إضافة سمة aria-label إذا لم تكن هناك تسمية
                else if (!field.hasAttribute('aria-label') && !field.hasAttribute('aria-labelledby')) {
                    // استخدام قيمة السمة placeholder أو name إذا كانت موجودة
                    const labelText = field.getAttribute('placeholder') || field.name || 'حقل';
                    field.setAttribute('aria-label', labelText);
                }
            });
            
            // تخزين النموذج في حالة النظام
            if (!this.state.enhancedElements.ariaForms) {
                this.state.enhancedElements.ariaForms = [];
            }
            
            this.state.enhancedElements.ariaForms.push(form);
        });
        
        console.log(`تم إضافة سمات ARIA لـ ${forms.length} نموذج`);
    },
    
    /**
     * إضافة سمات ARIA للصور
     */
    addAriaToImages: function() {
        // تحديد الصور
        const images = document.querySelectorAll('img');
        
        // إضافة سمات ARIA للصور
        images.forEach(image => {
            // إضافة سمة alt إذا لم تكن موجودة
            if (!image.hasAttribute('alt')) {
                // استخدام قيمة السمة title أو src إذا كانت موجودة
                const alt = image.getAttribute('title') || image.getAttribute('src').split('/').pop().split('.')[0] || 'صورة';
                image.setAttribute('alt', alt);
            }
            
            // إضافة دور الصورة إذا كانت الصورة زخرفية
            if (image.getAttribute('alt') === '') {
                image.setAttribute('role', 'presentation');
            }
            
            // تخزين العنصر في حالة النظام
            if (!this.state.enhancedElements.ariaImages) {
                this.state.enhancedElements.ariaImages = [];
            }
            
            this.state.enhancedElements.ariaImages.push(image);
        });
        
        console.log(`تم إضافة سمات ARIA لـ ${images.length} صورة`);
    },
    
    /**
     * إضافة سمات ARIA للجداول
     */
    addAriaToTables: function() {
        // تحديد الجداول
        const tables = document.querySelectorAll('table');
        
        // إضافة سمات ARIA للجداول
        tables.forEach(table => {
            // إضافة دور الجدول
            table.setAttribute('role', 'table');
            
            // إضافة سمة aria-label إذا لم تكن موجودة
            if (!table.hasAttribute('aria-label') && !table.hasAttribute('aria-labelledby')) {
                // البحث عن عنوان الجدول
                const caption = table.querySelector('caption');
                
                if (caption) {
                    // التأكد من أن العنوان له معرف
                    if (!caption.id) {
                        caption.id = `caption-${Date.now()}`;
                    }
                    
                    table.setAttribute('aria-labelledby', caption.id);
                } else {
                    table.setAttribute('aria-label', 'جدول');
                }
            }
            
            // إضافة سمات ARIA لصفوف الجدول
            const rows = table.querySelectorAll('tr');
            
            rows.forEach(row => {
                row.setAttribute('role', 'row');
            });
            
            // إضافة سمات ARIA لخلايا الجدول
            const headerCells = table.querySelectorAll('th');
            
            headerCells.forEach(cell => {
                cell.setAttribute('role', 'columnheader');
                
                // إضافة سمة scope إذا لم تكن موجودة
                if (!cell.hasAttribute('scope')) {
                    cell.setAttribute('scope', 'col');
                }
            });
            
            const dataCells = table.querySelectorAll('td');
            
            dataCells.forEach(cell => {
                cell.setAttribute('role', 'cell');
            });
            
            // تخزين العنصر في حالة النظام
            if (!this.state.enhancedElements.ariaTables) {
                this.state.enhancedElements.ariaTables = [];
            }
            
            this.state.enhancedElements.ariaTables.push(table);
        });
        
        console.log(`تم إضافة سمات ARIA لـ ${tables.length} جدول`);
    },
    
    /**
     * إضافة سمات ARIA للمعالم
     */
    addAriaToLandmarks: function() {
        // تحديد المعالم
        const landmarks = {
            header: document.querySelectorAll('header'),
            nav: document.querySelectorAll('nav'),
            main: document.querySelectorAll('main'),
            aside: document.querySelectorAll('aside'),
            footer: document.querySelectorAll('footer'),
            search: document.querySelectorAll('form[role="search"]')
        };
        
        // إضافة سمات ARIA للمعالم
        for (const [role, elements] of Object.entries(landmarks)) {
            elements.forEach(element => {
                // إضافة دور المعلم
                element.setAttribute('role', role);
                
                // إضافة سمة aria-label إذا لم تكن موجودة
                if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
                    let label;
                    
                    switch (role) {
                        case 'header':
                            label = 'رأس الصفحة';
                            break;
                        case 'nav':
                            label = 'التنقل';
                            break;
                        case 'main':
                            label = 'المحتوى الرئيسي';
                            break;
                        case 'aside':
                            label = 'المحتوى الجانبي';
                            break;
                        case 'footer':
                            label = 'تذييل الصفحة';
                            break;
                        case 'search':
                            label = 'البحث';
                            break;
                        default:
                            label = role;
                    }
                    
                    element.setAttribute('aria-label', label);
                }
                
                // تخزين العنصر في حالة النظام
                if (!this.state.enhancedElements.ariaLandmarks) {
                    this.state.enhancedElements.ariaLandmarks = [];
                }
                
                this.state.enhancedElements.ariaLandmarks.push(element);
            });
            
            console.log(`تم إضافة سمات ARIA لـ ${elements.length} معلم ${role}`);
        }
    },
    
    /**
     * إزالة سمات ARIA
     */
    removeAriaAttributes: function() {
        // التحقق من أن سمات ARIA مضافة
        if (!this.state.ariaAttributesAdded) {
            return;
        }
        
        // إزالة سمات ARIA من الأزرار
        if (this.state.enhancedElements.ariaButtons) {
            this.state.enhancedElements.ariaButtons.forEach(button => {
                button.removeAttribute('role');
                button.removeAttribute('aria-label');
                button.removeAttribute('aria-disabled');
            });
            
            this.state.enhancedElements.ariaButtons = [];
        }
        
        // إزالة سمات ARIA من الروابط
        if (this.state.enhancedElements.ariaLinks) {
            this.state.enhancedElements.ariaLinks.forEach(link => {
                link.removeAttribute('aria-label');
                link.removeAttribute('aria-current');
            });
            
            this.state.enhancedElements.ariaLinks = [];
        }
        
        // إزالة سمات ARIA من النماذج
        if (this.state.enhancedElements.ariaForms) {
            this.state.enhancedElements.ariaForms.forEach(form => {
                form.removeAttribute('role');
                
                const formFields = form.querySelectorAll('input, select, textarea');
                
                formFields.forEach(field => {
                    field.removeAttribute('aria-required');
                    field.removeAttribute('aria-invalid');
                    field.removeAttribute('aria-labelledby');
                    field.removeAttribute('aria-label');
                });
            });
            
            this.state.enhancedElements.ariaForms = [];
        }
        
        // إزالة سمات ARIA من الصور
        if (this.state.enhancedElements.ariaImages) {
            this.state.enhancedElements.ariaImages.forEach(image => {
                if (image.getAttribute('alt') === '') {
                    image.removeAttribute('role');
                }
            });
            
            this.state.enhancedElements.ariaImages = [];
        }
        
        // إزالة سمات ARIA من الجداول
        if (this.state.enhancedElements.ariaTables) {
            this.state.enhancedElements.ariaTables.forEach(table => {
                table.removeAttribute('role');
                table.removeAttribute('aria-label');
                table.removeAttribute('aria-labelledby');
                
                const rows = table.querySelectorAll('tr');
                
                rows.forEach(row => {
                    row.removeAttribute('role');
                });
                
                const headerCells = table.querySelectorAll('th');
                
                headerCells.forEach(cell => {
                    cell.removeAttribute('role');
                });
                
                const dataCells = table.querySelectorAll('td');
                
                dataCells.forEach(cell => {
                    cell.removeAttribute('role');
                });
            });
            
            this.state.enhancedElements.ariaTables = [];
        }
        
        // إزالة سمات ARIA من المعالم
        if (this.state.enhancedElements.ariaLandmarks) {
            this.state.enhancedElements.ariaLandmarks.forEach(landmark => {
                landmark.removeAttribute('role');
                landmark.removeAttribute('aria-label');
            });
            
            this.state.enhancedElements.ariaLandmarks = [];
        }
        
        // تعيين حالة إضافة سمات ARIA
        this.state.ariaAttributesAdded = false;
        
        console.log('تم إزالة سمات ARIA');
    },
    
    /**
     * تحسين التباين اللوني
     */
    enhanceColorContrast: function() {
        // التحقق من أن التباين اللوني غير محسن بالفعل
        if (this.state.colorContrastEnhanced) {
            return;
        }
        
        // إضافة فئة CSS لتحسين التباين اللوني
        document.documentElement.classList.add('enhanced-contrast');
        
        // تحديد العناصر النصية
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, input, textarea, select, label');
        
        // تحسين التباين اللوني للعناصر النصية
        textElements.forEach(element => {
            // تخزين النمط الأصلي
            const originalStyle = {
                color: window.getComputedStyle(element).color,
                backgroundColor: window.getComputedStyle(element).backgroundColor
            };
            
            // تخزين النمط الأصلي في سمة مخصصة
            element.setAttribute('data-original-contrast', JSON.stringify(originalStyle));
            
            // تخزين العنصر في حالة النظام
            if (!this.state.enhancedElements.contrastElements) {
                this.state.enhancedElements.contrastElements = [];
            }
            
            this.state.enhancedElements.contrastElements.push(element);
        });
        
        // تعيين حالة تحسين التباين اللوني
        this.state.colorContrastEnhanced = true;
        
        console.log(`تم تحسين التباين اللوني لـ ${textElements.length} عنصر`);
    },
    
    /**
     * إزالة تحسينات التباين اللوني
     */
    removeColorContrastEnhancements: function() {
        // التحقق من أن التباين اللوني محسن
        if (!this.state.colorContrastEnhanced) {
            return;
        }
        
        // إزالة فئة CSS لتحسين التباين اللوني
        document.documentElement.classList.remove('enhanced-contrast');
        
        // استعادة النمط الأصلي للعناصر
        if (this.state.enhancedElements.contrastElements) {
            this.state.enhancedElements.contrastElements.forEach(element => {
                // استعادة النمط الأصلي
                const originalStyle = JSON.parse(element.getAttribute('data-original-contrast'));
                
                if (originalStyle) {
                    element.style.color = originalStyle.color;
                    element.style.backgroundColor = originalStyle.backgroundColor;
                    
                    element.removeAttribute('data-original-contrast');
                }
            });
            
            this.state.enhancedElements.contrastElements = [];
        }
        
        // تعيين حالة تحسين التباين اللوني
        this.state.colorContrastEnhanced = false;
        
        console.log('تم إزالة تحسينات التباين اللوني');
    },
    
    /**
     * دعم قارئات الشاشة
     */
    supportScreenReaders: function() {
        // التحقق من أن دعم قارئات الشاشة غير مفعل بالفعل
        if (this.state.screenReadersSupported) {
            return;
        }
        
        // إضافة فئة CSS لدعم قارئات الشاشة
        document.documentElement.classList.add('screen-reader-support');
        
        // إضافة عناصر مساعدة لقارئات الشاشة
        this.addSkipLinks();
        this.addScreenReaderText();
        
        // تعيين حالة دعم قارئات الشاشة
        this.state.screenReadersSupported = true;
        
        console.log('تم تفعيل دعم قارئات الشاشة');
    },
    
    /**
     * إضافة روابط التخطي
     */
    addSkipLinks: function() {
        // التحقق من وجود روابط التخطي
        if (document.getElementById('skip-links')) {
            return;
        }
        
        // إنشاء حاوية لروابط التخطي
        const skipLinks = document.createElement('div');
        skipLinks.id = 'skip-links';
        skipLinks.className = 'skip-links';
        
        // تعيين نمط روابط التخطي
        skipLinks.style.position = 'absolute';
        skipLinks.style.top = '-1000px';
        skipLinks.style.left = '0';
        skipLinks.style.zIndex = '9999';
        skipLinks.style.padding = '10px';
        skipLinks.style.backgroundColor = '#fff';
        skipLinks.style.border = '1px solid #000';
        skipLinks.style.borderRadius = '5px';
        skipLinks.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
        
        // إضافة روابط التخطي
        const mainContent = document.querySelector('main, #main, .main, [role="main"]');
        const navigation = document.querySelector('nav, #nav, .nav, [role="navigation"]');
        const search = document.querySelector('form[role="search"], #search, .search');
        
        if (mainContent) {
            // التأكد من أن المحتوى الرئيسي له معرف
            if (!mainContent.id) {
                mainContent.id = 'main-content';
            }
            
            // إضافة رابط التخطي إلى المحتوى الرئيسي
            const skipToMain = document.createElement('a');
            skipToMain.href = `#${mainContent.id}`;
            skipToMain.textContent = 'تخطي إلى المحتوى الرئيسي';
            skipToMain.className = 'skip-link';
            
            // تعيين نمط رابط التخطي
            skipToMain.style.display = 'block';
            skipToMain.style.padding = '5px';
            skipToMain.style.color = '#000';
            skipToMain.style.textDecoration = 'none';
            
            // إضافة مستمع حدث التركيز
            skipToMain.addEventListener('focus', () => {
                skipLinks.style.top = '0';
            });
            
            // إضافة مستمع حدث فقدان التركيز
            skipToMain.addEventListener('blur', () => {
                skipLinks.style.top = '-1000px';
            });
            
            skipLinks.appendChild(skipToMain);
        }
        
        if (navigation) {
            // التأكد من أن التنقل له معرف
            if (!navigation.id) {
                navigation.id = 'navigation';
            }
            
            // إضافة رابط التخطي إلى التنقل
            const skipToNav = document.createElement('a');
            skipToNav.href = `#${navigation.id}`;
            skipToNav.textContent = 'تخطي إلى التنقل';
            skipToNav.className = 'skip-link';
            
            // تعيين نمط رابط التخطي
            skipToNav.style.display = 'block';
            skipToNav.style.padding = '5px';
            skipToNav.style.color = '#000';
            skipToNav.style.textDecoration = 'none';
            
            // إضافة مستمع حدث التركيز
            skipToNav.addEventListener('focus', () => {
                skipLinks.style.top = '0';
            });
            
            // إضافة مستمع حدث فقدان التركيز
            skipToNav.addEventListener('blur', () => {
                skipLinks.style.top = '-1000px';
            });
            
            skipLinks.appendChild(skipToNav);
        }
        
        if (search) {
            // التأكد من أن البحث له معرف
            if (!search.id) {
                search.id = 'search';
            }
            
            // إضافة رابط التخطي إلى البحث
            const skipToSearch = document.createElement('a');
            skipToSearch.href = `#${search.id}`;
            skipToSearch.textContent = 'تخطي إلى البحث';
            skipToSearch.className = 'skip-link';
            
            // تعيين نمط رابط التخطي
            skipToSearch.style.display = 'block';
            skipToSearch.style.padding = '5px';
            skipToSearch.style.color = '#000';
            skipToSearch.style.textDecoration = 'none';
            
            // إضافة مستمع حدث التركيز
            skipToSearch.addEventListener('focus', () => {
                skipLinks.style.top = '0';
            });
            
            // إضافة مستمع حدث فقدان التركيز
            skipToSearch.addEventListener('blur', () => {
                skipLinks.style.top = '-1000px';
            });
            
            skipLinks.appendChild(skipToSearch);
        }
        
        // إضافة روابط التخطي إلى الصفحة
        document.body.insertBefore(skipLinks, document.body.firstChild);
        
        // تخزين روابط التخطي في حالة النظام
        if (!this.state.enhancedElements.skipLinks) {
            this.state.enhancedElements.skipLinks = [];
        }
        
        this.state.enhancedElements.skipLinks.push(skipLinks);
        
        console.log('تم إضافة روابط التخطي');
    },
    
    /**
     * إضافة نص لقارئات الشاشة
     */
    addScreenReaderText: function() {
        // تحديد العناصر التي تحتاج إلى نص لقارئات الشاشة
        const elementsNeedingText = document.querySelectorAll('i.fa, i.fas, i.far, i.fab, i.material-icons, .icon, svg');
        
        // إضافة نص لقارئات الشاشة
        elementsNeedingText.forEach(element => {
            // التحقق من أن العنصر ليس له نص أو سمة aria-label أو aria-labelledby
            if (!element.textContent.trim() && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
                // البحث عن نص وصفي
                let label = '';
                
                // البحث في السمات
                const title = element.getAttribute('title');
                const dataOriginalTitle = element.getAttribute('data-original-title');
                
                if (title) {
                    label = title;
                } else if (dataOriginalTitle) {
                    label = dataOriginalTitle;
                } else {
                    // البحث في الفئات
                    const classes = Array.from(element.classList);
                    
                    for (const className of classes) {
                        if (className.startsWith('fa-') || className.startsWith('icon-')) {
                            label = className.substring(3).replace(/-/g, ' ');
                            break;
                        }
                    }
                    
                    // إذا لم يتم العثور على نص وصفي، استخدم نص افتراضي
                    if (!label) {
                        label = 'أيقونة';
                    }
                }
                
                // إضافة سمة aria-label
                element.setAttribute('aria-label', label);
                
                // تخزين العنصر في حالة النظام
                if (!this.state.enhancedElements.screenReaderTextElements) {
                    this.state.enhancedElements.screenReaderTextElements = [];
                }
                
                this.state.enhancedElements.screenReaderTextElements.push(element);
            }
        });
        
        console.log(`تم إضافة نص لقارئات الشاشة لـ ${elementsNeedingText.length} عنصر`);
    },
    
    /**
     * إزالة دعم قارئات الشاشة
     */
    removeScreenReaderSupport: function() {
        // التحقق من أن دعم قارئات الشاشة مفعل
        if (!this.state.screenReadersSupported) {
            return;
        }
        
        // إزالة فئة CSS لدعم قارئات الشاشة
        document.documentElement.classList.remove('screen-reader-support');
        
        // إزالة روابط التخطي
        if (this.state.enhancedElements.skipLinks) {
            this.state.enhancedElements.skipLinks.forEach(skipLinks => {
                skipLinks.remove();
            });
            
            this.state.enhancedElements.skipLinks = [];
        }
        
        // إزالة نص قارئات الشاشة
        if (this.state.enhancedElements.screenReaderTextElements) {
            this.state.enhancedElements.screenReaderTextElements.forEach(element => {
                element.removeAttribute('aria-label');
            });
            
            this.state.enhancedElements.screenReaderTextElements = [];
        }
        
        // تعيين حالة دعم قارئات الشاشة
        this.state.screenReadersSupported = false;
        
        console.log('تم إزالة دعم قارئات الشاشة');
    },
    
    /**
     * إضافة اختصارات لوحة المفاتيح
     */
    addKeyboardShortcuts: function() {
        // التحقق من أن اختصارات لوحة المفاتيح غير مضافة بالفعل
        if (this.state.keyboardShortcutsAdded) {
            return;
        }
        
        // إضافة مستمع حدث ضغط المفاتيح
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // إضافة فئة CSS لاختصارات لوحة المفاتيح
        document.documentElement.classList.add('keyboard-shortcuts-enabled');
        
        // إضافة مؤشر التركيز
        this.addFocusIndicator();
        
        // تعيين حالة إضافة اختصارات لوحة المفاتيح
        this.state.keyboardShortcutsAdded = true;
        
        console.log('تم إضافة اختصارات لوحة المفاتيح');
    },
    
    /**
     * معالجة حدث ضغط المفاتيح
     * @param {KeyboardEvent} event حدث ضغط المفاتيح
     */
    handleKeyDown: function(event) {
        // التحقق من أن اختصارات لوحة المفاتيح مضافة
        if (!this.state.keyboardShortcutsAdded) {
            return;
        }
        
        // اختصارات لوحة المفاتيح
        const shortcuts = {
            // اختصار للانتقال إلى المحتوى الرئيسي
            'Alt+1': () => {
                const mainContent = document.querySelector('main, #main, .main, [role="main"]');
                
                if (mainContent) {
                    mainContent.focus();
                    mainContent.scrollIntoView();
                }
            },
            
            // اختصار للانتقال إلى التنقل
            'Alt+2': () => {
                const navigation = document.querySelector('nav, #nav, .nav, [role="navigation"]');
                
                if (navigation) {
                    navigation.focus();
                    navigation.scrollIntoView();
                }
            },
            
            // اختصار للانتقال إلى البحث
            'Alt+3': () => {
                const search = document.querySelector('form[role="search"], #search, .search');
                
                if (search) {
                    search.focus();
                    search.scrollIntoView();
                }
            },
            
            // اختصار للانتقال إلى تذييل الصفحة
            'Alt+4': () => {
                const footer = document.querySelector('footer, #footer, .footer, [role="contentinfo"]');
                
                if (footer) {
                    footer.focus();
                    footer.scrollIntoView();
                }
            },
            
            // اختصار لتفعيل وضع التباين العالي
            'Alt+c': () => {
                this.toggleHighContrastMode();
            },
            
            // اختصار لتفعيل وضع تكبير النص
            'Alt+t': () => {
                this.toggleLargeTextMode();
            },
            
            // اختصار لتفعيل وضع قراءة النص
            'Alt+r': () => {
                this.toggleReadTextMode();
            },
            
            // اختصار لتفعيل وضع التنقل بلوحة المفاتيح
            'Alt+k': () => {
                this.toggleKeyboardNavigationMode();
            },
            
            // اختصار لإظهار/إخفاء شريط أدوات إمكانية الوصول
            'Alt+a': () => {
                this.toggleAccessibilityToolbar();
            }
        };
        
        // تحديد المفاتيح المضغوطة
        const key = event.key.toLowerCase();
        const alt = event.altKey;
        const ctrl = event.ctrlKey;
        const shift = event.shiftKey;
        
        // تحديد اختصار لوحة المفاتيح
        let shortcut = '';
        
        if (alt && !ctrl && !shift && /^[1-9a-z]$/.test(key)) {
            shortcut = `Alt+${key}`;
        }
        
        // تنفيذ الإجراء المرتبط بالاختصار
        if (shortcuts[shortcut]) {
            event.preventDefault();
            shortcuts[shortcut]();
            
            console.log(`تم تنفيذ اختصار لوحة المفاتيح: ${shortcut}`);
        }
    },
    
    /**
     * إضافة مؤشر التركيز
     */
    addFocusIndicator: function() {
        // إضافة نمط CSS لمؤشر التركيز
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-shortcuts-enabled *:focus {
                outline: 2px solid #007bff !important;
                outline-offset: 2px !important;
            }
        `;
        
        document.head.appendChild(style);
        
        // تخزين نمط مؤشر التركيز في حالة النظام
        if (!this.state.enhancedElements.focusIndicatorStyle) {
            this.state.enhancedElements.focusIndicatorStyle = [];
        }
        
        this.state.enhancedElements.focusIndicatorStyle.push(style);
        
        console.log('تم إضافة مؤشر التركيز');
    },
    
    /**
     * إزالة اختصارات لوحة المفاتيح
     */
    removeKeyboardShortcuts: function() {
        // التحقق من أن اختصارات لوحة المفاتيح مضافة
        if (!this.state.keyboardShortcutsAdded) {
            return;
        }
        
        // إزالة مستمع حدث ضغط المفاتيح
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // إزالة فئة CSS لاختصارات لوحة المفاتيح
        document.documentElement.classList.remove('keyboard-shortcuts-enabled');
        
        // إزالة مؤشر التركيز
        if (this.state.enhancedElements.focusIndicatorStyle) {
            this.state.enhancedElements.focusIndicatorStyle.forEach(style => {
                style.remove();
            });
            
            this.state.enhancedElements.focusIndicatorStyle = [];
        }
        
        // تعيين حالة إضافة اختصارات لوحة المفاتيح
        this.state.keyboardShortcutsAdded = false;
        
        console.log('تم إزالة اختصارات لوحة المفاتيح');
    },
    
    /**
     * إضافة شريط أدوات إمكانية الوصول
     */
    addAccessibilityToolbar: function() {
        // التحقق من وجود شريط أدوات إمكانية الوصول
        if (document.getElementById('accessibility-toolbar')) {
            return;
        }
        
        // إنشاء شريط أدوات إمكانية الوصول
        const toolbar = document.createElement('div');
        toolbar.id = 'accessibility-toolbar';
        toolbar.className = 'accessibility-toolbar';
        
        // تعيين نمط شريط أدوات إمكانية الوصول
        toolbar.style.position = 'fixed';
        toolbar.style.bottom = '0';
        toolbar.style.left = '0';
        toolbar.style.right = '0';
        toolbar.style.backgroundColor = '#f8f9fa';
        toolbar.style.borderTop = '1px solid #dee2e6';
        toolbar.style.padding = '10px';
        toolbar.style.display = 'flex';
        toolbar.style.justifyContent = 'center';
        toolbar.style.alignItems = 'center';
        toolbar.style.zIndex = '9999';
        toolbar.style.boxShadow = '0 -2px 5px rgba(0, 0, 0, 0.1)';
        
        // إضافة عنوان لشريط الأدوات
        const title = document.createElement('span');
        title.textContent = 'أدوات إمكانية الوصول:';
        title.style.marginRight = '10px';
        title.style.fontWeight = 'bold';
        
        toolbar.appendChild(title);
        
        // إضافة زر لتفعيل وضع التباين العالي
        const contrastButton = document.createElement('button');
        contrastButton.textContent = 'التباين العالي';
        contrastButton.className = 'accessibility-button';
        contrastButton.setAttribute('aria-pressed', this.state.highContrastModeEnabled ? 'true' : 'false');
        
        // تعيين نمط الزر
        contrastButton.style.margin = '0 5px';
        contrastButton.style.padding = '5px 10px';
        contrastButton.style.border = '1px solid #dee2e6';
        contrastButton.style.borderRadius = '5px';
        contrastButton.style.backgroundColor = this.state.highContrastModeEnabled ? '#007bff' : '#fff';
        contrastButton.style.color = this.state.highContrastModeEnabled ? '#fff' : '#000';
        
        // إضافة مستمع حدث النقر
        contrastButton.addEventListener('click', () => {
            this.toggleHighContrastMode();
            contrastButton.setAttribute('aria-pressed', this.state.highContrastModeEnabled ? 'true' : 'false');
            contrastButton.style.backgroundColor = this.state.highContrastModeEnabled ? '#007bff' : '#fff';
            contrastButton.style.color = this.state.highContrastModeEnabled ? '#fff' : '#000';
        });
        
        toolbar.appendChild(contrastButton);
        
        // إضافة زر لتفعيل وضع تكبير النص
        const textButton = document.createElement('button');
        textButton.textContent = 'تكبير النص';
        textButton.className = 'accessibility-button';
        textButton.setAttribute('aria-pressed', this.state.largeTextModeEnabled ? 'true' : 'false');
        
        // تعيين نمط الزر
        textButton.style.margin = '0 5px';
        textButton.style.padding = '5px 10px';
        textButton.style.border = '1px solid #dee2e6';
        textButton.style.borderRadius = '5px';
        textButton.style.backgroundColor = this.state.largeTextModeEnabled ? '#007bff' : '#fff';
        textButton.style.color = this.state.largeTextModeEnabled ? '#fff' : '#000';
        
        // إضافة مستمع حدث النقر
        textButton.addEventListener('click', () => {
            this.toggleLargeTextMode();
            textButton.setAttribute('aria-pressed', this.state.largeTextModeEnabled ? 'true' : 'false');
            textButton.style.backgroundColor = this.state.largeTextModeEnabled ? '#007bff' : '#fff';
            textButton.style.color = this.state.largeTextModeEnabled ? '#fff' : '#000';
        });
        
        toolbar.appendChild(textButton);
        
        // إضافة زر لتفعيل وضع قراءة النص
        const readButton = document.createElement('button');
        readButton.textContent = 'قراءة النص';
        readButton.className = 'accessibility-button';
        readButton.setAttribute('aria-pressed', this.state.readTextModeEnabled ? 'true' : 'false');
        
        // تعيين نمط الزر
        readButton.style.margin = '0 5px';
        readButton.style.padding = '5px 10px';
        readButton.style.border = '1px solid #dee2e6';
        readButton.style.borderRadius = '5px';
        readButton.style.backgroundColor = this.state.readTextModeEnabled ? '#007bff' : '#fff';
        readButton.style.color = this.state.readTextModeEnabled ? '#fff' : '#000';
        
        // إضافة مستمع حدث النقر
        readButton.addEventListener('click', () => {
            this.toggleReadTextMode();
            readButton.setAttribute('aria-pressed', this.state.readTextModeEnabled ? 'true' : 'false');
            readButton.style.backgroundColor = this.state.readTextModeEnabled ? '#007bff' : '#fff';
            readButton.style.color = this.state.readTextModeEnabled ? '#fff' : '#000';
        });
        
        toolbar.appendChild(readButton);
        
        // إضافة زر لتفعيل وضع التنقل بلوحة المفاتيح
        const keyboardButton = document.createElement('button');
        keyboardButton.textContent = 'التنقل بلوحة المفاتيح';
        keyboardButton.className = 'accessibility-button';
        keyboardButton.setAttribute('aria-pressed', this.state.keyboardNavigationModeEnabled ? 'true' : 'false');
        
        // تعيين نمط الزر
        keyboardButton.style.margin = '0 5px';
        keyboardButton.style.padding = '5px 10px';
        keyboardButton.style.border = '1px solid #dee2e6';
        keyboardButton.style.borderRadius = '5px';
        keyboardButton.style.backgroundColor = this.state.keyboardNavigationModeEnabled ? '#007bff' : '#fff';
        keyboardButton.style.color = this.state.keyboardNavigationModeEnabled ? '#fff' : '#000';
        
        // إضافة مستمع حدث النقر
        keyboardButton.addEventListener('click', () => {
            this.toggleKeyboardNavigationMode();
            keyboardButton.setAttribute('aria-pressed', this.state.keyboardNavigationModeEnabled ? 'true' : 'false');
            keyboardButton.style.backgroundColor = this.state.keyboardNavigationModeEnabled ? '#007bff' : '#fff';
            keyboardButton.style.color = this.state.keyboardNavigationModeEnabled ? '#fff' : '#000';
        });
        
        toolbar.appendChild(keyboardButton);
        
        // إضافة زر لإغلاق شريط الأدوات
        const closeButton = document.createElement('button');
        closeButton.textContent = 'إغلاق';
        closeButton.className = 'accessibility-button';
        
        // تعيين نمط الزر
        closeButton.style.margin = '0 5px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.border = '1px solid #dee2e6';
        closeButton.style.borderRadius = '5px';
        closeButton.style.backgroundColor = '#fff';
        closeButton.style.color = '#000';
        
        // إضافة مستمع حدث النقر
        closeButton.addEventListener('click', () => {
            this.toggleAccessibilityToolbar();
        });
        
        toolbar.appendChild(closeButton);
        
        // إضافة شريط أدوات إمكانية الوصول إلى الصفحة
        document.body.appendChild(toolbar);
        
        // تخزين شريط أدوات إمكانية الوصول في حالة النظام
        if (!this.state.enhancedElements.accessibilityToolbar) {
            this.state.enhancedElements.accessibilityToolbar = [];
        }
        
        this.state.enhancedElements.accessibilityToolbar.push(toolbar);
        
        // تعيين حالة إضافة شريط أدوات إمكانية الوصول
        this.state.accessibilityToolbarAdded = true;
        
        console.log('تم إضافة شريط أدوات إمكانية الوصول');
    },
    
    /**
     * إزالة شريط أدوات إمكانية الوصول
     */
    removeAccessibilityToolbar: function() {
        // التحقق من أن شريط أدوات إمكانية الوصول مضاف
        if (!this.state.accessibilityToolbarAdded) {
            return;
        }
        
        // إزالة شريط أدوات إمكانية الوصول
        if (this.state.enhancedElements.accessibilityToolbar) {
            this.state.enhancedElements.accessibilityToolbar.forEach(toolbar => {
                toolbar.remove();
            });
            
            this.state.enhancedElements.accessibilityToolbar = [];
        }
        
        // تعيين حالة إضافة شريط أدوات إمكانية الوصول
        this.state.accessibilityToolbarAdded = false;
        
        console.log('تم إزالة شريط أدوات إمكانية الوصول');
    },
    
    /**
     * تبديل حالة شريط أدوات إمكانية الوصول
     */
    toggleAccessibilityToolbar: function() {
        // التحقق من أن نظام إمكانية الوصول مفعل
        if (!this.state.enabled) {
            return;
        }
        
        // تبديل حالة شريط أدوات إمكانية الوصول
        if (this.state.accessibilityToolbarAdded) {
            this.removeAccessibilityToolbar();
        } else {
            this.addAccessibilityToolbar();
        }
    },
    
    /**
     * تبديل وضع التباين العالي
     */
    toggleHighContrastMode: function() {
        // التحقق من أن نظام إمكانية الوصول مفعل
        if (!this.state.enabled) {
            return;
        }
        
        // تبديل وضع التباين العالي
        if (this.state.highContrastModeEnabled) {
            this.disableHighContrastMode();
        } else {
            this.enableHighContrastMode();
        }
    },
    
    /**
     * تفعيل وضع التباين العالي
     */
    enableHighContrastMode: function() {
        // التحقق من أن وضع التباين العالي غير مفعل بالفعل
        if (this.state.highContrastModeEnabled) {
            return;
        }
        
        // إضافة فئة CSS لوضع التباين العالي
        document.documentElement.classList.add('high-contrast-mode');
        
        // تعيين حالة وضع التباين العالي
        this.state.highContrastModeEnabled = true;
        
        console.log('تم تفعيل وضع التباين العالي');
    },
    
    /**
     * تعطيل وضع التباين العالي
     */
    disableHighContrastMode: function() {
        // التحقق من أن وضع التباين العالي مفعل
        if (!this.state.highContrastModeEnabled) {
            return;
        }
        
        // إزالة فئة CSS لوضع التباين العالي
        document.documentElement.classList.remove('high-contrast-mode');
        
        // تعيين حالة وضع التباين العالي
        this.state.highContrastModeEnabled = false;
        
        console.log('تم تعطيل وضع التباين العالي');
    },
    
    /**
     * تبديل وضع تكبير النص
     */
    toggleLargeTextMode: function() {
        // التحقق من أن نظام إمكانية الوصول مفعل
        if (!this.state.enabled) {
            return;
        }
        
        // تبديل وضع تكبير النص
        if (this.state.largeTextModeEnabled) {
            this.disableLargeTextMode();
        } else {
            this.enableLargeTextMode();
        }
    },
    
    /**
     * تفعيل وضع تكبير النص
     */
    enableLargeTextMode: function() {
        // التحقق من أن وضع تكبير النص غير مفعل بالفعل
        if (this.state.largeTextModeEnabled) {
            return;
        }
        
        // إضافة فئة CSS لوضع تكبير النص
        document.documentElement.classList.add('large-text-mode');
        
        // تعيين حالة وضع تكبير النص
        this.state.largeTextModeEnabled = true;
        
        console.log('تم تفعيل وضع تكبير النص');
    },
    
    /**
     * تعطيل وضع تكبير النص
     */
    disableLargeTextMode: function() {
        // التحقق من أن وضع تكبير النص مفعل
        if (!this.state.largeTextModeEnabled) {
            return;
        }
        
        // إزالة فئة CSS لوضع تكبير النص
        document.documentElement.classList.remove('large-text-mode');
        
        // تعيين حالة وضع تكبير النص
        this.state.largeTextModeEnabled = false;
        
        console.log('تم تعطيل وضع تكبير النص');
    },
    
    /**
     * تبديل وضع قراءة النص
     */
    toggleReadTextMode: function() {
        // التحقق من أن نظام إمكانية الوصول مفعل
        if (!this.state.enabled) {
            return;
        }
        
        // تبديل وضع قراءة النص
        if (this.state.readTextModeEnabled) {
            this.disableReadTextMode();
        } else {
            this.enableReadTextMode();
        }
    },
    
    /**
     * تفعيل وضع قراءة النص
     */
    enableReadTextMode: function() {
        // التحقق من أن وضع قراءة النص غير مفعل بالفعل
        if (this.state.readTextModeEnabled) {
            return;
        }
        
        // إضافة فئة CSS لوضع قراءة النص
        document.documentElement.classList.add('read-text-mode');
        
        // إضافة مستمع حدث النقر
        document.addEventListener('click', this.handleReadTextClick);
        
        // تعيين حالة وضع قراءة النص
        this.state.readTextModeEnabled = true;
        
        console.log('تم تفعيل وضع قراءة النص');
    },
    
    /**
     * معالجة حدث النقر في وضع قراءة النص
     * @param {MouseEvent} event حدث النقر
     */
    handleReadTextClick: function(event) {
        // التحقق من أن وضع قراءة النص مفعل
        if (!Accessibility.state.readTextModeEnabled) {
            return;
        }
        
        // التحقق من أن العنصر المنقور عليه يحتوي على نص
        const element = event.target;
        const text = element.textContent.trim();
        
        if (text) {
            // قراءة النص باستخدام واجهة برمجة التطبيقات للكلام
            if ('speechSynthesis' in window) {
                // إنشاء كائن نطق
                const utterance = new SpeechSynthesisUtterance(text);
                
                // تعيين اللغة
                utterance.lang = 'ar-SA';
                
                // قراءة النص
                window.speechSynthesis.speak(utterance);
                
                console.log(`قراءة النص: ${text}`);
            } else {
                console.log('واجهة برمجة التطبيقات للكلام غير مدعومة في هذا المتصفح');
            }
        }
    },
    
    /**
     * تعطيل وضع قراءة النص
     */
    disableReadTextMode: function() {
        // التحقق من أن وضع قراءة النص مفعل
        if (!this.state.readTextModeEnabled) {
            return;
        }
        
        // إزالة فئة CSS لوضع قراءة النص
        document.documentElement.classList.remove('read-text-mode');
        
        // إزالة مستمع حدث النقر
        document.removeEventListener('click', this.handleReadTextClick);
        
        // إيقاف القراءة الحالية
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        
        // تعيين حالة وضع قراءة النص
        this.state.readTextModeEnabled = false;
        
        console.log('تم تعطيل وضع قراءة النص');
    },
    
    /**
     * تبديل وضع التنقل بلوحة المفاتيح
     */
    toggleKeyboardNavigationMode: function() {
        // التحقق من أن نظام إمكانية الوصول مفعل
        if (!this.state.enabled) {
            return;
        }
        
        // تبديل وضع التنقل بلوحة المفاتيح
        if (this.state.keyboardNavigationModeEnabled) {
            this.disableKeyboardNavigationMode();
        } else {
            this.enableKeyboardNavigationMode();
        }
    },
    
    /**
     * تفعيل وضع التنقل بلوحة المفاتيح
     */
    enableKeyboardNavigationMode: function() {
        // التحقق من أن وضع التنقل بلوحة المفاتيح غير مفعل بالفعل
        if (this.state.keyboardNavigationModeEnabled) {
            return;
        }
        
        // إضافة فئة CSS لوضع التنقل بلوحة المفاتيح
        document.documentElement.classList.add('keyboard-navigation-mode');
        
        // إضافة مؤشرات التنقل
        this.addNavigationIndicators();
        
        // تعيين حالة وضع التنقل بلوحة المفاتيح
        this.state.keyboardNavigationModeEnabled = true;
        
        console.log('تم تفعيل وضع التنقل بلوحة المفاتيح');
    },
    
    /**
     * إضافة مؤشرات التنقل
     */
    addNavigationIndicators: function() {
        // تحديد العناصر القابلة للتنقل
        const navigableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        
        // إضافة مؤشرات التنقل
        navigableElements.forEach((element, index) => {
            // التحقق من أن العنصر مرئي
            const style = window.getComputedStyle(element);
            
            if (style.display !== 'none' && style.visibility !== 'hidden') {
                // إنشاء مؤشر التنقل
                const indicator = document.createElement('span');
                indicator.className = 'navigation-indicator';
                indicator.textContent = index + 1;
                
                // تعيين نمط مؤشر التنقل
                indicator.style.position = 'absolute';
                indicator.style.top = '0';
                indicator.style.left = '0';
                indicator.style.backgroundColor = '#007bff';
                indicator.style.color = '#fff';
                indicator.style.padding = '2px 5px';
                indicator.style.borderRadius = '3px';
                indicator.style.fontSize = '12px';
                indicator.style.fontWeight = 'bold';
                indicator.style.zIndex = '9999';
                
                // تعيين موضع العنصر النسبي
                if (style.position === 'static') {
                    element.style.position = 'relative';
                }
                
                // إضافة مؤشر التنقل إلى العنصر
                element.appendChild(indicator);
                
                // تخزين العنصر في حالة النظام
                if (!this.state.enhancedElements.navigationIndicators) {
                    this.state.enhancedElements.navigationIndicators = [];
                }
                
                this.state.enhancedElements.navigationIndicators.push(indicator);
            }
        });
        
        console.log(`تم إضافة ${this.state.enhancedElements.navigationIndicators.length} مؤشر تنقل`);
    },
    
    /**
     * تعطيل وضع التنقل بلوحة المفاتيح
     */
    disableKeyboardNavigationMode: function() {
        // التحقق من أن وضع التنقل بلوحة المفاتيح مفعل
        if (!this.state.keyboardNavigationModeEnabled) {
            return;
        }
        
        // إزالة فئة CSS لوضع التنقل بلوحة المفاتيح
        document.documentElement.classList.remove('keyboard-navigation-mode');
        
        // إزالة مؤشرات التنقل
        if (this.state.enhancedElements.navigationIndicators) {
            this.state.enhancedElements.navigationIndicators.forEach(indicator => {
                indicator.remove();
            });
            
            this.state.enhancedElements.navigationIndicators = [];
        }
        
        // تعيين حالة وضع التنقل بلوحة المفاتيح
        this.state.keyboardNavigationModeEnabled = false;
        
        console.log('تم تعطيل وضع التنقل بلوحة المفاتيح');
    }
};

// إضافة أنماط CSS لتحسين إمكانية الوصول
const style = document.createElement('style');
style.textContent = `
    /* تحسينات عامة لإمكانية الوصول */
    .accessibility-enabled {
        scroll-behavior: smooth;
    }
    
    /* تحسين التباين اللوني */
    .enhanced-contrast {
        color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }
    
    .enhanced-contrast h1, .enhanced-contrast h2, .enhanced-contrast h3, .enhanced-contrast h4, .enhanced-contrast h5, .enhanced-contrast h6 {
        color: #000 !important;
        background-color: #fff !important;
    }
    
    .enhanced-contrast p, .enhanced-contrast span, .enhanced-contrast div {
        color: #000 !important;
        background-color: #fff !important;
    }
    
    .enhanced-contrast a {
        color: #0000EE !important;
        background-color: #fff !important;
        text-decoration: underline !important;
    }
    
    .enhanced-contrast button, .enhanced-contrast input[type="button"], .enhanced-contrast input[type="submit"], .enhanced-contrast input[type="reset"], .enhanced-contrast .btn {
        color: #fff !important;
        background-color: #000 !important;
        border: 2px solid #000 !important;
    }
    
    /* وضع التباين العالي */
    .high-contrast-mode {
        filter: contrast(150%) !important;
    }
    
    .high-contrast-mode img, .high-contrast-mode video, .high-contrast-mode iframe {
        filter: contrast(120%) !important;
    }
    
    /* وضع تكبير النص */
    .large-text-mode {
        font-size: 125% !important;
    }
    
    .large-text-mode h1 {
        font-size: 2.5em !important;
    }
    
    .large-text-mode h2 {
        font-size: 2em !important;
    }
    
    .large-text-mode h3 {
        font-size: 1.75em !important;
    }
    
    .large-text-mode h4, .large-text-mode h5, .large-text-mode h6 {
        font-size: 1.5em !important;
    }
    
    .large-text-mode p, .large-text-mode span, .large-text-mode a, .large-text-mode button, .large-text-mode input, .large-text-mode textarea, .large-text-mode select, .large-text-mode label {
        font-size: 1.25em !important;
    }
    
    /* وضع قراءة النص */
    .read-text-mode {
        cursor: help !important;
    }
    
    .read-text-mode p, .read-text-mode h1, .read-text-mode h2, .read-text-mode h3, .read-text-mode h4, .read-text-mode h5, .read-text-mode h6, .read-text-mode span, .read-text-mode a, .read-text-mode button, .read-text-mode label {
        transition: background-color 0.3s ease !important;
    }
    
    .read-text-mode p:hover, .read-text-mode h1:hover, .read-text-mode h2:hover, .read-text-mode h3:hover, .read-text-mode h4:hover, .read-text-mode h5:hover, .read-text-mode h6:hover, .read-text-mode span:hover, .read-text-mode a:hover, .read-text-mode button:hover, .read-text-mode label:hover {
        background-color: #ffff99 !important;
    }
    
    /* وضع التنقل بلوحة المفاتيح */
    .keyboard-navigation-mode *:focus {
        outline: 3px solid #ff0000 !important;
        outline-offset: 3px !important;
    }
    
    /* دعم قارئات الشاشة */
    .screen-reader-support .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
    }
    
    .screen-reader-support .sr-only-focusable:active,
    .screen-reader-support .sr-only-focusable:focus {
        position: static !important;
        width: auto !important;
        height: auto !important;
        overflow: visible !important;
        clip: auto !important;
        white-space: normal !important;
    }
`;

document.head.appendChild(style);

// تهيئة نظام إمكانية الوصول عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    Accessibility.init();
    
    console.log('تم تهيئة نظام إمكانية الوصول');
});

// تصدير كائن Accessibility للاستخدام في ملفات أخرى
window.Accessibility = Accessibility;
