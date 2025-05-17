/**
 * نظام القوائم الفرعية المفصلة المحسن
 * يوفر تجربة مستخدم متقدمة للقوائم الجانبية مع دعم للقوائم الفرعية المتعددة المستويات
 * والبحث المتقدم والتخصيص الديناميكي
 */

document.addEventListener('DOMContentLoaded', function() {
    // تهيئة القوائم الفرعية المحسنة
    initEnhancedSidebar();
});

/**
 * تهيئة القائمة الجانبية المحسنة
 */
function initEnhancedSidebar() {
    // تحديد القائمة الجانبية
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    // إضافة حقل البحث المتقدم
    addAdvancedSearch(sidebar);
    
    // تهيئة القوائم الفرعية متعددة المستويات
    initMultiLevelMenu(sidebar);
    
    // إضافة ميزة تخصيص القائمة
    addSidebarCustomization(sidebar);
    
    // إضافة ميزة حفظ حالة القائمة
    initSidebarStateManagement();
    
    // تحسين تأثيرات التحويم والانتقالات
    enhanceVisualEffects();
    
    // إضافة اختصارات لوحة المفاتيح
    addKeyboardShortcuts();
}

/**
 * إضافة حقل البحث المتقدم
 * @param {HTMLElement} sidebar - عنصر القائمة الجانبية
 */
function addAdvancedSearch(sidebar) {
    // إنشاء حقل البحث
    const searchContainer = document.createElement('div');
    searchContainer.className = 'sidebar-search mb-3';
    
    // إنشاء نموذج البحث
    const searchForm = document.createElement('form');
    searchForm.className = 'search-form';
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
    });
    
    // إنشاء مجموعة الإدخال
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'input-group';
    
    // إضافة أيقونة البحث
    const searchPrepend = document.createElement('div');
    searchPrepend.className = 'input-group-prepend';
    
    const searchIcon = document.createElement('span');
    searchIcon.className = 'input-group-text';
    searchIcon.innerHTML = '<i class="fas fa-search"></i>';
    
    // إنشاء حقل الإدخال
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'form-control';
    searchInput.placeholder = 'بحث سريع...';
    searchInput.id = 'sidebar-search-input';
    
    // إضافة زر مسح البحث
    const clearButton = document.createElement('div');
    clearButton.className = 'input-group-append';
    clearButton.innerHTML = '<span class="input-group-text clear-search" style="cursor: pointer;"><i class="fas fa-times"></i></span>';
    clearButton.style.display = 'none';
    
    // إضافة حدث المسح
    clearButton.querySelector('.clear-search').addEventListener('click', function() {
        searchInput.value = '';
        clearButton.style.display = 'none';
        performSearch('');
    });
    
    // تجميع عناصر البحث
    searchPrepend.appendChild(searchIcon);
    searchWrapper.appendChild(searchPrepend);
    searchWrapper.appendChild(searchInput);
    searchWrapper.appendChild(clearButton);
    searchForm.appendChild(searchWrapper);
    searchContainer.appendChild(searchForm);
    
    // إضافة خيارات البحث المتقدم
    const advancedOptions = document.createElement('div');
    advancedOptions.className = 'advanced-search-options mt-2';
    advancedOptions.style.display = 'none';
    
    // إضافة زر توسيع خيارات البحث
    const toggleAdvanced = document.createElement('small');
    toggleAdvanced.className = 'text-muted d-block text-center mt-1';
    toggleAdvanced.innerHTML = '<a href="#" class="toggle-advanced">خيارات البحث المتقدم <i class="fas fa-chevron-down"></i></a>';
    toggleAdvanced.querySelector('.toggle-advanced').addEventListener('click', function(e) {
        e.preventDefault();
        if (advancedOptions.style.display === 'none') {
            advancedOptions.style.display = 'block';
            this.innerHTML = 'خيارات البحث المتقدم <i class="fas fa-chevron-up"></i>';
        } else {
            advancedOptions.style.display = 'none';
            this.innerHTML = 'خيارات البحث المتقدم <i class="fas fa-chevron-down"></i>';
        }
    });
    
    // إضافة خيارات البحث
    advancedOptions.innerHTML = `
        <div class="form-group mt-2">
            <label class="small">نطاق البحث:</label>
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="search-current-section" checked>
                <label class="custom-control-label small" for="search-current-section">القسم الحالي فقط</label>
            </div>
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="search-include-hidden" checked>
                <label class="custom-control-label small" for="search-include-hidden">تضمين العناصر المخفية</label>
            </div>
        </div>
    `;
    
    // إضافة حقل البحث إلى بداية القائمة الجانبية
    const sidebarContent = sidebar.querySelector('.position-sticky');
    if (sidebarContent) {
        searchContainer.appendChild(toggleAdvanced);
        searchContainer.appendChild(advancedOptions);
        sidebarContent.insertBefore(searchContainer, sidebarContent.firstChild);
    }
    
    // إضافة حدث البحث
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        clearButton.style.display = query ? 'block' : 'none';
        performSearch(query);
    });
    
    // إضافة حدث تغيير خيارات البحث
    const searchOptions = advancedOptions.querySelectorAll('input[type="checkbox"]');
    searchOptions.forEach(option => {
        option.addEventListener('change', function() {
            performSearch(searchInput.value.trim());
        });
    });
}

