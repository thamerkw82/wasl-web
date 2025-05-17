/**
 * نظام تحديث البيانات باستخدام AJAX
 * يوفر وظائف لاستعلام البيانات من الخادم وتحديث واجهة المستخدم
 */

// كائن لإدارة طلبات AJAX وتحديث البيانات
const AjaxDataManager = {
    // إعدادات افتراضية
    settings: {
        // عنوان API الافتراضي
        apiBaseUrl: '/api',
        
        // مهلة الطلب (بالمللي ثانية)
        timeout: 30000,
        
        // ما إذا كان يجب استخدام ذاكرة التخزين المؤقت
        useCache: true,
        
        // مدة صلاحية ذاكرة التخزين المؤقت (بالمللي ثانية)
        cacheDuration: 60000,
        
        // ما إذا كان يجب عرض مؤشرات التحميل
        showLoadingIndicators: true,
        
        // ما إذا كان يجب عرض إشعارات الخطأ
        showErrorNotifications: true,
        
        // ما إذا كان يجب تجميع الطلبات المتشابهة
        batchSimilarRequests: true,
        
        // الحد الأقصى لعدد محاولات إعادة الطلب
        maxRetryAttempts: 3,
        
        // الفاصل الزمني بين محاولات إعادة الطلب (بالمللي ثانية)
        retryInterval: 2000
    },
    
    // حالة النظام
    state: {
        // ذاكرة التخزين المؤقت للبيانات
        cache: {},
        
        // الطلبات قيد التنفيذ
        pendingRequests: {},
        
        // عدد محاولات إعادة الطلب لكل طلب
        retryAttempts: {},
        
        // مؤشرات التحميل
        loadingIndicators: {},
        
        // وقت آخر تحديث لكل نوع بيانات
        lastUpdateTime: {}
    },
    
    /**
     * تهيئة نظام تحديث البيانات باستخدام AJAX
     * @param {Object} options خيارات التهيئة
     */
    init: function(options = {}) {
        // دمج الخيارات مع الإعدادات الافتراضية
        this.settings = { ...this.settings, ...options };
        
        console.log('تم تهيئة نظام تحديث البيانات باستخدام AJAX');
        
        // تنظيف ذاكرة التخزين المؤقت بشكل دوري
        setInterval(() => {
            this.cleanCache();
        }, 300000); // كل 5 دقائق
    },
    
    /**
     * إرسال طلب AJAX
     * @param {string} endpoint نقطة النهاية
     * @param {Object} options خيارات الطلب
     * @returns {Promise} وعد بنتيجة الطلب
     */
    sendRequest: function(endpoint, options = {}) {
        // دمج الخيارات مع الخيارات الافتراضية
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: null,
            useCache: this.settings.useCache,
            showLoading: this.settings.showLoadingIndicators,
            targetElement: null,
            ...options
        };
        
        // إنشاء مفتاح الطلب
        const requestKey = this.createRequestKey(endpoint, requestOptions);
        
        // التحقق من وجود طلب مماثل قيد التنفيذ
        if (this.settings.batchSimilarRequests && this.state.pendingRequests[requestKey]) {
            console.log(`تجميع طلب مماثل: ${requestKey}`);
            return this.state.pendingRequests[requestKey];
        }
        
        // التحقق من وجود البيانات في ذاكرة التخزين المؤقت
        if (requestOptions.useCache && requestOptions.method === 'GET') {
            const cachedData = this.getCachedData(requestKey);
            
            if (cachedData) {
                console.log(`استخدام البيانات المخزنة مؤقتاً: ${requestKey}`);
                return Promise.resolve(cachedData);
            }
        }
        
        // إظهار مؤشر التحميل
        if (requestOptions.showLoading && requestOptions.targetElement) {
            this.showLoadingIndicator(requestOptions.targetElement);
        }
        
        // إنشاء عنوان URL كامل
        const url = `${this.settings.apiBaseUrl}${endpoint}`;
        
        // إنشاء وعد بنتيجة الطلب
        const requestPromise = new Promise((resolve, reject) => {
            // إنشاء كائن XMLHttpRequest
            const xhr = new XMLHttpRequest();
            
            // تعيين مهلة الطلب
            xhr.timeout = this.settings.timeout;
            
            // فتح الاتصال
            xhr.open(requestOptions.method, url, true);
            
            // تعيين رؤوس الطلب
            Object.keys(requestOptions.headers).forEach(headerName => {
                xhr.setRequestHeader(headerName, requestOptions.headers[headerName]);
            });
            
            // معالجة استجابة الطلب
            xhr.onload = () => {
                // إخفاء مؤشر التحميل
                if (requestOptions.showLoading && requestOptions.targetElement) {
                    this.hideLoadingIndicator(requestOptions.targetElement);
                }
                
                // حذف الطلب من قائمة الطلبات قيد التنفيذ
                delete this.state.pendingRequests[requestKey];
                
                // إعادة تعيين عدد محاولات إعادة الطلب
                delete this.state.retryAttempts[requestKey];
                
                // التحقق من حالة الاستجابة
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        // تحليل البيانات
                        const responseData = JSON.parse(xhr.responseText);
                        
                        // تخزين البيانات في ذاكرة التخزين المؤقت
                        if (requestOptions.useCache && requestOptions.method === 'GET') {
                            this.cacheData(requestKey, responseData);
                        }
                        
                        // تحديث وقت آخر تحديث
                        this.state.lastUpdateTime[endpoint] = Date.now();
                        
                        // حل الوعد بالبيانات
                        resolve(responseData);
                    } catch (error) {
                        console.error('خطأ في تحليل البيانات:', error);
                        reject(new Error('خطأ في تحليل البيانات'));
                    }
                } else {
                    // إنشاء كائن خطأ
                    const error = new Error(`فشل الطلب: ${xhr.status} ${xhr.statusText}`);
                    error.status = xhr.status;
                    
                    // عرض إشعار بالخطأ
                    if (this.settings.showErrorNotifications) {
                        this.showErrorNotification(error);
                    }
                    
                    // رفض الوعد بالخطأ
                    reject(error);
                }
            };
            
            // معالجة خطأ الطلب
            xhr.onerror = () => {
                // إخفاء مؤشر التحميل
                if (requestOptions.showLoading && requestOptions.targetElement) {
                    this.hideLoadingIndicator(requestOptions.targetElement);
                }
                
                // حذف الطلب من قائمة الطلبات قيد التنفيذ
                delete this.state.pendingRequests[requestKey];
                
                // إنشاء كائن خطأ
                const error = new Error('فشل الاتصال بالخادم');
                
                // عرض إشعار بالخطأ
                if (this.settings.showErrorNotifications) {
                    this.showErrorNotification(error);
                }
                
                // محاولة إعادة الطلب
                this.retryRequest(endpoint, requestOptions, resolve, reject);
            };
            
            // معالجة انتهاء مهلة الطلب
            xhr.ontimeout = () => {
                // إخفاء مؤشر التحميل
                if (requestOptions.showLoading && requestOptions.targetElement) {
                    this.hideLoadingIndicator(requestOptions.targetElement);
                }
                
                // حذف الطلب من قائمة الطلبات قيد التنفيذ
                delete this.state.pendingRequests[requestKey];
                
                // إنشاء كائن خطأ
                const error = new Error('انتهت مهلة الطلب');
                
                // عرض إشعار بالخطأ
                if (this.settings.showErrorNotifications) {
                    this.showErrorNotification(error);
                }
                
                // محاولة إعادة الطلب
                this.retryRequest(endpoint, requestOptions, resolve, reject);
            };
            
            // إرسال الطلب
            if (requestOptions.data && (requestOptions.method === 'POST' || requestOptions.method === 'PUT')) {
                xhr.send(JSON.stringify(requestOptions.data));
            } else {
                xhr.send();
            }
        });
        
        // تخزين الوعد في قائمة الطلبات قيد التنفيذ
        this.state.pendingRequests[requestKey] = requestPromise;
        
        return requestPromise;
    },
    
    /**
     * محاولة إعادة الطلب
     * @param {string} endpoint نقطة النهاية
     * @param {Object} options خيارات الطلب
     * @param {Function} resolve دالة حل الوعد
     * @param {Function} reject دالة رفض الوعد
     */
    retryRequest: function(endpoint, options, resolve, reject) {
        // إنشاء مفتاح الطلب
        const requestKey = this.createRequestKey(endpoint, options);
        
        // زيادة عدد محاولات إعادة الطلب
        if (!this.state.retryAttempts[requestKey]) {
            this.state.retryAttempts[requestKey] = 0;
        }
        
        this.state.retryAttempts[requestKey]++;
        
        // التحقق من عدد محاولات إعادة الطلب
        if (this.state.retryAttempts[requestKey] <= this.settings.maxRetryAttempts) {
            console.log(`إعادة محاولة الطلب (${this.state.retryAttempts[requestKey]}/${this.settings.maxRetryAttempts}): ${requestKey}`);
            
            // إعادة المحاولة بعد فترة
            setTimeout(() => {
                // إنشاء عنوان URL كامل
                const url = `${this.settings.apiBaseUrl}${endpoint}`;
                
                // إنشاء كائن XMLHttpRequest
                const xhr = new XMLHttpRequest();
                
                // تعيين مهلة الطلب
                xhr.timeout = this.settings.timeout;
                
                // فتح الاتصال
                xhr.open(options.method, url, true);
                
                // تعيين رؤوس الطلب
                Object.keys(options.headers).forEach(headerName => {
                    xhr.setRequestHeader(headerName, options.headers[headerName]);
                });
                
                // معالجة استجابة الطلب
                xhr.onload = () => {
                    // إخفاء مؤشر التحميل
                    if (options.showLoading && options.targetElement) {
                        this.hideLoadingIndicator(options.targetElement);
                    }
                    
                    // حذف الطلب من قائمة الطلبات قيد التنفيذ
                    delete this.state.pendingRequests[requestKey];
                    
                    // إعادة تعيين عدد محاولات إعادة الطلب
                    delete this.state.retryAttempts[requestKey];
                    
                    // التحقق من حالة الاستجابة
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            // تحليل البيانات
                            const responseData = JSON.parse(xhr.responseText);
                            
                            // تخزين البيانات في ذاكرة التخزين المؤقت
                            if (options.useCache && options.method === 'GET') {
                                this.cacheData(requestKey, responseData);
                            }
                            
                            // تحديث وقت آخر تحديث
                            this.state.lastUpdateTime[endpoint] = Date.now();
                            
                            // حل الوعد بالبيانات
                            resolve(responseData);
                        } catch (error) {
                            console.error('خطأ في تحليل البيانات:', error);
                            reject(new Error('خطأ في تحليل البيانات'));
                        }
                    } else {
                        // إنشاء كائن خطأ
                        const error = new Error(`فشل الطلب: ${xhr.status} ${xhr.statusText}`);
                        error.status = xhr.status;
                        
                        // عرض إشعار بالخطأ
                        if (this.settings.showErrorNotifications) {
                            this.showErrorNotification(error);
                        }
                        
                        // رفض الوعد بالخطأ
                        reject(error);
                    }
                };
                
                // معالجة خطأ الطلب
                xhr.onerror = () => {
                    // إخفاء مؤشر التحميل
                    if (options.showLoading && options.targetElement) {
                        this.hideLoadingIndicator(options.targetElement);
                    }
                    
                    // حذف الطلب من قائمة الطلبات قيد التنفيذ
                    delete this.state.pendingRequests[requestKey];
                    
                    // محاولة إعادة الطلب مرة أخرى
                    this.retryRequest(endpoint, options, resolve, reject);
                };
                
                // معالجة انتهاء مهلة الطلب
                xhr.ontimeout = () => {
                    // إخفاء مؤشر التحميل
                    if (options.showLoading && options.targetElement) {
                        this.hideLoadingIndicator(options.targetElement);
                    }
                    
                    // حذف الطلب من قائمة الطلبات قيد التنفيذ
                    delete this.state.pendingRequests[requestKey];
                    
                    // محاولة إعادة الطلب مرة أخرى
                    this.retryRequest(endpoint, options, resolve, reject);
                };
                
                // إرسال الطلب
                if (options.data && (options.method === 'POST' || options.method === 'PUT')) {
                    xhr.send(JSON.stringify(options.data));
                } else {
                    xhr.send();
                }
            }, this.settings.retryInterval);
        } else {
            console.log(`تم تجاوز الحد الأقصى لمحاولات إعادة الطلب (${this.settings.maxRetryAttempts}): ${requestKey}`);
            
            // إنشاء كائن خطأ
            const error = new Error(`فشل الطلب بعد ${this.settings.maxRetryAttempts} محاولات`);
            
            // عرض إشعار بالخطأ
            if (this.settings.showErrorNotifications) {
                this.showErrorNotification(error);
            }
            
            // رفض الوعد بالخطأ
            reject(error);
        }
    },
    
    /**
     * إنشاء مفتاح الطلب
     * @param {string} endpoint نقطة النهاية
     * @param {Object} options خيارات الطلب
     * @returns {string} مفتاح الطلب
     */
    createRequestKey: function(endpoint, options) {
        // إنشاء مفتاح بناءً على نقطة النهاية وطريقة الطلب والبيانات
        let key = `${options.method}:${endpoint}`;
        
        // إضافة البيانات إلى المفتاح إذا كانت موجودة
        if (options.data) {
            key += `:${JSON.stringify(options.data)}`;
        }
        
        return key;
    },
    
    /**
     * تخزين البيانات في ذاكرة التخزين المؤقت
     * @param {string} key مفتاح البيانات
     * @param {Object} data البيانات
     */
    cacheData: function(key, data) {
        this.state.cache[key] = {
            data: data,
            timestamp: Date.now()
        };
    },
    
    /**
     * الحصول على البيانات من ذاكرة التخزين المؤقت
     * @param {string} key مفتاح البيانات
     * @returns {Object|null} البيانات أو null إذا لم تكن موجودة أو منتهية الصلاحية
     */
    getCachedData: function(key) {
        // التحقق من وجود البيانات في ذاكرة التخزين المؤقت
        if (!this.state.cache[key]) {
            return null;
        }
        
        // التحقق من صلاحية البيانات
        const cacheEntry = this.state.cache[key];
        const now = Date.now();
        
        if (now - cacheEntry.timestamp > this.settings.cacheDuration) {
            // حذف البيانات منتهية الصلاحية
            delete this.state.cache[key];
            return null;
        }
        
        return cacheEntry.data;
    },
    
    /**
     * تنظيف ذاكرة التخزين المؤقت
     */
    cleanCache: function() {
        const now = Date.now();
        
        // حذف البيانات منتهية الصلاحية
        Object.keys(this.state.cache).forEach(key => {
            const cacheEntry = this.state.cache[key];
            
            if (now - cacheEntry.timestamp > this.settings.cacheDuration) {
                delete this.state.cache[key];
            }
        });
        
        console.log('تم تنظيف ذاكرة التخزين المؤقت');
    },
    
    /**
     * إظهار مؤشر التحميل
     * @param {HTMLElement} element العنصر
     */
    showLoadingIndicator: function(element) {
        // التحقق من وجود مؤشر تحميل للعنصر
        if (this.state.loadingIndicators[element.id]) {
            // إظهار مؤشر التحميل الموجود
            this.state.loadingIndicators[element.id].style.display = 'flex';
            return;
        }
        
        // إنشاء مؤشر التحميل
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'ajax-loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">جاري التحميل...</span>
            </div>
            <span class="loading-text ms-2">جاري التحميل...</span>
        `;
        
        // تعيين نمط مؤشر التحميل
        loadingIndicator.style.position = 'absolute';
        loadingIndicator.style.top = '0';
        loadingIndicator.style.left = '0';
        loadingIndicator.style.width = '100%';
        loadingIndicator.style.height = '100%';
        loadingIndicator.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        loadingIndicator.style.display = 'flex';
        loadingIndicator.style.justifyContent = 'center';
        loadingIndicator.style.alignItems = 'center';
        loadingIndicator.style.zIndex = '1000';
        
        // تعيين نمط العنصر
        element.style.position = 'relative';
        
        // إضافة مؤشر التحميل إلى العنصر
        element.appendChild(loadingIndicator);
        
        // تخزين مؤشر التحميل
        this.state.loadingIndicators[element.id] = loadingIndicator;
    },
    
    /**
     * إخفاء مؤشر التحميل
     * @param {HTMLElement} element العنصر
     */
    hideLoadingIndicator: function(element) {
        // التحقق من وجود مؤشر تحميل للعنصر
        if (this.state.loadingIndicators[element.id]) {
            // إخفاء مؤشر التحميل
            this.state.loadingIndicators[element.id].style.display = 'none';
        }
    },
    
    /**
     * عرض إشعار بالخطأ
     * @param {Error} error الخطأ
     */
    showErrorNotification: function(error) {
        // استخدام دالة عرض الإشعارات العامة إذا كانت موجودة
        if (typeof showNotification === 'function') {
            showNotification(error.message, 'danger');
            return;
        }
        
        // إنشاء إشعار مخصص إذا لم تكن دالة عرض الإشعارات العامة موجودة
        const notification = document.createElement('div');
        notification.className = 'alert alert-danger alert-dismissible fade show ajax-error-notification';
        notification.innerHTML = `
            <strong>خطأ:</strong> ${error.message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="إغلاق"></button>
        `;
        
        // تعيين نمط الإشعار
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '20px';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        
        // إضافة الإشعار إلى الصفحة
        document.body.appendChild(notification);
        
        // إزالة الإشعار بعد 5 ثوانٍ
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    },
    
    /**
     * الحصول على البيانات
     * @param {string} endpoint نقطة النهاية
     * @param {Object} params معلمات الطلب
     * @param {HTMLElement} targetElement العنصر المستهدف
     * @returns {Promise} وعد بالبيانات
     */
    getData: function(endpoint, params = {}, targetElement = null) {
        // إنشاء عنوان URL مع المعلمات
        let url = endpoint;
        
        // إضافة المعلمات إلى عنوان URL
        if (Object.keys(params).length > 0) {
            const queryParams = new URLSearchParams();
            
            Object.keys(params).forEach(key => {
                queryParams.append(key, params[key]);
            });
            
            url += `?${queryParams.toString()}`;
        }
        
        // إرسال طلب GET
        return this.sendRequest(url, {
            method: 'GET',
            targetElement: targetElement,
            showLoading: targetElement !== null
        });
    },
    
    /**
     * إرسال البيانات
     * @param {string} endpoint نقطة النهاية
     * @param {Object} data البيانات
     * @param {HTMLElement} targetElement العنصر المستهدف
     * @returns {Promise} وعد بالاستجابة
     */
    postData: function(endpoint, data = {}, targetElement = null) {
        // إرسال طلب POST
        return this.sendRequest(endpoint, {
            method: 'POST',
            data: data,
            targetElement: targetElement,
            showLoading: targetElement !== null,
            useCache: false
        });
    },
    
    /**
     * تحديث البيانات
     * @param {string} endpoint نقطة النهاية
     * @param {Object} data البيانات
     * @param {HTMLElement} targetElement العنصر المستهدف
     * @returns {Promise} وعد بالاستجابة
     */
    updateData: function(endpoint, data = {}, targetElement = null) {
        // إرسال طلب PUT
        return this.sendRequest(endpoint, {
            method: 'PUT',
            data: data,
            targetElement: targetElement,
            showLoading: targetElement !== null,
            useCache: false
        });
    },
    
    /**
     * حذف البيانات
     * @param {string} endpoint نقطة النهاية
     * @param {HTMLElement} targetElement العنصر المستهدف
     * @returns {Promise} وعد بالاستجابة
     */
    deleteData: function(endpoint, targetElement = null) {
        // إرسال طلب DELETE
        return this.sendRequest(endpoint, {
            method: 'DELETE',
            targetElement: targetElement,
            showLoading: targetElement !== null,
            useCache: false
        });
    },
    
    /**
     * تحديث عنصر بالبيانات
     * @param {HTMLElement} element العنصر
     * @param {string} endpoint نقطة النهاية
     * @param {Object} params معلمات الطلب
     * @param {Function} renderFunction دالة عرض البيانات
     */
    updateElement: function(element, endpoint, params = {}, renderFunction = null) {
        // إظهار مؤشر التحميل
        this.showLoadingIndicator(element);
        
        // الحصول على البيانات
        this.getData(endpoint, params, element)
            .then(data => {
                // إخفاء مؤشر التحميل
                this.hideLoadingIndicator(element);
                
                // عرض البيانات
                if (typeof renderFunction === 'function') {
                    renderFunction(element, data);
                } else {
                    // عرض البيانات بشكل افتراضي
                    element.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
                }
                
                // إضافة تأثير التحديث
                element.classList.add('ajax-updated');
                
                // إزالة تأثير التحديث بعد انتهاء التأثير
                setTimeout(() => {
                    element.classList.remove('ajax-updated');
                }, 1000);
            })
            .catch(error => {
                // إخفاء مؤشر التحميل
                this.hideLoadingIndicator(element);
                
                // عرض رسالة الخطأ
                element.innerHTML = `
                    <div class="alert alert-danger">
                        <strong>خطأ:</strong> ${error.message}
                    </div>
                `;
            });
    },
    
    /**
     * تحديث نموذج بالبيانات
     * @param {HTMLFormElement} form النموذج
     * @param {string} endpoint نقطة النهاية
     * @param {Object} params معلمات الطلب
     */
    updateForm: function(form, endpoint, params = {}) {
        // إظهار مؤشر التحميل
        this.showLoadingIndicator(form);
        
        // الحصول على البيانات
        this.getData(endpoint, params, form)
            .then(data => {
                // إخفاء مؤشر التحميل
                this.hideLoadingIndicator(form);
                
                // تعبئة النموذج بالبيانات
                this.fillFormWithData(form, data);
                
                // إضافة تأثير التحديث
                form.classList.add('ajax-updated');
                
                // إزالة تأثير التحديث بعد انتهاء التأثير
                setTimeout(() => {
                    form.classList.remove('ajax-updated');
                }, 1000);
            })
            .catch(error => {
                // إخفاء مؤشر التحميل
                this.hideLoadingIndicator(form);
                
                // عرض رسالة الخطأ
                const errorMessage = document.createElement('div');
                errorMessage.className = 'alert alert-danger';
                errorMessage.innerHTML = `<strong>خطأ:</strong> ${error.message}`;
                
                form.prepend(errorMessage);
                
                // إزالة رسالة الخطأ بعد 5 ثوانٍ
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            });
    },
    
    /**
     * تعبئة النموذج بالبيانات
     * @param {HTMLFormElement} form النموذج
     * @param {Object} data البيانات
     */
    fillFormWithData: function(form, data) {
        // تعبئة حقول النموذج بالبيانات
        Object.keys(data).forEach(key => {
            const input = form.elements[key];
            
            if (input) {
                // تعيين قيمة الحقل بناءً على نوعه
                switch (input.type) {
                    case 'checkbox':
                        input.checked = Boolean(data[key]);
                        break;
                    case 'radio':
                        const radioButtons = form.querySelectorAll(`input[name="${key}"]`);
                        radioButtons.forEach(radio => {
                            radio.checked = radio.value === String(data[key]);
                        });
                        break;
                    case 'select-one':
                    case 'select-multiple':
                        const options = input.options;
                        for (let i = 0; i < options.length; i++) {
                            if (Array.isArray(data[key])) {
                                options[i].selected = data[key].includes(options[i].value);
                            } else {
                                options[i].selected = options[i].value === String(data[key]);
                            }
                        }
                        break;
                    default:
                        input.value = data[key];
                        break;
                }
                
                // تشغيل حدث تغيير القيمة
                const event = new Event('change', { bubbles: true });
                input.dispatchEvent(event);
            }
        });
    },
    
    /**
     * إرسال نموذج باستخدام AJAX
     * @param {HTMLFormElement} form النموذج
     * @param {string} endpoint نقطة النهاية
     * @param {Function} successCallback دالة استدعاء النجاح
     * @param {Function} errorCallback دالة استدعاء الخطأ
     */
    submitForm: function(form, endpoint, successCallback = null, errorCallback = null) {
        // منع السلوك الافتراضي للنموذج
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // إظهار مؤشر التحميل
            this.showLoadingIndicator(form);
            
            // جمع بيانات النموذج
            const formData = new FormData(form);
            const data = {};
            
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // تحديد طريقة الطلب
            const method = form.getAttribute('data-method') || form.method || 'POST';
            
            // إرسال الطلب
            this.sendRequest(endpoint, {
                method: method,
                data: data,
                targetElement: form,
                showLoading: true,
                useCache: false
            })
                .then(response => {
                    // إخفاء مؤشر التحميل
                    this.hideLoadingIndicator(form);
                    
                    // استدعاء دالة النجاح
                    if (typeof successCallback === 'function') {
                        successCallback(response);
                    } else {
                        // عرض رسالة النجاح الافتراضية
                        const successMessage = document.createElement('div');
                        successMessage.className = 'alert alert-success';
                        successMessage.innerHTML = 'تم إرسال النموذج بنجاح';
                        
                        form.prepend(successMessage);
                        
                        // إزالة رسالة النجاح بعد 3 ثوانٍ
                        setTimeout(() => {
                            successMessage.remove();
                        }, 3000);
                        
                        // إعادة تعيين النموذج
                        form.reset();
                    }
                })
                .catch(error => {
                    // إخفاء مؤشر التحميل
                    this.hideLoadingIndicator(form);
                    
                    // استدعاء دالة الخطأ
                    if (typeof errorCallback === 'function') {
                        errorCallback(error);
                    } else {
                        // عرض رسالة الخطأ الافتراضية
                        const errorMessage = document.createElement('div');
                        errorMessage.className = 'alert alert-danger';
                        errorMessage.innerHTML = `<strong>خطأ:</strong> ${error.message}`;
                        
                        form.prepend(errorMessage);
                        
                        // إزالة رسالة الخطأ بعد 5 ثوانٍ
                        setTimeout(() => {
                            errorMessage.remove();
                        }, 5000);
                    }
                });
        });
    },
    
    /**
     * تحديث عناصر متعددة بالبيانات
     * @param {string} selector محدد CSS للعناصر
     * @param {string} endpoint نقطة النهاية
     * @param {Object} params معلمات الطلب
     * @param {Function} renderFunction دالة عرض البيانات
     */
    updateElements: function(selector, endpoint, params = {}, renderFunction = null) {
        // الحصول على العناصر
        const elements = document.querySelectorAll(selector);
        
        // تحديث كل عنصر
        elements.forEach(element => {
            this.updateElement(element, endpoint, params, renderFunction);
        });
    },
    
    /**
     * تحديث عناصر بشكل دوري
     * @param {string} selector محدد CSS للعناصر
     * @param {string} endpoint نقطة النهاية
     * @param {Object} params معلمات الطلب
     * @param {Function} renderFunction دالة عرض البيانات
     * @param {number} interval الفاصل الزمني بالمللي ثانية
     * @returns {number} معرف المؤقت
     */
    updateElementsPeriodically: function(selector, endpoint, params = {}, renderFunction = null, interval = 60000) {
        // تحديث العناصر مرة واحدة
        this.updateElements(selector, endpoint, params, renderFunction);
        
        // تحديث العناصر بشكل دوري
        const timerId = setInterval(() => {
            this.updateElements(selector, endpoint, params, renderFunction);
        }, interval);
        
        return timerId;
    },
    
    /**
     * إيقاف التحديث الدوري
     * @param {number} timerId معرف المؤقت
     */
    stopPeriodicUpdates: function(timerId) {
        clearInterval(timerId);
    },
    
    /**
     * تحديث عنصر عند النقر على زر
     * @param {string} buttonSelector محدد CSS للزر
     * @param {string} targetSelector محدد CSS للعنصر المستهدف
     * @param {string} endpoint نقطة النهاية
     * @param {Object} params معلمات الطلب
     * @param {Function} renderFunction دالة عرض البيانات
     */
    updateElementOnButtonClick: function(buttonSelector, targetSelector, endpoint, params = {}, renderFunction = null) {
        // الحصول على الزر
        const button = document.querySelector(buttonSelector);
        
        if (!button) {
            console.error(`لم يتم العثور على الزر: ${buttonSelector}`);
            return;
        }
        
        // الحصول على العنصر المستهدف
        const targetElement = document.querySelector(targetSelector);
        
        if (!targetElement) {
            console.error(`لم يتم العثور على العنصر المستهدف: ${targetSelector}`);
            return;
        }
        
        // إضافة مستمع حدث النقر
        button.addEventListener('click', (event) => {
            event.preventDefault();
            
            // تحديث العنصر
            this.updateElement(targetElement, endpoint, params, renderFunction);
        });
    },
    
    /**
     * تحديث عنصر عند تغيير قيمة حقل
     * @param {string} inputSelector محدد CSS للحقل
     * @param {string} targetSelector محدد CSS للعنصر المستهدف
     * @param {string} endpoint نقطة النهاية
     * @param {Function} paramsFunction دالة لإنشاء معلمات الطلب
     * @param {Function} renderFunction دالة عرض البيانات
     * @param {number} debounceTime وقت التأخير بالمللي ثانية
     */
    updateElementOnInputChange: function(inputSelector, targetSelector, endpoint, paramsFunction = null, renderFunction = null, debounceTime = 500) {
        // الحصول على الحقل
        const input = document.querySelector(inputSelector);
        
        if (!input) {
            console.error(`لم يتم العثور على الحقل: ${inputSelector}`);
            return;
        }
        
        // الحصول على العنصر المستهدف
        const targetElement = document.querySelector(targetSelector);
        
        if (!targetElement) {
            console.error(`لم يتم العثور على العنصر المستهدف: ${targetSelector}`);
            return;
        }
        
        // متغير لتخزين مؤقت التأخير
        let debounceTimer;
        
        // إضافة مستمع حدث التغيير
        input.addEventListener('input', () => {
            // إلغاء المؤقت السابق
            clearTimeout(debounceTimer);
            
            // إنشاء مؤقت جديد
            debounceTimer = setTimeout(() => {
                // إنشاء معلمات الطلب
                let params = {};
                
                if (typeof paramsFunction === 'function') {
                    params = paramsFunction(input.value);
                } else {
                    params = { query: input.value };
                }
                
                // تحديث العنصر
                this.updateElement(targetElement, endpoint, params, renderFunction);
            }, debounceTime);
        });
    },
    
    /**
     * تحديث عنصر عند تغيير قيمة قائمة منسدلة
     * @param {string} selectSelector محدد CSS للقائمة المنسدلة
     * @param {string} targetSelector محدد CSS للعنصر المستهدف
     * @param {string} endpoint نقطة النهاية
     * @param {Function} paramsFunction دالة لإنشاء معلمات الطلب
     * @param {Function} renderFunction دالة عرض البيانات
     */
    updateElementOnSelectChange: function(selectSelector, targetSelector, endpoint, paramsFunction = null, renderFunction = null) {
        // الحصول على القائمة المنسدلة
        const select = document.querySelector(selectSelector);
        
        if (!select) {
            console.error(`لم يتم العثور على القائمة المنسدلة: ${selectSelector}`);
            return;
        }
        
        // الحصول على العنصر المستهدف
        const targetElement = document.querySelector(targetSelector);
        
        if (!targetElement) {
            console.error(`لم يتم العثور على العنصر المستهدف: ${targetSelector}`);
            return;
        }
        
        // إضافة مستمع حدث التغيير
        select.addEventListener('change', () => {
            // إنشاء معلمات الطلب
            let params = {};
            
            if (typeof paramsFunction === 'function') {
                params = paramsFunction(select.value);
            } else {
                params = { filter: select.value };
            }
            
            // تحديث العنصر
            this.updateElement(targetElement, endpoint, params, renderFunction);
        });
    },
    
    /**
     * تحديث عنصر عند تقديم نموذج
     * @param {string} formSelector محدد CSS للنموذج
     * @param {string} targetSelector محدد CSS للعنصر المستهدف
     * @param {string} endpoint نقطة النهاية
     * @param {Function} renderFunction دالة عرض البيانات
     */
    updateElementOnFormSubmit: function(formSelector, targetSelector, endpoint, renderFunction = null) {
        // الحصول على النموذج
        const form = document.querySelector(formSelector);
        
        if (!form) {
            console.error(`لم يتم العثور على النموذج: ${formSelector}`);
            return;
        }
        
        // الحصول على العنصر المستهدف
        const targetElement = document.querySelector(targetSelector);
        
        if (!targetElement) {
            console.error(`لم يتم العثور على العنصر المستهدف: ${targetSelector}`);
            return;
        }
        
        // إضافة مستمع حدث التقديم
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // جمع بيانات النموذج
            const formData = new FormData(form);
            const data = {};
            
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // إظهار مؤشر التحميل
            this.showLoadingIndicator(targetElement);
            
            // إرسال الطلب
            this.sendRequest(endpoint, {
                method: 'POST',
                data: data,
                targetElement: targetElement,
                showLoading: true,
                useCache: false
            })
                .then(response => {
                    // إخفاء مؤشر التحميل
                    this.hideLoadingIndicator(targetElement);
                    
                    // عرض البيانات
                    if (typeof renderFunction === 'function') {
                        renderFunction(targetElement, response);
                    } else {
                        // عرض البيانات بشكل افتراضي
                        targetElement.innerHTML = `<pre>${JSON.stringify(response, null, 2)}</pre>`;
                    }
                    
                    // إضافة تأثير التحديث
                    targetElement.classList.add('ajax-updated');
                    
                    // إزالة تأثير التحديث بعد انتهاء التأثير
                    setTimeout(() => {
                        targetElement.classList.remove('ajax-updated');
                    }, 1000);
                    
                    // إعادة تعيين النموذج
                    form.reset();
                })
                .catch(error => {
                    // إخفاء مؤشر التحميل
                    this.hideLoadingIndicator(targetElement);
                    
                    // عرض رسالة الخطأ
                    targetElement.innerHTML = `
                        <div class="alert alert-danger">
                            <strong>خطأ:</strong> ${error.message}
                        </div>
                    `;
                });
        });
    },
    
    /**
     * تحديث عنصر عند تمرير الماوس فوقه
     * @param {string} hoverSelector محدد CSS للعنصر الذي يتم تمرير الماوس فوقه
     * @param {string} targetSelector محدد CSS للعنصر المستهدف
     * @param {string} endpoint نقطة النهاية
     * @param {Function} paramsFunction دالة لإنشاء معلمات الطلب
     * @param {Function} renderFunction دالة عرض البيانات
     */
    updateElementOnHover: function(hoverSelector, targetSelector, endpoint, paramsFunction = null, renderFunction = null) {
        // الحصول على العنصر الذي يتم تمرير الماوس فوقه
        const hoverElement = document.querySelector(hoverSelector);
        
        if (!hoverElement) {
            console.error(`لم يتم العثور على العنصر: ${hoverSelector}`);
            return;
        }
        
        // الحصول على العنصر المستهدف
        const targetElement = document.querySelector(targetSelector);
        
        if (!targetElement) {
            console.error(`لم يتم العثور على العنصر المستهدف: ${targetSelector}`);
            return;
        }
        
        // متغير لتخزين مؤقت التأخير
        let hoverTimer;
        
        // إضافة مستمع حدث تمرير الماوس فوق العنصر
        hoverElement.addEventListener('mouseenter', () => {
            // إنشاء مؤقت للتأخير
            hoverTimer = setTimeout(() => {
                // إنشاء معلمات الطلب
                let params = {};
                
                if (typeof paramsFunction === 'function') {
                    params = paramsFunction(hoverElement);
                } else {
                    params = { id: hoverElement.getAttribute('data-id') };
                }
                
                // تحديث العنصر
                this.updateElement(targetElement, endpoint, params, renderFunction);
            }, 500);
        });
        
        // إضافة مستمع حدث مغادرة الماوس للعنصر
        hoverElement.addEventListener('mouseleave', () => {
            // إلغاء المؤقت
            clearTimeout(hoverTimer);
        });
    }
};

// إضافة أنماط CSS لتأثيرات التحديث
const style = document.createElement('style');
style.textContent = `
    .ajax-loading-indicator {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .ajax-updated {
        animation: highlight-update 1s ease-in-out;
    }
    
    @keyframes highlight-update {
        0% {
            background-color: rgba(0, 123, 255, 0.1);
        }
        100% {
            background-color: transparent;
        }
    }
    
    .ajax-error-notification {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 9999;
        min-width: 300px;
    }
`;

document.head.appendChild(style);

// تهيئة نظام تحديث البيانات باستخدام AJAX عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    AjaxDataManager.init();
    
    console.log('تم تهيئة نظام تحديث البيانات باستخدام AJAX');
});

// تصدير كائن AjaxDataManager للاستخدام في ملفات أخرى
window.AjaxDataManager = AjaxDataManager;
