/**
 * نظام تحليل توقعات الحضور
 * يوفر خوارزميات تنبؤية لتقدير نسب حضور المدعوين بناءً على البيانات التاريخية
 * مع دعم تحليل العوامل المؤثرة وتقديم توصيات لتحسين نسب الحضور
 */

document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نظام تحليل توقعات الحضور
    initAttendancePrediction();
});

/**
 * تهيئة نظام تحليل توقعات الحضور
 */
function initAttendancePrediction() {
    console.log('تهيئة نظام تحليل توقعات الحضور...');
    
    // التحقق من وجود صفحة تحليل الحضور
    if (document.querySelector('.attendance-prediction-container')) {
        // تحميل البيانات التاريخية
        loadHistoricalData();
        
        // تهيئة نموذج التنبؤ
        initPredictionModel();
        
        // تهيئة واجهة المستخدم
        initPredictionUI();
    }
    
    // إضافة أزرار التنبؤ إلى صفحات الدعوات
    addPredictionButtons();
}

/**
 * تحميل البيانات التاريخية للحضور
 */
function loadHistoricalData() {
    console.log('تحميل البيانات التاريخية للحضور...');
    
    // في بيئة الإنتاج، يتم تحميل البيانات من الخادم
    // هنا نستخدم بيانات تجريبية للتوضيح
    
    window.historicalData = {
        // بيانات المناسبات السابقة
        'events': [
            {
                'id': 'evt001',
                'type': 'wedding',
                'totalInvited': 200,
                'confirmed': 180,
                'attended': 160,
                'attendanceRate': 0.8,
                'confirmationRate': 0.9,
                'attendanceFromConfirmed': 0.89,
                'dayOfWeek': 5, // الجمعة
                'timeOfDay': 'evening',
                'season': 'winter',
                'location': 'indoor',
                'distance': 'local',
                'weatherCondition': 'clear',
                'advanceNotice': 30, // أيام
                'reminderSent': true,
                'hasTransportation': false,
                'isHoliday': false,
                'competingEvents': false
            },
            {
                'id': 'evt002',
                'type': 'conference',
                'totalInvited': 150,
                'confirmed': 120,
                'attended': 95,
                'attendanceRate': 0.63,
                'confirmationRate': 0.8,
                'attendanceFromConfirmed': 0.79,
                'dayOfWeek': 2, // الثلاثاء
                'timeOfDay': 'morning',
                'season': 'summer',
                'location': 'indoor',
                'distance': 'local',
                'weatherCondition': 'hot',
                'advanceNotice': 45,
                'reminderSent': true,
                'hasTransportation': true,
                'isHoliday': false,
                'competingEvents': true
            },
            {
                'id': 'evt003',
                'type': 'birthday',
                'totalInvited': 50,
                'confirmed': 45,
                'attended': 42,
                'attendanceRate': 0.84,
                'confirmationRate': 0.9,
                'attendanceFromConfirmed': 0.93,
                'dayOfWeek': 6, // السبت
                'timeOfDay': 'afternoon',
                'season': 'spring',
                'location': 'outdoor',
                'distance': 'local',
                'weatherCondition': 'clear',
                'advanceNotice': 14,
                'reminderSent': true,
                'hasTransportation': false,
                'isHoliday': false,
                'competingEvents': false
            },
            {
                'id': 'evt004',
                'type': 'corporate',
                'totalInvited': 100,
                'confirmed': 85,
                'attended': 70,
                'attendanceRate': 0.7,
                'confirmationRate': 0.85,
                'attendanceFromConfirmed': 0.82,
                'dayOfWeek': 3, // الأربعاء
                'timeOfDay': 'morning',
                'season': 'fall',
                'location': 'indoor',
                'distance': 'remote',
                'weatherCondition': 'rainy',
                'advanceNotice': 21,
                'reminderSent': true,
                'hasTransportation': true,
                'isHoliday': false,
                'competingEvents': false
            },
            {
                'id': 'evt005',
                'type': 'wedding',
                'totalInvited': 300,
                'confirmed': 250,
                'attended': 220,
                'attendanceRate': 0.73,
                'confirmationRate': 0.83,
                'attendanceFromConfirmed': 0.88,
                'dayOfWeek': 4, // الخميس
                'timeOfDay': 'evening',
                'season': 'summer',
                'location': 'indoor',
                'distance': 'local',
                'weatherCondition': 'clear',
                'advanceNotice': 60,
                'reminderSent': true,
                'hasTransportation': true,
                'isHoliday': false,
                'competingEvents': false
            },
            {
                'id': 'evt006',
                'type': 'graduation',
                'totalInvited': 120,
                'confirmed': 100,
                'attended': 90,
                'attendanceRate': 0.75,
                'confirmationRate': 0.83,
                'attendanceFromConfirmed': 0.9,
                'dayOfWeek': 0, // الأحد
                'timeOfDay': 'morning',
                'season': 'summer',
                'location': 'indoor',
                'distance': 'local',
                'weatherCondition': 'clear',
                'advanceNotice': 30,
                'reminderSent': true,
                'hasTransportation': false,
                'isHoliday': false,
                'competingEvents': false
            },
            {
                'id': 'evt007',
                'type': 'conference',
                'totalInvited': 200,
                'confirmed': 150,
                'attended': 120,
                'attendanceRate': 0.6,
                'confirmationRate': 0.75,
                'attendanceFromConfirmed': 0.8,
                'dayOfWeek': 1, // الاثنين
                'timeOfDay': 'morning',
                'season': 'winter',
                'location': 'indoor',
                'distance': 'remote',
                'weatherCondition': 'snowy',
                'advanceNotice': 45,
                'reminderSent': true,
                'hasTransportation': true,
                'isHoliday': false,
                'competingEvents': true
            },
            {
                'id': 'evt008',
                'type': 'birthday',
                'totalInvited': 30,
                'confirmed': 25,
                'attended': 22,
                'attendanceRate': 0.73,
                'confirmationRate': 0.83,
                'attendanceFromConfirmed': 0.88,
                'dayOfWeek': 5, // الجمعة
                'timeOfDay': 'evening',
                'season': 'fall',
                'location': 'indoor',
                'distance': 'local',
                'weatherCondition': 'clear',
                'advanceNotice': 7,
                'reminderSent': true,
                'hasTransportation': false,
                'isHoliday': false,
                'competingEvents': false
            },
            {
                'id': 'evt009',
                'type': 'corporate',
                'totalInvited': 80,
                'confirmed': 70,
                'attended': 55,
                'attendanceRate': 0.69,
                'confirmationRate': 0.88,
                'attendanceFromConfirmed': 0.79,
                'dayOfWeek': 2, // الثلاثاء
                'timeOfDay': 'afternoon',
                'season': 'spring',
                'location': 'indoor',
                'distance': 'local',
                'weatherCondition': 'clear',
                'advanceNotice': 14,
                'reminderSent': false,
                'hasTransportation': false,
                'isHoliday': false,
                'competingEvents': false
            },
            {
                'id': 'evt010',
                'type': 'wedding',
                'totalInvited': 250,
                'confirmed': 220,
                'attended': 180,
                'attendanceRate': 0.72,
                'confirmationRate': 0.88,
                'attendanceFromConfirmed': 0.82,
                'dayOfWeek': 6, // السبت
                'timeOfDay': 'evening',
                'season': 'summer',
                'location': 'outdoor',
                'distance': 'local',
                'weatherCondition': 'clear',
                'advanceNotice': 45,
                'reminderSent': true,
                'hasTransportation': true,
                'isHoliday': false,
                'competingEvents': false
            }
        ],
        
        // متوسط معدلات الحضور حسب نوع المناسبة
        'averageByType': {
            'wedding': 0.75,
            'conference': 0.62,
            'birthday': 0.79,
            'corporate': 0.7,
            'graduation': 0.75,
            'other': 0.65
        },
        
        // متوسط معدلات الحضور حسب يوم الأسبوع
        'averageByDayOfWeek': {
            0: 0.75, // الأحد
            1: 0.65, // الاثنين
            2: 0.66, // الثلاثاء
            3: 0.7,  // الأربعاء
            4: 0.72, // الخميس
            5: 0.78, // الجمعة
            6: 0.8   // السبت
        },
        
        // متوسط معدلات الحضور حسب وقت اليوم
        'averageByTimeOfDay': {
            'morning': 0.68,
            'afternoon': 0.72,
            'evening': 0.76
        },
        
        // متوسط معدلات الحضور حسب الموسم
        'averageBySeason': {
            'winter': 0.7,
            'spring': 0.75,
            'summer': 0.72,
            'fall': 0.73
        },
        
        // متوسط معدلات الحضور حسب الموقع
        'averageByLocation': {
            'indoor': 0.73,
            'outdoor': 0.75
        },
        
        // متوسط معدلات الحضور حسب المسافة
        'averageByDistance': {
            'local': 0.75,
            'remote': 0.65
        },
        
        // متوسط معدلات الحضور حسب حالة الطقس
        'averageByWeather': {
            'clear': 0.75,
            'rainy': 0.65,
            'snowy': 0.6,
            'hot': 0.68
        },
        
        // متوسط معدلات الحضور حسب مدة الإشعار المسبق
        'averageByAdvanceNotice': {
            'short': 0.7,  // أقل من 14 يوم
            'medium': 0.73, // 14-30 يوم
            'long': 0.75   // أكثر من 30 يوم
        },
        
        // متوسط معدلات الحضور حسب إرسال التذكير
        'averageByReminder': {
            true: 0.75,
            false: 0.65
        },
        
        // متوسط معدلات الحضور حسب توفر المواصلات
        'averageByTransportation': {
            true: 0.75,
            false: 0.7
        },
        
        // متوسط معدلات الحضور حسب العطلات
        'averageByHoliday': {
            true: 0.7,
            false: 0.73
        },
        
        // متوسط معدلات الحضور حسب وجود مناسبات متنافسة
        'averageByCompetingEvents': {
            true: 0.65,
            false: 0.75
        }
    };
    
    // تحليل البيانات التاريخية
    analyzeHistoricalData();
}