/**
 * تنفيذ البحث في القائمة الجانبية
 * @param {string} query - استعلام البحث
 */
function performSearch(query) {
    // تحديد القائمة الجانبية
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    // الحصول على خيارات البحث
    const searchCurrentSection = document.getElementById('search-current-section')?.checked || false;
    const includeHidden = document.getElementById('search-include-hidden')?.checked || true;
    
    // تحديد القسم الحالي
    const currentSection = sidebar.querySelector('.nav-link.active')?.closest('.has-submenu');
    
    // الحصول على جميع الروابط في القائمة
    let links = sidebar.querySelectorAll('.nav-link');
    
    // تطبيق خيار البحث في القسم الحالي فقط
    if (searchCurrentSection && currentSection) {
        links = currentSection.querySelectorAll('.nav-link');
    }
    
    // عداد النتائج
    let matchCount = 0;
    
    // البحث في الروابط
    links.forEach(link => {
        const text = link.textContent.trim().toLowerCase();
        const menuItem = link.closest('.nav-item');
        const isHidden = menuItem.style.display === 'none';
        
        // تجاهل العناصر المخفية إذا لم يتم تحديد خيار تضمينها
        if (isHidden && !includeHidden) return;
        
        if (query === '' || text.includes(query.toLowerCase())) {
            // إظهار العنصر المطابق
            menuItem.style.display = 'block';
            
            // زيادة عداد النتائج
            if (query !== '') matchCount++;
            
            // إذا كان العنصر في قائمة فرعية، فتح القائمة الفرعية
            const parentSubmenu = link.closest('.submenu');
            if (parentSubmenu && query !== '') {
                parentSubmenu.style.display = 'block';
                const parentItem = parentSubmenu.closest('.has-submenu');
                if (parentItem) {
                    parentItem.classList.add('submenu-open');
                    const toggle = parentItem.querySelector('.submenu-toggle');
                    if (toggle) toggle.classList.replace('fa-chevron-down', 'fa-chevron-up');
                }
            }
            
            // تمييز النص المطابق
            if (query !== '') {
                const regex = new RegExp(`(${query})`, 'gi');
                const highlightedText = text.replace(regex, '<span class="highlight">$1</span>');
                // الحفاظ على الأيقونة وإضافة النص المميز
                const icon = link.querySelector('i.nav-icon');
                const toggle = link.querySelector('i.submenu-toggle');
                if (icon) {
                    const iconHTML = icon.outerHTML;
                    let newHTML = iconHTML + ' ' + highlightedText;
                    if (toggle) {
                        newHTML += toggle.outerHTML;
                    }
                    link.innerHTML = newHTML;
                }
            } else {
                // إعادة تعيين النص الأصلي
                const icon = link.querySelector('i.nav-icon');
                const toggle = link.querySelector('i.submenu-toggle');
                if (icon) {
                    const iconHTML = icon.outerHTML;
                    let newHTML = iconHTML + ' ' + text;
                    if (toggle) {
                        newHTML += toggle.outerHTML;
                    }
                    link.innerHTML = newHTML;
                }
            }
        } else {
            // إخفاء العنصر غير المطابق إذا كان هناك استعلام بحث
            if (query !== '') {
                menuItem.style.display = 'none';
            } else {
                menuItem.style.display = 'block';
            }
        }
    });
    
    // عرض عدد النتائج
    const searchResults = document.getElementById('search-results-count');
    if (searchResults) {
        if (query !== '') {
            searchResults.textContent = `تم العثور على ${matchCount} نتيجة`;
            searchResults.style.display = 'block';
        } else {
            searchResults.style.display = 'none';
        }
    } else if (query !== '') {
        // إنشاء عنصر لعرض عدد النتائج
        const resultsCount = document.createElement('div');
        resultsCount.id = 'search-results-count';
        resultsCount.className = 'small text-muted text-center mt-2';
        resultsCount.textContent = `تم العثور على ${matchCount} نتيجة`;
        
        const searchContainer = sidebar.querySelector('.sidebar-search');
        if (searchContainer) {
            searchContainer.appendChild(resultsCount);
        }
    }
    
    // إذا كان الاستعلام فارغاً، إعادة تعيين القائمة
    if (query === '') {
        resetSidebar();
    }
}

