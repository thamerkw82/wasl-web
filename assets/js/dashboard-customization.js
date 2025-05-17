/**
 * نظام تخصيص لوحة الإحصائيات
 * يوفر واجهة متقدمة لتخصيص وتكوين لوحة الإحصائيات حسب احتياجات المستخدم
 * مع دعم السحب والإفلات، تغيير الحجم، وحفظ التخصيصات
 */

document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نظام تخصيص لوحة الإحصائيات
    initDashboardCustomization();
});

/**
 * تهيئة نظام تخصيص لوحة الإحصائيات
 */
function initDashboardCustomization() {
    console.log('تهيئة نظام تخصيص لوحة الإحصائيات...');
    
    // التحقق من وجود لوحة الإحصائيات
    const dashboard = document.querySelector('.dashboard-stats, .statistics-container, .dashboard-widgets');
    if (!dashboard) {
        console.warn('لم يتم العثور على لوحة الإحصائيات!');
        return;
    }
    
    // إضافة فئة للوحة الإحصائيات
    dashboard.classList.add('customizable-dashboard');
    
    // إضافة زر التخصيص
    addCustomizationButton(dashboard);
    
    // تهيئة السحب والإفلات
    initDragAndDrop(dashboard);
    
    // تهيئة تغيير الحجم
    initResizing(dashboard);
    
    // استعادة التخصيصات المحفوظة
    restoreDashboardCustomization(dashboard);
    
    // إضافة مستمع لأحداث النافذة لحفظ التخصيصات عند المغادرة
    window.addEventListener('beforeunload', function() {
        saveDashboardCustomization(dashboard);
    });
}

/**
 * إضافة زر التخصيص
 * @param {HTMLElement} dashboard - عنصر لوحة الإحصائيات
 */
function addCustomizationButton(dashboard) {
    // إنشاء زر التخصيص
    const customizeButton = document.createElement('button');
    customizeButton.className = 'btn btn-sm btn-outline-primary dashboard-customize-btn';
    customizeButton.innerHTML = '<i class="fas fa-cog"></i> تخصيص لوحة الإحصائيات';
    
    // إضافة الزر قبل لوحة الإحصائيات
    dashboard.parentNode.insertBefore(customizeButton, dashboard);
    
    // إضافة حدث النقر
    customizeButton.addEventListener('click', function() {
        toggleCustomizationMode(dashboard);
    });
}

/**
 * تبديل وضع التخصيص
 * @param {HTMLElement} dashboard - عنصر لوحة الإحصائيات
 */
function toggleCustomizationMode(dashboard) {
    // تبديل فئة وضع التخصيص
    dashboard.classList.toggle('customization-mode');
    
    // الحصول على زر التخصيص
    const customizeButton = document.querySelector('.dashboard-customize-btn');
    
    // تحديث نص الزر
    if (dashboard.classList.contains('customization-mode')) {
        customizeButton.innerHTML = '<i class="fas fa-check"></i> حفظ التخصيص';
        
        // إظهار أدوات التخصيص
        showCustomizationTools(dashboard);
        
        // إظهار رسالة المساعدة
        showCustomizationHelp(dashboard);
    } else {
        customizeButton.innerHTML = '<i class="fas fa-cog"></i> تخصيص لوحة الإحصائيات';
        
        // إخفاء أدوات التخصيص
        hideCustomizationTools(dashboard);
        
        // إخفاء رسالة المساعدة
        hideCustomizationHelp();
        
        // حفظ التخصيصات
        saveDashboardCustomization(dashboard);
    }
}

/**
 * إظهار أدوات التخصيص
 * @param {HTMLElement} dashboard - عنصر لوحة الإحصائيات
 */
