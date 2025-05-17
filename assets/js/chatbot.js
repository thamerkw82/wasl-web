/**
 * نظام الدردشة الآلية
 * يوفر واجهة دردشة تفاعلية للمستخدمين للحصول على مساعدة فورية
 * مع دعم الأسئلة الشائعة والتحويل إلى الدعم البشري عند الحاجة
 */

document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نظام الدردشة الآلية
    initChatbot();
});

/**
 * تهيئة نظام الدردشة الآلية
 */
function initChatbot() {
    console.log('تهيئة نظام الدردشة الآلية...');
    
    // إنشاء عناصر واجهة الدردشة
    createChatInterface();
    
    // تحميل قاعدة المعرفة
    loadKnowledgeBase();
    
    // تهيئة معالج الرسائل
    initMessageHandler();
}

/**
 * إنشاء واجهة الدردشة
 */
function createChatInterface() {
    // التحقق من وجود واجهة الدردشة
    if (document.getElementById('chatbot-container')) {
        return;
    }
    
    // إنشاء حاوية الدردشة
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    chatbotContainer.className = 'chatbot-container';
    
    // إنشاء زر فتح الدردشة
    const chatButton = document.createElement('button');
    chatButton.id = 'chat-button';
    chatButton.className = 'chat-button';
    chatButton.innerHTML = '<i class="fas fa-comments"></i>';
    chatButton.setAttribute('aria-label', 'فتح الدردشة');
    
    // إنشاء نافذة الدردشة
    const chatWindow = document.createElement('div');
    chatWindow.id = 'chat-window';
    chatWindow.className = 'chat-window';
    chatWindow.style.display = 'none';
    
    // إنشاء رأس نافذة الدردشة
    const chatHeader = document.createElement('div');
    chatHeader.className = 'chat-header';
    chatHeader.innerHTML = `
        <div class="chat-title">
            <i class="fas fa-robot"></i>
            <span>المساعد الآلي</span>
        </div>
        <div class="chat-controls">
            <button id="minimize-chat" class="chat-control-button" aria-label="تصغير">
                <i class="fas fa-minus"></i>
            </button>
            <button id="close-chat" class="chat-control-button" aria-label="إغلاق">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // إنشاء محتوى نافذة الدردشة
    const chatContent = document.createElement('div');
    chatContent.id = 'chat-content';
    chatContent.className = 'chat-content';
    
    // إنشاء منطقة الرسائل
    const chatMessages = document.createElement('div');
    chatMessages.id = 'chat-messages';
    chatMessages.className = 'chat-messages';
    
    // إضافة رسالة الترحيب
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'chat-message bot-message';
    welcomeMessage.innerHTML = `
        <div class="message-content">
            <p>مرحباً بك! أنا المساعد الآلي الخاص بمنصة الدعوات الإلكترونية. كيف يمكنني مساعدتك اليوم؟</p>
            <div class="quick-replies">
                <button class="quick-reply-button" data-query="كيف يمكنني إنشاء دعوة جديدة؟">كيف يمكنني إنشاء دعوة جديدة؟</button>
                <button class="quick-reply-button" data-query="كيف يمكنني تعديل دعوة موجودة؟">كيف يمكنني تعديل دعوة موجودة؟</button>
                <button class="quick-reply-button" data-query="كيف يمكنني إدارة قائمة المدعوين؟">كيف يمكنني إدارة قائمة المدعوين؟</button>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(welcomeMessage);
    
    // إنشاء منطقة إدخال الرسائل
    const chatInput = document.createElement('div');
    chatInput.className = 'chat-input';
    chatInput.innerHTML = `
        <input type="text" id="user-message" placeholder="اكتب رسالتك هنا..." aria-label="رسالتك">
        <button id="send-message" aria-label="إرسال">
            <i class="fas fa-paper-plane"></i>
        </button>
    `;
    
    // تجميع واجهة الدردشة
    chatContent.appendChild(chatMessages);
    chatWindow.appendChild(chatHeader);
    chatWindow.appendChild(chatContent);
    chatWindow.appendChild(chatInput);
    
    chatbotContainer.appendChild(chatButton);
    chatbotContainer.appendChild(chatWindow);
    
    // إضافة واجهة الدردشة إلى الصفحة
    document.body.appendChild(chatbotContainer);
    
    // إضافة أنماط CSS
    addChatbotStyles();
    
    // إضافة أحداث واجهة الدردشة
    addChatInterfaceEvents();
}

/**
 * إضافة أنماط CSS للدردشة
 */