/**
 * إعادة تعيين القائمة الجانبية
 */
function resetSidebar() {
    // تحديد القائمة الجانبية
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    // إظهار جميع العناصر
    const items = sidebar.querySelectorAll('.nav-item');
    items.forEach(item => {
        item.style.display = 'block';
    });
    
    // استعادة حالة القوائم الفرعية من التخزين المحلي
    restoreSidebarState();
}

/**
 * تهيئة القوائم الفرعية متعددة المستويات
 * @param {HTMLElement} sidebar - عنصر القائمة الجانبية
 */
function initMultiLevelMenu(sidebar) {
    // تعريف هيكل القائمة متعددة المستويات
    const menuStructure = [
        {
            title: 'لوحة التحكم',
            icon: 'fas fa-tachometer-alt',
            link: 'index.html'
        },
        {
            title: 'إدارة المستخدمين',
            icon: 'fas fa-users',
            submenu: [
                { title: 'المستخدمون', link: 'users.html' },
                { title: 'المشرفون', link: 'supervisors.html' },
                { title: 'العملاء', link: 'customers.html' },
                { title: 'الأدوار والصلاحيات', link: 'roles.html' }
            ]
        },
        {
            title: 'إدارة المناسبات',
            icon: 'fas fa-calendar-alt',
            submenu: [
                { title: 'المناسبات', link: 'events.html' },
                { title: 'الدعوات', link: 'invitations.html' },
                { title: 'المدعوون', link: 'guests.html' },
                { 
                    title: 'إحصائيات المناسبات',
                    submenu: [
                        { title: 'تقارير الحضور', link: 'reports.html' },
                        { title: 'تحليل التفاعل', link: 'analytics.html' }
                    ]
                }
            ]
        },
        {
            title: 'إدارة المحتوى',
            icon: 'fas fa-file-alt',
            submenu: [
                { title: 'إدارة المحتوى', link: 'content_management.html' },
                { title: 'معرض التصاميم', link: 'design_gallery.html' },
                { title: 'الملفات', link: 'files.html' }
            ]
        },
        {
            title: 'التقارير والإحصائيات',
            icon: 'fas fa-chart-bar',
            submenu: [
                { title: 'التقارير', link: 'reports.html' },
                { title: 'الطلبات', link: 'orders.html' },
                { title: 'المهام', link: 'tasks.html' }
            ]
        },
        {
            title: 'الدعم والمساعدة',
            icon: 'fas fa-headset',
            submenu: [
                { title: 'الدعم الفني', link: 'support.html' },
                { title: 'مركز المساعدة', link: 'help_center.html' },
                { title: 'إدارة الأسئلة الشائعة', link: 'faq_management.html' }
            ]
        },
        {
            title: 'النظام',
            icon: 'fas fa-cog',
            submenu: [
                { title: 'الإعدادات', link: 'settings.html' },
                { title: 'النسخ الاحتياطي', link: 'backup.html' },
                { title: 'التكاملات', link: 'integrations.html' },
                { 
                    title: 'إدارة النظام',
                    submenu: [
                        { title: 'سجلات النظام', link: 'logs.html' },
                        { title: 'أداء النظام', link: 'performance.html' }
                    ]
                }
            ]
        }
    ];
    
    // إنشاء القائمة الجديدة
    const newMenu = document.createElement('ul');
    newMenu.className = 'nav flex-column';
    
    // إضافة عناصر القائمة
    menuStructure.forEach(item => {
        const menuItem = createMenuItem(item);
        newMenu.appendChild(menuItem);
    });
    
    // إضافة رابط تسجيل الخروج
    const logoutItem = document.createElement('li');
    logoutItem.className = 'nav-item mt-3';
    
    const logoutLink = document.createElement('a');
    logoutLink.className = 'nav-link text-danger';
    logoutLink.href = '../login.html';
    logoutLink.innerHTML = '<i class="nav-icon fas fa-sign-out-alt"></i>تسجيل الخروج';
    
    logoutItem.appendChild(logoutLink);
    newMenu.appendChild(logoutItem);
    
    // استبدال القائمة الحالية بالقائمة الجديدة
    const currentMenu = sidebar.querySelector('.nav');
    if (currentMenu) {
        currentMenu.parentNode.replaceChild(newMenu, currentMenu);
    }
    
    // استعادة حالة القائمة من التخزين المحلي
    restoreSidebarState();
}

