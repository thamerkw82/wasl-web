/**
 * تحسينات الأداء
 * يوفر تحسينات للأداء وسرعة التحميل
 */

// كائن لإدارة تحسينات الأداء
const PerformanceOptimizer = {
    // إعدادات افتراضية
    settings: {
        // ما إذا كان يجب تفعيل تحسينات الأداء تلقائياً
        autoEnable: true,
        
        // ما إذا كان يجب تحسين تحميل الصور
        optimizeImages: true,
        
        // ما إذا كان يجب تفعيل التحميل الكسول للصور
        enableLazyLoading: true,
        
        // مسافة التحميل المسبق للصور (بالبكسل)
        lazyLoadThreshold: 200,
        
        // ما إذا كان يجب تفعيل الصور المتجاوبة
        enableResponsiveImages: true,
        
        // ما إذا كان يجب تجميع طلبات HTTP
        batchHttpRequests: true,
        
        // الحد الأقصى لعدد الطلبات في الدفعة الواحدة
        maxBatchSize: 5,
        
        // مهلة تجميع الطلبات (بالمللي ثانية)
        batchTimeout: 50,
        
        // ما إذا كان يجب تفعيل التخزين المؤقت للموارد
        enableResourceCaching: true,
        
        // مدة التخزين المؤقت (بالثواني)
        cacheDuration: 3600,
        
        // ما إذا كان يجب تفعيل التحميل المسبق للروابط
        enableLinkPrefetching: true,
        
        // مسافة التحميل المسبق للروابط (بالبكسل)
        linkPrefetchThreshold: 100,
        
        // ما إذا كان يجب تفعيل تحميل الموارد بشكل غير متزامن
        enableAsyncLoading: true,
        
        // ما إذا كان يجب تفعيل تأجيل تحميل JavaScript غير الضروري
        enableDeferredLoading: true,
        
        // ما إذا كان يجب تفعيل تحسين الخطوط
        optimizeFonts: true,
        
        // ما إذا كان يجب تفعيل تحسين الرسوم المتحركة
        optimizeAnimations: true
    },
    
    // حالة النظام
    state: {
        // ما إذا كان نظام تحسينات الأداء مفعلاً
        enabled: false,
        
        // ما إذا كان تحسين تحميل الصور مفعلاً
        imagesOptimized: false,
        
        // ما إذا كان التحميل الكسول للصور مفعلاً
        lazyLoadingEnabled: false,
        
        // ما إذا كانت الصور المتجاوبة مفعلة
        responsiveImagesEnabled: false,
        
        // ما إذا كان تجميع طلبات HTTP مفعلاً
        httpRequestsBatched: false,
        
        // ما إذا كان التخزين المؤقت للموارد مفعلاً
        resourceCachingEnabled: false,
        
        // ما إذا كان التحميل المسبق للروابط مفعلاً
        linkPrefetchingEnabled: false,
        
        // ما إذا كان تحميل الموارد بشكل غير متزامن مفعلاً
        asyncLoadingEnabled: false,
        
        // ما إذا كان تأجيل تحميل JavaScript غير الضروري مفعلاً
        deferredLoadingEnabled: false,
        
        // ما إذا كان تحسين الخطوط مفعلاً
        fontsOptimized: false,
        
        // ما إذا كان تحسين الرسوم المتحركة مفعلاً
        animationsOptimized: false,
        
        // مراقب التقاطع للتحميل الكسول
        intersectionObserver: null,
        
        // قائمة الطلبات المعلقة
        pendingRequests: {},
        
        // مؤقتات تجميع الطلبات
        batchTimers: {},
        
        // ذاكرة التخزين المؤقت للموارد
        resourceCache: {},
        
        // العناصر التي تم تحسينها
        enhancedElements: {}
    },
    
    /**
     * تهيئة نظام تحسينات الأداء
     * @param {Object} options خيارات التهيئة
     */
    init: function(options = {}) {
        // دمج الخيارات مع الإعدادات الافتراضية
        this.settings = { ...this.settings, ...options };
        
        // تفعيل نظام تحسينات الأداء إذا كان مطلوباً
        if (this.settings.autoEnable) {
            this.enable();
        }
        
        console.log('تم تهيئة نظام تحسينات الأداء');
    },
    
    /**
     * تفعيل نظام تحسينات الأداء
     */
    enable: function() {
        // تفعيل نظام تحسينات الأداء
        this.state.enabled = true;
        
        // تحسين تحميل الصور إذا كان مطلوباً
        if (this.settings.optimizeImages) {
            this.optimizeImages();
        }
        
        // تفعيل تجميع طلبات HTTP إذا كان مطلوباً
        if (this.settings.batchHttpRequests) {
            this.enableHttpRequestBatching();
        }
        
        // تفعيل التخزين المؤقت للموارد إذا كان مطلوباً
        if (this.settings.enableResourceCaching) {
            this.enableResourceCaching();
        }
        
        // تفعيل التحميل المسبق للروابط إذا كان مطلوباً
        if (this.settings.enableLinkPrefetching) {
            this.enableLinkPrefetching();
        }
        
        // تفعيل تحميل الموارد بشكل غير متزامن إذا كان مطلوباً
        if (this.settings.enableAsyncLoading) {
            this.enableAsyncLoading();
        }
        
        // تفعيل تأجيل تحميل JavaScript غير الضروري إذا كان مطلوباً
        if (this.settings.enableDeferredLoading) {
            this.enableDeferredLoading();
        }
        
        // تحسين الخطوط إذا كان مطلوباً
        if (this.settings.optimizeFonts) {
            this.optimizeFonts();
        }
        
        // تحسين الرسوم المتحركة إذا كان مطلوباً
        if (this.settings.optimizeAnimations) {
            this.optimizeAnimations();
        }
        
        console.log('تم تفعيل نظام تحسينات الأداء');
    },
    
    /**
     * تعطيل نظام تحسينات الأداء
     */
    disable: function() {
        // تعطيل نظام تحسينات الأداء
        this.state.enabled = false;
        
        // تعطيل تحسين تحميل الصور
        if (this.state.imagesOptimized) {
            this.disableImageOptimizations();
        }
        
        // تعطيل تجميع طلبات HTTP
        if (this.state.httpRequestsBatched) {
            this.disableHttpRequestBatching();
        }
        
        // تعطيل التخزين المؤقت للموارد
        if (this.state.resourceCachingEnabled) {
            this.disableResourceCaching();
        }
        
        // تعطيل التحميل المسبق للروابط
        if (this.state.linkPrefetchingEnabled) {
            this.disableLinkPrefetching();
        }
        
        // تعطيل تحميل الموارد بشكل غير متزامن
        if (this.state.asyncLoadingEnabled) {
            this.disableAsyncLoading();
        }
        
        // تعطيل تأجيل تحميل JavaScript غير الضروري
        if (this.state.deferredLoadingEnabled) {
            this.disableDeferredLoading();
        }
        
        // تعطيل تحسين الخطوط
        if (this.state.fontsOptimized) {
            this.disableFontOptimizations();
        }
        
        // تعطيل تحسين الرسوم المتحركة
        if (this.state.animationsOptimized) {
            this.disableAnimationOptimizations();
        }
        
        console.log('تم تعطيل نظام تحسينات الأداء');
    },
    
    /**
     * تحسين تحميل الصور
     */
    optimizeImages: function() {
        // التحقق من أن تحسين تحميل الصور غير مفعل بالفعل
        if (this.state.imagesOptimized) {
            return;
        }
        
        // تفعيل التحميل الكسول للصور إذا كان مطلوباً
        if (this.settings.enableLazyLoading) {
            this.enableLazyLoading();
        }
        
        // تفعيل الصور المتجاوبة إذا كان مطلوباً
        if (this.settings.enableResponsiveImages) {
            this.enableResponsiveImages();
        }
        
        // تعيين حالة تحسين تحميل الصور
        this.state.imagesOptimized = true;
        
        console.log('تم تحسين تحميل الصور');
    },
    
    /**
     * تفعيل التحميل الكسول للصور
     */
    enableLazyLoading: function() {
        // التحقق من أن التحميل الكسول للصور غير مفعل بالفعل
        if (this.state.lazyLoadingEnabled) {
            return;
        }
        
        // التحقق من دعم IntersectionObserver
        if ('IntersectionObserver' in window) {
            // إنشاء مراقب التقاطع
            this.state.intersectionObserver = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    rootMargin: `${this.settings.lazyLoadThreshold}px`,
                    threshold: 0.01
                }
            );
            
            // تحديد الصور
            const images = document.querySelectorAll('img:not([loading="lazy"])');
            
            // تحويل الصور إلى تحميل كسول
            images.forEach(image => {
                // تخزين مصدر الصورة الأصلي
                const originalSrc = image.getAttribute('src');
                
                if (originalSrc && !image.hasAttribute('data-src')) {
                    // تخزين مصدر الصورة الأصلي في سمة مخصصة
                    image.setAttribute('data-src', originalSrc);
                    
                    // تعيين مصدر الصورة إلى صورة شفافة صغيرة
                    image.setAttribute('src', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E');
                    
                    // إضافة فئة CSS للصور الكسولة
                    image.classList.add('lazy-image');
                    
                    // إضافة الصورة إلى مراقب التقاطع
                    this.state.intersectionObserver.observe(image);
                    
                    // تخزين الصورة في حالة النظام
                    if (!this.state.enhancedElements.lazyImages) {
                        this.state.enhancedElements.lazyImages = [];
                    }
                    
                    this.state.enhancedElements.lazyImages.push(image);
                }
            });
            
            // تعيين حالة التحميل الكسول للصور
            this.state.lazyLoadingEnabled = true;
            
            console.log(`تم تفعيل التحميل الكسول لـ ${images.length} صورة`);
        } else {
            console.warn('المتصفح لا يدعم IntersectionObserver');
        }
    },
    
    /**
     * معالجة تقاطع الصور
     * @param {IntersectionObserverEntry[]} entries إدخالات التقاطع
     */
    handleIntersection: function(entries) {
        // معالجة كل إدخال تقاطع
        entries.forEach(entry => {
            // التحقق من أن العنصر مرئي
            if (entry.isIntersecting) {
                // الحصول على الصورة
                const image = entry.target;
                
                // الحصول على مصدر الصورة الأصلي
                const originalSrc = image.getAttribute('data-src');
                
                if (originalSrc) {
                    // تعيين مصدر الصورة إلى المصدر الأصلي
                    image.setAttribute('src', originalSrc);
                    
                    // إزالة سمة مصدر الصورة الأصلي
                    image.removeAttribute('data-src');
                    
                    // إزالة فئة CSS للصور الكسولة
                    image.classList.remove('lazy-image');
                    
                    // إضافة فئة CSS للصور المحملة
                    image.classList.add('lazy-loaded');
                    
                    // إزالة الصورة من مراقب التقاطع
                    this.state.intersectionObserver.unobserve(image);
                }
            }
        });
    },
    
    /**
     * تفعيل الصور المتجاوبة
     */
    enableResponsiveImages: function() {
        // التحقق من أن الصور المتجاوبة غير مفعلة بالفعل
        if (this.state.responsiveImagesEnabled) {
            return;
        }
        
        // تحديد الصور
        const images = document.querySelectorAll('img:not([srcset])');
        
        // تحويل الصور إلى صور متجاوبة
        images.forEach(image => {
            // التحقق من أن الصورة ليست صورة SVG
            const src = image.getAttribute('src');
            
            if (src && !src.endsWith('.svg') && !src.startsWith('data:')) {
                // إنشاء مجموعة مصادر للصورة
                const srcset = this.generateSrcset(src);
                
                if (srcset) {
                    // تعيين مجموعة مصادر الصورة
                    image.setAttribute('srcset', srcset);
                    
                    // تعيين أحجام الصورة
                    image.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
                    
                    // تخزين الصورة في حالة النظام
                    if (!this.state.enhancedElements.responsiveImages) {
                        this.state.enhancedElements.responsiveImages = [];
                    }
                    
                    this.state.enhancedElements.responsiveImages.push(image);
                }
            }
        });
        
        // تعيين حالة الصور المتجاوبة
        this.state.responsiveImagesEnabled = true;
        
        console.log(`تم تفعيل الصور المتجاوبة لـ ${images.length} صورة`);
    },
    
    /**
     * إنشاء مجموعة مصادر للصورة
     * @param {string} src مصدر الصورة
     * @returns {string} مجموعة مصادر الصورة
     */
    generateSrcset: function(src) {
        // التحقق من أن مصدر الصورة صالح
        if (!src || src.startsWith('data:')) {
            return null;
        }
        
        // تقسيم مصدر الصورة إلى مسار واسم ملف وامتداد
        const lastDotIndex = src.lastIndexOf('.');
        const lastSlashIndex = src.lastIndexOf('/');
        
        if (lastDotIndex === -1 || lastSlashIndex === -1) {
            return null;
        }
        
        const path = src.substring(0, lastSlashIndex + 1);
        const filename = src.substring(lastSlashIndex + 1, lastDotIndex);
        const extension = src.substring(lastDotIndex);
        
        // إنشاء مجموعة مصادر للصورة
        return `
            ${path}${filename}-small${extension} 300w,
            ${path}${filename}-medium${extension} 600w,
            ${path}${filename}-large${extension} 900w,
            ${src} 1200w
        `;
    },
    
    /**
     * تعطيل تحسينات تحميل الصور
     */
    disableImageOptimizations: function() {
        // تعطيل التحميل الكسول للصور
        if (this.state.lazyLoadingEnabled) {
            this.disableLazyLoading();
        }
        
        // تعطيل الصور المتجاوبة
        if (this.state.responsiveImagesEnabled) {
            this.disableResponsiveImages();
        }
        
        // تعيين حالة تحسين تحميل الصور
        this.state.imagesOptimized = false;
        
        console.log('تم تعطيل تحسينات تحميل الصور');
    },
    
    /**
     * تعطيل التحميل الكسول للصور
     */
    disableLazyLoading: function() {
        // التحقق من أن التحميل الكسول للصور مفعل
        if (!this.state.lazyLoadingEnabled) {
            return;
        }
        
        // إيقاف مراقب التقاطع
        if (this.state.intersectionObserver) {
            this.state.intersectionObserver.disconnect();
            this.state.intersectionObserver = null;
        }
        
        // استعادة الصور الكسولة
        if (this.state.enhancedElements.lazyImages) {
            this.state.enhancedElements.lazyImages.forEach(image => {
                // الحصول على مصدر الصورة الأصلي
                const originalSrc = image.getAttribute('data-src');
                
                if (originalSrc) {
                    // تعيين مصدر الصورة إلى المصدر الأصلي
                    image.setAttribute('src', originalSrc);
                    
                    // إزالة سمة مصدر الصورة الأصلي
                    image.removeAttribute('data-src');
                }
                
                // إزالة فئات CSS للصور الكسولة
                image.classList.remove('lazy-image', 'lazy-loaded');
            });
            
            this.state.enhancedElements.lazyImages = [];
        }
        
        // تعيين حالة التحميل الكسول للصور
        this.state.lazyLoadingEnabled = false;
        
        console.log('تم تعطيل التحميل الكسول للصور');
    },
    
    /**
     * تعطيل الصور المتجاوبة
     */
    disableResponsiveImages: function() {
        // التحقق من أن الصور المتجاوبة مفعلة
        if (!this.state.responsiveImagesEnabled) {
            return;
        }
        
        // استعادة الصور المتجاوبة
        if (this.state.enhancedElements.responsiveImages) {
            this.state.enhancedElements.responsiveImages.forEach(image => {
                // إزالة مجموعة مصادر الصورة
                image.removeAttribute('srcset');
                
                // إزالة أحجام الصورة
                image.removeAttribute('sizes');
            });
            
            this.state.enhancedElements.responsiveImages = [];
        }
        
        // تعيين حالة الصور المتجاوبة
        this.state.responsiveImagesEnabled = false;
        
        console.log('تم تعطيل الصور المتجاوبة');
    },
    
    /**
     * تفعيل تجميع طلبات HTTP
     */
    enableHttpRequestBatching: function() {
        // التحقق من أن تجميع طلبات HTTP غير مفعل بالفعل
        if (this.state.httpRequestsBatched) {
            return;
        }
        
        // تعديل دالة الطلب الأصلية
        if (!window.originalFetch && window.fetch) {
            // تخزين دالة الطلب الأصلية
            window.originalFetch = window.fetch;
            
            // استبدال دالة الطلب بدالة مخصصة
            window.fetch = this.batchedFetch.bind(this);
        }
        
        // تعديل كائن XMLHttpRequest
        if (!window.originalXHROpen && window.XMLHttpRequest) {
            // تخزين دالة فتح الطلب الأصلية
            window.originalXHROpen = XMLHttpRequest.prototype.open;
            
            // استبدال دالة فتح الطلب بدالة مخصصة
            XMLHttpRequest.prototype.open = function(method, url, async = true, user, password) {
                // تخزين معلومات الطلب
                this._method = method;
                this._url = url;
                this._async = async;
                this._user = user;
                this._password = password;
                
                // استدعاء دالة فتح الطلب الأصلية
                return window.originalXHROpen.apply(this, arguments);
            };
            
            // تخزين دالة إرسال الطلب الأصلية
            window.originalXHRSend = XMLHttpRequest.prototype.send;
            
            // استبدال دالة إرسال الطلب بدالة مخصصة
            XMLHttpRequest.prototype.send = function(body) {
                // التحقق من أن الطلب يمكن تجميعه
                if (this._method === 'GET' && this._async !== false) {
                    // تجميع الطلب
                    PerformanceOptimizer.batchXHRRequest(this, body);
                } else {
                    // استدعاء دالة إرسال الطلب الأصلية
                    window.originalXHRSend.call(this, body);
                }
            };
        }
        
        // تعيين حالة تجميع طلبات HTTP
        this.state.httpRequestsBatched = true;
        
        console.log('تم تفعيل تجميع طلبات HTTP');
    },
    
    /**
     * دالة الطلب المجمعة
     * @param {string} url عنوان URL
     * @param {Object} options خيارات الطلب
     * @returns {Promise} وعد بنتيجة الطلب
     */
    batchedFetch: function(url, options = {}) {
        // التحقق من أن الطلب يمكن تجميعه
        if (options.method && options.method !== 'GET') {
            // استدعاء دالة الطلب الأصلية
            return window.originalFetch(url, options);
        }
        
        // إنشاء وعد بنتيجة الطلب
        return new Promise((resolve, reject) => {
            // تحديد مفتاح الدفعة
            const batchKey = this.getBatchKey(url);
            
            // إنشاء دفعة جديدة إذا لم تكن موجودة
            if (!this.state.pendingRequests[batchKey]) {
                this.state.pendingRequests[batchKey] = [];
                
                // إنشاء مؤقت للدفعة
                this.state.batchTimers[batchKey] = setTimeout(() => {
                    // تنفيذ الدفعة
                    this.executeBatch(batchKey);
                }, this.settings.batchTimeout);
            }
            
            // إضافة الطلب إلى الدفعة
            this.state.pendingRequests[batchKey].push({
                url,
                options,
                resolve,
                reject
            });
            
            // تنفيذ الدفعة إذا وصلت إلى الحد الأقصى
            if (this.state.pendingRequests[batchKey].length >= this.settings.maxBatchSize) {
                // إلغاء المؤقت
                clearTimeout(this.state.batchTimers[batchKey]);
                
                // تنفيذ الدفعة
                this.executeBatch(batchKey);
            }
        });
    },
    
    /**
     * تجميع طلب XMLHttpRequest
     * @param {XMLHttpRequest} xhr كائن XMLHttpRequest
     * @param {any} body محتوى الطلب
     */
    batchXHRRequest: function(xhr, body) {
        // تحديد مفتاح الدفعة
        const batchKey = this.getBatchKey(xhr._url);
        
        // إنشاء دفعة جديدة إذا لم تكن موجودة
        if (!this.state.pendingRequests[batchKey]) {
            this.state.pendingRequests[batchKey] = [];
            
            // إنشاء مؤقت للدفعة
            this.state.batchTimers[batchKey] = setTimeout(() => {
                // تنفيذ الدفعة
                this.executeBatch(batchKey);
            }, this.settings.batchTimeout);
        }
        
        // إضافة الطلب إلى الدفعة
        this.state.pendingRequests[batchKey].push({
            xhr,
            body
        });
        
        // تنفيذ الدفعة إذا وصلت إلى الحد الأقصى
        if (this.state.pendingRequests[batchKey].length >= this.settings.maxBatchSize) {
            // إلغاء المؤقت
            clearTimeout(this.state.batchTimers[batchKey]);
            
            // تنفيذ الدفعة
            this.executeBatch(batchKey);
        }
    },
    
    /**
     * تحديد مفتاح الدفعة
     * @param {string} url عنوان URL
     * @returns {string} مفتاح الدفعة
     */
    getBatchKey: function(url) {
        // تقسيم عنوان URL إلى مكونات
        const urlObj = new URL(url, window.location.origin);
        
        // استخدام المسار كمفتاح للدفعة
        return urlObj.pathname;
    },
    
    /**
     * تنفيذ دفعة من الطلبات
     * @param {string} batchKey مفتاح الدفعة
     */
    executeBatch: function(batchKey) {
        // الحصول على الطلبات المعلقة
        const requests = this.state.pendingRequests[batchKey];
        
        // إعادة تعيين الطلبات المعلقة
        this.state.pendingRequests[batchKey] = [];
        
        // إلغاء المؤقت
        clearTimeout(this.state.batchTimers[batchKey]);
        this.state.batchTimers[batchKey] = null;
        
        // تنفيذ الطلبات
        requests.forEach(request => {
            if (request.xhr) {
                // تنفيذ طلب XMLHttpRequest
                window.originalXHRSend.call(request.xhr, request.body);
            } else {
                // تنفيذ طلب fetch
                window.originalFetch(request.url, request.options)
                    .then(request.resolve)
                    .catch(request.reject);
            }
        });
        
        console.log(`تم تنفيذ دفعة من ${requests.length} طلب`);
    },
    
    /**
     * تعطيل تجميع طلبات HTTP
     */
    disableHttpRequestBatching: function() {
        // التحقق من أن تجميع طلبات HTTP مفعل
        if (!this.state.httpRequestsBatched) {
            return;
        }
        
        // استعادة دالة الطلب الأصلية
        if (window.originalFetch) {
            window.fetch = window.originalFetch;
            window.originalFetch = null;
        }
        
        // استعادة كائن XMLHttpRequest
        if (window.originalXHROpen) {
            XMLHttpRequest.prototype.open = window.originalXHROpen;
            window.originalXHROpen = null;
        }
        
        if (window.originalXHRSend) {
            XMLHttpRequest.prototype.send = window.originalXHRSend;
            window.originalXHRSend = null;
        }
        
        // تنفيذ جميع الطلبات المعلقة
        for (const batchKey in this.state.pendingRequests) {
            // تنفيذ الدفعة
            this.executeBatch(batchKey);
        }
        
        // تعيين حالة تجميع طلبات HTTP
        this.state.httpRequestsBatched = false;
        
        console.log('تم تعطيل تجميع طلبات HTTP');
    },
    
    /**
     * تفعيل التخزين المؤقت للموارد
     */
    enableResourceCaching: function() {
        // التحقق من أن التخزين المؤقت للموارد غير مفعل بالفعل
        if (this.state.resourceCachingEnabled) {
            return;
        }
        
        // تعديل دالة الطلب الأصلية
        if (!window.originalFetchForCaching && window.fetch) {
            // تخزين دالة الطلب الأصلية
            window.originalFetchForCaching = window.fetch;
            
            // استبدال دالة الطلب بدالة مخصصة
            window.fetch = this.cachedFetch.bind(this);
        }
        
        // تعيين حالة التخزين المؤقت للموارد
        this.state.resourceCachingEnabled = true;
        
        console.log('تم تفعيل التخزين المؤقت للموارد');
    },
    
    /**
     * دالة الطلب المخزنة مؤقتاً
     * @param {string} url عنوان URL
     * @param {Object} options خيارات الطلب
     * @returns {Promise} وعد بنتيجة الطلب
     */
    cachedFetch: function(url, options = {}) {
        // التحقق من أن الطلب يمكن تخزينه مؤقتاً
        if (options.method && options.method !== 'GET') {
            // استدعاء دالة الطلب الأصلية
            return window.originalFetchForCaching(url, options);
        }
        
        // تحديد مفتاح التخزين المؤقت
        const cacheKey = url;
        
        // التحقق من وجود المورد في التخزين المؤقت
        if (this.state.resourceCache[cacheKey]) {
            // الحصول على المورد المخزن مؤقتاً
            const cachedResource = this.state.resourceCache[cacheKey];
            
            // التحقق من صلاحية المورد المخزن مؤقتاً
            if (Date.now() - cachedResource.timestamp < this.settings.cacheDuration * 1000) {
                // إنشاء استجابة من المورد المخزن مؤقتاً
                return Promise.resolve(cachedResource.response.clone());
            }
        }
        
        // استدعاء دالة الطلب الأصلية
        return window.originalFetchForCaching(url, options)
            .then(response => {
                // تخزين المورد مؤقتاً
                this.state.resourceCache[cacheKey] = {
                    response: response.clone(),
                    timestamp: Date.now()
                };
                
                return response;
            });
    },
    
    /**
     * تعطيل التخزين المؤقت للموارد
     */
    disableResourceCaching: function() {
        // التحقق من أن التخزين المؤقت للموارد مفعل
        if (!this.state.resourceCachingEnabled) {
            return;
        }
        
        // استعادة دالة الطلب الأصلية
        if (window.originalFetchForCaching) {
            window.fetch = window.originalFetchForCaching;
            window.originalFetchForCaching = null;
        }
        
        // مسح التخزين المؤقت للموارد
        this.state.resourceCache = {};
        
        // تعيين حالة التخزين المؤقت للموارد
        this.state.resourceCachingEnabled = false;
        
        console.log('تم تعطيل التخزين المؤقت للموارد');
    },
    
    /**
     * تفعيل التحميل المسبق للروابط
     */
    enableLinkPrefetching: function() {
        // التحقق من أن التحميل المسبق للروابط غير مفعل بالفعل
        if (this.state.linkPrefetchingEnabled) {
            return;
        }
        
        // التحقق من دعم IntersectionObserver
        if ('IntersectionObserver' in window) {
            // إنشاء مراقب التقاطع
            const observer = new IntersectionObserver(
                this.handleLinkIntersection.bind(this),
                {
                    rootMargin: `${this.settings.linkPrefetchThreshold}px`,
                    threshold: 0.01
                }
            );
            
            // تحديد الروابط
            const links = document.querySelectorAll('a[href]:not([rel="prefetch"])');
            
            // إضافة الروابط إلى مراقب التقاطع
            links.forEach(link => {
                // التحقق من أن الرابط صالح
                const href = link.getAttribute('href');
                
                if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                    // إضافة الرابط إلى مراقب التقاطع
                    observer.observe(link);
                    
                    // تخزين الرابط في حالة النظام
                    if (!this.state.enhancedElements.prefetchLinks) {
                        this.state.enhancedElements.prefetchLinks = [];
                    }
                    
                    this.state.enhancedElements.prefetchLinks.push(link);
                }
            });
            
            // تخزين مراقب التقاطع في حالة النظام
            this.state.enhancedElements.linkPrefetchObserver = observer;
            
            // تعيين حالة التحميل المسبق للروابط
            this.state.linkPrefetchingEnabled = true;
            
            console.log(`تم تفعيل التحميل المسبق لـ ${links.length} رابط`);
        } else {
            console.warn('المتصفح لا يدعم IntersectionObserver');
        }
    },
    
    /**
     * معالجة تقاطع الروابط
     * @param {IntersectionObserverEntry[]} entries إدخالات التقاطع
     */
    handleLinkIntersection: function(entries) {
        // معالجة كل إدخال تقاطع
        entries.forEach(entry => {
            // التحقق من أن العنصر مرئي
            if (entry.isIntersecting) {
                // الحصول على الرابط
                const link = entry.target;
                
                // الحصول على عنوان الرابط
                const href = link.getAttribute('href');
                
                if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                    // إنشاء عنصر prefetch
                    const prefetch = document.createElement('link');
                    prefetch.rel = 'prefetch';
                    prefetch.href = href;
                    
                    // إضافة عنصر prefetch إلى رأس الصفحة
                    document.head.appendChild(prefetch);
                    
                    // تعيين سمة rel للرابط
                    link.setAttribute('rel', 'prefetch');
                    
                    // إزالة الرابط من مراقب التقاطع
                    this.state.enhancedElements.linkPrefetchObserver.unobserve(link);
                    
                    // تخزين عنصر prefetch في حالة النظام
                    if (!this.state.enhancedElements.prefetchElements) {
                        this.state.enhancedElements.prefetchElements = [];
                    }
                    
                    this.state.enhancedElements.prefetchElements.push(prefetch);
                }
            }
        });
    },
    
    /**
     * تعطيل التحميل المسبق للروابط
     */
    disableLinkPrefetching: function() {
        // التحقق من أن التحميل المسبق للروابط مفعل
        if (!this.state.linkPrefetchingEnabled) {
            return;
        }
        
        // إيقاف مراقب التقاطع
        if (this.state.enhancedElements.linkPrefetchObserver) {
            this.state.enhancedElements.linkPrefetchObserver.disconnect();
            this.state.enhancedElements.linkPrefetchObserver = null;
        }
        
        // إزالة عناصر prefetch
        if (this.state.enhancedElements.prefetchElements) {
            this.state.enhancedElements.prefetchElements.forEach(prefetch => {
                prefetch.remove();
            });
            
            this.state.enhancedElements.prefetchElements = [];
        }
        
        // إزالة سمة rel من الروابط
        if (this.state.enhancedElements.prefetchLinks) {
            this.state.enhancedElements.prefetchLinks.forEach(link => {
                link.removeAttribute('rel');
            });
            
            this.state.enhancedElements.prefetchLinks = [];
        }
        
        // تعيين حالة التحميل المسبق للروابط
        this.state.linkPrefetchingEnabled = false;
        
        console.log('تم تعطيل التحميل المسبق للروابط');
    },
    
    /**
     * تفعيل تحميل الموارد بشكل غير متزامن
     */
    enableAsyncLoading: function() {
        // التحقق من أن تحميل الموارد بشكل غير متزامن غير مفعل بالفعل
        if (this.state.asyncLoadingEnabled) {
            return;
        }
        
        // تحديد عناصر النص البرمجي
        const scripts = document.querySelectorAll('script:not([async]):not([defer])');
        
        // تحويل عناصر النص البرمجي إلى تحميل غير متزامن
        scripts.forEach(script => {
            // التحقق من أن النص البرمجي له مصدر
            const src = script.getAttribute('src');
            
            if (src) {
                // إنشاء نسخة من النص البرمجي
                const asyncScript = document.createElement('script');
                asyncScript.src = src;
                asyncScript.async = true;
                
                // نسخ السمات الأخرى
                for (let i = 0; i < script.attributes.length; i++) {
                    const attr = script.attributes[i];
                    
                    if (attr.name !== 'src' && attr.name !== 'async' && attr.name !== 'defer') {
                        asyncScript.setAttribute(attr.name, attr.value);
                    }
                }
                
                // استبدال النص البرمجي
                script.parentNode.replaceChild(asyncScript, script);
                
                // تخزين النص البرمجي في حالة النظام
                if (!this.state.enhancedElements.asyncScripts) {
                    this.state.enhancedElements.asyncScripts = [];
                }
                
                this.state.enhancedElements.asyncScripts.push({
                    original: script,
                    async: asyncScript
                });
            }
        });
        
        // تحديد عناصر الأنماط
        const styles = document.querySelectorAll('link[rel="stylesheet"]');
        
        // تحويل عناصر الأنماط إلى تحميل غير متزامن
        styles.forEach(style => {
            // التحقق من أن الأنماط لها مصدر
            const href = style.getAttribute('href');
            
            if (href) {
                // إنشاء نسخة من الأنماط
                const asyncStyle = document.createElement('link');
                asyncStyle.href = href;
                asyncStyle.rel = 'preload';
                asyncStyle.as = 'style';
                asyncStyle.onload = function() {
                    this.rel = 'stylesheet';
                };
                
                // نسخ السمات الأخرى
                for (let i = 0; i < style.attributes.length; i++) {
                    const attr = style.attributes[i];
                    
                    if (attr.name !== 'href' && attr.name !== 'rel') {
                        asyncStyle.setAttribute(attr.name, attr.value);
                    }
                }
                
                // استبدال الأنماط
                style.parentNode.replaceChild(asyncStyle, style);
                
                // تخزين الأنماط في حالة النظام
                if (!this.state.enhancedElements.asyncStyles) {
                    this.state.enhancedElements.asyncStyles = [];
                }
                
                this.state.enhancedElements.asyncStyles.push({
                    original: style,
                    async: asyncStyle
                });
            }
        });
        
        // تعيين حالة تحميل الموارد بشكل غير متزامن
        this.state.asyncLoadingEnabled = true;
        
        console.log(`تم تفعيل تحميل الموارد بشكل غير متزامن لـ ${scripts.length} نص برمجي و ${styles.length} نمط`);
    },
    
    /**
     * تعطيل تحميل الموارد بشكل غير متزامن
     */
    disableAsyncLoading: function() {
        // التحقق من أن تحميل الموارد بشكل غير متزامن مفعل
        if (!this.state.asyncLoadingEnabled) {
            return;
        }
        
        // استعادة عناصر النص البرمجي
        if (this.state.enhancedElements.asyncScripts) {
            this.state.enhancedElements.asyncScripts.forEach(script => {
                script.async.parentNode.replaceChild(script.original, script.async);
            });
            
            this.state.enhancedElements.asyncScripts = [];
        }
        
        // استعادة عناصر الأنماط
        if (this.state.enhancedElements.asyncStyles) {
            this.state.enhancedElements.asyncStyles.forEach(style => {
                style.async.parentNode.replaceChild(style.original, style.async);
            });
            
            this.state.enhancedElements.asyncStyles = [];
        }
        
        // تعيين حالة تحميل الموارد بشكل غير متزامن
        this.state.asyncLoadingEnabled = false;
        
        console.log('تم تعطيل تحميل الموارد بشكل غير متزامن');
    },
    
    /**
     * تفعيل تأجيل تحميل JavaScript غير الضروري
     */
    enableDeferredLoading: function() {
        // التحقق من أن تأجيل تحميل JavaScript غير الضروري غير مفعل بالفعل
        if (this.state.deferredLoadingEnabled) {
            return;
        }
        
        // تحديد عناصر النص البرمجي غير الضرورية
        const nonCriticalScripts = document.querySelectorAll('script[data-priority="low"]');
        
        // تأجيل تحميل عناصر النص البرمجي غير الضرورية
        nonCriticalScripts.forEach(script => {
            // التحقق من أن النص البرمجي له مصدر
            const src = script.getAttribute('src');
            
            if (src) {
                // إنشاء نسخة من النص البرمجي
                const deferredScript = document.createElement('script');
                deferredScript.src = src;
                deferredScript.defer = true;
                
                // نسخ السمات الأخرى
                for (let i = 0; i < script.attributes.length; i++) {
                    const attr = script.attributes[i];
                    
                    if (attr.name !== 'src' && attr.name !== 'async' && attr.name !== 'defer' && attr.name !== 'data-priority') {
                        deferredScript.setAttribute(attr.name, attr.value);
                    }
                }
                
                // إزالة النص البرمجي الأصلي
                script.parentNode.removeChild(script);
                
                // تخزين النص البرمجي في حالة النظام
                if (!this.state.enhancedElements.deferredScripts) {
                    this.state.enhancedElements.deferredScripts = [];
                }
                
                this.state.enhancedElements.deferredScripts.push({
                    original: script,
                    deferred: deferredScript
                });
                
                // إضافة النص البرمجي المؤجل بعد تحميل الصفحة
                window.addEventListener('load', () => {
                    document.body.appendChild(deferredScript);
                });
            }
        });
        
        // تعيين حالة تأجيل تحميل JavaScript غير الضروري
        this.state.deferredLoadingEnabled = true;
        
        console.log(`تم تفعيل تأجيل تحميل ${nonCriticalScripts.length} نص برمجي غير ضروري`);
    },
    
    /**
     * تعطيل تأجيل تحميل JavaScript غير الضروري
     */
    disableDeferredLoading: function() {
        // التحقق من أن تأجيل تحميل JavaScript غير الضروري مفعل
        if (!this.state.deferredLoadingEnabled) {
            return;
        }
        
        // استعادة عناصر النص البرمجي غير الضرورية
        if (this.state.enhancedElements.deferredScripts) {
            this.state.enhancedElements.deferredScripts.forEach(script => {
                // إزالة النص البرمجي المؤجل
                if (script.deferred.parentNode) {
                    script.deferred.parentNode.removeChild(script.deferred);
                }
                
                // إضافة النص البرمجي الأصلي
                document.body.appendChild(script.original);
            });
            
            this.state.enhancedElements.deferredScripts = [];
        }
        
        // تعيين حالة تأجيل تحميل JavaScript غير الضروري
        this.state.deferredLoadingEnabled = false;
        
        console.log('تم تعطيل تأجيل تحميل JavaScript غير الضروري');
    },
    
    /**
     * تحسين الخطوط
     */
    optimizeFonts: function() {
        // التحقق من أن تحسين الخطوط غير مفعل بالفعل
        if (this.state.fontsOptimized) {
            return;
        }
        
        // إضافة سمة display=swap للخطوط
        const fontLinks = document.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis.com"]');
        
        fontLinks.forEach(link => {
            // الحصول على عنوان الخط
            const href = link.getAttribute('href');
            
            if (href && !href.includes('&display=swap')) {
                // إضافة سمة display=swap
                link.setAttribute('href', href + '&display=swap');
                
                // تخزين الخط في حالة النظام
                if (!this.state.enhancedElements.optimizedFonts) {
                    this.state.enhancedElements.optimizedFonts = [];
                }
                
                this.state.enhancedElements.optimizedFonts.push({
                    element: link,
                    originalHref: href
                });
            }
        });
        
        // إضافة قاعدة font-display: swap للخطوط المضمنة
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-display: swap !important;
            }
        `;
        
        document.head.appendChild(style);
        
        // تخزين عنصر الأنماط في حالة النظام
        this.state.enhancedElements.fontDisplayStyle = style;
        
        // تعيين حالة تحسين الخطوط
        this.state.fontsOptimized = true;
        
        console.log(`تم تحسين ${fontLinks.length} خط`);
    },
    
    /**
     * تعطيل تحسين الخطوط
     */
    disableFontOptimizations: function() {
        // التحقق من أن تحسين الخطوط مفعل
        if (!this.state.fontsOptimized) {
            return;
        }
        
        // استعادة الخطوط
        if (this.state.enhancedElements.optimizedFonts) {
            this.state.enhancedElements.optimizedFonts.forEach(font => {
                font.element.setAttribute('href', font.originalHref);
            });
            
            this.state.enhancedElements.optimizedFonts = [];
        }
        
        // إزالة قاعدة font-display: swap
        if (this.state.enhancedElements.fontDisplayStyle) {
            this.state.enhancedElements.fontDisplayStyle.remove();
            this.state.enhancedElements.fontDisplayStyle = null;
        }
        
        // تعيين حالة تحسين الخطوط
        this.state.fontsOptimized = false;
        
        console.log('تم تعطيل تحسين الخطوط');
    },
    
    /**
     * تحسين الرسوم المتحركة
     */
    optimizeAnimations: function() {
        // التحقق من أن تحسين الرسوم المتحركة غير مفعل بالفعل
        if (this.state.animationsOptimized) {
            return;
        }
        
        // إضافة قواعد CSS لتحسين الرسوم المتحركة
        const style = document.createElement('style');
        style.textContent = `
            .optimize-animation {
                will-change: transform;
                transform: translateZ(0);
            }
            
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            }
        `;
        
        document.head.appendChild(style);
        
        // تخزين عنصر الأنماط في حالة النظام
        this.state.enhancedElements.animationStyle = style;
        
        // تحديد العناصر المتحركة
        const animatedElements = document.querySelectorAll('.animated, [data-animation]');
        
        // إضافة فئة CSS للعناصر المتحركة
        animatedElements.forEach(element => {
            element.classList.add('optimize-animation');
            
            // تخزين العنصر في حالة النظام
            if (!this.state.enhancedElements.optimizedAnimations) {
                this.state.enhancedElements.optimizedAnimations = [];
            }
            
            this.state.enhancedElements.optimizedAnimations.push(element);
        });
        
        // تعيين حالة تحسين الرسوم المتحركة
        this.state.animationsOptimized = true;
        
        console.log(`تم تحسين ${animatedElements.length} رسم متحرك`);
    },
    
    /**
     * تعطيل تحسين الرسوم المتحركة
     */
    disableAnimationOptimizations: function() {
        // التحقق من أن تحسين الرسوم المتحركة مفعل
        if (!this.state.animationsOptimized) {
            return;
        }
        
        // إزالة فئة CSS من العناصر المتحركة
        if (this.state.enhancedElements.optimizedAnimations) {
            this.state.enhancedElements.optimizedAnimations.forEach(element => {
                element.classList.remove('optimize-animation');
            });
            
            this.state.enhancedElements.optimizedAnimations = [];
        }
        
        // إزالة قواعد CSS لتحسين الرسوم المتحركة
        if (this.state.enhancedElements.animationStyle) {
            this.state.enhancedElements.animationStyle.remove();
            this.state.enhancedElements.animationStyle = null;
        }
        
        // تعيين حالة تحسين الرسوم المتحركة
        this.state.animationsOptimized = false;
        
        console.log('تم تعطيل تحسين الرسوم المتحركة');
    }
};

// تهيئة نظام تحسينات الأداء عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    PerformanceOptimizer.init();
    
    console.log('تم تهيئة نظام تحسينات الأداء');
});

// تصدير كائن PerformanceOptimizer للاستخدام في ملفات أخرى
window.PerformanceOptimizer = PerformanceOptimizer;
