/**
 * محرك التوصية الذكي
 * يوفر نظاماً متكاملاً لتقديم توصيات ذكية للمستخدمين بناءً على تفضيلاتهم وسلوكهم
 */

// كائن لإدارة محرك التوصية
const RecommendationEngine = {
    // إعدادات افتراضية
    settings: {
        // أنواع العناصر التي يمكن التوصية بها
        itemTypes: [
            { id: 'template', name: 'قالب', weight: 1.0 },
            { id: 'design', name: 'تصميم', weight: 1.0 },
            { id: 'invitation', name: 'دعوة', weight: 0.8 },
            { id: 'event', name: 'مناسبة', weight: 0.6 }
        ],
        
        // فئات التصنيف
        categories: [
            { id: 'wedding', name: 'زفاف', weight: 1.0 },
            { id: 'birthday', name: 'عيد ميلاد', weight: 1.0 },
            { id: 'graduation', name: 'تخرج', weight: 1.0 },
            { id: 'conference', name: 'مؤتمر', weight: 0.9 },
            { id: 'meeting', name: 'اجتماع', weight: 0.8 },
            { id: 'party', name: 'حفلة', weight: 0.9 },
            { id: 'religious', name: 'مناسبة دينية', weight: 1.0 },
            { id: 'national', name: 'مناسبة وطنية', weight: 1.0 },
            { id: 'corporate', name: 'مناسبة شركات', weight: 0.9 },
            { id: 'other', name: 'أخرى', weight: 0.7 }
        ],
        
        // أنماط التصميم
        styles: [
            { id: 'modern', name: 'عصري', weight: 1.0 },
            { id: 'classic', name: 'كلاسيكي', weight: 1.0 },
            { id: 'elegant', name: 'أنيق', weight: 1.0 },
            { id: 'minimalist', name: 'بسيط', weight: 0.9 },
            { id: 'colorful', name: 'ملون', weight: 0.9 },
            { id: 'vintage', name: 'قديم', weight: 0.8 },
            { id: 'artistic', name: 'فني', weight: 0.9 },
            { id: 'professional', name: 'احترافي', weight: 1.0 },
            { id: 'playful', name: 'مرح', weight: 0.8 },
            { id: 'formal', name: 'رسمي', weight: 1.0 }
        ],
        
        // ألوان التصميم
        colors: [
            { id: 'blue', name: 'أزرق', weight: 1.0 },
            { id: 'red', name: 'أحمر', weight: 1.0 },
            { id: 'green', name: 'أخضر', weight: 1.0 },
            { id: 'yellow', name: 'أصفر', weight: 0.9 },
            { id: 'purple', name: 'بنفسجي', weight: 0.9 },
            { id: 'pink', name: 'وردي', weight: 0.9 },
            { id: 'orange', name: 'برتقالي', weight: 0.9 },
            { id: 'black', name: 'أسود', weight: 1.0 },
            { id: 'white', name: 'أبيض', weight: 1.0 },
            { id: 'gold', name: 'ذهبي', weight: 1.0 },
            { id: 'silver', name: 'فضي', weight: 0.9 },
            { id: 'multicolor', name: 'متعدد الألوان', weight: 0.8 }
        ],
        
        // عوامل الترجيح للتوصيات
        weights: {
            userPreferences: 0.4,    // تفضيلات المستخدم
            userHistory: 0.3,        // تاريخ المستخدم
            popularity: 0.2,         // شعبية العنصر
            trending: 0.1            // الاتجاهات الحالية
        },
        
        // عدد التوصيات المعروضة
        recommendationsCount: 6,
        
        // فترة تحديث التوصيات (بالمللي ثانية)
        updateInterval: 3600000, // ساعة واحدة
        
        // ما إذا كان يجب تحديث التوصيات تلقائياً
        autoUpdateRecommendations: true,
        
        // ما إذا كان يجب تخزين بيانات التوصيات
        storeRecommendationData: true
    },
    
    // حالة المحرك
    state: {
        // ما إذا كان محرك التوصية مفعلاً
        enabled: false,
        
        // مؤقت تحديث التوصيات
        updateTimer: null,
        
        // بيانات المستخدم
        userData: {
            preferences: {},     // تفضيلات المستخدم
            history: [],         // تاريخ المستخدم
            interactions: []     // تفاعلات المستخدم
        },
        
        // بيانات العناصر
        itemsData: {
            templates: [],       // قوالب
            designs: [],         // تصاميم
            invitations: [],     // دعوات
            events: []           // مناسبات
        },
        
        // التوصيات الحالية
        currentRecommendations: [],
        
        // العناصر التي تم تحسينها
        enhancedElements: {}
    },
    
    /**
     * تهيئة محرك التوصية
     * @param {Object} options خيارات التهيئة
     */
    init: function(options = {}) {
        // دمج الخيارات مع الإعدادات الافتراضية
        this.settings = { ...this.settings, ...options };
        
        // استرجاع بيانات المستخدم المخزنة
        this.retrieveUserData();
        
        // استرجاع بيانات العناصر
        this.retrieveItemsData();
        
        // تحسين عناصر التوصيات
        this.enhanceRecommendationElements();
        
        // بدء تحديث التوصيات
        if (this.settings.autoUpdateRecommendations) {
            this.startUpdating();
        }
        
        // تفعيل محرك التوصية
        this.state.enabled = true;
        
        console.log('تم تهيئة محرك التوصية');
    },
    
    /**
     * استرجاع بيانات المستخدم المخزنة
     */
    retrieveUserData: function() {
        // التحقق من وجود بيانات المستخدم في localStorage
        const storedUserData = localStorage.getItem('recommendationUserData');
        
        if (storedUserData) {
            try {
                // تحليل بيانات المستخدم
                const parsedUserData = JSON.parse(storedUserData);
                
                // تعيين بيانات المستخدم
                this.state.userData = parsedUserData;
                
                console.log('تم استرجاع بيانات المستخدم المخزنة');
            } catch (error) {
                console.error('فشل تحليل بيانات المستخدم المخزنة:', error);
                
                // إعادة تعيين بيانات المستخدم
                this.state.userData = {
                    preferences: {},
                    history: [],
                    interactions: []
                };
            }
        } else {
            // إعادة تعيين بيانات المستخدم
            this.state.userData = {
                preferences: {},
                history: [],
                interactions: []
            };
        }
    },
    
    /**
     * استرجاع بيانات العناصر
     */
    retrieveItemsData: function() {
        // في بيئة حقيقية، هذه الدالة ستقوم بجلب بيانات العناصر من الخادم
        // لأغراض العرض، سنقوم بإنشاء بيانات عناصر عشوائية
        
        // إنشاء قوالب عشوائية
        this.state.itemsData.templates = this.generateRandomItems('template', 20);
        
        // إنشاء تصاميم عشوائية
        this.state.itemsData.designs = this.generateRandomItems('design', 30);
        
        // إنشاء دعوات عشوائية
        this.state.itemsData.invitations = this.generateRandomItems('invitation', 15);
        
        // إنشاء مناسبات عشوائية
        this.state.itemsData.events = this.generateRandomItems('event', 10);
        
        console.log('تم استرجاع بيانات العناصر');
    },
    
    /**
     * إنشاء عناصر عشوائية
     * @param {string} type نوع العنصر
     * @param {number} count عدد العناصر
     * @returns {Array} العناصر العشوائية
     */
    generateRandomItems: function(type, count) {
        // مصفوفة العناصر
        const items = [];
        
        // إنشاء العناصر
        for (let i = 0; i < count; i++) {
            // إنشاء عنصر
            const item = {
                id: `${type}-${i + 1}`,
                type: type,
                title: this.generateRandomTitle(type, i + 1),
                description: this.generateRandomDescription(type),
                thumbnail: this.generateRandomThumbnail(type, i + 1),
                category: this.getRandomArrayItem(this.settings.categories).id,
                style: this.getRandomArrayItem(this.settings.styles).id,
                colors: this.getRandomArrayItems(this.settings.colors, Math.floor(Math.random() * 3) + 1).map(color => color.id),
                popularity: Math.random(),
                trending: Math.random() > 0.7,
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
            };
            
            // إضافة العنصر إلى المصفوفة
            items.push(item);
        }
        
        return items;
    },
    
    /**
     * إنشاء عنوان عشوائي
     * @param {string} type نوع العنصر
     * @param {number} index رقم العنصر
     * @returns {string} العنوان العشوائي
     */
    generateRandomTitle: function(type, index) {
        // عناوين حسب النوع
        const titles = {
            template: [
                'قالب أنيق',
                'قالب عصري',
                'قالب كلاسيكي',
                'قالب بسيط',
                'قالب فاخر',
                'قالب احترافي',
                'قالب مميز',
                'قالب إبداعي',
                'قالب رسمي',
                'قالب مرح'
            ],
            design: [
                'تصميم أنيق',
                'تصميم عصري',
                'تصميم كلاسيكي',
                'تصميم بسيط',
                'تصميم فاخر',
                'تصميم احترافي',
                'تصميم مميز',
                'تصميم إبداعي',
                'تصميم رسمي',
                'تصميم مرح'
            ],
            invitation: [
                'دعوة أنيقة',
                'دعوة عصرية',
                'دعوة كلاسيكية',
                'دعوة بسيطة',
                'دعوة فاخرة',
                'دعوة احترافية',
                'دعوة مميزة',
                'دعوة إبداعية',
                'دعوة رسمية',
                'دعوة مرحة'
            ],
            event: [
                'مناسبة أنيقة',
                'مناسبة عصرية',
                'مناسبة كلاسيكية',
                'مناسبة بسيطة',
                'مناسبة فاخرة',
                'مناسبة احترافية',
                'مناسبة مميزة',
                'مناسبة إبداعية',
                'مناسبة رسمية',
                'مناسبة مرحة'
            ]
        };
        
        // اختيار عنوان عشوائي
        const title = this.getRandomArrayItem(titles[type]);
        
        // إرجاع العنوان مع الرقم
        return `${title} ${index}`;
    },
    
    /**
     * إنشاء وصف عشوائي
     * @param {string} type نوع العنصر
     * @returns {string} الوصف العشوائي
     */
    generateRandomDescription: function(type) {
        // أوصاف حسب النوع
        const descriptions = {
            template: [
                'قالب مميز يناسب جميع المناسبات',
                'قالب احترافي بتصميم عصري',
                'قالب أنيق بألوان متناسقة',
                'قالب بسيط وسهل التخصيص',
                'قالب فاخر للمناسبات الخاصة'
            ],
            design: [
                'تصميم مميز يناسب جميع المناسبات',
                'تصميم احترافي بمظهر عصري',
                'تصميم أنيق بألوان متناسقة',
                'تصميم بسيط وجذاب',
                'تصميم فاخر للمناسبات الخاصة'
            ],
            invitation: [
                'دعوة مميزة تناسب جميع المناسبات',
                'دعوة احترافية بتصميم عصري',
                'دعوة أنيقة بألوان متناسقة',
                'دعوة بسيطة وجذابة',
                'دعوة فاخرة للمناسبات الخاصة'
            ],
            event: [
                'مناسبة مميزة تناسب جميع الأذواق',
                'مناسبة احترافية بتنظيم عصري',
                'مناسبة أنيقة بأجواء متناسقة',
                'مناسبة بسيطة وجذابة',
                'مناسبة فاخرة للأحداث الخاصة'
            ]
        };
        
        // اختيار وصف عشوائي
        return this.getRandomArrayItem(descriptions[type]);
    },
    
    /**
     * إنشاء صورة مصغرة عشوائية
     * @param {string} type نوع العنصر
     * @param {number} index رقم العنصر
     * @returns {string} مسار الصورة المصغرة
     */
    generateRandomThumbnail: function(type, index) {
        // مسارات الصور حسب النوع
        const paths = {
            template: '/assets/images/templates',
            design: '/assets/images/designs',
            invitation: '/assets/images/invitations',
            event: '/assets/images/events'
        };
        
        // إرجاع مسار الصورة المصغرة
        return `${paths[type]}/thumbnail-${index % 10 + 1}.jpg`;
    },
    
    /**
     * اختيار عنصر عشوائي من مصفوفة
     * @param {Array} array المصفوفة
     * @returns {*} العنصر العشوائي
     */
    getRandomArrayItem: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    /**
     * اختيار عناصر عشوائية من مصفوفة
     * @param {Array} array المصفوفة
     * @param {number} count عدد العناصر
     * @returns {Array} العناصر العشوائية
     */
    getRandomArrayItems: function(array, count) {
        // نسخة من المصفوفة
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        
        // إرجاع العناصر العشوائية
        return shuffled.slice(0, count);
    },
    
    /**
     * تحسين عناصر التوصيات
     */
    enhanceRecommendationElements: function() {
        // تحديد حاويات التوصيات
        const recommendationContainers = document.querySelectorAll('[data-recommendations-container]');
        
        // تحسين حاويات التوصيات
        recommendationContainers.forEach(container => {
            // التحقق من أن الحاوية لم يتم تحسينها بالفعل
            if (container.hasAttribute('data-enhanced')) {
                return;
            }
            
            // الحصول على نوع التوصيات
            const recommendationType = container.getAttribute('data-recommendations-type') || 'all';
            
            // إنشاء عنوان التوصيات
            const recommendationsHeader = document.createElement('div');
            recommendationsHeader.className = 'recommendations-header';
            recommendationsHeader.style.display = 'flex';
            recommendationsHeader.style.justifyContent = 'space-between';
            recommendationsHeader.style.alignItems = 'center';
            recommendationsHeader.style.marginBottom = '15px';
            
            // إنشاء عنوان التوصيات
            const recommendationsTitle = document.createElement('h3');
            recommendationsTitle.className = 'recommendations-title';
            recommendationsTitle.style.margin = '0';
            recommendationsTitle.style.fontSize = '18px';
            recommendationsTitle.textContent = this.getRecommendationTypeTitle(recommendationType);
            
            // إنشاء زر تحديث التوصيات
            const refreshButton = document.createElement('button');
            refreshButton.className = 'refresh-recommendations-button';
            refreshButton.style.backgroundColor = 'transparent';
            refreshButton.style.border = 'none';
            refreshButton.style.color = '#2196F3';
            refreshButton.style.cursor = 'pointer';
            refreshButton.style.fontSize = '14px';
            refreshButton.style.display = 'flex';
            refreshButton.style.alignItems = 'center';
            refreshButton.style.gap = '5px';
            refreshButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg> تحديث';
            
            // إضافة مستمع حدث النقر
            refreshButton.addEventListener('click', () => {
                // تحديث التوصيات
                this.updateRecommendations(recommendationType);
                
                // إضافة تأثير التحديث
                refreshButton.style.pointerEvents = 'none';
                refreshButton.style.opacity = '0.5';
                
                // إعادة تفعيل الزر بعد فترة
                setTimeout(() => {
                    refreshButton.style.pointerEvents = 'auto';
                    refreshButton.style.opacity = '1';
                }, 1000);
            });
            
            // إضافة العناصر إلى عنوان التوصيات
            recommendationsHeader.appendChild(recommendationsTitle);
            recommendationsHeader.appendChild(refreshButton);
            
            // إنشاء قائمة التوصيات
            const recommendationsList = document.createElement('div');
            recommendationsList.className = 'recommendations-list';
            recommendationsList.style.display = 'grid';
            recommendationsList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
            recommendationsList.style.gap = '20px';
            
            // إضافة العناصر إلى حاوية التوصيات
            container.innerHTML = '';
            container.appendChild(recommendationsHeader);
            container.appendChild(recommendationsList);
            
            // تعيين سمة تحسين الحاوية
            container.setAttribute('data-enhanced', 'true');
            
            // تخزين الحاوية في حالة المحرك
            if (!this.state.enhancedElements.containers) {
                this.state.enhancedElements.containers = [];
            }
            
            this.state.enhancedElements.containers.push({
                container: container,
                type: recommendationType,
                list: recommendationsList,
                refreshButton: refreshButton
            });
            
            // تحديث التوصيات
            this.updateRecommendations(recommendationType);
        });
    },
    
    /**
     * الحصول على عنوان نوع التوصيات
     * @param {string} type نوع التوصيات
     * @returns {string} عنوان نوع التوصيات
     */
    getRecommendationTypeTitle: function(type) {
        // عناوين حسب النوع
        const titles = {
            all: 'توصيات مخصصة لك',
            template: 'قوالب مقترحة لك',
            design: 'تصاميم مقترحة لك',
            invitation: 'دعوات مقترحة لك',
            event: 'مناسبات مقترحة لك'
        };
        
        // إرجاع العنوان
        return titles[type] || 'توصيات مخصصة لك';
    },
    
    /**
     * بدء تحديث التوصيات
     */
    startUpdating: function() {
        // إيقاف المؤقت الحالي
        this.stopUpdating();
        
        // بدء مؤقت جديد
        this.state.updateTimer = setInterval(() => {
            this.updateAllRecommendations();
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
     * تحديث جميع التوصيات
     */
    updateAllRecommendations: function() {
        // التحقق من وجود حاويات التوصيات
        if (!this.state.enhancedElements.containers) {
            return;
        }
        
        // تحديث التوصيات لكل حاوية
        this.state.enhancedElements.containers.forEach(container => {
            this.updateRecommendations(container.type);
        });
    },
    
    /**
     * تحديث التوصيات
     * @param {string} type نوع التوصيات
     */
    updateRecommendations: function(type) {
        // الحصول على التوصيات
        const recommendations = this.getRecommendations(type);
        
        // تحديث التوصيات الحالية
        this.state.currentRecommendations = recommendations;
        
        // تحديث قائمة التوصيات
        this.updateRecommendationsList(type, recommendations);
    },
    
    /**
     * الحصول على التوصيات
     * @param {string} type نوع التوصيات
     * @returns {Array} التوصيات
     */
    getRecommendations: function(type) {
        // الحصول على العناصر حسب النوع
        let items = [];
        
        if (type === 'all') {
            // جمع جميع العناصر
            items = [
                ...this.state.itemsData.templates,
                ...this.state.itemsData.designs,
                ...this.state.itemsData.invitations,
                ...this.state.itemsData.events
            ];
        } else {
            // الحصول على العناصر حسب النوع
            switch (type) {
                case 'template':
                    items = this.state.itemsData.templates;
                    break;
                
                case 'design':
                    items = this.state.itemsData.designs;
                    break;
                
                case 'invitation':
                    items = this.state.itemsData.invitations;
                    break;
                
                case 'event':
                    items = this.state.itemsData.events;
                    break;
                
                default:
                    items = [
                        ...this.state.itemsData.templates,
                        ...this.state.itemsData.designs,
                        ...this.state.itemsData.invitations,
                        ...this.state.itemsData.events
                    ];
                    break;
            }
        }
        
        // حساب درجة التوصية لكل عنصر
        const scoredItems = items.map(item => {
            // حساب درجة التوصية
            const score = this.calculateRecommendationScore(item);
            
            // إرجاع العنصر مع درجة التوصية
            return {
                ...item,
                score: score
            };
        });
        
        // ترتيب العناصر حسب درجة التوصية
        scoredItems.sort((a, b) => b.score - a.score);
        
        // إرجاع العناصر المرتبة
        return scoredItems.slice(0, this.settings.recommendationsCount);
    },
    
    /**
     * حساب درجة التوصية
     * @param {Object} item العنصر
     * @returns {number} درجة التوصية
     */
    calculateRecommendationScore: function(item) {
        // درجة التوصية
        let score = 0;
        
        // حساب درجة تفضيلات المستخدم
        const preferenceScore = this.calculatePreferenceScore(item);
        
        // حساب درجة تاريخ المستخدم
        const historyScore = this.calculateHistoryScore(item);
        
        // حساب درجة شعبية العنصر
        const popularityScore = item.popularity || 0;
        
        // حساب درجة الاتجاهات الحالية
        const trendingScore = item.trending ? 1 : 0;
        
        // حساب درجة التوصية الإجمالية
        score = (
            preferenceScore * this.settings.weights.userPreferences +
            historyScore * this.settings.weights.userHistory +
            popularityScore * this.settings.weights.popularity +
            trendingScore * this.settings.weights.trending
        );
        
        return score;
    },
    
    /**
     * حساب درجة تفضيلات المستخدم
     * @param {Object} item العنصر
     * @returns {number} درجة تفضيلات المستخدم
     */
    calculatePreferenceScore: function(item) {
        // درجة تفضيلات المستخدم
        let score = 0;
        
        // التحقق من وجود تفضيلات المستخدم
        if (Object.keys(this.state.userData.preferences).length === 0) {
            // إرجاع درجة افتراضية
            return 0.5;
        }
        
        // حساب درجة تفضيلات الفئة
        if (this.state.userData.preferences.categories && item.category) {
            // التحقق من وجود الفئة في تفضيلات المستخدم
            if (this.state.userData.preferences.categories.includes(item.category)) {
                // زيادة الدرجة
                score += 0.3;
            }
        }
        
        // حساب درجة تفضيلات النمط
        if (this.state.userData.preferences.styles && item.style) {
            // التحقق من وجود النمط في تفضيلات المستخدم
            if (this.state.userData.preferences.styles.includes(item.style)) {
                // زيادة الدرجة
                score += 0.3;
            }
        }
        
        // حساب درجة تفضيلات الألوان
        if (this.state.userData.preferences.colors && item.colors) {
            // التحقق من وجود الألوان في تفضيلات المستخدم
            const matchingColors = item.colors.filter(color => this.state.userData.preferences.colors.includes(color));
            
            // زيادة الدرجة حسب عدد الألوان المتطابقة
            score += 0.2 * (matchingColors.length / item.colors.length);
        }
        
        // حساب درجة تفضيلات النوع
        if (this.state.userData.preferences.types && item.type) {
            // التحقق من وجود النوع في تفضيلات المستخدم
            if (this.state.userData.preferences.types.includes(item.type)) {
                // زيادة الدرجة
                score += 0.2;
            }
        }
        
        // تطبيع الدرجة
        score = Math.min(1, score);
        
        return score;
    },
    
    /**
     * حساب درجة تاريخ المستخدم
     * @param {Object} item العنصر
     * @returns {number} درجة تاريخ المستخدم
     */
    calculateHistoryScore: function(item) {
        // درجة تاريخ المستخدم
        let score = 0;
        
        // التحقق من وجود تاريخ المستخدم
        if (this.state.userData.history.length === 0) {
            // إرجاع درجة افتراضية
            return 0.5;
        }
        
        // حساب درجة تاريخ الفئة
        const categoryCounts = {};
        this.state.userData.history.forEach(historyItem => {
            if (historyItem.category) {
                categoryCounts[historyItem.category] = (categoryCounts[historyItem.category] || 0) + 1;
            }
        });
        
        // التحقق من وجود الفئة في تاريخ المستخدم
        if (item.category && categoryCounts[item.category]) {
            // زيادة الدرجة حسب عدد مرات ظهور الفئة في التاريخ
            score += 0.3 * Math.min(1, categoryCounts[item.category] / 5);
        }
        
        // حساب درجة تاريخ النمط
        const styleCounts = {};
        this.state.userData.history.forEach(historyItem => {
            if (historyItem.style) {
                styleCounts[historyItem.style] = (styleCounts[historyItem.style] || 0) + 1;
            }
        });
        
        // التحقق من وجود النمط في تاريخ المستخدم
        if (item.style && styleCounts[item.style]) {
            // زيادة الدرجة حسب عدد مرات ظهور النمط في التاريخ
            score += 0.3 * Math.min(1, styleCounts[item.style] / 5);
        }
        
        // حساب درجة تاريخ الألوان
        const colorCounts = {};
        this.state.userData.history.forEach(historyItem => {
            if (historyItem.colors) {
                historyItem.colors.forEach(color => {
                    colorCounts[color] = (colorCounts[color] || 0) + 1;
                });
            }
        });
        
        // التحقق من وجود الألوان في تاريخ المستخدم
        if (item.colors) {
            // حساب متوسط عدد مرات ظهور الألوان في التاريخ
            let colorScore = 0;
            item.colors.forEach(color => {
                if (colorCounts[color]) {
                    colorScore += Math.min(1, colorCounts[color] / 5);
                }
            });
            
            // زيادة الدرجة حسب متوسط عدد مرات ظهور الألوان في التاريخ
            score += 0.2 * (colorScore / item.colors.length);
        }
        
        // حساب درجة تاريخ النوع
        const typeCounts = {};
        this.state.userData.history.forEach(historyItem => {
            if (historyItem.type) {
                typeCounts[historyItem.type] = (typeCounts[historyItem.type] || 0) + 1;
            }
        });
        
        // التحقق من وجود النوع في تاريخ المستخدم
        if (item.type && typeCounts[item.type]) {
            // زيادة الدرجة حسب عدد مرات ظهور النوع في التاريخ
            score += 0.2 * Math.min(1, typeCounts[item.type] / 5);
        }
        
        // تطبيع الدرجة
        score = Math.min(1, score);
        
        return score;
    },
    
    /**
     * تحديث قائمة التوصيات
     * @param {string} type نوع التوصيات
     * @param {Array} recommendations التوصيات
     */
    updateRecommendationsList: function(type, recommendations) {
        // التحقق من وجود حاويات التوصيات
        if (!this.state.enhancedElements.containers) {
            return;
        }
        
        // البحث عن حاوية التوصيات المناسبة
        const container = this.state.enhancedElements.containers.find(c => c.type === type);
        
        // التحقق من وجود حاوية التوصيات
        if (!container) {
            return;
        }
        
        // الحصول على قائمة التوصيات
        const recommendationsList = container.list;
        
        // إزالة جميع العناصر من قائمة التوصيات
        recommendationsList.innerHTML = '';
        
        // التحقق من وجود توصيات
        if (recommendations.length === 0) {
            // إنشاء عنصر لا توجد توصيات
            const noRecommendationsItem = document.createElement('div');
            noRecommendationsItem.className = 'no-recommendations';
            noRecommendationsItem.style.gridColumn = '1 / -1';
            noRecommendationsItem.style.padding = '20px';
            noRecommendationsItem.style.textAlign = 'center';
            noRecommendationsItem.style.color = '#666';
            noRecommendationsItem.textContent = 'لا توجد توصيات متاحة';
            
            // إضافة العنصر إلى قائمة التوصيات
            recommendationsList.appendChild(noRecommendationsItem);
        } else {
            // إضافة كل توصية إلى قائمة التوصيات
            recommendations.forEach(recommendation => {
                // إنشاء عنصر التوصية
                const recommendationItem = document.createElement('div');
                recommendationItem.className = `recommendation-item recommendation-${recommendation.type}`;
                recommendationItem.setAttribute('data-recommendation-id', recommendation.id);
                recommendationItem.style.borderRadius = '8px';
                recommendationItem.style.overflow = 'hidden';
                recommendationItem.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                recommendationItem.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                recommendationItem.style.cursor = 'pointer';
                
                // إضافة تأثير التحويم
                recommendationItem.addEventListener('mouseenter', () => {
                    recommendationItem.style.transform = 'translateY(-5px)';
                    recommendationItem.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
                });
                
                recommendationItem.addEventListener('mouseleave', () => {
                    recommendationItem.style.transform = 'translateY(0)';
                    recommendationItem.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                });
                
                // إضافة مستمع حدث النقر
                recommendationItem.addEventListener('click', () => {
                    // تسجيل التفاعل
                    this.recordInteraction(recommendation.id, 'click');
                    
                    // إضافة العنصر إلى تاريخ المستخدم
                    this.addToHistory(recommendation);
                    
                    // فتح رابط العنصر
                    window.location.href = this.getItemUrl(recommendation);
                });
                
                // إنشاء صورة التوصية
                const recommendationImage = document.createElement('div');
                recommendationImage.className = 'recommendation-image';
                recommendationImage.style.height = '150px';
                recommendationImage.style.backgroundImage = `url(${recommendation.thumbnail})`;
                recommendationImage.style.backgroundSize = 'cover';
                recommendationImage.style.backgroundPosition = 'center';
                recommendationImage.style.position = 'relative';
                
                // إنشاء شارة نوع التوصية
                const recommendationTypeBadge = document.createElement('div');
                recommendationTypeBadge.className = 'recommendation-type-badge';
                recommendationTypeBadge.style.position = 'absolute';
                recommendationTypeBadge.style.top = '10px';
                recommendationTypeBadge.style.right = '10px';
                recommendationTypeBadge.style.backgroundColor = this.getItemTypeColor(recommendation.type);
                recommendationTypeBadge.style.color = '#fff';
                recommendationTypeBadge.style.padding = '3px 8px';
                recommendationTypeBadge.style.borderRadius = '4px';
                recommendationTypeBadge.style.fontSize = '12px';
                recommendationTypeBadge.textContent = this.getItemTypeName(recommendation.type);
                
                // إضافة شارة نوع التوصية إلى صورة التوصية
                recommendationImage.appendChild(recommendationTypeBadge);
                
                // إنشاء محتوى التوصية
                const recommendationContent = document.createElement('div');
                recommendationContent.className = 'recommendation-content';
                recommendationContent.style.padding = '15px';
                
                // إنشاء عنوان التوصية
                const recommendationTitle = document.createElement('h4');
                recommendationTitle.className = 'recommendation-title';
                recommendationTitle.style.margin = '0 0 10px 0';
                recommendationTitle.style.fontSize = '16px';
                recommendationTitle.style.fontWeight = 'bold';
                recommendationTitle.style.color = '#333';
                recommendationTitle.textContent = recommendation.title;
                
                // إنشاء وصف التوصية
                const recommendationDescription = document.createElement('p');
                recommendationDescription.className = 'recommendation-description';
                recommendationDescription.style.margin = '0 0 10px 0';
                recommendationDescription.style.fontSize = '14px';
                recommendationDescription.style.color = '#666';
                recommendationDescription.style.lineHeight = '1.4';
                recommendationDescription.style.height = '40px';
                recommendationDescription.style.overflow = 'hidden';
                recommendationDescription.style.textOverflow = 'ellipsis';
                recommendationDescription.style.display = '-webkit-box';
                recommendationDescription.style.webkitLineClamp = '2';
                recommendationDescription.style.webkitBoxOrient = 'vertical';
                recommendationDescription.textContent = recommendation.description;
                
                // إنشاء تفاصيل التوصية
                const recommendationDetails = document.createElement('div');
                recommendationDetails.className = 'recommendation-details';
                recommendationDetails.style.display = 'flex';
                recommendationDetails.style.justifyContent = 'space-between';
                recommendationDetails.style.alignItems = 'center';
                
                // إنشاء فئة التوصية
                const recommendationCategory = document.createElement('span');
                recommendationCategory.className = 'recommendation-category';
                recommendationCategory.style.fontSize = '12px';
                recommendationCategory.style.color = '#999';
                recommendationCategory.textContent = this.getCategoryName(recommendation.category);
                
                // إنشاء زر استخدام التوصية
                const useButton = document.createElement('button');
                useButton.className = 'use-recommendation-button';
                useButton.style.backgroundColor = '#2196F3';
                useButton.style.color = '#fff';
                useButton.style.border = 'none';
                useButton.style.borderRadius = '4px';
                useButton.style.padding = '5px 10px';
                useButton.style.fontSize = '12px';
                useButton.style.cursor = 'pointer';
                useButton.style.transition = 'background-color 0.3s ease';
                useButton.textContent = 'استخدام';
                
                // إضافة تأثير التحويم
                useButton.addEventListener('mouseenter', () => {
                    useButton.style.backgroundColor = '#1976D2';
                });
                
                useButton.addEventListener('mouseleave', () => {
                    useButton.style.backgroundColor = '#2196F3';
                });
                
                // إضافة مستمع حدث النقر
                useButton.addEventListener('click', event => {
                    // منع انتشار الحدث
                    event.stopPropagation();
                    
                    // تسجيل التفاعل
                    this.recordInteraction(recommendation.id, 'use');
                    
                    // إضافة العنصر إلى تاريخ المستخدم
                    this.addToHistory(recommendation);
                    
                    // فتح رابط استخدام العنصر
                    window.location.href = this.getItemUseUrl(recommendation);
                });
                
                // إضافة العناصر إلى تفاصيل التوصية
                recommendationDetails.appendChild(recommendationCategory);
                recommendationDetails.appendChild(useButton);
                
                // إضافة العناصر إلى محتوى التوصية
                recommendationContent.appendChild(recommendationTitle);
                recommendationContent.appendChild(recommendationDescription);
                recommendationContent.appendChild(recommendationDetails);
                
                // إضافة العناصر إلى عنصر التوصية
                recommendationItem.appendChild(recommendationImage);
                recommendationItem.appendChild(recommendationContent);
                
                // إضافة عنصر التوصية إلى قائمة التوصيات
                recommendationsList.appendChild(recommendationItem);
                
                // تسجيل التفاعل
                this.recordInteraction(recommendation.id, 'impression');
            });
        }
    },
    
    /**
     * الحصول على اسم نوع العنصر
     * @param {string} type نوع العنصر
     * @returns {string} اسم نوع العنصر
     */
    getItemTypeName: function(type) {
        // أسماء حسب النوع
        const names = {
            template: 'قالب',
            design: 'تصميم',
            invitation: 'دعوة',
            event: 'مناسبة'
        };
        
        // إرجاع الاسم
        return names[type] || 'عنصر';
    },
    
    /**
     * الحصول على لون نوع العنصر
     * @param {string} type نوع العنصر
     * @returns {string} لون نوع العنصر
     */
    getItemTypeColor: function(type) {
        // ألوان حسب النوع
        const colors = {
            template: '#2196F3',
            design: '#4CAF50',
            invitation: '#FF9800',
            event: '#9C27B0'
        };
        
        // إرجاع اللون
        return colors[type] || '#2196F3';
    },
    
    /**
     * الحصول على اسم الفئة
     * @param {string} category الفئة
     * @returns {string} اسم الفئة
     */
    getCategoryName: function(category) {
        // البحث عن الفئة
        const categoryObj = this.settings.categories.find(c => c.id === category);
        
        // إرجاع اسم الفئة
        return categoryObj ? categoryObj.name : 'أخرى';
    },
    
    /**
     * الحصول على رابط العنصر
     * @param {Object} item العنصر
     * @returns {string} رابط العنصر
     */
    getItemUrl: function(item) {
        // روابط حسب النوع
        const urls = {
            template: `/templates/view.html?id=${item.id}`,
            design: `/designs/view.html?id=${item.id}`,
            invitation: `/invitations/view.html?id=${item.id}`,
            event: `/events/view.html?id=${item.id}`
        };
        
        // إرجاع الرابط
        return urls[item.type] || '#';
    },
    
    /**
     * الحصول على رابط استخدام العنصر
     * @param {Object} item العنصر
     * @returns {string} رابط استخدام العنصر
     */
    getItemUseUrl: function(item) {
        // روابط حسب النوع
        const urls = {
            template: `/templates/use.html?id=${item.id}`,
            design: `/designs/use.html?id=${item.id}`,
            invitation: `/invitations/use.html?id=${item.id}`,
            event: `/events/use.html?id=${item.id}`
        };
        
        // إرجاع الرابط
        return urls[item.type] || '#';
    },
    
    /**
     * تسجيل تفاعل
     * @param {string} itemId معرف العنصر
     * @param {string} type نوع التفاعل
     */
    recordInteraction: function(itemId, type) {
        // إنشاء التفاعل
        const interaction = {
            itemId: itemId,
            type: type,
            timestamp: new Date()
        };
        
        // إضافة التفاعل إلى تفاعلات المستخدم
        this.state.userData.interactions.push(interaction);
        
        // تخزين بيانات المستخدم
        if (this.settings.storeRecommendationData) {
            this.storeUserData();
        }
        
        console.log(`تم تسجيل تفاعل: ${type} للعنصر ${itemId}`);
    },
    
    /**
     * إضافة عنصر إلى تاريخ المستخدم
     * @param {Object} item العنصر
     */
    addToHistory: function(item) {
        // التحقق من وجود العنصر في التاريخ
        const existingIndex = this.state.userData.history.findIndex(historyItem => historyItem.id === item.id);
        
        // إزالة العنصر من التاريخ إذا كان موجوداً
        if (existingIndex !== -1) {
            this.state.userData.history.splice(existingIndex, 1);
        }
        
        // إضافة العنصر إلى بداية التاريخ
        this.state.userData.history.unshift({
            id: item.id,
            type: item.type,
            category: item.category,
            style: item.style,
            colors: item.colors,
            timestamp: new Date()
        });
        
        // التحقق من طول التاريخ
        if (this.state.userData.history.length > 50) {
            // إزالة أقدم عنصر
            this.state.userData.history.pop();
        }
        
        // تخزين بيانات المستخدم
        if (this.settings.storeRecommendationData) {
            this.storeUserData();
        }
        
        console.log(`تم إضافة العنصر ${item.id} إلى التاريخ`);
    },
    
    /**
     * تعيين تفضيلات المستخدم
     * @param {Object} preferences تفضيلات المستخدم
     */
    setUserPreferences: function(preferences) {
        // تعيين تفضيلات المستخدم
        this.state.userData.preferences = preferences;
        
        // تخزين بيانات المستخدم
        if (this.settings.storeRecommendationData) {
            this.storeUserData();
        }
        
        // تحديث التوصيات
        this.updateAllRecommendations();
        
        console.log('تم تعيين تفضيلات المستخدم');
    },
    
    /**
     * تخزين بيانات المستخدم
     */
    storeUserData: function() {
        // تخزين بيانات المستخدم في localStorage
        localStorage.setItem('recommendationUserData', JSON.stringify(this.state.userData));
        
        console.log('تم تخزين بيانات المستخدم');
    },
    
    /**
     * إنشاء نموذج تفضيلات المستخدم
     * @param {HTMLElement} container حاوية النموذج
     */
    createPreferencesForm: function(container) {
        // التحقق من وجود الحاوية
        if (!container) {
            return;
        }
        
        // إنشاء نموذج التفضيلات
        const form = document.createElement('form');
        form.className = 'preferences-form';
        form.style.padding = '20px';
        form.style.backgroundColor = '#f9f9f9';
        form.style.borderRadius = '8px';
        form.style.marginBottom = '20px';
        
        // إنشاء عنوان النموذج
        const formTitle = document.createElement('h3');
        formTitle.className = 'preferences-form-title';
        formTitle.style.margin = '0 0 20px 0';
        formTitle.style.fontSize = '18px';
        formTitle.textContent = 'تخصيص التوصيات';
        
        // إضافة العنوان إلى النموذج
        form.appendChild(formTitle);
        
        // إنشاء أقسام النموذج
        const sections = [
            {
                id: 'types',
                title: 'أنواع العناصر',
                items: this.settings.itemTypes,
                multiple: true
            },
            {
                id: 'categories',
                title: 'الفئات',
                items: this.settings.categories,
                multiple: true
            },
            {
                id: 'styles',
                title: 'أنماط التصميم',
                items: this.settings.styles,
                multiple: true
            },
            {
                id: 'colors',
                title: 'الألوان',
                items: this.settings.colors,
                multiple: true
            }
        ];
        
        // إضافة كل قسم إلى النموذج
        sections.forEach(section => {
            // إنشاء قسم
            const sectionElement = document.createElement('div');
            sectionElement.className = `preferences-section preferences-${section.id}`;
            sectionElement.style.marginBottom = '20px';
            
            // إنشاء عنوان القسم
            const sectionTitle = document.createElement('h4');
            sectionTitle.className = 'preferences-section-title';
            sectionTitle.style.margin = '0 0 10px 0';
            sectionTitle.style.fontSize = '16px';
            sectionTitle.textContent = section.title;
            
            // إضافة العنوان إلى القسم
            sectionElement.appendChild(sectionTitle);
            
            // إنشاء حاوية العناصر
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'preferences-items';
            itemsContainer.style.display = 'flex';
            itemsContainer.style.flexWrap = 'wrap';
            itemsContainer.style.gap = '10px';
            
            // إضافة كل عنصر إلى حاوية العناصر
            section.items.forEach(item => {
                // إنشاء عنصر
                const itemElement = document.createElement('label');
                itemElement.className = 'preferences-item';
                itemElement.style.display = 'flex';
                itemElement.style.alignItems = 'center';
                itemElement.style.gap = '5px';
                itemElement.style.padding = '5px 10px';
                itemElement.style.backgroundColor = '#fff';
                itemElement.style.borderRadius = '4px';
                itemElement.style.border = '1px solid #ddd';
                itemElement.style.cursor = 'pointer';
                
                // إنشاء مدخل الاختيار
                const input = document.createElement('input');
                input.type = section.multiple ? 'checkbox' : 'radio';
                input.name = section.id;
                input.value = item.id;
                input.style.margin = '0';
                
                // التحقق من حالة الاختيار
                if (this.state.userData.preferences[section.id]) {
                    if (section.multiple) {
                        input.checked = this.state.userData.preferences[section.id].includes(item.id);
                    } else {
                        input.checked = this.state.userData.preferences[section.id] === item.id;
                    }
                }
                
                // إضافة مستمع حدث التغيير
                input.addEventListener('change', () => {
                    // تحديث تفضيلات المستخدم
                    this.updatePreferencesFromForm(form);
                });
                
                // إنشاء نص العنصر
                const itemText = document.createElement('span');
                itemText.textContent = item.name;
                
                // إضافة العناصر إلى عنصر التفضيلات
                itemElement.appendChild(input);
                itemElement.appendChild(itemText);
                
                // إضافة عنصر التفضيلات إلى حاوية العناصر
                itemsContainer.appendChild(itemElement);
            });
            
            // إضافة حاوية العناصر إلى القسم
            sectionElement.appendChild(itemsContainer);
            
            // إضافة القسم إلى النموذج
            form.appendChild(sectionElement);
        });
        
        // إنشاء أزرار النموذج
        const formButtons = document.createElement('div');
        formButtons.className = 'preferences-form-buttons';
        formButtons.style.display = 'flex';
        formButtons.style.justifyContent = 'space-between';
        formButtons.style.marginTop = '20px';
        
        // إنشاء زر إعادة تعيين
        const resetButton = document.createElement('button');
        resetButton.type = 'button';
        resetButton.className = 'preferences-reset-button';
        resetButton.style.backgroundColor = '#f44336';
        resetButton.style.color = '#fff';
        resetButton.style.border = 'none';
        resetButton.style.borderRadius = '4px';
        resetButton.style.padding = '8px 16px';
        resetButton.style.fontSize = '14px';
        resetButton.style.cursor = 'pointer';
        resetButton.textContent = 'إعادة تعيين';
        
        // إضافة مستمع حدث النقر
        resetButton.addEventListener('click', () => {
            // إعادة تعيين النموذج
            form.reset();
            
            // إعادة تعيين تفضيلات المستخدم
            this.setUserPreferences({});
            
            // تحديث التوصيات
            this.updateAllRecommendations();
        });
        
        // إنشاء زر حفظ
        const saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.className = 'preferences-save-button';
        saveButton.style.backgroundColor = '#4caf50';
        saveButton.style.color = '#fff';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.padding = '8px 16px';
        saveButton.style.fontSize = '14px';
        saveButton.style.cursor = 'pointer';
        saveButton.textContent = 'حفظ';
        
        // إضافة مستمع حدث النقر
        saveButton.addEventListener('click', () => {
            // تحديث تفضيلات المستخدم
            this.updatePreferencesFromForm(form);
            
            // تحديث التوصيات
            this.updateAllRecommendations();
            
            // عرض رسالة نجاح
            alert('تم حفظ تفضيلاتك بنجاح');
        });
        
        // إضافة الأزرار إلى أزرار النموذج
        formButtons.appendChild(resetButton);
        formButtons.appendChild(saveButton);
        
        // إضافة أزرار النموذج إلى النموذج
        form.appendChild(formButtons);
        
        // إضافة النموذج إلى الحاوية
        container.innerHTML = '';
        container.appendChild(form);
    },
    
    /**
     * تحديث تفضيلات المستخدم من النموذج
     * @param {HTMLFormElement} form نموذج التفضيلات
     */
    updatePreferencesFromForm: function(form) {
        // تفضيلات المستخدم
        const preferences = {};
        
        // تحديث تفضيلات أنواع العناصر
        const typeInputs = form.querySelectorAll('input[name="types"]:checked');
        preferences.types = Array.from(typeInputs).map(input => input.value);
        
        // تحديث تفضيلات الفئات
        const categoryInputs = form.querySelectorAll('input[name="categories"]:checked');
        preferences.categories = Array.from(categoryInputs).map(input => input.value);
        
        // تحديث تفضيلات أنماط التصميم
        const styleInputs = form.querySelectorAll('input[name="styles"]:checked');
        preferences.styles = Array.from(styleInputs).map(input => input.value);
        
        // تحديث تفضيلات الألوان
        const colorInputs = form.querySelectorAll('input[name="colors"]:checked');
        preferences.colors = Array.from(colorInputs).map(input => input.value);
        
        // تعيين تفضيلات المستخدم
        this.setUserPreferences(preferences);
    }
};

// تهيئة محرك التوصية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة محرك التوصية
    RecommendationEngine.init();
    
    // تحسين عناصر التوصيات
    RecommendationEngine.enhanceRecommendationElements();
    
    // إنشاء نموذج تفضيلات المستخدم
    const preferencesContainer = document.querySelector('[data-preferences-container]');
    if (preferencesContainer) {
        RecommendationEngine.createPreferencesForm(preferencesContainer);
    }
    
    console.log('تم تهيئة محرك التوصية');
});

// تصدير كائن RecommendationEngine للاستخدام في ملفات أخرى
window.RecommendationEngine = RecommendationEngine;
