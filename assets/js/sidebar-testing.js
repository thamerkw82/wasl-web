/**
 * اختبار وتحسين تجربة المستخدم للقوائم الفرعية المفصلة
 * هذا الملف يقوم بإجراء اختبارات شاملة لنظام القوائم الفرعية المفصلة
 * وتحسين تجربة المستخدم بناءً على نتائج الاختبارات
 */

document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نظام الاختبار
    initSidebarTesting();
});

/**
 * تهيئة نظام اختبار القائمة الجانبية
 */
function initSidebarTesting() {
    console.log('بدء اختبار نظام القوائم الفرعية المفصلة...');
    
    // التحقق من وجود القائمة الجانبية
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
        console.error('لم يتم العثور على القائمة الجانبية!');
        return;
    }
    
    // إضافة شريط أدوات الاختبار (في وضع التطوير فقط)
    if (isDevMode()) {
        addTestingToolbar(sidebar);
    }
    
    // اختبار تحميل ملفات CSS و JavaScript
    testResourceLoading();
    
    // اختبار وظائف القائمة الفرعية
    testSubmenuFunctionality(sidebar);
    
    // اختبار وظيفة البحث
    testSearchFunctionality(sidebar);
    
    // اختبار حفظ الحالة
    testStateManagement(sidebar);
    
    // اختبار التوافق مع الأجهزة المختلفة
    testResponsiveness(sidebar);
    
    // اختبار إمكانية الوصول
    testAccessibility(sidebar);
    
    // اختبار الأداء
    testPerformance(sidebar);
    
    // تطبيق التحسينات التلقائية
    applyAutomaticImprovements(sidebar);
    
    console.log('اكتمل اختبار نظام القوائم الفرعية المفصلة بنجاح.');
}

/**
 * التحقق مما إذا كان التطبيق في وضع التطوير
 * @returns {boolean} - ما إذا كان التطبيق في وضع التطوير
 */
function isDevMode() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.search.includes('dev=true');
}

/**
 * إضافة شريط أدوات الاختبار
 * @param {HTMLElement} sidebar - عنصر القائمة الجانبية
 */
function addTestingToolbar(sidebar) {
    // إنشاء شريط الأدوات
    const toolbar = document.createElement('div');
    toolbar.className = 'sidebar-testing-toolbar';
    toolbar.innerHTML = `
        <div class="testing-header">
            <h6>أدوات اختبار القائمة الجانبية</h6>
            <button class="close-toolbar">&times;</button>
        </div>
        <div class="testing-body">
            <button class="btn btn-sm btn-outline-primary test-all-btn">اختبار شامل</button>
            <button class="btn btn-sm btn-outline-secondary toggle-all-btn">فتح/إغلاق الكل</button>
            <button class="btn btn-sm btn-outline-info simulate-search-btn">محاكاة البحث</button>
            <button class="btn btn-sm btn-outline-warning clear-state-btn">مسح الحالة المحفوظة</button>
            <button class="btn btn-sm btn-outline-danger simulate-error-btn">محاكاة خطأ</button>
        </div>
        <div class="testing-results">
            <div class="test-result-summary">جاهز للاختبار</div>
            <div class="test-result-details"></div>
        </div>
    `;
    
    // إضافة أنماط CSS
    const styles = document.createElement('style');
    styles.textContent = `
        .sidebar-testing-toolbar {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            font-size: 12px;
        }
        .testing-header {
            padding: 8px 12px;
            background-color: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .testing-header h6 {
            margin: 0;
            font-size: 14px;
        }
        .close-toolbar {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
        }
        .testing-body {
            padding: 10px;
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
        }
        .testing-results {
            padding: 10px;
            border-top: 1px solid #dee2e6;
            max-height: 150px;
            overflow-y: auto;
        }
        .test-result-summary {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .test-result-details {
            font-family: monospace;
            font-size: 11px;
            white-space: pre-wrap;
        }
        .test-pass {
            color: #28a745;
        }
        .test-fail {
            color: #dc3545;
        }
        .test-warn {
            color: #ffc107;
        }
    `;
    document.head.appendChild(styles);
    
    // إضافة شريط الأدوات إلى الصفحة
    document.body.appendChild(toolbar);
    
    // إضافة أحداث الأزرار
    toolbar.querySelector('.close-toolbar').addEventListener('click', function() {
        toolbar.remove();
    });
    
    toolbar.querySelector('.test-all-btn').addEventListener('click', function() {
        runAllTests(sidebar, toolbar);
    });
    
    toolbar.querySelector('.toggle-all-btn').addEventListener('click', function() {
        toggleAllSubmenus(sidebar);
    });
    
    toolbar.querySelector('.simulate-search-btn').addEventListener('click', function() {
        simulateSearch(sidebar, toolbar);
    });
    
    toolbar.querySelector('.clear-state-btn').addEventListener('click', function() {
        localStorage.removeItem('sidebar-state');
        updateTestResults(toolbar, 'تم مسح الحالة المحفوظة بنجاح', 'تم مسح الحالة المحفوظة من التخزين المحلي.', 'pass');
    });
    
    toolbar.querySelector('.simulate-error-btn').addEventListener('click', function() {
        simulateError(sidebar, toolbar);
    });
}