/**
 * تحليل البيانات التاريخية
 */
function analyzeHistoricalData() {
    console.log('تحليل البيانات التاريخية...');
    
    // حساب المتوسطات والانحرافات المعيارية
    const data = window.historicalData.events;
    
    // حساب متوسط معدل الحضور الإجمالي
    let totalAttendanceRate = 0;
    data.forEach(event => {
        totalAttendanceRate += event.attendanceRate;
    });
    
    window.historicalData.overallAverage = totalAttendanceRate / data.length;
    
    // حساب الانحراف المعياري لمعدل الحضور
    let sumSquaredDifferences = 0;
    data.forEach(event => {
        const difference = event.attendanceRate - window.historicalData.overallAverage;
        sumSquaredDifferences += difference * difference;
    });
    
    window.historicalData.standardDeviation = Math.sqrt(sumSquaredDifferences / data.length);
    
    console.log('متوسط معدل الحضور الإجمالي:', window.historicalData.overallAverage);
    console.log('الانحراف المعياري لمعدل الحضور:', window.historicalData.standardDeviation);
}

/**
 * تهيئة نموذج التنبؤ
 */
function initPredictionModel() {
    console.log('تهيئة نموذج التنبؤ...');
    
    // في بيئة الإنتاج، يمكن استخدام نماذج تعلم آلي أكثر تعقيداً
    // هنا نستخدم نموذج بسيط قائم على المتوسطات المرجحة
    
    // تعريف أوزان العوامل المؤثرة
    window.predictionModel = {
        weights: {
            'type': 0.25,
            'dayOfWeek': 0.15,
            'timeOfDay': 0.1,
            'season': 0.05,
            'location': 0.05,
            'distance': 0.1,
            'weather': 0.05,
            'advanceNotice': 0.05,
            'reminder': 0.1,
            'transportation': 0.05,
            'holiday': 0.025,
            'competingEvents': 0.075
        },
        
        // دالة التنبؤ
        predict: function(eventData) {
            let weightedSum = 0;
            let totalWeight = 0;
            
            // نوع المناسبة
            if (eventData.type && window.historicalData.averageByType[eventData.type]) {
                weightedSum += window.historicalData.averageByType[eventData.type] * this.weights.type;
                totalWeight += this.weights.type;
            } else {
                weightedSum += window.historicalData.averageByType.other * this.weights.type;
                totalWeight += this.weights.type;
            }
            
            // يوم الأسبوع
            if (eventData.dayOfWeek !== undefined && window.historicalData.averageByDayOfWeek[eventData.dayOfWeek]) {
                weightedSum += window.historicalData.averageByDayOfWeek[eventData.dayOfWeek] * this.weights.dayOfWeek;
                totalWeight += this.weights.dayOfWeek;
            }
            
            // وقت اليوم
            if (eventData.timeOfDay && window.historicalData.averageByTimeOfDay[eventData.timeOfDay]) {
                weightedSum += window.historicalData.averageByTimeOfDay[eventData.timeOfDay] * this.weights.timeOfDay;
                totalWeight += this.weights.timeOfDay;
            }
            
            // الموسم
            if (eventData.season && window.historicalData.averageBySeason[eventData.season]) {
                weightedSum += window.historicalData.averageBySeason[eventData.season] * this.weights.season;
                totalWeight += this.weights.season;
            }
            
            // الموقع
            if (eventData.location && window.historicalData.averageByLocation[eventData.location]) {
                weightedSum += window.historicalData.averageByLocation[eventData.location] * this.weights.location;
                totalWeight += this.weights.location;
            }
            
            // المسافة
            if (eventData.distance && window.historicalData.averageByDistance[eventData.distance]) {
                weightedSum += window.historicalData.averageByDistance[eventData.distance] * this.weights.distance;
                totalWeight += this.weights.distance;
            }
            
            // حالة الطقس
            if (eventData.weatherCondition && window.historicalData.averageByWeather[eventData.weatherCondition]) {
                weightedSum += window.historicalData.averageByWeather[eventData.weatherCondition] * this.weights.weather;
                totalWeight += this.weights.weather;
            }
            
            // مدة الإشعار المسبق
            let advanceNoticeCategory = 'medium';
            if (eventData.advanceNotice < 14) {
                advanceNoticeCategory = 'short';
            } else if (eventData.advanceNotice > 30) {
                advanceNoticeCategory = 'long';
            }
            
            weightedSum += window.historicalData.averageByAdvanceNotice[advanceNoticeCategory] * this.weights.advanceNotice;
            totalWeight += this.weights.advanceNotice;
            
            // إرسال التذكير
            weightedSum += window.historicalData.averageByReminder[eventData.reminderSent] * this.weights.reminder;
            totalWeight += this.weights.reminder;
            
            // توفر المواصلات
            weightedSum += window.historicalData.averageByTransportation[eventData.hasTransportation] * this.weights.transportation;
            totalWeight += this.weights.transportation;
            
            // العطلات
            weightedSum += window.historicalData.averageByHoliday[eventData.isHoliday] * this.weights.holiday;
            totalWeight += this.weights.holiday;
            
            // مناسبات متنافسة
            weightedSum += window.historicalData.averageByCompetingEvents[eventData.competingEvents] * this.weights.competingEvents;
            totalWeight += this.weights.competingEvents;
            
            // حساب المتوسط المرجح
            const predictedRate = weightedSum / totalWeight;
            
            // حساب فترة الثقة (95%)
            const confidenceInterval = 1.96 * window.historicalData.standardDeviation / Math.sqrt(window.historicalData.events.length);
            
            return {
                predictedRate: predictedRate,
                lowerBound: Math.max(0, predictedRate - confidenceInterval),
                upperBound: Math.min(1, predictedRate + confidenceInterval),
                factors: this.getInfluencingFactors(eventData)
            };
        },
        
        // تحديد العوامل المؤثرة
        getInfluencingFactors: function(eventData) {
            const factors = [];
            
            // نوع المناسبة
            if (eventData.type && window.historicalData.averageByType[eventData.type]) {
                const typeAverage = window.historicalData.averageByType[eventData.type];
                const overallAverage = window.historicalData.overallAverage;
                
                if (Math.abs(typeAverage - overallAverage) > 0.05) {
                    factors.push({
                        factor: 'نوع المناسبة',
                        value: eventData.type,
                        impact: typeAverage > overallAverage ? 'positive' : 'negative',
                        difference: Math.abs(typeAverage - overallAverage)
                    });
                }
            }
            
            // يوم الأسبوع
            if (eventData.dayOfWeek !== undefined && window.historicalData.averageByDayOfWeek[eventData.dayOfWeek]) {
                const dayAverage = window.historicalData.averageByDayOfWeek[eventData.dayOfWeek];
                const overallAverage = window.historicalData.overallAverage;
                
                if (Math.abs(dayAverage - overallAverage) > 0.05) {
                    const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
                    factors.push({
                        factor: 'يوم الأسبوع',
                        value: dayNames[eventData.dayOfWeek],
                        impact: dayAverage > overallAverage ? 'positive' : 'negative',
                        difference: Math.abs(dayAverage - overallAverage)
                    });
                }
            }
            
            // وقت اليوم
            if (eventData.timeOfDay && window.historicalData.averageByTimeOfDay[eventData.timeOfDay]) {
                const timeAverage = window.historicalData.averageByTimeOfDay[eventData.timeOfDay];
                const overallAverage = window.historicalData.overallAverage;
                
                if (Math.abs(timeAverage - overallAverage) > 0.05) {
                    const timeNames = {
                        'morning': 'صباحاً',
                        'afternoon': 'ظهراً',
                        'evening': 'مساءً'
                    };
                    
                    factors.push({
                        factor: 'وقت اليوم',
                        value: timeNames[eventData.timeOfDay],
                        impact: timeAverage > overallAverage ? 'positive' : 'negative',
                        difference: Math.abs(timeAverage - overallAverage)
                    });
                }
            }
            
            // المسافة
            if (eventData.distance && window.historicalData.averageByDistance[eventData.distance]) {
                const distanceAverage = window.historicalData.averageByDistance[eventData.distance];
                const overallAverage = window.historicalData.overallAverage;
                
                if (Math.abs(distanceAverage - overallAverage) > 0.05) {
                    const distanceNames = {
                        'local': 'قريب',
                        'remote': 'بعيد'
                    };
                    
                    factors.push({
                        factor: 'المسافة',
                        value: distanceNames[eventData.distance],
                        impact: distanceAverage > overallAverage ? 'positive' : 'negative',
                        difference: Math.abs(distanceAverage - overallAverage)
                    });
                }
            }
            
            // إرسال التذكير
            const reminderAverage = window.historicalData.averageByReminder[eventData.reminderSent];
            const overallAverage = window.historicalData.overallAverage;
            
            if (Math.abs(reminderAverage - overallAverage) > 0.05) {
                factors.push({
                    factor: 'إرسال تذكير',
                    value: eventData.reminderSent ? 'نعم' : 'لا',
                    impact: reminderAverage > overallAverage ? 'positive' : 'negative',
                    difference: Math.abs(reminderAverage - overallAverage)
                });
            }
            
            // مناسبات متنافسة
            const competingAverage = window.historicalData.averageByCompetingEvents[eventData.competingEvents];
            
            if (Math.abs(competingAverage - overallAverage) > 0.05) {
                factors.push({
                    factor: 'مناسبات متنافسة',
                    value: eventData.competingEvents ? 'نعم' : 'لا',
                    impact: competingAverage > overallAverage ? 'positive' : 'negative',
                    difference: Math.abs(competingAverage - overallAverage)
                });
            }
            
            // ترتيب العوامل حسب التأثير
            factors.sort((a, b) => b.difference - a.difference);
            
            return factors;
        }
    };
}

