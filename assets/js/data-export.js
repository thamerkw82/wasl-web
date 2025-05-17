/**
 * نظام تصدير البيانات
 * يوفر وظائف لتصدير البيانات من الجداول والتقارير بصيغ مختلفة (CSV، Excel، PDF)
 * مع دعم تخصيص الإعدادات وحفظ تفضيلات التصدير
 */

document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نظام تصدير البيانات
    initDataExport();
});

/**
 * تهيئة نظام تصدير البيانات
 */
function initDataExport() {
    console.log('تهيئة نظام تصدير البيانات...');
    
    // إضافة أزرار التصدير إلى جميع الجداول والتقارير
    addExportButtonsToTables();
    
    // إضافة أزرار التصدير إلى صفحات التقارير
    addExportButtonsToReports();
    
    // استعادة تفضيلات التصدير المحفوظة
    restoreExportPreferences();
}

/**
 * إضافة أزرار التصدير إلى جميع الجداول
 */
function addExportButtonsToTables() {
    // البحث عن جميع الجداول في الصفحة
    const tables = document.querySelectorAll('table.table, table.data-table, .table-container table');
    
    tables.forEach((table, index) => {
        // إنشاء معرف فريد للجدول إذا لم يكن موجوداً
        if (!table.id) {
            table.id = `table-${index}`;
        }
        
        // البحث عن حاوية الجدول
        let tableContainer = table.closest('.table-container, .card-body, .panel-body');
        if (!tableContainer) {
            // إنشاء حاوية جديدة إذا لم تكن موجودة
            tableContainer = document.createElement('div');
            tableContainer.className = 'table-container';
            table.parentNode.insertBefore(tableContainer, table);
            tableContainer.appendChild(table);
        }
        
        // التحقق من وجود أزرار التصدير
        if (tableContainer.querySelector('.export-buttons')) {
            return;
        }
        
        // إنشاء أزرار التصدير
        const exportButtons = createExportButtons(table.id);
        
        // إضافة أزرار التصدير قبل الجدول
        tableContainer.insertBefore(exportButtons, table);
    });
}

/**
 * إضافة أزرار التصدير إلى صفحات التقارير
 */
function addExportButtonsToReports() {
    // البحث عن حاويات التقارير
    const reportContainers = document.querySelectorAll('.report-container, .statistics-container, .dashboard-stats');
    
    reportContainers.forEach((container, index) => {
        // إنشاء معرف فريد للتقرير إذا لم يكن موجوداً
        if (!container.id) {
            container.id = `report-${index}`;
        }
        
        // التحقق من وجود أزرار التصدير
        if (container.querySelector('.export-buttons')) {
            return;
        }
        
        // البحث عن عنوان التقرير
        const reportHeader = container.querySelector('.card-header, .panel-heading, h2, h3');
        
        // إنشاء أزرار التصدير
        const exportButtons = createExportButtons(container.id, true);
        
        // إضافة أزرار التصدير بعد عنوان التقرير أو في بداية الحاوية
        if (reportHeader) {
            reportHeader.parentNode.insertBefore(exportButtons, reportHeader.nextSibling);
        } else {
            container.insertBefore(exportButtons, container.firstChild);
        }
    });
}

/**
 * إنشاء أزرار التصدير
 * @param {string} targetId - معرف العنصر المستهدف
 * @param {boolean} isReport - ما إذا كان العنصر المستهدف تقريراً
 * @returns {HTMLElement} - عنصر HTML يحتوي على أزرار التصدير
 */