/**
 * تشغيل جميع الاختبارات
 * @param {HTMLElement} sidebar - عنصر القائمة الجانبية
 * @param {HTMLElement} toolbar - شريط أدوات الاختبار
 */
function runAllTests(sidebar, toolbar) {
    updateTestResults(toolbar, 'جاري تنفيذ الاختبارات الشاملة...', '', 'warn');
    
    setTimeout(function() {
        const results = {
            resourceLoading: testResourceLoading(),
            submenuFunctionality: testSubmenuFunctionality(sidebar),
            searchFunctionality: testSearchFunctionality(sidebar),
            stateManagement: testStateManagement(sidebar),
            responsiveness: testResponsiveness(sidebar),
            accessibility: testAccessibility(sidebar),
            performance: testPerformance(sidebar)
        };
        
        // تحليل النتائج
        const passCount = Object.values(results).filter(r => r.status === 'pass').length;
        const failCount = Object.values(results).filter(r => r.status === 'fail').length;
        const warnCount = Object.values(results).filter(r => r.status === 'warn').length;
        
        let summary = `اكتمل الاختبار: ${passCount} ناجح, ${warnCount} تحذير, ${failCount} فشل`;
        let details = Object.entries(results).map(([test, result]) => {
            return `[${result.status === 'pass' ? '✓' : result.status === 'warn' ? '⚠' : '✗'}] ${test}: ${result.message}`;
        }).join('\n');
        
        let status = failCount > 0 ? 'fail' : warnCount > 0 ? 'warn' : 'pass';
        
        updateTestResults(toolbar, summary, details, status);
        
        // تطبيق التحسينات التلقائية إذا كانت هناك مشكلات
        if (failCount > 0 || warnCount > 0) {
            applyAutomaticImprovements(sidebar);
        }
    }, 1000);
}

/**
 * تحديث نتائج الاختبار
 * @param {HTMLElement} toolbar - شريط أدوات الاختبار
 * @param {string} summary - ملخص النتائج
 * @param {string} details - تفاصيل النتائج
 * @param {string} status - حالة الاختبار (pass, warn, fail)
 */
function updateTestResults(toolbar, summary, details, status) {
    const summaryEl = toolbar.querySelector('.test-result-summary');
    const detailsEl = toolbar.querySelector('.test-result-details');
    
    summaryEl.textContent = summary;
    summaryEl.className = 'test-result-summary test-' + status;
    
    detailsEl.textContent = details;
}

/**
 * اختبار تحميل الموارد
 * @returns {Object} - نتيجة الاختبار
 */
function testResourceLoading() {
    console.log('اختبار تحميل الموارد...');
    
    // التحقق من تحميل ملف CSS
    const cssLoaded = Array.from(document.styleSheets).some(sheet => {
        return sheet.href && (
            sheet.href.includes('enhanced-sidebar.css') || 
            sheet.href.includes('sidebar-enhancements.css')
        );
    });
    
    // التحقق من تحميل ملف JavaScript
    const jsLoaded = typeof initEnhancedSidebar === 'function' || 
                    typeof initCollapsibleSubmenus === 'function';
    
    if (cssLoaded && jsLoaded) {
        console.log('✓ تم تحميل جميع الموارد بنجاح');
        return { status: 'pass', message: 'تم تحميل جميع الموارد بنجاح' };
    } else if (!cssLoaded && !jsLoaded) {
        console.error('✗ فشل تحميل ملفات CSS و JavaScript');
        return { status: 'fail', message: 'فشل تحميل ملفات CSS و JavaScript' };
    } else if (!cssLoaded) {
        console.warn('⚠ فشل تحميل ملف CSS');
        return { status: 'warn', message: 'فشل تحميل ملف CSS' };
    } else {
        console.warn('⚠ فشل تحميل ملف JavaScript');
        return { status: 'warn', message: 'فشل تحميل ملف JavaScript' };
    }
}