/**
 * تهيئة واجهة المستخدم للتنبؤ
 */
function initPredictionUI() {
    console.log('تهيئة واجهة المستخدم للتنبؤ...');
    
    // التحقق من وجود نموذج التنبؤ
    const predictionForm = document.getElementById('prediction-form');
    if (!predictionForm) {
        return;
    }
    
    // إضافة حدث تقديم النموذج
    predictionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // جمع بيانات المناسبة
        const eventData = {
            type: document.getElementById('event-type').value,
            dayOfWeek: parseInt(document.getElementById('day-of-week').value),
            timeOfDay: document.getElementById('time-of-day').value,
            season: document.getElementById('season').value,
            location: document.getElementById('location').value,
            distance: document.getElementById('distance').value,
            weatherCondition: document.getElementById('weather').value,
            advanceNotice: parseInt(document.getElementById('advance-notice').value),
            reminderSent: document.getElementById('reminder').value === 'true',
            hasTransportation: document.getElementById('transportation').value === 'true',
            isHoliday: document.getElementById('holiday').value === 'true',
            competingEvents: document.getElementById('competing-events').value === 'true',
            totalInvited: parseInt(document.getElementById('total-invited').value)
        };
        
        // التنبؤ بمعدل الحضور
        const prediction = window.predictionModel.predict(eventData);
        
        // عرض نتائج التنبؤ
        displayPredictionResults(prediction, eventData);
    });
    
    // إضافة حدث إعادة تعيين النموذج
    const resetButton = document.getElementById('reset-prediction');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            predictionForm.reset();
            document.getElementById('prediction-results').style.display = 'none';
        });
    }
}

