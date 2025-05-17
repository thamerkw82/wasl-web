/**
 * وظائف الوضع الليلي (Dark Mode) لمنصة الدعوات الإلكترونية
 * يتضمن وظائف تبديل الوضع وحفظ التفضيلات
 */

// التحقق من وجود تفضيل محفوظ للوضع الليلي
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من وجود تفضيل محفوظ
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateDarkModeIcon(savedTheme === 'dark');
    }
    
    // إضافة زر تبديل الوضع الليلي إلى الشريط العلوي
    addDarkModeToggle();
});

// إضافة زر تبديل الوضع الليلي
function addDarkModeToggle() {
    // البحث عن عنصر الشريط العلوي المناسب
    const navbarActions = document.querySelector('.d-flex.align-items-center');
    
    if (navbarActions) {
        // إنشاء زر تبديل الوضع الليلي
        const darkModeButton = document.createElement('button');
        darkModeButton.setAttribute('aria-label', 'زر تبديل الوضع الليلي');
        darkModeButton.className = 'btn btn-outline-secondary dark-mode-toggle mr-3';
        darkModeButton.id = 'dark-mode-toggle';
        
        // تحديد الأيقونة المناسبة بناءً على الوضع الحالي
        const currentTheme = document.documentElement.getAttribute('data-theme');
        darkModeButton.innerHTML = currentTheme === 'dark' 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
        
        // إضافة حدث النقر لتبديل الوضع
        darkModeButton.addEventListener('click', toggleDarkMode);
        
        // إضافة الزر إلى الشريط العلوي
        navbarActions.prepend(darkModeButton);
    }
}

// تبديل الوضع الليلي
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // تحديث سمة الصفحة
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // حفظ التفضيل في التخزين المحلي
    localStorage.setItem('theme', newTheme);
    
    // تحديث أيقونة الزر
    updateDarkModeIcon(newTheme === 'dark');
}

// تحديث أيقونة زر الوضع الليلي
function updateDarkModeIcon(isDark) {
    const darkModeButton = document.getElementById('dark-mode-toggle');
    if (darkModeButton) {
        darkModeButton.innerHTML = isDark 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    }
}

// تطبيق الوضع الليلي على المخططات البيانية
function updateChartsForDarkMode(isDark) {
    // التحقق من وجود مكتبة Chart.js
    if (typeof Chart !== 'undefined') {
        // تحديث الألوان الافتراضية للمخططات
        Chart.defaults.color = isDark ? '#e0e0e0' : '#666';
        Chart.defaults.borderColor = isDark ? '#444444' : '#ddd';
        
        // تحديث جميع المخططات الموجودة
        Chart.instances.forEach(chart => {
            // تحديث ألوان المحاور
            if (chart.options.scales) {
                if (chart.options.scales.x) {
                    chart.options.scales.x.grid.color = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                }
                if (chart.options.scales.y) {
                    chart.options.scales.y.grid.color = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                }
            }
            
            // تحديث ألوان الخلفية للمخططات
            if (chart.config.type === 'pie' || chart.config.type === 'doughnut') {
                chart.data.datasets.forEach(dataset => {
                    if (!dataset.originalBackgroundColor) {
                        dataset.originalBackgroundColor = [...dataset.backgroundColor];
                    }
                    
                    // تعديل سطوع الألوان في الوضع الليلي
                    if (isDark) {
                        dataset.backgroundColor = dataset.originalBackgroundColor.map(color => 
                            adjustColorBrightness(color, 0.8)
                        );
                    } else {
                        dataset.backgroundColor = dataset.originalBackgroundColor;
                    }
                });
            }
            
            // تحديث المخطط
            chart.update();
        });
    }
}

// تعديل سطوع اللون
function adjustColorBrightness(color, factor) {
    // تحويل اللون إلى تنسيق RGB
    let r, g, b, a;
    
    if (color.startsWith('#')) {
        // تحويل اللون من تنسيق HEX إلى RGB
        const hex = color.substring(1);
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
        a = 1;
    } else if (color.startsWith('rgb')) {
        // استخراج قيم RGB من النص
        const rgbValues = color.match(/\d+/g);
        r = parseInt(rgbValues[0]);
        g = parseInt(rgbValues[1]);
        b = parseInt(rgbValues[2]);
        a = rgbValues.length > 3 ? parseFloat(rgbValues[3]) : 1;
    } else {
        // إرجاع اللون كما هو إذا كان بتنسيق غير معروف
        return color;
    }
    
    // تعديل السطوع
    r = Math.round(r * factor);
    g = Math.round(g * factor);
    b = Math.round(b * factor);
    
    // التأكد من أن القيم ضمن النطاق المسموح (0-255)
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    
    // إرجاع اللون بتنسيق RGBA
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// تحديث الوضع الليلي عند تغيير التفضيل
document.addEventListener('themeChanged', function(e) {
    const isDark = e.detail.theme === 'dark';
    updateChartsForDarkMode(isDark);
});

// إضافة حدث لتحديث المخططات عند تبديل الوضع
document.getElementById('dark-mode-toggle')?.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const event = new CustomEvent('themeChanged', {
        detail: { theme: currentTheme }
    });
    document.dispatchEvent(event);
});
