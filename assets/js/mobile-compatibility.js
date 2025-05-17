/**
 * تحسين التوافق مع الأجهزة المحمولة
 * يوفر تحسينات لتجربة المستخدم على الأجهزة المحمولة والشاشات الصغيرة
 */

// كائن لإدارة التوافق مع الأجهزة المحمولة
const MobileCompatibility = {
    // إعدادات افتراضية
    settings: {
        // نقاط التوقف للشاشات المختلفة
        breakpoints: {
            xs: 576,  // شاشات صغيرة جداً (الهواتف)
            sm: 768,  // شاشات صغيرة (الهواتف الكبيرة)
            md: 992,  // شاشات متوسطة (الأجهزة اللوحية)
            lg: 1200, // شاشات كبيرة (الحواسيب المحمولة)
            xl: 1400  // شاشات كبيرة جداً (الحواسيب المكتبية)
        },
        
        // ما إذا كان يجب تفعيل وضع الأجهزة المحمولة تلقائياً
        autoEnableMobileMode: true,
        
        // ما إذا كان يجب تفعيل دعم إيماءات اللمس
        enableTouchGestures: true,
        
        // ما إذا كان يجب تفعيل تحسينات الأداء للأجهزة المحمولة
        enableMobilePerformanceOptimizations: true,
        
        // ما إذا كان يجب تفعيل تحسينات واجهة المستخدم للأجهزة المحمولة
        enableMobileUIOptimizations: true,
        
        // ما إذا كان يجب تفعيل التحميل الكسول للصور
        enableLazyLoading: true,
        
        // ما إذا كان يجب تفعيل تحسينات الخطوط للأجهزة المحمولة
        enableFontOptimizations: true
    },
    
    // حالة النظام
    state: {
        // ما إذا كان الجهاز الحالي جهازاً محمولاً
        isMobileDevice: false,
        
        // ما إذا كان الجهاز الحالي جهازاً لوحياً
        isTabletDevice: false,
        
        // ما إذا كان الجهاز الحالي يدعم اللمس
        isTouchDevice: false,
        
        // حجم الشاشة الحالي
        screenSize: 'lg',
        
        // اتجاه الشاشة الحالي (أفقي أو عمودي)
        orientation: 'portrait',
        
        // عرض الشاشة الحالي
        screenWidth: window.innerWidth,
        
        // ارتفاع الشاشة الحالي
        screenHeight: window.innerHeight,
        
        // ما إذا كان وضع الأجهزة المحمولة مفعلاً
        mobileMode: false,
        
        // ما إذا كان دعم إيماءات اللمس مفعلاً
        touchGesturesEnabled: false,
        
        // العناصر التي تم تحسينها للأجهزة المحمولة
        optimizedElements: {}
    },
    
    /**
     * تهيئة نظام التوافق مع الأجهزة المحمولة
     * @param {Object} options خيارات التهيئة
     */
    init: function(options = {}) {
        // دمج الخيارات مع الإعدادات الافتراضية
        this.settings = { ...this.settings, ...options };
        
        // تحديد نوع الجهاز
        this.detectDeviceType();
        
        // تحديد حجم الشاشة
        this.detectScreenSize();
        
        // تحديد اتجاه الشاشة
        this.detectOrientation();
        
        // تفعيل وضع الأجهزة المحمولة إذا كان مطلوباً
        if (this.settings.autoEnableMobileMode && (this.state.isMobileDevice || this.state.isTabletDevice)) {
            this.enableMobileMode();
        }
        
        // تفعيل دعم إيماءات اللمس إذا كان مطلوباً
        if (this.settings.enableTouchGestures && this.state.isTouchDevice) {
            this.enableTouchGestures();
        }
        
        // تحسين العناصر للأجهزة المحمولة
        this.optimizeElementsForMobile();
        
        // إضافة مستمعي الأحداث
        this.setupEventListeners();
        
        console.log('تم تهيئة نظام التوافق مع الأجهزة المحمولة');
    },
    
    /**
     * تحديد نوع الجهاز
     */
    detectDeviceType: function() {
        // تحديد ما إذا كان الجهاز جهازاً محمولاً
        const userAgent = navigator.userAgent.toLowerCase();
        
        // تحديد ما إذا كان الجهاز جهازاً محمولاً
        this.state.isMobileDevice = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        
        // تحديد ما إذا كان الجهاز جهازاً لوحياً
        this.state.isTabletDevice = /ipad|android(?!.*mobile)/i.test(userAgent) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /macintosh/i.test(userAgent));
        
        // تحديد ما إذا كان الجهاز يدعم اللمس
        this.state.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        
        console.log(`نوع الجهاز: ${this.state.isMobileDevice ? 'محمول' : this.state.isTabletDevice ? 'لوحي' : 'سطح مكتب'}`);
        console.log(`دعم اللمس: ${this.state.isTouchDevice ? 'مدعوم' : 'غير مدعوم'}`);
    },
    
    /**
     * تحديد حجم الشاشة
     */
    detectScreenSize: function() {
        // تحديث أبعاد الشاشة
        this.state.screenWidth = window.innerWidth;
        this.state.screenHeight = window.innerHeight;
        
        // تحديد حجم الشاشة بناءً على نقاط التوقف
        if (this.state.screenWidth < this.settings.breakpoints.xs) {
            this.state.screenSize = 'xs';
        } else if (this.state.screenWidth < this.settings.breakpoints.sm) {
            this.state.screenSize = 'sm';
        } else if (this.state.screenWidth < this.settings.breakpoints.md) {
            this.state.screenSize = 'md';
        } else if (this.state.screenWidth < this.settings.breakpoints.lg) {
            this.state.screenSize = 'lg';
        } else if (this.state.screenWidth < this.settings.breakpoints.xl) {
            this.state.screenSize = 'xl';
        } else {
            this.state.screenSize = 'xxl';
        }
        
        console.log(`حجم الشاشة: ${this.state.screenSize} (${this.state.screenWidth}x${this.state.screenHeight})`);
        
        // إضافة فئة CSS لحجم الشاشة
        document.documentElement.classList.remove('screen-xs', 'screen-sm', 'screen-md', 'screen-lg', 'screen-xl', 'screen-xxl');
        document.documentElement.classList.add(`screen-${this.state.screenSize}`);
    },
    
    /**
     * تحديد اتجاه الشاشة
     */
    detectOrientation: function() {
        // تحديد اتجاه الشاشة بناءً على أبعاد الشاشة
        this.state.orientation = this.state.screenWidth > this.state.screenHeight ? 'landscape' : 'portrait';
        
        console.log(`اتجاه الشاشة: ${this.state.orientation}`);
        
        // إضافة فئة CSS لاتجاه الشاشة
        document.documentElement.classList.remove('orientation-portrait', 'orientation-landscape');
        document.documentElement.classList.add(`orientation-${this.state.orientation}`);
    },
    
    /**
     * تفعيل وضع الأجهزة المحمولة
     */
    enableMobileMode: function() {
        // تفعيل وضع الأجهزة المحمولة
        this.state.mobileMode = true;
        
        // إضافة فئة CSS لوضع الأجهزة المحمولة
        document.documentElement.classList.add('mobile-mode');
        
        // تفعيل تحسينات الأداء للأجهزة المحمولة
        if (this.settings.enableMobilePerformanceOptimizations) {
            this.enableMobilePerformanceOptimizations();
        }
        
        // تفعيل تحسينات واجهة المستخدم للأجهزة المحمولة
        if (this.settings.enableMobileUIOptimizations) {
            this.enableMobileUIOptimizations();
        }
        
        console.log('تم تفعيل وضع الأجهزة المحمولة');
    },
    
    /**
     * تعطيل وضع الأجهزة المحمولة
     */
    disableMobileMode: function() {
        // تعطيل وضع الأجهزة المحمولة
        this.state.mobileMode = false;
        
        // إزالة فئة CSS لوضع الأجهزة المحمولة
        document.documentElement.classList.remove('mobile-mode');
        
        // تعطيل تحسينات الأداء للأجهزة المحمولة
        this.disableMobilePerformanceOptimizations();
        
        // تعطيل تحسينات واجهة المستخدم للأجهزة المحمولة
        this.disableMobileUIOptimizations();
        
        console.log('تم تعطيل وضع الأجهزة المحمولة');
    },
    
    /**
     * تفعيل تحسينات الأداء للأجهزة المحمولة
     */
    enableMobilePerformanceOptimizations: function() {
        // تفعيل التحميل الكسول للصور
        if (this.settings.enableLazyLoading) {
            this.enableLazyLoading();
        }
        
        // تفعيل تحسينات الخطوط للأجهزة المحمولة
        if (this.settings.enableFontOptimizations) {
            this.enableFontOptimizations();
        }
        
        // تقليل عدد الرسوم المتحركة
        this.reduceAnimations();
        
        // تقليل عدد الطلبات
        this.reduceRequests();
        
        console.log('تم تفعيل تحسينات الأداء للأجهزة المحمولة');
    },
    
    /**
     * تعطيل تحسينات الأداء للأجهزة المحمولة
     */
    disableMobilePerformanceOptimizations: function() {
        // تعطيل التحميل الكسول للصور
        this.disableLazyLoading();
        
        // تعطيل تحسينات الخطوط للأجهزة المحمولة
        this.disableFontOptimizations();
        
        // استعادة الرسوم المتحركة
        this.restoreAnimations();
        
        // استعادة الطلبات
        this.restoreRequests();
        
        console.log('تم تعطيل تحسينات الأداء للأجهزة المحمولة');
    },
    
    /**
     * تفعيل تحسينات واجهة المستخدم للأجهزة المحمولة
     */
    enableMobileUIOptimizations: function() {
        // تكبير حجم الأزرار والروابط
        this.enlargeTouchTargets();
        
        // تبسيط القوائم
        this.simplifyMenus();
        
        // تعديل تخطيط الصفحة
        this.adjustPageLayout();
        
        // تحسين النماذج
        this.optimizeForms();
        
        console.log('تم تفعيل تحسينات واجهة المستخدم للأجهزة المحمولة');
    },
    
    /**
     * تعطيل تحسينات واجهة المستخدم للأجهزة المحمولة
     */
    disableMobileUIOptimizations: function() {
        // استعادة حجم الأزرار والروابط
        this.restoreTouchTargets();
        
        // استعادة القوائم
        this.restoreMenus();
        
        // استعادة تخطيط الصفحة
        this.restorePageLayout();
        
        // استعادة النماذج
        this.restoreForms();
        
        console.log('تم تعطيل تحسينات واجهة المستخدم للأجهزة المحمولة');
    },
    
    /**
     * تفعيل التحميل الكسول للصور
     */
    enableLazyLoading: function() {
        // تحديد الصور التي يمكن تحميلها بشكل كسول
        const images = document.querySelectorAll('img:not([loading])');
        
        // تعيين سمة التحميل الكسول للصور
        images.forEach(image => {
            // تخزين المسار الأصلي للصورة
            const originalSrc = image.src;
            
            // تعيين سمة التحميل الكسول
            image.setAttribute('loading', 'lazy');
            
            // تخزين المسار الأصلي للصورة في سمة مخصصة
            image.setAttribute('data-original-src', originalSrc);
            
            // تخزين الصورة في حالة النظام
            if (!this.state.optimizedElements.lazyLoadedImages) {
                this.state.optimizedElements.lazyLoadedImages = [];
            }
            
            this.state.optimizedElements.lazyLoadedImages.push(image);
        });
        
        console.log(`تم تفعيل التحميل الكسول لـ ${images.length} صورة`);
    },
    
    /**
     * تعطيل التحميل الكسول للصور
     */
    disableLazyLoading: function() {
        // التحقق من وجود صور تم تحميلها بشكل كسول
        if (!this.state.optimizedElements.lazyLoadedImages) {
            return;
        }
        
        // استعادة الصور إلى حالتها الأصلية
        this.state.optimizedElements.lazyLoadedImages.forEach(image => {
            // إزالة سمة التحميل الكسول
            image.removeAttribute('loading');
            
            // استعادة المسار الأصلي للصورة
            const originalSrc = image.getAttribute('data-original-src');
            
            if (originalSrc) {
                image.src = originalSrc;
                image.removeAttribute('data-original-src');
            }
        });
        
        // إعادة تعيين قائمة الصور
        this.state.optimizedElements.lazyLoadedImages = [];
        
        console.log('تم تعطيل التحميل الكسول للصور');
    },
    
    /**
     * تفعيل تحسينات الخطوط للأجهزة المحمولة
     */
    enableFontOptimizations: function() {
        // تحديد العناصر التي تحتوي على نصوص
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, input, textarea, select, label');
        
        // تخزين حجم الخط الأصلي وتعيين حجم خط أكبر
        textElements.forEach(element => {
            // تخزين حجم الخط الأصلي
            const originalFontSize = window.getComputedStyle(element).fontSize;
            
            // تخزين حجم الخط الأصلي في سمة مخصصة
            element.setAttribute('data-original-font-size', originalFontSize);
            
            // تخزين العنصر في حالة النظام
            if (!this.state.optimizedElements.fontOptimizedElements) {
                this.state.optimizedElements.fontOptimizedElements = [];
            }
            
            this.state.optimizedElements.fontOptimizedElements.push(element);
        });
        
        // إضافة فئة CSS لتحسينات الخطوط
        document.documentElement.classList.add('mobile-font-optimizations');
        
        console.log(`تم تفعيل تحسينات الخطوط لـ ${textElements.length} عنصر`);
    },
    
    /**
     * تعطيل تحسينات الخطوط للأجهزة المحمولة
     */
    disableFontOptimizations: function() {
        // التحقق من وجود عناصر تم تحسين خطوطها
        if (!this.state.optimizedElements.fontOptimizedElements) {
            return;
        }
        
        // استعادة العناصر إلى حالتها الأصلية
        this.state.optimizedElements.fontOptimizedElements.forEach(element => {
            // استعادة حجم الخط الأصلي
            const originalFontSize = element.getAttribute('data-original-font-size');
            
            if (originalFontSize) {
                element.style.fontSize = originalFontSize;
                element.removeAttribute('data-original-font-size');
            }
        });
        
        // إزالة فئة CSS لتحسينات الخطوط
        document.documentElement.classList.remove('mobile-font-optimizations');
        
        // إعادة تعيين قائمة العناصر
        this.state.optimizedElements.fontOptimizedElements = [];
        
        console.log('تم تعطيل تحسينات الخطوط للأجهزة المحمولة');
    },
    
    /**
     * تقليل عدد الرسوم المتحركة
     */
    reduceAnimations: function() {
        // تحديد العناصر التي تحتوي على رسوم متحركة
        const animatedElements = document.querySelectorAll('.animated, [data-animation], [data-aos], .fade, .slide, .zoom, .bounce');
        
        // تخزين حالة الرسوم المتحركة الأصلية وتعطيلها
        animatedElements.forEach(element => {
            // تخزين الفئات الأصلية
            const originalClasses = element.className;
            
            // تخزين الفئات الأصلية في سمة مخصصة
            element.setAttribute('data-original-classes', originalClasses);
            
            // إزالة فئات الرسوم المتحركة
            element.classList.remove('animated', 'fade', 'slide', 'zoom', 'bounce');
            
            // إزالة سمات الرسوم المتحركة
            if (element.hasAttribute('data-animation')) {
                const originalAnimation = element.getAttribute('data-animation');
                element.setAttribute('data-original-animation', originalAnimation);
                element.removeAttribute('data-animation');
            }
            
            if (element.hasAttribute('data-aos')) {
                const originalAos = element.getAttribute('data-aos');
                element.setAttribute('data-original-aos', originalAos);
                element.removeAttribute('data-aos');
            }
            
            // تخزين العنصر في حالة النظام
            if (!this.state.optimizedElements.reducedAnimationElements) {
                this.state.optimizedElements.reducedAnimationElements = [];
            }
            
            this.state.optimizedElements.reducedAnimationElements.push(element);
        });
        
        // إضافة فئة CSS لتقليل الرسوم المتحركة
        document.documentElement.classList.add('reduced-animations');
        
        console.log(`تم تقليل الرسوم المتحركة لـ ${animatedElements.length} عنصر`);
    },
    
    /**
     * استعادة الرسوم المتحركة
     */
    restoreAnimations: function() {
        // التحقق من وجود عناصر تم تقليل رسومها المتحركة
        if (!this.state.optimizedElements.reducedAnimationElements) {
            return;
        }
        
        // استعادة العناصر إلى حالتها الأصلية
        this.state.optimizedElements.reducedAnimationElements.forEach(element => {
            // استعادة الفئات الأصلية
            const originalClasses = element.getAttribute('data-original-classes');
            
            if (originalClasses) {
                element.className = originalClasses;
                element.removeAttribute('data-original-classes');
            }
            
            // استعادة سمات الرسوم المتحركة
            const originalAnimation = element.getAttribute('data-original-animation');
            
            if (originalAnimation) {
                element.setAttribute('data-animation', originalAnimation);
                element.removeAttribute('data-original-animation');
            }
            
            const originalAos = element.getAttribute('data-original-aos');
            
            if (originalAos) {
                element.setAttribute('data-aos', originalAos);
                element.removeAttribute('data-original-aos');
            }
        });
        
        // إزالة فئة CSS لتقليل الرسوم المتحركة
        document.documentElement.classList.remove('reduced-animations');
        
        // إعادة تعيين قائمة العناصر
        this.state.optimizedElements.reducedAnimationElements = [];
        
        console.log('تم استعادة الرسوم المتحركة');
    },
    
    /**
     * تقليل عدد الطلبات
     */
    reduceRequests: function() {
        // تعطيل التحميل التلقائي للفيديوهات
        const videos = document.querySelectorAll('video[autoplay]');
        
        videos.forEach(video => {
            // تخزين حالة التشغيل التلقائي
            const autoplay = video.autoplay;
            
            // تعطيل التشغيل التلقائي
            video.autoplay = false;
            
            // تخزين حالة التشغيل التلقائي في سمة مخصصة
            video.setAttribute('data-original-autoplay', autoplay);
            
            // إيقاف الفيديو
            video.pause();
            
            // تخزين العنصر في حالة النظام
            if (!this.state.optimizedElements.reducedRequestElements) {
                this.state.optimizedElements.reducedRequestElements = [];
            }
            
            this.state.optimizedElements.reducedRequestElements.push(video);
        });
        
        // تعطيل التحميل التلقائي للصوتيات
        const audios = document.querySelectorAll('audio[autoplay]');
        
        audios.forEach(audio => {
            // تخزين حالة التشغيل التلقائي
            const autoplay = audio.autoplay;
            
            // تعطيل التشغيل التلقائي
            audio.autoplay = false;
            
            // تخزين حالة التشغيل التلقائي في سمة مخصصة
            audio.setAttribute('data-original-autoplay', autoplay);
            
            // إيقاف الصوت
            audio.pause();
            
            // تخزين العنصر في حالة النظام
            if (!this.state.optimizedElements.reducedRequestElements) {
                this.state.optimizedElements.reducedRequestElements = [];
            }
            
            this.state.optimizedElements.reducedRequestElements.push(audio);
        });
        
        // تعطيل التحميل التلقائي للإطارات
        const iframes = document.querySelectorAll('iframe:not([loading])');
        
        iframes.forEach(iframe => {
            // تعيين سمة التحميل الكسول
            iframe.setAttribute('loading', 'lazy');
            
            // تخزين العنصر في حالة النظام
            if (!this.state.optimizedElements.reducedRequestElements) {
                this.state.optimizedElements.reducedRequestElements = [];
            }
            
            this.state.optimizedElements.reducedRequestElements.push(iframe);
        });
        
        console.log(`تم تقليل الطلبات لـ ${videos.length + audios.length + iframes.length} عنصر`);
    },
    
    /**
     * استعادة الطلبات
     */
    restoreRequests: function() {
        // التحقق من وجود عناصر تم تقليل طلباتها
        if (!this.state.optimizedElements.reducedRequestElements) {
            return;
        }
        
        // استعادة العناصر إلى حالتها الأصلية
        this.state.optimizedElements.reducedRequestElements.forEach(element => {
            if (element.tagName === 'VIDEO' || element.tagName === 'AUDIO') {
                // استعادة حالة التشغيل التلقائي
                const originalAutoplay = element.getAttribute('data-original-autoplay');
                
                if (originalAutoplay === 'true') {
                    element.autoplay = true;
                    element.play();
                }
                
                element.removeAttribute('data-original-autoplay');
            } else if (element.tagName === 'IFRAME') {
                // إزالة سمة التحميل الكسول
                element.removeAttribute('loading');
            }
        });
        
        // إعادة تعيين قائمة العناصر
        this.state.optimizedElements.reducedRequestElements = [];
        
        console.log('تم استعادة الطلبات');
    },
    
    /**
     * تكبير حجم الأزرار والروابط
     */
    enlargeTouchTargets: function() {
        // تحديد الأزرار والروابط
        const touchTargets = document.querySelectorAll('button, a, input[type="button"], input[type="submit"], input[type="reset"], .btn, .nav-link, .dropdown-item');
        
        // تخزين الحجم الأصلي وتكبير الحجم
        touchTargets.forEach(target => {
            // تخزين النمط الأصلي
            const originalStyle = {
                padding: window.getComputedStyle(target).padding,
                margin: window.getComputedStyle(target).margin,
                fontSize: window.getComputedStyle(target).fontSize,
                minHeight: window.getComputedStyle(target).minHeight,
                minWidth: window.getComputedStyle(target).minWidth
            };
            
            // تخزين النمط الأصلي في سمة مخصصة
            target.setAttribute('data-original-style', JSON.stringify(originalStyle));
            
            // تخزين العنصر في حالة النظام
            if (!this.state.optimizedElements.enlargedTouchTargets) {
                this.state.optimizedElements.enlargedTouchTargets = [];
            }
            
            this.state.optimizedElements.enlargedTouchTargets.push(target);
        });
        
        // إضافة فئة CSS لتكبير الأزرار والروابط
        document.documentElement.classList.add('enlarged-touch-targets');
        
        console.log(`تم تكبير حجم ${touchTargets.length} زر ورابط`);
    },
    
    /**
     * استعادة حجم الأزرار والروابط
     */
    restoreTouchTargets: function() {
        // التحقق من وجود أزرار وروابط تم تكبير حجمها
        if (!this.state.optimizedElements.enlargedTouchTargets) {
            return;
        }
        
        // استعادة الأزرار والروابط إلى حجمها الأصلي
        this.state.optimizedElements.enlargedTouchTargets.forEach(target => {
            // استعادة النمط الأصلي
            const originalStyle = JSON.parse(target.getAttribute('data-original-style'));
            
            if (originalStyle) {
                target.style.padding = originalStyle.padding;
                target.style.margin = originalStyle.margin;
                target.style.fontSize = originalStyle.fontSize;
                target.style.minHeight = originalStyle.minHeight;
                target.style.minWidth = originalStyle.minWidth;
                
                target.removeAttribute('data-original-style');
            }
        });
        
        // إزالة فئة CSS لتكبير الأزرار والروابط
        document.documentElement.classList.remove('enlarged-touch-targets');
        
        // إعادة تعيين قائمة الأزرار والروابط
        this.state.optimizedElements.enlargedTouchTargets = [];
        
        console.log('تم استعادة حجم الأزرار والروابط');
    },
    
    /**
     * تبسيط القوائم
     */
    simplifyMenus: function() {
        // تحديد القوائم
        const menus = document.querySelectorAll('.navbar, .nav, .dropdown-menu, .sidebar, .sidebar-menu');
        
        // تخزين حالة القوائم الأصلية وتبسيطها
        menus.forEach(menu => {
            // تخزين النمط الأصلي
            const originalHTML = menu.innerHTML;
            
            // تخزين النمط الأصلي في سمة مخصصة
            menu.setAttribute('data-original-html', originalHTML);
            
            // تخزين العنصر في حالة النظام
            if (!this.state.optimizedElements.simplifiedMenus) {
                this.state.optimizedElements.simplifiedMenus = [];
            }
            
            this.state.optimizedElements.simplifiedMenus.push(menu);
        });
        
        // إضافة فئة CSS لتبسيط القوائم
        document.documentElement.classList.add('simplified-menus');
        
        // إضافة زر القائمة المحمولة
        this.addMobileMenuButton();
        
        console.log(`تم تبسيط ${menus.length} قائمة`);
    },
    
    /**
     * استعادة القوائم
     */
    restoreMenus: function() {
        // التحقق من وجود قوائم تم تبسيطها
        if (!this.state.optimizedElements.simplifiedMenus) {
            return;
        }
        
        // استعادة القوائم إلى حالتها الأصلية
        this.state.optimizedElements.simplifiedMenus.forEach(menu => {
            // استعادة النمط الأصلي
            const originalHTML = menu.getAttribute('data-original-html');
            
            if (originalHTML) {
                menu.innerHTML = originalHTML;
                menu.removeAttribute('data-original-html');
            }
        });
        
        // إزالة فئة CSS لتبسيط القوائم
        document.documentElement.classList.remove('simplified-menus');
        
        // إزالة زر القائمة المحمولة
        this.removeMobileMenuButton();
        
        // إعادة تعيين قائمة القوائم
        this.state.optimizedElements.simplifiedMenus = [];
        
        console.log('تم استعادة القوائم');
    },
    
    /**
     * إضافة زر القائمة المحمولة
     */
    addMobileMenuButton: function() {
        // التحقق من وجود زر القائمة المحمولة
        if (document.getElementById('mobile-menu-button')) {
            return;
        }
        
        // إنشاء زر القائمة المحمولة
        const mobileMenuButton = document.createElement('button');
        mobileMenuButton.id = 'mobile-menu-button';
        mobileMenuButton.className = 'mobile-menu-button';
        mobileMenuButton.innerHTML = '<span></span><span></span><span></span>';
        
        // تعيين نمط زر القائمة المحمولة
        mobileMenuButton.style.position = 'fixed';
        mobileMenuButton.style.top = '10px';
        mobileMenuButton.style.right = '10px';
        mobileMenuButton.style.zIndex = '9999';
        mobileMenuButton.style.width = '40px';
        mobileMenuButton.style.height = '40px';
        mobileMenuButton.style.background = 'transparent';
        mobileMenuButton.style.border = 'none';
        mobileMenuButton.style.cursor = 'pointer';
        mobileMenuButton.style.display = 'flex';
        mobileMenuButton.style.flexDirection = 'column';
        mobileMenuButton.style.justifyContent = 'space-around';
        mobileMenuButton.style.padding = '5px';
        
        // تعيين نمط خطوط زر القائمة المحمولة
        const spans = mobileMenuButton.querySelectorAll('span');
        
        spans.forEach(span => {
            span.style.display = 'block';
            span.style.width = '100%';
            span.style.height = '3px';
            span.style.background = '#333';
            span.style.borderRadius = '3px';
            span.style.transition = 'all 0.3s ease';
        });
        
        // إضافة زر القائمة المحمولة إلى الصفحة
        document.body.appendChild(mobileMenuButton);
        
        // إضافة مستمع حدث النقر
        mobileMenuButton.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        console.log('تم إضافة زر القائمة المحمولة');
    },
    
    /**
     * إزالة زر القائمة المحمولة
     */
    removeMobileMenuButton: function() {
        // التحقق من وجود زر القائمة المحمولة
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        
        if (mobileMenuButton) {
            // إزالة زر القائمة المحمولة
            mobileMenuButton.remove();
            
            console.log('تم إزالة زر القائمة المحمولة');
        }
    },
    
    /**
     * تبديل حالة القائمة المحمولة
     */
    toggleMobileMenu: function() {
        // التحقق من وجود القائمة المحمولة
        let mobileMenu = document.getElementById('mobile-menu');
        
        if (!mobileMenu) {
            // إنشاء القائمة المحمولة
            mobileMenu = document.createElement('div');
            mobileMenu.id = 'mobile-menu';
            mobileMenu.className = 'mobile-menu';
            
            // تعيين نمط القائمة المحمولة
            mobileMenu.style.position = 'fixed';
            mobileMenu.style.top = '0';
            mobileMenu.style.left = '0';
            mobileMenu.style.width = '100%';
            mobileMenu.style.height = '100%';
            mobileMenu.style.background = 'white';
            mobileMenu.style.zIndex = '9998';
            mobileMenu.style.padding = '60px 20px 20px';
            mobileMenu.style.boxSizing = 'border-box';
            mobileMenu.style.overflowY = 'auto';
            mobileMenu.style.display = 'none';
            
            // إضافة عناصر القائمة
            const navLinks = document.querySelectorAll('.navbar a, .nav a, .sidebar a');
            const menuItems = Array.from(navLinks).map(link => {
                return `<a href="${link.href}" class="mobile-menu-item">${link.textContent}</a>`;
            });
            
            mobileMenu.innerHTML = menuItems.join('');
            
            // تعيين نمط عناصر القائمة
            const style = document.createElement('style');
            style.textContent = `
                .mobile-menu-item {
                    display: block;
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                    color: #333;
                    text-decoration: none;
                    font-size: 18px;
                }
                
                .mobile-menu-button.active span:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }
                
                .mobile-menu-button.active span:nth-child(2) {
                    opacity: 0;
                }
                
                .mobile-menu-button.active span:nth-child(3) {
                    transform: rotate(-45deg) translate(7px, -7px);
                }
            `;
            
            document.head.appendChild(style);
            
            // إضافة القائمة المحمولة إلى الصفحة
            document.body.appendChild(mobileMenu);
        }
        
        // تبديل حالة القائمة المحمولة
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        
        if (mobileMenu.style.display === 'none') {
            mobileMenu.style.display = 'block';
            mobileMenuButton.classList.add('active');
        } else {
            mobileMenu.style.display = 'none';
            mobileMenuButton.classList.remove('active');
        }
        
        console.log(`تم ${mobileMenu.style.display === 'none' ? 'إخفاء' : 'إظهار'} القائمة المحمولة`);
    },
    
    /**
     * تعديل تخطيط الصفحة
     */
    adjustPageLayout: function() {
        // تحديد العناصر الرئيسية
        const containers = document.querySelectorAll('.container, .container-fluid, .row, .col, main, section, article, aside, header, footer');
        
        // تخزين النمط الأصلي وتعديل التخطيط
        containers.forEach(container => {
            // تخزين النمط الأصلي
            const originalStyle = {
                width: window.getComputedStyle(container).width,
                padding: window.getComputedStyle(container).padding,
                margin: window.getComputedStyle(container).margin,
                display: window.getComputedStyle(container).display,
                flexDirection: window.getComputedStyle(container).flexDirection
            };
            
            // تخزين النمط الأصلي في سمة مخصصة
            container.setAttribute('data-original-layout-style', JSON.stringify(originalStyle));
            
            // تخزين العنصر في حالة النظام
            if (!this.state.optimizedElements.adjustedLayoutElements) {
                this.state.optimizedElements.adjustedLayoutElements = [];
            }
            
            this.state.optimizedElements.adjustedLayoutElements.push(container);
        });
        
        // إضافة فئة CSS لتعديل التخطيط
        document.documentElement.classList.add('adjusted-layout');
        
        console.log(`تم تعديل تخطيط ${containers.length} عنصر`);
    },
    
    /**
     * استعادة تخطيط الصفحة
     */
    restorePageLayout: function() {
        // التحقق من وجود عناصر تم تعديل تخطيطها
        if (!this.state.optimizedElements.adjustedLayoutElements) {
            return;
        }
        
        // استعادة العناصر إلى حالتها الأصلية
        this.state.optimizedElements.adjustedLayoutElements.forEach(container => {
            // استعادة النمط الأصلي
            const originalStyle = JSON.parse(container.getAttribute('data-original-layout-style'));
            
            if (originalStyle) {
                container.style.width = originalStyle.width;
                container.style.padding = originalStyle.padding;
                container.style.margin = originalStyle.margin;
                container.style.display = originalStyle.display;
                container.style.flexDirection = originalStyle.flexDirection;
                
                container.removeAttribute('data-original-layout-style');
            }
        });
        
        // إزالة فئة CSS لتعديل التخطيط
        document.documentElement.classList.remove('adjusted-layout');
        
        // إعادة تعيين قائمة العناصر
        this.state.optimizedElements.adjustedLayoutElements = [];
        
        console.log('تم استعادة تخطيط الصفحة');
    },
    
    /**
     * تحسين النماذج
     */
    optimizeForms: function() {
        // تحديد النماذج
        const forms = document.querySelectorAll('form');
        
        // تخزين النمط الأصلي وتحسين النماذج
        forms.forEach(form => {
            // تخزين النمط الأصلي
            const originalHTML = form.innerHTML;
            
            // تخزين النمط الأصلي في سمة مخصصة
            form.setAttribute('data-original-form-html', originalHTML);
            
            // تحسين حقول النموذج
            const inputs = form.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                // زيادة حجم الحقول
                input.style.fontSize = '16px';
                input.style.padding = '10px';
                input.style.marginBottom = '15px';
                
                // تعيين نوع لوحة المفاتيح المناسب
                if (input.type === 'email') {
                    input.setAttribute('inputmode', 'email');
                } else if (input.type === 'tel') {
                    input.setAttribute('inputmode', 'tel');
                } else if (input.type === 'number') {
                    input.setAttribute('inputmode', 'numeric');
                } else if (input.type === 'url') {
                    input.setAttribute('inputmode', 'url');
                }
                
                // إضافة سمة autocomplete
                if (input.type === 'email') {
                    input.setAttribute('autocomplete', 'email');
                } else if (input.type === 'tel') {
                    input.setAttribute('autocomplete', 'tel');
                } else if (input.name.includes('name')) {
                    input.setAttribute('autocomplete', 'name');
                } else if (input.name.includes('address')) {
                    input.setAttribute('autocomplete', 'street-address');
                } else if (input.name.includes('city')) {
                    input.setAttribute('autocomplete', 'address-level2');
                } else if (input.name.includes('zip') || input.name.includes('postal')) {
                    input.setAttribute('autocomplete', 'postal-code');
                }
            });
            
            // تخزين النموذج في حالة النظام
            if (!this.state.optimizedElements.optimizedForms) {
                this.state.optimizedElements.optimizedForms = [];
            }
            
            this.state.optimizedElements.optimizedForms.push(form);
        });
        
        // إضافة فئة CSS لتحسين النماذج
        document.documentElement.classList.add('optimized-forms');
        
        console.log(`تم تحسين ${forms.length} نموذج`);
    },
    
    /**
     * استعادة النماذج
     */
    restoreForms: function() {
        // التحقق من وجود نماذج تم تحسينها
        if (!this.state.optimizedElements.optimizedForms) {
            return;
        }
        
        // استعادة النماذج إلى حالتها الأصلية
        this.state.optimizedElements.optimizedForms.forEach(form => {
            // استعادة النمط الأصلي
            const originalHTML = form.getAttribute('data-original-form-html');
            
            if (originalHTML) {
                form.innerHTML = originalHTML;
                form.removeAttribute('data-original-form-html');
            }
        });
        
        // إزالة فئة CSS لتحسين النماذج
        document.documentElement.classList.remove('optimized-forms');
        
        // إعادة تعيين قائمة النماذج
        this.state.optimizedElements.optimizedForms = [];
        
        console.log('تم استعادة النماذج');
    },
    
    /**
     * تفعيل دعم إيماءات اللمس
     */
    enableTouchGestures: function() {
        // تفعيل دعم إيماءات اللمس
        this.state.touchGesturesEnabled = true;
        
        // إضافة مستمعي أحداث اللمس
        this.setupTouchEventListeners();
        
        // إضافة فئة CSS لدعم إيماءات اللمس
        document.documentElement.classList.add('touch-gestures-enabled');
        
        console.log('تم تفعيل دعم إيماءات اللمس');
    },
    
    /**
     * تعطيل دعم إيماءات اللمس
     */
    disableTouchGestures: function() {
        // تعطيل دعم إيماءات اللمس
        this.state.touchGesturesEnabled = false;
        
        // إزالة مستمعي أحداث اللمس
        this.removeTouchEventListeners();
        
        // إزالة فئة CSS لدعم إيماءات اللمس
        document.documentElement.classList.remove('touch-gestures-enabled');
        
        console.log('تم تعطيل دعم إيماءات اللمس');
    },
    
    /**
     * إضافة مستمعي أحداث اللمس
     */
    setupTouchEventListeners: function() {
        // متغيرات لتتبع إيماءات اللمس
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        
        // مستمع لحدث بدء اللمس
        document.addEventListener('touchstart', (event) => {
            touchStartX = event.changedTouches[0].screenX;
            touchStartY = event.changedTouches[0].screenY;
        }, { passive: true });
        
        // مستمع لحدث انتهاء اللمس
        document.addEventListener('touchend', (event) => {
            touchEndX = event.changedTouches[0].screenX;
            touchEndY = event.changedTouches[0].screenY;
            
            // حساب المسافة والاتجاه
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // تحديد نوع الإيماءة
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // إيماءة أفقية
                if (deltaX > 50) {
                    // سحب لليمين
                    this.handleSwipeRight();
                } else if (deltaX < -50) {
                    // سحب لليسار
                    this.handleSwipeLeft();
                }
            } else {
                // إيماءة عمودية
                if (deltaY > 50) {
                    // سحب للأسفل
                    this.handleSwipeDown();
                } else if (deltaY < -50) {
                    // سحب للأعلى
                    this.handleSwipeUp();
                }
            }
        }, { passive: true });
        
        // مستمع لحدث التكبير/التصغير
        let initialPinchDistance = 0;
        
        document.addEventListener('touchstart', (event) => {
            if (event.touches.length === 2) {
                initialPinchDistance = Math.hypot(
                    event.touches[0].pageX - event.touches[1].pageX,
                    event.touches[0].pageY - event.touches[1].pageY
                );
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (event) => {
            if (event.touches.length === 2) {
                const currentPinchDistance = Math.hypot(
                    event.touches[0].pageX - event.touches[1].pageX,
                    event.touches[0].pageY - event.touches[1].pageY
                );
                
                if (initialPinchDistance > 0) {
                    if (currentPinchDistance > initialPinchDistance + 10) {
                        // تكبير
                        this.handlePinchOut();
                    } else if (currentPinchDistance < initialPinchDistance - 10) {
                        // تصغير
                        this.handlePinchIn();
                    }
                    
                    initialPinchDistance = currentPinchDistance;
                }
            }
        }, { passive: true });
        
        console.log('تم إضافة مستمعي أحداث اللمس');
    },
    
    /**
     * إزالة مستمعي أحداث اللمس
     */
    removeTouchEventListeners: function() {
        // إزالة مستمعي أحداث اللمس
        document.removeEventListener('touchstart', this.handleTouchStart);
        document.removeEventListener('touchend', this.handleTouchEnd);
        document.removeEventListener('touchmove', this.handleTouchMove);
        
        console.log('تم إزالة مستمعي أحداث اللمس');
    },
    
    /**
     * معالجة إيماءة السحب لليمين
     */
    handleSwipeRight: function() {
        console.log('إيماءة السحب لليمين');
        
        // التحقق من وجود القائمة الجانبية
        const sidebar = document.querySelector('.sidebar, .offcanvas, .sidenav');
        
        if (sidebar) {
            // فتح القائمة الجانبية
            sidebar.classList.add('show', 'open', 'active');
        }
        
        // إطلاق حدث مخصص
        const event = new CustomEvent('swiperight', {
            bubbles: true,
            cancelable: true
        });
        
        document.dispatchEvent(event);
    },
    
    /**
     * معالجة إيماءة السحب لليسار
     */
    handleSwipeLeft: function() {
        console.log('إيماءة السحب لليسار');
        
        // التحقق من وجود القائمة الجانبية
        const sidebar = document.querySelector('.sidebar, .offcanvas, .sidenav');
        
        if (sidebar) {
            // إغلاق القائمة الجانبية
            sidebar.classList.remove('show', 'open', 'active');
        }
        
        // إطلاق حدث مخصص
        const event = new CustomEvent('swipeleft', {
            bubbles: true,
            cancelable: true
        });
        
        document.dispatchEvent(event);
    },
    
    /**
     * معالجة إيماءة السحب للأعلى
     */
    handleSwipeUp: function() {
        console.log('إيماءة السحب للأعلى');
        
        // التمرير لأعلى الصفحة
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // إطلاق حدث مخصص
        const event = new CustomEvent('swipeup', {
            bubbles: true,
            cancelable: true
        });
        
        document.dispatchEvent(event);
    },
    
    /**
     * معالجة إيماءة السحب للأسفل
     */
    handleSwipeDown: function() {
        console.log('إيماءة السحب للأسفل');
        
        // التمرير لأسفل الصفحة
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        
        // إطلاق حدث مخصص
        const event = new CustomEvent('swipedown', {
            bubbles: true,
            cancelable: true
        });
        
        document.dispatchEvent(event);
    },
    
    /**
     * معالجة إيماءة التكبير
     */
    handlePinchOut: function() {
        console.log('إيماءة التكبير');
        
        // إطلاق حدث مخصص
        const event = new CustomEvent('pinchout', {
            bubbles: true,
            cancelable: true
        });
        
        document.dispatchEvent(event);
    },
    
    /**
     * معالجة إيماءة التصغير
     */
    handlePinchIn: function() {
        console.log('إيماءة التصغير');
        
        // إطلاق حدث مخصص
        const event = new CustomEvent('pinchin', {
            bubbles: true,
            cancelable: true
        });
        
        document.dispatchEvent(event);
    },
    
    /**
     * تحسين العناصر للأجهزة المحمولة
     */
    optimizeElementsForMobile: function() {
        // تحسين الجداول
        this.optimizeTables();
        
        // تحسين الصور
        this.optimizeImages();
        
        // تحسين الفيديوهات
        this.optimizeVideos();
        
        // تحسين الخرائط
        this.optimizeMaps();
        
        console.log('تم تحسين العناصر للأجهزة المحمولة');
    },
    
    /**
     * تحسين الجداول
     */
    optimizeTables: function() {
        // تحديد الجداول
        const tables = document.querySelectorAll('table:not(.table-responsive)');
        
        // تخزين النمط الأصلي وتحسين الجداول
        tables.forEach(table => {
            // تخزين النمط الأصلي
            const originalHTML = table.outerHTML;
            
            // إنشاء حاوية للجدول
            const tableWrapper = document.createElement('div');
            tableWrapper.className = 'table-responsive';
            tableWrapper.style.overflowX = 'auto';
            tableWrapper.style.width = '100%';
            
            // نقل الجدول إلى الحاوية
            table.parentNode.insertBefore(tableWrapper, table);
            tableWrapper.appendChild(table);
            
            // تخزين النمط الأصلي في سمة مخصصة
            tableWrapper.setAttribute('data-original-table-html', originalHTML);
            
            // تخزين العنصر في حالة النظام
            if (!this.state.optimizedElements.optimizedTables) {
                this.state.optimizedElements.optimizedTables = [];
            }
            
            this.state.optimizedElements.optimizedTables.push(tableWrapper);
        });
        
        console.log(`تم تحسين ${tables.length} جدول`);
    },
    
    /**
     * تحسين الصور
     */
    optimizeImages: function() {
        // تحديد الصور
        const images = document.querySelectorAll('img:not([class*="img-fluid"]):not([class*="img-responsive"])');
        
        // تخزين النمط الأصلي وتحسين الصور
        images.forEach(image => {
            // تخزين النمط الأصلي
            const originalStyle = {
                width: image.style.width,
                height: image.style.height,
                maxWidth: image.style.maxWidth
            };
            
            // تخزين النمط الأصلي في سمة مخصصة
            image.setAttribute('data-original-image-style', JSON.stringify(originalStyle));
            
            // تحسين الصورة
            image.style.maxWidth = '100%';
            image.style.height = 'auto';
            
            // إضافة فئة CSS للصور المتجاوبة
            image.classList.add('img-fluid');
            
            // تخزين العنصر في حالة النظام
            if (!this.state.optimizedElements.optimizedImages) {
                this.state.optimizedElements.optimizedImages = [];
            }
            
            this.state.optimizedElements.optimizedImages.push(image);
        });
        
        console.log(`تم تحسين ${images.length} صورة`);
    },
    
    /**
     * تحسين الفيديوهات
     */
    optimizeVideos: function() {
        // تحديد الفيديوهات
        const videos = document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
        
        // تخزين النمط الأصلي وتحسين الفيديوهات
        videos.forEach(video => {
            // تخزين النمط الأصلي
            const originalHTML = video.outerHTML;
            
            // إنشاء حاوية للفيديو
            const videoWrapper = document.createElement('div');
            videoWrapper.className = 'video-responsive';
            videoWrapper.style.position = 'relative';
            videoWrapper.style.paddingBottom = '56.25%'; // نسبة العرض إلى الارتفاع 16:9
            videoWrapper.style.height = '0';
            videoWrapper.style.overflow = 'hidden';
            videoWrapper.style.maxWidth = '100%';
            
            // نقل الفيديو إلى الحاوية
            video.parentNode.insertBefore(videoWrapper, video);
            videoWrapper.appendChild(video);
            
            // تحسين الفيديو
            video.style.position = 'absolute';
            video.style.top = '0';
            video.style.left = '0';
            video.style.width = '100%';
            video.style.height = '100%';
            
            // تخزين النمط الأصلي في سمة مخصصة
            videoWrapper.setAttribute('data-original-video-html', originalHTML);
            
            // تخزين العنصر في حالة النظام
            if (!this.state.optimizedElements.optimizedVideos) {
                this.state.optimizedElements.optimizedVideos = [];
            }
            
            this.state.optimizedElements.optimizedVideos.push(videoWrapper);
        });
        
        console.log(`تم تحسين ${videos.length} فيديو`);
    },
    
    /**
     * تحسين الخرائط
     */
    optimizeMaps: function() {
        // تحديد الخرائط
        const maps = document.querySelectorAll('iframe[src*="maps.google"], iframe[src*="openstreetmap"], .map');
        
        // تخزين النمط الأصلي وتحسين الخرائط
        maps.forEach(map => {
            // تخزين النمط الأصلي
            const originalHTML = map.outerHTML;
            
            // إنشاء حاوية للخريطة
            const mapWrapper = document.createElement('div');
            mapWrapper.className = 'map-responsive';
            mapWrapper.style.position = 'relative';
            mapWrapper.style.paddingBottom = '75%'; // نسبة العرض إلى الارتفاع 4:3
            mapWrapper.style.height = '0';
            mapWrapper.style.overflow = 'hidden';
            mapWrapper.style.maxWidth = '100%';
            
            // نقل الخريطة إلى الحاوية
            map.parentNode.insertBefore(mapWrapper, map);
            mapWrapper.appendChild(map);
            
            // تحسين الخريطة
            map.style.position = 'absolute';
            map.style.top = '0';
            map.style.left = '0';
            map.style.width = '100%';
            map.style.height = '100%';
            
            // تخزين النمط الأصلي في سمة مخصصة
            mapWrapper.setAttribute('data-original-map-html', originalHTML);
            
            // تخزين العنصر في حالة النظام
            if (!this.state.optimizedElements.optimizedMaps) {
                this.state.optimizedElements.optimizedMaps = [];
            }
            
            this.state.optimizedElements.optimizedMaps.push(mapWrapper);
        });
        
        console.log(`تم تحسين ${maps.length} خريطة`);
    },
    
    /**
     * إضافة مستمعي الأحداث
     */
    setupEventListeners: function() {
        // مستمع لحدث تغيير حجم النافذة
        window.addEventListener('resize', () => {
            // تحديث حجم الشاشة
            this.detectScreenSize();
            
            // تحديث اتجاه الشاشة
            this.detectOrientation();
        });
        
        // مستمع لحدث تغيير اتجاه الشاشة
        window.addEventListener('orientationchange', () => {
            // تحديث اتجاه الشاشة
            this.detectOrientation();
        });
        
        console.log('تم إضافة مستمعي الأحداث');
    }
};