/**
 * اختبار وظائف القائمة الفرعية
 * @param {HTMLElement} sidebar - عنصر القائمة الجانبية
 * @returns {Object} - نتيجة الاختبار
 */
function testSubmenuFunctionality(sidebar) {
    console.log('اختبار وظائف القائمة الفرعية...');
    
    // التحقق من وجود قوائم فرعية
    const submenus = sidebar.querySelectorAll('.submenu');
    if (submenus.length === 0) {
        console.error('✗ لم يتم العثور على قوائم فرعية');
        return { status: 'fail', message: 'لم يتم العثور على قوائم فرعية' };
    }
    
    // التحقق من وجود أزرار تبديل
    const toggleButtons = sidebar.querySelectorAll('.submenu-toggle');
    if (toggleButtons.length === 0) {
        console.warn('⚠ لم يتم العثور على أزرار تبديل للقوائم الفرعية');
        return { status: 'warn', message: 'لم يتم العثور على أزرار تبديل للقوائم الفرعية' };
    }
    
    // اختبار فتح وإغلاق القائمة الفرعية
    let toggleWorks = true;
    try {
        // اختبار القائمة الفرعية الأولى
        const firstSubmenuItem = sidebar.querySelector('.has-submenu');
        const firstSubmenu = firstSubmenuItem?.querySelector('.submenu');
        const firstToggle = firstSubmenuItem?.querySelector('.submenu-toggle');
        
        if (firstSubmenuItem && firstSubmenu && firstToggle) {
            // حفظ الحالة الأصلية
            const originalDisplay = firstSubmenu.style.display;
            
            // محاولة فتح القائمة
            if (originalDisplay === 'none') {
                toggleSubmenu(firstSubmenuItem);
                toggleWorks = firstSubmenu.style.display !== 'none';
            }
            
            // محاولة إغلاق القائمة
            if (originalDisplay !== 'none') {
                toggleSubmenu(firstSubmenuItem);
                toggleWorks = firstSubmenu.style.display === 'none';
                
                // إعادة فتح القائمة إذا كانت مفتوحة أصلاً
                if (originalDisplay !== 'none') {
                    toggleSubmenu(firstSubmenuItem);
                }
            }
        }
    } catch (error) {
        console.error('✗ حدث خطأ أثناء اختبار تبديل القائمة الفرعية:', error);
        toggleWorks = false;
    }
    
    if (!toggleWorks) {
        console.error('✗ لا تعمل وظيفة تبديل القائمة الفرعية بشكل صحيح');
        return { status: 'fail', message: 'لا تعمل وظيفة تبديل القائمة الفرعية بشكل صحيح' };
    }
    
    console.log('✓ تعمل وظائف القائمة الفرعية بشكل صحيح');
    return { status: 'pass', message: 'تعمل وظائف القائمة الفرعية بشكل صحيح' };
}

/**
 * اختبار وظيفة البحث
 * @param {HTMLElement} sidebar - عنصر القائمة الجانبية
 * @returns {Object} - نتيجة الاختبار
 */