/**
 * إنشاء عنصر قائمة
 * @param {Object} item - بيانات عنصر القائمة
 * @param {number} level - مستوى العنصر في القائمة
 * @returns {HTMLElement} - عنصر القائمة
 */
function createMenuItem(item, level = 0) {
    const menuItem = document.createElement('li');
    menuItem.className = 'nav-item';
    
    // إضافة فئة للمستوى
    menuItem.classList.add(`level-${level}`);
    
    // إنشاء الرابط
    const link = document.createElement('a');
    link.className = 'nav-link';
    
    // إضافة هامش للمستويات الفرعية
    if (level > 0) {
        link.style.paddingRight = `${level * 15 + 15}px`;
    }
    
    // إضافة الأيقونة
    if (item.icon) {
        link.innerHTML = `<i class="nav-icon ${item.icon}"></i>`;
    } else {
        link.innerHTML = '<i class="nav-icon fas fa-circle-notch fa-sm"></i>';
    }
    
    // إضافة العنوان
    link.innerHTML += item.title;
    
    // إضافة الرابط
    if (item.link) {
        link.href = item.link;
        
        // التحقق مما إذا كان الرابط هو الصفحة الحالية
        const currentPage = window.location.pathname.split('/').pop();
        if (item.link === currentPage) {
            link.classList.add('active');
        }
    } else {
        link.href = '#';
    }
    
    // إضافة القائمة الفرعية
    if (item.submenu) {
        // إضافة فئة للعناصر التي تحتوي على قوائم فرعية
        menuItem.classList.add('has-submenu');
        
        // إضافة أيقونة السهم
        link.innerHTML += '<i class="fas fa-chevron-down submenu-toggle"></i>';
        
        // إضافة حدث النقر لتبديل حالة القائمة الفرعية
        link.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSubmenu(menuItem);
            
            // حفظ حالة القائمة في التخزين المحلي
            saveSidebarState();
        });
        
        // إنشاء القائمة الفرعية
        const submenu = document.createElement('ul');
        submenu.className = 'nav flex-column submenu';
        submenu.style.display = 'none';
        
        // إضافة عناصر القائمة الفرعية
        item.submenu.forEach(subItem => {
            const subMenuItem = createMenuItem(subItem, level + 1);
            submenu.appendChild(subMenuItem);
        });
        
        // إضافة القائمة الفرعية إلى العنصر
        menuItem.appendChild(link);
        menuItem.appendChild(submenu);
        
        // فتح القائمة الفرعية إذا كانت تحتوي على عنصر نشط
        if (submenu.querySelector('.active')) {
            submenu.style.display = 'block';
            menuItem.classList.add('submenu-open');
            link.querySelector('.submenu-toggle').classList.replace('fa-chevron-down', 'fa-chevron-up');
        }
    } else {
        // إضافة الرابط إلى العنصر
        menuItem.appendChild(link);
    }
    
    return menuItem;
}

