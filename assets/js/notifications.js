/**
 * نظام الإشعارات في الوقت الفعلي
 * يوفر وظائف لإدارة وعرض الإشعارات للمستخدمين
 */

// كائن لإدارة نظام الإشعارات
const NotificationSystem = {
    // إعدادات افتراضية
    settings: {
        // أنواع الإشعارات
        notificationTypes: [
            { id: 'info', name: 'معلومات', icon: 'info-circle', color: '#2196F3' },
            { id: 'success', name: 'نجاح', icon: 'check-circle', color: '#4CAF50' },
            { id: 'warning', name: 'تحذير', icon: 'exclamation-triangle', color: '#FF9800' },
            { id: 'error', name: 'خطأ', icon: 'times-circle', color: '#F44336' },
            { id: 'system', name: 'نظام', icon: 'cog', color: '#607D8B' }
        ],
        
        // مدة عرض الإشعارات المؤقتة (بالمللي ثانية)
        toastDuration: 5000,
        
        // الحد الأقصى لعدد الإشعارات المعروضة في القائمة
        maxNotificationsInList: 50,
        
        // ما إذا كان يجب تخزين الإشعارات
        storeNotifications: true,
        
        // ما إذا كان يجب عرض الإشعارات المنبثقة
        showToasts: true,
        
        // ما إذا كان يجب تفعيل إشعارات سطح المكتب
        enableDesktopNotifications: true,
        
        // ما إذا كان يجب تفعيل الأصوات
        enableSounds: true,
        
        // مسار ملفات الصوت
        soundsPath: '/assets/sounds/',
        
        // ملفات الصوت
        sounds: {
            info: 'info.mp3',
            success: 'success.mp3',
            warning: 'warning.mp3',
            error: 'error.mp3',
            system: 'system.mp3'
        },
        
        // فترة تحديث الإشعارات (بالمللي ثانية)
        updateInterval: 30000, // 30 ثانية
        
        // ما إذا كان يجب تحديث الإشعارات تلقائياً
        autoUpdateNotifications: true
    },
    
    // حالة النظام
    state: {
        // ما إذا كان نظام الإشعارات مفعلاً
        enabled: false,
        
        // مؤقت تحديث الإشعارات
        updateTimer: null,
        
        // الإشعارات الحالية
        notifications: [],
        
        // عدد الإشعارات غير المقروءة
        unreadCount: 0,
        
        // ما إذا كان المستخدم قد منح إذن إشعارات سطح المكتب
        desktopNotificationsPermission: false,
        
        // العناصر التي تم تحسينها
        enhancedElements: {}
    },
    
    /**
     * تهيئة نظام الإشعارات
     * @param {Object} options خيارات التهيئة
     */
    init: function(options = {}) {
        // دمج الخيارات مع الإعدادات الافتراضية
        this.settings = { ...this.settings, ...options };
        
        // استرجاع الإشعارات المخزنة
        this.retrieveNotifications();
        
        // تحسين عناصر الإشعارات
        this.enhanceNotificationElements();
        
        // طلب إذن إشعارات سطح المكتب
        if (this.settings.enableDesktopNotifications) {
            this.requestDesktopNotificationsPermission();
        }
        
        // بدء تحديث الإشعارات
        if (this.settings.autoUpdateNotifications) {
            this.startUpdating();
        }
        
        // تفعيل نظام الإشعارات
        this.state.enabled = true;
        
        console.log('تم تهيئة نظام الإشعارات');
    },
    
    /**
     * استرجاع الإشعارات المخزنة
     */
    retrieveNotifications: function() {
        // التحقق من وجود الإشعارات في localStorage
        const storedNotifications = localStorage.getItem('notifications');
        
        if (storedNotifications) {
            try {
                // تحليل الإشعارات
                const parsedNotifications = JSON.parse(storedNotifications);
                
                // تعيين الإشعارات
                this.state.notifications = parsedNotifications;
                
                // حساب عدد الإشعارات غير المقروءة
                this.updateUnreadCount();
                
                console.log('تم استرجاع الإشعارات المخزنة');
            } catch (error) {
                console.error('فشل تحليل الإشعارات المخزنة:', error);
                
                // إعادة تعيين الإشعارات
                this.state.notifications = [];
                this.state.unreadCount = 0;
            }
        } else {
            // إعادة تعيين الإشعارات
            this.state.notifications = [];
            this.state.unreadCount = 0;
        }
    },
    
    /**
     * تحسين عناصر الإشعارات
     */
    enhanceNotificationElements: function() {
        // تحديد زر الإشعارات
        const notificationButton = document.querySelector('[data-notifications-button]');
        
        // تحسين زر الإشعارات
        if (notificationButton) {
            // التحقق من أن الزر لم يتم تحسينه بالفعل
            if (notificationButton.hasAttribute('data-enhanced')) {
                return;
            }
            
            // إنشاء شارة عدد الإشعارات غير المقروءة
            const unreadBadge = document.createElement('span');
            unreadBadge.className = 'notification-badge';
            unreadBadge.style.position = 'absolute';
            unreadBadge.style.top = '-5px';
            unreadBadge.style.right = '-5px';
            unreadBadge.style.backgroundColor = '#F44336';
            unreadBadge.style.color = '#fff';
            unreadBadge.style.borderRadius = '50%';
            unreadBadge.style.width = '18px';
            unreadBadge.style.height = '18px';
            unreadBadge.style.fontSize = '12px';
            unreadBadge.style.fontWeight = 'bold';
            unreadBadge.style.display = 'flex';
            unreadBadge.style.justifyContent = 'center';
            unreadBadge.style.alignItems = 'center';
            unreadBadge.textContent = this.state.unreadCount > 0 ? this.state.unreadCount : '';
            unreadBadge.style.display = this.state.unreadCount > 0 ? 'flex' : 'none';
            
            // إضافة شارة عدد الإشعارات غير المقروءة إلى زر الإشعارات
            notificationButton.style.position = 'relative';
            notificationButton.appendChild(unreadBadge);
            
            // إضافة مستمع حدث النقر
            notificationButton.addEventListener('click', () => {
                // عرض قائمة الإشعارات
                this.toggleNotificationsList();
            });
            
            // تعيين سمة تحسين الزر
            notificationButton.setAttribute('data-enhanced', 'true');
            
            // تخزين الزر في حالة النظام
            this.state.enhancedElements.notificationButton = notificationButton;
            this.state.enhancedElements.unreadBadge = unreadBadge;
        }
        
        // تحديد حاوية الإشعارات
        const notificationsContainer = document.querySelector('[data-notifications-container]');
        
        // تحسين حاوية الإشعارات
        if (notificationsContainer) {
            // التحقق من أن الحاوية لم يتم تحسينها بالفعل
            if (notificationsContainer.hasAttribute('data-enhanced')) {
                return;
            }
            
            // إنشاء عنوان الإشعارات
            const notificationsHeader = document.createElement('div');
            notificationsHeader.className = 'notifications-header';
            notificationsHeader.style.display = 'flex';
            notificationsHeader.style.justifyContent = 'space-between';
            notificationsHeader.style.alignItems = 'center';
            notificationsHeader.style.padding = '10px 15px';
            notificationsHeader.style.borderBottom = '1px solid #ddd';
            
            // إنشاء عنوان الإشعارات
            const notificationsTitle = document.createElement('h3');
            notificationsTitle.className = 'notifications-title';
            notificationsTitle.style.margin = '0';
            notificationsTitle.style.fontSize = '16px';
            notificationsTitle.textContent = 'الإشعارات';
            
            // إنشاء أزرار الإجراءات
            const notificationsActions = document.createElement('div');
            notificationsActions.className = 'notifications-actions';
            notificationsActions.style.display = 'flex';
            notificationsActions.style.gap = '5px';
            
            // إنشاء زر تعليم الكل كمقروء
            const markAllAsReadButton = document.createElement('button');
            markAllAsReadButton.className = 'mark-all-as-read-button';
            markAllAsReadButton.style.backgroundColor = 'transparent';
            markAllAsReadButton.style.border = 'none';
            markAllAsReadButton.style.color = '#2196F3';
            markAllAsReadButton.style.cursor = 'pointer';
            markAllAsReadButton.style.fontSize = '12px';
            markAllAsReadButton.textContent = 'تعليم الكل كمقروء';
            
            // إضافة مستمع حدث النقر
            markAllAsReadButton.addEventListener('click', () => {
                // تعليم جميع الإشعارات كمقروءة
                this.markAllAsRead();
            });
            
            // إنشاء زر حذف الكل
            const clearAllButton = document.createElement('button');
            clearAllButton.className = 'clear-all-button';
            clearAllButton.style.backgroundColor = 'transparent';
            clearAllButton.style.border = 'none';
            clearAllButton.style.color = '#F44336';
            clearAllButton.style.cursor = 'pointer';
            clearAllButton.style.fontSize = '12px';
            clearAllButton.textContent = 'حذف الكل';
            
            // إضافة مستمع حدث النقر
            clearAllButton.addEventListener('click', () => {
                // حذف جميع الإشعارات
                this.clearAll();
            });
            
            // إضافة الأزرار إلى أزرار الإجراءات
            notificationsActions.appendChild(markAllAsReadButton);
            notificationsActions.appendChild(clearAllButton);
            
            // إضافة العناصر إلى عنوان الإشعارات
            notificationsHeader.appendChild(notificationsTitle);
            notificationsHeader.appendChild(notificationsActions);
            
            // إنشاء قائمة الإشعارات
            const notificationsList = document.createElement('div');
            notificationsList.className = 'notifications-list';
            notificationsList.style.maxHeight = '400px';
            notificationsList.style.overflowY = 'auto';
            notificationsList.style.padding = '0';
            
            // إضافة العناصر إلى حاوية الإشعارات
            notificationsContainer.innerHTML = '';
            notificationsContainer.appendChild(notificationsHeader);
            notificationsContainer.appendChild(notificationsList);
            
            // تعيين سمة تحسين الحاوية
            notificationsContainer.setAttribute('data-enhanced', 'true');
            
            // تخزين الحاوية في حالة النظام
            this.state.enhancedElements.notificationsContainer = notificationsContainer;
            this.state.enhancedElements.notificationsList = notificationsList;
            this.state.enhancedElements.markAllAsReadButton = markAllAsReadButton;
            this.state.enhancedElements.clearAllButton = clearAllButton;
            
            // تحديث قائمة الإشعارات
            this.updateNotificationsList();
        }
        
        // إنشاء حاوية الإشعارات المنبثقة
        if (!document.getElementById('toast-container')) {
            // إنشاء حاوية الإشعارات المنبثقة
            const toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.style.position = 'fixed';
            toastContainer.style.top = '20px';
            toastContainer.style.left = '20px';
            toastContainer.style.zIndex = '9999';
            toastContainer.style.display = 'flex';
            toastContainer.style.flexDirection = 'column';
            toastContainer.style.gap = '10px';
            
            // إضافة حاوية الإشعارات المنبثقة إلى الصفحة
            document.body.appendChild(toastContainer);
            
            // تخزين حاوية الإشعارات المنبثقة في حالة النظام
            this.state.enhancedElements.toastContainer = toastContainer;
        }
    },
    
    /**
     * طلب إذن إشعارات سطح المكتب
     */
    requestDesktopNotificationsPermission: function() {
        // التحقق من دعم إشعارات سطح المكتب
        if ('Notification' in window) {
            // التحقق من حالة الإذن
            if (Notification.permission === 'granted') {
                // تعيين حالة إذن إشعارات سطح المكتب
                this.state.desktopNotificationsPermission = true;
                
                console.log('تم منح إذن إشعارات سطح المكتب');
            } else if (Notification.permission !== 'denied') {
                // طلب إذن إشعارات سطح المكتب
                Notification.requestPermission().then(permission => {
                    // تعيين حالة إذن إشعارات سطح المكتب
                    this.state.desktopNotificationsPermission = permission === 'granted';
                    
                    console.log(`حالة إذن إشعارات سطح المكتب: ${permission}`);
                });
            }
        } else {
            console.warn('المتصفح لا يدعم إشعارات سطح المكتب');
        }
    },
    
    /**
     * بدء تحديث الإشعارات
     */
    startUpdating: function() {
        // إيقاف المؤقت الحالي
        this.stopUpdating();
        
        // بدء مؤقت جديد
        this.state.updateTimer = setInterval(() => {
            this.fetchNotifications();
        }, this.settings.updateInterval);
        
        console.log('تم بدء تحديث الإشعارات');
    },
    
    /**
     * إيقاف تحديث الإشعارات
     */
    stopUpdating: function() {
        // إيقاف المؤقت الحالي
        if (this.state.updateTimer) {
            clearInterval(this.state.updateTimer);
            this.state.updateTimer = null;
            
            console.log('تم إيقاف تحديث الإشعارات');
        }
    },
    
    /**
     * جلب الإشعارات
     */
    fetchNotifications: function() {
        // في بيئة حقيقية، هذه الدالة ستقوم بجلب الإشعارات من الخادم
        // لأغراض العرض، سنقوم بإنشاء إشعارات عشوائية
        
        // التحقق من احتمالية إنشاء إشعار جديد
        if (Math.random() < 0.3) { // 30% احتمالية
            // إنشاء إشعار جديد
            const notificationTypes = this.settings.notificationTypes;
            const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
            
            // إنشاء محتوى الإشعار
            let title, message;
            
            switch (randomType.id) {
                case 'info':
                    title = 'معلومات جديدة';
                    message = 'تم تحديث معلومات المنصة. انقر للاطلاع على التفاصيل.';
                    break;
                
                case 'success':
                    title = 'تمت العملية بنجاح';
                    message = 'تم إكمال العملية بنجاح. شكراً لاستخدامك المنصة.';
                    break;
                
                case 'warning':
                    title = 'تحذير';
                    message = 'يرجى الانتباه إلى هذا التحذير. انقر للاطلاع على التفاصيل.';
                    break;
                
                case 'error':
                    title = 'خطأ';
                    message = 'حدث خطأ أثناء تنفيذ العملية. يرجى المحاولة مرة أخرى.';
                    break;
                
                case 'system':
                    title = 'إشعار نظام';
                    message = 'هناك تحديث جديد للنظام. انقر للاطلاع على التفاصيل.';
                    break;
                
                default:
                    title = 'إشعار جديد';
                    message = 'لديك إشعار جديد. انقر للاطلاع على التفاصيل.';
                    break;
            }
            
            // إضافة الإشعار
            this.addNotification({
                id: 'notification-' + Date.now(),
                type: randomType.id,
                title: title,
                message: message,
                timestamp: new Date(),
                read: false,
                link: '#'
            });
        }
    },
    
    /**
     * إضافة إشعار
     * @param {Object} notification الإشعار
     */
    addNotification: function(notification) {
        // التحقق من أن نظام الإشعارات مفعل
        if (!this.state.enabled) {
            return;
        }
        
        // إضافة الإشعار إلى قائمة الإشعارات
        this.state.notifications.unshift(notification);
        
        // التحقق من عدد الإشعارات
        if (this.state.notifications.length > this.settings.maxNotificationsInList) {
            // إزالة أقدم إشعار
            this.state.notifications.pop();
        }
        
        // تحديث عدد الإشعارات غير المقروءة
        this.updateUnreadCount();
        
        // تحديث قائمة الإشعارات
        this.updateNotificationsList();
        
        // تخزين الإشعارات
        if (this.settings.storeNotifications) {
            this.storeNotifications();
        }
        
        // عرض الإشعار المنبثق
        if (this.settings.showToasts) {
            this.showToast(notification);
        }
        
        // عرض إشعار سطح المكتب
        if (this.settings.enableDesktopNotifications && this.state.desktopNotificationsPermission) {
            this.showDesktopNotification(notification);
        }
        
        // تشغيل صوت الإشعار
        if (this.settings.enableSounds) {
            this.playNotificationSound(notification.type);
        }
        
        console.log('تم إضافة إشعار جديد:', notification);
    },
    
    /**
     * تحديث عدد الإشعارات غير المقروءة
     */
    updateUnreadCount: function() {
        // حساب عدد الإشعارات غير المقروءة
        this.state.unreadCount = this.state.notifications.filter(notification => !notification.read).length;
        
        // تحديث شارة عدد الإشعارات غير المقروءة
        if (this.state.enhancedElements.unreadBadge) {
            // تحديث نص الشارة
            this.state.enhancedElements.unreadBadge.textContent = this.state.unreadCount > 0 ? this.state.unreadCount : '';
            
            // تحديث حالة عرض الشارة
            this.state.enhancedElements.unreadBadge.style.display = this.state.unreadCount > 0 ? 'flex' : 'none';
        }
    },
    
    /**
     * تحديث قائمة الإشعارات
     */
    updateNotificationsList: function() {
        // التحقق من وجود قائمة الإشعارات
        if (!this.state.enhancedElements.notificationsList) {
            return;
        }
        
        // الحصول على قائمة الإشعارات
        const notificationsList = this.state.enhancedElements.notificationsList;
        
        // إزالة جميع العناصر من قائمة الإشعارات
        notificationsList.innerHTML = '';
        
        // التحقق من وجود إشعارات
        if (this.state.notifications.length === 0) {
            // إنشاء عنصر لا توجد إشعارات
            const noNotificationsItem = document.createElement('div');
            noNotificationsItem.className = 'no-notifications';
            noNotificationsItem.style.padding = '20px';
            noNotificationsItem.style.textAlign = 'center';
            noNotificationsItem.style.color = '#666';
            noNotificationsItem.textContent = 'لا توجد إشعارات';
            
            // إضافة العنصر إلى قائمة الإشعارات
            notificationsList.appendChild(noNotificationsItem);
        } else {
            // إضافة كل إشعار إلى قائمة الإشعارات
            this.state.notifications.forEach(notification => {
                // إنشاء عنصر الإشعار
                const notificationItem = document.createElement('div');
                notificationItem.className = `notification-item notification-${notification.type}`;
                notificationItem.setAttribute('data-notification-id', notification.id);
                notificationItem.style.padding = '10px 15px';
                notificationItem.style.borderBottom = '1px solid #eee';
                notificationItem.style.backgroundColor = notification.read ? '#fff' : '#f8f8f8';
                notificationItem.style.cursor = 'pointer';
                notificationItem.style.transition = 'background-color 0.3s ease';
                
                // إضافة تأثير التحويم
                notificationItem.addEventListener('mouseenter', () => {
                    notificationItem.style.backgroundColor = '#f0f0f0';
                });
                
                notificationItem.addEventListener('mouseleave', () => {
                    notificationItem.style.backgroundColor = notification.read ? '#fff' : '#f8f8f8';
                });
                
                // إضافة مستمع حدث النقر
                notificationItem.addEventListener('click', () => {
                    // تعليم الإشعار كمقروء
                    this.markAsRead(notification.id);
                    
                    // فتح رابط الإشعار
                    if (notification.link) {
                        window.location.href = notification.link;
                    }
                });
                
                // إنشاء محتوى الإشعار
                const notificationContent = document.createElement('div');
                notificationContent.className = 'notification-content';
                notificationContent.style.display = 'flex';
                notificationContent.style.gap = '10px';
                
                // إنشاء أيقونة الإشعار
                const notificationIcon = document.createElement('div');
                notificationIcon.className = 'notification-icon';
                notificationIcon.style.width = '24px';
                notificationIcon.style.height = '24px';
                notificationIcon.style.borderRadius = '50%';
                notificationIcon.style.backgroundColor = this.getNotificationTypeColor(notification.type);
                notificationIcon.style.color = '#fff';
                notificationIcon.style.display = 'flex';
                notificationIcon.style.justifyContent = 'center';
                notificationIcon.style.alignItems = 'center';
                notificationIcon.style.flexShrink = '0';
                notificationIcon.innerHTML = this.getNotificationTypeIcon(notification.type);
                
                // إنشاء نص الإشعار
                const notificationText = document.createElement('div');
                notificationText.className = 'notification-text';
                notificationText.style.flexGrow = '1';
                
                // إنشاء عنوان الإشعار
                const notificationTitle = document.createElement('div');
                notificationTitle.className = 'notification-title';
                notificationTitle.style.fontWeight = 'bold';
                notificationTitle.style.marginBottom = '5px';
                notificationTitle.textContent = notification.title;
                
                // إنشاء رسالة الإشعار
                const notificationMessage = document.createElement('div');
                notificationMessage.className = 'notification-message';
                notificationMessage.style.fontSize = '14px';
                notificationMessage.style.color = '#666';
                notificationMessage.style.marginBottom = '5px';
                notificationMessage.textContent = notification.message;
                
                // إنشاء وقت الإشعار
                const notificationTime = document.createElement('div');
                notificationTime.className = 'notification-time';
                notificationTime.style.fontSize = '12px';
                notificationTime.style.color = '#999';
                notificationTime.textContent = this.formatTimestamp(notification.timestamp);
                
                // إضافة العناصر إلى نص الإشعار
                notificationText.appendChild(notificationTitle);
                notificationText.appendChild(notificationMessage);
                notificationText.appendChild(notificationTime);
                
                // إنشاء إجراءات الإشعار
                const notificationActions = document.createElement('div');
                notificationActions.className = 'notification-actions';
                notificationActions.style.display = 'flex';
                notificationActions.style.flexDirection = 'column';
                notificationActions.style.gap = '5px';
                
                // إنشاء زر تعليم كمقروء/غير مقروء
                const toggleReadButton = document.createElement('button');
                toggleReadButton.className = 'toggle-read-button';
                toggleReadButton.style.backgroundColor = 'transparent';
                toggleReadButton.style.border = 'none';
                toggleReadButton.style.color = '#2196F3';
                toggleReadButton.style.cursor = 'pointer';
                toggleReadButton.style.fontSize = '12px';
                toggleReadButton.style.padding = '0';
                toggleReadButton.textContent = notification.read ? 'تعليم كغير مقروء' : 'تعليم كمقروء';
                
                // إضافة مستمع حدث النقر
                toggleReadButton.addEventListener('click', event => {
                    // منع انتشار الحدث
                    event.stopPropagation();
                    
                    // تبديل حالة قراءة الإشعار
                    this.toggleRead(notification.id);
                });
                
                // إنشاء زر حذف
                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.style.backgroundColor = 'transparent';
                deleteButton.style.border = 'none';
                deleteButton.style.color = '#F44336';
                deleteButton.style.cursor = 'pointer';
                deleteButton.style.fontSize = '12px';
                deleteButton.style.padding = '0';
                deleteButton.textContent = 'حذف';
                
                // إضافة مستمع حدث النقر
                deleteButton.addEventListener('click', event => {
                    // منع انتشار الحدث
                    event.stopPropagation();
                    
                    // حذف الإشعار
                    this.deleteNotification(notification.id);
                });
                
                // إضافة الأزرار إلى إجراءات الإشعار
                notificationActions.appendChild(toggleReadButton);
                notificationActions.appendChild(deleteButton);
                
                // إضافة العناصر إلى محتوى الإشعار
                notificationContent.appendChild(notificationIcon);
                notificationContent.appendChild(notificationText);
                notificationContent.appendChild(notificationActions);
                
                // إضافة محتوى الإشعار إلى عنصر الإشعار
                notificationItem.appendChild(notificationContent);
                
                // إضافة عنصر الإشعار إلى قائمة الإشعارات
                notificationsList.appendChild(notificationItem);
            });
        }
    },
    
    /**
     * تبديل عرض قائمة الإشعارات
     */
    toggleNotificationsList: function() {
        // التحقق من وجود حاوية الإشعارات
        if (!this.state.enhancedElements.notificationsContainer) {
            return;
        }
        
        // الحصول على حاوية الإشعارات
        const notificationsContainer = this.state.enhancedElements.notificationsContainer;
        
        // تبديل حالة عرض حاوية الإشعارات
        if (notificationsContainer.style.display === 'none' || !notificationsContainer.style.display) {
            // عرض حاوية الإشعارات
            notificationsContainer.style.display = 'block';
            
            // تحديث قائمة الإشعارات
            this.updateNotificationsList();
        } else {
            // إخفاء حاوية الإشعارات
            notificationsContainer.style.display = 'none';
        }
    },
    
    /**
     * تعليم إشعار كمقروء
     * @param {string} id معرف الإشعار
     */
    markAsRead: function(id) {
        // البحث عن الإشعار
        const notificationIndex = this.state.notifications.findIndex(notification => notification.id === id);
        
        // التحقق من وجود الإشعار
        if (notificationIndex !== -1) {
            // تعليم الإشعار كمقروء
            this.state.notifications[notificationIndex].read = true;
            
            // تحديث عدد الإشعارات غير المقروءة
            this.updateUnreadCount();
            
            // تحديث قائمة الإشعارات
            this.updateNotificationsList();
            
            // تخزين الإشعارات
            if (this.settings.storeNotifications) {
                this.storeNotifications();
            }
            
            console.log(`تم تعليم الإشعار كمقروء: ${id}`);
        }
    },
    
    /**
     * تعليم إشعار كغير مقروء
     * @param {string} id معرف الإشعار
     */
    markAsUnread: function(id) {
        // البحث عن الإشعار
        const notificationIndex = this.state.notifications.findIndex(notification => notification.id === id);
        
        // التحقق من وجود الإشعار
        if (notificationIndex !== -1) {
            // تعليم الإشعار كغير مقروء
            this.state.notifications[notificationIndex].read = false;
            
            // تحديث عدد الإشعارات غير المقروءة
            this.updateUnreadCount();
            
            // تحديث قائمة الإشعارات
            this.updateNotificationsList();
            
            // تخزين الإشعارات
            if (this.settings.storeNotifications) {
                this.storeNotifications();
            }
            
            console.log(`تم تعليم الإشعار كغير مقروء: ${id}`);
        }
    },
    
    /**
     * تبديل حالة قراءة إشعار
     * @param {string} id معرف الإشعار
     */
    toggleRead: function(id) {
        // البحث عن الإشعار
        const notificationIndex = this.state.notifications.findIndex(notification => notification.id === id);
        
        // التحقق من وجود الإشعار
        if (notificationIndex !== -1) {
            // تبديل حالة قراءة الإشعار
            this.state.notifications[notificationIndex].read = !this.state.notifications[notificationIndex].read;
            
            // تحديث عدد الإشعارات غير المقروءة
            this.updateUnreadCount();
            
            // تحديث قائمة الإشعارات
            this.updateNotificationsList();
            
            // تخزين الإشعارات
            if (this.settings.storeNotifications) {
                this.storeNotifications();
            }
            
            console.log(`تم تبديل حالة قراءة الإشعار: ${id}`);
        }
    },
    
    /**
     * تعليم جميع الإشعارات كمقروءة
     */
    markAllAsRead: function() {
        // تعليم جميع الإشعارات كمقروءة
        this.state.notifications.forEach(notification => {
            notification.read = true;
        });
        
        // تحديث عدد الإشعارات غير المقروءة
        this.updateUnreadCount();
        
        // تحديث قائمة الإشعارات
        this.updateNotificationsList();
        
        // تخزين الإشعارات
        if (this.settings.storeNotifications) {
            this.storeNotifications();
        }
        
        console.log('تم تعليم جميع الإشعارات كمقروءة');
    },
    
    /**
     * حذف إشعار
     * @param {string} id معرف الإشعار
     */
    deleteNotification: function(id) {
        // البحث عن الإشعار
        const notificationIndex = this.state.notifications.findIndex(notification => notification.id === id);
        
        // التحقق من وجود الإشعار
        if (notificationIndex !== -1) {
            // حذف الإشعار
            this.state.notifications.splice(notificationIndex, 1);
            
            // تحديث عدد الإشعارات غير المقروءة
            this.updateUnreadCount();
            
            // تحديث قائمة الإشعارات
            this.updateNotificationsList();
            
            // تخزين الإشعارات
            if (this.settings.storeNotifications) {
                this.storeNotifications();
            }
            
            console.log(`تم حذف الإشعار: ${id}`);
        }
    },
    
    /**
     * حذف جميع الإشعارات
     */
    clearAll: function() {
        // حذف جميع الإشعارات
        this.state.notifications = [];
        
        // تحديث عدد الإشعارات غير المقروءة
        this.updateUnreadCount();
        
        // تحديث قائمة الإشعارات
        this.updateNotificationsList();
        
        // تخزين الإشعارات
        if (this.settings.storeNotifications) {
            this.storeNotifications();
        }
        
        console.log('تم حذف جميع الإشعارات');
    },
    
    /**
     * عرض إشعار منبثق
     * @param {Object} notification الإشعار
     */
    showToast: function(notification) {
        // التحقق من وجود حاوية الإشعارات المنبثقة
        if (!this.state.enhancedElements.toastContainer) {
            return;
        }
        
        // الحصول على حاوية الإشعارات المنبثقة
        const toastContainer = this.state.enhancedElements.toastContainer;
        
        // إنشاء الإشعار المنبثق
        const toast = document.createElement('div');
        toast.className = `toast toast-${notification.type}`;
        toast.style.backgroundColor = '#fff';
        toast.style.borderRadius = '5px';
        toast.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        toast.style.padding = '10px 15px';
        toast.style.marginBottom = '10px';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '10px';
        toast.style.borderRight = `5px solid ${this.getNotificationTypeColor(notification.type)}`;
        toast.style.maxWidth = '300px';
        toast.style.animation = 'fadeIn 0.3s ease';
        
        // إنشاء أيقونة الإشعار
        const toastIcon = document.createElement('div');
        toastIcon.className = 'toast-icon';
        toastIcon.style.width = '24px';
        toastIcon.style.height = '24px';
        toastIcon.style.borderRadius = '50%';
        toastIcon.style.backgroundColor = this.getNotificationTypeColor(notification.type);
        toastIcon.style.color = '#fff';
        toastIcon.style.display = 'flex';
        toastIcon.style.justifyContent = 'center';
        toastIcon.style.alignItems = 'center';
        toastIcon.style.flexShrink = '0';
        toastIcon.innerHTML = this.getNotificationTypeIcon(notification.type);
        
        // إنشاء محتوى الإشعار
        const toastContent = document.createElement('div');
        toastContent.className = 'toast-content';
        toastContent.style.flexGrow = '1';
        
        // إنشاء عنوان الإشعار
        const toastTitle = document.createElement('div');
        toastTitle.className = 'toast-title';
        toastTitle.style.fontWeight = 'bold';
        toastTitle.style.marginBottom = '5px';
        toastTitle.textContent = notification.title;
        
        // إنشاء رسالة الإشعار
        const toastMessage = document.createElement('div');
        toastMessage.className = 'toast-message';
        toastMessage.style.fontSize = '14px';
        toastMessage.style.color = '#666';
        toastMessage.textContent = notification.message;
        
        // إضافة العناصر إلى محتوى الإشعار
        toastContent.appendChild(toastTitle);
        toastContent.appendChild(toastMessage);
        
        // إنشاء زر إغلاق الإشعار
        const toastClose = document.createElement('button');
        toastClose.className = 'toast-close';
        toastClose.style.backgroundColor = 'transparent';
        toastClose.style.border = 'none';
        toastClose.style.color = '#999';
        toastClose.style.cursor = 'pointer';
        toastClose.style.fontSize = '16px';
        toastClose.style.padding = '0';
        toastClose.style.marginRight = '-5px';
        toastClose.innerHTML = '&times;';
        
        // إضافة مستمع حدث النقر
        toastClose.addEventListener('click', () => {
            // إزالة الإشعار المنبثق
            this.removeToast(toast);
        });
        
        // إضافة العناصر إلى الإشعار المنبثق
        toast.appendChild(toastIcon);
        toast.appendChild(toastContent);
        toast.appendChild(toastClose);
        
        // إضافة الإشعار المنبثق إلى حاوية الإشعارات المنبثقة
        toastContainer.appendChild(toast);
        
        // إضافة مستمع حدث النقر
        toast.addEventListener('click', () => {
            // تعليم الإشعار كمقروء
            this.markAsRead(notification.id);
            
            // فتح رابط الإشعار
            if (notification.link) {
                window.location.href = notification.link;
            }
            
            // إزالة الإشعار المنبثق
            this.removeToast(toast);
        });
        
        // إزالة الإشعار المنبثق بعد فترة
        setTimeout(() => {
            this.removeToast(toast);
        }, this.settings.toastDuration);
    },
    
    /**
     * إزالة إشعار منبثق
     * @param {HTMLElement} toast الإشعار المنبثق
     */
    removeToast: function(toast) {
        // إضافة تأثير الإخفاء
        toast.style.animation = 'fadeOut 0.3s ease';
        
        // إزالة الإشعار المنبثق بعد انتهاء التأثير
        setTimeout(() => {
            toast.remove();
        }, 300);
    },
    
    /**
     * عرض إشعار سطح المكتب
     * @param {Object} notification الإشعار
     */
    showDesktopNotification: function(notification) {
        // التحقق من دعم إشعارات سطح المكتب
        if (!('Notification' in window)) {
            return;
        }
        
        // التحقق من إذن إشعارات سطح المكتب
        if (Notification.permission !== 'granted') {
            return;
        }
        
        // إنشاء إشعار سطح المكتب
        const desktopNotification = new Notification(notification.title, {
            body: notification.message,
            icon: '/assets/images/notification-icon.png'
        });
        
        // إضافة مستمع حدث النقر
        desktopNotification.onclick = () => {
            // تعليم الإشعار كمقروء
            this.markAsRead(notification.id);
            
            // فتح رابط الإشعار
            if (notification.link) {
                window.location.href = notification.link;
            }
            
            // إغلاق إشعار سطح المكتب
            desktopNotification.close();
        };
    },
    
    /**
     * تشغيل صوت الإشعار
     * @param {string} type نوع الإشعار
     */
    playNotificationSound: function(type) {
        // التحقق من دعم الصوت
        if (!('Audio' in window)) {
            return;
        }
        
        // الحصول على ملف الصوت
        const soundFile = this.settings.sounds[type] || this.settings.sounds.info;
        
        // إنشاء عنصر الصوت
        const audio = new Audio(this.settings.soundsPath + soundFile);
        
        // تشغيل الصوت
        audio.play().catch(error => {
            console.warn('فشل تشغيل صوت الإشعار:', error);
        });
    },
    
    /**
     * تخزين الإشعارات
     */
    storeNotifications: function() {
        // تخزين الإشعارات في localStorage
        localStorage.setItem('notifications', JSON.stringify(this.state.notifications));
        
        console.log('تم تخزين الإشعارات');
    },
    
    /**
     * الحصول على لون نوع الإشعار
     * @param {string} type نوع الإشعار
     * @returns {string} لون نوع الإشعار
     */
    getNotificationTypeColor: function(type) {
        // البحث عن نوع الإشعار
        const notificationType = this.settings.notificationTypes.find(t => t.id === type);
        
        // التحقق من وجود نوع الإشعار
        if (notificationType) {
            return notificationType.color;
        }
        
        // إرجاع اللون الافتراضي
        return '#2196F3';
    },
    
    /**
     * الحصول على أيقونة نوع الإشعار
     * @param {string} type نوع الإشعار
     * @returns {string} أيقونة نوع الإشعار
     */
    getNotificationTypeIcon: function(type) {
        // البحث عن نوع الإشعار
        const notificationType = this.settings.notificationTypes.find(t => t.id === type);
        
        // التحقق من وجود نوع الإشعار
        if (notificationType) {
            // إرجاع أيقونة نوع الإشعار
            switch (notificationType.icon) {
                case 'info-circle':
                    return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>';
                
                case 'check-circle':
                    return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>';
                
                case 'exclamation-triangle':
                    return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>';
                
                case 'times-circle':
                    return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>';
                
                case 'cog':
                    return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/></svg>';
                
                default:
                    return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>';
            }
        }
        
        // إرجاع الأيقونة الافتراضية
        return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>';
    },
    
    /**
     * تنسيق الطابع الزمني
     * @param {string|Date} timestamp الطابع الزمني
     * @returns {string} الطابع الزمني المنسق
     */
    formatTimestamp: function(timestamp) {
        // تحويل الطابع الزمني إلى كائن Date
        const date = new Date(timestamp);
        
        // الحصول على الوقت الحالي
        const now = new Date();
        
        // حساب الفرق بالمللي ثانية
        const diff = now - date;
        
        // تنسيق الطابع الزمني
        if (diff < 60000) { // أقل من دقيقة
            return 'منذ لحظات';
        } else if (diff < 3600000) { // أقل من ساعة
            const minutes = Math.floor(diff / 60000);
            return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
        } else if (diff < 86400000) { // أقل من يوم
            const hours = Math.floor(diff / 3600000);
            return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
        } else if (diff < 604800000) { // أقل من أسبوع
            const days = Math.floor(diff / 86400000);
            return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
        } else {
            // تنسيق التاريخ
            return date.toLocaleDateString('ar-SA');
        }
    }
};

// إضافة أنماط CSS للإشعارات المنبثقة
const addNotificationStyles = function() {
    // إنشاء عنصر الأنماط
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(-20px); }
        }
    `;
    
    // إضافة عنصر الأنماط إلى الصفحة
    document.head.appendChild(style);
};

// تهيئة نظام الإشعارات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إضافة أنماط CSS للإشعارات المنبثقة
    addNotificationStyles();
    
    // تهيئة نظام الإشعارات
    NotificationSystem.init();
    
    console.log('تم تهيئة نظام الإشعارات');
});

// تصدير كائن NotificationSystem للاستخدام في ملفات أخرى
window.NotificationSystem = NotificationSystem;
