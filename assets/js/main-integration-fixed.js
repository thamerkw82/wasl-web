/**
 * main-integration-fixed.js
 * ملف JavaScript رئيسي يضمن تكامل جميع الميزات
 * تم تعديله لتجنب التعارض مع التصميم الموحد
 */

// التحقق من وجود العناصر قبل تطبيق التحسينات
document.addEventListener('DOMContentLoaded', function() {
  // التحقق من وجود القائمة الجانبية
  const sidebar = document.querySelector('.sidebar-menu');
  if (sidebar) {
    // تطبيق تحسينات القائمة الجانبية
    enhanceSidebar();
  }

  // التحقق من وجود القائمة المنسدلة
  const dropdown = document.querySelector('.dropdown-menu');
  if (dropdown) {
    // تطبيق تحسينات القائمة المنسدلة
    enhanceDropdown();
  }

  // التحقق من وجود زر الوضع الليلي
  const darkModeToggle = document.querySelector('#dark-mode-toggle');
  if (darkModeToggle) {
    // تطبيق تحسينات الوضع الليلي
    enhanceDarkMode();
  }

  // التحقق من وجود لوحة الإحصائيات التفاعلية
  const dashboard = document.querySelector('.interactive-dashboard');
  if (dashboard) {
    // تطبيق تحسينات لوحة الإحصائيات التفاعلية
    enhanceDashboard();
  }

  // التحقق من وجود حقل البحث في القائمة الجانبية
  const sidebarSearch = document.querySelector('.sidebar-form');
  if (sidebarSearch) {
    // تطبيق تحسينات حقل البحث في القائمة الجانبية
    enhanceSidebarSearch();
  }

  // تطبيق تحسينات التوافق مع الأجهزة المختلفة
  enhanceDeviceCompatibility();

  // تطبيق تحسينات إمكانية الوصول
  enhanceAccessibility();
});

/**
 * تحسينات القائمة الجانبية
 */
function enhanceSidebar() {
  // تطبيق تأثيرات التحويم المحسنة
  const sidebarItems = document.querySelectorAll('.sidebar-menu > li > a');
  sidebarItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
      this.style.color = '#ffffff';
    });
    item.addEventListener('mouseleave', function() {
      if (!this.parentElement.classList.contains('active')) {
        this.style.backgroundColor = '';
        this.style.color = '';
      }
    });
  });

  // تطبيق القوائم الفرعية القابلة للطي
  const treeviewItems = document.querySelectorAll('.sidebar-menu .treeview');
  treeviewItems.forEach(item => {
    const treeviewLink = item.querySelector('a');
    const treeviewMenu = item.querySelector('.treeview-menu');
    
    if (treeviewLink && treeviewMenu) {
      treeviewLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (item.classList.contains('active')) {
          item.classList.remove('active');
          treeviewMenu.style.display = 'none';
        } else {
          item.classList.add('active');
          treeviewMenu.style.display = 'block';
        }
      });
    }
  });
}

/**
 * تحسينات القائمة المنسدلة
 */
function enhanceDropdown() {
  // تطبيق تأثيرات الانتقال السلسة
  const dropdownMenus = document.querySelectorAll('.dropdown-menu');
  dropdownMenus.forEach(menu => {
    menu.style.transition = 'all 0.3s ease';
    menu.style.opacity = '0';
    menu.style.transform = 'translateY(-10px)';
    
    const dropdownToggle = menu.previousElementSibling;
    if (dropdownToggle) {
      dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (menu.style.display === 'block') {
          menu.style.opacity = '0';
          menu.style.transform = 'translateY(-10px)';
          setTimeout(() => {
            menu.style.display = 'none';
          }, 300);
        } else {
          menu.style.display = 'block';
          setTimeout(() => {
            menu.style.opacity = '1';
            menu.style.transform = 'translateY(0)';
          }, 10);
        }
      });
    }
  });
}

/**
 * تحسينات الوضع الليلي
 */