/**
 * تبديل حالة القائمة الفرعية (فتح/إغلاق)
 * @param {HTMLElement} item - عنصر القائمة
 */
function toggleSubmenu(item) {
    const submenu = item.querySelector('.submenu');
    const toggle = item.querySelector('.submenu-toggle');
    
    if (submenu) {
        if (submenu.style.display === 'none') {
            // فتح القائمة الفرعية
            submenu.style.display = 'block';
            item.classList.add('submenu-open');
            if (toggle) toggle.classList.replace('fa-chevron-down', 'fa-chevron-up');
        } else {
            // إغلاق القائمة الفرعية
            submenu.style.display = 'none';
            item.classList.remove('submenu-open');
            if (toggle) toggle.classList.replace('fa-chevron-up', 'fa-chevron-down');
        }
    }
}

/**
 * إضافة ميزة تخصيص القائمة
 * @param {HTMLElement} sidebar - عنصر القائمة الجانبية
 */
function addSidebarCustomization(sidebar) {
    // إنشاء زر التخصيص
    const customizeButton = document.createElement('button');
    customizeButton.className = 'btn btn-sm btn-outline-secondary w-100 mt-3';
    customizeButton.innerHTML = '<i class="fas fa-cog"></i> تخصيص القائمة';
    
    // إنشاء نافذة التخصيص
    const customizeModal = document.createElement('div');
    customizeModal.className = 'sidebar-customize-modal';
    customizeModal.style.display = 'none';
    customizeModal.innerHTML = `
        <div class="customize-header">
            <h5>تخصيص القائمة الجانبية</h5>
            <button type="button" class="close-modal">&times;</button>
        </div>
        <div class="customize-body">
            <div class="form-group">
                <label>حجم الخط:</label>
                <select class="form-control" id="sidebar-font-size">
                    <option value="small">صغير</option>
                    <option value="medium" selected>متوسط</option>
                    <option value="large">كبير</option>
                </select>
            </div>
            <div class="form-group">
                <label>كثافة العناصر:</label>
                <select class="form-control" id="sidebar-density">
                    <option value="compact">مضغوطة</option>
                    <option value="normal" selected>عادية</option>
                    <option value="comfortable">مريحة</option>
                </select>
            </div>
            <div class="form-group">
                <label>عرض الأيقونات:</label>
                <div class="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" id="sidebar-show-icons" checked>
                    <label class="custom-control-label" for="sidebar-show-icons">عرض الأيقونات</label>
                </div>
            </div>
            <div class="form-group">
                <label>عرض الأقسام المفضلة فقط:</label>
                <div class="custom-control custom-switch">
                    <input type="checkbox" class="custom-control-input" id="sidebar-favorites-only">
                    <label class="custom-control-label" for="sidebar-favorites-only">المفضلة فقط</label>
                </div>
            </div>
        </div>
        <div class="customize-footer">
            <button type="button" class="btn btn-primary btn-sm" id="save-customize">حفظ التغييرات</button>
            <button type="button" class="btn btn-secondary btn-sm" id="reset-customize">إعادة تعيين</button>
        </div>
    `;
    
    // إضافة أنماط CSS للنافذة
    const customizeStyles = document.createElement('style');
    customizeStyles.textContent = `
        .sidebar-customize-modal {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            width: 300px;
        }
        .customize-header {
            padding: 10px 15px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .customize-body {
            padding: 15px;
        }
        .customize-footer {
            padding: 10px 15px;
            border-top: 1px solid #eee;
            text-align: right;
        }
        .close-modal {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
        }
    `;
    
    // إضافة العناصر إلى الصفحة
    document.head.appendChild(customizeStyles);
    sidebar.appendChild(customizeButton);
    document.body.appendChild(customizeModal);
    
    // إضافة حدث النقر لزر التخصيص
    customizeButton.addEventListener('click', function() {
        customizeModal.style.display = 'block';
    });
    
    // إضافة حدث النقر لزر الإغلاق
    customizeModal.querySelector('.close-modal').addEventListener('click', function() {
        customizeModal.style.display = 'none';
    });
    
    // إضافة حدث النقر لزر الحفظ
    customizeModal.querySelector('#save-customize').addEventListener('click', function() {
        // الحصول على قيم التخصيص
        const fontSize = document.getElementById('sidebar-font-size').value;
        const density = document.getElementById('sidebar-density').value;
        const showIcons = document.getElementById('sidebar-show-icons').checked;
        const favoritesOnly = document.getElementById('sidebar-favorites-only').checked;
        
        // تطبيق التخصيص
        applySidebarCustomization(fontSize, density, showIcons, favoritesOnly);
        
        // حفظ التخصيص في التخزين المحلي
        localStorage.setItem('sidebar-customization', JSON.stringify({
            fontSize,
            density,
            showIcons,
            favoritesOnly
        }));
        
        // إغلاق النافذة
        customizeModal.style.display = 'none';
    });
    
    // إضافة حدث النقر لزر إعادة التعيين
    customizeModal.querySelector('#reset-customize').addEventListener('click', function() {
        // إعادة تعيين قيم التخصيص
        document.getElementById('sidebar-font-size').value = 'medium';
        document.getElementById('sidebar-density').value = 'normal';
        document.getElementById('sidebar-show-icons').checked = true;
        document.getElementById('sidebar-favorites-only').checked = false;
        
        // تطبيق التخصيص
        applySidebarCustomization('medium', 'normal', true, false);
        
        // حذف التخصيص من التخزين المحلي
        localStorage.removeItem('sidebar-customization');
    });
    
    // استعادة التخصيص من التخزين المحلي
    const savedCustomization = localStorage.getItem('sidebar-customization');
    if (savedCustomization) {
        const { fontSize, density, showIcons, favoritesOnly } = JSON.parse(savedCustomization);
        
        // تعيين قيم التخصيص
        document.getElementById('sidebar-font-size').value = fontSize;
        document.getElementById('sidebar-density').value = density;
        document.getElementById('sidebar-show-icons').checked = showIcons;
        document.getElementById('sidebar-favorites-only').checked = favoritesOnly;
        
        // تطبيق التخصيص
        applySidebarCustomization(fontSize, density, showIcons, favoritesOnly);
    }
}

