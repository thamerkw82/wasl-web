/**
 * نظام الدعم الفني المتكامل
 * ملف جافاسكريبت لتنفيذ الوظائف التفاعلية لصفحات الدعم الفني
 */

$(document).ready(function() {
    // تهيئة المكونات
    initializeComponents();
    
    // تهيئة نظام التذاكر
    initializeTicketSystem();
    
    // تهيئة نظام الأسئلة الشائعة
    initializeFAQSystem();
    
    // تهيئة نظام الاتصال
    initializeContactSystem();
    
    // تهيئة نظام التقييم
    initializeRatingSystem();
    
    // تهيئة نظام الإحصائيات (للمدير والمشرف فقط)
    if ($('.support-dashboard').length) {
        initializeDashboardStats();
    }
});

/**
 * تهيئة المكونات الأساسية
 */
function initializeComponents() {
    // تهيئة Select2
    if ($.fn.select2) {
        $('.select2').select2({
            dir: "rtl",
            language: "ar"
        });
    }
    
    // تهيئة التلميحات
    if ($.fn.tooltip) {
        $('[data-toggle="tooltip"]').tooltip();
    }
    
    // تهيئة المخططات البيانية (للمدير والمشرف فقط)
    if (typeof Chart !== 'undefined' && $('.chart-container').length) {
        initializeCharts();
    }
    
    // تهيئة محرر النصوص المتقدم
    if ($.fn.summernote) {
        $('.rich-editor').summernote({
            height: 150,
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough']],
                ['para', ['ul', 'ol']],
                ['insert', ['link']]
            ],
            placeholder: 'اكتب هنا...',
            lang: 'ar-AR'
        });
    }
}

/**
 * تهيئة نظام التذاكر
 */
function initializeTicketSystem() {
    // معالجة عرض تفاصيل التذكرة
    $('#ticketDetailModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var ticketId = button.data('ticket-id');
        var modal = $(this);
        
        modal.find('.modal-title').text('تفاصيل التذكرة #' + ticketId);
        
        // محاكاة طلب AJAX لجلب بيانات التذكرة
        // في التطبيق الفعلي، سيتم استبدال هذا بطلب AJAX حقيقي
        simulateLoadTicketDetails(ticketId, modal);
    });
    
    // معالجة إنشاء تذكرة جديدة
    $('#submitNewTicket').on('click', function() {
        if (validateTicketForm('#newTicketForm')) {
            // محاكاة إرسال التذكرة
            simulateCreateTicket();
        }
    });
    
    // معالجة إرسال رد على تذكرة
    $('#ticketReplyForm').on('submit', function(e) {
        e.preventDefault();
        if (validateReplyForm()) {
            // محاكاة إرسال الرد
            simulateSubmitReply();
        }
    });
    
    // معالجة تصفية التذاكر
    $('#applyFilters').on('click', function() {
        filterTickets();
    });
    
    // معالجة البحث في التذاكر
    $('#ticketSearch').on('keyup', function(e) {
        if (e.keyCode === 13) {
            filterTickets();
        }
    });
    
    // معالجة تغيير حالة التذكرة (للمدير والمشرف فقط)
    $('.change-ticket-status').on('click', function() {
        var ticketId = $(this).data('ticket-id');
        var newStatus = $(this).data('status');
        
        // محاكاة تغيير حالة التذكرة
        simulateChangeTicketStatus(ticketId, newStatus);
    });
    
    // معالجة تعيين التذكرة (للمدير فقط)
    $('.assign-ticket').on('click', function() {
        var ticketId = $(this).data('ticket-id');
        var supervisorId = $('#assignSupervisorSelect').val();
        
        // محاكاة تعيين التذكرة
        simulateAssignTicket(ticketId, supervisorId);
    });
}

/**
 * تهيئة نظام الأسئلة الشائعة
 */
