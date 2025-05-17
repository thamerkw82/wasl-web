/**
 * نظام إدارة تفضيلات المستخدم
 * يتيح تخزين واسترجاع تفضيلات المستخدم باستخدام localStorage
 */

// كائن لإدارة تفضيلات المستخدم
const UserPreferences = {
    // الإعدادات الافتراضية
    defaults: {
        // إعدادات العرض
        display: {
            fontSize: 'medium',      // حجم الخط: small, medium, large
            tableRows: 10,           // عدد الصفوف في الجداول
            cardSize: 'medium',      // حجم البطاقات: small, medium, large
            sidebarCollapsed: false, // حالة القائمة الجانبية: مطوية أم لا
            dashboardLayout: 'grid', // تخطيط لوحة التحكم: grid, list
        },
        
        // إعدادات الفرز والتصفية
        sorting: {
            eventsSort: 'date-desc',     // فرز المناسبات: date-desc, date-asc, name-asc, name-desc
            invitationsSort: 'date-desc', // فرز الدعوات: date-desc, date-asc, name-asc, name-desc
            templatesSort: 'popular',     // فرز القوالب: popular, newest, oldest, name-asc, name-desc
        },
        
        // إعدادات الإشعارات
        notifications: {
            showNotifications: true,     // عرض الإشعارات
            notificationSound: true,     // تشغيل صوت الإشعارات
            emailNotifications: true,    // إرسال إشعارات بالبريد الإلكتروني
            desktopNotifications: false, // إشعارات سطح المكتب
        },
        
        // إعدادات التصميم
        design: {
            colorScheme: 'default',      // نظام الألوان: default, high-contrast
            animationsEnabled: true,     // تفعيل الرسوم المتحركة
            borderRadius: 'medium',      // نصف قطر الحواف: small, medium, large
            buttonStyle: 'default',      // نمط الأزرار: default, flat, outline
        },
        
        // إعدادات متنوعة
        misc: {
            autoSave: true,              // حفظ تلقائي للنماذج
            confirmBeforeDelete: true,   // تأكيد قبل الحذف
            showTips: true,              // عرض نصائح الاستخدام
            lastVisitedPage: '',         // آخر صفحة تمت زيارتها
        }
    },
    
    /**
     * تهيئة نظام تفضيلات المستخدم
     */
    init: function() {
        // التحقق من وجود تفضيلات محفوظة
        if (!this.getAllPreferences()) {
            // إذا لم تكن هناك تفضيلات محفوظة، استخدم الإعدادات الافتراضية
            this.resetToDefaults();
        }
        
        // تطبيق التفضيلات المحفوظة
        this.applyPreferences();
        
        // إضافة مستمعي الأحداث
        this.setupEventListeners();
        
        console.log('تم تهيئة نظام تفضيلات المستخدم');
    },
    
    /**
     * الحصول على جميع تفضيلات المستخدم
     * @returns {Object|null} كائن يحتوي على جميع التفضيلات أو null إذا لم تكن هناك تفضيلات محفوظة
     */
    getAllPreferences: function() {
        const preferencesJson = localStorage.getItem('userPreferences');
        return preferencesJson ? JSON.parse(preferencesJson) : null;
    },
    
    /**
     * الحصول على قيمة تفضيل محدد
     * @param {string} category فئة التفضيل (display, sorting, notifications, design, misc)
     * @param {string} key مفتاح التفضيل
     * @returns {*} قيمة التفضيل أو القيمة الافتراضية إذا لم يكن موجوداً
     */
    getPreference: function(category, key) {
        const preferences = this.getAllPreferences();
        
        if (preferences && preferences[category] && preferences[category][key] !== undefined) {
            return preferences[category][key];
        }
        
        // إرجاع القيمة الافتراضية إذا لم يكن التفضيل موجوداً
        return this.defaults[category] && this.defaults[category][key] !== undefined 
            ? this.defaults[category][key] 
            : null;
    },
    
    /**
     * تعيين قيمة تفضيل محدد
     * @param {string} category فئة التفضيل (display, sorting, notifications, design, misc)
     * @param {string} key مفتاح التفضيل
     * @param {*} value القيمة الجديدة
     */
    setPreference: function(category, key, value) {
        let preferences = this.getAllPreferences() || JSON.parse(JSON.stringify(this.defaults));
        
        // التأكد من وجود الفئة
        if (!preferences[category]) {
            preferences[category] = {};
        }
        
        // تعيين القيمة الجديدة
        preferences[category][key] = value;
        
        // حفظ التفضيلات
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        
        // تطبيق التغيير فوراً
        this.applySpecificPreference(category, key, value);
        
        console.log(`تم تعيين التفضيل: ${category}.${key} = ${value}`);
        
        // إطلاق حدث تغيير التفضيلات
        this.triggerPreferenceChangeEvent(category, key, value);
    },
    
    /**
     * إعادة تعيين جميع التفضيلات إلى الإعدادات الافتراضية
     */
    resetToDefaults: function() {
        localStorage.setItem('userPreferences', JSON.stringify(this.defaults));
        this.applyPreferences();
        console.log('تم إعادة تعيين جميع التفضيلات إلى الإعدادات الافتراضية');
        
        // إطلاق حدث إعادة تعيين التفضيلات
        document.dispatchEvent(new CustomEvent('preferencesReset'));
    },
    
    /**
     * تطبيق جميع التفضيلات المحفوظة
     */
    applyPreferences: function() {
        const preferences = this.getAllPreferences();
        
        if (!preferences) return;
        
        // تطبيق إعدادات العرض
        this.applyDisplayPreferences(preferences.display);
        
        // تطبيق إعدادات الفرز والتصفية
        this.applySortingPreferences(preferences.sorting);
        
        // تطبيق إعدادات الإشعارات
        this.applyNotificationPreferences(preferences.notifications);
        
        // تطبيق إعدادات التصميم
        this.applyDesignPreferences(preferences.design);
        
        // تطبيق الإعدادات المتنوعة
        this.applyMiscPreferences(preferences.misc);
    },
    
    /**
     * تطبيق تفضيل محدد
     * @param {string} category فئة التفضيل
     * @param {string} key مفتاح التفضيل
     * @param {*} value القيمة
     */
    applySpecificPreference: function(category, key, value) {
        switch (category) {
            case 'display':
                this.applyDisplayPreference(key, value);
                break;
            case 'sorting':
                this.applySortingPreference(key, value);
                break;
            case 'notifications':
                this.applyNotificationPreference(key, value);
                break;
            case 'design':
                this.applyDesignPreference(key, value);
                break;
            case 'misc':
                this.applyMiscPreference(key, value);
                break;
        }
    },
    
    /**
     * تطبيق إعدادات العرض
     * @param {Object} displayPreferences إعدادات العرض
     */
    applyDisplayPreferences: function(displayPreferences) {
        if (!displayPreferences) return;
        
        // تطبيق كل إعداد عرض
        Object.keys(displayPreferences).forEach(key => {
            this.applyDisplayPreference(key, displayPreferences[key]);
        });
    },
    
    /**
     * تطبيق إعداد عرض محدد
     * @param {string} key مفتاح الإعداد
     * @param {*} value القيمة
     */
    applyDisplayPreference: function(key, value) {
        switch (key) {
            case 'fontSize':
                document.documentElement.setAttribute('data-font-size', value);
                break;
            case 'tableRows':
                document.querySelectorAll('.data-table').forEach(table => {
                    if (table.dataset.usePreferences === 'true') {
                        this.updateTableRowsDisplay(table, value);
                    }
                });
                break;
            case 'cardSize':
                document.documentElement.setAttribute('data-card-size', value);
                break;
            case 'sidebarCollapsed':
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) {
                    if (value) {
                        sidebar.classList.add('collapsed');
                        document.body.classList.add('sidebar-collapsed');
                    } else {
                        sidebar.classList.remove('collapsed');
                        document.body.classList.remove('sidebar-collapsed');
                    }
                }
                break;
            case 'dashboardLayout':
                const dashboard = document.querySelector('.dashboard-content');
                if (dashboard) {
                    dashboard.setAttribute('data-layout', value);
                }
                break;
        }
    },
    
    /**
     * تحديث عرض صفوف الجدول
     * @param {HTMLElement} table عنصر الجدول
     * @param {number} rowCount عدد الصفوف
     */
    updateTableRowsDisplay: function(table, rowCount) {
        const rows = table.querySelectorAll('tbody tr');
        const paginationContainer = table.nextElementSibling?.classList.contains('pagination-container') 
            ? table.nextElementSibling 
            : null;
        
        if (rows.length <= rowCount) {
            // إذا كان عدد الصفوف أقل من أو يساوي العدد المطلوب، عرض جميع الصفوف وإخفاء التصفح
            rows.forEach(row => row.style.display = '');
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }
        
        // إخفاء جميع الصفوف أولاً
        rows.forEach(row => row.style.display = 'none');
        
        // عرض الصفوف المطلوبة فقط
        for (let i = 0; i < rowCount; i++) {
            if (rows[i]) rows[i].style.display = '';
        }
        
        // إنشاء أو تحديث عناصر التصفح
        if (paginationContainer) {
            this.updatePagination(paginationContainer, rows.length, rowCount, 1);
        } else {
            this.createPagination(table, rows.length, rowCount);
        }
    },
    
    /**
     * إنشاء عناصر التصفح
     * @param {HTMLElement} table عنصر الجدول
     * @param {number} totalRows إجمالي عدد الصفوف
     * @param {number} rowsPerPage عدد الصفوف في الصفحة
     */
    createPagination: function(table, totalRows, rowsPerPage) {
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container mt-3';
        
        this.updatePagination(paginationContainer, totalRows, rowsPerPage, 1);
        
        table.parentNode.insertBefore(paginationContainer, table.nextSibling);
    },
    
    /**
     * تحديث عناصر التصفح
     * @param {HTMLElement} container حاوية عناصر التصفح
     * @param {number} totalRows إجمالي عدد الصفوف
     * @param {number} rowsPerPage عدد الصفوف في الصفحة
     * @param {number} currentPage الصفحة الحالية
     */
    updatePagination: function(container, totalRows, rowsPerPage, currentPage) {
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        
        // إذا كانت هناك صفحة واحدة فقط، إخفاء التصفح
        if (totalPages <= 1) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = '';
        container.innerHTML = '';
        
        const pagination = document.createElement('ul');
        pagination.className = 'pagination justify-content-center';
        
        // زر الصفحة السابقة
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        const prevLink = document.createElement('a');
        prevLink.className = 'page-link';
        prevLink.href = '#';
        prevLink.setAttribute('aria-label', 'السابق');
        prevLink.innerHTML = '<span aria-hidden="true">&laquo;</span>';
        prevLi.appendChild(prevLink);
        pagination.appendChild(prevLi);
        
        // أزرار الصفحات
        for (let i = 1; i <= totalPages; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
            const pageLink = document.createElement('a');
            pageLink.className = 'page-link';
            pageLink.href = '#';
            pageLink.textContent = i;
            pageLink.dataset.page = i;
            pageLi.appendChild(pageLink);
            pagination.appendChild(pageLi);
        }
        
        // زر الصفحة التالية
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        const nextLink = document.createElement('a');
        nextLink.className = 'page-link';
        nextLink.href = '#';
        nextLink.setAttribute('aria-label', 'التالي');
        nextLink.innerHTML = '<span aria-hidden="true">&raquo;</span>';
        nextLi.appendChild(nextLink);
        pagination.appendChild(nextLi);
        
        container.appendChild(pagination);
        
        // إضافة مستمعي الأحداث لأزرار التصفح
        this.setupPaginationEventListeners(container, totalRows, rowsPerPage);
    },
    
    /**
     * إضافة مستمعي الأحداث لأزرار التصفح
     * @param {HTMLElement} container حاوية عناصر التصفح
     * @param {number} totalRows إجمالي عدد الصفوف
     * @param {number} rowsPerPage عدد الصفوف في الصفحة
     */
    setupPaginationEventListeners: function(container, totalRows, rowsPerPage) {
        const table = container.previousElementSibling;
        const rows = table.querySelectorAll('tbody tr');
        const pageLinks = container.querySelectorAll('.page-link');
        
        pageLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                let targetPage;
                
                if (this.getAttribute('aria-label') === 'السابق') {
                    const activePage = container.querySelector('.page-item.active');
                    targetPage = parseInt(activePage.querySelector('.page-link').dataset.page) - 1;
                } else if (this.getAttribute('aria-label') === 'التالي') {
                    const activePage = container.querySelector('.page-item.active');
                    targetPage = parseInt(activePage.querySelector('.page-link').dataset.page) + 1;
                } else {
                    targetPage = parseInt(this.dataset.page);
                }
                
                // التحقق من صحة رقم الصفحة
                const totalPages = Math.ceil(totalRows / rowsPerPage);
                if (targetPage < 1 || targetPage > totalPages) return;
                
                // إخفاء جميع الصفوف أولاً
                rows.forEach(row => row.style.display = 'none');
                
                // عرض الصفوف المطلوبة فقط
                const startIndex = (targetPage - 1) * rowsPerPage;
                const endIndex = Math.min(startIndex + rowsPerPage, rows.length);
                
                for (let i = startIndex; i < endIndex; i++) {
                    rows[i].style.display = '';
                }
                
                // تحديث حالة أزرار التصفح
                container.querySelectorAll('.page-item').forEach(item => item.classList.remove('active'));
                container.querySelector(`.page-link[data-page="${targetPage}"]`).parentNode.classList.add('active');
                
                // تحديث حالة زر السابق والتالي
                container.querySelector('.page-item:first-child').classList.toggle('disabled', targetPage === 1);
                container.querySelector('.page-item:last-child').classList.toggle('disabled', targetPage === totalPages);
            });
        });
    },
    
    /**
     * تطبيق إعدادات الفرز والتصفية
     * @param {Object} sortingPreferences إعدادات الفرز والتصفية
     */
    applySortingPreferences: function(sortingPreferences) {
        if (!sortingPreferences) return;
        
        // تطبيق كل إعداد فرز
        Object.keys(sortingPreferences).forEach(key => {
            this.applySortingPreference(key, sortingPreferences[key]);
        });
    },
    
    /**
     * تطبيق إعداد فرز محدد
     * @param {string} key مفتاح الإعداد
     * @param {*} value القيمة
     */
    applySortingPreference: function(key, value) {
        // تحديد العنصر المناسب بناءً على المفتاح
        let selector;
        
        switch (key) {
            case 'eventsSort':
                selector = '.events-table, .events-grid';
                break;
            case 'invitationsSort':
                selector = '.invitations-table, .invitations-grid';
                break;
            case 'templatesSort':
                selector = '.templates-grid';
                break;
        }
        
        if (!selector) return;
        
        // تطبيق الفرز على العناصر المناسبة
        document.querySelectorAll(selector).forEach(element => {
            if (element.dataset.usePreferences === 'true') {
                element.setAttribute('data-sort', value);
                
                // تحديث عناصر واجهة المستخدم للفرز إن وجدت
                const sortSelect = element.parentNode.querySelector('.sort-select');
                if (sortSelect) {
                    sortSelect.value = value;
                }
                
                // إعادة ترتيب العناصر إذا كان ذلك ممكناً
                this.sortElements(element, value);
            }
        });
    },
    
    /**
     * إعادة ترتيب العناصر بناءً على قيمة الفرز
     * @param {HTMLElement} container حاوية العناصر
     * @param {string} sortValue قيمة الفرز
     */
    sortElements: function(container, sortValue) {
        // التحقق من نوع الحاوية
        const isTable = container.classList.contains('events-table') || container.classList.contains('invitations-table');
        const isGrid = container.classList.contains('events-grid') || container.classList.contains('invitations-grid') || container.classList.contains('templates-grid');
        
        if (!isTable && !isGrid) return;
        
        // تحديد العناصر التي سيتم فرزها
        const elements = isTable 
            ? Array.from(container.querySelectorAll('tbody tr'))
            : Array.from(container.querySelectorAll('.card'));
        
        if (elements.length <= 1) return;
        
        // تحديد دالة المقارنة بناءً على قيمة الفرز
        let compareFunction;
        
        switch (sortValue) {
            case 'date-desc':
                compareFunction = (a, b) => {
                    const dateA = new Date(isTable ? a.dataset.date : a.querySelector('[data-date]').dataset.date);
                    const dateB = new Date(isTable ? b.dataset.date : b.querySelector('[data-date]').dataset.date);
                    return dateB - dateA;
                };
                break;
            case 'date-asc':
                compareFunction = (a, b) => {
                    const dateA = new Date(isTable ? a.dataset.date : a.querySelector('[data-date]').dataset.date);
                    const dateB = new Date(isTable ? b.dataset.date : b.querySelector('[data-date]').dataset.date);
                    return dateA - dateB;
                };
                break;
            case 'name-asc':
                compareFunction = (a, b) => {
                    const nameA = isTable ? a.dataset.name : a.querySelector('[data-name]').dataset.name;
                    const nameB = isTable ? b.dataset.name : b.querySelector('[data-name]').dataset.name;
                    return nameA.localeCompare(nameB, 'ar');
                };
                break;
            case 'name-desc':
                compareFunction = (a, b) => {
                    const nameA = isTable ? a.dataset.name : a.querySelector('[data-name]').dataset.name;
                    const nameB = isTable ? b.dataset.name : b.querySelector('[data-name]').dataset.name;
                    return nameB.localeCompare(nameA, 'ar');
                };
                break;
            case 'popular':
                compareFunction = (a, b) => {
                    const popularityA = parseInt(isTable ? a.dataset.popularity : a.querySelector('[data-popularity]').dataset.popularity);
                    const popularityB = parseInt(isTable ? b.dataset.popularity : b.querySelector('[data-popularity]').dataset.popularity);
                    return popularityB - popularityA;
                };
                break;
            case 'newest':
                compareFunction = (a, b) => {
                    const dateA = new Date(isTable ? a.dataset.created : a.querySelector('[data-created]').dataset.created);
                    const dateB = new Date(isTable ? b.dataset.created : b.querySelector('[data-created]').dataset.created);
                    return dateB - dateA;
                };
                break;
            case 'oldest':
                compareFunction = (a, b) => {
                    const dateA = new Date(isTable ? a.dataset.created : a.querySelector('[data-created]').dataset.created);
                    const dateB = new Date(isTable ? b.dataset.created : b.querySelector('[data-created]').dataset.created);
                    return dateA - dateB;
                };
                break;
            default:
                return;
        }
        
        // فرز العناصر
        elements.sort(compareFunction);
        
        // إعادة ترتيب العناصر في DOM
        const parent = isTable ? container.querySelector('tbody') : container;
        elements.forEach(element => parent.appendChild(element));
    },
    
    /**
     * تطبيق إعدادات الإشعارات
     * @param {Object} notificationPreferences إعدادات الإشعارات
     */
    applyNotificationPreferences: function(notificationPreferences) {
        if (!notificationPreferences) return;
        
        // تطبيق كل إعداد إشعارات
        Object.keys(notificationPreferences).forEach(key => {
            this.applyNotificationPreference(key, notificationPreferences[key]);
        });
    },
    
    /**
     * تطبيق إعداد إشعارات محدد
     * @param {string} key مفتاح الإعداد
     * @param {*} value القيمة
     */
    applyNotificationPreference: function(key, value) {
        switch (key) {
            case 'showNotifications':
                document.documentElement.setAttribute('data-show-notifications', value);
                break;
            case 'notificationSound':
                document.documentElement.setAttribute('data-notification-sound', value);
                break;
            case 'emailNotifications':
                // تحديث واجهة المستخدم فقط، سيتم تطبيق هذا الإعداد على الخادم
                const emailToggle = document.querySelector('#email-notifications-toggle');
                if (emailToggle) {
                    emailToggle.checked = value;
                }
                break;
            case 'desktopNotifications':
                // طلب إذن الإشعارات إذا كان مفعلاً
                if (value && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                    Notification.requestPermission();
                }
                
                // تحديث واجهة المستخدم
                const desktopToggle = document.querySelector('#desktop-notifications-toggle');
                if (desktopToggle) {
                    desktopToggle.checked = value;
                }
                break;
        }
    },
    
    /**
     * تطبيق إعدادات التصميم
     * @param {Object} designPreferences إعدادات التصميم
     */
    applyDesignPreferences: function(designPreferences) {
        if (!designPreferences) return;
        
        // تطبيق كل إعداد تصميم
        Object.keys(designPreferences).forEach(key => {
            this.applyDesignPreference(key, designPreferences[key]);
        });
    },
    
    /**
     * تطبيق إعداد تصميم محدد
     * @param {string} key مفتاح الإعداد
     * @param {*} value القيمة
     */
    applyDesignPreference: function(key, value) {
        switch (key) {
            case 'colorScheme':
                document.documentElement.setAttribute('data-color-scheme', value);
                
                // تحديث واجهة المستخدم
                const colorSchemeSelect = document.querySelector('#color-scheme-select');
                if (colorSchemeSelect) {
                    colorSchemeSelect.value = value;
                }
                break;
            case 'animationsEnabled':
                document.documentElement.setAttribute('data-animations-enabled', value);
                
                // تحديث واجهة المستخدم
                const animationsToggle = document.querySelector('#animations-toggle');
                if (animationsToggle) {
                    animationsToggle.checked = value;
                }
                break;
            case 'borderRadius':
                document.documentElement.setAttribute('data-border-radius', value);
                
                // تحديث واجهة المستخدم
                const borderRadiusSelect = document.querySelector('#border-radius-select');
                if (borderRadiusSelect) {
                    borderRadiusSelect.value = value;
                }
                break;
            case 'buttonStyle':
                document.documentElement.setAttribute('data-button-style', value);
                
                // تحديث واجهة المستخدم
                const buttonStyleSelect = document.querySelector('#button-style-select');
                if (buttonStyleSelect) {
                    buttonStyleSelect.value = value;
                }
                break;
        }
    },
    
    /**
     * تطبيق الإعدادات المتنوعة
     * @param {Object} miscPreferences الإعدادات المتنوعة
     */
    applyMiscPreferences: function(miscPreferences) {
        if (!miscPreferences) return;
        
        // تطبيق كل إعداد متنوع
        Object.keys(miscPreferences).forEach(key => {
            this.applyMiscPreference(key, miscPreferences[key]);
        });
    },
    
    /**
     * تطبيق إعداد متنوع محدد
     * @param {string} key مفتاح الإعداد
     * @param {*} value القيمة
     */
    applyMiscPreference: function(key, value) {
        switch (key) {
            case 'autoSave':
                document.documentElement.setAttribute('data-auto-save', value);
                
                // تحديث واجهة المستخدم
                const autoSaveToggle = document.querySelector('#auto-save-toggle');
                if (autoSaveToggle) {
                    autoSaveToggle.checked = value;
                }
                break;
            case 'confirmBeforeDelete':
                document.documentElement.setAttribute('data-confirm-delete', value);
                
                // تحديث واجهة المستخدم
                const confirmDeleteToggle = document.querySelector('#confirm-delete-toggle');
                if (confirmDeleteToggle) {
                    confirmDeleteToggle.checked = value;
                }
                break;
            case 'showTips':
                document.documentElement.setAttribute('data-show-tips', value);
                
                // تحديث واجهة المستخدم
                const showTipsToggle = document.querySelector('#show-tips-toggle');
                if (showTipsToggle) {
                    showTipsToggle.checked = value;
                }
                
                // إظهار أو إخفاء نصائح الاستخدام
                document.querySelectorAll('.usage-tip').forEach(tip => {
                    tip.style.display = value ? '' : 'none';
                });
                break;
            case 'lastVisitedPage':
                // لا يوجد تطبيق مباشر لهذا الإعداد
                break;
        }
    },
    
    /**
     * إضافة مستمعي الأحداث
     */
    setupEventListeners: function() {
        // مستمع لتغيير حجم الخط
        const fontSizeSelect = document.querySelector('#font-size-select');
        if (fontSizeSelect) {
            fontSizeSelect.addEventListener('change', () => {
                this.setPreference('display', 'fontSize', fontSizeSelect.value);
            });
        }
        
        // مستمع لتغيير عدد صفوف الجداول
        const tableRowsSelect = document.querySelector('#table-rows-select');
        if (tableRowsSelect) {
            tableRowsSelect.addEventListener('change', () => {
                this.setPreference('display', 'tableRows', parseInt(tableRowsSelect.value));
            });
        }
        
        // مستمع لتغيير حجم البطاقات
        const cardSizeSelect = document.querySelector('#card-size-select');
        if (cardSizeSelect) {
            cardSizeSelect.addEventListener('change', () => {
                this.setPreference('display', 'cardSize', cardSizeSelect.value);
            });
        }
        
        // مستمع لتغيير حالة القائمة الجانبية
        const sidebarToggle = document.querySelector('#sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                const sidebar = document.querySelector('.sidebar');
                const isCollapsed = sidebar.classList.contains('collapsed');
                this.setPreference('display', 'sidebarCollapsed', !isCollapsed);
            });
        }
        
        // مستمع لتغيير تخطيط لوحة التحكم
        const dashboardLayoutSelect = document.querySelector('#dashboard-layout-select');
        if (dashboardLayoutSelect) {
            dashboardLayoutSelect.addEventListener('change', () => {
                this.setPreference('display', 'dashboardLayout', dashboardLayoutSelect.value);
            });
        }
        
        // مستمعات لتغيير إعدادات الفرز
        document.querySelectorAll('.sort-select').forEach(select => {
            select.addEventListener('change', () => {
                const container = select.closest('.section').querySelector('.events-table, .events-grid, .invitations-table, .invitations-grid, .templates-grid');
                if (!container) return;
                
                let preferenceKey;
                if (container.classList.contains('events-table') || container.classList.contains('events-grid')) {
                    preferenceKey = 'eventsSort';
                } else if (container.classList.contains('invitations-table') || container.classList.contains('invitations-grid')) {
                    preferenceKey = 'invitationsSort';
                } else if (container.classList.contains('templates-grid')) {
                    preferenceKey = 'templatesSort';
                }
                
                if (preferenceKey) {
                    this.setPreference('sorting', preferenceKey, select.value);
                }
            });
        });
        
        // مستمعات لتغيير إعدادات الإشعارات
        const notificationToggles = {
            '#show-notifications-toggle': 'showNotifications',
            '#notification-sound-toggle': 'notificationSound',
            '#email-notifications-toggle': 'emailNotifications',
            '#desktop-notifications-toggle': 'desktopNotifications'
        };
        
        Object.keys(notificationToggles).forEach(selector => {
            const toggle = document.querySelector(selector);
            if (toggle) {
                toggle.addEventListener('change', () => {
                    this.setPreference('notifications', notificationToggles[selector], toggle.checked);
                });
            }
        });
        
        // مستمعات لتغيير إعدادات التصميم
        const colorSchemeSelect = document.querySelector('#color-scheme-select');
        if (colorSchemeSelect) {
            colorSchemeSelect.addEventListener('change', () => {
                this.setPreference('design', 'colorScheme', colorSchemeSelect.value);
            });
        }
        
        const animationsToggle = document.querySelector('#animations-toggle');
        if (animationsToggle) {
            animationsToggle.addEventListener('change', () => {
                this.setPreference('design', 'animationsEnabled', animationsToggle.checked);
            });
        }
        
        const borderRadiusSelect = document.querySelector('#border-radius-select');
        if (borderRadiusSelect) {
            borderRadiusSelect.addEventListener('change', () => {
                this.setPreference('design', 'borderRadius', borderRadiusSelect.value);
            });
        }
        
        const buttonStyleSelect = document.querySelector('#button-style-select');
        if (buttonStyleSelect) {
            buttonStyleSelect.addEventListener('change', () => {
                this.setPreference('design', 'buttonStyle', buttonStyleSelect.value);
            });
        }
        
        // مستمعات لتغيير الإعدادات المتنوعة
        const miscToggles = {
            '#auto-save-toggle': 'autoSave',
            '#confirm-delete-toggle': 'confirmBeforeDelete',
            '#show-tips-toggle': 'showTips'
        };
        
        Object.keys(miscToggles).forEach(selector => {
            const toggle = document.querySelector(selector);
            if (toggle) {
                toggle.addEventListener('change', () => {
                    this.setPreference('misc', miscToggles[selector], toggle.checked);
                });
            }
        });
        
        // مستمع لزر إعادة تعيين التفضيلات
        const resetButton = document.querySelector('#reset-preferences-button');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من إعادة تعيين جميع التفضيلات إلى الإعدادات الافتراضية؟')) {
                    this.resetToDefaults();
                }
            });
        }
        
        // تخزين آخر صفحة تمت زيارتها
        window.addEventListener('beforeunload', () => {
            this.setPreference('misc', 'lastVisitedPage', window.location.pathname);
        });
    },
    
    /**
     * إطلاق حدث تغيير التفضيلات
     * @param {string} category فئة التفضيل
     * @param {string} key مفتاح التفضيل
     * @param {*} value القيمة الجديدة
     */
    triggerPreferenceChangeEvent: function(category, key, value) {
        document.dispatchEvent(new CustomEvent('preferenceChange', {
            detail: {
                category: category,
                key: key,
                value: value
            }
        }));
    },
    
    /**
     * إنشاء واجهة مستخدم لإعدادات التفضيلات
     * @param {HTMLElement} container حاوية واجهة المستخدم
     */
    createPreferencesUI: function(container) {
        if (!container) return;
        
        // الحصول على التفضيلات الحالية
        const preferences = this.getAllPreferences() || this.defaults;
        
        // إنشاء هيكل واجهة المستخدم
        container.innerHTML = `
            <div class="preferences-container">
                <h2 class="mb-4">إعدادات التفضيلات</h2>
                
                <div class="card mb-4">
                    <div class="card-header">
                        <h3 class="card-title">إعدادات العرض</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="font-size-select" class="form-label">حجم الخط</label>
                                <select id="font-size-select" class="form-select">
                                    <option value="small" ${preferences.display.fontSize === 'small' ? 'selected' : ''}>صغير</option>
                                    <option value="medium" ${preferences.display.fontSize === 'medium' ? 'selected' : ''}>متوسط</option>
                                    <option value="large" ${preferences.display.fontSize === 'large' ? 'selected' : ''}>كبير</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="table-rows-select" class="form-label">عدد صفوف الجداول</label>
                                <select id="table-rows-select" class="form-select">
                                    <option value="5" ${preferences.display.tableRows === 5 ? 'selected' : ''}>5 صفوف</option>
                                    <option value="10" ${preferences.display.tableRows === 10 ? 'selected' : ''}>10 صفوف</option>
                                    <option value="15" ${preferences.display.tableRows === 15 ? 'selected' : ''}>15 صف</option>
                                    <option value="20" ${preferences.display.tableRows === 20 ? 'selected' : ''}>20 صف</option>
                                    <option value="25" ${preferences.display.tableRows === 25 ? 'selected' : ''}>25 صف</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="card-size-select" class="form-label">حجم البطاقات</label>
                                <select id="card-size-select" class="form-select">
                                    <option value="small" ${preferences.display.cardSize === 'small' ? 'selected' : ''}>صغير</option>
                                    <option value="medium" ${preferences.display.cardSize === 'medium' ? 'selected' : ''}>متوسط</option>
                                    <option value="large" ${preferences.display.cardSize === 'large' ? 'selected' : ''}>كبير</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="dashboard-layout-select" class="form-label">تخطيط لوحة التحكم</label>
                                <select id="dashboard-layout-select" class="form-select">
                                    <option value="grid" ${preferences.display.dashboardLayout === 'grid' ? 'selected' : ''}>شبكة</option>
                                    <option value="list" ${preferences.display.dashboardLayout === 'list' ? 'selected' : ''}>قائمة</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card mb-4">
                    <div class="card-header">
                        <h3 class="card-title">إعدادات الإشعارات</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="show-notifications-toggle" ${preferences.notifications.showNotifications ? 'checked' : ''}>
                                    <label class="form-check-label" for="show-notifications-toggle">عرض الإشعارات</label>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="notification-sound-toggle" ${preferences.notifications.notificationSound ? 'checked' : ''}>
                                    <label class="form-check-label" for="notification-sound-toggle">تشغيل صوت الإشعارات</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="email-notifications-toggle" ${preferences.notifications.emailNotifications ? 'checked' : ''}>
                                    <label class="form-check-label" for="email-notifications-toggle">إرسال إشعارات بالبريد الإلكتروني</label>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="desktop-notifications-toggle" ${preferences.notifications.desktopNotifications ? 'checked' : ''}>
                                    <label class="form-check-label" for="desktop-notifications-toggle">إشعارات سطح المكتب</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card mb-4">
                    <div class="card-header">
                        <h3 class="card-title">إعدادات التصميم</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="color-scheme-select" class="form-label">نظام الألوان</label>
                                <select id="color-scheme-select" class="form-select">
                                    <option value="default" ${preferences.design.colorScheme === 'default' ? 'selected' : ''}>افتراضي</option>
                                    <option value="high-contrast" ${preferences.design.colorScheme === 'high-contrast' ? 'selected' : ''}>تباين عالي</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="animations-toggle" ${preferences.design.animationsEnabled ? 'checked' : ''}>
                                    <label class="form-check-label" for="animations-toggle">تفعيل الرسوم المتحركة</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="border-radius-select" class="form-label">نصف قطر الحواف</label>
                                <select id="border-radius-select" class="form-select">
                                    <option value="small" ${preferences.design.borderRadius === 'small' ? 'selected' : ''}>صغير</option>
                                    <option value="medium" ${preferences.design.borderRadius === 'medium' ? 'selected' : ''}>متوسط</option>
                                    <option value="large" ${preferences.design.borderRadius === 'large' ? 'selected' : ''}>كبير</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="button-style-select" class="form-label">نمط الأزرار</label>
                                <select id="button-style-select" class="form-select">
                                    <option value="default" ${preferences.design.buttonStyle === 'default' ? 'selected' : ''}>افتراضي</option>
                                    <option value="flat" ${preferences.design.buttonStyle === 'flat' ? 'selected' : ''}>مسطح</option>
                                    <option value="outline" ${preferences.design.buttonStyle === 'outline' ? 'selected' : ''}>محدد</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card mb-4">
                    <div class="card-header">
                        <h3 class="card-title">إعدادات متنوعة</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="auto-save-toggle" ${preferences.misc.autoSave ? 'checked' : ''}>
                                    <label class="form-check-label" for="auto-save-toggle">حفظ تلقائي للنماذج</label>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="confirm-delete-toggle" ${preferences.misc.confirmBeforeDelete ? 'checked' : ''}>
                                    <label class="form-check-label" for="confirm-delete-toggle">تأكيد قبل الحذف</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="show-tips-toggle" ${preferences.misc.showTips ? 'checked' : ''}>
                                    <label class="form-check-label" for="show-tips-toggle">عرض نصائح الاستخدام</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="text-center">
                    <button id="reset-preferences-button" class="btn btn-warning">إعادة تعيين جميع التفضيلات</button>
                </div>
            </div>
        `;
        
        // إضافة مستمعي الأحداث
        this.setupEventListeners();
    }
};

// تهيئة نظام تفضيلات المستخدم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    UserPreferences.init();
    
    // إنشاء واجهة مستخدم للتفضيلات إذا كانت الصفحة الحالية هي صفحة التفضيلات
    const preferencesContainer = document.querySelector('#preferences-container');
    if (preferencesContainer) {
        UserPreferences.createPreferencesUI(preferencesContainer);
    }
});

// تصدير كائن UserPreferences للاستخدام في ملفات أخرى
window.UserPreferences = UserPreferences;