/**
 * تطبيق تخصيص القائمة الجانبية
 * @param {string} fontSize - حجم الخط
 * @param {string} density - كثافة العناصر
 * @param {boolean} showIcons - عرض الأيقونات
 * @param {boolean} favoritesOnly - عرض المفضلة فقط
 */
function applySidebarCustomization(fontSize, density, showIcons, favoritesOnly) {
    // تحديد القائمة الجانبية
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    // تطبيق حجم الخط
    sidebar.querySelectorAll('.nav-link').forEach(link => {
        link.style.fontSize = fontSize === 'small' ? '0.875rem' : fontSize === 'large' ? '1.125rem' : '1rem';
    });
    
    // تطبيق كثافة العناصر
    sidebar.querySelectorAll('.nav-link').forEach(link => {
        link.style.padding = density === 'compact' ? '0.4rem 1rem' : density === 'comfortable' ? '0.8rem 1rem' : '0.6rem 1rem';
    });
    
    // تطبيق عرض الأيقونات
    sidebar.querySelectorAll('.nav-icon').forEach(icon => {
        icon.style.display = showIcons ? 'inline-block' : 'none';
    });
    
    // تطبيق عرض المفضلة فقط
    if (favoritesOnly) {
        // الحصول على قائمة المفضلة من التخزين المحلي
        const favorites = JSON.parse(localStorage.getItem('sidebar-favorites') || '[]');
        
        // إخفاء العناصر غير المفضلة
        sidebar.querySelectorAll('.nav-item').forEach(item => {
            const link = item.querySelector('.nav-link');
            if (link) {
                const href = link.getAttribute('href');
                if (href && !favorites.includes(href)) {
                    item.style.display = 'none';
                }
            }
        });
    } else {
        // إظهار جميع العناصر
        sidebar.querySelectorAll('.nav-item').forEach(item => {
            item.style.display = 'block';
        });
    }
}

