/**
 * دعم وضع عدم الاتصال
 * يوفر دعماً للعمل دون اتصال بالإنترنت
 */

// كائن لإدارة وضع عدم الاتصال
const OfflineSupport = {
    // إعدادات افتراضية
    settings: {
        // ما إذا كان يجب تفعيل دعم وضع عدم الاتصال تلقائياً
        autoEnable: true,
        
        // ما إذا كان يجب تسجيل Service Worker
        registerServiceWorker: true,
        
        // مسار ملف Service Worker
        serviceWorkerPath: '/service-worker.js',
        
        // ما إذا كان يجب تخزين البيانات محلياً
        storeDataLocally: true,
        
        // اسم قاعدة البيانات المحلية
        databaseName: 'offlineData',
        
        // إصدار قاعدة البيانات المحلية
        databaseVersion: 1,
        
        // مخازن البيانات في قاعدة البيانات المحلية
        dataStores: [
            { name: 'events', keyPath: 'id' },
            { name: 'invitations', keyPath: 'id' },
            { name: 'templates', keyPath: 'id' },
            { name: 'guests', keyPath: 'id' },
            { name: 'settings', keyPath: 'id' }
        ],
        
        // ما إذا كان يجب عرض إشعارات حالة الاتصال
        showConnectionNotifications: true,
        
        // ما إذا كان يجب مزامنة البيانات تلقائياً عند استعادة الاتصال
        autoSyncOnReconnect: true,
        
        // الموارد التي يجب تخزينها مؤقتاً
        cachableResources: [
            '/',
            '/index.html',
            '/login.html',
            '/register.html',
            '/assets/css/unified-design.css',
            '/assets/css/rtl-fixes.css',
            '/assets/css/hover-effects.css',
            '/assets/js/shared.js',
            '/assets/js/user-preferences.js',
            '/assets/js/real-time-updates.js',
            '/assets/js/ajax-data-manager.js',
            '/assets/js/mobile-compatibility.js',
            '/assets/js/accessibility.js',
            '/assets/js/security.js',
            '/assets/js/offline-support.js',
            '/assets/js/integration.js',
            '/assets/images/logo.png'
        ]
    },
    
    // حالة النظام
    state: {
        // ما إذا كان نظام دعم وضع عدم الاتصال مفعلاً
        enabled: false,
        
        // ما إذا كان Service Worker مسجلاً
        serviceWorkerRegistered: false,
        
        // تسجيل Service Worker
        serviceWorkerRegistration: null,
        
        // ما إذا كان التخزين المحلي مفعلاً
        localStorageEnabled: false,
        
        // قاعدة البيانات المحلية
        database: null,
        
        // ما إذا كان المستخدم متصلاً بالإنترنت
        isOnline: navigator.onLine,
        
        // قائمة العمليات المعلقة
        pendingOperations: [],
        
        // ما إذا كانت المزامنة جارية
        isSyncing: false,
        
        // العناصر التي تم تحسينها
        enhancedElements: {}
    },
    
    /**
     * تهيئة نظام دعم وضع عدم الاتصال
     * @param {Object} options خيارات التهيئة
     */
    init: function(options = {}) {
        // دمج الخيارات مع الإعدادات الافتراضية
        this.settings = { ...this.settings, ...options };
        
        // تفعيل نظام دعم وضع عدم الاتصال إذا كان مطلوباً
        if (this.settings.autoEnable) {
            this.enable();
        }
        
        console.log('تم تهيئة نظام دعم وضع عدم الاتصال');
    },
    
    /**
     * تفعيل نظام دعم وضع عدم الاتصال
     */
    enable: function() {
        // تفعيل نظام دعم وضع عدم الاتصال
        this.state.enabled = true;
        
        // تسجيل Service Worker إذا كان مطلوباً
        if (this.settings.registerServiceWorker) {
            this.registerServiceWorker();
        }
        
        // تفعيل التخزين المحلي إذا كان مطلوباً
        if (this.settings.storeDataLocally) {
            this.enableLocalStorage();
        }
        
        // إضافة مستمعي الأحداث
        this.setupEventListeners();
        
        // عرض إشعار حالة الاتصال
        if (this.settings.showConnectionNotifications) {
            this.showConnectionStatus();
        }
        
        console.log('تم تفعيل نظام دعم وضع عدم الاتصال');
    },
    
    /**
     * تعطيل نظام دعم وضع عدم الاتصال
     */
    disable: function() {
        // تعطيل نظام دعم وضع عدم الاتصال
        this.state.enabled = false;
        
        // إلغاء تسجيل Service Worker
        if (this.state.serviceWorkerRegistered) {
            this.unregisterServiceWorker();
        }
        
        // تعطيل التخزين المحلي
        if (this.state.localStorageEnabled) {
            this.disableLocalStorage();
        }
        
        // إزالة مستمعي الأحداث
        this.removeEventListeners();
        
        // إزالة إشعار حالة الاتصال
        if (this.settings.showConnectionNotifications) {
            this.removeConnectionStatus();
        }
        
        console.log('تم تعطيل نظام دعم وضع عدم الاتصال');
    },
    
    /**
     * تسجيل Service Worker
     */
    registerServiceWorker: function() {
        // التحقق من دعم Service Worker
        if ('serviceWorker' in navigator) {
            // تسجيل Service Worker
            navigator.serviceWorker.register(this.settings.serviceWorkerPath)
                .then(registration => {
                    // تخزين تسجيل Service Worker
                    this.state.serviceWorkerRegistration = registration;
                    this.state.serviceWorkerRegistered = true;
                    
                    console.log('تم تسجيل Service Worker بنجاح');
                    
                    // إضافة مستمع حدث تحديث Service Worker
                    registration.addEventListener('updatefound', () => {
                        // الحصول على Service Worker الجديد
                        const newWorker = registration.installing;
                        
                        // إضافة مستمع حدث تغيير حالة Service Worker
                        newWorker.addEventListener('statechange', () => {
                            console.log(`حالة Service Worker الجديد: ${newWorker.state}`);
                        });
                    });
                })
                .catch(error => {
                    console.error('فشل تسجيل Service Worker:', error);
                });
        } else {
            console.warn('المتصفح لا يدعم Service Worker');
        }
    },
    
    /**
     * إلغاء تسجيل Service Worker
     */
    unregisterServiceWorker: function() {
        // التحقق من وجود تسجيل Service Worker
        if (this.state.serviceWorkerRegistration) {
            // إلغاء تسجيل Service Worker
            this.state.serviceWorkerRegistration.unregister()
                .then(success => {
                    if (success) {
                        console.log('تم إلغاء تسجيل Service Worker بنجاح');
                    } else {
                        console.warn('فشل إلغاء تسجيل Service Worker');
                    }
                    
                    // إعادة تعيين حالة تسجيل Service Worker
                    this.state.serviceWorkerRegistration = null;
                    this.state.serviceWorkerRegistered = false;
                })
                .catch(error => {
                    console.error('خطأ في إلغاء تسجيل Service Worker:', error);
                });
        }
    },
    
    /**
     * تفعيل التخزين المحلي
     */
    enableLocalStorage: function() {
        // التحقق من دعم IndexedDB
        if ('indexedDB' in window) {
            // فتح قاعدة البيانات المحلية
            const request = indexedDB.open(this.settings.databaseName, this.settings.databaseVersion);
            
            // مستمع حدث ترقية قاعدة البيانات
            request.onupgradeneeded = event => {
                // الحصول على قاعدة البيانات
                const db = event.target.result;
                
                // إنشاء مخازن البيانات
                this.settings.dataStores.forEach(store => {
                    // التحقق من وجود مخزن البيانات
                    if (!db.objectStoreNames.contains(store.name)) {
                        // إنشاء مخزن البيانات
                        db.createObjectStore(store.name, { keyPath: store.keyPath });
                        
                        console.log(`تم إنشاء مخزن البيانات: ${store.name}`);
                    }
                });
            };
            
            // مستمع حدث نجاح فتح قاعدة البيانات
            request.onsuccess = event => {
                // تخزين قاعدة البيانات
                this.state.database = event.target.result;
                this.state.localStorageEnabled = true;
                
                console.log('تم فتح قاعدة البيانات المحلية بنجاح');
                
                // مزامنة البيانات إذا كان المستخدم متصلاً بالإنترنت
                if (this.state.isOnline && this.settings.autoSyncOnReconnect) {
                    this.syncData();
                }
            };
            
            // مستمع حدث فشل فتح قاعدة البيانات
            request.onerror = event => {
                console.error('فشل فتح قاعدة البيانات المحلية:', event.target.error);
            };
        } else {
            console.warn('المتصفح لا يدعم IndexedDB');
        }
    },
    
    /**
     * تعطيل التخزين المحلي
     */
    disableLocalStorage: function() {
        // التحقق من وجود قاعدة البيانات
        if (this.state.database) {
            // إغلاق قاعدة البيانات
            this.state.database.close();
            
            // إعادة تعيين حالة قاعدة البيانات
            this.state.database = null;
            this.state.localStorageEnabled = false;
            
            console.log('تم إغلاق قاعدة البيانات المحلية');
        }
    },
    
    /**
     * إضافة مستمعي الأحداث
     */
    setupEventListeners: function() {
        // إضافة مستمع حدث اتصال
        window.addEventListener('online', this.handleOnline.bind(this));
        
        // إضافة مستمع حدث انقطاع الاتصال
        window.addEventListener('offline', this.handleOffline.bind(this));
        
        // إضافة مستمع حدث إرسال النماذج
        document.addEventListener('submit', this.handleFormSubmit.bind(this), true);
        
        // إضافة مستمع حدث النقر على الروابط
        document.addEventListener('click', this.handleLinkClick.bind(this), true);
        
        // تخزين مستمعي الأحداث في حالة النظام
        this.state.enhancedElements.eventListeners = [
            { element: window, event: 'online', handler: this.handleOnline },
            { element: window, event: 'offline', handler: this.handleOffline },
            { element: document, event: 'submit', handler: this.handleFormSubmit },
            { element: document, event: 'click', handler: this.handleLinkClick }
        ];
    },
    
    /**
     * إزالة مستمعي الأحداث
     */
    removeEventListeners: function() {
        // إزالة مستمعي الأحداث
        if (this.state.enhancedElements.eventListeners) {
            this.state.enhancedElements.eventListeners.forEach(listener => {
                listener.element.removeEventListener(listener.event, listener.handler);
            });
            
            this.state.enhancedElements.eventListeners = [];
        }
    },
    
    /**
     * معالجة حدث اتصال
     */
    handleOnline: function() {
        // تحديث حالة الاتصال
        this.state.isOnline = true;
        
        // عرض إشعار حالة الاتصال
        if (this.settings.showConnectionNotifications) {
            this.showConnectionStatus();
        }
        
        // مزامنة البيانات إذا كان مطلوباً
        if (this.settings.autoSyncOnReconnect) {
            this.syncData();
        }
        
        console.log('تم استعادة الاتصال بالإنترنت');
    },
    
    /**
     * معالجة حدث انقطاع الاتصال
     */
    handleOffline: function() {
        // تحديث حالة الاتصال
        this.state.isOnline = false;
        
        // عرض إشعار حالة الاتصال
        if (this.settings.showConnectionNotifications) {
            this.showConnectionStatus();
        }
        
        console.log('تم فقدان الاتصال بالإنترنت');
    },
    
    /**
     * معالجة حدث إرسال النماذج
     * @param {Event} event حدث إرسال النماذج
     */
    handleFormSubmit: function(event) {
        // التحقق من أن نظام دعم وضع عدم الاتصال مفعل
        if (!this.state.enabled) {
            return;
        }
        
        // التحقق من حالة الاتصال
        if (!this.state.isOnline) {
            // منع إرسال النموذج
            event.preventDefault();
            
            // الحصول على النموذج
            const form = event.target;
            
            // تخزين بيانات النموذج
            const formData = new FormData(form);
            const formDataObject = {};
            
            // تحويل بيانات النموذج إلى كائن
            for (const [key, value] of formData.entries()) {
                formDataObject[key] = value;
            }
            
            // إضافة العملية إلى قائمة العمليات المعلقة
            this.addPendingOperation({
                type: 'form',
                url: form.action,
                method: form.method,
                data: formDataObject
            });
            
            // عرض إشعار للمستخدم
            this.showNotification('تم تخزين البيانات محلياً وسيتم إرسالها عند استعادة الاتصال');
            
            console.log('تم تخزين بيانات النموذج محلياً');
        }
    },
    
    /**
     * معالجة حدث النقر على الروابط
     * @param {Event} event حدث النقر
     */
    handleLinkClick: function(event) {
        // التحقق من أن نظام دعم وضع عدم الاتصال مفعل
        if (!this.state.enabled) {
            return;
        }
        
        // التحقق من أن العنصر المنقور عليه هو رابط
        const link = event.target.closest('a');
        
        if (link) {
            // التحقق من حالة الاتصال
            if (!this.state.isOnline) {
                // التحقق من أن الرابط ليس رابطاً داخلياً
                const href = link.getAttribute('href');
                
                if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                    // منع النقر على الرابط
                    event.preventDefault();
                    
                    // عرض إشعار للمستخدم
                    this.showNotification('لا يمكن الوصول إلى هذا الرابط في وضع عدم الاتصال');
                    
                    console.log('تم منع النقر على الرابط في وضع عدم الاتصال');
                }
            }
        }
    },
    
    /**
     * عرض إشعار حالة الاتصال
     */
    showConnectionStatus: function() {
        // إزالة إشعار حالة الاتصال الحالي
        this.removeConnectionStatus();
        
        // إنشاء إشعار حالة الاتصال
        const statusBar = document.createElement('div');
        statusBar.id = 'connection-status';
        statusBar.className = this.state.isOnline ? 'online' : 'offline';
        
        // تعيين نمط إشعار حالة الاتصال
        statusBar.style.position = 'fixed';
        statusBar.style.top = '0';
        statusBar.style.left = '0';
        statusBar.style.right = '0';
        statusBar.style.padding = '5px';
        statusBar.style.textAlign = 'center';
        statusBar.style.fontWeight = 'bold';
        statusBar.style.zIndex = '9999';
        
        if (this.state.isOnline) {
            statusBar.style.backgroundColor = '#4CAF50';
            statusBar.style.color = '#fff';
            statusBar.textContent = 'متصل بالإنترنت';
            
            // إخفاء إشعار حالة الاتصال بعد 3 ثوانٍ
            setTimeout(() => {
                if (statusBar.parentNode) {
                    statusBar.remove();
                }
            }, 3000);
        } else {
            statusBar.style.backgroundColor = '#F44336';
            statusBar.style.color = '#fff';
            statusBar.textContent = 'غير متصل بالإنترنت - وضع عدم الاتصال مفعل';
        }
        
        // إضافة إشعار حالة الاتصال إلى الصفحة
        document.body.appendChild(statusBar);
        
        // تخزين إشعار حالة الاتصال في حالة النظام
        this.state.enhancedElements.connectionStatus = statusBar;
    },
    
    /**
     * إزالة إشعار حالة الاتصال
     */
    removeConnectionStatus: function() {
        // البحث عن إشعار حالة الاتصال
        const statusBar = document.getElementById('connection-status');
        
        // إزالة إشعار حالة الاتصال
        if (statusBar) {
            statusBar.remove();
        }
        
        // إعادة تعيين إشعار حالة الاتصال في حالة النظام
        this.state.enhancedElements.connectionStatus = null;
    },
    
    /**
     * عرض إشعار للمستخدم
     * @param {string} message رسالة الإشعار
     */
    showNotification: function(message) {
        // إنشاء إشعار
        const notification = document.createElement('div');
        notification.className = 'offline-notification';
        
        // تعيين نمط الإشعار
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.backgroundColor = '#333';
        notification.style.color = '#fff';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'opacity 0.3s, transform 0.3s';
        
        // تعيين رسالة الإشعار
        notification.textContent = message;
        
        // إضافة الإشعار إلى الصفحة
        document.body.appendChild(notification);
        
        // إظهار الإشعار
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // إخفاء الإشعار بعد 5 ثوانٍ
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            // إزالة الإشعار بعد انتهاء التأثير
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    },
    
    /**
     * إضافة عملية معلقة
     * @param {Object} operation العملية المعلقة
     */
    addPendingOperation: function(operation) {
        // إضافة العملية إلى قائمة العمليات المعلقة
        this.state.pendingOperations.push({
            ...operation,
            timestamp: Date.now()
        });
        
        // تخزين العمليات المعلقة في التخزين المحلي
        this.storePendingOperations();
        
        console.log('تم إضافة عملية معلقة:', operation);
    },
    
    /**
     * تخزين العمليات المعلقة
     */
    storePendingOperations: function() {
        // التحقق من دعم localStorage
        if ('localStorage' in window) {
            // تخزين العمليات المعلقة
            localStorage.setItem('pendingOperations', JSON.stringify(this.state.pendingOperations));
        }
    },
    
    /**
     * استرجاع العمليات المعلقة
     */
    retrievePendingOperations: function() {
        // التحقق من دعم localStorage
        if ('localStorage' in window) {
            // استرجاع العمليات المعلقة
            const pendingOperations = localStorage.getItem('pendingOperations');
            
            if (pendingOperations) {
                this.state.pendingOperations = JSON.parse(pendingOperations);
            }
        }
    },
    
    /**
     * مزامنة البيانات
     */
    syncData: function() {
        // التحقق من أن نظام دعم وضع عدم الاتصال مفعل
        if (!this.state.enabled || !this.state.isOnline || this.state.isSyncing) {
            return;
        }
        
        // تعيين حالة المزامنة
        this.state.isSyncing = true;
        
        // استرجاع العمليات المعلقة
        this.retrievePendingOperations();
        
        // التحقق من وجود عمليات معلقة
        if (this.state.pendingOperations.length === 0) {
            // إعادة تعيين حالة المزامنة
            this.state.isSyncing = false;
            
            console.log('لا توجد عمليات معلقة للمزامنة');
            return;
        }
        
        // عرض إشعار للمستخدم
        this.showNotification(`جاري مزامنة ${this.state.pendingOperations.length} عملية معلقة...`);
        
        // مزامنة العمليات المعلقة
        const syncPromises = this.state.pendingOperations.map(operation => {
            return this.syncOperation(operation);
        });
        
        // انتظار انتهاء جميع عمليات المزامنة
        Promise.all(syncPromises)
            .then(results => {
                // عدد العمليات الناجحة
                const successCount = results.filter(result => result).length;
                
                // عرض إشعار للمستخدم
                this.showNotification(`تم مزامنة ${successCount} من ${this.state.pendingOperations.length} عملية معلقة`);
                
                // إعادة تعيين العمليات المعلقة
                this.state.pendingOperations = [];
                this.storePendingOperations();
                
                // إعادة تعيين حالة المزامنة
                this.state.isSyncing = false;
                
                console.log(`تم مزامنة ${successCount} من ${results.length} عملية معلقة`);
            })
            .catch(error => {
                console.error('خطأ في مزامنة البيانات:', error);
                
                // عرض إشعار للمستخدم
                this.showNotification('حدث خطأ أثناء مزامنة البيانات');
                
                // إعادة تعيين حالة المزامنة
                this.state.isSyncing = false;
            });
    },
    
    /**
     * مزامنة عملية
     * @param {Object} operation العملية
     * @returns {Promise} وعد بنتيجة المزامنة
     */
    syncOperation: function(operation) {
        // التحقق من نوع العملية
        switch (operation.type) {
            case 'form':
                return this.syncFormOperation(operation);
            
            case 'api':
                return this.syncApiOperation(operation);
            
            default:
                console.warn(`نوع العملية غير معروف: ${operation.type}`);
                return Promise.resolve(false);
        }
    },
    
    /**
     * مزامنة عملية نموذج
     * @param {Object} operation عملية النموذج
     * @returns {Promise} وعد بنتيجة المزامنة
     */
    syncFormOperation: function(operation) {
        return new Promise((resolve, reject) => {
            // إنشاء طلب
            const xhr = new XMLHttpRequest();
            
            // فتح الطلب
            xhr.open(operation.method || 'POST', operation.url);
            
            // تعيين نوع المحتوى
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            // مستمع حدث اكتمال الطلب
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            };
            
            // مستمع حدث خطأ الطلب
            xhr.onerror = function() {
                resolve(false);
            };
            
            // تحويل البيانات إلى سلسلة
            const formData = new URLSearchParams();
            
            for (const key in operation.data) {
                formData.append(key, operation.data[key]);
            }
            
            // إرسال الطلب
            xhr.send(formData.toString());
        });
    },
    
    /**
     * مزامنة عملية API
     * @param {Object} operation عملية API
     * @returns {Promise} وعد بنتيجة المزامنة
     */
    syncApiOperation: function(operation) {
        return new Promise((resolve, reject) => {
            // إنشاء طلب
            const xhr = new XMLHttpRequest();
            
            // فتح الطلب
            xhr.open(operation.method || 'GET', operation.url);
            
            // تعيين نوع المحتوى
            xhr.setRequestHeader('Content-Type', 'application/json');
            
            // مستمع حدث اكتمال الطلب
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            };
            
            // مستمع حدث خطأ الطلب
            xhr.onerror = function() {
                resolve(false);
            };
            
            // إرسال الطلب
            xhr.send(JSON.stringify(operation.data));
        });
    },
    
    /**
     * تخزين بيانات في قاعدة البيانات المحلية
     * @param {string} storeName اسم مخزن البيانات
     * @param {Object} data البيانات
     * @returns {Promise} وعد بنتيجة التخزين
     */
    storeData: function(storeName, data) {
        return new Promise((resolve, reject) => {
            // التحقق من وجود قاعدة البيانات
            if (!this.state.database) {
                reject(new Error('قاعدة البيانات المحلية غير متاحة'));
                return;
            }
            
            // بدء معاملة
            const transaction = this.state.database.transaction([storeName], 'readwrite');
            
            // الحصول على مخزن البيانات
            const store = transaction.objectStore(storeName);
            
            // إضافة البيانات
            const request = store.put(data);
            
            // مستمع حدث نجاح الإضافة
            request.onsuccess = function() {
                resolve(request.result);
            };
            
            // مستمع حدث فشل الإضافة
            request.onerror = function() {
                reject(request.error);
            };
        });
    },
    
    /**
     * استرجاع بيانات من قاعدة البيانات المحلية
     * @param {string} storeName اسم مخزن البيانات
     * @param {string|number} key المفتاح
     * @returns {Promise} وعد بالبيانات
     */
    retrieveData: function(storeName, key) {
        return new Promise((resolve, reject) => {
            // التحقق من وجود قاعدة البيانات
            if (!this.state.database) {
                reject(new Error('قاعدة البيانات المحلية غير متاحة'));
                return;
            }
            
            // بدء معاملة
            const transaction = this.state.database.transaction([storeName], 'readonly');
            
            // الحصول على مخزن البيانات
            const store = transaction.objectStore(storeName);
            
            // استرجاع البيانات
            const request = store.get(key);
            
            // مستمع حدث نجاح الاسترجاع
            request.onsuccess = function() {
                resolve(request.result);
            };
            
            // مستمع حدث فشل الاسترجاع
            request.onerror = function() {
                reject(request.error);
            };
        });
    },
    
    /**
     * استرجاع جميع البيانات من مخزن البيانات
     * @param {string} storeName اسم مخزن البيانات
     * @returns {Promise} وعد بالبيانات
     */
    retrieveAllData: function(storeName) {
        return new Promise((resolve, reject) => {
            // التحقق من وجود قاعدة البيانات
            if (!this.state.database) {
                reject(new Error('قاعدة البيانات المحلية غير متاحة'));
                return;
            }
            
            // بدء معاملة
            const transaction = this.state.database.transaction([storeName], 'readonly');
            
            // الحصول على مخزن البيانات
            const store = transaction.objectStore(storeName);
            
            // استرجاع جميع البيانات
            const request = store.getAll();
            
            // مستمع حدث نجاح الاسترجاع
            request.onsuccess = function() {
                resolve(request.result);
            };
            
            // مستمع حدث فشل الاسترجاع
            request.onerror = function() {
                reject(request.error);
            };
        });
    },
    
    /**
     * حذف بيانات من قاعدة البيانات المحلية
     * @param {string} storeName اسم مخزن البيانات
     * @param {string|number} key المفتاح
     * @returns {Promise} وعد بنتيجة الحذف
     */
    deleteData: function(storeName, key) {
        return new Promise((resolve, reject) => {
            // التحقق من وجود قاعدة البيانات
            if (!this.state.database) {
                reject(new Error('قاعدة البيانات المحلية غير متاحة'));
                return;
            }
            
            // بدء معاملة
            const transaction = this.state.database.transaction([storeName], 'readwrite');
            
            // الحصول على مخزن البيانات
            const store = transaction.objectStore(storeName);
            
            // حذف البيانات
            const request = store.delete(key);
            
            // مستمع حدث نجاح الحذف
            request.onsuccess = function() {
                resolve(true);
            };
            
            // مستمع حدث فشل الحذف
            request.onerror = function() {
                reject(request.error);
            };
        });
    },
    
    /**
     * مسح جميع البيانات من مخزن البيانات
     * @param {string} storeName اسم مخزن البيانات
     * @returns {Promise} وعد بنتيجة المسح
     */
    clearData: function(storeName) {
        return new Promise((resolve, reject) => {
            // التحقق من وجود قاعدة البيانات
            if (!this.state.database) {
                reject(new Error('قاعدة البيانات المحلية غير متاحة'));
                return;
            }
            
            // بدء معاملة
            const transaction = this.state.database.transaction([storeName], 'readwrite');
            
            // الحصول على مخزن البيانات
            const store = transaction.objectStore(storeName);
            
            // مسح البيانات
            const request = store.clear();
            
            // مستمع حدث نجاح المسح
            request.onsuccess = function() {
                resolve(true);
            };
            
            // مستمع حدث فشل المسح
            request.onerror = function() {
                reject(request.error);
            };
        });
    }
};