// إضافة أنماط CSS لتحسين التوافق مع الأجهزة المحمولة
const style = document.createElement('style');
style.textContent = `
    /* تحسينات عامة للأجهزة المحمولة */
    .mobile-mode {
        font-size: 16px;
    }
    
    /* تكبير الأزرار والروابط */
    .enlarged-touch-targets button,
    .enlarged-touch-targets a,
    .enlarged-touch-targets input[type="button"],
    .enlarged-touch-targets input[type="submit"],
    .enlarged-touch-targets input[type="reset"],
    .enlarged-touch-targets .btn,
    .enlarged-touch-targets .nav-link,
    .enlarged-touch-targets .dropdown-item {
        padding: 12px 16px;
        min-height: 44px;
        min-width: 44px;
        font-size: 16px;
        margin-bottom: 10px;
    }
    
    /* تحسين الخطوط */
    .mobile-font-optimizations h1 {
        font-size: 24px;
    }
    
    .mobile-font-optimizations h2 {
        font-size: 22px;
    }
    
    .mobile-font-optimizations h3 {
        font-size: 20px;
    }
    
    .mobile-font-optimizations h4, .mobile-font-optimizations h5, .mobile-font-optimizations h6 {
        font-size: 18px;
    }
    
    .mobile-font-optimizations p, .mobile-font-optimizations span, .mobile-font-optimizations a, .mobile-font-optimizations button, .mobile-font-optimizations input, .mobile-font-optimizations textarea, .mobile-font-optimizations select, .mobile-font-optimizations label {
        font-size: 16px;
    }
    
    /* تقليل الرسوم المتحركة */
    .reduced-animations * {
        transition-duration: 0s !important;
        animation-duration: 0s !important;
    }
    
    /* تبسيط القوائم */
    .simplified-menus .dropdown-menu {
        position: static !important;
        width: 100%;
        box-shadow: none;
        border: none;
    }
    
    /* تعديل تخطيط الصفحة */
    .adjusted-layout .container,
    .adjusted-layout .container-fluid {
        padding-left: 15px;
        padding-right: 15px;
    }
    
    .adjusted-layout .row {
        margin-left: -15px;
        margin-right: -15px;
    }
    
    .adjusted-layout .col,
    .adjusted-layout [class*="col-"] {
        padding-left: 15px;
        padding-right: 15px;
    }
    
    /* تحسين النماذج */
    .optimized-forms input,
    .optimized-forms select,
    .optimized-forms textarea {
        font-size: 16px;
        padding: 10px;
        margin-bottom: 15px;
        width: 100%;
        box-sizing: border-box;
    }
    
    .optimized-forms label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }
    
    .optimized-forms button,
    .optimized-forms input[type="button"],
    .optimized-forms input[type="submit"],
    .optimized-forms input[type="reset"] {
        width: 100%;
        padding: 12px;
        font-size: 16px;
    }
    
    /* تحسينات حسب حجم الشاشة */
    .screen-xs .d-xs-none {
        display: none !important;
    }
    
    .screen-sm .d-sm-none {
        display: none !important;
    }
    
    .screen-md .d-md-none {
        display: none !important;
    }
    
    /* تحسينات حسب اتجاه الشاشة */
    .orientation-portrait .d-portrait-none {
        display: none !important;
    }
    
    .orientation-landscape .d-landscape-none {
        display: none !important;
    }
`;

document.head.appendChild(style);

// تهيئة نظام التوافق مع الأجهزة المحمولة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    MobileCompatibility.init();
    
    console.log('تم تهيئة نظام التوافق مع الأجهزة المحمولة');
});

// تصدير كائن MobileCompatibility للاستخدام في ملفات أخرى
window.MobileCompatibility = MobileCompatibility;
