/**
 * وظائف القوائم الفرعية القابلة للطي والبحث في القائمة الجانبية
 * يتضمن وظائف طي وفتح القوائم الفرعية وبحث سريع في القائمة
 */

document.addEventListener('DOMContentLoaded', function() {
    // تهيئة القوائم الفرعية القابلة للطي
    initCollapsibleSubmenus();
    
    // إضافة حقل البحث في القائمة الجانبية
    addSidebarSearch();
    
    // تحسين تأثيرات التحويم والانتقالات
    enhanceHoverEffects();
});

// تهيئة القوائم الفرعية القابلة للطي
function initCollapsibleSubmenus() {
    // تحديد القائمة الجانبية
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    // الحصول على جميع عناصر القائمة الرئيسية
    const mainMenuItems = sidebar.querySelectorAll('.nav-item');
    
    mainMenuItems.forEach(item => {
        // التحقق من وجود قائمة فرعية
        const submenu = item.querySelector('ul');
        if (submenu) {
            // إضافة فئة للعناصر التي تحتوي على قوائم فرعية
            item.classList.add('has-submenu');
            
            // إضافة أيقونة السهم
            const link = item.querySelector('.nav-link');
            if (link) {
                link.innerHTML += '<i class="fas fa-chevron-down submenu-toggle"></i>';
                
                // إضافة حدث النقر لتبديل حالة القائمة الفرعية
                link.addEventListener('click', function(e) {
                    // منع الانتقال إلى الرابط عند النقر على السهم
                    if (e.target.classList.contains('submenu-toggle')) {
                        e.preventDefault();
                    }
                    
                    // تبديل حالة القائمة الفرعية
                    toggleSubmenu(item);
                });
            }
            
            // إخفاء القائمة الفرعية افتراضياً
            submenu.style.display = 'none';
            
            // إذا كانت القائمة الفرعية تحتوي على عنصر نشط، فتح القائمة الفرعية
            if (submenu.querySelector('.active')) {
                toggleSubmenu(item);
            }
        }
    });
    
    // تحويل القوائم العادية إلى قوائم فرعية
    convertToNestedMenu();
}

// تبديل حالة القائمة الفرعية (فتح/إغلاق)
function toggleSubmenu(item) {
    const submenu = item.querySelector('ul');
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

// تحويل القوائم العادية إلى قوائم فرعية منظمة
function convertToNestedMenu() {
    // تعريف مجموعات القوائم
    const menuGroups = [
        {
            title: 'لوحة التحكم',
            icon: 'fas fa-tachometer-alt',
            items: ['index.html']
        },
        {
            title: 'إدارة المستخدمين',
            icon: 'fas fa-users',
            items: ['users.html', 'supervisors.html', 'customers.html', 'roles.html']
        },
        {
            title: 'إدارة المناسبات',
            icon: 'fas fa-calendar-alt',
            items: ['events.html', 'invitations.html', 'guests.html']
        },
        {
            title: 'إدارة المحتوى',
            icon: 'fas fa-file-alt',
            items: ['content_management.html', 'design_gallery.html']
        },
        {
            title: 'التقارير والإحصائيات',
            icon: 'fas fa-chart-bar',
            items: ['reports.html', 'orders.html']
        },
        {
            title: 'الدعم والمساعدة',
            icon: 'fas fa-headset',
            items: ['support.html', 'help_center.html', 'faq_management.html']
        },
        {
            title: 'النظام',
            icon: 'fas fa-cog',
            items: ['settings.html', 'backup.html', 'integrations.html']
        }
    ];
    
    // الحصول على القائمة الجانبية
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    // الحصول على قائمة العناصر الحالية
    const currentItems = sidebar.querySelectorAll('.nav-item');
    const currentLinks = {};
    
    // تخزين الروابط الحالية وحالتها النشطة
    currentItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        if (link) {
            const href = link.getAttribute('href');
            if (href) {
                currentLinks[href] = {
                    text: link.textContent.trim(),
                    isActive: link.classList.contains('active')
                };
            }
        }
    });
    
    // إنشاء القائمة الجديدة
    const newMenu = document.createElement('ul');
    newMenu.className = 'nav flex-column';
    
    // إضافة مجموعات القوائم
    menuGroups.forEach(group => {
        // إنشاء عنصر المجموعة
        const groupItem = document.createElement('li');
        groupItem.className = 'nav-item has-submenu';
        
        // إنشاء رابط المجموعة
        const groupLink = document.createElement('a');
        groupLink.className = 'nav-link';
        groupLink.href = '#';
        groupLink.innerHTML = `<i class="nav-icon ${group.icon}"></i>${group.title}<i class="fas fa-chevron-down submenu-toggle"></i>`;
        
        // إضافة حدث النقر
        groupLink.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSubmenu(groupItem);
        });
        
        // إنشاء القائمة الفرعية
        const submenu = document.createElement('ul');
        submenu.className = 'nav flex-column submenu';
        submenu.style.display = 'none';
        
        // التحقق مما إذا كانت المجموعة تحتوي على عنصر نشط
        let hasActiveItem = false;
        
        // إضافة عناصر القائمة الفرعية
        group.items.forEach(item => {
            if (currentLinks[item]) {
                const subItem = document.createElement('li');
                subItem.className = 'nav-item';
                
                const subLink = document.createElement('a');
                subLink.className = 'nav-link';
                if (currentLinks[item].isActive) {
                    subLink.classList.add('active');
                    hasActiveItem = true;
                }
                subLink.href = item;
                subLink.textContent = currentLinks[item].text;
                
                subItem.appendChild(subLink);
                submenu.appendChild(subItem);
            }
        });
        
        // إضافة العناصر إلى القائمة
        groupItem.appendChild(groupLink);
        groupItem.appendChild(submenu);
        newMenu.appendChild(groupItem);
        
        // فتح القائمة الفرعية إذا كانت تحتوي على عنصر نشط
        if (hasActiveItem) {
            submenu.style.display = 'block';
            groupItem.classList.add('submenu-open');
            groupLink.querySelector('.submenu-toggle').classList.replace('fa-chevron-down', 'fa-chevron-up');
        }
    });
    
    // إضافة رابط تسجيل الخروج
    const logoutItem = document.createElement('li');
    logoutItem.className = 'nav-item';
    
    const logoutLink = document.createElement('a');
    logoutLink.className = 'nav-link';
    logoutLink.href = '../login.html';
    logoutLink.innerHTML = '<i class="nav-icon fas fa-sign-out-alt"></i>تسجيل الخروج';
    
    logoutItem.appendChild(logoutLink);
    newMenu.appendChild(logoutItem);
    
    // استبدال القائمة الحالية بالقائمة الجديدة
    const currentMenu = sidebar.querySelector('.nav');
    if (currentMenu) {
        currentMenu.parentNode.replaceChild(newMenu, currentMenu);
    }
}