function createExportButtons(targetId, isReport = false) {
    // إنشاء حاوية الأزرار
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'export-buttons';
    
    // إنشاء قائمة منسدلة للتصدير
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown export-dropdown';
    
    // إنشاء زر القائمة المنسدلة
    const dropdownButton = document.createElement('button');
    dropdownButton.className = 'btn btn-sm btn-outline-secondary dropdown-toggle';
    dropdownButton.setAttribute('type', 'button');
    dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
    dropdownButton.setAttribute('aria-expanded', 'false');
    dropdownButton.innerHTML = '<i class="fas fa-download"></i> تصدير';
    
    // إنشاء قائمة الخيارات
    const dropdownMenu = document.createElement('ul');
    dropdownMenu.className = 'dropdown-menu';
    
    // إضافة خيارات التصدير
    const exportFormats = [
        { id: 'csv', label: 'CSV', icon: 'fa-file-csv' },
        { id: 'excel', label: 'Excel', icon: 'fa-file-excel' },
        { id: 'pdf', label: 'PDF', icon: 'fa-file-pdf' }
    ];
    
    exportFormats.forEach(format => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'dropdown-item';
        link.href = '#';
        link.setAttribute('data-export-format', format.id);
        link.setAttribute('data-target-id', targetId);
        link.innerHTML = `<i class="fas ${format.icon}"></i> تصدير بصيغة ${format.label}`;
        
        // إضافة حدث النقر
        link.addEventListener('click', function(event) {
            event.preventDefault();
            exportData(targetId, format.id, isReport);
        });
        
        listItem.appendChild(link);
        dropdownMenu.appendChild(listItem);
    });
    
    // إضافة فاصل
    const separator = document.createElement('li');
    separator.innerHTML = '<hr class="dropdown-divider">';
    dropdownMenu.appendChild(separator);
    
    // إضافة خيار الإعدادات
    const settingsItem = document.createElement('li');
    const settingsLink = document.createElement('a');
    settingsLink.className = 'dropdown-item';
    settingsLink.href = '#';
    settingsLink.innerHTML = '<i class="fas fa-cog"></i> إعدادات التصدير';
    
    // إضافة حدث النقر
    settingsLink.addEventListener('click', function(event) {
        event.preventDefault();
        showExportSettings(targetId, isReport);
    });
    
    settingsItem.appendChild(settingsLink);
    dropdownMenu.appendChild(settingsItem);
    
    // تجميع القائمة المنسدلة
    dropdown.appendChild(dropdownButton);
    dropdown.appendChild(dropdownMenu);
    
    // إضافة القائمة المنسدلة إلى حاوية الأزرار
    buttonsContainer.appendChild(dropdown);
    
    // إضافة أنماط CSS
    addExportStyles();
    
    return buttonsContainer;
}

/**
 * إضافة أنماط CSS لأزرار التصدير
 */
function addExportStyles() {
    // التحقق من وجود الأنماط
    if (document.getElementById('export-styles')) {
        return;
    }
    
    // إنشاء عنصر الأنماط
    const styles = document.createElement('style');
    styles.id = 'export-styles';
    styles.textContent = `
        .export-buttons {
            margin-bottom: 15px;
            text-align: left;
        }
        
        .export-dropdown {
            display: inline-block;
        }
        
        .export-settings-modal {
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
        
        .export-settings-content {
            background-color: white;
            border-radius: 5px;
            width: 500px;
            max-width: 90%;
        }
        
        .export-settings-header {
            padding: 15px;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .export-settings-body {
            padding: 15px;
        }
        
        .export-settings-footer {
            padding: 15px;
            border-top: 1px solid #dee2e6;
            text-align: left;
        }
        
        .close-settings {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }
        
        .export-progress-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1060;
        }
        
        .export-progress-content {
            background-color: white;
            border-radius: 5px;
            width: 400px;
            max-width: 90%;
            padding: 20px;
            text-align: center;
        }
        
        .export-progress-bar {
            margin: 15px 0;
        }
    `;
    
    // إضافة الأنماط إلى الصفحة
    document.head.appendChild(styles);
}

/**
 * تصدير البيانات
 * @param {string} targetId - معرف العنصر المستهدف
 * @param {string} format - صيغة التصدير (csv, excel, pdf)
 * @param {boolean} isReport - ما إذا كان العنصر المستهدف تقريراً
 */