/**
 * عرض نتائج التنبؤ
 * @param {Object} prediction - نتائج التنبؤ
 * @param {Object} eventData - بيانات المناسبة
 */
function displayPredictionResults(prediction, eventData) {
    console.log('عرض نتائج التنبؤ:', prediction);
    
    // الحصول على عنصر نتائج التنبؤ
    const resultsContainer = document.getElementById('prediction-results');
    if (!resultsContainer) {
        return;
    }
    
    // حساب عدد الحضور المتوقع
    const expectedAttendees = Math.round(eventData.totalInvited * prediction.predictedRate);
    const lowerBoundAttendees = Math.round(eventData.totalInvited * prediction.lowerBound);
    const upperBoundAttendees = Math.round(eventData.totalInvited * prediction.upperBound);
    
    // تحديث محتوى نتائج التنبؤ
    resultsContainer.innerHTML = `
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0">نتائج التنبؤ بالحضور</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <div class="prediction-summary">
                            <h6>ملخص التنبؤ:</h6>
                            <div class="prediction-rate">
                                <div class="rate-label">نسبة الحضور المتوقعة:</div>
                                <div class="rate-value">${Math.round(prediction.predictedRate * 100)}%</div>
                            </div>
                            <div class="prediction-range">
                                <div class="range-label">نطاق التنبؤ (فترة ثقة 95%):</div>
                                <div class="range-value">${Math.round(prediction.lowerBound * 100)}% - ${Math.round(prediction.upperBound * 100)}%</div>
                            </div>
                            <div class="attendees-count">
                                <div class="count-label">عدد الحضور المتوقع:</div>
                                <div class="count-value">${expectedAttendees} من أصل ${eventData.totalInvited}</div>
                            </div>
                            <div class="attendees-range">
                                <div class="range-label">نطاق عدد الحضور:</div>
                                <div class="range-value">${lowerBoundAttendees} - ${upperBoundAttendees} شخص</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="factors-container">
                            <h6>العوامل المؤثرة:</h6>
                            <ul class="factors-list">
                                ${prediction.factors.map(factor => `
                                    <li class="factor-item ${factor.impact === 'positive' ? 'positive-factor' : 'negative-factor'}">
                                        <span class="factor-name">${factor.factor}:</span>
                                        <span class="factor-value">${factor.value}</span>
                                        <span class="factor-impact">
                                            <i class="fas fa-${factor.impact === 'positive' ? 'arrow-up' : 'arrow-down'}"></i>
                                            ${Math.round(factor.difference * 100)}%
                                        </span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
                
                <hr>
                
                <div class="recommendations">
                    <h6>توصيات لتحسين نسبة الحضور:</h6>
                    <ul class="recommendations-list">
                        ${generateRecommendations(prediction, eventData).map(recommendation => `
                            <li class="recommendation-item">
                                <i class="fas fa-lightbulb"></i>
                                <span>${recommendation}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="visualization mt-4">
                    <h6>تمثيل بياني للتنبؤ:</h6>
                    <div class="prediction-chart">
                        <div class="chart-bar-container">
                            <div class="chart-bar" style="width: ${Math.round(prediction.predictedRate * 100)}%;">
                                <span class="chart-value">${Math.round(prediction.predictedRate * 100)}%</span>
                            </div>
                        </div>
                        <div class="chart-range">
                            <span class="range-min">${Math.round(prediction.lowerBound * 100)}%</span>
                            <span class="range-max">${Math.round(prediction.upperBound * 100)}%</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-primary" id="save-prediction">
                    <i class="fas fa-save"></i> حفظ التنبؤ
                </button>
                <button type="button" class="btn btn-secondary" id="export-prediction">
                    <i class="fas fa-file-export"></i> تصدير التقرير
                </button>
            </div>
        </div>
    `;
    
    // إضافة أنماط CSS
    addPredictionStyles();
    
    // إظهار نتائج التنبؤ
    resultsContainer.style.display = 'block';
    
    // إضافة أحداث الأزرار
    const saveButton = document.getElementById('save-prediction');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            savePrediction(prediction, eventData);
        });
    }
    
    const exportButton = document.getElementById('export-prediction');
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            exportPredictionReport(prediction, eventData);
        });
    }
    
    // التمرير إلى نتائج التنبؤ
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * إضافة أنماط CSS للتنبؤ
 */
function addPredictionStyles() {
    // التحقق من وجود الأنماط
    if (document.getElementById('prediction-styles')) {
        return;
    }
    
    // إنشاء عنصر الأنماط
    const styles = document.createElement('style');
    styles.id = 'prediction-styles';
    styles.textContent = `
        .prediction-summary {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 15px;
        }
        
        .prediction-rate, .prediction-range, .attendees-count, .attendees-range {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        
        .rate-value, .count-value {
            font-weight: bold;
            font-size: 1.2em;
            color: #007bff;
        }
        
        .factors-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .factor-item {
            padding: 8px 10px;
            margin-bottom: 5px;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .positive-factor {
            background-color: rgba(40, 167, 69, 0.1);
            border-right: 3px solid #28a745;
        }
        
        .negative-factor {
            background-color: rgba(220, 53, 69, 0.1);
            border-right: 3px solid #dc3545;
        }
        
        .factor-name {
            font-weight: bold;
        }
        
        .factor-impact {
            font-weight: bold;
        }
        
        .positive-factor .factor-impact {
            color: #28a745;
        }
        
        .negative-factor .factor-impact {
            color: #dc3545;
        }
        
        .recommendations-list {
            padding-right: 20px;
        }
        
        .recommendation-item {
            margin-bottom: 10px;
        }
        
        .recommendation-item i {
            color: #ffc107;
            margin-left: 5px;
        }
        
        .chart-bar-container {
            height: 30px;
            background-color: #e9ecef;
            border-radius: 15px;
            margin-bottom: 5px;
            overflow: hidden;
        }
        
        .chart-bar {
            height: 100%;
            background-color: #007bff;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-left: 10px;
            padding-right: 10px;
            transition: width 1s ease-in-out;
        }
        
        .chart-value {
            color: white;
            font-weight: bold;
        }
        
        .chart-range {
            display: flex;
            justify-content: space-between;
        }
        
        .range-min, .range-max {
            font-size: 0.8em;
            color: #6c757d;
        }
    `;
    
    // إضافة الأنماط إلى الصفحة
    document.head.appendChild(styles);
}