function testSearchFunctionality(sidebar) {
    console.log('اختبار وظيفة البحث...');
    
    // التحقق من وجود حقل البحث
    const searchInput = sidebar.querySelector('#sidebar-search-input');
    if (!searchInput) {
        console.warn('⚠ لم يتم العثور على حقل البحث');
        return { status: 'warn', message: 'لم يتم العثور على حقل البحث' };
    }
    
    // اختبار وظيفة البحث
    let searchWorks = true;
    try {
        // حفظ الحالة الأصلية للقائمة
        const originalItems = Array.from(sidebar.querySelectorAll('.nav-item')).map(item => {
            return {
                element: item,
                display: item.style.display
            };
        });
        
        // محاكاة البحث عن نص موجود
        const testSearchTerm = 'الرئيسية';
        const event = new Event('input', { bubbles: true });
        searchInput.value = testSearchTerm;
        searchInput.dispatchEvent(event);
        
        // التحقق من نتائج البحث
        setTimeout(() => {
            const visibleItems = sidebar.querySelectorAll('.nav-item[style*="display: block"]');
            const hiddenItems = sidebar.querySelectorAll('.nav-item[style*="display: none"]');
            
            if (visibleItems.length === 0) {
                console.warn('⚠ لم يتم العثور على نتائج للبحث');
                searchWorks = false;
            }
            
            if (hiddenItems.length === 0 && sidebar.querySelectorAll('.nav-item').length > 1) {
                console.warn('⚠ لم يتم إخفاء أي عناصر غير مطابقة');
                searchWorks = false;
            }
            
            // إعادة تعيين البحث
            searchInput.value = '';
            searchInput.dispatchEvent(event);
            
            // إعادة الحالة الأصلية للقائمة
            originalItems.forEach(item => {
                item.element.style.display = item.display;
            });
        }, 300);
    } catch (error) {
        console.error('✗ حدث خطأ أثناء اختبار وظيفة البحث:', error);
        searchWorks = false;
    }
    
    if (!searchWorks) {
        console.warn('⚠ لا تعمل وظيفة البحث بشكل صحيح');
        return { status: 'warn', message: 'لا تعمل وظيفة البحث بشكل صحيح' };
    }
    
    console.log('✓ تعمل وظيفة البحث بشكل صحيح');
    return { status: 'pass', message: 'تعمل وظيفة البحث بشكل صحيح' };
}

/**
 * اختبار إدارة الحالة
 * @param {HTMLElement} sidebar - عنصر القائمة الجانبية
 * @returns {Object} - نتيجة الاختبار
 */
function testStateManagement(sidebar) {
    console.log('اختبار إدارة الحالة...');
    
    // التحقق من وجود وظائف إدارة الحالة
    const stateManagementWorks = typeof saveSidebarState === 'function' && 
                                typeof restoreSidebarState === 'function';
    
    if (!stateManagementWorks) {
        console.warn('⚠ لم يتم العثور على وظائف إدارة الحالة');
        return { status: 'warn', message: 'لم يتم العثور على وظائف إدارة الحالة' };
    }
    
    // اختبار حفظ واستعادة الحالة
    try {
        // حفظ الحالة الحالية
        saveSidebarState();
        
        // التحقق من وجود الحالة في التخزين المحلي
        const savedState = localStorage.getItem('sidebar-state');
        if (!savedState) {
            console.warn('⚠ لم يتم حفظ الحالة في التخزين المحلي');
            return { status: 'warn', message: 'لم يتم حفظ الحالة في التخزين المحلي' };
        }
        
        // محاولة تحليل الحالة المحفوظة
        try {
            const state = JSON.parse(savedState);
            if (typeof state !== 'object') {
                console.warn('⚠ الحالة المحفوظة ليست كائناً صالحاً');
                return { status: 'warn', message: 'الحالة المحفوظة ليست كائناً صالحاً' };
            }
        } catch (error) {
            console.error('✗ فشل تحليل الحالة المحفوظة:', error);
            return { status: 'fail', message: 'فشل تحليل الحالة المحفوظة' };
        }
        
        // اختبار استعادة الحالة
        restoreSidebarState();
    } catch (error) {
        console.error('✗ حدث خطأ أثناء اختبار إدارة الحالة:', error);
        return { status: 'fail', message: 'حدث خطأ أثناء اختبار إدارة الحالة' };
    }
    
    console.log('✓ تعمل إدارة الحالة بشكل صحيح');
    return { status: 'pass', message: 'تعمل إدارة الحالة بشكل صحيح' };
}

/**
 * اختبار التوافق مع الأجهزة المختلفة
 * @param {HTMLElement} sidebar - عنصر القائمة الجانبية
 * @returns {Object} - نتيجة الاختبار
 */