function exportData(targetId, format, isReport = false) {
    console.log(`تصدير البيانات من ${targetId} بصيغة ${format}...`);
    
    // الحصول على العنصر المستهدف
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
        console.error(`لم يتم العثور على العنصر المستهدف: ${targetId}`);
        alert('حدث خطأ أثناء التصدير: لم يتم العثور على العنصر المستهدف.');
        return;
    }
    
    // الحصول على تفضيلات التصدير
    const preferences = getExportPreferences(targetId);
    
    // إظهار نافذة التقدم
    const progressModal = showExportProgress();
    
    // محاكاة عملية التصدير
    setTimeout(() => {
        try {
            // تنفيذ التصدير حسب الصيغة
            switch (format) {
                case 'csv':
                    exportToCSV(targetElement, preferences, isReport);
                    break;
                
                case 'excel':
                    exportToExcel(targetElement, preferences, isReport);
                    break;
                
                case 'pdf':
                    exportToPDF(targetElement, preferences, isReport);
                    break;
                
                default:
                    throw new Error(`صيغة التصدير غير مدعومة: ${format}`);
            }
            
            // إخفاء نافذة التقدم
            hideExportProgress(progressModal);
        } catch (error) {
            console.error('حدث خطأ أثناء التصدير:', error);
            
            // إخفاء نافذة التقدم
            hideExportProgress(progressModal);
            
            // عرض رسالة الخطأ
            alert(`حدث خطأ أثناء التصدير: ${error.message}`);
        }
    }, 1000);
}

/**
 * إظهار نافذة تقدم التصدير
 * @returns {HTMLElement} - عنصر HTML لنافذة التقدم
 */
function showExportProgress() {
    // إنشاء نافذة التقدم
    const progressModal = document.createElement('div');
    progressModal.className = 'export-progress-modal';
    progressModal.innerHTML = `
        <div class="export-progress-content">
            <h5>جاري التصدير...</h5>
            <div class="export-progress-bar">
                <div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
            <p class="export-status">جاري تحضير البيانات...</p>
        </div>
    `;
    
    // إضافة نافذة التقدم إلى الصفحة
    document.body.appendChild(progressModal);
    
    // تحديث شريط التقدم
    const progressBar = progressModal.querySelector('.progress-bar');
    const statusText = progressModal.querySelector('.export-status');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
        
        if (progress === 30) {
            statusText.textContent = 'جاري معالجة البيانات...';
        } else if (progress === 60) {
            statusText.textContent = 'جاري إنشاء الملف...';
        } else if (progress === 90) {
            statusText.textContent = 'جاري تحضير التنزيل...';
        }
        
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 300);
    
    // تخزين الفاصل الزمني في النافذة
    progressModal.interval = interval;
    
    return progressModal;
}

/**
 * إخفاء نافذة تقدم التصدير
 * @param {HTMLElement} progressModal - عنصر HTML لنافذة التقدم
 */
function hideExportProgress(progressModal) {
    // إيقاف الفاصل الزمني
    clearInterval(progressModal.interval);
    
    // إخفاء نافذة التقدم
    document.body.removeChild(progressModal);
}

/**
 * تصدير البيانات بصيغة CSV
 * @param {HTMLElement} targetElement - العنصر المستهدف
 * @param {Object} preferences - تفضيلات التصدير
 * @param {boolean} isReport - ما إذا كان العنصر المستهدف تقريراً
 */
function exportToCSV(targetElement, preferences, isReport) {
    // الحصول على البيانات
    const data = isReport ? extractReportData(targetElement) : extractTableData(targetElement);
    
    // تحويل البيانات إلى صيغة CSV
    let csv = '';
    
    // إضافة العنوان
    if (preferences.includeTitle && data.title) {
        csv += `"${data.title}"\n\n`;
    }
    
    // إضافة رؤوس الأعمدة
    if (preferences.includeHeaders && data.headers) {
        csv += data.headers.map(header => `"${header}"`).join(',') + '\n';
    }
    
    // إضافة الصفوف
    data.rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    // إنشاء Blob
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    
    // تنزيل الملف
    downloadFile(blob, `${data.title || 'export'}.csv`);
}

/**
 * تصدير البيانات بصيغة Excel
 * @param {HTMLElement} targetElement - العنصر المستهدف
 * @param {Object} preferences - تفضيلات التصدير
 * @param {boolean} isReport - ما إذا كان العنصر المستهدف تقريراً
 */
