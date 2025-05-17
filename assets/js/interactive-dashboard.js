/**
 * وظائف لوحة الإحصائيات التفاعلية
 * يتضمن وظائف تحديث البيانات في الوقت الفعلي والرسوم البيانية التفاعلية
 */

document.addEventListener('DOMContentLoaded', function() {
    // تهيئة لوحة الإحصائيات التفاعلية
    initInteractiveDashboard();
    
    // إضافة زر العودة للأعلى
    addBackToTopButton();
    
    // تحسين تأثيرات التمرير
    enhanceScrollEffects();
});

// تهيئة لوحة الإحصائيات التفاعلية
function initInteractiveDashboard() {
    // التحقق من وجود لوحة الإحصائيات
    const dashboardStats = document.querySelectorAll('.dashboard-stat');
    if (dashboardStats.length > 0) {
        // إضافة تأثيرات التحويم
        dashboardStats.forEach(stat => {
            stat.classList.add('hover-effect');
        });
        
        // إضافة تحديث البيانات في الوقت الفعلي
        setupLiveDataUpdate();
    }
    
    // تهيئة الرسوم البيانية التفاعلية
    initCharts();
    
    // إضافة تأثيرات الانتقال للصفحة
    document.querySelector('main')?.classList.add('page-transition');
}

// إعداد تحديث البيانات في الوقت الفعلي
function setupLiveDataUpdate() {
    // محاكاة تحديث البيانات كل 30 ثانية
    setInterval(() => {
        updateDashboardStats();
    }, 30000);
}

// تحديث إحصائيات لوحة التحكم
function updateDashboardStats() {
    // الحصول على جميع عناصر الإحصائيات
    const statElements = document.querySelectorAll('.stat-number');
    
    statElements.forEach(element => {
        // الحصول على القيمة الحالية
        let currentValue = parseInt(element.textContent.replace(/,/g, ''));
        if (isNaN(currentValue)) return;
        
        // إضافة تغيير عشوائي صغير للمحاكاة
        const change = Math.floor(Math.random() * 10) - 3; // تغيير بين -3 و +6
        const newValue = Math.max(0, currentValue + change);
        
        // تحديث القيمة مع تأثير العد
        animateValue(element, currentValue, newValue, 1000);
    });
}

// تحريك القيمة من قيمة إلى أخرى
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// تهيئة الرسوم البيانية التفاعلية
function initCharts() {
    // التحقق من وجود مكتبة Chart.js
    if (typeof Chart === 'undefined') {
        // تحميل مكتبة Chart.js إذا لم تكن موجودة
        loadChartJS();
        return;
    }
    
    // تهيئة الرسوم البيانية
    initAreaChart();
    initBarChart();
    initPieChart();
    initLineChart();
}

// تحميل مكتبة Chart.js
function loadChartJS() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = function() {
        // تهيئة الرسوم البيانية بعد تحميل المكتبة
        initCharts();
    };
    document.head.appendChild(script);
}

// تهيئة رسم بياني مساحي
function initAreaChart() {
    const areaChartCanvas = document.getElementById('areaChart');
    if (!areaChartCanvas) return;
    
    const ctx = areaChartCanvas.getContext('2d');
    
    // بيانات الرسم البياني
    const data = {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'],
        datasets: [{
            label: 'الدعوات',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(0, 123, 255, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(0, 123, 255, 1)',
            fill: true
        }]
    };
    
    // خيارات الرسم البياني
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'الشهر'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'عدد الدعوات'
                }
            }
        }
    };
    
    // إنشاء الرسم البياني
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

// تهيئة رسم بياني شريطي
function initBarChart() {
    const barChartCanvas = document.getElementById('barChart');
    if (!barChartCanvas) return;
    
    const ctx = barChartCanvas.getContext('2d');
    
    // بيانات الرسم البياني
    const data = {
        labels: ['حفل زفاف', 'حفل تخرج', 'اجتماع', 'ندوة', 'افتتاح', 'أخرى'],
        datasets: [{
            label: 'عدد المناسبات',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    // خيارات الرسم البياني
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };
    
    // إنشاء الرسم البياني
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

// تهيئة رسم بياني دائري
function initPieChart() {
    const pieChartCanvas = document.getElementById('pieChart');
    if (!pieChartCanvas) return;
    
    const ctx = pieChartCanvas.getContext('2d');
    
    // بيانات الرسم البياني
    const data = {
        labels: ['الباقة الأساسية', 'الباقة المتوسطة', 'الباقة المتقدمة', 'الباقة الاحترافية'],
        datasets: [{
            data: [30, 40, 20, 10],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    // خيارات الرسم البياني
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            }
        }
    };
    
    // إنشاء الرسم البياني
    new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
}

// تهيئة رسم بياني خطي
function initLineChart() {
    const lineChartCanvas = document.getElementById('lineChart');
    if (!lineChartCanvas) return;
    
    const ctx = lineChartCanvas.getContext('2d');
    
    // بيانات الرسم البياني
    const data = {
        labels: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        datasets: [{
            label: 'الزيارات',
            data: [2112, 2343, 2545, 3423, 2365, 1985, 987],
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(0, 123, 255, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(0, 123, 255, 1)',
            tension: 0.4
        }]
    };
    
    // خيارات الرسم البياني
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'اليوم'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'عدد الزيارات'
                }
            }
        }
    };
    
    // إنشاء الرسم البياني
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

// إضافة زر العودة للأعلى
function addBackToTopButton() {
    // إنشاء زر العودة للأعلى
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.setAttribute('aria-label', 'العودة للأعلى');
    
    // إضافة الزر إلى الصفحة
    document.body.appendChild(backToTopButton);
    
    // إضافة حدث النقر
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // إظهار/إخفاء الزر عند التمرير
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
}

// تحسين تأثيرات التمرير
function enhanceScrollEffects() {
    // إضافة تأثير للشريط العلوي عند التمرير
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // إضافة تأثيرات ظهور العناصر عند التمرير
    const animatedElements = document.querySelectorAll('.dashboard-stat, .card');
    if (animatedElements.length > 0) {
        // إضافة فئة للعناصر
        animatedElements.forEach(element => {
            element.classList.add('scroll-animation');
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        // دالة للتحقق من ظهور العناصر في نطاق الرؤية
        function checkVisibility() {
            animatedElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                
                if (rect.top <= windowHeight * 0.8) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        }
        
        // التحقق عند تحميل الصفحة وعند التمرير
        window.addEventListener('load', checkVisibility);
        window.addEventListener('scroll', checkVisibility);
    }
}