/**
 * تهيئة إدارة حالة القائمة
 */
function initSidebarStateManagement() {
    // استعادة حالة القائمة من التخزين المحلي
    restoreSidebarState();
    
    // إضافة حدث قبل مغادرة الصفحة لحفظ حالة القائمة
    window.addEventListener('beforeunload', function() {
        saveSidebarState();
    });
}

/**
 * حفظ حالة القائمة في التخزين المحلي
 */
function saveSidebarState() {
    // تحديد القائمة الجانبية
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    // الحصول على حالة القوائم الفرعية
    const state = {};
    sidebar.querySelectorAll('.has-submenu').forEach(item => {
        const id = item.id || `menu-item-${Math.random().toString(36).substr(2, 9)}`;
        item.id = id;
        state[id] = item.classList.contains('submenu-open');
    });
    
    // حفظ الحالة في التخزين المحلي
    localStorage.setItem('sidebar-state', JSON.stringify(state));
}

/**
 * استعادة حالة القائمة من التخزين المحلي
 */
function restoreSidebarState() {
    // تحديد القائمة الجانبية
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    // الحصول على الحالة المحفوظة
    const savedState = localStorage.getItem('sidebar-state');
    if (!savedState) return;
    
    // تطبيق الحالة المحفوظة
    const state = JSON.parse(savedState);
    Object.keys(state).forEach(id => {
        const item = document.getElementById(id);
        if (item) {
            const submenu = item.querySelector('.submenu');
            const toggle = item.querySelector('.submenu-toggle');
            
            if (submenu) {
                if (state[id]) {
                    // فتح القائمة الفرعية
                    submenu.style.display = 'block';
                    item.classList.add('submenu-open');
                    if (toggle) toggle.classList.replace('fa-chevron-down', 'fa-chevron-up');
                } else {
                    // إغلاق القائمة الفرعية
                    submenu.style.display = 'none';
                    item.classList.remove('submenu-open');
                    if (toggle) toggle.classList.replace('fa-chevron-up', 'fa-chevron-down');
                }
            }
        }
    });
    
    // فتح القوائم الفرعية التي تحتوي على عنصر نشط
    sidebar.querySelectorAll('.active').forEach(active => {
        const parentSubmenu = active.closest('.submenu');
        if (parentSubmenu) {
            parentSubmenu.style.display = 'block';
            const parentItem = parentSubmenu.closest('.has-submenu');
            if (parentItem) {
                parentItem.classList.add('submenu-open');
                const toggle = parentItem.querySelector('.submenu-toggle');
                if (toggle) toggle.classList.replace('fa-chevron-down', 'fa-chevron-up');
            }
        }
    });
}

/**
 * تحسين التأثيرات البصرية
 */