function showCustomizationTools(dashboard) {
    // الحصول على جميع البطاقات في لوحة الإحصائيات
    const cards = dashboard.querySelectorAll('.card, .stat-card, .dashboard-widget');
    
    // إضافة أدوات التخصيص لكل بطاقة
    cards.forEach(card => {
        // إضافة فئة قابلية السحب
        card.classList.add('draggable');
        
        // إنشاء شريط أدوات التخصيص
        const toolbar = document.createElement('div');
        toolbar.className = 'card-customize-toolbar';
        toolbar.innerHTML = `
            <button class="btn btn-sm btn-light drag-handle" title="سحب"><i class="fas fa-arrows-alt"></i></button>
            <button class="btn btn-sm btn-light resize-handle" title="تغيير الحجم"><i class="fas fa-expand-arrows-alt"></i></button>
            <div class="btn-group">
                <button class="btn btn-sm btn-light card-color" data-color="primary" title="أزرق"><i class="fas fa-square text-primary"></i></button>
                <button class="btn btn-sm btn-light card-color" data-color="success" title="أخضر"><i class="fas fa-square text-success"></i></button>
                <button class="btn btn-sm btn-light card-color" data-color="danger" title="أحمر"><i class="fas fa-square text-danger"></i></button>
                <button class="btn btn-sm btn-light card-color" data-color="warning" title="برتقالي"><i class="fas fa-square text-warning"></i></button>
                <button class="btn btn-sm btn-light card-color" data-color="info" title="سماوي"><i class="fas fa-square text-info"></i></button>
                <button class="btn btn-sm btn-light card-color" data-color="dark" title="داكن"><i class="fas fa-square text-dark"></i></button>
            </div>
            <button class="btn btn-sm btn-light card-refresh" title="تحديث"><i class="fas fa-sync-alt"></i></button>
            <button class="btn btn-sm btn-light card-hide" title="إخفاء"><i class="fas fa-eye-slash"></i></button>
        `;
        
        // إضافة شريط الأدوات إلى البطاقة
        card.appendChild(toolbar);
        
        // إضافة أحداث الأزرار
        addToolbarEvents(card, toolbar);
    });
    
    // إضافة زر إضافة بطاقة جديدة
    const addCardButton = document.createElement('button');
    addCardButton.className = 'btn btn-primary add-card-btn';
    addCardButton.innerHTML = '<i class="fas fa-plus"></i> إضافة بطاقة جديدة';
    addCardButton.addEventListener('click', function() {
        showAddCardModal(dashboard);
    });
    
    // إضافة زر استعادة البطاقات المخفية
    const restoreCardsButton = document.createElement('button');
    restoreCardsButton.className = 'btn btn-outline-secondary restore-cards-btn';
    restoreCardsButton.innerHTML = '<i class="fas fa-eye"></i> استعادة البطاقات المخفية';
    restoreCardsButton.addEventListener('click', function() {
        restoreHiddenCards(dashboard);
    });
    
    // إنشاء حاوية للأزرار
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'dashboard-customize-buttons';
    buttonsContainer.appendChild(addCardButton);
    buttonsContainer.appendChild(restoreCardsButton);
    
    // إضافة الأزرار إلى لوحة الإحصائيات
    dashboard.appendChild(buttonsContainer);
}

/**
 * إضافة أحداث شريط الأدوات
 * @param {HTMLElement} card - عنصر البطاقة
 * @param {HTMLElement} toolbar - شريط أدوات التخصيص
 */
function addToolbarEvents(card, toolbar) {
    // زر تغيير لون البطاقة
    toolbar.querySelectorAll('.card-color').forEach(button => {
        button.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            changeCardColor(card, color);
        });
    });
    
    // زر تحديث البطاقة
    toolbar.querySelector('.card-refresh').addEventListener('click', function() {
        refreshCard(card);
    });
    
    // زر إخفاء البطاقة
    toolbar.querySelector('.card-hide').addEventListener('click', function() {
        hideCard(card);
    });
}

/**
 * تغيير لون البطاقة
 * @param {HTMLElement} card - عنصر البطاقة
 * @param {string} color - اللون الجديد
 */
function changeCardColor(card, color) {
    // إزالة جميع فئات الألوان الحالية
    card.classList.remove('card-primary', 'card-success', 'card-danger', 'card-warning', 'card-info', 'card-dark');
    
    // إضافة فئة اللون الجديد
    card.classList.add(`card-${color}`);
    
    // تحديث لون الرأس إذا كان موجوداً
    const cardHeader = card.querySelector('.card-header');
    if (cardHeader) {
        cardHeader.classList.remove('bg-primary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-dark');
        cardHeader.classList.add(`bg-${color}`);
    }
}

/**
 * تحديث البطاقة
 * @param {HTMLElement} card - عنصر البطاقة
 */
function refreshCard(card) {
    // إضافة فئة التحميل
    card.classList.add('card-loading');
    
    // إضافة مؤشر التحميل
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'card-loading-indicator';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    card.appendChild(loadingIndicator);
    
    // محاكاة التحديث
    setTimeout(function() {
        // إزالة فئة التحميل
        card.classList.remove('card-loading');
        
        // إزالة مؤشر التحميل
        card.removeChild(loadingIndicator);
        
        // تحديث البيانات (هنا يمكن إضافة طلب AJAX لتحديث البيانات)
        const timestamp = new Date().toLocaleTimeString();
        const cardBody = card.querySelector('.card-body');
        if (cardBody) {
            // إضافة وقت التحديث
            let updateInfo = card.querySelector('.update-timestamp');
            if (!updateInfo) {
                updateInfo = document.createElement('small');
                updateInfo.className = 'text-muted update-timestamp';
                cardBody.appendChild(updateInfo);
            }
            updateInfo.textContent = `آخر تحديث: ${timestamp}`;
        }
    }, 1500);
}

/**
 * إخفاء البطاقة
 * @param {HTMLElement} card - عنصر البطاقة
 */