// إنشاء ملف Service Worker
if (!('serviceWorkerPath' in OfflineSupport.settings)) {
    // إنشاء محتوى ملف Service Worker
    const serviceWorkerContent = `
        // اسم ذاكرة التخزين المؤقت
        const CACHE_NAME = 'offline-cache-v1';

        // الموارد التي يجب تخزينها مؤقتاً
        const CACHE_URLS = ${JSON.stringify(OfflineSupport.settings.cachableResources)};

        // مستمع حدث تثبيت Service Worker
        self.addEventListener('install', event => {
            console.log('تثبيت Service Worker');
            
            // تخزين الموارد مؤقتاً
            event.waitUntil(
                caches.open(CACHE_NAME)
                    .then(cache => {
                        console.log('فتح ذاكرة التخزين المؤقت');
                        return cache.addAll(CACHE_URLS);
                    })
                    .then(() => {
                        console.log('تم تخزين الموارد مؤقتاً');
                        return self.skipWaiting();
                    })
            );
        });

        // مستمع حدث تنشيط Service Worker
        self.addEventListener('activate', event => {
            console.log('تنشيط Service Worker');
            
            // مسح ذاكرة التخزين المؤقت القديمة
            event.waitUntil(
                caches.keys()
                    .then(cacheNames => {
                        return Promise.all(
                            cacheNames.filter(cacheName => {
                                return cacheName !== CACHE_NAME;
                            }).map(cacheName => {
                                console.log('مسح ذاكرة التخزين المؤقت القديمة:', cacheName);
                                return caches.delete(cacheName);
                            })
                        );
                    })
                    .then(() => {
                        console.log('تم مسح ذاكرة التخزين المؤقت القديمة');
                        return self.clients.claim();
                    })
            );
        });

        // مستمع حدث طلب الموارد
        self.addEventListener('fetch', event => {
            // التحقق من أن الطلب هو طلب GET
            if (event.request.method !== 'GET') {
                return;
            }
            
            // التحقق من أن الطلب ليس لواجهة برمجة التطبيقات
            if (event.request.url.includes('/api/')) {
                return;
            }
            
            // استراتيجية الشبكة أولاً، ثم ذاكرة التخزين المؤقت
            event.respondWith(
                fetch(event.request)
                    .then(response => {
                        // التحقق من أن الاستجابة صالحة
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // تخزين الاستجابة مؤقتاً
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // استخدام ذاكرة التخزين المؤقت إذا فشل الطلب
                        return caches.match(event.request)
                            .then(cachedResponse => {
                                if (cachedResponse) {
                                    return cachedResponse;
                                }
                                
                                // إذا كان الطلب لصفحة HTML، إرجاع صفحة عدم الاتصال
                                if (event.request.headers.get('accept').includes('text/html')) {
                                    return caches.match('/offline.html');
                                }
                                
                                // إذا كان الطلب لصورة، إرجاع صورة عدم الاتصال
                                if (event.request.headers.get('accept').includes('image/')) {
                                    return caches.match('/assets/images/offline.png');
                                }
                            });
                    })
            );
        });
    `;
    
    // إنشاء ملف Service Worker
    const blob = new Blob([serviceWorkerContent], { type: 'application/javascript' });
    OfflineSupport.settings.serviceWorkerPath = URL.createObjectURL(blob);
}