function exportToExcel(targetElement, preferences, isReport) {
    // التحقق من وجود مكتبة SheetJS
    if (typeof XLSX === 'undefined') {
        // تحميل مكتبة SheetJS
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js';
        script.onload = function() {
            // تنفيذ التصدير بعد تحميل المكتبة
            exportToExcelWithSheetJS(targetElement, preferences, isReport);
        };
        document.head.appendChild(script);
    } else {
        // تنفيذ التصدير مباشرة
        exportToExcelWithSheetJS(targetElement, preferences, isReport);
    }
}

/**
 * تصدير البيانات بصيغة Excel باستخدام مكتبة SheetJS
 * @param {HTMLElement} targetElement - العنصر المستهدف
 * @param {Object} preferences - تفضيلات التصدير
 * @param {boolean} isReport - ما إذا كان العنصر المستهدف تقريراً
 */
function exportToExcelWithSheetJS(targetElement, preferences, isReport) {
    // الحصول على البيانات
    const data = isReport ? extractReportData(targetElement) : extractTableData(targetElement);
    
    // إنشاء مصفوفة البيانات
    const excelData = [];
    
    // إضافة العنوان
    if (preferences.includeTitle && data.title) {
        excelData.push([data.title]);
        excelData.push([]);  // صف فارغ
    }
    
    // إضافة رؤوس الأعمدة
    if (preferences.includeHeaders && data.headers) {
        excelData.push(data.headers);
    }
    
    // إضافة الصفوف
    data.rows.forEach(row => {
        excelData.push(row);
    });
    
    // إنشاء ورقة عمل
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    
    // إنشاء مصنف
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // تصدير المصنف
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // إنشاء Blob
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // تنزيل الملف
    downloadFile(blob, `${data.title || 'export'}.xlsx`);
}

/**
 * تصدير البيانات بصيغة PDF
 * @param {HTMLElement} targetElement - العنصر المستهدف
 * @param {Object} preferences - تفضيلات التصدير
 * @param {boolean} isReport - ما إذا كان العنصر المستهدف تقريراً
 */
function exportToPDF(targetElement, preferences, isReport) {
    // التحقق من وجود مكتبة jsPDF
    if (typeof jspdf === 'undefined') {
        // تحميل مكتبة jsPDF
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = function() {
            // تحميل مكتبة jsPDF-AutoTable
            const autoTableScript = document.createElement('script');
            autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js';
            autoTableScript.onload = function() {
                // تنفيذ التصدير بعد تحميل المكتبات
                exportToPDFWithJSPDF(targetElement, preferences, isReport);
            };
            document.head.appendChild(autoTableScript);
        };
        document.head.appendChild(script);
    } else {
        // تنفيذ التصدير مباشرة
        exportToPDFWithJSPDF(targetElement, preferences, isReport);
    }
}

/**
 * تصدير البيانات بصيغة PDF باستخدام مكتبة jsPDF
 * @param {HTMLElement} targetElement - العنصر المستهدف
 * @param {Object} preferences - تفضيلات التصدير
 * @param {boolean} isReport - ما إذا كان العنصر المستهدف تقريراً
 */