function addChatbotStyles() {
    // التحقق من وجود الأنماط
    if (document.getElementById('chatbot-styles')) {
        return;
    }
    
    // إنشاء عنصر الأنماط
    const styles = document.createElement('style');
    styles.id = 'chatbot-styles';
    styles.textContent = `
        .chatbot-container {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 1000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            direction: rtl;
        }
        
        .chat-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #4a6cf7;
            color: white;
            border: none;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .chat-button:hover {
            background-color: #3a5ce5;
            transform: scale(1.05);
        }
        
        .chat-window {
            position: absolute;
            bottom: 80px;
            left: 0;
            width: 350px;
            height: 500px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .chat-header {
            background-color: #4a6cf7;
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .chat-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: bold;
        }
        
        .chat-controls {
            display: flex;
            gap: 5px;
        }
        
        .chat-control-button {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 16px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.3s ease;
        }
        
        .chat-control-button:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        .chat-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .chat-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .chat-message {
            max-width: 80%;
            padding: 10px 15px;
            border-radius: 15px;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .bot-message {
            align-self: flex-start;
            background-color: #f0f2f5;
            color: #333;
        }
        
        .user-message {
            align-self: flex-end;
            background-color: #4a6cf7;
            color: white;
        }
        
        .message-content p {
            margin: 0;
            line-height: 1.5;
        }
        
        .quick-replies {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 10px;
        }
        
        .quick-reply-button {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 15px;
            padding: 5px 10px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .quick-reply-button:hover {
            background-color: #f5f5f5;
            border-color: #bbb;
        }
        
        .chat-input {
            padding: 15px;
            display: flex;
            gap: 10px;
            border-top: 1px solid #eee;
        }
        
        .chat-input input {
            flex: 1;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 20px;
            outline: none;
            font-size: 14px;
        }
        
        .chat-input input:focus {
            border-color: #4a6cf7;
        }
        
        .chat-input button {
            background-color: #4a6cf7;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .chat-input button:hover {
            background-color: #3a5ce5;
            transform: scale(1.05);
        }
        
        .typing-indicator {
            display: flex;
            gap: 3px;
            padding: 10px 15px;
            align-self: flex-start;
            background-color: #f0f2f5;
            border-radius: 15px;
        }
        
        .typing-indicator span {
            width: 8px;
            height: 8px;
            background-color: #999;
            border-radius: 50%;
            display: inline-block;
            animation: typing 1s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(1) {
            animation-delay: 0s;
        }
        
        .typing-indicator span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typing {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        
        .human-support-button {
            text-align: center;
            margin-top: 10px;
        }
        
        .human-support-button button {
            background-color: #f0f2f5;
            border: 1px solid #ddd;
            border-radius: 15px;
            padding: 8px 15px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .human-support-button button:hover {
            background-color: #e5e7eb;
            border-color: #bbb;
        }
        
        @media (max-width: 480px) {
            .chat-window {
                width: 300px;
                height: 450px;
                bottom: 70px;
            }
        }
    `;
    
    // إضافة الأنماط إلى الصفحة
    document.head.appendChild(styles);
}

/**
 * إضافة أحداث واجهة الدردشة
 */
function addChatInterfaceEvents() {
    // زر فتح الدردشة
    const chatButton = document.getElementById('chat-button');
    const chatWindow = document.getElementById('chat-window');
    
    chatButton.addEventListener('click', function() {
        chatWindow.style.display = 'flex';
        chatButton.style.display = 'none';
        document.getElementById('user-message').focus();
    });
    
    // زر تصغير الدردشة
    const minimizeButton = document.getElementById('minimize-chat');
    
    minimizeButton.addEventListener('click', function() {
        chatWindow.style.display = 'none';
        chatButton.style.display = 'flex';
    });
    
    // زر إغلاق الدردشة
    const closeButton = document.getElementById('close-chat');
    
    closeButton.addEventListener('click', function() {
        chatWindow.style.display = 'none';
        chatButton.style.display = 'flex';
    });
    
    // زر إرسال الرسالة
    const sendButton = document.getElementById('send-message');
    const userMessageInput = document.getElementById('user-message');
    
    sendButton.addEventListener('click', function() {
        sendUserMessage();
    });
    
    // إرسال الرسالة عند الضغط على Enter
    userMessageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendUserMessage();
        }
    });
    
    // أزرار الردود السريعة
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('quick-reply-button')) {
            const query = event.target.getAttribute('data-query');
            userMessageInput.value = query;
            sendUserMessage();
        }
    });
}

/**
 * إرسال رسالة المستخدم
 */
function sendUserMessage() {
    const userMessageInput = document.getElementById('user-message');
    const userMessage = userMessageInput.value.trim();
    
    if (userMessage === '') {
        return;
    }
    
    // إضافة رسالة المستخدم إلى المحادثة
    addUserMessage(userMessage);
    
    // مسح حقل الإدخال
    userMessageInput.value = '';
    
    // إظهار مؤشر الكتابة
    showTypingIndicator();
    
    // معالجة رسالة المستخدم والرد عليها
    setTimeout(function() {
        processUserMessage(userMessage);
    }, 1000);
}