function hideCard(card) {
    // إضافة فئة الإخفاء
    card.classList.add('card-hidden');
    
    // حفظ معلومات البطاقة المخفية
    const hiddenCards = JSON.parse(localStorage.getItem('dashboard-hidden-cards') || '[]');
    const cardId = card.id || `card-${Date.now()}`;
    card.id = cardId;
    
    if (!hiddenCards.includes(cardId)) {
        hiddenCards.push(cardId);
        localStorage.setItem('dashboard-hidden-cards', JSON.stringify(hiddenCards));
    }
    
    // إخفاء البطاقة بعد التأثير
    setTimeout(function() {
        card.style.display = 'none';
    }, 300);
}

/**
 * استعادة البطاقات المخفية
 * @param {HTMLElement} dashboard - عنصر لوحة الإحصائيات
 */
function restoreHiddenCards(dashboard) {
    // الحصول على قائمة البطاقات المخفية
    const hiddenCards = JSON.parse(localStorage.getItem('dashboard-hidden-cards') || '[]');
    
    // لا توجد بطاقات مخفية
    if (hiddenCards.length === 0) {
        alert('لا توجد بطاقات مخفية لاستعادتها.');
        return;
    }
    
    // استعادة كل بطاقة مخفية
    hiddenCards.forEach(cardId => {
        const card = document.getElementById(cardId);
        if (card) {
            // إظهار البطاقة
            card.style.display = '';
            
            // إزالة فئة الإخفاء
            setTimeout(function() {
                card.classList.remove('card-hidden');
            }, 10);
        }
    });
    
    // مسح قائمة البطاقات المخفية
    localStorage.removeItem('dashboard-hidden-cards');
}

/**
 * إظهار نافذة إضافة بطاقة جديدة
 * @param {HTMLElement} dashboard - عنصر لوحة الإحصائيات
 */