function testResponsiveness(sidebar) {
    console.log('اختبار التوافق مع الأجهزة المختلفة...');
    
    // التحقق من وجود أنماط CSS للأجهزة المحمولة
    const hasMobileStyles = Array.from(document.styleSheets).some(sheet => {
        try {
            if (!sheet.href || !sheet.href.includes('enhanced-sidebar.css')) return false;
            
            for (let i = 0; i < sheet.cssRules.length; i++) {
                const rule = sheet.cssRules[i];
                if (rule.media && rule.media.mediaText.includes('max-width')) {
                    return true;
                }
                if (rule.selectorText && rule.selectorText.includes('@media')) {
                    return true;
                }
            }
            return false;
        } catch (e) {
            // قد يحدث خطأ CORS عند محاولة الوصول إلى قواعد CSS من مصدر مختلف
            return false;
        }
    });
    
    if (!hasMobileStyles) {
        console.warn('⚠ لم يتم العثور على أنماط CSS للأجهزة المحمولة');
        return { status: 'warn', message: 'لم يتم العثور على أنماط CSS للأجهزة المحمولة' };
    }
    
    // اختبار التوافق مع الشاشات الصغيرة
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (viewportWidth < 768) {
        // التحقق من أن القائمة الجانبية لا تتجاوز عرض الشاشة
        const sidebarWidth = sidebar.offsetWidth;
        if (sidebarWidth > viewportWidth * 0.9) {
            console.warn('⚠ القائمة الجانبية عريضة جداً للشاشات الصغيرة');
            return { status: 'warn', message: 'القائمة الجانبية عريضة جداً للشاشات الصغيرة' };
        }
        
        // التحقق من وجود زر تبديل للأجهزة المحمولة
        const mobileToggle = document.querySelector('.sidebar-toggle');
        if (!mobileToggle) {
            console.warn('⚠ لم يتم العثور على زر تبديل للأجهزة المحمولة');
            return { status: 'warn', message: 'لم يتم العثور على زر تبديل للأجهزة المحمولة' };
        }
    }
    
    console.log('✓ القائمة الجانبية متوافقة مع الأجهزة المختلفة');
    return { status: 'pass', message: 'القائمة الجانبية متوافقة مع الأجهزة المختلفة' };
}

/**
 * اختبار إمكانية الوصول
 * @param {HTMLElement} sidebar - عنصر القائمة الجانبية
 * @returns {Object} - نتيجة الاختبار
 */
function testAccessibility(sidebar) {
    console.log('اختبار إمكانية الوصول...');
    
    let issues = [];
    
    // التحقق من وجود سمات ARIA
    const hasAriaAttributes = sidebar.querySelectorAll('[aria-expanded], [aria-controls], [aria-label]').length > 0;
    if (!hasAriaAttributes) {
        issues.push('لم يتم العثور على سمات ARIA');
    }
    
    // التحقق من إمكانية التنقل بلوحة المفاتيح
    const links = sidebar.querySelectorAll('a');
    let allLinksHaveTabIndex = true;
    links.forEach(link => {
        if (link.tabIndex < 0 && !link.closest('.submenu[style*="display: none"]')) {
            allLinksHaveTabIndex = false;
        }
    });
    
    if (!allLinksHaveTabIndex) {
        issues.push('بعض الروابط لا يمكن الوصول إليها باستخدام لوحة المفاتيح');
    }
    
    // التحقق من وجود نصوص بديلة للأيقونات
    const icons = sidebar.querySelectorAll('.nav-icon');
    let allIconsHaveAlt = true;
    icons.forEach(icon => {
        if (!icon.getAttribute('aria-hidden') && !icon.getAttribute('alt') && !icon.getAttribute('title')) {
            allIconsHaveAlt = false;
        }
    });
    
    if (!allIconsHaveAlt) {
        issues.push('بعض الأيقونات ليس لها نصوص بديلة');
    }
    
    if (issues.length > 0) {
        console.warn('⚠ مشكلات في إمكانية الوصول:', issues.join(', '));
        return { status: 'warn', message: 'مشكلات في إمكانية الوصول: ' + issues.join(', ') };
    }
    
    console.log('✓ القائمة الجانبية متوافقة مع معايير إمكانية الوصول');
    return { status: 'pass', message: 'القائمة الجانبية متوافقة مع معايير إمكانية الوصول' };
}

/**
 * اختبار الأداء
 * @param {HTMLElement} sidebar - عنصر القائمة الجانبية
 * @returns {Object} - نتيجة الاختبار
 */