function enhanceDarkMode() {
  const darkModeToggle = document.querySelector('#dark-mode-toggle');
  const body = document.body;
  
  // التحقق من حالة الوضع الليلي المخزنة
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  
  // تطبيق الوضع الليلي إذا كان مفعلاً
  if (isDarkMode) {
    body.classList.add('dark-mode');
    if (darkModeToggle.querySelector('i')) {
      darkModeToggle.querySelector('i').classList.remove('fa-moon');
      darkModeToggle.querySelector('i').classList.add('fa-sun');
    }
  }
  
  // تبديل الوضع الليلي عند النقر على الزر
  darkModeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-mode');
    
    const isDarkModeNow = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkModeNow);
    
    if (darkModeToggle.querySelector('i')) {
      if (isDarkModeNow) {
        darkModeToggle.querySelector('i').classList.remove('fa-moon');
        darkModeToggle.querySelector('i').classList.add('fa-sun');
      } else {
        darkModeToggle.querySelector('i').classList.remove('fa-sun');
        darkModeToggle.querySelector('i').classList.add('fa-moon');
      }
    }
  });
}

/**
 * تحسينات لوحة الإحصائيات التفاعلية
 */
function enhanceDashboard() {
  const dashboard = document.querySelector('.interactive-dashboard');
  
  // تحديث البيانات في الوقت الفعلي
  if (dashboard) {
    // محاكاة تحديث البيانات كل 5 ثوانٍ
    setInterval(() => {
      const infoBoxes = dashboard.querySelectorAll('.info-box-number');
      infoBoxes.forEach(box => {
        // تحديث الأرقام بشكل عشوائي للمحاكاة
        const currentValue = parseInt(box.textContent);
        const newValue = currentValue + Math.floor(Math.random() * 10) - 5;
        box.textContent = newValue > 0 ? newValue : 0;
        
        // إضافة تأثير التحديث
        box.classList.add('updated');
        setTimeout(() => {
          box.classList.remove('updated');
        }, 500);
      });
    }, 5000);
  }
}

/**
 * تحسينات حقل البحث في القائمة الجانبية
 */
function enhanceSidebarSearch() {
  const sidebarSearch = document.querySelector('.sidebar-form input[type="text"]');
  const sidebarMenu = document.querySelector('.sidebar-menu');
  
  if (sidebarSearch && sidebarMenu) {
    sidebarSearch.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const menuItems = sidebarMenu.querySelectorAll('li:not(.header)');
      
      menuItems.forEach(item => {
        const itemText = item.textContent.toLowerCase();
        
        if (searchTerm === '') {
          item.style.display = '';
          item.classList.remove('search-result');
        } else if (itemText.includes(searchTerm)) {
          item.style.display = '';
          item.classList.add('search-result');
        } else {
          item.style.display = 'none';
          item.classList.remove('search-result');
        }
      });
    });
  }
}

/**
 * تحسينات التوافق مع الأجهزة المختلفة
 */
function enhanceDeviceCompatibility() {
  // التحقق من حجم الشاشة وتطبيق التحسينات المناسبة
  function checkScreenSize() {
    const width = window.innerWidth;
    
    if (width < 768) {
      // تحسينات للهواتف المحمولة
      document.body.classList.add('mobile-device');
      document.body.classList.remove('tablet-device', 'desktop-device');
    } else if (width < 992) {
      // تحسينات للأجهزة اللوحية
      document.body.classList.add('tablet-device');
      document.body.classList.remove('mobile-device', 'desktop-device');
    } else {
      // تحسينات لأجهزة سطح المكتب
      document.body.classList.add('desktop-device');
      document.body.classList.remove('mobile-device', 'tablet-device');
    }
  }
  
  // تطبيق التحسينات عند تحميل الصفحة وتغيير حجم النافذة
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
}

/**
 * تحسينات إمكانية الوصول
 */
function enhanceAccessibility() {
  // إضافة سمات ARIA للعناصر
  const buttons = document.querySelectorAll('button:not([aria-label])');
  buttons.forEach(button => {
    if (button.textContent.trim()) {
      button.setAttribute('aria-label', button.textContent.trim());
    }
  });
  
  // إضافة التركيز المرئي للعناصر
  const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  focusableElements.forEach(element => {
    element.classList.add('focus-visible');
  });
  
  // إضافة اختصارات لوحة المفاتيح
  document.addEventListener('keydown', function(e) {
    // Alt + S للبحث
    if (e.altKey && e.key === 's') {
      e.preventDefault();
      const searchInput = document.querySelector('.sidebar-form input[type="text"]');
      if (searchInput) {
        searchInput.focus();
      }
    }
    
    // Alt + D لتبديل الوضع الليلي
    if (e.altKey && e.key === 'd') {
      e.preventDefault();
      const darkModeToggle = document.querySelector('#dark-mode-toggle');
      if (darkModeToggle) {
        darkModeToggle.click();
      }
    }
  });
}