function showAddCardModal(dashboard) {
    // إنشاء نافذة الإضافة
    const modal = document.createElement('div');
    modal.className = 'add-card-modal';
    modal.innerHTML = `
        <div class="add-card-content">
            <div class="add-card-header">
                <h5>إضافة بطاقة جديدة</h5>
                <button type="button" class="close-modal">&times;</button>
            </div>
            <div class="add-card-body">
                <div class="form-group">
                    <label>نوع البطاقة:</label>
                    <select class="form-control" id="card-type">
                        <option value="stat">إحصائية بسيطة</option>
                        <option value="chart">رسم بياني</option>
                        <option value="list">قائمة</option>
                        <option value="progress">شريط تقدم</option>
                        <option value="custom">مخصص</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>العنوان:</label>
                    <input type="text" class="form-control" id="card-title" placeholder="عنوان البطاقة">
                </div>
                <div class="form-group">
                    <label>الوصف:</label>
                    <textarea class="form-control" id="card-description" placeholder="وصف البطاقة"></textarea>
                </div>
                <div class="form-group">
                    <label>اللون:</label>
                    <select class="form-control" id="card-color">
                        <option value="primary">أزرق</option>
                        <option value="success">أخضر</option>
                        <option value="danger">أحمر</option>
                        <option value="warning">برتقالي</option>
                        <option value="info">سماوي</option>
                        <option value="dark">داكن</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>الحجم:</label>
                    <select class="form-control" id="card-size">
                        <option value="small">صغير</option>
                        <option value="medium" selected>متوسط</option>
                        <option value="large">كبير</option>
                    </select>
                </div>
                <div id="card-type-options"></div>
            </div>
            <div class="add-card-footer">
                <button type="button" class="btn btn-primary" id="add-card-btn">إضافة</button>
                <button type="button" class="btn btn-secondary" id="cancel-add-card">إلغاء</button>
            </div>
        </div>
    `;
    
    // إضافة أنماط CSS
    const styles = document.createElement('style');
    styles.textContent = `
        .add-card-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1050;
        }
        .add-card-content {
            background-color: white;
            border-radius: 5px;
            width: 500px;
            max-width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        .add-card-header {
            padding: 15px;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .add-card-body {
            padding: 15px;
        }
        .add-card-footer {
            padding: 15px;
            border-top: 1px solid #dee2e6;
            text-align: right;
        }
        .close-modal {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(styles);
    
    // إضافة النافذة إلى الصفحة
    document.body.appendChild(modal);
    
    // إضافة أحداث الأزرار
    modal.querySelector('.close-modal').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#cancel-add-card').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // إضافة حدث تغيير نوع البطاقة
    modal.querySelector('#card-type').addEventListener('change', function() {
        updateCardTypeOptions(this.value, modal);
    });
    
    // تحديث خيارات نوع البطاقة الافتراضي
    updateCardTypeOptions('stat', modal);
    
    // إضافة حدث إضافة البطاقة
    modal.querySelector('#add-card-btn').addEventListener('click', function() {
        addNewCard(dashboard, modal);
    });
}

/**
 * تحديث خيارات نوع البطاقة
 * @param {string} type - نوع البطاقة
 * @param {HTMLElement} modal - نافذة الإضافة
 */
function updateCardTypeOptions(type, modal) {
    const optionsContainer = modal.querySelector('#card-type-options');
    
    // مسح الخيارات الحالية
    optionsContainer.innerHTML = '';
    
    // إضافة الخيارات حسب النوع
    switch (type) {
        case 'stat':
            optionsContainer.innerHTML = `
                <div class="form-group">
                    <label>القيمة:</label>
                    <input type="text" class="form-control" id="stat-value" placeholder="القيمة">
                </div>
                <div class="form-group">
                    <label>النص الفرعي:</label>
                    <input type="text" class="form-control" id="stat-subtext" placeholder="النص الفرعي">
                </div>
                <div class="form-group">
                    <label>الأيقونة:</label>
                    <select class="form-control" id="stat-icon">
                        <option value="fa-chart-line">رسم بياني</option>
                        <option value="fa-users">مستخدمين</option>
                        <option value="fa-calendar">تقويم</option>
                        <option value="fa-envelope">بريد</option>
                        <option value="fa-check">صح</option>
                        <option value="fa-bell">جرس</option>
                    </select>
                </div>
            `;
            break;
        
        case 'chart':
            optionsContainer.innerHTML = `
                <div class="form-group">
                    <label>نوع الرسم البياني:</label>
                    <select class="form-control" id="chart-type">
                        <option value="line">خطي</option>
                        <option value="bar">شريطي</option>
                        <option value="pie">دائري</option>
                        <option value="doughnut">حلقي</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>البيانات (قيم مفصولة بفواصل):</label>
                    <input type="text" class="form-control" id="chart-data" placeholder="10,20,30,40,50">
                </div>
                <div class="form-group">
                    <label>التسميات (مفصولة بفواصل):</label>
                    <input type="text" class="form-control" id="chart-labels" placeholder="يناير,فبراير,مارس,أبريل,مايو">
                </div>
            `;
            break;
        
        case 'list':
            optionsContainer.innerHTML = `
                <div class="form-group">
                    <label>العناصر (عنصر واحد في كل سطر):</label>
                    <textarea class="form-control" id="list-items" rows="5" placeholder="العنصر الأول&#10;العنصر الثاني&#10;العنصر الثالث"></textarea>
                </div>
                <div class="form-group">
                    <label>نوع القائمة:</label>
                    <select class="form-control" id="list-type">
                        <option value="simple">بسيطة</option>
                        <option value="numbered">مرقمة</option>
                        <option value="icons">مع أيقونات</option>
                    </select>
                </div>
            `;
            break;
        
        case 'progress':
            optionsContainer.innerHTML = `
                <div class="form-group">
                    <label>القيمة (%):</label>
                    <input type="number" class="form-control" id="progress-value" min="0" max="100" value="50">
                </div>
                <div class="form-group">
                    <label>النص:</label>
                    <input type="text" class="form-control" id="progress-text" placeholder="اكتمل 50% من المهام">
                </div>
                <div class="form-group">
                    <label>نوع شريط التقدم:</label>
                    <select class="form-control" id="progress-type">
                        <option value="simple">بسيط</option>
                        <option value="striped">مخطط</option>
                        <option value="animated">متحرك</option>
                    </select>
                </div>
            `;
            break;
        
        case 'custom':
            optionsContainer.innerHTML = `
                <div class="form-group">
                    <label>محتوى HTML مخصص:</label>
                    <textarea class="form-control" id="custom-html" rows="8" placeholder="<div class='text-center'>&#10;  <i class='fas fa-check-circle fa-3x text-success'></i>&#10;  <h4>محتوى مخصص</h4>&#10;  <p>يمكنك إضافة أي محتوى HTML هنا.</p>&#10;</div>"></textarea>
                </div>
            `;
            break;
    }
}

/**
 * إضافة بطاقة جديدة
 * @param {HTMLElement} dashboard - عنصر لوحة الإحصائيات
 * @param {HTMLElement} modal - نافذة الإضافة
 */
function addNewCard(dashboard, modal) {
    // الحصول على قيم النموذج
    const type = modal.querySelector('#card-type').value;
    const title = modal.querySelector('#card-title').value || 'بطاقة جديدة';
    const description = modal.querySelector('#card-description').value || '';
    const color = modal.querySelector('#card-color').value || 'primary';
    const size = modal.querySelector('#card-size').value || 'medium';
    
    // إنشاء البطاقة الجديدة
    const card = document.createElement('div');
    card.className = `card card-${color} draggable`;
    card.id = `card-${Date.now()}`;
    
    // تعيين حجم البطاقة
    if (size === 'small') {
        card.style.width = '250px';
        card.style.height = '150px';
    } else if (size === 'large') {
        card.style.width = '450px';
        card.style.height = '350px';
    } else {
        card.style.width = '350px';
        card.style.height = '250px';
    }
    
    // إنشاء رأس البطاقة
    const cardHeader = document.createElement('div');
    cardHeader.className = `card-header bg-${color}`;
    cardHeader.textContent = title;
    
    // إنشاء جسم البطاقة
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    
    // إضافة المحتوى حسب النوع
    switch (type) {
        case 'stat':
            const statValue = modal.querySelector('#stat-value').value || '0';
            const statSubtext = modal.querySelector('#stat-subtext').value || '';
            const statIcon = modal.querySelector('#stat-icon').value || 'fa-chart-line';
            
            cardBody.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h3 class="mb-0">${statValue}</h3>
                        <small class="text-muted">${statSubtext}</small>
                        <p class="card-text mt-2">${description}</p>
                    </div>
                    <div class="stat-icon">
                        <i class="fas ${statIcon} fa-3x text-${color}"></i>
                    </div>
                </div>
            `;
            break;
        
        case 'chart':
            const chartType = modal.querySelector('#chart-type').value || 'line';
            const chartData = modal.querySelector('#chart-data').value || '10,20,30,40,50';
            const chartLabels = modal.querySelector('#chart-labels').value || 'يناير,فبراير,مارس,أبريل,مايو';
            
            const chartContainer = document.createElement('div');
            chartContainer.className = 'chart-container';
            chartContainer.style.height = '80%';
            
            const canvas = document.createElement('canvas');
            canvas.id = `chart-${Date.now()}`;
            chartContainer.appendChild(canvas);
            
            cardBody.innerHTML = `<p class="card-text">${description}</p>`;
            cardBody.appendChild(chartContainer);
            
            // إنشاء الرسم البياني بعد إضافة البطاقة إلى الصفحة
            setTimeout(() => {
                createChart(canvas.id, chartType, chartLabels.split(','), chartData.split(',').map(Number), color);
            }, 100);
            break;
        
        case 'list':
            const listItems = modal.querySelector('#list-items').value || '';
            const listType = modal.querySelector('#list-type').value || 'simple';
            
            let listHTML = '';
            
            if (listType === 'numbered') {
                listHTML = '<ol class="list-group list-group-numbered">';
                listItems.split('\n').forEach(item => {
                    if (item.trim()) {
                        listHTML += `<li class="list-group-item">${item.trim()}</li>`;
                    }
                });
                listHTML += '</ol>';
            } else if (listType === 'icons') {
                listHTML = '<ul class="list-group list-group-flush">';
                listItems.split('\n').forEach(item => {
                    if (item.trim()) {
                        listHTML += `<li class="list-group-item"><i class="fas fa-check-circle text-${color} me-2"></i>${item.trim()}</li>`;
                    }
                });
                listHTML += '</ul>';
            } else {
                listHTML = '<ul class="list-group list-group-flush">';
                listItems.split('\n').forEach(item => {
                    if (item.trim()) {
                        listHTML += `<li class="list-group-item">${item.trim()}</li>`;
                    }
                });
                listHTML += '</ul>';
            }
            
            cardBody.innerHTML = `<p class="card-text">${description}</p>${listHTML}`;
            break;
        
        case 'progress':
            const progressValue = modal.querySelector('#progress-value').value || '50';
            const progressText = modal.querySelector('#progress-text').value || '';
            const progressType = modal.querySelector('#progress-type').value || 'simple';
            
            let progressClasses = 'progress-bar';
            if (progressType === 'striped') {
                progressClasses += ' progress-bar-striped';
            } else if (progressType === 'animated') {
                progressClasses += ' progress-bar-striped progress-bar-animated';
            }
            
            cardBody.innerHTML = `
                <p class="card-text">${description}</p>
                <div class="progress mb-3">
                    <div class="progress-bar ${progressClasses} bg-${color}" role="progressbar" style="width: ${progressValue}%" aria-valuenow="${progressValue}" aria-valuemin="0" aria-valuemax="100">${progressValue}%</div>
                </div>
                <p class="text-center">${progressText}</p>
            `;
            break;
        
        case 'custom':
            const customHTML = modal.querySelector('#custom-html').value || '';
            cardBody.innerHTML = customHTML;
            break;
    }
    
    // إضافة العناصر إلى البطاقة
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    
    // إضافة البطاقة إلى لوحة الإحصائيات
    dashboard.insertBefore(card, dashboard.querySelector('.dashboard-customize-buttons'));
    
    // إضافة أدوات التخصيص
    const toolbar = document.createElement('div');
    toolbar.className = 'card-customize-toolbar';
    toolbar.innerHTML = `
        <button class="btn btn-sm btn-light drag-handle" title="سحب"><i class="fas fa-arrows-alt"></i></button>
        <button class="btn btn-sm btn-light resize-handle" title="تغيير الحجم"><i class="fas fa-expand-arrows-alt"></i></button>
        <div class="btn-group">
            <button class="btn btn-sm btn-light card-color" data-color="primary" title="أزرق"><i class="fas fa-square text-primary"></i></button>
            <button class="btn btn-sm btn-light card-color" data-color="success" title="أخضر"><i class="fas fa-square text-success"></i></button>
            <button class="btn btn-sm btn-light card-color" data-color="danger" title="أحمر"><i class="fas fa-square text-danger"></i></button>
            <button class="btn btn-sm btn-light card-color" data-color="warning" title="برتقالي"><i class="fas fa-square text-warning"></i></button>
            <button class="btn btn-sm btn-light card-color" data-color="info" title="سماوي"><i class="fas fa-square text-info"></i></button>
            <button class="btn btn-sm btn-light card-color" data-color="dark" title="داكن"><i class="fas fa-square text-dark"></i></button>
        </div>
        <button class="btn btn-sm btn-light card-refresh" title="تحديث"><i class="fas fa-sync-alt"></i></button>
        <button class="btn btn-sm btn-light card-hide" title="إخفاء"><i class="fas fa-eye-slash"></i></button>
    `;
    card.appendChild(toolbar);
    
    // إضافة أحداث الأزرار
    addToolbarEvents(card, toolbar);
    
    // تهيئة السحب والإفلات وتغيير الحجم
    initDragAndDrop(dashboard);
    initResizing(dashboard);
    
    // إغلاق النافذة
    document.body.removeChild(modal);
}

