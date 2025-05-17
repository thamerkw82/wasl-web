/**
 * نظام تحديث البيانات في الوقت الفعلي
 * يتيح تحديث البيانات دون الحاجة لإعادة تحميل الصفحة
 */

// كائن لإدارة تحديثات البيانات في الوقت الفعلي
const RealTimeUpdates = {
    // إعدادات افتراضية
    settings: {
        // الفاصل الزمني بين التحديثات (بالمللي ثانية)
        updateInterval: 30000,
        
        // الحد الأقصى لعدد محاولات إعادة الاتصال
        maxReconnectAttempts: 5,
        
        // الفاصل الزمني بين محاولات إعادة الاتصال (بالمللي ثانية)
        reconnectInterval: 5000,
        
        // ما إذا كان التحديث التلقائي مفعلاً
        autoUpdate: true,
        
        // ما إذا كان يجب عرض مؤشرات التحميل
        showLoadingIndicators: true,
        
        // ما إذا كان يجب عرض إشعارات التحديث
        showUpdateNotifications: true
    },
    
    // حالة النظام
    state: {
        // ما إذا كان النظام نشطاً
        active: false,
        
        // مؤقتات التحديث
        timers: {},
        
        // عدد محاولات إعادة الاتصال الحالية
        reconnectAttempts: 0,
        
        // آخر وقت تحديث لكل نوع بيانات
        lastUpdateTime: {},
        
        // مؤشرات التحميل
        loadingIndicators: {},
        
        // العناصر التي تم تحديثها
        updatedElements: {}
    },
    
    /**
     * تهيئة نظام تحديث البيانات في الوقت الفعلي
     * @param {Object} options خيارات التهيئة
     */
    init: function(options = {}) {
        // دمج الخيارات مع الإعدادات الافتراضية
        this.settings = { ...this.settings, ...options };
        
        // تحديد العناصر التي تتطلب تحديثاً في الوقت الفعلي
        this.identifyRealTimeElements();
        
        // إضافة مستمعي الأحداث
        this.setupEventListeners();
        
        // بدء التحديثات التلقائية إذا كانت مفعلة
        if (this.settings.autoUpdate) {
            this.startAutoUpdates();
        }
        
        // تعيين حالة النظام إلى نشط
        this.state.active = true;
        
        console.log('تم تهيئة نظام تحديث البيانات في الوقت الفعلي');
    },
    
    /**
     * تحديد العناصر التي تتطلب تحديثاً في الوقت الفعلي
     */
    identifyRealTimeElements: function() {
        // تحديد العناصر التي تحتوي على سمة data-realtime
        const realtimeElements = document.querySelectorAll('[data-realtime]');
        
        realtimeElements.forEach(element => {
            // الحصول على نوع البيانات من السمة
            const dataType = element.getAttribute('data-realtime');
            
            // الحصول على معرف العنصر
            const elementId = element.id || `realtime-element-${Math.random().toString(36).substr(2, 9)}`;
            
            // تعيين معرف للعنصر إذا لم يكن له معرف
            if (!element.id) {
                element.id = elementId;
            }
            
            // تخزين العنصر في حالة النظام
            if (!this.state.updatedElements[dataType]) {
                this.state.updatedElements[dataType] = [];
            }
            
            this.state.updatedElements[dataType].push(elementId);
            
            // إضافة مؤشر تحميل إذا كان مطلوباً
            if (this.settings.showLoadingIndicators) {
                this.addLoadingIndicator(element, dataType);
            }
            
            // تعيين وقت آخر تحديث
            this.state.lastUpdateTime[dataType] = Date.now();
            
            console.log(`تم تحديد عنصر للتحديث في الوقت الفعلي: ${elementId} (${dataType})`);
        });
    },
    
    /**
     * إضافة مؤشر تحميل إلى عنصر
     * @param {HTMLElement} element العنصر
     * @param {string} dataType نوع البيانات
     */
    addLoadingIndicator: function(element, dataType) {
        // إنشاء مؤشر التحميل
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">جاري التحميل...</span>
            </div>
            <span class="loading-text ms-2">جاري التحديث...</span>
        `;
        
        // إخفاء مؤشر التحميل بشكل افتراضي
        loadingIndicator.style.display = 'none';
        
        // إضافة مؤشر التحميل إلى العنصر
        element.style.position = 'relative';
        element.appendChild(loadingIndicator);
        
        // تخزين مؤشر التحميل في حالة النظام
        this.state.loadingIndicators[element.id] = loadingIndicator;
    },
    
    /**
     * إضافة مستمعي الأحداث
     */
    setupEventListeners: function() {
        // مستمع لحدث تغيير حالة الاتصال
        window.addEventListener('online', () => {
            console.log('تم استعادة الاتصال بالإنترنت');
            this.state.reconnectAttempts = 0;
            
            if (this.settings.autoUpdate) {
                this.startAutoUpdates();
            }
            
            if (this.settings.showUpdateNotifications) {
                this.showNotification('تم استعادة الاتصال بالإنترنت', 'success');
            }
        });
        
        window.addEventListener('offline', () => {
            console.log('تم فقدان الاتصال بالإنترنت');
            this.stopAutoUpdates();
            
            if (this.settings.showUpdateNotifications) {
                this.showNotification('تم فقدان الاتصال بالإنترنت', 'warning');
            }
        });
        
        // مستمع لحدث تغيير التفضيلات
        document.addEventListener('preferenceChange', (event) => {
            const { category, key, value } = event.detail;
            
            // تحديث إعدادات التحديث التلقائي إذا تغيرت تفضيلات المستخدم
            if (category === 'misc' && key === 'autoUpdate') {
                this.settings.autoUpdate = value;
                
                if (value) {
                    this.startAutoUpdates();
                } else {
                    this.stopAutoUpdates();
                }
            }
        });
        
        // مستمع لحدث إعادة تعيين التفضيلات
        document.addEventListener('preferencesReset', () => {
            // إعادة تعيين إعدادات التحديث التلقائي إلى القيم الافتراضية
            this.settings.autoUpdate = true;
            this.startAutoUpdates();
        });
        
        // مستمع لحدث تحميل الصفحة
        window.addEventListener('load', () => {
            // تحديث جميع البيانات عند تحميل الصفحة
            this.updateAllData();
        });
        
        // مستمع لحدث إغلاق الصفحة
        window.addEventListener('beforeunload', () => {
            // إيقاف جميع التحديثات التلقائية
            this.stopAutoUpdates();
        });
        
        // مستمع لأزرار التحديث اليدوي
        document.querySelectorAll('[data-action="refresh"]').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                
                // الحصول على نوع البيانات من السمة
                const dataType = button.getAttribute('data-refresh-type');
                
                if (dataType) {
                    // تحديث نوع بيانات محدد
                    this.updateData(dataType);
                } else {
                    // تحديث جميع البيانات
                    this.updateAllData();
                }
            });
        });
    },
    
    /**
     * بدء التحديثات التلقائية
     */
    startAutoUpdates: function() {
        // إيقاف أي تحديثات تلقائية حالية
        this.stopAutoUpdates();
        
        // الحصول على أنواع البيانات
        const dataTypes = Object.keys(this.state.updatedElements);
        
        // بدء تحديث تلقائي لكل نوع بيانات
        dataTypes.forEach(dataType => {
            this.startAutoUpdateForDataType(dataType);
        });
        
        console.log('تم بدء التحديثات التلقائية');
    },
    
    /**
     * بدء تحديث تلقائي لنوع بيانات محدد
     * @param {string} dataType نوع البيانات
     */
    startAutoUpdateForDataType: function(dataType) {
        // إيقاف أي تحديث تلقائي حالي لنوع البيانات
        this.stopAutoUpdateForDataType(dataType);
        
        // تحديد الفاصل الزمني للتحديث
        let updateInterval = this.settings.updateInterval;
        
        // تعديل الفاصل الزمني بناءً على نوع البيانات
        switch (dataType) {
            case 'statistics':
                // تحديث الإحصائيات كل دقيقة
                updateInterval = 60000;
                break;
            case 'notifications':
                // تحديث الإشعارات كل 15 ثانية
                updateInterval = 15000;
                break;
            case 'messages':
                // تحديث الرسائل كل 10 ثوانٍ
                updateInterval = 10000;
                break;
            case 'events':
                // تحديث المناسبات كل 5 دقائق
                updateInterval = 300000;
                break;
            case 'invitations':
                // تحديث الدعوات كل 2 دقيقة
                updateInterval = 120000;
                break;
            case 'guests':
                // تحديث الضيوف كل 2 دقيقة
                updateInterval = 120000;
                break;
            case 'templates':
                // تحديث القوالب كل 10 دقائق
                updateInterval = 600000;
                break;
            case 'system-health':
                // تحديث حالة النظام كل 30 ثانية
                updateInterval = 30000;
                break;
        }
        
        // بدء مؤقت التحديث
        this.state.timers[dataType] = setInterval(() => {
            this.updateData(dataType);
        }, updateInterval);
        
        console.log(`تم بدء التحديث التلقائي لنوع البيانات: ${dataType} (كل ${updateInterval / 1000} ثانية)`);
    },
    
    /**
     * إيقاف التحديثات التلقائية
     */
    stopAutoUpdates: function() {
        // الحصول على أنواع البيانات
        const dataTypes = Object.keys(this.state.timers);
        
        // إيقاف تحديث تلقائي لكل نوع بيانات
        dataTypes.forEach(dataType => {
            this.stopAutoUpdateForDataType(dataType);
        });
        
        console.log('تم إيقاف التحديثات التلقائية');
    },
    
    /**
     * إيقاف تحديث تلقائي لنوع بيانات محدد
     * @param {string} dataType نوع البيانات
     */
    stopAutoUpdateForDataType: function(dataType) {
        // إيقاف مؤقت التحديث
        if (this.state.timers[dataType]) {
            clearInterval(this.state.timers[dataType]);
            delete this.state.timers[dataType];
            
            console.log(`تم إيقاف التحديث التلقائي لنوع البيانات: ${dataType}`);
        }
    },
    
    /**
     * تحديث جميع البيانات
     */
    updateAllData: function() {
        // الحصول على أنواع البيانات
        const dataTypes = Object.keys(this.state.updatedElements);
        
        // تحديث كل نوع بيانات
        dataTypes.forEach(dataType => {
            this.updateData(dataType);
        });
        
        console.log('تم بدء تحديث جميع البيانات');
    },
    
    /**
     * تحديث بيانات من نوع محدد
     * @param {string} dataType نوع البيانات
     */
    updateData: function(dataType) {
        // التحقق من وجود عناصر لهذا النوع
        if (!this.state.updatedElements[dataType] || this.state.updatedElements[dataType].length === 0) {
            console.log(`لا توجد عناصر لتحديثها من نوع: ${dataType}`);
            return;
        }
        
        // إظهار مؤشرات التحميل
        this.showLoadingIndicators(dataType);
        
        // تحديث وقت آخر تحديث
        this.state.lastUpdateTime[dataType] = Date.now();
        
        console.log(`بدء تحديث البيانات من نوع: ${dataType}`);
        
        // استدعاء الدالة المناسبة لتحديث البيانات بناءً على نوع البيانات
        switch (dataType) {
            case 'statistics':
                this.updateStatistics();
                break;
            case 'notifications':
                this.updateNotifications();
                break;
            case 'messages':
                this.updateMessages();
                break;
            case 'events':
                this.updateEvents();
                break;
            case 'invitations':
                this.updateInvitations();
                break;
            case 'guests':
                this.updateGuests();
                break;
            case 'templates':
                this.updateTemplates();
                break;
            case 'system-health':
                this.updateSystemHealth();
                break;
            default:
                // استدعاء دالة عامة لتحديث البيانات
                this.fetchAndUpdateGenericData(dataType);
                break;
        }
    },
    
    /**
     * إظهار مؤشرات التحميل لنوع بيانات محدد
     * @param {string} dataType نوع البيانات
     */
    showLoadingIndicators: function(dataType) {
        // التحقق من وجود عناصر لهذا النوع
        if (!this.state.updatedElements[dataType]) return;
        
        // إظهار مؤشر التحميل لكل عنصر
        this.state.updatedElements[dataType].forEach(elementId => {
            const loadingIndicator = this.state.loadingIndicators[elementId];
            
            if (loadingIndicator) {
                loadingIndicator.style.display = 'flex';
            }
        });
    },
    
    /**
     * إخفاء مؤشرات التحميل لنوع بيانات محدد
     * @param {string} dataType نوع البيانات
     */
    hideLoadingIndicators: function(dataType) {
        // التحقق من وجود عناصر لهذا النوع
        if (!this.state.updatedElements[dataType]) return;
        
        // إخفاء مؤشر التحميل لكل عنصر
        this.state.updatedElements[dataType].forEach(elementId => {
            const loadingIndicator = this.state.loadingIndicators[elementId];
            
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        });
    },
    
    /**
     * عرض إشعار
     * @param {string} message نص الإشعار
     * @param {string} type نوع الإشعار (success, info, warning, danger)
     */
    showNotification: function(message, type = 'info') {
        // التحقق من تفعيل إشعارات التحديث
        if (!this.settings.showUpdateNotifications) return;
        
        // استخدام دالة عرض الإشعارات العامة إذا كانت موجودة
        if (typeof showNotification === 'function') {
            showNotification(message, type);
            return;
        }
        
        // إنشاء إشعار مخصص إذا لم تكن دالة عرض الإشعارات العامة موجودة
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show realtime-notification`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="إغلاق"></button>
        `;
        
        // إضافة الإشعار إلى الصفحة
        let notificationsContainer = document.getElementById('notifications-container');
        
        if (!notificationsContainer) {
            notificationsContainer = document.createElement('div');
            notificationsContainer.id = 'notifications-container';
            notificationsContainer.style.position = 'fixed';
            notificationsContainer.style.top = '20px';
            notificationsContainer.style.left = '20px';
            notificationsContainer.style.zIndex = '9999';
            document.body.appendChild(notificationsContainer);
        }
        
        notificationsContainer.appendChild(notification);
        
        // إزالة الإشعار بعد 3 ثوانٍ
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    },
    
    /**
     * معالجة خطأ في التحديث
     * @param {string} dataType نوع البيانات
     * @param {Error} error الخطأ
     */
    handleUpdateError: function(dataType, error) {
        console.error(`خطأ في تحديث البيانات من نوع ${dataType}:`, error);
        
        // إخفاء مؤشرات التحميل
        this.hideLoadingIndicators(dataType);
        
        // عرض إشعار بالخطأ
        if (this.settings.showUpdateNotifications) {
            this.showNotification(`فشل تحديث البيانات: ${error.message}`, 'danger');
        }
        
        // زيادة عدد محاولات إعادة الاتصال
        this.state.reconnectAttempts++;
        
        // إعادة المحاولة إذا لم يتم تجاوز الحد الأقصى
        if (this.state.reconnectAttempts <= this.settings.maxReconnectAttempts) {
            console.log(`إعادة المحاولة (${this.state.reconnectAttempts}/${this.settings.maxReconnectAttempts}) بعد ${this.settings.reconnectInterval / 1000} ثوانٍ`);
            
            // إعادة المحاولة بعد فترة
            setTimeout(() => {
                this.updateData(dataType);
            }, this.settings.reconnectInterval);
        } else {
            console.log(`تم تجاوز الحد الأقصى لمحاولات إعادة الاتصال (${this.settings.maxReconnectAttempts})`);
            
            // إعادة تعيين عدد محاولات إعادة الاتصال
            this.state.reconnectAttempts = 0;
            
            // عرض إشعار بفشل إعادة الاتصال
            if (this.settings.showUpdateNotifications) {
                this.showNotification('فشلت محاولات إعادة الاتصال، يرجى التحقق من اتصالك بالإنترنت', 'danger');
            }
        }
    },
    
    /**
     * جلب وتحديث بيانات عامة
     * @param {string} dataType نوع البيانات
     */
    fetchAndUpdateGenericData: function(dataType) {
        // محاكاة طلب AJAX
        setTimeout(() => {
            try {
                // محاكاة استجابة ناجحة
                const mockData = this.generateMockData(dataType);
                
                // تحديث العناصر بالبيانات الجديدة
                this.updateElements(dataType, mockData);
                
                // إخفاء مؤشرات التحميل
                this.hideLoadingIndicators(dataType);
                
                // إعادة تعيين عدد محاولات إعادة الاتصال
                this.state.reconnectAttempts = 0;
                
                console.log(`تم تحديث البيانات من نوع: ${dataType}`);
                
                // عرض إشعار بنجاح التحديث
                if (this.settings.showUpdateNotifications) {
                    this.showNotification(`تم تحديث البيانات بنجاح`, 'success');
                }
            } catch (error) {
                this.handleUpdateError(dataType, error);
            }
        }, 1000);
    },
    
    /**
     * توليد بيانات وهمية لأغراض المحاكاة
     * @param {string} dataType نوع البيانات
     * @returns {Object} البيانات الوهمية
     */
    generateMockData: function(dataType) {
        // توليد بيانات وهمية بناءً على نوع البيانات
        switch (dataType) {
            case 'statistics':
                return {
                    totalEvents: Math.floor(Math.random() * 1000),
                    totalInvitations: Math.floor(Math.random() * 5000),
                    totalGuests: Math.floor(Math.random() * 10000),
                    acceptedInvitations: Math.floor(Math.random() * 3000),
                    pendingInvitations: Math.floor(Math.random() * 2000),
                    declinedInvitations: Math.floor(Math.random() * 1000)
                };
            case 'notifications':
                return {
                    items: [
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            title: 'إشعار جديد',
                            message: 'تم إنشاء دعوة جديدة',
                            time: new Date().toISOString(),
                            read: false,
                            type: 'info'
                        },
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            title: 'تحديث حالة',
                            message: 'تم قبول الدعوة من قبل 5 ضيوف',
                            time: new Date(Date.now() - 3600000).toISOString(),
                            read: false,
                            type: 'success'
                        }
                    ],
                    unreadCount: 2
                };
            case 'messages':
                return {
                    items: [
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            sender: 'أحمد محمد',
                            message: 'مرحباً، هل يمكنني الحصول على معلومات إضافية حول المناسبة؟',
                            time: new Date().toISOString(),
                            read: false
                        },
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            sender: 'سارة أحمد',
                            message: 'شكراً على الدعوة، سأكون حاضراً بإذن الله',
                            time: new Date(Date.now() - 7200000).toISOString(),
                            read: true
                        }
                    ],
                    unreadCount: 1
                };
            case 'events':
                return {
                    items: [
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            title: 'حفل زفاف',
                            date: new Date(Date.now() + 86400000 * 7).toISOString(),
                            location: 'قاعة الأميرات - الرياض',
                            guests: Math.floor(Math.random() * 200),
                            status: 'قادم'
                        },
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            title: 'مؤتمر تقني',
                            date: new Date(Date.now() + 86400000 * 14).toISOString(),
                            location: 'فندق الخليج - جدة',
                            guests: Math.floor(Math.random() * 500),
                            status: 'قادم'
                        }
                    ],
                    totalCount: 2
                };
            case 'invitations':
                return {
                    items: [
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            eventTitle: 'حفل زفاف',
                            sentTo: Math.floor(Math.random() * 200),
                            accepted: Math.floor(Math.random() * 100),
                            pending: Math.floor(Math.random() * 50),
                            declined: Math.floor(Math.random() * 50),
                            date: new Date(Date.now() - 86400000 * 2).toISOString()
                        },
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            eventTitle: 'مؤتمر تقني',
                            sentTo: Math.floor(Math.random() * 500),
                            accepted: Math.floor(Math.random() * 300),
                            pending: Math.floor(Math.random() * 100),
                            declined: Math.floor(Math.random() * 100),
                            date: new Date(Date.now() - 86400000 * 5).toISOString()
                        }
                    ],
                    totalCount: 2
                };
            case 'guests':
                return {
                    items: [
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            name: 'محمد أحمد',
                            email: 'mohammed@example.com',
                            phone: '0512345678',
                            status: 'مؤكد',
                            eventTitle: 'حفل زفاف'
                        },
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            name: 'سارة خالد',
                            email: 'sarah@example.com',
                            phone: '0598765432',
                            status: 'معلق',
                            eventTitle: 'حفل زفاف'
                        }
                    ],
                    totalCount: 2
                };
            case 'templates':
                return {
                    items: [
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            title: 'قالب زفاف كلاسيكي',
                            category: 'زفاف',
                            popularity: Math.floor(Math.random() * 100),
                            thumbnail: 'template1.jpg'
                        },
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            title: 'قالب مؤتمر احترافي',
                            category: 'مؤتمرات',
                            popularity: Math.floor(Math.random() * 100),
                            thumbnail: 'template2.jpg'
                        }
                    ],
                    totalCount: 2
                };
            case 'system-health':
                return {
                    cpu: Math.floor(Math.random() * 100),
                    memory: Math.floor(Math.random() * 100),
                    disk: Math.floor(Math.random() * 100),
                    network: Math.floor(Math.random() * 100),
                    uptime: Math.floor(Math.random() * 30 * 24 * 60 * 60), // بالثواني
                    activeUsers: Math.floor(Math.random() * 1000),
                    errors: Math.floor(Math.random() * 10),
                    warnings: Math.floor(Math.random() * 20)
                };
            default:
                return {
                    timestamp: new Date().toISOString(),
                    data: 'بيانات عشوائية لنوع ' + dataType
                };
        }
    },
    
    /**
     * تحديث العناصر بالبيانات الجديدة
     * @param {string} dataType نوع البيانات
     * @param {Object} data البيانات الجديدة
     */
    updateElements: function(dataType, data) {
        // التحقق من وجود عناصر لهذا النوع
        if (!this.state.updatedElements[dataType]) return;
        
        // تحديث كل عنصر
        this.state.updatedElements[dataType].forEach(elementId => {
            const element = document.getElementById(elementId);
            
            if (!element) return;
            
            // تحديث العنصر بناءً على نوع البيانات
            switch (dataType) {
                case 'statistics':
                    this.updateStatisticsElement(element, data);
                    break;
                case 'notifications':
                    this.updateNotificationsElement(element, data);
                    break;
                case 'messages':
                    this.updateMessagesElement(element, data);
                    break;
                case 'events':
                    this.updateEventsElement(element, data);
                    break;
                case 'invitations':
                    this.updateInvitationsElement(element, data);
                    break;
                case 'guests':
                    this.updateGuestsElement(element, data);
                    break;
                case 'templates':
                    this.updateTemplatesElement(element, data);
                    break;
                case 'system-health':
                    this.updateSystemHealthElement(element, data);
                    break;
                default:
                    // تحديث عام للعنصر
                    element.innerHTML = `<div class="alert alert-info">تم تحديث البيانات في: ${new Date().toLocaleTimeString()}</div>`;
                    break;
            }
            
            // إضافة تأثير التحديث
            this.addUpdateEffect(element);
        });
    },
    
    /**
     * إضافة تأثير التحديث إلى عنصر
     * @param {HTMLElement} element العنصر
     */
    addUpdateEffect: function(element) {
        // إضافة فئة التحديث
        element.classList.add('realtime-updated');
        
        // إزالة فئة التحديث بعد انتهاء التأثير
        setTimeout(() => {
            element.classList.remove('realtime-updated');
        }, 1000);
    },
    
    /**
     * تحديث عنصر الإحصائيات
     * @param {HTMLElement} element العنصر
     * @param {Object} data البيانات
     */
    updateStatisticsElement: function(element, data) {
        // تحديث الإحصائيات داخل العنصر
        const statsElements = element.querySelectorAll('[data-stat]');
        
        statsElements.forEach(statElement => {
            const statKey = statElement.getAttribute('data-stat');
            
            if (data[statKey] !== undefined) {
                // تحديث قيمة الإحصائية
                const oldValue = parseInt(statElement.textContent);
                const newValue = data[statKey];
                
                // تحديث القيمة مع تأثير العد
                this.animateCounter(statElement, oldValue, newValue);
            }
        });
        
        // تحديث الرسوم البيانية إذا وجدت
        const charts = element.querySelectorAll('[data-chart]');
        
        charts.forEach(chartElement => {
            const chartType = chartElement.getAttribute('data-chart');
            
            // تحديث الرسم البياني إذا كانت مكتبة Chart.js موجودة
            if (window.Chart && chartElement.chart) {
                const chart = chartElement.chart;
                
                switch (chartType) {
                    case 'invitations':
                        chart.data.datasets[0].data = [
                            data.acceptedInvitations,
                            data.pendingInvitations,
                            data.declinedInvitations
                        ];
                        break;
                    case 'events':
                        // تحديث بيانات المناسبات
                        break;
                    case 'guests':
                        // تحديث بيانات الضيوف
                        break;
                }
                
                chart.update();
            }
        });
        
        // تحديث وقت آخر تحديث
        const lastUpdateElement = element.querySelector('.last-update-time');
        
        if (lastUpdateElement) {
            lastUpdateElement.textContent = new Date().toLocaleTimeString();
        }
    },
    
    /**
     * تحريك عداد من قيمة إلى أخرى
     * @param {HTMLElement} element العنصر
     * @param {number} startValue القيمة البدائية
     * @param {number} endValue القيمة النهائية
     * @param {number} duration المدة بالمللي ثانية
     */
    animateCounter: function(element, startValue, endValue, duration = 1000) {
        const startTime = performance.now();
        const difference = endValue - startValue;
        
        // دالة تحديث العداد
        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            
            if (elapsedTime > duration) {
                element.textContent = endValue.toLocaleString();
                return;
            }
            
            const progress = elapsedTime / duration;
            const currentValue = Math.round(startValue + difference * progress);
            
            element.textContent = currentValue.toLocaleString();
            
            requestAnimationFrame(updateCounter);
        }
        
        requestAnimationFrame(updateCounter);
    },
    
    /**
     * تحديث عنصر الإشعارات
     * @param {HTMLElement} element العنصر
     * @param {Object} data البيانات
     */
    updateNotificationsElement: function(element, data) {
        // تحديث عدد الإشعارات غير المقروءة
        const unreadBadge = document.querySelector('.notifications-badge');
        
        if (unreadBadge) {
            unreadBadge.textContent = data.unreadCount;
            unreadBadge.style.display = data.unreadCount > 0 ? 'inline-block' : 'none';
        }
        
        // تحديث قائمة الإشعارات
        let notificationsHtml = '';
        
        if (data.items.length === 0) {
            notificationsHtml = '<div class="text-center p-3">لا توجد إشعارات</div>';
        } else {
            notificationsHtml = data.items.map(notification => `
                <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                    <div class="notification-icon">
                        <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-message">${notification.message}</div>
                        <div class="notification-time">${this.formatTime(notification.time)}</div>
                    </div>
                    <div class="notification-actions">
                        <button class="btn btn-sm btn-link mark-as-read" data-id="${notification.id}">
                            <i class="fas fa-check"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        element.innerHTML = notificationsHtml;
        
        // إضافة مستمعي الأحداث لأزرار تعليم الإشعارات كمقروءة
        element.querySelectorAll('.mark-as-read').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                
                const notificationId = button.getAttribute('data-id');
                this.markNotificationAsRead(notificationId);
            });
        });
    },
    
    /**
     * الحصول على أيقونة الإشعار بناءً على نوعه
     * @param {string} type نوع الإشعار
     * @returns {string} اسم الأيقونة
     */
    getNotificationIcon: function(type) {
        switch (type) {
            case 'success':
                return 'check-circle';
            case 'warning':
                return 'exclamation-triangle';
            case 'danger':
                return 'times-circle';
            case 'info':
            default:
                return 'info-circle';
        }
    },
    
    /**
     * تنسيق الوقت بشكل مناسب
     * @param {string} timeString سلسلة الوقت
     * @returns {string} الوقت المنسق
     */
    formatTime: function(timeString) {
        const date = new Date(timeString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffSec < 60) {
            return 'منذ لحظات';
        } else if (diffMin < 60) {
            return `منذ ${diffMin} دقيقة`;
        } else if (diffHour < 24) {
            return `منذ ${diffHour} ساعة`;
        } else if (diffDay < 30) {
            return `منذ ${diffDay} يوم`;
        } else {
            return date.toLocaleDateString();
        }
    },
    
    /**
     * تعليم إشعار كمقروء
     * @param {string} notificationId معرف الإشعار
     */
    markNotificationAsRead: function(notificationId) {
        // محاكاة طلب AJAX لتعليم الإشعار كمقروء
        console.log(`تعليم الإشعار كمقروء: ${notificationId}`);
        
        // تحديث واجهة المستخدم
        const notificationElement = document.querySelector(`.notification-item[data-id="${notificationId}"]`);
        
        if (notificationElement) {
            notificationElement.classList.remove('unread');
            notificationElement.classList.add('read');
        }
        
        // تحديث عدد الإشعارات غير المقروءة
        const unreadBadge = document.querySelector('.notifications-badge');
        
        if (unreadBadge) {
            const currentCount = parseInt(unreadBadge.textContent);
            const newCount = Math.max(0, currentCount - 1);
            
            unreadBadge.textContent = newCount;
            unreadBadge.style.display = newCount > 0 ? 'inline-block' : 'none';
        }
    },
    
    /**
     * تحديث عنصر الرسائل
     * @param {HTMLElement} element العنصر
     * @param {Object} data البيانات
     */
    updateMessagesElement: function(element, data) {
        // تحديث عدد الرسائل غير المقروءة
        const unreadBadge = document.querySelector('.messages-badge');
        
        if (unreadBadge) {
            unreadBadge.textContent = data.unreadCount;
            unreadBadge.style.display = data.unreadCount > 0 ? 'inline-block' : 'none';
        }
        
        // تحديث قائمة الرسائل
        let messagesHtml = '';
        
        if (data.items.length === 0) {
            messagesHtml = '<div class="text-center p-3">لا توجد رسائل</div>';
        } else {
            messagesHtml = data.items.map(message => `
                <div class="message-item ${message.read ? 'read' : 'unread'}" data-id="${message.id}">
                    <div class="message-sender">${message.sender}</div>
                    <div class="message-content">${message.message}</div>
                    <div class="message-time">${this.formatTime(message.time)}</div>
                    <div class="message-actions">
                        <button class="btn btn-sm btn-link mark-as-read" data-id="${message.id}">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-link reply" data-id="${message.id}">
                            <i class="fas fa-reply"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        element.innerHTML = messagesHtml;
        
        // إضافة مستمعي الأحداث لأزرار تعليم الرسائل كمقروءة والرد
        element.querySelectorAll('.mark-as-read').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                
                const messageId = button.getAttribute('data-id');
                this.markMessageAsRead(messageId);
            });
        });
        
        element.querySelectorAll('.reply').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                
                const messageId = button.getAttribute('data-id');
                this.replyToMessage(messageId);
            });
        });
    },
    
    /**
     * تعليم رسالة كمقروءة
     * @param {string} messageId معرف الرسالة
     */
    markMessageAsRead: function(messageId) {
        // محاكاة طلب AJAX لتعليم الرسالة كمقروءة
        console.log(`تعليم الرسالة كمقروءة: ${messageId}`);
        
        // تحديث واجهة المستخدم
        const messageElement = document.querySelector(`.message-item[data-id="${messageId}"]`);
        
        if (messageElement) {
            messageElement.classList.remove('unread');
            messageElement.classList.add('read');
        }
        
        // تحديث عدد الرسائل غير المقروءة
        const unreadBadge = document.querySelector('.messages-badge');
        
        if (unreadBadge) {
            const currentCount = parseInt(unreadBadge.textContent);
            const newCount = Math.max(0, currentCount - 1);
            
            unreadBadge.textContent = newCount;
            unreadBadge.style.display = newCount > 0 ? 'inline-block' : 'none';
        }
    },
    
    /**
     * الرد على رسالة
     * @param {string} messageId معرف الرسالة
     */
    replyToMessage: function(messageId) {
        // محاكاة فتح نافذة الرد
        console.log(`الرد على الرسالة: ${messageId}`);
        
        // عرض نافذة الرد إذا كانت موجودة
        const replyModal = document.getElementById('reply-modal');
        
        if (replyModal) {
            // تعيين معرف الرسالة في النافذة
            replyModal.querySelector('input[name="message_id"]').value = messageId;
            
            // عرض النافذة
            const bsModal = new bootstrap.Modal(replyModal);
            bsModal.show();
        } else {
            // عرض إشعار إذا لم تكن النافذة موجودة
            this.showNotification('جاري تحميل نافذة الرد...', 'info');
        }
    },
    
    /**
     * تحديث عنصر المناسبات
     * @param {HTMLElement} element العنصر
     * @param {Object} data البيانات
     */
    updateEventsElement: function(element, data) {
        // تحديث قائمة المناسبات
        let eventsHtml = '';
        
        if (data.items.length === 0) {
            eventsHtml = '<div class="text-center p-3">لا توجد مناسبات</div>';
        } else {
            // التحقق من نوع العرض (جدول أو بطاقات)
            if (element.classList.contains('events-table')) {
                // عرض جدول
                eventsHtml = `
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>العنوان</th>
                                <th>التاريخ</th>
                                <th>المكان</th>
                                <th>الضيوف</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.items.map(event => `
                                <tr data-id="${event.id}" data-date="${event.date}" data-name="${event.title}">
                                    <td>${event.title}</td>
                                    <td>${new Date(event.date).toLocaleDateString()}</td>
                                    <td>${event.location}</td>
                                    <td>${event.guests}</td>
                                    <td><span class="badge bg-primary">${event.status}</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-primary view-event" data-id="${event.id}">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn btn-sm btn-success edit-event" data-id="${event.id}">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else {
                // عرض بطاقات
                eventsHtml = `
                    <div class="row">
                        ${data.items.map(event => `
                            <div class="col-md-6 col-lg-4 mb-4">
                                <div class="card event-card" data-id="${event.id}" data-date="${event.date}" data-name="${event.title}">
                                    <div class="card-header">
                                        <h5 class="card-title">${event.title}</h5>
                                        <span class="badge bg-primary">${event.status}</span>
                                    </div>
                                    <div class="card-body">
                                        <p><i class="fas fa-calendar-alt me-2"></i>${new Date(event.date).toLocaleDateString()}</p>
                                        <p><i class="fas fa-map-marker-alt me-2"></i>${event.location}</p>
                                        <p><i class="fas fa-users me-2"></i>${event.guests} ضيف</p>
                                    </div>
                                    <div class="card-footer">
                                        <button class="btn btn-sm btn-primary view-event" data-id="${event.id}">
                                            <i class="fas fa-eye"></i> عرض
                                        </button>
                                        <button class="btn btn-sm btn-success edit-event" data-id="${event.id}">
                                            <i class="fas fa-edit"></i> تعديل
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        }
        
        element.innerHTML = eventsHtml;
        
        // إضافة مستمعي الأحداث لأزرار عرض وتعديل المناسبات
        element.querySelectorAll('.view-event').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                
                const eventId = button.getAttribute('data-id');
                this.viewEvent(eventId);
            });
        });
        
        element.querySelectorAll('.edit-event').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                
                const eventId = button.getAttribute('data-id');
                this.editEvent(eventId);
            });
        });
        
        // تحديث عدد المناسبات
        const countElement = document.querySelector('.events-count');
        
        if (countElement) {
            countElement.textContent = data.totalCount;
        }
    },
    
    /**
     * عرض مناسبة
     * @param {string} eventId معرف المناسبة
     */
    viewEvent: function(eventId) {
        // محاكاة عرض المناسبة
        console.log(`عرض المناسبة: ${eventId}`);
        
        // عرض صفحة المناسبة أو نافذة منبثقة
        window.location.href = `event-details.html?id=${eventId}`;
    },
    
    /**
     * تعديل مناسبة
     * @param {string} eventId معرف المناسبة
     */
    editEvent: function(eventId) {
        // محاكاة تعديل المناسبة
        console.log(`تعديل المناسبة: ${eventId}`);
        
        // عرض صفحة تعديل المناسبة أو نافذة منبثقة
        window.location.href = `edit-event.html?id=${eventId}`;
    },
    
    /**
     * تحديث عنصر الدعوات
     * @param {HTMLElement} element العنصر
     * @param {Object} data البيانات
     */
    updateInvitationsElement: function(element, data) {
        // تحديث قائمة الدعوات
        let invitationsHtml = '';
        
        if (data.items.length === 0) {
            invitationsHtml = '<div class="text-center p-3">لا توجد دعوات</div>';
        } else {
            // التحقق من نوع العرض (جدول أو بطاقات)
            if (element.classList.contains('invitations-table')) {
                // عرض جدول
                invitationsHtml = `
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>المناسبة</th>
                                <th>تم إرسالها إلى</th>
                                <th>مؤكد</th>
                                <th>معلق</th>
                                <th>معتذر</th>
                                <th>التاريخ</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.items.map(invitation => `
                                <tr data-id="${invitation.id}" data-date="${invitation.date}" data-name="${invitation.eventTitle}">
                                    <td>${invitation.eventTitle}</td>
                                    <td>${invitation.sentTo}</td>
                                    <td>${invitation.accepted}</td>
                                    <td>${invitation.pending}</td>
                                    <td>${invitation.declined}</td>
                                    <td>${new Date(invitation.date).toLocaleDateString()}</td>
                                    <td>
                                        <button class="btn btn-sm btn-primary view-invitation" data-id="${invitation.id}">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn btn-sm btn-success edit-invitation" data-id="${invitation.id}">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else {
                // عرض بطاقات
                invitationsHtml = `
                    <div class="row">
                        ${data.items.map(invitation => `
                            <div class="col-md-6 col-lg-4 mb-4">
                                <div class="card invitation-card" data-id="${invitation.id}" data-date="${invitation.date}" data-name="${invitation.eventTitle}">
                                    <div class="card-header">
                                        <h5 class="card-title">${invitation.eventTitle}</h5>
                                    </div>
                                    <div class="card-body">
                                        <p><i class="fas fa-paper-plane me-2"></i>تم إرسالها إلى ${invitation.sentTo} ضيف</p>
                                        <div class="invitation-stats">
                                            <div class="stat-item">
                                                <span class="stat-value text-success">${invitation.accepted}</span>
                                                <span class="stat-label">مؤكد</span>
                                            </div>
                                            <div class="stat-item">
                                                <span class="stat-value text-warning">${invitation.pending}</span>
                                                <span class="stat-label">معلق</span>
                                            </div>
                                            <div class="stat-item">
                                                <span class="stat-value text-danger">${invitation.declined}</span>
                                                <span class="stat-label">معتذر</span>
                                            </div>
                                        </div>
                                        <p class="mt-2"><i class="fas fa-calendar-alt me-2"></i>${new Date(invitation.date).toLocaleDateString()}</p>
                                    </div>
                                    <div class="card-footer">
                                        <button class="btn btn-sm btn-primary view-invitation" data-id="${invitation.id}">
                                            <i class="fas fa-eye"></i> عرض
                                        </button>
                                        <button class="btn btn-sm btn-success edit-invitation" data-id="${invitation.id}">
                                            <i class="fas fa-edit"></i> تعديل
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        }
        
        element.innerHTML = invitationsHtml;
        
        // إضافة مستمعي الأحداث لأزرار عرض وتعديل الدعوات
        element.querySelectorAll('.view-invitation').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                
                const invitationId = button.getAttribute('data-id');
                this.viewInvitation(invitationId);
            });
        });
        
        element.querySelectorAll('.edit-invitation').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                
                const invitationId = button.getAttribute('data-id');
                this.editInvitation(invitationId);
            });
        });
        
        // تحديث عدد الدعوات
        const countElement = document.querySelector('.invitations-count');
        
        if (countElement) {
            countElement.textContent = data.totalCount;
        }
    },
    
    /**
     * عرض دعوة
     * @param {string} invitationId معرف الدعوة
     */
    viewInvitation: function(invitationId) {
        // محاكاة عرض الدعوة
        console.log(`عرض الدعوة: ${invitationId}`);
        
        // عرض صفحة الدعوة أو نافذة منبثقة
        window.location.href = `invitation-details.html?id=${invitationId}`;
    },
    
    /**
     * تعديل دعوة
     * @param {string} invitationId معرف الدعوة
     */
    editInvitation: function(invitationId) {
        // محاكاة تعديل الدعوة
        console.log(`تعديل الدعوة: ${invitationId}`);
        
        // عرض صفحة تعديل الدعوة أو نافذة منبثقة
        window.location.href = `edit-invitation.html?id=${invitationId}`;
    },
    
    /**
     * تحديث عنصر الضيوف
     * @param {HTMLElement} element العنصر
     * @param {Object} data البيانات
     */
    updateGuestsElement: function(element, data) {
        // تحديث قائمة الضيوف
        let guestsHtml = '';
        
        if (data.items.length === 0) {
            guestsHtml = '<div class="text-center p-3">لا يوجد ضيوف</div>';
        } else {
            guestsHtml = `
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>الاسم</th>
                            <th>البريد الإلكتروني</th>
                            <th>رقم الهاتف</th>
                            <th>الحالة</th>
                            <th>المناسبة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.items.map(guest => `
                            <tr data-id="${guest.id}">
                                <td>${guest.name}</td>
                                <td>${guest.email}</td>
                                <td>${guest.phone}</td>
                                <td>
                                    <span class="badge ${this.getStatusBadgeClass(guest.status)}">${guest.status}</span>
                                </td>
                                <td>${guest.eventTitle}</td>
                                <td>
                                    <button class="btn btn-sm btn-primary view-guest" data-id="${guest.id}">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-success edit-guest" data-id="${guest.id}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
        
        element.innerHTML = guestsHtml;
        
        // إضافة مستمعي الأحداث لأزرار عرض وتعديل الضيوف
        element.querySelectorAll('.view-guest').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                
                const guestId = button.getAttribute('data-id');
                this.viewGuest(guestId);
            });
        });
        
        element.querySelectorAll('.edit-guest').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                
                const guestId = button.getAttribute('data-id');
                this.editGuest(guestId);
            });
        });
        
        // تحديث عدد الضيوف
        const countElement = document.querySelector('.guests-count');
        
        if (countElement) {
            countElement.textContent = data.totalCount;
        }
    },
    
    /**
     * الحصول على فئة شارة الحالة
     * @param {string} status الحالة
     * @returns {string} فئة الشارة
     */
    getStatusBadgeClass: function(status) {
        switch (status) {
            case 'مؤكد':
                return 'bg-success';
            case 'معلق':
                return 'bg-warning';
            case 'معتذر':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    },
    
    /**
     * عرض ضيف
     * @param {string} guestId معرف الضيف
     */
    viewGuest: function(guestId) {
        // محاكاة عرض الضيف
        console.log(`عرض الضيف: ${guestId}`);
        
        // عرض صفحة الضيف أو نافذة منبثقة
        window.location.href = `guest-details.html?id=${guestId}`;
    },
    
    /**
     * تعديل ضيف
     * @param {string} guestId معرف الضيف
     */
    editGuest: function(guestId) {
        // محاكاة تعديل الضيف
        console.log(`تعديل الضيف: ${guestId}`);
        
        // عرض صفحة تعديل الضيف أو نافذة منبثقة
        window.location.href = `edit-guest.html?id=${guestId}`;
    },
    
    /**
     * تحديث عنصر القوالب
     * @param {HTMLElement} element العنصر
     * @param {Object} data البيانات
     */
    updateTemplatesElement: function(element, data) {
        // تحديث قائمة القوالب
        let templatesHtml = '';
        
        if (data.items.length === 0) {
            templatesHtml = '<div class="text-center p-3">لا توجد قوالب</div>';
        } else {
            templatesHtml = `
                <div class="row">
                    ${data.items.map(template => `
                        <div class="col-md-6 col-lg-4 mb-4">
                            <div class="card template-card" data-id="${template.id}" data-popularity="${template.popularity}" data-name="${template.title}">
                                <img src="assets/images/${template.thumbnail}" class="card-img-top" alt="${template.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${template.title}</h5>
                                    <p class="card-text">
                                        <span class="badge bg-secondary">${template.category}</span>
                                        <span class="ms-2"><i class="fas fa-star text-warning"></i> ${template.popularity}</span>
                                    </p>
                                </div>
                                <div class="card-footer">
                                    <button class="btn btn-sm btn-primary view-template" data-id="${template.id}">
                                        <i class="fas fa-eye"></i> عرض
                                    </button>
                                    <button class="btn btn-sm btn-success use-template" data-id="${template.id}">
                                        <i class="fas fa-check"></i> استخدام
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        element.innerHTML = templatesHtml;
        
        // إضافة مستمعي الأحداث لأزرار عرض واستخدام القوالب
        element.querySelectorAll('.view-template').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                
                const templateId = button.getAttribute('data-id');
                this.viewTemplate(templateId);
            });
        });
        
        element.querySelectorAll('.use-template').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                
                const templateId = button.getAttribute('data-id');
                this.useTemplate(templateId);
            });
        });
        
        // تحديث عدد القوالب
        const countElement = document.querySelector('.templates-count');
        
        if (countElement) {
            countElement.textContent = data.totalCount;
        }
    },
    
    /**
     * عرض قالب
     * @param {string} templateId معرف القالب
     */
    viewTemplate: function(templateId) {
        // محاكاة عرض القالب
        console.log(`عرض القالب: ${templateId}`);
        
        // عرض صفحة القالب أو نافذة منبثقة
        window.location.href = `template-details.html?id=${templateId}`;
    },
    
    /**
     * استخدام قالب
     * @param {string} templateId معرف القالب
     */
    useTemplate: function(templateId) {
        // محاكاة استخدام القالب
        console.log(`استخدام القالب: ${templateId}`);
        
        // عرض صفحة إنشاء دعوة مع القالب المحدد
        window.location.href = `create-invitation.html?template=${templateId}`;
    },
    
    /**
     * تحديث عنصر حالة النظام
     * @param {HTMLElement} element العنصر
     * @param {Object} data البيانات
     */
    updateSystemHealthElement: function(element, data) {
        // تحديث مؤشرات حالة النظام
        const systemHealthHtml = `
            <div class="row">
                <div class="col-md-3 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">استخدام المعالج</h5>
                            <div class="progress mb-2">
                                <div class="progress-bar ${this.getProgressBarClass(data.cpu)}" role="progressbar" style="width: ${data.cpu}%;" aria-valuenow="${data.cpu}" aria-valuemin="0" aria-valuemax="100">${data.cpu}%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">استخدام الذاكرة</h5>
                            <div class="progress mb-2">
                                <div class="progress-bar ${this.getProgressBarClass(data.memory)}" role="progressbar" style="width: ${data.memory}%;" aria-valuenow="${data.memory}" aria-valuemin="0" aria-valuemax="100">${data.memory}%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">استخدام القرص</h5>
                            <div class="progress mb-2">
                                <div class="progress-bar ${this.getProgressBarClass(data.disk)}" role="progressbar" style="width: ${data.disk}%;" aria-valuenow="${data.disk}" aria-valuemin="0" aria-valuemax="100">${data.disk}%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">استخدام الشبكة</h5>
                            <div class="progress mb-2">
                                <div class="progress-bar ${this.getProgressBarClass(data.network)}" role="progressbar" style="width: ${data.network}%;" aria-valuenow="${data.network}" aria-valuemin="0" aria-valuemax="100">${data.network}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">مدة التشغيل</h5>
                            <p class="card-text">${this.formatUptime(data.uptime)}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">المستخدمين النشطين</h5>
                            <p class="card-text">${data.activeUsers} مستخدم</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">الأخطاء والتحذيرات</h5>
                            <p class="card-text">
                                <span class="badge bg-danger">${data.errors} خطأ</span>
                                <span class="badge bg-warning ms-2">${data.warnings} تحذير</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-end">
                <small class="text-muted">آخر تحديث: ${new Date().toLocaleTimeString()}</small>
            </div>
        `;
        
        element.innerHTML = systemHealthHtml;
    },
    
    /**
     * الحصول على فئة شريط التقدم بناءً على القيمة
     * @param {number} value القيمة
     * @returns {string} فئة شريط التقدم
     */
    getProgressBarClass: function(value) {
        if (value < 50) {
            return 'bg-success';
        } else if (value < 80) {
            return 'bg-warning';
        } else {
            return 'bg-danger';
        }
    },
    
    /**
     * تنسيق مدة التشغيل
     * @param {number} uptime مدة التشغيل بالثواني
     * @returns {string} مدة التشغيل المنسقة
     */
    formatUptime: function(uptime) {
        const days = Math.floor(uptime / (24 * 60 * 60));
        const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((uptime % (60 * 60)) / 60);
        
        let result = '';
        
        if (days > 0) {
            result += `${days} يوم `;
        }
        
        if (hours > 0 || days > 0) {
            result += `${hours} ساعة `;
        }
        
        result += `${minutes} دقيقة`;
        
        return result;
    },
    
    /**
     * تحديث الإحصائيات
     */
    updateStatistics: function() {
        this.fetchAndUpdateGenericData('statistics');
    },
    
    /**
     * تحديث الإشعارات
     */
    updateNotifications: function() {
        this.fetchAndUpdateGenericData('notifications');
    },
    
    /**
     * تحديث الرسائل
     */
    updateMessages: function() {
        this.fetchAndUpdateGenericData('messages');
    },
    
    /**
     * تحديث المناسبات
     */
    updateEvents: function() {
        this.fetchAndUpdateGenericData('events');
    },
    
    /**
     * تحديث الدعوات
     */
    updateInvitations: function() {
        this.fetchAndUpdateGenericData('invitations');
    },
    
    /**
     * تحديث الضيوف
     */
    updateGuests: function() {
        this.fetchAndUpdateGenericData('guests');
    },
    
    /**
     * تحديث القوالب
     */
    updateTemplates: function() {
        this.fetchAndUpdateGenericData('templates');
    },
    
    /**
     * تحديث حالة النظام
     */
    updateSystemHealth: function() {
        this.fetchAndUpdateGenericData('system-health');
    }
};

// إضافة أنماط CSS لتأثيرات التحديث
const style = document.createElement('style');
style.textContent = `
    .loading-indicator {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
    }
    
    .realtime-updated {
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
    
    .notification-item, .message-item {
        padding: 10px;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        align-items: flex-start;
    }
    
    .notification-item.unread, .message-item.unread {
        background-color: rgba(0, 123, 255, 0.05);
    }
    
    .notification-icon, .message-sender {
        margin-left: 10px;
        color: #6c757d;
    }
    
    .notification-content, .message-content {
        flex: 1;
    }
    
    .notification-title, .message-sender {
        font-weight: bold;
    }
    
    .notification-message, .message-content {
        margin-top: 5px;
    }
    
    .notification-time, .message-time {
        font-size: 0.8rem;
        color: #6c757d;
        margin-top: 5px;
    }
    
    .notification-actions, .message-actions {
        margin-right: 10px;
    }
    
    .event-card, .invitation-card, .template-card {
        transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .event-card:hover, .invitation-card:hover, .template-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .invitation-stats {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
    }
    
    .stat-item {
        text-align: center;
    }
    
    .stat-value {
        font-size: 1.2rem;
        font-weight: bold;
        display: block;
    }
    
    .stat-label {
        font-size: 0.8rem;
        color: #6c757d;
    }
    
    .realtime-notification {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 9999;
        min-width: 300px;
    }
`;

document.head.appendChild(style);

// تهيئة نظام تحديث البيانات في الوقت الفعلي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    RealTimeUpdates.init();
    
    console.log('تم تهيئة نظام تحديث البيانات في الوقت الفعلي');
});

// تصدير كائن RealTimeUpdates للاستخدام في ملفات أخرى
window.RealTimeUpdates = RealTimeUpdates;
