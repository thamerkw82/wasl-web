const translations = {
    "ar": {
        // Common
        "themeToggleTitle": "تبديل الوضع",
        "langSwitcherText": "EN",
        "profileDropdownHeader": "الحساب",
        "profileDropdownProfile": "الملف الشخصي",
        "profileDropdownSettings": "الإعدادات",
        "profileDropdownActivity": "سجل النشاط",
        "profileDropdownHelp": "المساعدة والدعم",
        "profileDropdownLogout": "تسجيل الخروج",
        "logoutInProgressMsg": "جارٍ تسجيل الخروج...",
        "logoutSuccessMsg": "تم تسجيل الخروج بنجاح",
        "langChangeMsgAr": "تم تغيير اللغة إلى العربية",
        "langChangeMsgEn": "Language changed to English",
        "pageTitleSuffixUser": "لوحة المستخدم",
        "pageTitleSuffixAdmin": "لوحة تحكم المدير",
        "pageTitleSuffixSupervisor": "لوحة تحكم المشرف",
        "home": "الرئيسية",

        // Admin Stats
        "totalUsersStat": "إجمالي المستخدمين",
        "totalSupervisorsStat": "إجمالي المشرفين",
        "totalEventsStat": "إجمالي المناسبات",
        "totalInvitationsStat": "إجمالي الدعوات",
        "totalOrdersStat": "إجمالي الطلبات",
        "activePackagesStat": "الباقات النشطة",

        // Supervisor Stats
        "assignedEventsStat": "المناسبات المسندة",
        "guestsCheckedInStat": "الضيوف المسجلين",
        "pendingTasksStat": "المهام المعلقة",
        "upcomingEventsStat": "المناسبات القادمة (7 أيام)",

        // User Stats (from enhance_user_dashboard.py, ensure these are added)
        "myEventsStat": "مناسباتي القادمة",
        "myInvitationsSentStat": "دعواتي المرسلة",
        "guestsConfirmedStat": "الضيوف المؤكدون",
        "pendingResponsesStat": "الردود المعلقة"
    },
    "en": {
        // Common
        "themeToggleTitle": "Toggle Mode",
        "langSwitcherText": "ع",
        "profileDropdownHeader": "Account",
        "profileDropdownProfile": "Profile",
        "profileDropdownSettings": "Settings",
        "profileDropdownActivity": "Activity Log",
        "profileDropdownHelp": "Help & Support",
        "profileDropdownLogout": "Logout",
        "logoutInProgressMsg": "Logging out...",
        "logoutSuccessMsg": "Logged out successfully",
        "langChangeMsgAr": "تم تغيير اللغة إلى العربية",
        "langChangeMsgEn": "Language changed to English",
        "pageTitleSuffixUser": "User Dashboard",
        "pageTitleSuffixAdmin": "Admin Dashboard",
        "pageTitleSuffixSupervisor": "Supervisor Dashboard",
        "home": "Home",

        // Admin Stats
        "totalUsersStat": "Total Users",
        "totalSupervisorsStat": "Total Supervisors",
        "totalEventsStat": "Total Events",
        "totalInvitationsStat": "Total Invitations",
        "totalOrdersStat": "Total Orders",
        "activePackagesStat": "Active Packages",

        // Supervisor Stats
        "assignedEventsStat": "Assigned Events",
        "guestsCheckedInStat": "Guests Checked-In",
        "pendingTasksStat": "Pending Tasks",
        "upcomingEventsStat": "Upcoming Events (7 days)",

        // User Stats
        "myEventsStat": "My Upcoming Events",
        "myInvitationsSentStat": "My Invitations Sent",
        "guestsConfirmedStat": "Guests Confirmed",
        "pendingResponsesStat": "Pending Responses"
    }
};

function translateAllElements(lang) {
    document.querySelectorAll("[data-translate-key]").forEach(element => {
        const key = element.getAttribute("data-translate-key");
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                if (element.placeholder) {
                    element.placeholder = translations[lang][key];
                }
            } else if (element.tagName === "IMG") {
                if (element.alt) {
                    element.alt = translations[lang][key];
                }
                if(element.title) {
                    element.title = translations[lang][key];
                }
            } else if (element.title && !element.textContent.trim() && !element.hasChildNodes()) { // For elements like buttons with only a title and no text children
                 element.title = translations[lang][key];
            } else {
                // Preserve child elements like icons by only changing text nodes
                let textContent = "";
                let hasNonTextChild = false;
                element.childNodes.forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE) {
                        // For now, we replace the whole innerHTML if a key is found.
                        // A more granular update would be needed to preserve specific child nodes 
                        // while translating text around them if the key is meant for a part of the text.
                        // However, if data-translate-key is on a parent, it implies the whole content is translatable.
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        hasNonTextChild = true;
                    }
                });

                // If it has other elements (like an <i> icon), set innerHTML. Otherwise, textContent is safer.
                // For simplicity and to ensure icons in buttons etc. are not lost, using innerHTML.
                element.innerHTML = translations[lang][key];
            }
        }
    });

    // Special case for page title
    const pageTitleElement = document.querySelector('title');
    if (pageTitleElement) {
        const baseTitleKey = pageTitleElement.getAttribute('data-translate-key-titlebase');
        const suffixKey = pageTitleElement.getAttribute('data-translate-key-suffix');
        let newTitle = "";
        if (baseTitleKey && translations[lang] && translations[lang][baseTitleKey]) {
            newTitle += translations[lang][baseTitleKey];
        }
        if (suffixKey && translations[lang] && translations[lang][suffixKey]) {
            if (newTitle) newTitle += " | ";
            newTitle += translations[lang][suffixKey];
        }
        if (newTitle) pageTitleElement.textContent = newTitle;
    }

    // Update lang switcher text directly
    const langSwitcher = document.getElementById('langSwitcher');
    if(langSwitcher && translations[lang]["langSwitcherText"]) {
        langSwitcher.textContent = translations[lang]["langSwitcherText"];
    }

    // Update theme toggle title
    const themeToggle = document.getElementById('themeToggle');
    if(themeToggle && translations[lang]["themeToggleTitle"]) {
        themeToggle.title = translations[lang]["themeToggleTitle"];
    }
}