/**
 * إنشاء رسم بياني
 * @param {string} canvasId - معرف عنصر الرسم البياني
 * @param {string} type - نوع الرسم البياني
 * @param {Array} labels - تسميات البيانات
 * @param {Array} data - قيم البيانات
 * @param {string} color - لون الرسم البياني
 */
function createChart(canvasId, type, labels, data, color) {
    // التحقق من وجود مكتبة Chart.js
    if (typeof Chart === 'undefined') {
        // تحميل مكتبة Chart.js إذا لم تكن موجودة
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = function() {
            // إنشاء الرسم البياني بعد تحميل المكتبة
            createChartInstance(canvasId, type, labels, data, color);
        };
        document.head.appendChild(script);
    } else {
        // إنشاء الرسم البياني مباشرة
        createChartInstance(canvasId, type, labels, data, color);
    }
}

/**
 * إنشاء مثيل الرسم البياني
 * @param {string} canvasId - معرف عنصر الرسم البياني
 * @param {string} type - نوع الرسم البياني
 * @param {Array} labels - تسميات البيانات
 * @param {Array} data - قيم البيانات
 * @param {string} color - لون الرسم البياني
 */
function createChartInstance(canvasId, type, labels, data, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    // تحويل لون Bootstrap إلى لون CSS
    const colorMap = {
        'primary': '#007bff',
        'success': '#28a745',
        'danger': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8',
        'dark': '#343a40'
    };
    
    const chartColor = colorMap[color] || colorMap.primary;
    
    // إنشاء الرسم البياني
    new Chart(canvas, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: 'البيانات',
                data: data,
                backgroundColor: type === 'line' ? 'rgba(0, 123, 255, 0.1)' : [
                    'rgba(0, 123, 255, 0.7)',
                    'rgba(40, 167, 69, 0.7)',
                    'rgba(220, 53, 69, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(23, 162, 184, 0.7)',
                    'rgba(52, 58, 64, 0.7)'
                ],
                borderColor: chartColor,
                borderWidth: 2,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: type === 'pie' || type === 'doughnut',
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    display: type !== 'pie' && type !== 'doughnut',
                    beginAtZero: true
                },
                x: {
                    display: type !== 'pie' && type !== 'doughnut'
                }
            }
        }
    });
}