/**
 * توليد توصيات لتحسين نسبة الحضور
 * @param {Object} prediction - نتائج التنبؤ
 * @param {Object} eventData - بيانات المناسبة
 * @returns {Array} - قائمة التوصيات
 */
function generateRecommendations(prediction, eventData) {
    const recommendations = [];
    
    // التوصية بإرسال تذكير
    if (!eventData.reminderSent) {
        recommendations.push('إرسال تذكير قبل المناسبة بيومين على الأقل يمكن أن يزيد نسبة الحضور بحوالي 10%.');
    }
    
    // التوصية بتوفير مواصلات
    if (!eventData.hasTransportation && eventData.distance === 'remote') {
        recommendations.push('توفير وسائل نقل للمدعوين يمكن أن يزيد نسبة الحضور بحوالي 10% خاصة للمناسبات البعيدة.');
    }
    
    // التوصية بتغيير يوم المناسبة
    if (eventData.dayOfWeek === 1 || eventData.dayOfWeek === 2) { // الاثنين أو الثلاثاء
        recommendations.push('تغيير يوم المناسبة إلى نهاية الأسبوع (الخميس، الجمعة، السبت) يمكن أن يزيد نسبة الحضور بحوالي 15%.');
    }
    
    // التوصية بتغيير وقت المناسبة
    if (eventData.timeOfDay === 'morning' && (eventData.type === 'wedding' || eventData.type === 'social')) {
        recommendations.push('تغيير وقت المناسبة إلى المساء يمكن أن يزيد نسبة الحضور للمناسبات الاجتماعية بحوالي 8%.');
    }
    
    // التوصية بتجنب المناسبات المتنافسة
    if (eventData.competingEvents) {
        recommendations.push('تجنب تنظيم المناسبة في نفس وقت مناسبات أخرى مهمة يمكن أن يزيد نسبة الحضور بحوالي 10%.');
    }
    
    // التوصية بزيادة مدة الإشعار المسبق
    if (eventData.advanceNotice < 14) {
        recommendations.push('زيادة مدة الإشعار المسبق إلى 3-4 أسابيع على الأقل يمكن أن يزيد نسبة الحضور بحوالي 5%.');
    }
    
    // التوصية بإضافة ميزات جذابة
    recommendations.push('إضافة ميزات جذابة للمناسبة مثل الطعام المميز أو الترفيه أو الهدايا يمكن أن يزيد نسبة الحضور بحوالي 7%.');
    
    // التوصية بتسهيل تأكيد الحضور
    recommendations.push('تسهيل عملية تأكيد الحضور من خلال توفير خيارات متعددة (رسائل نصية، بريد إلكتروني، تطبيق) يمكن أن يزيد نسبة الحضور بحوالي 5%.');
    
    // التوصية بإرسال تذكيرات متعددة
    recommendations.push('إرسال تذكيرات متعددة (قبل أسبوع، قبل 3 أيام، قبل يوم) يمكن أن يزيد نسبة الحضور بحوالي 8%.');
    
    // التوصية بإضافة خريطة وتوجيهات
    if (eventData.distance === 'remote') {
        recommendations.push('إضافة خريطة وتوجيهات واضحة للوصول إلى مكان المناسبة يمكن أن يزيد نسبة الحضور بحوالي 6%.');
    }
    
    return recommendations;
}

/**
 * حفظ التنبؤ
 * @param {Object} prediction - نتائج التنبؤ
 * @param {Object} eventData - بيانات المناسبة
 */
function savePrediction(prediction, eventData) {
    console.log('حفظ التنبؤ...');
    
    // في بيئة الإنتاج، يتم حفظ التنبؤ في قاعدة البيانات
    // هنا نحفظ التنبؤ في التخزين المحلي
    
    // الحصول على التنبؤات المحفوظة
    let savedPredictions = JSON.parse(localStorage.getItem('attendance-predictions') || '[]');
    
    // إضافة التنبؤ الجديد
    savedPredictions.push({
        id: 'pred_' + Date.now(),
        timestamp: new Date().toISOString(),
        eventData: eventData,
        prediction: prediction
    });
    
    // حفظ التنبؤات
    localStorage.setItem('attendance-predictions', JSON.stringify(savedPredictions));
    
    // عرض رسالة نجاح
    alert('تم حفظ التنبؤ بنجاح!');
}

/**
 * تصدير تقرير التنبؤ
 * @param {Object} prediction - نتائج التنبؤ
 * @param {Object} eventData - بيانات المناسبة
 */
function exportPredictionReport(prediction, eventData) {
    console.log('تصدير تقرير التنبؤ...');
    
    // إنشاء محتوى التقرير
    const reportContent = generateReportContent(prediction, eventData);
    
    // إنشاء Blob
    const blob = new Blob([reportContent], { type: 'text/html' });
    
    // إنشاء رابط التنزيل
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'تقرير_توقعات_الحضور.html';
    
    // إضافة الرابط إلى الصفحة
    document.body.appendChild(link);
    
    // النقر على الرابط
    link.click();
    
    // إزالة الرابط
    document.body.removeChild(link);
}

/**
 * توليد محتوى تقرير التنبؤ
 * @param {Object} prediction - نتائج التنبؤ
 * @param {Object} eventData - بيانات المناسبة
 * @returns {string} - محتوى التقرير
 */