function enhanceVisualEffects() {
    // إضافة أنماط CSS للتأثيرات البصرية
    const effectsStyles = document.createElement('style');
    effectsStyles.textContent = `
        /* تأثيرات التحويم للقائمة */
        .nav-link {
            transition: all 0.3s ease;
        }
        .nav-link:hover {
            background-color: rgba(0, 0, 0, 0.05);
            transform: translateX(-3px);
        }
        
        /* تأثيرات الانتقال للقوائم الفرعية */
        .submenu {
            transition: all 0.3s ease;
            overflow: hidden;
        }
        
        /* تأثير التمييز للعنصر النشط */
        .nav-link.active {
            position: relative;
            font-weight: bold;
        }
        .nav-link.active::before {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            width: 4px;
            background-color: var(--primary-color);
        }
        
        /* تأثير تمييز نتائج البحث */
        .highlight {
            background-color: rgba(255, 255, 0, 0.3);
            padding: 2px;
            border-radius: 2px;
        }
    `;
    
    // إضافة الأنماط إلى الصفحة
    document.head.appendChild(effectsStyles);
}

/**
 * إضافة اختصارات لوحة المفاتيح
 */
function addKeyboardShortcuts() {
    // إضافة مستمع لأحداث لوحة المفاتيح
    document.addEventListener('keydown', function(e) {
        // اختصار فتح/إغلاق القائمة الجانبية (Alt+S)
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            toggleSidebar();
        }
        
        // اختصار التركيز على حقل البحث (Alt+F)
        if (e.altKey && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('sidebar-search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // اختصار فتح/إغلاق جميع القوائم الفرعية (Alt+A)
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            toggleAllSubmenus();
        }
    });
    
    // إضافة توثيق الاختصارات
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.className = 'sidebar-shortcuts-info small text-muted mt-3 text-center';
    shortcutsInfo.innerHTML = `
        <p>اختصارات لوحة المفاتيح:</p>
        <ul class="list-unstyled">
            <li><kbd>Alt</kbd> + <kbd>S</kbd>: فتح/إغلاق القائمة</li>
            <li><kbd>Alt</kbd> + <kbd>F</kbd>: التركيز على البحث</li>
            <li><kbd>Alt</kbd> + <kbd>A</kbd>: فتح/إغلاق جميع القوائم</li>
        </ul>
    `;
    
    // إضافة التوثيق إلى القائمة الجانبية
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.appendChild(shortcutsInfo);
    }
}

/**
 * تبديل حالة القائمة الجانبية (فتح/إغلاق)
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    if (sidebar && content) {
        if (sidebar.style.display === 'none') {
            sidebar.style.display = 'block';
            content.classList.remove('col-md-12');
            content.classList.add('col-md-9', 'col-lg-10');
        } else {
            sidebar.style.display = 'none';
            content.classList.remove('col-md-9', 'col-lg-10');
            content.classList.add('col-md-12');
        }
    }
}

/**
 * تبديل حالة جميع القوائم الفرعية (فتح/إغلاق)
 */
function toggleAllSubmenus() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    // التحقق مما إذا كانت معظم القوائم الفرعية مفتوحة
    const submenus = sidebar.querySelectorAll('.submenu');
    const openCount = Array.from(submenus).filter(submenu => submenu.style.display === 'block').length;
    const shouldClose = openCount > submenus.length / 2;
    
    // تبديل حالة جميع القوائم الفرعية
    submenus.forEach(submenu => {
        const parentItem = submenu.closest('.has-submenu');
        const toggle = parentItem?.querySelector('.submenu-toggle');
        
        if (shouldClose) {
            // إغلاق القائمة الفرعية
            submenu.style.display = 'none';
            if (parentItem) parentItem.classList.remove('submenu-open');
            if (toggle) toggle.classList.replace('fa-chevron-up', 'fa-chevron-down');
        } else {
            // فتح القائمة الفرعية
            submenu.style.display = 'block';
            if (parentItem) parentItem.classList.add('submenu-open');
            if (toggle) toggle.classList.replace('fa-chevron-down', 'fa-chevron-up');
        }
    });
    
    // حفظ الحالة في التخزين المحلي
    saveSidebarState();
}