function exportToPDFWithJSPDF(targetElement, preferences, isReport) {
    // الحصول على البيانات
    const data = isReport ? extractReportData(targetElement) : extractTableData(targetElement);
    
    // إنشاء مستند PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: preferences.orientation || 'portrait',
        unit: 'mm',
        format: preferences.pageSize || 'a4'
    });
    
    // إضافة دعم للغة العربية
    doc.setFont('Helvetica');
    doc.setR2L(true);
    
    // إضافة العنوان
    if (preferences.includeTitle && data.title) {
        doc.setFontSize(16);
        doc.text(data.title, doc.internal.pageSize.width / 2, 20, { align: 'center' });
        doc.setFontSize(12);
    }
    
    // إعداد بيانات الجدول
    const tableData = [];
    
    // إضافة رؤوس الأعمدة
    if (preferences.includeHeaders && data.headers) {
        tableData.push(data.headers);
    }
    
    // إضافة الصفوف
    data.rows.forEach(row => {
        tableData.push(row);
    });
    
    // إنشاء الجدول
    doc.autoTable({
        head: preferences.includeHeaders && data.headers ? [data.headers] : undefined,
        body: data.rows,
        startY: preferences.includeTitle && data.title ? 30 : 20,
        theme: 'grid',
        styles: {
            font: 'Helvetica',
            fontSize: 10,
            textColor: [0, 0, 0],
            cellPadding: 3
        },
        headStyles: {
            fillColor: [66, 139, 202],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240]
        }
    });
    
    // إضافة رقم الصفحة
    if (preferences.includePageNumbers) {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.text(`الصفحة ${i} من ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
        }
    }
    
    // إضافة التاريخ
    if (preferences.includeDate) {
        const today = new Date().toLocaleDateString('ar-SA');
        doc.setFontSize(10);
        doc.text(`تاريخ التصدير: ${today}`, 20, doc.internal.pageSize.height - 10);
    }
    
    // تنزيل الملف
    doc.save(`${data.title || 'export'}.pdf`);
}

/**
 * استخراج بيانات الجدول
 * @param {HTMLElement} table - عنصر الجدول
 * @returns {Object} - بيانات الجدول
 */
function extractTableData(table) {
    // التحقق من أن العنصر هو جدول
    if (table.tagName !== 'TABLE') {
        table = table.querySelector('table');
        if (!table) {
            throw new Error('لم يتم العثور على جدول في العنصر المستهدف.');
        }
    }
    
    // الحصول على عنوان الجدول
    let title = '';
    const tableCaption = table.querySelector('caption');
    if (tableCaption) {
        title = tableCaption.textContent.trim();
    } else {
        // البحث عن عنوان قريب
        const nearestHeading = table.closest('.card, .panel')?.querySelector('.card-header, .panel-heading, h2, h3, h4');
        if (nearestHeading) {
            title = nearestHeading.textContent.trim();
        }
    }
    
    // الحصول على رؤوس الأعمدة
    const headers = [];
    const headerRow = table.querySelector('thead tr');
    if (headerRow) {
        headerRow.querySelectorAll('th, td').forEach(cell => {
            headers.push(cell.textContent.trim());
        });
    }
    
    // الحصول على صفوف البيانات
    const rows = [];
    table.querySelectorAll('tbody tr').forEach(row => {
        const rowData = [];
        row.querySelectorAll('td').forEach(cell => {
            rowData.push(cell.textContent.trim());
        });
        rows.push(rowData);
    });
    
    return {
        title,
        headers,
        rows
    };
}

/**
 * استخراج بيانات التقرير
 * @param {HTMLElement} reportContainer - حاوية التقرير
 * @returns {Object} - بيانات التقرير
 */
function extractReportData(reportContainer) {
    // الحصول على عنوان التقرير
    let title = '';
    const reportHeader = reportContainer.querySelector('.card-header, .panel-heading, h2, h3');
    if (reportHeader) {
        title = reportHeader.textContent.trim();
    }
    
    // البحث عن جداول في التقرير
    const tables = reportContainer.querySelectorAll('table');
    if (tables.length > 0) {
        // استخدام الجدول الأول
        return extractTableData(tables[0]);
    }
    
    // البحث عن بطاقات الإحصائيات
    const statCards = reportContainer.querySelectorAll('.stat-card, .card');
    if (statCards.length > 0) {
        // إنشاء جدول من بطاقات الإحصائيات
        const headers = ['العنوان', 'القيمة'];
        const rows = [];
        
        statCards.forEach(card => {
            const cardTitle = card.querySelector('.card-title, .stat-title, h4, h5')?.textContent.trim() || '';
            const cardValue = card.querySelector('.card-value, .stat-value, h3, .display-4')?.textContent.trim() || '';
            rows.push([cardTitle, cardValue]);
        });
        
        return {
            title,
            headers,
            rows
        };
    }
    
    // البحث عن عناصر القائمة
    const listItems = reportContainer.querySelectorAll('ul li, ol li');
    if (listItems.length > 0) {
        // إنشاء جدول من عناصر القائمة
        const headers = ['العنصر'];
        const rows = [];
        
        listItems.forEach(item => {
            rows.push([item.textContent.trim()]);
        });
        
        return {
            title,
            headers,
            rows
        };
    }
    
    // استخراج النص
    const text = reportContainer.textContent.trim();
    
    // إذا لم يتم العثور على بيانات منظمة، إرجاع نص التقرير
    return {
        title,
        headers: ['المحتوى'],
        rows: [[text]]
    };
}

/**
 * تنزيل ملف
 * @param {Blob} blob - كائن Blob
 * @param {string} filename - اسم الملف
 */
function downloadFile(blob, filename) {
    // إنشاء رابط التنزيل
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    
    // إضافة الرابط إلى الصفحة
    document.body.appendChild(link);
    
    // النقر على الرابط
    link.click();
    
    // إزالة الرابط
    document.body.removeChild(link);
}

/**
 * إظهار إعدادات التصدير
 * @param {string} targetId - معرف العنصر المستهدف
 * @param {boolean} isReport - ما إذا كان العنصر المستهدف تقريراً
 */
function showExportSettings(targetId, isReport) {
    // الحصول على تفضيلات التصدير الحالية
    const preferences = getExportPreferences(targetId);
    
    // إنشاء نافذة الإعدادات
    const settingsModal = document.createElement('div');
    settingsModal.className = 'export-settings-modal';
    settingsModal.innerHTML = `
        <div class="export-settings-content">
            <div class="export-settings-header">
                <h5>إعدادات التصدير</h5>
                <button type="button" class="close-settings">&times;</button>
            </div>
            <div class="export-settings-body">
                <form id="export-settings-form">
                    <div class="form-group mb-3">
                        <label class="form-label">خيارات عامة</label>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="include-title" ${preferences.includeTitle ? 'checked' : ''}>
                            <label class="form-check-label" for="include-title">تضمين العنوان</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="include-headers" ${preferences.includeHeaders ? 'checked' : ''}>
                            <label class="form-check-label" for="include-headers">تضمين رؤوس الأعمدة</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="include-date" ${preferences.includeDate ? 'checked' : ''}>
                            <label class="form-check-label" for="include-date">تضمين تاريخ التصدير</label>
                        </div>
                    </div>
                    
                    <div class="form-group mb-3">
                        <label class="form-label">خيارات PDF</label>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="include-page-numbers" ${preferences.includePageNumbers ? 'checked' : ''}>
                            <label class="form-check-label" for="include-page-numbers">تضمين أرقام الصفحات</label>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">اتجاه الصفحة</label>
                            <select class="form-select" id="orientation">
                                <option value="portrait" ${preferences.orientation === 'portrait' ? 'selected' : ''}>عمودي</option>
                                <option value="landscape" ${preferences.orientation === 'landscape' ? 'selected' : ''}>أفقي</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">حجم الصفحة</label>
                            <select class="form-select" id="page-size">
                                <option value="a4" ${preferences.pageSize === 'a4' ? 'selected' : ''}>A4</option>
                                <option value="a3" ${preferences.pageSize === 'a3' ? 'selected' : ''}>A3</option>
                                <option value="letter" ${preferences.pageSize === 'letter' ? 'selected' : ''}>Letter</option>
                                <option value="legal" ${preferences.pageSize === 'legal' ? 'selected' : ''}>Legal</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group mb-3">
                        <label class="form-label">خيارات Excel</label>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="auto-filter" ${preferences.autoFilter ? 'checked' : ''}>
                            <label class="form-check-label" for="auto-filter">تمكين التصفية التلقائية</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="freeze-header" ${preferences.freezeHeader ? 'checked' : ''}>
                            <label class="form-check-label" for="freeze-header">تجميد الصف الأول</label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="export-settings-footer">
                <button type="button" class="btn btn-secondary" id="reset-settings">إعادة تعيين</button>
                <button type="button" class="btn btn-primary" id="save-settings">حفظ الإعدادات</button>
            </div>
        </div>
    `;
    
    // إضافة نافذة الإعدادات إلى الصفحة
    document.body.appendChild(settingsModal);
    
    // إضافة أحداث الأزرار
    settingsModal.querySelector('.close-settings').addEventListener('click', function() {
        document.body.removeChild(settingsModal);
    });
    
    settingsModal.querySelector('#reset-settings').addEventListener('click', function() {
        resetExportPreferences(targetId);
        document.body.removeChild(settingsModal);
        showExportSettings(targetId, isReport);
    });
    
    settingsModal.querySelector('#save-settings').addEventListener('click', function() {
        // جمع الإعدادات من النموذج
        const newPreferences = {
            includeTitle: document.getElementById('include-title').checked,
            includeHeaders: document.getElementById('include-headers').checked,
            includeDate: document.getElementById('include-date').checked,
            includePageNumbers: document.getElementById('include-page-numbers').checked,
            orientation: document.getElementById('orientation').value,
            pageSize: document.getElementById('page-size').value,
            autoFilter: document.getElementById('auto-filter').checked,
            freezeHeader: document.getElementById('freeze-header').checked
        };
        
        // حفظ الإعدادات
        saveExportPreferences(targetId, newPreferences);
        
        // إغلاق النافذة
        document.body.removeChild(settingsModal);
    });
}

/**
 * الحصول على تفضيلات التصدير
 * @param {string} targetId - معرف العنصر المستهدف
 * @returns {Object} - تفضيلات التصدير
 */
function getExportPreferences(targetId) {
    // الإعدادات الافتراضية
    const defaultPreferences = {
        includeTitle: true,
        includeHeaders: true,
        includeDate: true,
        includePageNumbers: true,
        orientation: 'portrait',
        pageSize: 'a4',
        autoFilter: true,
        freezeHeader: true
    };
    
    // محاولة استرداد الإعدادات المحفوظة
    try {
        const savedPreferences = JSON.parse(localStorage.getItem('export-preferences') || '{}');
        return { ...defaultPreferences, ...savedPreferences[targetId] };
    } catch (error) {
        console.error('حدث خطأ أثناء استرداد تفضيلات التصدير:', error);
        return defaultPreferences;
    }
}

/**
 * حفظ تفضيلات التصدير
 * @param {string} targetId - معرف العنصر المستهدف
 * @param {Object} preferences - تفضيلات التصدير
 */
function saveExportPreferences(targetId, preferences) {
    try {
        // استرداد جميع التفضيلات المحفوظة
        const allPreferences = JSON.parse(localStorage.getItem('export-preferences') || '{}');
        
        // تحديث تفضيلات العنصر المستهدف
        allPreferences[targetId] = preferences;
        
        // حفظ التفضيلات
        localStorage.setItem('export-preferences', JSON.stringify(allPreferences));
        
        console.log('تم حفظ تفضيلات التصدير بنجاح.');
    } catch (error) {
        console.error('حدث خطأ أثناء حفظ تفضيلات التصدير:', error);
    }
}

/**
 * إعادة تعيين تفضيلات التصدير
 * @param {string} targetId - معرف العنصر المستهدف
 */
function resetExportPreferences(targetId) {
    try {
        // استرداد جميع التفضيلات المحفوظة
        const allPreferences = JSON.parse(localStorage.getItem('export-preferences') || '{}');
        
        // حذف تفضيلات العنصر المستهدف
        delete allPreferences[targetId];
        
        // حفظ التفضيلات
        localStorage.setItem('export-preferences', JSON.stringify(allPreferences));
        
        console.log('تم إعادة تعيين تفضيلات التصدير بنجاح.');
    } catch (error) {
        console.error('حدث خطأ أثناء إعادة تعيين تفضيلات التصدير:', error);
    }
}

/**
 * استعادة تفضيلات التصدير المحفوظة
 */
function restoreExportPreferences() {
    // لا يوجد إجراء محدد هنا، حيث يتم استرداد التفضيلات عند الحاجة
    console.log('تم استعادة تفضيلات التصدير بنجاح.');
}