// إضافة حقل البحث في القائمة الجانبية
function addSidebarSearch() {
    // تحديد القائمة الجانبية
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    // إنشاء حقل البحث
    const searchContainer = document.createElement('div');
    searchContainer.className = 'sidebar-search mb-3';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'form-control';
    searchInput.placeholder = 'بحث في القائمة...';
    searchInput.id = 'sidebar-search-input';
    
    // إضافة أيقونة البحث
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'input-group';
    
    const searchPrepend = document.createElement('div');
    searchPrepend.className = 'input-group-prepend';
    
    const searchIcon = document.createElement('span');
    searchIcon.className = 'input-group-text';
    searchIcon.innerHTML = '<i class="fas fa-search"></i>';
    
    searchPrepend.appendChild(searchIcon);
    searchWrapper.appendChild(searchPrepend);
    searchWrapper.appendChild(searchInput);
    searchContainer.appendChild(searchWrapper);
    
    // إضافة حقل البحث إلى بداية القائمة الجانبية
    const sidebarContent = sidebar.querySelector('.position-sticky');
    if (sidebarContent) {
        sidebarContent.insertBefore(searchContainer, sidebarContent.firstChild);
    }
    
    // إضافة حدث البحث
    searchInput.addEventListener('input', function() {
        searchSidebar(this.value.trim().toLowerCase());
    });
}

// البحث في القائمة الجانبية
function searchSidebar(query) {
    // تحديد القائمة الجانبية
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    // الحصول على جميع الروابط في القائمة
    const links = sidebar.querySelectorAll('.nav-link');
    
    // البحث في الروابط
    links.forEach(link => {
        const text = link.textContent.trim().toLowerCase();
        const menuItem = link.closest('.nav-item');
        
        if (text.includes(query)) {
            // إظهار العنصر المطابق
            menuItem.style.display = 'block';
            
            // إذا كان العنصر في قائمة فرعية، فتح القائمة الفرعية
            const parentSubmenu = link.closest('.submenu');
            if (parentSubmenu) {
                parentSubmenu.style.display = 'block';
                const parentItem = parentSubmenu.closest('.has-submenu');
                if (parentItem) {
                    parentItem.classList.add('submenu-open');
                    const toggle = parentItem.querySelector('.submenu-toggle');
                    if (toggle) toggle.classList.replace('fa-chevron-down', 'fa-chevron-up');
                }
            }
            
            // تمييز النص المطابق
            if (query) {
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
            }
        } else {
            // إخفاء العنصر غير المطابق إذا كان هناك استعلام بحث
            if (query) {
                menuItem.style.display = 'none';
            } else {
                menuItem.style.display = 'block';
                
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
        }
    });
    
    // إذا كان الاستعلام فارغاً، إعادة تعيين القائمة
    if (!query) {
        resetSidebar();
    }
}

// إعادة تعيين القائمة الجانبية
function resetSidebar() {
    // تحديد القائمة الجانبية
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    // إظهار جميع العناصر
    const items = sidebar.querySelectorAll('.nav-item');
    items.forEach(item => {
        item.style.display = 'block';
    });
    
    // إغلاق جميع القوائم الفرعية إلا التي تحتوي على عنصر نشط
    const submenus = sidebar.querySelectorAll('.submenu');
    submenus.forEach(submenu => {
        if (!submenu.querySelector('.active')) {
            submenu.style.display = 'none';
            const parentItem = submenu.closest('.has-submenu');
            if (parentItem) {
                parentItem.classList.remove('submenu-open');
                const toggle = parentItem.querySelector('.submenu-toggle');
                if (toggle) toggle.classList.replace('fa-chevron-up', 'fa-chevron-down');
            }
        }
    });
}

// تحسين تأثيرات التحويم والانتقالات
function enhanceHoverEffects() {
    // إضافة تأثيرات التحويم للبطاقات
    const cards = document.querySelectorAll('.card, .dashboard-stat');
    cards.forEach(card => {
        card.classList.add('hover-effect');
    });
    
    // إضافة تأثيرات التحويم للأزرار
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.classList.add('btn-hover-effect');
    });
    
    // إضافة تأثيرات التحويم لعناصر القائمة
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.add('nav-link-hover-effect');
    });
    
    // إضافة تأثيرات التحويم لصفوف الجداول
    const tableRows = document.querySelectorAll('.table tbody tr');
    tableRows.forEach(row => {
        row.classList.add('table-row-hover-effect');
    });
}