function initializeFAQSystem() {
    // معالجة النقر على سؤال
    $('.faq-question').on('click', function() {
        toggleFaqAnswer(this);
    });
    
    // معالجة البحث في الأسئلة الشائعة
    $('#faqSearch').on('keyup', function() {
        var searchTerm = $(this).val().toLowerCase();
        
        if (searchTerm.length > 2) {
            filterFAQs(searchTerm);
        } else if (searchTerm.length === 0) {
            // إعادة عرض جميع الأسئلة
            $('.faq-item').show();
        }
    });
    
    // معالجة النقر على فئة الأسئلة الشائعة
    $('.category-card').on('click', function() {
        var category = $(this).data('category');
        filterFAQsByCategory(category);
        
        // التمرير إلى قائمة الأسئلة الشائعة
        $('html, body').animate({
            scrollTop: $('.faq-list').offset().top - 100
        }, 500);
    });
}

/**
 * تهيئة نظام الاتصال
 */
function initializeContactSystem() {
    // معالجة إرسال نموذج الاتصال
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm()) {
            // محاكاة إرسال نموذج الاتصال
            simulateSubmitContactForm();
        }
    });
    
    // معالجة بدء الدردشة المباشرة
    $('#startChatBtn').on('click', function() {
        // محاكاة فتح نافذة الدردشة
        simulateStartChat();
    });
}

/**
 * تهيئة نظام التقييم
 */
function initializeRatingSystem() {
    // معالجة إرسال التقييم
    $('#submitRating').on('click', function() {
        var rating = $('#rateTicketModal').data('rating');
        var feedback = $('#ratingFeedback').val();
        
        if (rating) {
            // محاكاة إرسال التقييم
            simulateSubmitRating(rating, feedback);
        } else {
            alert('يرجى اختيار تقييم');
        }
    });
}

/**
 * تهيئة إحصائيات لوحة التحكم (للمدير والمشرف فقط)
 */
function initializeDashboardStats() {
    // محاكاة تحديث الإحصائيات كل 30 ثانية
    updateDashboardStats();
    setInterval(updateDashboardStats, 30000);
    
    // معالجة تغيير نطاق الإحصائيات
    $('#statsRangeSelector').on('change', function() {
        updateDashboardStats($(this).val());
    });
}

/**
 * تهيئة المخططات البيانية (للمدير والمشرف فقط)
 */
function initializeCharts() {
    // مخطط توزيع التذاكر حسب الحالة
    if ($('#ticketStatusChart').length) {
        var statusCtx = document.getElementById('ticketStatusChart').getContext('2d');
        new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['جديدة', 'مفتوحة', 'معلقة', 'تم الحل', 'مغلقة'],
                datasets: [{
                    data: [12, 19, 8, 15, 10],
                    backgroundColor: [
                        '#007bff',
                        '#ffc107',
                        '#dc3545',
                        '#28a745',
                        '#6c757d'
                    ]
                }]
            },
            options: {
                responsive: true,
                legend: {
                    position: 'bottom',
                    labels: {
                        fontFamily: 'Cairo, sans-serif'
                    }
                }
            }
        });
    }
    
    // مخطط التذاكر حسب الفئة
    if ($('#ticketCategoryChart').length) {
        var categoryCtx = document.getElementById('ticketCategoryChart').getContext('2d');
        new Chart(categoryCtx, {
            type: 'bar',
            data: {
                labels: ['الحساب', 'الدعوات', 'الضيوف', 'الفواتير', 'تقنية', 'أخرى'],
                datasets: [{
                    label: 'عدد التذاكر',
                    data: [15, 25, 10, 18, 22, 8],
                    backgroundColor: '#007bff'
                }]
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontFamily: 'Cairo, sans-serif'
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontFamily: 'Cairo, sans-serif'
                        }
                    }]
                }
            }
        });
    }
    
    // مخطط وقت الاستجابة (للمدير فقط)
    if ($('#responseTimeChart').length) {
        var timeCtx = document.getElementById('responseTimeChart').getContext('2d');
        new Chart(timeCtx, {
            type: 'line',
            data: {
                labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
                datasets: [{
                    label: 'متوسط وقت الاستجابة (ساعات)',
                    data: [8, 7, 6, 5, 4, 3],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontFamily: 'Cairo, sans-serif'
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontFamily: 'Cairo, sans-serif'
                        }
                    }]
                }
            }
        });
    }
}

/**
 * تبديل عرض/إخفاء إجابة السؤال الشائع
 */
function toggleFaqAnswer(element) {
    var answer = $(element).next('.faq-answer');
    answer.slideToggle(200);
    $(element).find('i').toggleClass('fa-chevron-down fa-chevron-up');
}

