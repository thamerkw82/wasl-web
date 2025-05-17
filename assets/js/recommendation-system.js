/**
 * نظام التوصيات الذكي
 * يوفر توصيات مخصصة للمستخدمين بناءً على سلوكهم وتفضيلاتهم
 */

// كائن لإدارة نظام التوصيات
const RecommendationSystem = {
    // إعدادات افتراضية
    settings: {
        // أنواع التوصيات
        recommendationTypes: [
            { id: 'templates', name: 'قوالب مقترحة', weight: 1.0 },
            { id: 'events', name: 'مناسبات مشابهة', weight: 0.8 },
            { id: 'designs', name: 'تصاميم مقترحة', weight: 0.9 },
            { id: 'features', name: 'ميزات مقترحة', weight: 0.7 },
            { id: 'guests', name: 'قوائم ضيوف مقترحة', weight: 0.6 }
        ],
        
        // عدد التوصيات لكل نوع
        maxRecommendationsPerType: 5,
        
        // ما إذا كان يجب تخزين بيانات التوصيات
        storeRecommendationData: true,
        
        // ما إذا كان يجب تحديث التوصيات تلقائياً
        autoUpdateRecommendations: true,
        
        // فترة تحديث التوصيات (بالمللي ثانية)
        updateInterval: 3600000, // ساعة واحدة
        
        // عوامل الترجيح
        weights: {
            // عامل ترجيح التفاعلات السابقة
            previousInteractions: 0.4,
            
            // عامل ترجيح التفضيلات الصريحة
            explicitPreferences: 0.3,
            
            // عامل ترجيح سلوك المستخدمين المشابهين
            similarUsers: 0.2,
            
            // عامل ترجيح الشعبية العامة
            popularity: 0.1
        }
    },
    
    // حالة النظام
    state: {
        // ما إذا كان نظام التوصيات مفعلاً
        enabled: false,
        
        // مؤقت تحديث التوصيات
        updateTimer: null,
        
        // بيانات المستخدم الحالي
        currentUser: null,
        
        // التوصيات الحالية
        currentRecommendations: {},
        
        // سجل التفاعلات
        interactionHistory: [],
        
        // العناصر التي تم تحسينها
        enhancedElements: {}
    },
    
    /**
     * تهيئة نظام التوصيات
     * @param {Object} options خيارات التهيئة
     */
    init: function(options = {}) {
        // دمج الخيارات مع الإعدادات الافتراضية
        this.settings = { ...this.settings, ...options };
        
        // الحصول على بيانات المستخدم الحالي
        this.getCurrentUser();
        
        // استرجاع بيانات التوصيات
        this.retrieveRecommendationData();
        
        // تحسين عناصر التوصيات
        this.enhanceRecommendationElements();
        
        // بدء تحديث التوصيات
        if (this.settings.autoUpdateRecommendations) {
            this.startUpdating();
        }
        
        // تفعيل نظام التوصيات
        this.state.enabled = true;
        
        console.log('تم تهيئة نظام التوصيات');
    },
    
    /**
     * الحصول على بيانات المستخدم الحالي
     */
    getCurrentUser: function() {
        // في بيئة حقيقية، هذه الدالة ستقوم بجلب بيانات المستخدم الحالي من الخادم
        // لأغراض العرض، سنقوم بإنشاء بيانات افتراضية
        
        // التحقق من وجود بيانات المستخدم في localStorage
        const storedUser = localStorage.getItem('currentUser');
        
        if (storedUser) {
            try {
                // تحليل بيانات المستخدم
                this.state.currentUser = JSON.parse(storedUser);
                
                console.log('تم استرجاع بيانات المستخدم الحالي');
            } catch (error) {
                console.error('فشل تحليل بيانات المستخدم:', error);
                
                // إنشاء بيانات افتراضية
                this.createDefaultUser();
            }
        } else {
            // إنشاء بيانات افتراضية
            this.createDefaultUser();
        }
    },
    
    /**
     * إنشاء بيانات افتراضية للمستخدم
     */
    createDefaultUser: function() {
        // إنشاء بيانات افتراضية للمستخدم
        this.state.currentUser = {
            id: 'user-' + Math.floor(Math.random() * 1000000),
            name: 'مستخدم افتراضي',
            preferences: {
                templates: ['wedding', 'birthday', 'conference'],
                designs: ['modern', 'classic', 'elegant'],
                colors: ['blue', 'green', 'purple']
            },
            history: {
                templates: [
                    { id: 'template-1', name: 'قالب زفاف فاخر', interactions: 5, lastInteraction: new Date() },
                    { id: 'template-2', name: 'قالب عيد ميلاد', interactions: 3, lastInteraction: new Date(Date.now() - 86400000) }
                ],
                events: [
                    { id: 'event-1', name: 'حفل زفاف', interactions: 8, lastInteraction: new Date() },
                    { id: 'event-2', name: 'مؤتمر تقني', interactions: 2, lastInteraction: new Date(Date.now() - 172800000) }
                ],
                designs: [
                    { id: 'design-1', name: 'تصميم عصري', interactions: 6, lastInteraction: new Date() },
                    { id: 'design-2', name: 'تصميم كلاسيكي', interactions: 4, lastInteraction: new Date(Date.now() - 259200000) }
                ]
            }
        };
        
        // تخزين بيانات المستخدم في localStorage
        localStorage.setItem('currentUser', JSON.stringify(this.state.currentUser));
        
        console.log('تم إنشاء بيانات افتراضية للمستخدم');
    },
    
    /**
     * استرجاع بيانات التوصيات
     */
    retrieveRecommendationData: function() {
        // التحقق من وجود بيانات التوصيات في localStorage
        const storedRecommendations = localStorage.getItem('recommendations');
        
        if (storedRecommendations) {
            try {
                // تحليل بيانات التوصيات
                this.state.currentRecommendations = JSON.parse(storedRecommendations);
                
                console.log('تم استرجاع بيانات التوصيات');
            } catch (error) {
                console.error('فشل تحليل بيانات التوصيات:', error);
                
                // إنشاء توصيات جديدة
                this.generateRecommendations();
            }
        } else {
            // إنشاء توصيات جديدة
            this.generateRecommendations();
        }
    },
    
    /**
     * تحسين عناصر التوصيات
     */
    enhanceRecommendationElements: function() {
        // تحديد حاويات التوصيات
        const recommendationContainers = document.querySelectorAll('[data-recommendations]');
        
        // تحسين كل حاوية
        recommendationContainers.forEach(container => {
            // التحقق من أن الحاوية لم يتم تحسينها بالفعل
            if (container.hasAttribute('data-enhanced')) {
                return;
            }
            
            // الحصول على نوع التوصيات
            const recommendationType = container.getAttribute('data-recommendations');
            
            // التحقق من وجود نوع التوصيات
            if (!recommendationType) {
                return;
            }
            
            // إنشاء عنوان التوصيات
            const recommendationTitle = document.createElement('h3');
            recommendationTitle.className = 'recommendation-title';
            recommendationTitle.textContent = this.getRecommendationTypeName(recommendationType);
            
            // إنشاء قائمة التوصيات
            const recommendationList = document.createElement('div');
            recommendationList.className = 'recommendation-list';
            recommendationList.style.display = 'grid';
            recommendationList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
            recommendationList.style.gap = '15px';
            recommendationList.style.marginTop = '10px';
            
            // إضافة العناصر إلى الحاوية
            container.appendChild(recommendationTitle);
            container.appendChild(recommendationList);
            
            // تعيين سمة تحسين الحاوية
            container.setAttribute('data-enhanced', 'true');
            
            // تخزين الحاوية في حالة النظام
            if (!this.state.enhancedElements.recommendationContainers) {
                this.state.enhancedElements.recommendationContainers = {};
            }
            
            this.state.enhancedElements.recommendationContainers[recommendationType] = {
                container: container,
                title: recommendationTitle,
                list: recommendationList
            };
            
            // تحديث التوصيات
            this.updateRecommendationUI(recommendationType);
        });
        
        // تحسين أزرار تحديث التوصيات
        const refreshButtons = document.querySelectorAll('[data-refresh-recommendations]');
        
        // تحسين كل زر
        refreshButtons.forEach(button => {
            // التحقق من أن الزر لم يتم تحسينه بالفعل
            if (button.hasAttribute('data-enhanced')) {
                return;
            }
            
            // الحصول على نوع التوصيات
            const recommendationType = button.getAttribute('data-refresh-recommendations');
            
            // إضافة مستمع حدث النقر
            button.addEventListener('click', () => {
                // تحديث التوصيات
                this.refreshRecommendations(recommendationType);
            });
            
            // تعيين سمة تحسين الزر
            button.setAttribute('data-enhanced', 'true');
            
            // تخزين الزر في حالة النظام
            if (!this.state.enhancedElements.refreshButtons) {
                this.state.enhancedElements.refreshButtons = {};
            }
            
            this.state.enhancedElements.refreshButtons[recommendationType] = button;
        });
    },
    
    /**
     * بدء تحديث التوصيات
     */
    startUpdating: function() {
        // إيقاف المؤقت الحالي
        this.stopUpdating();
        
        // بدء مؤقت جديد
        this.state.updateTimer = setInterval(() => {
            this.generateRecommendations();
        }, this.settings.updateInterval);
        
        console.log('تم بدء تحديث التوصيات');
    },
    
    /**
     * إيقاف تحديث التوصيات
     */
    stopUpdating: function() {
        // إيقاف المؤقت الحالي
        if (this.state.updateTimer) {
            clearInterval(this.state.updateTimer);
            this.state.updateTimer = null;
            
            console.log('تم إيقاف تحديث التوصيات');
        }
    },
    
    /**
     * إنشاء التوصيات
     */
    generateRecommendations: function() {
        // التحقق من أن نظام التوصيات مفعل
        if (!this.state.enabled) {
            return;
        }
        
        // التحقق من وجود بيانات المستخدم
        if (!this.state.currentUser) {
            this.getCurrentUser();
        }
        
        // إنشاء توصيات لكل نوع
        this.settings.recommendationTypes.forEach(type => {
            // إنشاء توصيات للنوع
            this.generateRecommendationsForType(type.id);
        });
        
        // تخزين بيانات التوصيات
        if (this.settings.storeRecommendationData) {
            this.storeRecommendationData();
        }
        
        // تحديث واجهة المستخدم
        this.updateAllRecommendationsUI();
        
        console.log('تم إنشاء التوصيات');
    },
    
    /**
     * إنشاء توصيات لنوع معين
     * @param {string} type نوع التوصيات
     */
    generateRecommendationsForType: function(type) {
        // في بيئة حقيقية، هذه الدالة ستقوم بجلب التوصيات من الخادم
        // لأغراض العرض، سنقوم بإنشاء توصيات افتراضية
        
        // إنشاء مصفوفة التوصيات
        const recommendations = [];
        
        // إنشاء توصيات افتراضية
        switch (type) {
            case 'templates':
                // إنشاء قوالب مقترحة
                recommendations.push(
                    { id: 'template-1', name: 'قالب زفاف فاخر', image: 'wedding-template.jpg', score: 0.95 },
                    { id: 'template-2', name: 'قالب عيد ميلاد', image: 'birthday-template.jpg', score: 0.85 },
                    { id: 'template-3', name: 'قالب مؤتمر', image: 'conference-template.jpg', score: 0.80 },
                    { id: 'template-4', name: 'قالب حفل تخرج', image: 'graduation-template.jpg', score: 0.75 },
                    { id: 'template-5', name: 'قالب معرض', image: 'exhibition-template.jpg', score: 0.70 }
                );
                break;
            
            case 'events':
                // إنشاء مناسبات مشابهة
                recommendations.push(
                    { id: 'event-1', name: 'حفل زفاف', image: 'wedding-event.jpg', score: 0.90 },
                    { id: 'event-2', name: 'مؤتمر تقني', image: 'tech-conference.jpg', score: 0.85 },
                    { id: 'event-3', name: 'حفل عيد ميلاد', image: 'birthday-event.jpg', score: 0.80 },
                    { id: 'event-4', name: 'معرض فني', image: 'art-exhibition.jpg', score: 0.75 },
                    { id: 'event-5', name: 'حفل تخرج', image: 'graduation-event.jpg', score: 0.70 }
                );
                break;
            
            case 'designs':
                // إنشاء تصاميم مقترحة
                recommendations.push(
                    { id: 'design-1', name: 'تصميم عصري', image: 'modern-design.jpg', score: 0.95 },
                    { id: 'design-2', name: 'تصميم كلاسيكي', image: 'classic-design.jpg', score: 0.90 },
                    { id: 'design-3', name: 'تصميم أنيق', image: 'elegant-design.jpg', score: 0.85 },
                    { id: 'design-4', name: 'تصميم بسيط', image: 'simple-design.jpg', score: 0.80 },
                    { id: 'design-5', name: 'تصميم فاخر', image: 'luxury-design.jpg', score: 0.75 }
                );
                break;
            
            case 'features':
                // إنشاء ميزات مقترحة
                recommendations.push(
                    { id: 'feature-1', name: 'تسجيل الحضور', image: 'attendance.jpg', score: 0.90 },
                    { id: 'feature-2', name: 'خريطة الموقع', image: 'map.jpg', score: 0.85 },
                    { id: 'feature-3', name: 'جدول الفعاليات', image: 'schedule.jpg', score: 0.80 },
                    { id: 'feature-4', name: 'استطلاع رأي', image: 'survey.jpg', score: 0.75 },
                    { id: 'feature-5', name: 'معرض صور', image: 'gallery.jpg', score: 0.70 }
                );
                break;
            
            case 'guests':
                // إنشاء قوائم ضيوف مقترحة
                recommendations.push(
                    { id: 'guest-list-1', name: 'قائمة العائلة', image: 'family.jpg', score: 0.95 },
                    { id: 'guest-list-2', name: 'قائمة الأصدقاء', image: 'friends.jpg', score: 0.90 },
                    { id: 'guest-list-3', name: 'قائمة زملاء العمل', image: 'colleagues.jpg', score: 0.85 },
                    { id: 'guest-list-4', name: 'قائمة VIP', image: 'vip.jpg', score: 0.80 },
                    { id: 'guest-list-5', name: 'قائمة الشخصيات العامة', image: 'public-figures.jpg', score: 0.75 }
                );
                break;
            
            default:
                break;
        }
        
        // ترتيب التوصيات حسب الدرجة
        recommendations.sort((a, b) => b.score - a.score);
        
        // تحديد عدد التوصيات
        const maxRecommendations = this.settings.maxRecommendationsPerType;
        
        // تعيين التوصيات
        this.state.currentRecommendations[type] = recommendations.slice(0, maxRecommendations);
    },
    
    /**
     * تحديث واجهة المستخدم لجميع التوصيات
     */
    updateAllRecommendationsUI: function() {
        // تحديث واجهة المستخدم لكل نوع
        this.settings.recommendationTypes.forEach(type => {
            this.updateRecommendationUI(type.id);
        });
    },
    
    /**
     * تحديث واجهة المستخدم لنوع معين
     * @param {string} type نوع التوصيات
     */
    updateRecommendationUI: function(type) {
        // التحقق من وجود حاوية التوصيات
        if (!this.state.enhancedElements.recommendationContainers || !this.state.enhancedElements.recommendationContainers[type]) {
            return;
        }
        
        // الحصول على حاوية التوصيات
        const container = this.state.enhancedElements.recommendationContainers[type];
        
        // الحصول على قائمة التوصيات
        const list = container.list;
        
        // إزالة جميع العناصر من القائمة
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        
        // الحصول على التوصيات
        const recommendations = this.state.currentRecommendations[type] || [];
        
        // التحقق من وجود توصيات
        if (recommendations.length === 0) {
            // إنشاء عنصر لا توجد توصيات
            const noRecommendationsItem = document.createElement('div');
            noRecommendationsItem.className = 'no-recommendations';
            noRecommendationsItem.style.gridColumn = '1 / -1';
            noRecommendationsItem.style.padding = '20px';
            noRecommendationsItem.style.backgroundColor = '#f8f8f8';
            noRecommendationsItem.style.borderRadius = '5px';
            noRecommendationsItem.style.textAlign = 'center';
            noRecommendationsItem.textContent = 'لا توجد توصيات حالياً';
            
            // إضافة العنصر إلى القائمة
            list.appendChild(noRecommendationsItem);
        } else {
            // إضافة كل توصية إلى القائمة
            recommendations.forEach(recommendation => {
                // إنشاء بطاقة التوصية
                const recommendationCard = document.createElement('div');
                recommendationCard.className = 'recommendation-card';
                recommendationCard.style.backgroundColor = '#fff';
                recommendationCard.style.borderRadius = '5px';
                recommendationCard.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                recommendationCard.style.overflow = 'hidden';
                recommendationCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                recommendationCard.style.cursor = 'pointer';
                
                // إضافة تأثير التحويم
                recommendationCard.addEventListener('mouseenter', () => {
                    recommendationCard.style.transform = 'translateY(-5px)';
                    recommendationCard.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                });
                
                recommendationCard.addEventListener('mouseleave', () => {
                    recommendationCard.style.transform = 'translateY(0)';
                    recommendationCard.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                });
                
                // إضافة مستمع حدث النقر
                recommendationCard.addEventListener('click', () => {
                    // تسجيل التفاعل
                    this.recordInteraction(type, recommendation.id);
                    
                    // فتح التوصية
                    this.openRecommendation(type, recommendation);
                });
                
                // إنشاء صورة التوصية
                const recommendationImage = document.createElement('div');
                recommendationImage.className = 'recommendation-image';
                recommendationImage.style.height = '120px';
                recommendationImage.style.backgroundColor = '#f0f0f0';
                recommendationImage.style.backgroundImage = `url('/assets/images/${recommendation.image || 'placeholder.jpg'}')`;
                recommendationImage.style.backgroundSize = 'cover';
                recommendationImage.style.backgroundPosition = 'center';
                
                // إنشاء محتوى التوصية
                const recommendationContent = document.createElement('div');
                recommendationContent.className = 'recommendation-content';
                recommendationContent.style.padding = '10px';
                
                // إنشاء عنوان التوصية
                const recommendationTitle = document.createElement('h4');
                recommendationTitle.className = 'recommendation-title';
                recommendationTitle.style.margin = '0 0 5px 0';
                recommendationTitle.style.fontSize = '16px';
                recommendationTitle.textContent = recommendation.name;
                
                // إنشاء درجة التوصية
                const recommendationScore = document.createElement('div');
                recommendationScore.className = 'recommendation-score';
                recommendationScore.style.fontSize = '12px';
                recommendationScore.style.color = '#666';
                recommendationScore.textContent = `درجة التطابق: ${Math.round(recommendation.score * 100)}%`;
                
                // إضافة العناصر إلى محتوى التوصية
                recommendationContent.appendChild(recommendationTitle);
                recommendationContent.appendChild(recommendationScore);
                
                // إضافة العناصر إلى بطاقة التوصية
                recommendationCard.appendChild(recommendationImage);
                recommendationCard.appendChild(recommendationContent);
                
                // إضافة بطاقة التوصية إلى القائمة
                list.appendChild(recommendationCard);
            });
        }
    },
    
    /**
     * تسجيل تفاعل
     * @param {string} type نوع التوصية
     * @param {string} id معرف التوصية
     */
    recordInteraction: function(type, id) {
        // إضافة التفاعل إلى سجل التفاعلات
        this.state.interactionHistory.push({
            type: type,
            id: id,
            timestamp: new Date()
        });
        
        // تحديث بيانات المستخدم
        if (this.state.currentUser && this.state.currentUser.history && this.state.currentUser.history[type]) {
            // البحث عن العنصر في تاريخ المستخدم
            const itemIndex = this.state.currentUser.history[type].findIndex(item => item.id === id);
            
            if (itemIndex !== -1) {
                // تحديث العنصر
                this.state.currentUser.history[type][itemIndex].interactions++;
                this.state.currentUser.history[type][itemIndex].lastInteraction = new Date();
            } else {
                // إضافة العنصر
                this.state.currentUser.history[type].push({
                    id: id,
                    name: this.getRecommendationName(type, id),
                    interactions: 1,
                    lastInteraction: new Date()
                });
            }
            
            // تخزين بيانات المستخدم
            localStorage.setItem('currentUser', JSON.stringify(this.state.currentUser));
        }
        
        console.log(`تم تسجيل تفاعل: ${type} - ${id}`);
    },
    
    /**
     * فتح توصية
     * @param {string} type نوع التوصية
     * @param {Object} recommendation التوصية
     */
    openRecommendation: function(type, recommendation) {
        // في بيئة حقيقية، هذه الدالة ستقوم بفتح التوصية
        // لأغراض العرض، سنقوم بطباعة رسالة في وحدة التحكم
        
        console.log(`تم فتح التوصية: ${type} - ${recommendation.id} - ${recommendation.name}`);
        
        // التحقق من وجود دالة عرض الإشعارات
        if (typeof FeedbackSystem !== 'undefined' && typeof FeedbackSystem.showNotification === 'function') {
            // عرض إشعار
            FeedbackSystem.showNotification(`تم فتح ${this.getRecommendationTypeName(type)}: ${recommendation.name}`, 'info');
        }
    },
    
    /**
     * تحديث التوصيات
     * @param {string} type نوع التوصيات
     */
    refreshRecommendations: function(type) {
        // التحقق من نوع التوصيات
        if (type === 'all') {
            // تحديث جميع التوصيات
            this.generateRecommendations();
        } else {
            // تحديث نوع معين
            this.generateRecommendationsForType(type);
            
            // تحديث واجهة المستخدم
            this.updateRecommendationUI(type);
            
            // تخزين بيانات التوصيات
            if (this.settings.storeRecommendationData) {
                this.storeRecommendationData();
            }
        }
        
        // التحقق من وجود دالة عرض الإشعارات
        if (typeof FeedbackSystem !== 'undefined' && typeof FeedbackSystem.showNotification === 'function') {
            // عرض إشعار
            if (type === 'all') {
                FeedbackSystem.showNotification('تم تحديث جميع التوصيات', 'success');
            } else {
                FeedbackSystem.showNotification(`تم تحديث ${this.getRecommendationTypeName(type)}`, 'success');
            }
        }
        
        console.log(`تم تحديث التوصيات: ${type}`);
    },
    
    /**
     * تخزين بيانات التوصيات
     */
    storeRecommendationData: function() {
        // تخزين بيانات التوصيات في localStorage
        localStorage.setItem('recommendations', JSON.stringify(this.state.currentRecommendations));
        
        console.log('تم تخزين بيانات التوصيات');
    },
    
    /**
     * الحصول على اسم نوع التوصيات
     * @param {string} type نوع التوصيات
     * @returns {string} اسم نوع التوصيات
     */
    getRecommendationTypeName: function(type) {
        // البحث عن نوع التوصيات
        const recommendationType = this.settings.recommendationTypes.find(t => t.id === type);
        
        // التحقق من وجود نوع التوصيات
        if (recommendationType) {
            return recommendationType.name;
        }
        
        // إرجاع نوع التوصيات
        return type;
    },
    
    /**
     * الحصول على اسم التوصية
     * @param {string} type نوع التوصية
     * @param {string} id معرف التوصية
     * @returns {string} اسم التوصية
     */
    getRecommendationName: function(type, id) {
        // الحصول على التوصيات
        const recommendations = this.state.currentRecommendations[type] || [];
        
        // البحث عن التوصية
        const recommendation = recommendations.find(r => r.id === id);
        
        // التحقق من وجود التوصية
        if (recommendation) {
            return recommendation.name;
        }
        
        // إرجاع معرف التوصية
        return id;
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

// تهيئة نظام التوصيات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    RecommendationSystem.init();
    
    console.log('تم تهيئة نظام التوصيات');
});

// تصدير كائن RecommendationSystem للاستخدام في ملفات أخرى
window.RecommendationSystem = RecommendationSystem;