// إنشاء صفحة عدم الاتصال
const createOfflinePage = function() {
    // محتوى صفحة عدم الاتصال
    const offlinePageContent = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>غير متصل بالإنترنت</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f8f9fa;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    text-align: center;
                }
                
                .container {
                    max-width: 600px;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                
                h1 {
                    color: #dc3545;
                    margin-bottom: 20px;
                }
                
                p {
                    margin-bottom: 20px;
                    line-height: 1.6;
                }
                
                .icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                    color: #dc3545;
                }
                
                .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #fff;
                    border-radius: 5px;
                    text-decoration: none;
                    margin-top: 20px;
                    transition: background-color 0.3s;
                }
                
                .btn:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">&#x26A0;</div>
                <h1>غير متصل بالإنترنت</h1>
                <p>يبدو أنك غير متصل بالإنترنت حالياً. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.</p>
                <p>لا تقلق، يمكنك الوصول إلى بعض الميزات الأساسية في وضع عدم الاتصال.</p>
                <a href="/" class="btn">تحديث الصفحة</a>
            </div>
            
            <script>
                // التحقق من حالة الاتصال
                window.addEventListener('online', function() {
                    window.location.reload();
                });
                
                // تحديث الصفحة عند النقر على زر التحديث
                document.querySelector('.btn').addEventListener('click', function(event) {
                    event.preventDefault();
                    window.location.reload();
                });
            </script>
        </body>
        </html>
    `;
    
    // إنشاء ملف صفحة عدم الاتصال
    const blob = new Blob([offlinePageContent], { type: 'text/html' });
    const offlinePageUrl = URL.createObjectURL(blob);
    
    // إضافة صفحة عدم الاتصال إلى الموارد التي يجب تخزينها مؤقتاً
    OfflineSupport.settings.cachableResources.push(offlinePageUrl);
};

// تهيئة نظام دعم وضع عدم الاتصال عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إنشاء صفحة عدم الاتصال
    createOfflinePage();
    
    // تهيئة نظام دعم وضع عدم الاتصال
    OfflineSupport.init();
    
    console.log('تم تهيئة نظام دعم وضع عدم الاتصال');
});

// تصدير كائن OfflineSupport للاستخدام في ملفات أخرى
window.OfflineSupport = OfflineSupport;
