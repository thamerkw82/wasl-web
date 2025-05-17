/**
 * نظام تتبع حالة النظام
 * يوفر وظائف لمراقبة وعرض حالة النظام
 */

// كائن لإدارة تتبع حالة النظام
const SystemMonitoring = {
    // إعدادات افتراضية
    settings: {
        // فترة تحديث البيانات (بالمللي ثانية)
        updateInterval: 60000,
        
        // المؤشرات التي يتم مراقبتها
        metrics: [
            { id: 'cpu', name: 'استخدام المعالج', unit: '%', threshold: 80, critical: 90 },
            { id: 'memory', name: 'استخدام الذاكرة', unit: '%', threshold: 80, critical: 90 },
            { id: 'disk', name: 'استخدام القرص', unit: '%', threshold: 80, critical: 90 },
            { id: 'requests', name: 'عدد الطلبات', unit: 'طلب/دقيقة', threshold: 1000, critical: 2000 },
            { id: 'response_time', name: 'وقت الاستجابة', unit: 'مللي ثانية', threshold: 500, critical: 1000 },
            { id: 'errors', name: 'معدل الأخطاء', unit: '%', threshold: 5, critical: 10 },
            { id: 'users', name: 'المستخدمين النشطين', unit: 'مستخدم', threshold: 500, critical: 1000 },
            { id: 'database', name: 'استخدام قاعدة البيانات', unit: '%', threshold: 70, critical: 90 }
        ],
        
        // ما إذا كان يجب عرض تنبيهات للمشاكل المحتملة
        showAlerts: true,
        
        // ما إذا كان يجب تخزين بيانات المراقبة
        storeMonitoringData: true,
        
        // عدد نقاط البيانات التي يتم تخزينها
        dataPointsToStore: 1440, // 24 ساعة بمعدل نقطة كل دقيقة
        
        // ما إذا كان يجب إرسال تنبيهات البريد الإلكتروني
        sendEmailAlerts: false,
        
        // عنوان البريد الإلكتروني لإرسال التنبيهات
        alertEmail: 'admin@example.com'
    },
    
    // حالة النظام
    state: {
        // ما إذا كان نظام تتبع حالة النظام مفعلاً
        enabled: false,
        
        // مؤقت تحديث البيانات
        updateTimer: null,
        
        // بيانات المراقبة
        monitoringData: {},
        
        // المشاكل الحالية
        currentIssues: [],
        
        // العناصر التي تم تحسينها
        enhancedElements: {}
    },
    
    /**
     * تهيئة نظام تتبع حالة النظام
     * @param {Object} options خيارات التهيئة
     */
    init: function(options = {}) {
        // دمج الخيارات مع الإعدادات الافتراضية
        this.settings = { ...this.settings, ...options };
        
        // تهيئة بيانات المراقبة
        this.initMonitoringData();
        
        // تحسين صفحة حالة النظام
        this.enhanceSystemHealthPage();
        
        // بدء تحديث البيانات
        this.startUpdating();
        
        // تفعيل نظام تتبع حالة النظام
        this.state.enabled = true;
        
        console.log('تم تهيئة نظام تتبع حالة النظام');
    },
    
    /**
     * تهيئة بيانات المراقبة
     */
    initMonitoringData: function() {
        // تهيئة بيانات المراقبة لكل مؤشر
        this.settings.metrics.forEach(metric => {
            this.state.monitoringData[metric.id] = {
                current: 0,
                history: [],
                status: 'normal', // normal, warning, critical
                lastUpdated: null
            };
        });
    },
    
    /**
     * تحسين صفحة حالة النظام
     */
    enhanceSystemHealthPage: function() {
        // التحقق من وجود صفحة حالة النظام
        const systemHealthPage = document.getElementById('system-health-page');
        
        if (systemHealthPage) {
            // إنشاء لوحة المعلومات
            this.createDashboard(systemHealthPage);
            
            // تخزين الصفحة في حالة النظام
            this.state.enhancedElements.systemHealthPage = systemHealthPage;
        }
    },
    
    /**
     * إنشاء لوحة المعلومات
     * @param {HTMLElement} container حاوية لوحة المعلومات
     */
    createDashboard: function(container) {
        // إنشاء عنوان لوحة المعلومات
        const dashboardTitle = document.createElement('h2');
        dashboardTitle.textContent = 'لوحة معلومات حالة النظام';
        dashboardTitle.className = 'dashboard-title';
        
        // إنشاء وصف لوحة المعلومات
        const dashboardDescription = document.createElement('p');
        dashboardDescription.textContent = 'مراقبة حالة النظام في الوقت الفعلي';
        dashboardDescription.className = 'dashboard-description';
        
        // إنشاء حاوية المؤشرات
        const metricsContainer = document.createElement('div');
        metricsContainer.className = 'metrics-container';
        metricsContainer.style.display = 'grid';
        metricsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        metricsContainer.style.gap = '20px';
        metricsContainer.style.marginTop = '20px';
        
        // إنشاء بطاقات المؤشرات
        this.settings.metrics.forEach(metric => {
            // إنشاء بطاقة المؤشر
            const metricCard = document.createElement('div');
            metricCard.className = `metric-card metric-${metric.id}`;
            metricCard.style.backgroundColor = '#fff';
            metricCard.style.borderRadius = '5px';
            metricCard.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
            metricCard.style.padding = '20px';
            
            // إنشاء عنوان المؤشر
            const metricTitle = document.createElement('h3');
            metricTitle.textContent = metric.name;
            metricTitle.className = 'metric-title';
            metricTitle.style.margin = '0 0 10px 0';
            
            // إنشاء قيمة المؤشر
            const metricValue = document.createElement('div');
            metricValue.className = `metric-value metric-value-${metric.id}`;
            metricValue.style.fontSize = '24px';
            metricValue.style.fontWeight = 'bold';
            metricValue.style.marginBottom = '10px';
            metricValue.textContent = '0 ' + metric.unit;
            
            // إنشاء حالة المؤشر
            const metricStatus = document.createElement('div');
            metricStatus.className = `metric-status metric-status-${metric.id}`;
            metricStatus.style.padding = '5px 10px';
            metricStatus.style.borderRadius = '3px';
            metricStatus.style.display = 'inline-block';
            metricStatus.style.fontSize = '12px';
            metricStatus.style.fontWeight = 'bold';
            metricStatus.style.backgroundColor = '#4CAF50';
            metricStatus.style.color = '#fff';
            metricStatus.textContent = 'طبيعي';
            
            // إنشاء رسم بياني للمؤشر
            const metricChart = document.createElement('canvas');
            metricChart.className = `metric-chart metric-chart-${metric.id}`;
            metricChart.style.marginTop = '10px';
            metricChart.style.width = '100%';
            metricChart.style.height = '100px';
            
            // إضافة العناصر إلى بطاقة المؤشر
            metricCard.appendChild(metricTitle);
            metricCard.appendChild(metricValue);
            metricCard.appendChild(metricStatus);
            metricCard.appendChild(metricChart);
            
            // إضافة بطاقة المؤشر إلى حاوية المؤشرات
            metricsContainer.appendChild(metricCard);
            
            // تخزين عناصر المؤشر في حالة النظام
            if (!this.state.enhancedElements.metricElements) {
                this.state.enhancedElements.metricElements = {};
            }
            
            this.state.enhancedElements.metricElements[metric.id] = {
                card: metricCard,
                value: metricValue,
                status: metricStatus,
                chart: metricChart
            };
        });
        
        // إنشاء حاوية المشاكل
        const issuesContainer = document.createElement('div');
        issuesContainer.className = 'issues-container';
        issuesContainer.style.marginTop = '30px';
        
        // إنشاء عنوان المشاكل
        const issuesTitle = document.createElement('h3');
        issuesTitle.textContent = 'المشاكل الحالية';
        issuesTitle.className = 'issues-title';
        
        // إنشاء قائمة المشاكل
        const issuesList = document.createElement('ul');
        issuesList.className = 'issues-list';
        issuesList.style.padding = '0';
        issuesList.style.listStyle = 'none';
        
        // إضافة عنصر لا توجد مشاكل
        const noIssuesItem = document.createElement('li');
        noIssuesItem.className = 'no-issues-item';
        noIssuesItem.style.padding = '10px';
        noIssuesItem.style.backgroundColor = '#f8f8f8';
        noIssuesItem.style.borderRadius = '3px';
        noIssuesItem.style.marginBottom = '5px';
        noIssuesItem.textContent = 'لا توجد مشاكل حالية';
        
        // إضافة عنصر لا توجد مشاكل إلى قائمة المشاكل
        issuesList.appendChild(noIssuesItem);
        
        // إضافة العناصر إلى حاوية المشاكل
        issuesContainer.appendChild(issuesTitle);
        issuesContainer.appendChild(issuesList);
        
        // إنشاء حاوية الإجراءات
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'actions-container';
        actionsContainer.style.marginTop = '30px';
        actionsContainer.style.display = 'flex';
        actionsContainer.style.gap = '10px';
        
        // إنشاء زر تحديث البيانات
        const refreshButton = document.createElement('button');
        refreshButton.className = 'refresh-button';
        refreshButton.textContent = 'تحديث البيانات';
        refreshButton.style.padding = '10px 15px';
        refreshButton.style.backgroundColor = '#2196F3';
        refreshButton.style.color = '#fff';
        refreshButton.style.border = 'none';
        refreshButton.style.borderRadius = '3px';
        refreshButton.style.cursor = 'pointer';
        
        // إضافة مستمع حدث النقر على زر التحديث
        refreshButton.addEventListener('click', () => {
            this.updateMetrics();
        });
        
        // إنشاء زر تصدير البيانات
        const exportButton = document.createElement('button');
        exportButton.className = 'export-button';
        exportButton.textContent = 'تصدير البيانات';
        exportButton.style.padding = '10px 15px';
        exportButton.style.backgroundColor = '#4CAF50';
        exportButton.style.color = '#fff';
        exportButton.style.border = 'none';
        exportButton.style.borderRadius = '3px';
        exportButton.style.cursor = 'pointer';
        
        // إضافة مستمع حدث النقر على زر التصدير
        exportButton.addEventListener('click', () => {
            this.exportMonitoringData();
        });
        
        // إضافة الأزرار إلى حاوية الإجراءات
        actionsContainer.appendChild(refreshButton);
        actionsContainer.appendChild(exportButton);
        
        // إضافة العناصر إلى الحاوية
        container.appendChild(dashboardTitle);
        container.appendChild(dashboardDescription);
        container.appendChild(metricsContainer);
        container.appendChild(issuesContainer);
        container.appendChild(actionsContainer);
        
        // تخزين العناصر في حالة النظام
        this.state.enhancedElements.issuesList = issuesList;
        this.state.enhancedElements.noIssuesItem = noIssuesItem;
        this.state.enhancedElements.refreshButton = refreshButton;
        this.state.enhancedElements.exportButton = exportButton;
        
        // تحديث المؤشرات
        this.updateMetrics();
    },
    
    /**
     * بدء تحديث البيانات
     */
    startUpdating: function() {
        // إيقاف المؤقت الحالي
        this.stopUpdating();
        
        // بدء مؤقت جديد
        this.state.updateTimer = setInterval(() => {
            this.updateMetrics();
        }, this.settings.updateInterval);
        
        console.log('تم بدء تحديث بيانات المراقبة');
    },
    
    /**
     * إيقاف تحديث البيانات
     */
    stopUpdating: function() {
        // إيقاف المؤقت الحالي
        if (this.state.updateTimer) {
            clearInterval(this.state.updateTimer);
            this.state.updateTimer = null;
            
            console.log('تم إيقاف تحديث بيانات المراقبة');
        }
    },
    
    /**
     * تحديث المؤشرات
     */
    updateMetrics: function() {
        // التحقق من أن نظام تتبع حالة النظام مفعل
        if (!this.state.enabled) {
            return;
        }
        
        // الحصول على بيانات المؤشرات
        this.fetchMetricsData()
            .then(data => {
                // تحديث بيانات المراقبة
                this.updateMonitoringData(data);
                
                // تحديث واجهة المستخدم
                this.updateUI();
                
                // التحقق من المشاكل
                this.checkForIssues();
                
                console.log('تم تحديث بيانات المراقبة');
            })
            .catch(error => {
                console.error('فشل تحديث بيانات المراقبة:', error);
            });
    },
    
    /**
     * الحصول على بيانات المؤشرات
     * @returns {Promise} وعد بالبيانات
     */
    fetchMetricsData: function() {
        // في بيئة حقيقية، هذه الدالة ستقوم بجلب البيانات من الخادم
        // لأغراض العرض، سنقوم بإنشاء بيانات عشوائية
        
        return new Promise(resolve => {
            // بيانات المؤشرات
            const data = {};
            
            // إنشاء بيانات عشوائية لكل مؤشر
            this.settings.metrics.forEach(metric => {
                // الحصول على القيمة الحالية
                const currentValue = this.state.monitoringData[metric.id].current;
                
                // إنشاء قيمة عشوائية جديدة
                let newValue;
                
                switch (metric.id) {
                    case 'cpu':
                        // استخدام المعالج: 10-90%
                        newValue = Math.floor(Math.random() * 80) + 10;
                        break;
                    
                    case 'memory':
                        // استخدام الذاكرة: 20-95%
                        newValue = Math.floor(Math.random() * 75) + 20;
                        break;
                    
                    case 'disk':
                        // استخدام القرص: 30-95%
                        newValue = Math.floor(Math.random() * 65) + 30;
                        break;
                    
                    case 'requests':
                        // عدد الطلبات: 100-2000 طلب/دقيقة
                        newValue = Math.floor(Math.random() * 1900) + 100;
                        break;
                    
                    case 'response_time':
                        // وقت الاستجابة: 50-1500 مللي ثانية
                        newValue = Math.floor(Math.random() * 1450) + 50;
                        break;
                    
                    case 'errors':
                        // معدل الأخطاء: 0-15%
                        newValue = Math.floor(Math.random() * 15);
                        break;
                    
                    case 'users':
                        // المستخدمين النشطين: 50-1500 مستخدم
                        newValue = Math.floor(Math.random() * 1450) + 50;
                        break;
                    
                    case 'database':
                        // استخدام قاعدة البيانات: 20-95%
                        newValue = Math.floor(Math.random() * 75) + 20;
                        break;
                    
                    default:
                        // قيمة عشوائية: 0-100
                        newValue = Math.floor(Math.random() * 100);
                        break;
                }
                
                // تعيين القيمة الجديدة
                data[metric.id] = newValue;
            });
            
            // حل الوعد بالبيانات
            setTimeout(() => {
                resolve(data);
            }, 500);
        });
    },
    
    /**
     * تحديث بيانات المراقبة
     * @param {Object} data بيانات المؤشرات
     */
    updateMonitoringData: function(data) {
        // تحديث بيانات المراقبة لكل مؤشر
        Object.keys(data).forEach(metricId => {
            // الحصول على المؤشر
            const metric = this.settings.metrics.find(m => m.id === metricId);
            
            // التحقق من وجود المؤشر
            if (!metric) {
                return;
            }
            
            // الحصول على القيمة الجديدة
            const newValue = data[metricId];
            
            // تحديث القيمة الحالية
            this.state.monitoringData[metricId].current = newValue;
            
            // تحديث تاريخ التحديث
            this.state.monitoringData[metricId].lastUpdated = new Date();
            
            // تحديث حالة المؤشر
            if (newValue >= metric.critical) {
                this.state.monitoringData[metricId].status = 'critical';
            } else if (newValue >= metric.threshold) {
                this.state.monitoringData[metricId].status = 'warning';
            } else {
                this.state.monitoringData[metricId].status = 'normal';
            }
            
            // إضافة القيمة الجديدة إلى السجل
            this.state.monitoringData[metricId].history.push({
                value: newValue,
                timestamp: new Date()
            });
            
            // التحقق من عدد نقاط البيانات
            if (this.state.monitoringData[metricId].history.length > this.settings.dataPointsToStore) {
                // إزالة أقدم نقطة بيانات
                this.state.monitoringData[metricId].history.shift();
            }
        });
        
        // تخزين بيانات المراقبة إذا كان مطلوباً
        if (this.settings.storeMonitoringData) {
            this.storeMonitoringData();
        }
    },
    
    /**
     * تحديث واجهة المستخدم
     */
    updateUI: function() {
        // التحقق من وجود عناصر المؤشرات
        if (!this.state.enhancedElements.metricElements) {
            return;
        }
        
        // تحديث واجهة المستخدم لكل مؤشر
        this.settings.metrics.forEach(metric => {
            // الحصول على عناصر المؤشر
            const elements = this.state.enhancedElements.metricElements[metric.id];
            
            // التحقق من وجود العناصر
            if (!elements) {
                return;
            }
            
            // الحصول على بيانات المؤشر
            const metricData = this.state.monitoringData[metric.id];
            
            // تحديث قيمة المؤشر
            elements.value.textContent = `${metricData.current} ${metric.unit}`;
            
            // تحديث حالة المؤشر
            elements.status.textContent = this.getStatusText(metricData.status);
            elements.status.style.backgroundColor = this.getStatusColor(metricData.status);
            
            // تحديث لون بطاقة المؤشر
            elements.card.style.borderLeft = `5px solid ${this.getStatusColor(metricData.status)}`;
            
            // تحديث الرسم البياني
            this.updateChart(metric.id);
        });
    },
    
    /**
     * تحديث الرسم البياني
     * @param {string} metricId معرف المؤشر
     */
    updateChart: function(metricId) {
        // التحقق من وجود عناصر المؤشر
        if (!this.state.enhancedElements.metricElements || !this.state.enhancedElements.metricElements[metricId]) {
            return;
        }
        
        // الحصول على عنصر الرسم البياني
        const chartElement = this.state.enhancedElements.metricElements[metricId].chart;
        
        // التحقق من وجود عنصر الرسم البياني
        if (!chartElement) {
            return;
        }
        
        // الحصول على بيانات المؤشر
        const metricData = this.state.monitoringData[metricId];
        
        // التحقق من وجود بيانات المؤشر
        if (!metricData || !metricData.history || metricData.history.length === 0) {
            return;
        }
        
        // التحقق من وجود مكتبة Chart.js
        if (typeof Chart === 'undefined') {
            // تحميل مكتبة Chart.js
            this.loadScript('https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js', () => {
                // تحديث الرسم البياني بعد تحميل المكتبة
                this.createChart(metricId, chartElement, metricData);
            });
        } else {
            // تحديث الرسم البياني
            this.createChart(metricId, chartElement, metricData);
        }
    },
    
    /**
     * إنشاء الرسم البياني
     * @param {string} metricId معرف المؤشر
     * @param {HTMLCanvasElement} chartElement عنصر الرسم البياني
     * @param {Object} metricData بيانات المؤشر
     */
    createChart: function(metricId, chartElement, metricData) {
        // الحصول على المؤشر
        const metric = this.settings.metrics.find(m => m.id === metricId);
        
        // التحقق من وجود المؤشر
        if (!metric) {
            return;
        }
        
        // الحصول على بيانات الرسم البياني
        const chartData = metricData.history.map(item => item.value);
        const chartLabels = metricData.history.map(item => {
            const date = new Date(item.timestamp);
            return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
        });
        
        // التحقق من وجود رسم بياني سابق
        if (chartElement.chart) {
            // تحديث بيانات الرسم البياني
            chartElement.chart.data.labels = chartLabels;
            chartElement.chart.data.datasets[0].data = chartData;
            chartElement.chart.update();
        } else {
            // إنشاء رسم بياني جديد
            chartElement.chart = new Chart(chartElement, {
                type: 'line',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: metric.name,
                        data: chartData,
                        borderColor: this.getStatusColor(metricData.status),
                        backgroundColor: this.getStatusColor(metricData.status, 0.1),
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            rtl: true,
                            titleAlign: 'right',
                            bodyAlign: 'right'
                        }
                    },
                    scales: {
                        x: {
                            display: true,
                            grid: {
                                display: false
                            },
                            ticks: {
                                display: chartData.length > 10,
                                maxRotation: 0,
                                autoSkip: true,
                                maxTicksLimit: 5
                            }
                        },
                        y: {
                            display: true,
                            grid: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            ticks: {
                                display: true
                            }
                        }
                    }
                }
            });
        }
    },
    
    /**
     * التحقق من المشاكل
     */
    checkForIssues: function() {
        // إعادة تعيين قائمة المشاكل
        this.state.currentIssues = [];
        
        // التحقق من كل مؤشر
        this.settings.metrics.forEach(metric => {
            // الحصول على بيانات المؤشر
            const metricData = this.state.monitoringData[metric.id];
            
            // التحقق من حالة المؤشر
            if (metricData.status === 'warning' || metricData.status === 'critical') {
                // إضافة المشكلة إلى قائمة المشاكل
                this.state.currentIssues.push({
                    metricId: metric.id,
                    metricName: metric.name,
                    value: metricData.current,
                    unit: metric.unit,
                    status: metricData.status,
                    timestamp: metricData.lastUpdated
                });
            }
        });
        
        // تحديث قائمة المشاكل في واجهة المستخدم
        this.updateIssuesList();
        
        // عرض تنبيهات للمشاكل إذا كان مطلوباً
        if (this.settings.showAlerts && this.state.currentIssues.length > 0) {
            this.showIssueAlerts();
        }
        
        // إرسال تنبيهات البريد الإلكتروني إذا كان مطلوباً
        if (this.settings.sendEmailAlerts && this.state.currentIssues.length > 0) {
            this.sendEmailAlerts();
        }
    },
    
    /**
     * تحديث قائمة المشاكل
     */
    updateIssuesList: function() {
        // التحقق من وجود قائمة المشاكل
        if (!this.state.enhancedElements.issuesList) {
            return;
        }
        
        // الحصول على قائمة المشاكل
        const issuesList = this.state.enhancedElements.issuesList;
        
        // الحصول على عنصر لا توجد مشاكل
        const noIssuesItem = this.state.enhancedElements.noIssuesItem;
        
        // إزالة جميع العناصر من قائمة المشاكل
        while (issuesList.firstChild) {
            issuesList.removeChild(issuesList.firstChild);
        }
        
        // التحقق من وجود مشاكل
        if (this.state.currentIssues.length === 0) {
            // إضافة عنصر لا توجد مشاكل
            issuesList.appendChild(noIssuesItem);
        } else {
            // إضافة كل مشكلة إلى قائمة المشاكل
            this.state.currentIssues.forEach(issue => {
                // إنشاء عنصر المشكلة
                const issueItem = document.createElement('li');
                issueItem.className = `issue-item issue-${issue.status}`;
                issueItem.style.padding = '10px';
                issueItem.style.backgroundColor = this.getStatusColor(issue.status, 0.1);
                issueItem.style.borderRight = `5px solid ${this.getStatusColor(issue.status)}`;
                issueItem.style.borderRadius = '3px';
                issueItem.style.marginBottom = '5px';
                
                // إنشاء محتوى المشكلة
                const issueContent = document.createElement('div');
                issueContent.className = 'issue-content';
                issueContent.style.display = 'flex';
                issueContent.style.justifyContent = 'space-between';
                issueContent.style.alignItems = 'center';
                
                // إنشاء معلومات المشكلة
                const issueInfo = document.createElement('div');
                issueInfo.className = 'issue-info';
                
                // إنشاء عنوان المشكلة
                const issueTitle = document.createElement('div');
                issueTitle.className = 'issue-title';
                issueTitle.style.fontWeight = 'bold';
                issueTitle.textContent = issue.metricName;
                
                // إنشاء وصف المشكلة
                const issueDescription = document.createElement('div');
                issueDescription.className = 'issue-description';
                issueDescription.style.fontSize = '12px';
                issueDescription.style.color = '#666';
                issueDescription.textContent = `القيمة الحالية: ${issue.value} ${issue.unit} - الحالة: ${this.getStatusText(issue.status)}`;
                
                // إنشاء وقت المشكلة
                const issueTime = document.createElement('div');
                issueTime.className = 'issue-time';
                issueTime.style.fontSize = '12px';
                issueTime.style.color = '#666';
                issueTime.textContent = new Date(issue.timestamp).toLocaleString('ar-SA');
                
                // إضافة العناصر إلى معلومات المشكلة
                issueInfo.appendChild(issueTitle);
                issueInfo.appendChild(issueDescription);
                issueInfo.appendChild(issueTime);
                
                // إنشاء حالة المشكلة
                const issueStatus = document.createElement('div');
                issueStatus.className = `issue-status issue-status-${issue.status}`;
                issueStatus.style.padding = '5px 10px';
                issueStatus.style.borderRadius = '3px';
                issueStatus.style.fontSize = '12px';
                issueStatus.style.fontWeight = 'bold';
                issueStatus.style.backgroundColor = this.getStatusColor(issue.status);
                issueStatus.style.color = '#fff';
                issueStatus.textContent = this.getStatusText(issue.status);
                
                // إضافة العناصر إلى محتوى المشكلة
                issueContent.appendChild(issueInfo);
                issueContent.appendChild(issueStatus);
                
                // إضافة محتوى المشكلة إلى عنصر المشكلة
                issueItem.appendChild(issueContent);
                
                // إضافة عنصر المشكلة إلى قائمة المشاكل
                issuesList.appendChild(issueItem);
            });
        }
    },
    
    /**
     * عرض تنبيهات للمشاكل
     */
    showIssueAlerts: function() {
        // التحقق من وجود مشاكل
        if (this.state.currentIssues.length === 0) {
            return;
        }
        
        // التحقق من وجود دالة عرض الإشعارات
        if (typeof FeedbackSystem !== 'undefined' && typeof FeedbackSystem.showNotification === 'function') {
            // عرض إشعار لكل مشكلة حرجة
            const criticalIssues = this.state.currentIssues.filter(issue => issue.status === 'critical');
            
            if (criticalIssues.length > 0) {
                // عرض إشعار للمشاكل الحرجة
                FeedbackSystem.showNotification(
                    `يوجد ${criticalIssues.length} مشكلة حرجة في النظام. يرجى التحقق من لوحة معلومات حالة النظام.`,
                    'error'
                );
            }
        } else {
            // عرض تنبيه للمشاكل الحرجة
            const criticalIssues = this.state.currentIssues.filter(issue => issue.status === 'critical');
            
            if (criticalIssues.length > 0) {
                alert(`يوجد ${criticalIssues.length} مشكلة حرجة في النظام. يرجى التحقق من لوحة معلومات حالة النظام.`);
            }
        }
    },
    
    /**
     * إرسال تنبيهات البريد الإلكتروني
     */
    sendEmailAlerts: function() {
        // التحقق من وجود مشاكل
        if (this.state.currentIssues.length === 0) {
            return;
        }
        
        // في بيئة حقيقية، هذه الدالة ستقوم بإرسال تنبيهات البريد الإلكتروني
        // لأغراض العرض، سنقوم بطباعة رسالة في وحدة التحكم
        
        console.log(`تم إرسال تنبيه بالبريد الإلكتروني إلى ${this.settings.alertEmail} بشأن ${this.state.currentIssues.length} مشكلة في النظام.`);
    },
    
    /**
     * تخزين بيانات المراقبة
     */
    storeMonitoringData: function() {
        // في بيئة حقيقية، هذه الدالة ستقوم بتخزين بيانات المراقبة في قاعدة البيانات
        // لأغراض العرض، سنقوم بتخزين البيانات في localStorage
        
        try {
            // تخزين بيانات المراقبة
            localStorage.setItem('monitoringData', JSON.stringify(this.state.monitoringData));
        } catch (error) {
            console.error('فشل تخزين بيانات المراقبة:', error);
        }
    },
    
    /**
     * استرجاع بيانات المراقبة
     */
    retrieveMonitoringData: function() {
        // في بيئة حقيقية، هذه الدالة ستقوم باسترجاع بيانات المراقبة من قاعدة البيانات
        // لأغراض العرض، سنقوم باسترجاع البيانات من localStorage
        
        try {
            // استرجاع بيانات المراقبة
            const data = localStorage.getItem('monitoringData');
            
            // التحقق من وجود البيانات
            if (data) {
                // تحليل البيانات
                const parsedData = JSON.parse(data);
                
                // تعيين بيانات المراقبة
                this.state.monitoringData = parsedData;
                
                console.log('تم استرجاع بيانات المراقبة');
            }
        } catch (error) {
            console.error('فشل استرجاع بيانات المراقبة:', error);
        }
    },
    
    /**
     * تصدير بيانات المراقبة
     */
    exportMonitoringData: function() {
        // التحقق من وجود دالة تصدير البيانات
        if (typeof DataExport !== 'undefined' && typeof DataExport.exportToJSON === 'function') {
            // تصدير بيانات المراقبة
            DataExport.exportToJSON(this.state.monitoringData, 'monitoring-data');
        } else {
            // تصدير بيانات المراقبة
            const json = JSON.stringify(this.state.monitoringData, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'monitoring-data.json';
            link.click();
        }
    },
    
    /**
     * الحصول على نص الحالة
     * @param {string} status الحالة
     * @returns {string} نص الحالة
     */
    getStatusText: function(status) {
        switch (status) {
            case 'normal':
                return 'طبيعي';
            
            case 'warning':
                return 'تحذير';
            
            case 'critical':
                return 'حرج';
            
            default:
                return status;
        }
    },
    
    /**
     * الحصول على لون الحالة
     * @param {string} status الحالة
     * @param {number} alpha شفافية اللون
     * @returns {string} لون الحالة
     */
    getStatusColor: function(status, alpha = 1) {
        switch (status) {
            case 'normal':
                return `rgba(76, 175, 80, ${alpha})`;
            
            case 'warning':
                return `rgba(255, 152, 0, ${alpha})`;
            
            case 'critical':
                return `rgba(244, 67, 54, ${alpha})`;
            
            default:
                return `rgba(33, 150, 243, ${alpha})`;
        }
    },
    
    /**
     * تحميل سكريبت
     * @param {string} url عنوان السكريبت
     * @param {Function} callback دالة الاستدعاء بعد التحميل
     */
    loadScript: function(url, callback) {
        // إنشاء عنصر السكريبت
        const script = document.createElement('script');
        script.src = url;
        
        // إضافة مستمع حدث التحميل
        script.onload = callback;
        
        // إضافة مستمع حدث الخطأ
        script.onerror = () => {
            console.error(`فشل تحميل السكريبت: ${url}`);
        };
        
        // إضافة السكريبت إلى الصفحة
        document.head.appendChild(script);
    }
};

// تهيئة نظام تتبع حالة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من وجود صفحة حالة النظام
    if (document.getElementById('system-health-page')) {
        SystemMonitoring.init();
    }
    
    console.log('تم تهيئة نظام تتبع حالة النظام');
});

// تصدير كائن SystemMonitoring للاستخدام في ملفات أخرى
window.SystemMonitoring = SystemMonitoring;