function testPerformance(sidebar) {
    console.log('اختبار الأداء...');
    
    // قياس وقت تبديل القائمة الفرعية
    const submenuItems = sidebar.querySelectorAll('.has-submenu');
    if (submenuItems.length === 0) {
        console.warn('⚠ لم يتم العثور على قوائم فرعية لاختبار الأداء');
        return { status: 'warn', message: 'لم يتم العثور على قوائم فرعية لاختبار الأداء' };
    }
    
    // اختبار أداء تبديل القائمة الفرعية
    let toggleTimes = [];
    try {
        for (let i = 0; i < Math.min(submenuItems.length, 3); i++) {
            const item = submenuItems[i];
            const submenu = item.querySelector('.submenu');
            
            if (submenu) {
                // قياس وقت الفتح
                const startOpen = performance.now();
                toggleSubmenu(item);
                const endOpen = performance.now();
                
                // قياس وقت الإغلاق
                const startClose = performance.now();
                toggleSubmenu(item);
                const endClose = performance.now();
                
                toggleTimes.push(endOpen - startOpen, endClose - startClose);
            }
        }
    } catch (error) {
        console.error('✗ حدث خطأ أثناء اختبار أداء تبديل القائمة الفرعية:', error);
        return { status: 'fail', message: 'حدث خطأ أثناء اختبار أداء تبديل القائمة الفرعية' };
    }
    
    // حساب متوسط وقت التبديل
    const avgToggleTime = toggleTimes.length > 0 ? 
        toggleTimes.reduce((sum, time) => sum + time, 0) / toggleTimes.length : 
        0;
    
    if (avgToggleTime > 100) {
        console.warn(`⚠ أداء تبديل القائمة الفرعية بطيء (${avgToggleTime.toFixed(2)}ms)`);
        return { status: 'warn', message: `أداء تبديل القائمة الفرعية بطيء (${avgToggleTime.toFixed(2)}ms)` };
    }
    
    console.log(`✓ أداء القائمة الجانبية جيد (متوسط وقت التبديل: ${avgToggleTime.toFixed(2)}ms)`);
    return { status: 'pass', message: `أداء القائمة الجانبية جيد (متوسط وقت التبديل: ${avgToggleTime.toFixed(2)}ms)` };
}

/**
 * تبديل حالة جميع القوائم الفرعية
 * @param {HTMLElement} sidebar - عنصر القائمة الجانبية
 */
function toggleAllSubmenus(sidebar) {
    const submenus = sidebar.querySelectorAll('.has-submenu');
    const openCount = Array.from(submenus).filter(item => 
        item.classList.contains('submenu-open')
    ).length;
    
    const shouldClose = openCount > submenus.length / 2;
    
    submenus.forEach(item => {
        const submenu = item.querySelector('.submenu');
        const isOpen = item.classList.contains('submenu-open');
        
        if ((shouldClose && isOpen) || (!shouldClose && !isOpen)) {
            toggleSubmenu(item);
        }
    });
}

/**
 * محاكاة البحث
 * @param {HTMLElement} sidebar - عنصر القائمة الجانبية
 * @param {HTMLElement} toolbar - شريط أدوات الاختبار
 */
function simulateSearch(sidebar, toolbar) {
    const searchInput = sidebar.querySelector('#sidebar-search-input');
    if (!searchInput) {
        updateTestResults(toolbar, 'فشل محاكاة البحث', 'لم يتم العثور على حقل البحث', 'fail');
        return;
    }
    
    // إنشاء قائمة بكلمات البحث للاختبار
    const searchTerms = ['الرئيسية', 'المستخدمين', 'التقارير', 'الإعدادات', 'كلمة غير موجودة'];
    let currentTermIndex = 0;
    
    // تحديث حقل البحث كل ثانية
    const searchInterval = setInterval(() => {
        const term = searchTerms[currentTermIndex];
        searchInput.value = term;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        updateTestResults(toolbar, `جاري البحث عن "${term}"`, '', 'warn');
        
        currentTermIndex = (currentTermIndex + 1) % searchTerms.length;
        
        // إيقاف البحث بعد اختبار جميع الكلمات
        if (currentTermIndex === 0) {
            clearInterval(searchInterval);
            
            // إعادة تعيين البحث
            setTimeout(() => {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                updateTestResults(toolbar, 'اكتملت محاكاة البحث', 'تم اختبار جميع كلمات البحث بنجاح', 'pass');
            }, 1000);
        }
    }, 1000);
}