/**
 * اختيار تقييم
 */
function selectRating(rating) {
    // إعادة تعيين جميع التقييمات
    for (var i = 1; i <= 5; i++) {
        $('#rating-' + i).removeClass('fas selected').addClass('far');
    }
    
    // تعيين التقييم المحدد
    for (var i = 1; i <= rating; i++) {
        $('#rating-' + i).removeClass('far').addClass('fas selected');
    }
    
    // تخزين قيمة التقييم
    $('#rateTicketModal').data('rating', rating);
}

/**
 * تصفية التذاكر
 */
function filterTickets() {
    var searchTerm = $('#ticketSearch').val().toLowerCase();
    var statusFilter = $('#statusFilter').val();
    var sortFilter = $('#sortFilter').val();
    
    // محاكاة تصفية التذاكر
    // في التطبيق الفعلي، سيتم استبدال هذا بطلب AJAX حقيقي
    
    // إظهار رسالة تحميل
    $('.tickets-list').append('<div class="text-center py-3" id="loadingIndicator"><i class="fas fa-spinner fa-spin"></i> جاري تحميل التذاكر...</div>');
    
    // محاكاة تأخير الشبكة
    setTimeout(function() {
        // إزالة مؤشر التحميل
        $('#loadingIndicator').remove();
        
        // محاكاة نتائج التصفية
        var ticketCards = $('.ticket-card');
        
        if (searchTerm || statusFilter) {
            var foundResults = false;
            
            ticketCards.each(function() {
                var card = $(this);
                var cardText = card.text().toLowerCase();
                var cardStatus = card.find('.ticket-status').attr('class').includes(statusFilter);
                
                var matchesSearch = !searchTerm || cardText.includes(searchTerm);
                var matchesStatus = !statusFilter || cardStatus;
                
                if (matchesSearch && matchesStatus) {
                    card.show();
                    foundResults = true;
                } else {
                    card.hide();
                }
            });
            
            // إظهار رسالة عدم وجود نتائج إذا لزم الأمر
            if (!foundResults) {
                $('.no-tickets-message').removeClass('d-none');
            } else {
                $('.no-tickets-message').addClass('d-none');
            }
        } else {
            // إظهار جميع التذاكر إذا لم يتم تحديد أي تصفية
            ticketCards.show();
            $('.no-tickets-message').addClass('d-none');
        }
        
        // تطبيق الترتيب
        sortTickets(sortFilter);
        
    }, 500);
}

/**
 * ترتيب التذاكر
 */
function sortTickets(sortFilter) {
    var ticketsList = $('.tickets-list');
    var tickets = ticketsList.children('.ticket-card').get();
    
    tickets.sort(function(a, b) {
        var dateA = $(a).find('.ticket-meta').text().match(/\d{2}\/\d{2}\/\d{4}/)[0].split('/').reverse().join('');
        var dateB = $(b).find('.ticket-meta').text().match(/\d{2}\/\d{2}\/\d{4}/)[0].split('/').reverse().join('');
        
        if (sortFilter === 'oldest') {
            return dateA - dateB;
        } else {
            return dateB - dateA;
        }
    });
    
    $.each(tickets, function(i, ticket) {
        ticketsList.append(ticket);
    });
}

/**
 * تصفية الأسئلة الشائعة حسب مصطلح البحث
 */
function filterFAQs(searchTerm) {
    $('.faq-item').each(function() {
        var faqText = $(this).text().toLowerCase();
        
        if (faqText.includes(searchTerm)) {
            $(this).show();
            // فتح الإجابة تلقائياً عند البحث
            var answer = $(this).find('.faq-answer');
            if (!answer.is(':visible')) {
                $(this).find('.faq-question').click();
            }
        } else {
            $(this).hide();
        }
    });
}

/**
 * تصفية الأسئلة الشائعة حسب الفئة
 */