/**
 * إخفاء أدوات التخصيص
 * @param {HTMLElement} dashboard - عنصر لوحة الإحصائيات
 */
function hideCustomizationTools(dashboard) {
    // إزالة أدوات التخصيص من البطاقات
    dashboard.querySelectorAll('.card-customize-toolbar').forEach(toolbar => {
        toolbar.parentNode.removeChild(toolbar);
    });
    
    // إزالة فئة قابلية السحب
    dashboard.querySelectorAll('.draggable').forEach(card => {
        card.classList.remove('draggable');
    });
    
    // إزالة أزرار التخصيص
    const buttonsContainer = dashboard.querySelector('.dashboard-customize-buttons');
    if (buttonsContainer) {
        dashboard.removeChild(buttonsContainer);
    }
}

/**
 * إظهار رسالة المساعدة
 * @param {HTMLElement} dashboard - عنصر لوحة الإحصائيات
 */
function showCustomizationHelp(dashboard) {
    // إنشاء رسالة المساعدة
    const helpMessage = document.createElement('div');
    helpMessage.className = 'customization-help-message';
    helpMessage.innerHTML = `
        <div class="help-content">
            <h5>تعليمات التخصيص</h5>
            <ul>
                <li><i class="fas fa-arrows-alt"></i> اسحب البطاقات لتغيير موقعها</li>
                <li><i class="fas fa-expand-arrows-alt"></i> اسحب لتغيير حجم البطاقة</li>
                <li><i class="fas fa-square"></i> انقر لتغيير لون البطاقة</li>
                <li><i class="fas fa-sync-alt"></i> انقر لتحديث بيانات البطاقة</li>
                <li><i class="fas fa-eye-slash"></i> انقر لإخفاء البطاقة</li>
                <li><i class="fas fa-plus"></i> انقر لإضافة بطاقة جديدة</li>
                <li><i class="fas fa-eye"></i> انقر لاستعادة البطاقات المخفية</li>
            </ul>
            <button class="btn btn-sm btn-secondary close-help">إغلاق</button>
        </div>
    `;
    
    // إضافة أنماط CSS
    const styles = document.createElement('style');
    styles.textContent = `
        .customization-help-message {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            max-width: 300px;
        }
        .help-content {
            padding: 15px;
        }
        .help-content h5 {
            margin-bottom: 10px;
        }
        .help-content ul {
            padding-right: 20px;
            margin-bottom: 15px;
        }
        .help-content li {
            margin-bottom: 5px;
        }
    `;
    document.head.appendChild(styles);
    
    // إضافة رسالة المساعدة إلى الصفحة
    document.body.appendChild(helpMessage);
    
    // إضافة حدث إغلاق المساعدة
    helpMessage.querySelector('.close-help').addEventListener('click', function() {
        document.body.removeChild(helpMessage);
    });
}