/**
 * إضافة رسالة المستخدم إلى المحادثة
 * @param {string} message - نص الرسالة
 */
function addUserMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message user-message';
    messageElement.innerHTML = `
        <div class="message-content">
            <p>${escapeHTML(message)}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageElement);
    
    // التمرير إلى أسفل
    scrollToBottom();
}

/**
 * إضافة رسالة الروبوت إلى المحادثة
 * @param {string} message - نص الرسالة
 * @param {Array} quickReplies - الردود السريعة (اختياري)
 * @param {boolean} showHumanSupport - إظهار زر الدعم البشري (اختياري)
 */
function addBotMessage(message, quickReplies = [], showHumanSupport = false) {
    const chatMessages = document.getElementById('chat-messages');
    
    // إزالة مؤشر الكتابة
    removeTypingIndicator();
    
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message bot-message';
    
    let messageHTML = `
        <div class="message-content">
            <p>${message}</p>
    `;
    
    // إضافة الردود السريعة
    if (quickReplies.length > 0) {
        messageHTML += `
            <div class="quick-replies">
        `;
        
        quickReplies.forEach(reply => {
            messageHTML += `
                <button class="quick-reply-button" data-query="${escapeHTML(reply)}">${escapeHTML(reply)}</button>
            `;
        });
        
        messageHTML += `
            </div>
        `;
    }
    
    // إضافة زر الدعم البشري
    if (showHumanSupport) {
        messageHTML += `
            <div class="human-support-button">
                <button id="human-support">التحدث مع فريق الدعم</button>
            </div>
        `;
    }
    
    messageHTML += `
        </div>
    `;
    
    messageElement.innerHTML = messageHTML;
    
    chatMessages.appendChild(messageElement);
    
    // إضافة حدث زر الدعم البشري
    if (showHumanSupport) {
        const humanSupportButton = messageElement.querySelector('#human-support');
        humanSupportButton.addEventListener('click', function() {
            redirectToHumanSupport();
        });
    }
    
    // التمرير إلى أسفل
    scrollToBottom();
}

/**
 * إظهار مؤشر الكتابة
 */
function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    
    // التحقق من وجود مؤشر الكتابة
    if (document.querySelector('.typing-indicator')) {
        return;
    }
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    chatMessages.appendChild(typingIndicator);
    
    // التمرير إلى أسفل
    scrollToBottom();
}

/**
 * إزالة مؤشر الكتابة
 */
function removeTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * التمرير إلى أسفل منطقة الرسائل
 */
function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * تهروب النص HTML
 * @param {string} text - النص المراد تهروبه
 * @returns {string} - النص المهروب
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * تحميل قاعدة المعرفة
 */
function loadKnowledgeBase() {
    // في بيئة الإنتاج، يمكن تحميل قاعدة المعرفة من ملف JSON أو من الخادم
    window.knowledgeBase = {
        // أسئلة عامة
        'general': [
            {
                'patterns': ['مرحبا', 'السلام عليكم', 'أهلا', 'مساء الخير', 'صباح الخير'],
                'responses': ['مرحباً بك! كيف يمكنني مساعدتك اليوم؟', 'أهلاً! أنا هنا للإجابة على استفساراتك. كيف يمكنني مساعدتك؟'],
                'quickReplies': ['كيف يمكنني إنشاء دعوة جديدة؟', 'كيف يمكنني تعديل دعوة موجودة؟', 'ما هي أنواع الدعوات المتاحة؟']
            },
            {
                'patterns': ['من أنت', 'ما هو اسمك', 'عرفني بنفسك'],
                'responses': ['أنا المساعد الآلي لمنصة الدعوات الإلكترونية، هنا لمساعدتك في استخدام المنصة والإجابة على استفساراتك.'],
                'quickReplies': ['ما هي الخدمات التي تقدمها المنصة؟', 'كيف يمكنني التواصل مع فريق الدعم؟']
            },
            {
                'patterns': ['شكرا', 'شكرا لك', 'شكرا جزيلا'],
                'responses': ['العفو! سعيد بمساعدتك. هل هناك شيء آخر يمكنني مساعدتك به؟', 'أهلاً بك! هل هناك أي استفسار آخر؟'],
                'quickReplies': ['نعم، لدي سؤال آخر', 'لا، شكراً لك']
            },
            {
                'patterns': ['وداعا', 'إلى اللقاء', 'مع السلامة'],
                'responses': ['إلى اللقاء! سعدت بالتحدث معك. يمكنك العودة في أي وقت إذا كان لديك أي استفسار.'],
                'quickReplies': []
            }
        ],
        
        // إنشاء وإدارة الدعوات
        'invitations': [
            {
                'patterns': ['كيف يمكنني إنشاء دعوة جديدة', 'أريد إنشاء دعوة', 'إنشاء دعوة'],
                'responses': ['لإنشاء دعوة جديدة، اتبع الخطوات التالية:<br>1. انتقل إلى لوحة التحكم<br>2. انقر على زر "إنشاء دعوة جديدة"<br>3. اختر نوع الدعوة (مناسبة، اجتماع، مؤتمر، إلخ)<br>4. أدخل تفاصيل الدعوة (العنوان، التاريخ، الوقت، المكان)<br>5. اختر قالب التصميم<br>6. أضف قائمة المدعوين<br>7. انقر على "حفظ ونشر"'],
                'quickReplies': ['ما هي أنواع الدعوات المتاحة؟', 'كيف يمكنني تخصيص تصميم الدعوة؟', 'كيف يمكنني إضافة المدعوين؟']
            },
            {
                'patterns': ['كيف يمكنني تعديل دعوة', 'تعديل دعوة موجودة', 'تحديث دعوة'],
                'responses': ['لتعديل دعوة موجودة، اتبع الخطوات التالية:<br>1. انتقل إلى قائمة "الدعوات"<br>2. ابحث عن الدعوة التي تريد تعديلها<br>3. انقر على زر "تعديل" (رمز القلم)<br>4. قم بتحديث المعلومات المطلوبة<br>5. انقر على "حفظ التغييرات"<br><br>ملاحظة: إذا كانت الدعوة قد تم إرسالها بالفعل، سيتم إشعار المدعوين بالتغييرات تلقائياً.'],
                'quickReplies': ['هل يمكنني تغيير تاريخ دعوة مرسلة؟', 'كيف يمكنني إلغاء دعوة؟']
            },
            {
                'patterns': ['ما هي أنواع الدعوات المتاحة', 'أنواع الدعوات'],
                'responses': ['تتيح المنصة إنشاء أنواع متعددة من الدعوات:<br>1. دعوات المناسبات الاجتماعية (زفاف، خطوبة، عيد ميلاد)<br>2. دعوات الاجتماعات والمؤتمرات<br>3. دعوات الفعاليات والمعارض<br>4. دعوات التخرج والتكريم<br>5. دعوات رمضان والأعياد<br>6. دعوات افتتاح المشاريع<br>7. دعوات مخصصة لأي نوع من المناسبات<br><br>كل نوع يأتي مع قوالب تصميم مخصصة وحقول معلومات مناسبة.'],
                'quickReplies': ['كيف يمكنني إنشاء دعوة جديدة؟', 'هل يمكنني إنشاء نوع دعوة مخصص؟']
            },
            {
                'patterns': ['كيف يمكنني إلغاء دعوة', 'إلغاء دعوة', 'حذف دعوة'],
                'responses': ['لإلغاء دعوة، اتبع الخطوات التالية:<br>1. انتقل إلى قائمة "الدعوات"<br>2. ابحث عن الدعوة التي تريد إلغاءها<br>3. انقر على زر "المزيد" (النقاط الثلاث)<br>4. اختر "إلغاء الدعوة"<br>5. أدخل سبب الإلغاء (اختياري)<br>6. انقر على "تأكيد الإلغاء"<br><br>سيتم إشعار جميع المدعوين بإلغاء الدعوة تلقائياً.'],
                'quickReplies': ['هل يمكنني استعادة دعوة ملغاة؟', 'هل يتم استرداد الرسوم عند إلغاء دعوة؟']
            }
        ],
        
        // إدارة المدعوين
        'guests': [
            {
                'patterns': ['كيف يمكنني إضافة المدعوين', 'إضافة مدعوين', 'إضافة ضيوف'],
                'responses': ['يمكنك إضافة المدعوين بعدة طرق:<br>1. إضافة يدوية: أدخل اسم وبريد/رقم هاتف كل مدعو<br>2. استيراد من ملف: قم بتحميل ملف Excel أو CSV يحتوي على قائمة المدعوين<br>3. استيراد من جهات الاتصال: اسمح للمنصة بالوصول إلى جهات اتصالك<br>4. نسخ من دعوة سابقة: استخدم قائمة مدعوين من دعوة أخرى<br><br>يمكنك أيضاً تنظيم المدعوين في مجموعات لتسهيل إدارتهم.'],
                'quickReplies': ['ما هو تنسيق ملف Excel المطلوب؟', 'كيف يمكنني تنظيم المدعوين في مجموعات؟']
            },
            {
                'patterns': ['كيف يمكنني تتبع حالة الدعوات', 'تتبع الردود', 'معرفة من قبل الدعوة'],
                'responses': ['يمكنك تتبع حالة الدعوات والردود من خلال:<br>1. انتقل إلى قائمة "الدعوات"<br>2. اختر الدعوة المطلوبة<br>3. انقر على تبويب "المدعوون"<br>4. ستظهر لك قائمة بجميع المدعوين وحالة كل منهم (تم الإرسال، تم الاطلاع، تم القبول، تم الاعتذار)<br><br>يمكنك أيضاً الاطلاع على إحصائيات مفصلة وتصدير تقرير بحالة الردود.'],
                'quickReplies': ['كيف يمكنني إرسال تذكير للمدعوين؟', 'هل يمكنني معرفة من فتح الدعوة؟']
            },
            {
                'patterns': ['كيف يمكنني إرسال تذكير', 'إرسال تذكير للمدعوين', 'تذكير الضيوف'],
                'responses': ['لإرسال تذكير للمدعوين، اتبع الخطوات التالية:<br>1. انتقل إلى قائمة "الدعوات"<br>2. اختر الدعوة المطلوبة<br>3. انقر على تبويب "المدعوون"<br>4. انقر على زر "إرسال تذكير"<br>5. اختر المدعوين المستهدفين (الجميع، من لم يرد، من لم يفتح الدعوة)<br>6. خصص رسالة التذكير (اختياري)<br>7. اختر وسيلة الإرسال (بريد إلكتروني، رسالة نصية، كلاهما)<br>8. انقر على "إرسال"<br><br>يمكنك جدولة تذكيرات تلقائية قبل موعد المناسبة.'],
                'quickReplies': ['كيف يمكنني جدولة تذكيرات تلقائية؟', 'كم مرة يمكنني إرسال تذكير؟']
            }
        ],
        
        // التصميم والقوالب
        'design': [
            {
                'patterns': ['كيف يمكنني تخصيص تصميم الدعوة', 'تخصيص التصميم', 'تعديل قالب'],
                'responses': ['لتخصيص تصميم الدعوة، اتبع الخطوات التالية:<br>1. أثناء إنشاء الدعوة أو تعديلها، انتقل إلى قسم "التصميم"<br>2. اختر قالباً من القوالب المتاحة<br>3. انقر على "تخصيص" لتعديل القالب<br>4. يمكنك تغيير الألوان، الخطوط، الصور، وترتيب العناصر<br>5. استخدم خيار "معاينة" لرؤية شكل الدعوة<br>6. انقر على "حفظ التصميم" عند الانتهاء<br><br>يمكنك أيضاً تحميل تصميم خاص بك أو طلب تصميم مخصص من فريق المصممين.'],
                'quickReplies': ['كيف يمكنني تحميل تصميم خاص بي؟', 'كيف يمكنني طلب تصميم مخصص؟']
            },
            {
                'patterns': ['كيف يمكنني استخدام معرض التصاميم', 'معرض التصاميم', 'قوالب جاهزة'],
                'responses': ['لاستخدام معرض التصاميم، اتبع الخطوات التالية:<br>1. انتقل إلى "معرض التصاميم" من القائمة الرئيسية<br>2. تصفح التصاميم حسب المناسبة أو استخدم البحث<br>3. انقر على أي تصميم لمعاينته<br>4. إذا أعجبك التصميم، انقر على "استخدام هذا التصميم"<br>5. سيتم توجيهك إلى صفحة إنشاء دعوة جديدة مع تطبيق التصميم المختار<br><br>يتم تحديث معرض التصاميم بانتظام مع إضافة تصاميم جديدة وموسمية.'],
                'quickReplies': ['هل التصاميم مجانية؟', 'هل يمكنني حفظ التصاميم المفضلة؟']
            },
            {
                'patterns': ['كيف يمكنني طلب تصميم مخصص', 'تصميم مخصص', 'طلب تصميم خاص'],
                'responses': ['لطلب تصميم مخصص، اتبع الخطوات التالية:<br>1. انتقل إلى "الخدمات الإضافية" من القائمة الرئيسية<br>2. اختر "طلب تصميم مخصص"<br>3. املأ نموذج الطلب (نوع المناسبة، التفاصيل، المتطلبات)<br>4. أرفق أي صور أو مراجع للتصميم المطلوب<br>5. اختر مستوى الخدمة (عادي، متميز، احترافي)<br>6. قم بالدفع<br>7. سيتواصل معك أحد المصممين خلال 24 ساعة<br><br>يمكنك طلب تعديلات على التصميم المقدم حتى تكون راضياً تماماً.'],
                'quickReplies': ['ما هي تكلفة التصميم المخصص؟', 'كم من الوقت يستغرق تنفيذ التصميم المخصص؟']
            }
        ],
        
        // الدفع والاشتراكات
        'payment': [
            {
                'patterns': ['ما هي خطط الاشتراك المتاحة', 'خطط الاشتراك', 'الباقات'],
                'responses': ['توفر المنصة عدة خطط اشتراك لتناسب احتياجاتك:<br><br>1. <b>الخطة المجانية</b>:<br>- إنشاء حتى 3 دعوات شهرياً<br>- حتى 50 مدعو لكل دعوة<br>- قوالب أساسية<br>- دعم بالبريد الإلكتروني<br><br>2. <b>الخطة الأساسية</b> (99 ريال/شهر):<br>- إنشاء حتى 10 دعوات شهرياً<br>- حتى 200 مدعو لكل دعوة<br>- جميع القوالب الأساسية والمتميزة<br>- تخصيص بسيط للتصاميم<br>- دعم فني على مدار الساعة<br><br>3. <b>الخطة الاحترافية</b> (199 ريال/شهر):<br>- دعوات غير محدودة<br>- حتى 1000 مدعو لكل دعوة<br>- جميع القوالب بما فيها الحصرية<br>- تخصيص كامل للتصاميم<br>- تصميم مخصص شهرياً<br>- دعم فني مميز<br>- تقارير وإحصائيات متقدمة<br><br>4. <b>خطة الأعمال</b> (499 ريال/شهر):<br>- دعوات غير محدودة<br>- مدعوون غير محدودين<br>- جميع الميزات المتقدمة<br>- 3 تصاميم مخصصة شهرياً<br>- مدير حساب مخصص<br>- تكامل مع أنظمة الشركة<br><br>يمكنك الاطلاع على تفاصيل أكثر في صفحة "الاشتراكات".'],
                'quickReplies': ['كيف يمكنني الترقية إلى خطة أعلى؟', 'هل هناك خصم على الاشتراك السنوي؟']
            },
            {
                'patterns': ['ما هي طرق الدفع المتاحة', 'طرق الدفع', 'كيف يمكنني الدفع'],
                'responses': ['تدعم المنصة طرق الدفع التالية:<br>1. بطاقات الائتمان (فيزا، ماستركارد، أمريكان إكسبرس)<br>2. بطاقات مدى<br>3. Apple Pay<br>4. STC Pay<br>5. التحويل البنكي (للاشتراكات السنوية والشركات)<br><br>جميع المدفوعات مؤمنة ومشفرة باستخدام أحدث تقنيات الحماية.'],
                'quickReplies': ['هل يمكنني الحصول على فاتورة ضريبية؟', 'ما هي سياسة استرداد المبالغ؟']
            },
            {
                'patterns': ['كيف يمكنني إلغاء اشتراكي', 'إلغاء الاشتراك', 'إيقاف التجديد التلقائي'],
                'responses': ['لإلغاء اشتراكك أو إيقاف التجديد التلقائي، اتبع الخطوات التالية:<br>1. انتقل إلى "إعدادات الحساب"<br>2. اختر "الاشتراك والفواتير"<br>3. انقر على "إدارة الاشتراك"<br>4. اختر "إلغاء الاشتراك" أو "إيقاف التجديد التلقائي"<br>5. اختر سبب الإلغاء من القائمة<br>6. انقر على "تأكيد الإلغاء"<br><br>ملاحظة: إذا قمت بإلغاء الاشتراك، ستظل خدماتك نشطة حتى نهاية فترة الفوترة الحالية.'],
                'quickReplies': ['هل يمكنني استرداد المبلغ المتبقي؟', 'ماذا يحدث لدعواتي بعد إلغاء الاشتراك؟']
            }
        ],
        
        // المشاكل والدعم الفني
        'support': [
            {
                'patterns': ['كيف يمكنني التواصل مع الدعم الفني', 'دعم فني', 'مساعدة'],
                'responses': ['يمكنك التواصل مع فريق الدعم الفني من خلال عدة قنوات:<br>1. الدردشة المباشرة: متاحة على مدار الساعة من خلال زر الدردشة في أسفل الصفحة<br>2. البريد الإلكتروني: support@invitations-platform.com<br>3. رقم الهاتف: 920001234 (من 8 صباحاً إلى 8 مساءً)<br>4. نموذج الدعم: من خلال صفحة "اتصل بنا"<br><br>فريق الدعم الفني جاهز لمساعدتك في أي استفسار أو مشكلة تواجهك.'],
                'quickReplies': ['أريد التحدث مع فريق الدعم', 'لدي مشكلة في إنشاء دعوة'],
                'showHumanSupport': true
            },
            {
                'patterns': ['لا يمكنني إنشاء دعوة', 'مشكلة في إنشاء دعوة', 'خطأ في الدعوة'],
                'responses': ['آسف لسماع ذلك. دعنا نحاول حل المشكلة:<br><br>أسباب شائعة لمشاكل إنشاء الدعوات:<br>1. انتهاء صلاحية الجلسة: حاول تسجيل الخروج وإعادة تسجيل الدخول<br>2. وصلت للحد الأقصى من الدعوات في خطتك الحالية: ترقية إلى خطة أعلى<br>3. مشكلة في المتصفح: جرب تحديث الصفحة أو استخدام متصفح آخر<br>4. مشكلة في الصور: تأكد من أن حجم الصور لا يتجاوز 5 ميجابايت<br><br>إذا استمرت المشكلة، يرجى تزويدنا بمزيد من التفاصيل أو التواصل مع فريق الدعم الفني.'],
                'quickReplies': ['المشكلة لا تزال قائمة', 'أريد التحدث مع فريق الدعم'],
                'showHumanSupport': true
            },
            {
                'patterns': ['نسيت كلمة المرور', 'استعادة كلمة المرور', 'إعادة تعيين كلمة المرور'],
                'responses': ['لإعادة تعيين كلمة المرور، اتبع الخطوات التالية:<br>1. انتقل إلى صفحة تسجيل الدخول<br>2. انقر على "نسيت كلمة المرور"<br>3. أدخل عنوان البريد الإلكتروني المسجل<br>4. انقر على "إرسال رابط إعادة التعيين"<br>5. تحقق من بريدك الإلكتروني (بما في ذلك مجلد البريد غير المرغوب فيه)<br>6. انقر على الرابط في البريد الإلكتروني<br>7. أدخل كلمة مرور جديدة وقم بتأكيدها<br><br>إذا لم تتلق البريد الإلكتروني خلال 5 دقائق، يمكنك طلب إرسال رابط جديد.'],
                'quickReplies': ['لم أتلق بريد إعادة التعيين', 'أريد التحدث مع فريق الدعم']
            }
        ],
        
        // الأسئلة الشائعة
        'faq': [
            {
                'patterns': ['ما هي المدة التي تبقى فيها الدعوة نشطة', 'مدة صلاحية الدعوة', 'متى تنتهي الدعوة'],
                'responses': ['تبقى الدعوة نشطة ومتاحة للوصول حتى 30 يوماً بعد تاريخ المناسبة. بعد ذلك، ستظل الدعوة في أرشيف حسابك، لكن الرابط لن يكون نشطاً للمدعوين.<br><br>إذا كنت ترغب في تمديد فترة نشاط الدعوة، يمكنك القيام بذلك من إعدادات الدعوة مقابل رسوم إضافية.'],
                'quickReplies': ['كيف يمكنني تمديد فترة نشاط الدعوة؟', 'هل يمكنني الوصول إلى الدعوات القديمة؟']
            },
            {
                'patterns': ['هل يمكن للمدعوين مشاركة الدعوة', 'مشاركة الدعوة', 'إعادة توجيه الدعوة'],
                'responses': ['نعم، يمكن للمدعوين مشاركة الدعوة، لكن ذلك يعتمد على إعدادات الخصوصية التي حددتها:<br><br>1. <b>دعوة عامة</b>: يمكن لأي شخص لديه الرابط الوصول إليها ومشاركتها<br>2. <b>دعوة خاصة</b>: تتطلب كلمة مرور أو رمز دعوة للوصول<br>3. <b>دعوة شخصية</b>: مرتبطة بالمدعو ولا يمكن مشاركتها<br><br>يمكنك تغيير إعدادات الخصوصية من صفحة تعديل الدعوة > قسم "الخصوصية والأمان".'],
                'quickReplies': ['كيف يمكنني تغيير إعدادات الخصوصية؟', 'ما الفرق بين أنواع الدعوات؟']
            },
            {
                'patterns': ['هل يمكنني معرفة من فتح الدعوة', 'تتبع فتح الدعوة', 'إحصائيات الدعوة'],
                'responses': ['نعم، توفر المنصة إحصائيات مفصلة حول الدعوة، بما في ذلك:<br>1. من فتح الدعوة ومتى<br>2. عدد مرات فتح الدعوة<br>3. الأجهزة المستخدمة لفتح الدعوة<br>4. معدل القبول والاعتذار<br><br>للوصول إلى هذه الإحصائيات:<br>1. انتقل إلى قائمة "الدعوات"<br>2. اختر الدعوة المطلوبة<br>3. انقر على تبويب "الإحصائيات"<br><br>ملاحظة: بعض الإحصائيات المتقدمة متاحة فقط في الخطط المدفوعة.'],
                'quickReplies': ['ما هي الإحصائيات المتاحة في الخطة المجانية؟', 'هل يمكنني تصدير تقرير الإحصائيات؟']
            }
        ]
    };
    
    console.log('تم تحميل قاعدة المعرفة بنجاح.');
}

/**
 * تهيئة معالج الرسائل
 */
function initMessageHandler() {
    // لا يوجد إجراء محدد هنا، حيث يتم معالجة الرسائل عند استلامها
    console.log('تم تهيئة معالج الرسائل بنجاح.');
}

/**
 * معالجة رسالة المستخدم
 * @param {string} message - رسالة المستخدم
 */
function processUserMessage(message) {
    // تحويل الرسالة إلى أحرف صغيرة للمطابقة
    const normalizedMessage = message.toLowerCase();
    
    // البحث عن إجابة في قاعدة المعرفة
    let foundResponse = false;
    let confidenceScore = 0;
    let bestResponse = null;
    let bestQuickReplies = [];
    let showHumanSupport = false;
    
    // البحث في جميع الفئات
    for (const category in window.knowledgeBase) {
        for (const item of window.knowledgeBase[category]) {
            for (const pattern of item.patterns) {
                const patternNormalized = pattern.toLowerCase();
                
                // حساب درجة التشابه
                const similarity = calculateSimilarity(normalizedMessage, patternNormalized);
                
                // إذا كانت درجة التشابه أعلى من العتبة وأعلى من الدرجة الحالية
                if (similarity > 0.6 && similarity > confidenceScore) {
                    confidenceScore = similarity;
                    bestResponse = item.responses[Math.floor(Math.random() * item.responses.length)];
                    bestQuickReplies = item.quickReplies || [];
                    showHumanSupport = item.showHumanSupport || false;
                    foundResponse = true;
                }
            }
        }
    }
    
    // إذا تم العثور على إجابة
    if (foundResponse) {
        addBotMessage(bestResponse, bestQuickReplies, showHumanSupport);
    } else {
        // إذا لم يتم العثور على إجابة
        const fallbackResponses = [
            'عذراً، لم أفهم سؤالك. هل يمكنك إعادة صياغته بطريقة أخرى؟',
            'لم أتمكن من فهم استفسارك. هل يمكنك توضيحه أكثر؟',
            'آسف، لا أملك إجابة على هذا السؤال. هل ترغب في التحدث مع فريق الدعم؟'
        ];
        
        const fallbackQuickReplies = [
            'كيف يمكنني إنشاء دعوة جديدة؟',
            'ما هي خطط الاشتراك المتاحة؟',
            'كيف يمكنني التواصل مع الدعم الفني؟'
        ];
        
        addBotMessage(
            fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
            fallbackQuickReplies,
            true
        );
    }
}

/**
 * حساب درجة التشابه بين نصين
 * @param {string} str1 - النص الأول
 * @param {string} str2 - النص الثاني
 * @returns {number} - درجة التشابه (0-1)
 */
function calculateSimilarity(str1, str2) {
    // تنفيذ بسيط لحساب التشابه
    // في بيئة الإنتاج، يمكن استخدام خوارزميات أكثر تعقيداً
    
    // التحقق من التطابق المباشر
    if (str1 === str2) {
        return 1;
    }
    
    // التحقق من الاحتواء
    if (str1.includes(str2) || str2.includes(str1)) {
        return 0.8;
    }
    
    // تقسيم النصوص إلى كلمات
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    
    // عدد الكلمات المشتركة
    let commonWords = 0;
    
    for (const word1 of words1) {
        if (word1.length < 3) continue; // تجاهل الكلمات القصيرة
        
        for (const word2 of words2) {
            if (word2.length < 3) continue; // تجاهل الكلمات القصيرة
            
            if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
                commonWords++;
                break;
            }
        }
    }
    
    // حساب درجة التشابه
    return commonWords / Math.max(words1.length, words2.length);
}

/**
 * توجيه المستخدم إلى صفحة الدعم البشري
 */
function redirectToHumanSupport() {
    // إضافة رسالة انتظار
    addBotMessage('جاري تحويلك إلى أحد ممثلي خدمة العملاء. يرجى الانتظار قليلاً...');
    
    // محاكاة الانتظار
    setTimeout(function() {
        // إضافة رسالة التحويل
        addBotMessage('تم تسجيل طلبك للتحدث مع فريق الدعم. سيتواصل معك أحد ممثلي خدمة العملاء في أقرب وقت ممكن. يمكنك أيضاً التواصل مباشرة عبر:<br>البريد الإلكتروني: support@invitations-platform.com<br>رقم الهاتف: 920001234');
        
        // توجيه المستخدم إلى صفحة الدعم (اختياري)
        // window.open('/support', '_blank');
    }, 2000);
}