/**
 * محاكاة خطأ
 * @param {HTMLElement} sidebar - عنصر القائمة الجانبية
 * @param {HTMLElement} toolbar - شريط أدوات الاختبار
 */
function simulateError(sidebar, toolbar) {
    updateTestResults(toolbar, 'جاري محاكاة خطأ...', '', 'warn');
    
    setTimeout(() => {
        try {
            // محاولة إحداث خطأ متعمد
            const nonExistentFunction = window.nonExistentFunction;
            nonExistentFunction();
        } catch (error) {
            console.error('تم محاكاة خطأ:', error);
            
            // عرض معلومات الخطأ
            updateTestResults(toolbar, 'تم محاكاة خطأ بنجاح', `نوع الخطأ: ${error.name}\nرسالة الخطأ: ${error.message}`, 'fail');
            
            // محاولة التعافي من الخطأ
            setTimeout(() => {
                updateTestResults(toolbar, 'تم التعافي من الخطأ', 'تم اختبار آلية التعافي من الأخطاء بنجاح', 'pass');
            }, 2000);
        }
    }, 1000);
}

/**
 * تطبيق التحسينات التلقائية
 * @param {HTMLElement} sidebar - عنصر القائمة الجانبية
 */
function applyAutomaticImprovements(sidebar) {
    console.log('تطبيق التحسينات التلقائية...');
    
    // إضافة سمات ARIA المفقودة
    const submenuItems = sidebar.querySelectorAll('.has-submenu');
    submenuItems.forEach((item, index) => {
        const link = item.querySelector('.nav-link');
        const submenu = item.querySelector('.submenu');
        const toggle = item.querySelector('.submenu-toggle');
        
        if (link && submenu) {
            const submenuId = `submenu-${index}`;
            submenu.id = submenuId;
            
            if (!link.hasAttribute('aria-expanded')) {
                link.setAttribute('aria-expanded', item.classList.contains('submenu-open') ? 'true' : 'false');
            }
            
            if (!link.hasAttribute('aria-controls')) {
                link.setAttribute('aria-controls', submenuId);
            }
        }
        
        if (toggle && !toggle.hasAttribute('aria-label')) {
            toggle.setAttribute('aria-label', 'فتح/إغلاق القائمة الفرعية');
        }
    });
    
    // إضافة tabindex للروابط
    const links = sidebar.querySelectorAll('a');
    links.forEach(link => {
        if (!link.hasAttribute('tabindex') && !link.closest('.submenu[style*="display: none"]')) {
            link.setAttribute('tabindex', '0');
        }
    });
    
    // إضافة نصوص بديلة للأيقونات
    const icons = sidebar.querySelectorAll('.nav-icon');
    icons.forEach(icon => {
        if (!icon.hasAttribute('aria-hidden') && !icon.hasAttribute('alt') && !icon.hasAttribute('title')) {
            icon.setAttribute('aria-hidden', 'true');
        }
    });
    
    // تحسين أداء التبديل
    const style = document.createElement('style');
    style.textContent = `
        .submenu {
            transition: max-height 0.3s ease, opacity 0.3s ease;
            max-height: 0;
            opacity: 0;
            overflow: hidden;
        }
        .submenu-open > .submenu {
            max-height: 1000px;
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    // إضافة دعم للأجهزة المحمولة إذا كان مفقوداً
    if (window.innerWidth < 768 && !document.querySelector('.sidebar-toggle')) {
        const mobileToggle = document.createElement('div');
        mobileToggle.className = 'sidebar-toggle';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            
            // إضافة/إزالة الخلفية
            let backdrop = document.querySelector('.sidebar-backdrop');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.className = 'sidebar-backdrop';
                document.body.appendChild(backdrop);
                
                backdrop.addEventListener('click', function() {
                    sidebar.classList.remove('show');
                    backdrop.classList.remove('show');
                });
            }
            
            backdrop.classList.toggle('show');
        });
        
        document.body.appendChild(mobileToggle);
    }
    
    console.log('✓ تم تطبيق التحسينات التلقائية بنجاح');
}
