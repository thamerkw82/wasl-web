// إضافة سكريبت JavaScript لتفعيل القائمة المنسدلة للمستخدم

document.addEventListener('DOMContentLoaded', function() {
    // تفعيل القائمة المنسدلة للمستخدم
    const profileToggle = document.getElementById('profileToggle');
    const profileMenu = document.getElementById('profileMenu');
    
    if (profileToggle && profileMenu) {
        profileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            profileMenu.classList.toggle('show');
        });
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (profileMenu.classList.contains('show') && !profileToggle.contains(e.target) && !profileMenu.contains(e.target)) {
                profileMenu.classList.remove('show');
            }
        });
    }
    
    // تم إزالة كود زر تبديل الوضع (الوضع الليلي/النهاري)
    
    // تفعيل زر تبديل اللغة
    const langSwitcher = document.getElementById('langSwitcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('click', function() {
            const currentDir = document.documentElement.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            document.documentElement.setAttribute('dir', newDir);
            
            // تغيير نص الزر
            langSwitcher.textContent = newDir === 'rtl' ? 'EN' : 'عربي';
        });
    }
});