function generateReportContent(prediction, eventData) {
    // حساب عدد الحضور المتوقع
    const expectedAttendees = Math.round(eventData.totalInvited * prediction.predictedRate);
    const lowerBoundAttendees = Math.round(eventData.totalInvited * prediction.lowerBound);
    const upperBoundAttendees = Math.round(eventData.totalInvited * prediction.upperBound);
    
    // ترجمة قيم البيانات
    const eventTypeNames = {
        'wedding': 'زفاف',
        'conference': 'مؤتمر',
        'birthday': 'عيد ميلاد',
        'corporate': 'مناسبة شركة',
        'graduation': 'تخرج',
        'other': 'أخرى'
    };
    
    const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    const timeNames = {
        'morning': 'صباحاً',
        'afternoon': 'ظهراً',
        'evening': 'مساءً'
    };
    
    const seasonNames = {
        'winter': 'الشتاء',
        'spring': 'الربيع',
        'summer': 'الصيف',
        'fall': 'الخريف'
    };
    
    const locationNames = {
        'indoor': 'داخلي',
        'outdoor': 'خارجي'
    };
    
    const distanceNames = {
        'local': 'قريب',
        'remote': 'بعيد'
    };
    
    const weatherNames = {
        'clear': 'صافي',
        'rainy': 'ممطر',
        'snowy': 'ثلجي',
        'hot': 'حار'
    };
    
    // إنشاء محتوى التقرير
    return `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>تقرير توقعات الحضور</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 20px;
                    background-color: #f8f9fa;
                }
                
                .report-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                
                .report-header {
                    background-color: #4a6cf7;
                    color: white;
                    padding: 20px;
                    text-align: center;
                }
                
                .report-title {
                    margin: 0;
                    font-size: 24px;
                }
                
                .report-subtitle {
                    margin: 10px 0 0;
                    font-size: 16px;
                    opacity: 0.8;
                }
                
                .report-body {
                    padding: 20px;
                }
                
                .report-section {
                    margin-bottom: 30px;
                }
                
                .section-title {
                    color: #4a6cf7;
                    border-bottom: 2px solid #e9ecef;
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                }
                
                .prediction-summary {
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 15px;
                }
                
                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                
                .item-label {
                    font-weight: bold;
                }
                
                .item-value {
                    font-weight: bold;
                    color: #4a6cf7;
                }
                
                .event-details {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }
                
                .detail-item {
                    margin-bottom: 10px;
                }
                
                .detail-label {
                    font-weight: bold;
                    display: block;
                    margin-bottom: 5px;
                    color: #6c757d;
                }
                
                .detail-value {
                    background-color: #f8f9fa;
                    padding: 8px 12px;
                    border-radius: 4px;
                    display: block;
                }
                
                .factors-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .factor-item {
                    padding: 10px;
                    margin-bottom: 10px;
                    border-radius: 5px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .positive-factor {
                    background-color: rgba(40, 167, 69, 0.1);
                    border-right: 3px solid #28a745;
                }
                
                .negative-factor {
                    background-color: rgba(220, 53, 69, 0.1);
                    border-right: 3px solid #dc3545;
                }
                
                .factor-name {
                    font-weight: bold;
                }
                
                .factor-impact {
                    font-weight: bold;
                }
                
                .positive-factor .factor-impact {
                    color: #28a745;
                }
                
                .negative-factor .factor-impact {
                    color: #dc3545;
                }
                
                .recommendations-list {
                    padding-right: 20px;
                }
                
                .recommendation-item {
                    margin-bottom: 15px;
                }
                
                .chart-container {
                    margin-top: 20px;
                }
                
                .chart-bar-container {
                    height: 40px;
                    background-color: #e9ecef;
                    border-radius: 20px;
                    margin-bottom: 10px;
                    overflow: hidden;
                }
                
                .chart-bar {
                    height: 100%;
                    background-color: #4a6cf7;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding-left: 15px;
                    padding-right: 15px;
                }
                
                .chart-value {
                    color: white;
                    font-weight: bold;
                }
                
                .chart-range {
                    display: flex;
                    justify-content: space-between;
                }
                
                .range-min, .range-max {
                    font-size: 0.9em;
                    color: #6c757d;
                }
                
                .report-footer {
                    background-color: #f8f9fa;
                    padding: 15px;
                    text-align: center;
                    font-size: 14px;
                    color: #6c757d;
                    border-top: 1px solid #e9ecef;
                }
            </style>
        </head>
        <body>
            <div class="report-container">
                <div class="report-header">
                    <h1 class="report-title">تقرير توقعات الحضور</h1>
                    <p class="report-subtitle">تم إنشاؤه في ${new Date().toLocaleDateString('ar-SA')} - ${new Date().toLocaleTimeString('ar-SA')}</p>
                </div>
                
                <div class="report-body">
                    <div class="report-section">
                        <h2 class="section-title">ملخص التنبؤ</h2>
                        <div class="prediction-summary">
                            <div class="summary-item">
                                <span class="item-label">نسبة الحضور المتوقعة:</span>
                                <span class="item-value">${Math.round(prediction.predictedRate * 100)}%</span>
                            </div>
                            <div class="summary-item">
                                <span class="item-label">نطاق التنبؤ (فترة ثقة 95%):</span>
                                <span class="item-value">${Math.round(prediction.lowerBound * 100)}% - ${Math.round(prediction.upperBound * 100)}%</span>
                            </div>
                            <div class="summary-item">
                                <span class="item-label">عدد الحضور المتوقع:</span>
                                <span class="item-value">${expectedAttendees} من أصل ${eventData.totalInvited}</span>
                            </div>
                            <div class="summary-item">
                                <span class="item-label">نطاق عدد الحضور:</span>
                                <span class="item-value">${lowerBoundAttendees} - ${upperBoundAttendees} شخص</span>
                            </div>
                        </div>
                        
                        <div class="chart-container">
                            <div class="chart-bar-container">
                                <div class="chart-bar" style="width: ${Math.round(prediction.predictedRate * 100)}%;">
                                    <span class="chart-value">${Math.round(prediction.predictedRate * 100)}%</span>
                                </div>
                            </div>
                            <div class="chart-range">
                                <span class="range-min">${Math.round(prediction.lowerBound * 100)}%</span>
                                <span class="range-max">${Math.round(prediction.upperBound * 100)}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="report-section">
                        <h2 class="section-title">تفاصيل المناسبة</h2>
                        <div class="event-details">
                            <div class="detail-item">
                                <span class="detail-label">نوع المناسبة</span>
                                <span class="detail-value">${eventTypeNames[eventData.type] || eventData.type}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">عدد المدعوين</span>
                                <span class="detail-value">${eventData.totalInvited}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">يوم المناسبة</span>
                                <span class="detail-value">${dayNames[eventData.dayOfWeek]}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">وقت المناسبة</span>
                                <span class="detail-value">${timeNames[eventData.timeOfDay]}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">الموسم</span>
                                <span class="detail-value">${seasonNames[eventData.season]}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">الموقع</span>
                                <span class="detail-value">${locationNames[eventData.location]}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">المسافة</span>
                                <span class="detail-value">${distanceNames[eventData.distance]}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">حالة الطقس المتوقعة</span>
                                <span class="detail-value">${weatherNames[eventData.weatherCondition]}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">مدة الإشعار المسبق</span>
                                <span class="detail-value">${eventData.advanceNotice} يوم</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">إرسال تذكير</span>
                                <span class="detail-value">${eventData.reminderSent ? 'نعم' : 'لا'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">توفير مواصلات</span>
                                <span class="detail-value">${eventData.hasTransportation ? 'نعم' : 'لا'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">يوم عطلة</span>
                                <span class="detail-value">${eventData.isHoliday ? 'نعم' : 'لا'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">مناسبات متنافسة</span>
                                <span class="detail-value">${eventData.competingEvents ? 'نعم' : 'لا'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="report-section">
                        <h2 class="section-title">العوامل المؤثرة</h2>
                        <ul class="factors-list">
                            ${prediction.factors.map(factor => `
                                <li class="factor-item ${factor.impact === 'positive' ? 'positive-factor' : 'negative-factor'}">
                                    <span class="factor-name">${factor.factor}: ${factor.value}</span>
                                    <span class="factor-impact">
                                        ${factor.impact === 'positive' ? '▲' : '▼'}
                                        ${Math.round(factor.difference * 100)}%
                                    </span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="report-section">
                        <h2 class="section-title">توصيات لتحسين نسبة الحضور</h2>
                        <ol class="recommendations-list">
                            ${generateRecommendations(prediction, eventData).map(recommendation => `
                                <li class="recommendation-item">${recommendation}</li>
                            `).join('')}
                        </ol>
                    </div>
                </div>
                
                <div class="report-footer">
                    <p>تم إنشاء هذا التقرير بواسطة نظام تحليل توقعات الحضور - منصة الدعوات الإلكترونية الشاملة</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

/**
 * إضافة أزرار التنبؤ إلى صفحات الدعوات
 */
function addPredictionButtons() {
    console.log('إضافة أزرار التنبؤ إلى صفحات الدعوات...');
    
    // البحث عن صفحات الدعوات
    const invitationPages = document.querySelectorAll('.invitation-details, .invitation-form, .event-details');
    
    invitationPages.forEach(page => {
        // التحقق من وجود زر التنبؤ
        if (page.querySelector('.prediction-button')) {
            return;
        }
        
        // البحث عن مكان مناسب لإضافة الزر
        const actionBar = page.querySelector('.action-bar, .card-footer, .form-actions');
        
        if (actionBar) {
            // إنشاء زر التنبؤ
            const predictionButton = document.createElement('button');
            predictionButton.className = 'btn btn-info prediction-button';
            predictionButton.innerHTML = '<i class="fas fa-chart-line"></i> تنبؤ بالحضور';
            
            // إضافة حدث النقر
            predictionButton.addEventListener('click', function() {
                // الحصول على بيانات الدعوة
                const invitationData = extractInvitationData(page);
                
                // فتح نافذة التنبؤ
                openPredictionModal(invitationData);
            });
            
            // إضافة الزر إلى شريط الإجراءات
            actionBar.appendChild(predictionButton);
        }
    });
}

/**
 * استخراج بيانات الدعوة
 * @param {HTMLElement} invitationPage - صفحة الدعوة
 * @returns {Object} - بيانات الدعوة
 */
function extractInvitationData(invitationPage) {
    console.log('استخراج بيانات الدعوة...');
    
    // في بيئة الإنتاج، يتم استخراج البيانات من الصفحة
    // هنا نستخدم بيانات تجريبية
    
    return {
        type: 'wedding',
        dayOfWeek: 5, // الجمعة
        timeOfDay: 'evening',
        season: 'summer',
        location: 'indoor',
        distance: 'local',
        weatherCondition: 'clear',
        advanceNotice: 30,
        reminderSent: true,
        hasTransportation: false,
        isHoliday: false,
        competingEvents: false,
        totalInvited: 200
    };
}

/**
 * فتح نافذة التنبؤ
 * @param {Object} invitationData - بيانات الدعوة
 */
function openPredictionModal(invitationData) {
    console.log('فتح نافذة التنبؤ...');
    
    // التحقق من وجود نافذة التنبؤ
    if (document.getElementById('prediction-modal')) {
        document.getElementById('prediction-modal').remove();
    }
    
    // إنشاء نافذة التنبؤ
    const modal = document.createElement('div');
    modal.id = 'prediction-modal';
    modal.className = 'prediction-modal';
    
    // إنشاء محتوى النافذة
    modal.innerHTML = `
        <div class="prediction-modal-content">
            <div class="prediction-modal-header">
                <h5>تنبؤ بنسبة الحضور</h5>
                <button type="button" class="close-modal">&times;</button>
            </div>
            <div class="prediction-modal-body">
                <form id="prediction-form">
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="event-type">نوع المناسبة</label>
                            <select class="form-control" id="event-type" required>
                                <option value="wedding" ${invitationData.type === 'wedding' ? 'selected' : ''}>زفاف</option>
                                <option value="conference" ${invitationData.type === 'conference' ? 'selected' : ''}>مؤتمر</option>
                                <option value="birthday" ${invitationData.type === 'birthday' ? 'selected' : ''}>عيد ميلاد</option>
                                <option value="corporate" ${invitationData.type === 'corporate' ? 'selected' : ''}>مناسبة شركة</option>
                                <option value="graduation" ${invitationData.type === 'graduation' ? 'selected' : ''}>تخرج</option>
                                <option value="other" ${invitationData.type === 'other' ? 'selected' : ''}>أخرى</option>
                            </select>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="total-invited">عدد المدعوين</label>
                            <input type="number" class="form-control" id="total-invited" value="${invitationData.totalInvited}" min="1" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="day-of-week">يوم المناسبة</label>
                            <select class="form-control" id="day-of-week" required>
                                <option value="0" ${invitationData.dayOfWeek === 0 ? 'selected' : ''}>الأحد</option>
                                <option value="1" ${invitationData.dayOfWeek === 1 ? 'selected' : ''}>الاثنين</option>
                                <option value="2" ${invitationData.dayOfWeek === 2 ? 'selected' : ''}>الثلاثاء</option>
                                <option value="3" ${invitationData.dayOfWeek === 3 ? 'selected' : ''}>الأربعاء</option>
                                <option value="4" ${invitationData.dayOfWeek === 4 ? 'selected' : ''}>الخميس</option>
                                <option value="5" ${invitationData.dayOfWeek === 5 ? 'selected' : ''}>الجمعة</option>
                                <option value="6" ${invitationData.dayOfWeek === 6 ? 'selected' : ''}>السبت</option>
                            </select>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="time-of-day">وقت المناسبة</label>
                            <select class="form-control" id="time-of-day" required>
                                <option value="morning" ${invitationData.timeOfDay === 'morning' ? 'selected' : ''}>صباحاً</option>
                                <option value="afternoon" ${invitationData.timeOfDay === 'afternoon' ? 'selected' : ''}>ظهراً</option>
                                <option value="evening" ${invitationData.timeOfDay === 'evening' ? 'selected' : ''}>مساءً</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="season">الموسم</label>
                            <select class="form-control" id="season" required>
                                <option value="winter" ${invitationData.season === 'winter' ? 'selected' : ''}>الشتاء</option>
                                <option value="spring" ${invitationData.season === 'spring' ? 'selected' : ''}>الربيع</option>
                                <option value="summer" ${invitationData.season === 'summer' ? 'selected' : ''}>الصيف</option>
                                <option value="fall" ${invitationData.season === 'fall' ? 'selected' : ''}>الخريف</option>
                            </select>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="location">الموقع</label>
                            <select class="form-control" id="location" required>
                                <option value="indoor" ${invitationData.location === 'indoor' ? 'selected' : ''}>داخلي</option>
                                <option value="outdoor" ${invitationData.location === 'outdoor' ? 'selected' : ''}>خارجي</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="distance">المسافة</label>
                            <select class="form-control" id="distance" required>
                                <option value="local" ${invitationData.distance === 'local' ? 'selected' : ''}>قريب</option>
                                <option value="remote" ${invitationData.distance === 'remote' ? 'selected' : ''}>بعيد</option>
                            </select>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="weather">حالة الطقس المتوقعة</label>
                            <select class="form-control" id="weather" required>
                                <option value="clear" ${invitationData.weatherCondition === 'clear' ? 'selected' : ''}>صافي</option>
                                <option value="rainy" ${invitationData.weatherCondition === 'rainy' ? 'selected' : ''}>ممطر</option>
                                <option value="snowy" ${invitationData.weatherCondition === 'snowy' ? 'selected' : ''}>ثلجي</option>
                                <option value="hot" ${invitationData.weatherCondition === 'hot' ? 'selected' : ''}>حار</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="advance-notice">مدة الإشعار المسبق (أيام)</label>
                            <input type="number" class="form-control" id="advance-notice" value="${invitationData.advanceNotice}" min="1" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="reminder">إرسال تذكير</label>
                            <select class="form-control" id="reminder" required>
                                <option value="true" ${invitationData.reminderSent ? 'selected' : ''}>نعم</option>
                                <option value="false" ${!invitationData.reminderSent ? 'selected' : ''}>لا</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group col-md-4">
                            <label for="transportation">توفير مواصلات</label>
                            <select class="form-control" id="transportation" required>
                                <option value="true" ${invitationData.hasTransportation ? 'selected' : ''}>نعم</option>
                                <option value="false" ${!invitationData.hasTransportation ? 'selected' : ''}>لا</option>
                            </select>
                        </div>
                        <div class="form-group col-md-4">
                            <label for="holiday">يوم عطلة</label>
                            <select class="form-control" id="holiday" required>
                                <option value="true" ${invitationData.isHoliday ? 'selected' : ''}>نعم</option>
                                <option value="false" ${!invitationData.isHoliday ? 'selected' : ''}>لا</option>
                            </select>
                        </div>
                        <div class="form-group col-md-4">
                            <label for="competing-events">مناسبات متنافسة</label>
                            <select class="form-control" id="competing-events" required>
                                <option value="true" ${invitationData.competingEvents ? 'selected' : ''}>نعم</option>
                                <option value="false" ${!invitationData.competingEvents ? 'selected' : ''}>لا</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-buttons">
                        <button type="submit" class="btn btn-primary">تنبؤ بالحضور</button>
                        <button type="button" class="btn btn-secondary" id="reset-prediction">إعادة تعيين</button>
                    </div>
                </form>
                
                <div id="prediction-results" style="display: none;"></div>
            </div>
        </div>
    `;
    
    // إضافة أنماط CSS
    const styles = document.createElement('style');
    styles.textContent = `
        .prediction-modal {
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
            direction: rtl;
        }
        
        .prediction-modal-content {
            background-color: white;
            border-radius: 5px;
            width: 800px;
            max-width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .prediction-modal-header {
            padding: 15px;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .prediction-modal-body {
            padding: 15px;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }
        
        .form-row {
            display: flex;
            flex-wrap: wrap;
            margin-right: -5px;
            margin-left: -5px;
            margin-bottom: 15px;
        }
        
        .form-group {
            padding-right: 5px;
            padding-left: 5px;
            margin-bottom: 15px;
        }
        
        .col-md-4 {
            flex: 0 0 33.333333%;
            max-width: 33.333333%;
        }
        
        .col-md-6 {
            flex: 0 0 50%;
            max-width: 50%;
        }
        
        .form-control {
            display: block;
            width: 100%;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            color: #495057;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #ced4da;
            border-radius: 0.25rem;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        
        .form-buttons {
            display: flex;
            justify-content: flex-start;
            gap: 10px;
            margin-top: 20px;
        }
        
        .btn {
            display: inline-block;
            font-weight: 400;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            user-select: none;
            border: 1px solid transparent;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: 0.25rem;
            transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            cursor: pointer;
        }
        
        .btn-primary {
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
        }
        
        .btn-secondary {
            color: #fff;
            background-color: #6c757d;
            border-color: #6c757d;
        }
        
        @media (max-width: 768px) {
            .col-md-4, .col-md-6 {
                flex: 0 0 100%;
                max-width: 100%;
            }
        }
    `;
    
    // إضافة النافذة والأنماط إلى الصفحة
    document.head.appendChild(styles);
    document.body.appendChild(modal);
    
    // إضافة أحداث النافذة
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('prediction-modal').remove();
    });
    
    document.getElementById('prediction-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // جمع بيانات المناسبة
        const eventData = {
            type: document.getElementById('event-type').value,
            dayOfWeek: parseInt(document.getElementById('day-of-week').value),
            timeOfDay: document.getElementById('time-of-day').value,
            season: document.getElementById('season').value,
            location: document.getElementById('location').value,
            distance: document.getElementById('distance').value,
            weatherCondition: document.getElementById('weather').value,
            advanceNotice: parseInt(document.getElementById('advance-notice').value),
            reminderSent: document.getElementById('reminder').value === 'true',
            hasTransportation: document.getElementById('transportation').value === 'true',
            isHoliday: document.getElementById('holiday').value === 'true',
            competingEvents: document.getElementById('competing-events').value === 'true',
            totalInvited: parseInt(document.getElementById('total-invited').value)
        };
        
        // تهيئة نموذج التنبؤ إذا لم يكن موجوداً
        if (!window.predictionModel) {
            loadHistoricalData();
            initPredictionModel();
        }
        
        // التنبؤ بمعدل الحضور
        const prediction = window.predictionModel.predict(eventData);
        
        // عرض نتائج التنبؤ
        displayPredictionResults(prediction, eventData);
    });
    
    document.getElementById('reset-prediction').addEventListener('click', function() {
        document.getElementById('prediction-form').reset();
        document.getElementById('prediction-results').style.display = 'none';
    });
}