/**
 * إخفاء رسالة المساعدة
 */
function hideCustomizationHelp() {
    const helpMessage = document.querySelector('.customization-help-message');
    if (helpMessage) {
        document.body.removeChild(helpMessage);
    }
}

/**
 * تهيئة السحب والإفلات
 * @param {HTMLElement} dashboard - عنصر لوحة الإحصائيات
 */
function initDragAndDrop(dashboard) {
    // التحقق من وجود مكتبة interact.js
    if (typeof interact === 'undefined') {
        // تحميل مكتبة interact.js إذا لم تكن موجودة
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js';
        script.onload = function() {
            // تهيئة السحب والإفلات بعد تحميل المكتبة
            initDragAndDropWithInteract(dashboard);
        };
        document.head.appendChild(script);
    } else {
        // تهيئة السحب والإفلات مباشرة
        initDragAndDropWithInteract(dashboard);
    }
}

/**
 * تهيئة السحب والإفلات باستخدام interact.js
 * @param {HTMLElement} dashboard - عنصر لوحة الإحصائيات
 */
function initDragAndDropWithInteract(dashboard) {
    // تهيئة السحب والإفلات للبطاقات
    interact('.draggable').draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: dashboard,
                endOnly: true
            })
        ],
        autoScroll: true,
        listeners: {
            start(event) {
                event.target.classList.add('dragging');
            },
            move(event) {
                const target = event.target;
                
                // الحصول على الموقع الحالي من الخصائص المخزنة أو تعيين 0 إذا لم تكن موجودة
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                
                // تحديث موقع العنصر
                target.style.transform = `translate(${x}px, ${y}px)`;
                
                // تخزين الموقع الجديد
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },
            end(event) {
                event.target.classList.remove('dragging');
            }
        }
    });
}

/**
 * تهيئة تغيير الحجم
 * @param {HTMLElement} dashboard - عنصر لوحة الإحصائيات
 */
function initResizing(dashboard) {
    // التحقق من وجود مكتبة interact.js
    if (typeof interact === 'undefined') {
        // تم تحميل المكتبة بالفعل في وظيفة initDragAndDrop
        return;
    }
    
    // تهيئة تغيير الحجم للبطاقات
    interact('.draggable').resizable({
        edges: { left: false, right: true, bottom: true, top: false },
        restrictEdges: {
            outer: dashboard,
            endOnly: true
        },
        restrictSize: {
            min: { width: 200, height: 100 }
        },
        inertia: true,
        listeners: {
            start(event) {
                event.target.classList.add('resizing');
            },
            move(event) {
                const target = event.target;
                
                // الحصول على الموقع الحالي
                let x = (parseFloat(target.getAttribute('data-x')) || 0);
                let y = (parseFloat(target.getAttribute('data-y')) || 0);
                
                // تحديث أبعاد العنصر
                target.style.width = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';
                
                // تحديث موقع العنصر
                x += event.deltaRect.left;
                y += event.deltaRect.top;
                
                target.style.transform = `translate(${x}px, ${y}px)`;
                
                // تخزين الموقع الجديد
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },
            end(event) {
                event.target.classList.remove('resizing');
                
                // تحديث الرسوم البيانية إذا كانت موجودة
                const canvas = event.target.querySelector('canvas');
                if (canvas && canvas.chart) {
                    canvas.chart.resize();
                }
            }
        }
    });
}

/**
 * حفظ تخصيصات لوحة الإحصائيات
 * @param {HTMLElement} dashboard - عنصر لوحة الإحصائيات
 */