function filterFAQsByCategory(category) {
    if (category === 'all') {
        $('.faq-item').show();
    } else {
        $('.faq-item').each(function() {
            if ($(this).data('category') === category) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
}

/**
 * التحقق من صحة نموذج التذكرة
 */
function validateTicketForm(formSelector) {
    var isValid = true;
    
    // التحقق من حقول النموذج الإلزامية
    $(formSelector + ' [required]').each(function() {
        if (!$(this).val()) {
            isValid = false;
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });
    
    if (!isValid) {
        alert('يرجى ملء جميع الحقول المطلوبة');
    }
    
    return isValid;
}

/**
 * التحقق من صحة نموذج الرد
 */
function validateReplyForm() {
    var replyContent = $('#replyContent').val();
    
    if (!replyContent || replyContent.trim() === '') {
        $('#replyContent').addClass('is-invalid');
        alert('يرجى كتابة رد قبل الإرسال');
        return false;
    }
    
    $('#replyContent').removeClass('is-invalid');
    return true;
}

/**
 * التحقق من صحة نموذج الاتصال
 */
function validateContactForm() {
    var isValid = true;
    
    // التحقق من حقول النموذج الإلزامية
    $('#contactForm [required]').each(function() {
        if (!$(this).val()) {
            isValid = false;
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });
    
    if (!isValid) {
        alert('يرجى ملء جميع الحقول المطلوبة');
    }
    
    return isValid;
}

/**
 * تحديث إحصائيات لوحة التحكم (للمدير والمشرف فقط)
 */
function updateDashboardStats(range) {
    range = range || 'week';
    
    // محاكاة تحديث الإحصائيات
    // في التطبيق الفعلي، سيتم استبدال هذا بطلب AJAX حقيقي
    
    // إظهار مؤشر التحميل
    $('.dashboard-stat .stat-number').html('<i class="fas fa-spinner fa-spin"></i>');
    
    // محاكاة تأخير الشبكة
    setTimeout(function() {
        // تحديث الإحصائيات بناءً على النطاق المحدد
        var stats = getStatsByRange(range);
        
        $('#totalTicketsCount').text(stats.totalTickets);
        $('#openTicketsCount').text(stats.openTickets);
        $('#resolvedTicketsCount').text(stats.resolvedTickets);
        $('#avgResponseTimeCount').text(stats.avgResponseTime);
        
        // تحديث المخططات البيانية إذا كانت موجودة
        if (typeof Chart !== 'undefined') {
            updateCharts(stats);
        }
    }, 800);
}

/**
 * الحصول على الإحصائيات حسب النطاق الزمني
 */
function getStatsByRange(range) {
    // محاكاة بيانات الإحصائيات
    var stats = {
        day: {
            totalTickets: '8',
            openTickets: '5',
            resolvedTickets: '3',
            avgResponseTime: '1.5'
        },
        week: {
            totalTickets: '42',
            openTickets: '18',
            resolvedTickets: '24',
            avgResponseTime: '2.3'
        },
        month: {
            totalTickets: '156',
            openTickets: '45',
            resolvedTickets: '111',
            avgResponseTime: '3.1'
        }
    };
    
    return stats[range];
}

/**
 * تحديث المخططات البيانية (للمدير والمشرف فقط)
 */
function updateCharts(stats) {
    // محاكاة تحديث المخططات
    // في التطبيق الفعلي، سيتم تحديث المخططات بالبيانات الفعلية
}

// وظائف المحاكاة للعمليات التي تتطلب طلبات AJAX

/**
 * محاكاة تحميل تفاصيل التذكرة
 */
function simulateLoadTicketDetails(ticketId, modal) {
    // إظهار مؤشر التحميل
    modal.find('.modal-body').html('<div class="text-center py-5"><i class="fas fa-spinner fa-spin fa-3x"></i><p class="mt-3">جاري تحميل تفاصيل التذكرة...</p></div>');
    
    // محاكاة تأخير الشبكة
    setTimeout(function() {
        // استعادة محتوى النموذج الأصلي
        // في التطبيق الفعلي، سيتم استبدال هذا بالبيانات الفعلية من الخادم
        modal.find('.modal-body').html($('#ticketDetailTemplate').html());
    }, 800);
}

/**
 * محاكاة إنشاء تذكرة جديدة
 */
function simulateCreateTicket() {
    // إظهار مؤشر التحميل
    $('#submitNewTicket').html('<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...').attr('disabled', true);
    
    // محاكاة تأخير الشبكة
    setTimeout(function() {
        // إعادة تعيين الزر
        $('#submitNewTicket').html('إرسال التذكرة').attr('disabled', false);
        
        // إغلاق النافذة المنبثقة
        $('#newTicketModal').modal('hide');
        
        // إعادة تعيين النموذج
        $('#newTicketForm')[0].reset();
        
        // عرض رسالة نجاح
        showSuccessMessage('تم إنشاء التذكرة بنجاح! سيتم الرد عليها في أقرب وقت ممكن.');
        
        // تحديث قائمة التذاكر (في التطبيق الفعلي)
    }, 1200);
}

/**
 * محاكاة إرسال رد على تذكرة
 */
function simulateSubmitReply() {
    // إظهار مؤشر التحميل
    var submitBtn = $('#ticketReplyForm button[type="submit"]');
    submitBtn.html('<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...').attr('disabled', true);
    
    // محاكاة تأخير الشبكة
    setTimeout(function() {
        // إعادة تعيين الزر
        submitBtn.html('إرسال الرد').attr('disabled', false);
        
        // إعادة تعيين النموذج
        $('#ticketReplyForm')[0].reset();
        
        // إضافة الرد إلى المحادثة (في التطبيق الفعلي)
        
        // عرض رسالة نجاح
        showSuccessMessage('تم إرسال الرد بنجاح!');
    }, 1000);
}

/**
 * محاكاة تغيير حالة التذكرة (للمدير والمشرف فقط)
 */
function simulateChangeTicketStatus(ticketId, newStatus) {
    // إظهار مؤشر التحميل
    showLoadingMessage('جاري تحديث حالة التذكرة...');
    
    // محاكاة تأخير الشبكة
    setTimeout(function() {
        // عرض رسالة نجاح
        showSuccessMessage('تم تحديث حالة التذكرة بنجاح!');
        
        // تحديث واجهة المستخدم (في التطبيق الفعلي)
    }, 800);
}

/**
 * محاكاة تعيين التذكرة (للمدير فقط)
 */
function simulateAssignTicket(ticketId, supervisorId) {
    // إظهار مؤشر التحميل
    showLoadingMessage('جاري تعيين التذكرة...');
    
    // محاكاة تأخير الشبكة
    setTimeout(function() {
        // عرض رسالة نجاح
        showSuccessMessage('تم تعيين التذكرة بنجاح!');
        
        // تحديث واجهة المستخدم (في التطبيق الفعلي)
    }, 800);
}

/**
 * محاكاة إرسال نموذج الاتصال
 */
function simulateSubmitContactForm() {
    // إظهار مؤشر التحميل
    var submitBtn = $('#contactForm button[type="submit"]');
    submitBtn.html('<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...').attr('disabled', true);
    
    // محاكاة تأخير الشبكة
    setTimeout(function() {
        // إعادة تعيين الزر
        submitBtn.html('<i class="fas fa-paper-plane mr-1"></i> إرسال').attr('disabled', false);
        
        // إعادة تعيين النموذج
        $('#contactForm')[0].reset();
        
        // عرض رسالة نجاح
        showSuccessMessage('تم إرسال رسالتك بنجاح! سنتواصل معك في أقرب وقت ممكن.');
    }, 1200);
}

/**
 * محاكاة بدء الدردشة المباشرة
 */
function simulateStartChat() {
    // إظهار مؤشر التحميل
    $('#startChatBtn').html('<i class="fas fa-spinner fa-spin"></i> جاري التحميل...').attr('disabled', true);
    
    // محاكاة تأخير الشبكة
    setTimeout(function() {
        // إعادة تعيين الزر
        $('#startChatBtn').html('<i class="fas fa-comment-dots mr-1"></i> بدء الدردشة').attr('disabled', false);
        
        // محاكاة فتح نافذة الدردشة
        $('body').append('<div class="chat-window" id="chatWindow"><div class="chat-header"><h5>الدردشة المباشرة</h5><button class="close-chat" onclick="$(\'#chatWindow\').remove();">&times;</button></div><div class="chat-body"><div class="chat-message support"><div class="message-content">مرحباً! كيف يمكنني مساعدتك اليوم؟</div><div class="message-time">الآن</div></div></div><div class="chat-footer"><input type="text" placeholder="اكتب رسالتك هنا..." class="chat-input"><button class="send-message"><i class="fas fa-paper-plane"></i></button></div></div>');
        
        // إضافة أنماط CSS للدردشة
        if (!$('#chatStyles').length) {
            $('head').append('<style id="chatStyles">.chat-window{position:fixed;bottom:20px;right:20px;width:300px;height:400px;background:#fff;border-radius:10px;box-shadow:0 5px 15px rgba(0,0,0,.2);display:flex;flex-direction:column;z-index:1000}.chat-header{padding:10px 15px;background:#007bff;color:#fff;border-radius:10px 10px 0 0;display:flex;justify-content:space-between;align-items:center}.chat-header h5{margin:0}.close-chat{background:0 0;border:none;color:#fff;font-size:20px;cursor:pointer}.chat-body{flex-grow:1;padding:15px;overflow-y:auto;display:flex;flex-direction:column}.chat-message{margin-bottom:15px;max-width:80%}.chat-message.user{align-self:flex-end}.chat-message.support{align-self:flex-start}.message-content{padding:10px;border-radius:10px;word-break:break-word}.chat-message.user .message-content{background:#007bff;color:#fff}.chat-message.support .message-content{background:#f1f3f5;color:#212529}.message-time{font-size:.7rem;color:#6c757d;margin-top:5px;text-align:right}.chat-footer{padding:10px;border-top:1px solid #e9ecef;display:flex}.chat-input{flex-grow:1;border:1px solid #ced4da;border-radius:4px;padding:5px 10px;margin-left:10px}.send-message{background:#007bff;color:#fff;border:none;border-radius:4px;width:40px;cursor:pointer}</style>');
        }
    }, 1000);
}

/**
 * محاكاة إرسال التقييم
 */
function simulateSubmitRating(rating, feedback) {
    // إظهار مؤشر التحميل
    $('#submitRating').html('<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...').attr('disabled', true);
    
    // محاكاة تأخير الشبكة
    setTimeout(function() {
        // إعادة تعيين الزر
        $('#submitRating').html('إرسال التقييم').attr('disabled', false);
        
        // إغلاق النافذة المنبثقة
        $('#rateTicketModal').modal('hide');
        
        // إعادة تعيين النموذج
        $('#ratingFeedback').val('');
        
        // عرض رسالة نجاح
        showSuccessMessage('شكراً لتقييمك! نقدر ملاحظاتك ونعمل دائماً على تحسين خدماتنا.');
    }, 1000);
}

/**
 * عرض رسالة نجاح
 */
function showSuccessMessage(message) {
    // إنشاء عنصر الإشعار
    var notification = $('<div class="alert alert-success alert-dismissible fade show notification-toast" role="alert">' +
                         '<i class="fas fa-check-circle mr-2"></i>' + message +
                         '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                         '<span aria-hidden="true">&times;</span>' +
                         '</button>' +
                         '</div>');
    
    // إضافة الإشعار إلى الصفحة
    $('body').append(notification);
    
    // إضافة أنماط CSS للإشعار
    if (!$('#notificationStyles').length) {
        $('head').append('<style id="notificationStyles">.notification-toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999;min-width:300px;box-shadow:0 5px 15px rgba(0,0,0,.1)}</style>');
    }
    
    // إزالة الإشعار بعد 5 ثوانٍ
    setTimeout(function() {
        notification.alert('close');
    }, 5000);
}

/**
 * عرض رسالة تحميل
 */
function showLoadingMessage(message) {
    // إنشاء عنصر الإشعار
    var notification = $('<div class="alert alert-info alert-dismissible fade show notification-toast" role="alert">' +
                         '<i class="fas fa-spinner fa-spin mr-2"></i>' + message +
                         '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                         '<span aria-hidden="true">&times;</span>' +
                         '</button>' +
                         '</div>');
    
    // إضافة الإشعار إلى الصفحة
    $('body').append(notification);
    
    // إضافة أنماط CSS للإشعار إذا لم تكن موجودة
    if (!$('#notificationStyles').length) {
        $('head').append('<style id="notificationStyles">.notification-toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999;min-width:300px;box-shadow:0 5px 15px rgba(0,0,0,.1)}</style>');
    }
    
    // إرجاع مرجع الإشعار للاستخدام لاحقاً
    return notification;
}