function saveDashboardCustomization(dashboard) {
    // الحصول على جميع البطاقات
    const cards = dashboard.querySelectorAll('.card');
    
    // إنشاء مصفوفة لتخزين معلومات البطاقات
    const cardsData = [];
    
    // جمع معلومات كل بطاقة
    cards.forEach(card => {
        // تجاهل البطاقات المخفية
        if (card.classList.contains('card-hidden')) return;
        
        // الحصول على معرف البطاقة أو إنشاء معرف جديد
        const cardId = card.id || `card-${Date.now()}`;
        card.id = cardId;
        
        // جمع معلومات البطاقة
        const cardData = {
            id: cardId,
            position: {
                x: parseFloat(card.getAttribute('data-x')) || 0,
                y: parseFloat(card.getAttribute('data-y')) || 0
            },
            size: {
                width: card.offsetWidth,
                height: card.offsetHeight
            },
            color: Array.from(card.classList)
                .find(cls => cls.startsWith('card-') && cls !== 'card-hidden')
                ?.replace('card-', '') || 'primary',
            content: card.innerHTML
        };
        
        cardsData.push(cardData);
    });
    
    // حفظ المعلومات في التخزين المحلي
    localStorage.setItem('dashboard-customization', JSON.stringify(cardsData));
    
    console.log('تم حفظ تخصيصات لوحة الإحصائيات بنجاح.');
}

/**
 * استعادة تخصيصات لوحة الإحصائيات
 * @param {HTMLElement} dashboard - عنصر لوحة الإحصائيات
 */
function restoreDashboardCustomization(dashboard) {
    // الحصول على التخصيصات المحفوظة
    const savedCustomization = localStorage.getItem('dashboard-customization');
    if (!savedCustomization) return;
    
    try {
        // تحليل التخصيصات
        const cardsData = JSON.parse(savedCustomization);
        
        // مسح لوحة الإحصائيات الحالية
        dashboard.innerHTML = '';
        
        // استعادة كل بطاقة
        cardsData.forEach(cardData => {
            // إنشاء البطاقة
            const card = document.createElement('div');
            card.className = `card card-${cardData.color}`;
            card.id = cardData.id;
            
            // تعيين الموقع والحجم
            card.style.width = `${cardData.size.width}px`;
            card.style.height = `${cardData.size.height}px`;
            card.style.transform = `translate(${cardData.position.x}px, ${cardData.position.y}px)`;
            card.setAttribute('data-x', cardData.position.x);
            card.setAttribute('data-y', cardData.position.y);
            
            // إضافة المحتوى
            card.innerHTML = cardData.content;
            
            // إضافة البطاقة إلى لوحة الإحصائيات
            dashboard.appendChild(card);
        });
        
        console.log('تم استعادة تخصيصات لوحة الإحصائيات بنجاح.');
    } catch (error) {
        console.error('حدث خطأ أثناء استعادة تخصيصات لوحة الإحصائيات:', error);
    }
}

// إضافة أنماط CSS
function addCustomizationStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
        /* وضع التخصيص */
        .customization-mode {
            background-color: rgba(0, 0, 0, 0.02);
            border: 2px dashed rgba(0, 123, 255, 0.3);
            border-radius: 5px;
            padding: 15px;
            min-height: 300px;
        }
        
        /* البطاقات القابلة للسحب */
        .draggable {
            position: relative;
            z-index: 1;
            margin: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            transition: box-shadow 0.3s ease;
        }
        
        .draggable:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .dragging {
            opacity: 0.8;
            z-index: 100;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }
        
        .resizing {
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }
        
        /* شريط أدوات التخصيص */
        .card-customize-toolbar {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 5px;
            display: flex;
            justify-content: space-between;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 10;
        }
        
        .draggable:hover .card-customize-toolbar {
            opacity: 1;
        }
        
        .card-customize-toolbar .btn {
            padding: 2px 5px;
            font-size: 12px;
            margin: 0 2px;
        }
        
        /* أزرار التخصيص */
        .dashboard-customize-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            padding: 10px;
            background-color: rgba(0, 0, 0, 0.05);
            border-radius: 5px;
        }
        
        /* تأثير الإخفاء */
        .card-hidden {
            opacity: 0;
            transform: scale(0.8);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        /* تأثير التحميل */
        .card-loading {
            position: relative;
            pointer-events: none;
        }
        
        .card-loading::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.7);
            z-index: 5;
        }
        
        .card-loading-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            color: #007bff;
            z-index: 6;
        }
        
        /* ألوان البطاقات */
        .card-primary {
            border-color: #007bff;
        }
        
        .card-success {
            border-color: #28a745;
        }
        
        .card-danger {
            border-color: #dc3545;
        }
        
        .card-warning {
            border-color: #ffc107;
        }
        
        .card-info {
            border-color: #17a2b8;
        }
        
        .card-dark {
            border-color: #343a40;
        }
        
        /* أيقونة الإحصائية */
        .stat-icon {
            opacity: 0.7;
        }
        
        /* حاوية الرسم البياني */
        .chart-container {
            position: relative;
            width: 100%;
        }
    `;
    document.head.appendChild(styles);
}

// إضافة أنماط CSS عند تحميل الصفحة
addCustomizationStyles();
