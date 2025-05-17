/**
 * Optimized JavaScript file for Electronic Invitations System
 * This file combines and minifies multiple JS files to improve performance
 * Implements lazy loading for images and deferred script loading
 */

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionality
    initializeThemeToggle();
    initializeLanguageSwitcher();
    initializeDropdowns();
    initializeFormValidation();
    initializeToasts();
    initializeAccessibility();
    
    // Apply translations based on current language
    applyTranslations();
    
    // Initialize lazy loading for images
    initializeLazyLoading();
    
    // Initialize performance optimizations
    deferNonCriticalScripts();
    enableLocalStorage();
});

/**
 * Theme Toggle Functionality
 * Switches between light and dark themes
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme on page load
    if (currentTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i><span class="sr-only">تبديل للوضع الفاتح</span>';
        }
    }
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon
            themeToggle.innerHTML = newTheme === 'dark' 
                ? '<i class="fas fa-sun" aria-hidden="true"></i><span class="sr-only">تبديل للوضع الفاتح</span>' 
                : '<i class="fas fa-moon" aria-hidden="true"></i><span class="sr-only">تبديل للوضع الداكن</span>';
        });
    }
}

/**
 * Language Switcher Functionality
 * Toggles between Arabic and English
 */
function initializeLanguageSwitcher() {
    const langSwitcher = document.getElementById('langSwitcher');
    const htmlElement = document.documentElement;
    const currentLang = localStorage.getItem('lang') || 'ar';
    
    // Apply saved language on page load
    htmlElement.setAttribute('lang', currentLang);
    htmlElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    
    if (langSwitcher) {
        langSwitcher.textContent = currentLang === 'ar' ? 'EN' : 'ع';
        
        // Toggle language on button click
        langSwitcher.addEventListener('click', function() {
            const currentLang = htmlElement.getAttribute('lang') || 'ar';
            const newLang = currentLang === 'ar' ? 'en' : 'ar';
            
            htmlElement.setAttribute('lang', newLang);
            htmlElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
            localStorage.setItem('lang', newLang);
            
            // Update button text
            langSwitcher.textContent = newLang === 'ar' ? 'EN' : 'ع';
            
            // Apply translations
            applyTranslations();
        });
    }
}

/**
 * Dropdown Menu Functionality
 * Handles all dropdown menus in the application
 */
function initializeDropdowns() {
    // Profile dropdown
    const profileToggle = document.getElementById('profileToggle');
    const profileMenu = document.getElementById('profileMenu');
    
    if (profileToggle && profileMenu) {
        profileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            profileMenu.classList.toggle('show');
            
            // Update ARIA attributes
            const isExpanded = profileMenu.classList.contains('show');
            profileToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileToggle.contains(e.target) && !profileMenu.contains(e.target)) {
                profileMenu.classList.remove('show');
                profileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Mobile sidebar toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            if (mobileOverlay) {
                mobileOverlay.classList.toggle('show');
            }
            
            // Update ARIA attributes
            const isExpanded = sidebar.classList.contains('show');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close sidebar when clicking on overlay
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', function() {
                sidebar.classList.remove('show');
                mobileOverlay.classList.remove('show');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        }
    }
}

/**
 * Form Validation
 * Provides client-side validation for forms
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Validate required fields
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    showFieldError(field, 'هذا الحقل مطلوب');
                } else {
                    clearFieldError(field);
                }
            });
            
            // Validate email fields
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                if (field.value.trim() && !isValidEmail(field.value)) {
                    isValid = false;
                    showFieldError(field, 'يرجى إدخال بريد إلكتروني صحيح');
                }
            });
            
            // Validate password confirmation
            const password = form.querySelector('#password');
            const confirmPassword = form.querySelector('#confirm_password');
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                isValid = false;
                showFieldError(confirmPassword, 'كلمات المرور غير متطابقة');
            }
            
            // Prevent form submission if validation fails
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
}

/**
 * Show field error message
 * @param {HTMLElement} field - The form field with error
 * @param {string} message - Error message to display
 */
function showFieldError(field, message) {
    // Clear any existing error
    clearFieldError(field);
    
    // Add error class to field
    field.classList.add('is-invalid');
    
    // Create and append error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

/**
 * Clear field error message
 * @param {HTMLElement} field - The form field to clear error from
 */
function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.form-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Toast Notification System
 * Displays temporary notifications to users
 */
function initializeToasts() {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.querySelector('.toast-container');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    // Create toast content
    toast.innerHTML = `
        <div class="toast__content">
            <span class="toast__icon">
                ${getToastIcon(type)}
            </span>
            <span class="toast__message">${message}</span>
        </div>
        <button class="toast__close" aria-label="إغلاق">&times;</button>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Close button functionality
    const closeBtn = toast.querySelector('.toast__close');
    closeBtn.addEventListener('click', () => {
        closeToast(toast);
    });
    
    // Auto close after duration
    setTimeout(() => {
        closeToast(toast);
    }, duration);
}

/**
 * Close toast notification
 * @param {HTMLElement} toast - Toast element to close
 */
function closeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        toast.remove();
    }, 300);
}

/**
 * Get icon for toast notification
 * @param {string} type - Toast type
 * @returns {string} - HTML for icon
 */
function getToastIcon(type) {
    switch (type) {
        case 'success':
            return '<i class="fas fa-check-circle" aria-hidden="true"></i>';
        case 'error':
            return '<i class="fas fa-exclamation-circle" aria-hidden="true"></i>';
        case 'warning':
            return '<i class="fas fa-exclamation-triangle" aria-hidden="true"></i>';
        case 'info':
        default:
            return '<i class="fas fa-info-circle" aria-hidden="true"></i>';
    }
}

/**
 * Accessibility Enhancements
 * Improves keyboard navigation and screen reader support
 */
function initializeAccessibility() {
    // Add aria-current to active navigation items
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.sidebar__nav-item');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.endsWith(href)) {
            link.setAttribute('aria-current', 'page');
            link.classList.add('sidebar__nav-item--active');
        }
    });
    
    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
    interactiveElements.forEach(element => {
        if (!element.hasAttribute('tabindex') && element.style.display !== 'none' && element.style.visibility !== 'hidden') {
            element.setAttribute('tabindex', '0');
        }
    });
    
    // Add skip to content functionality
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    }
}

/**
 * Apply translations based on current language
 * Uses translations from translations.js
 */
function applyTranslations() {
    if (typeof translations === 'undefined') {
        console.warn('Translations not loaded');
        return;
    }
    
    const currentLang = document.documentElement.getAttribute('lang') || 'ar';
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
    
    // Handle title suffix for pages
    const titleBase = document.querySelector('[data-translate-key-titlebase]');
    const titleSuffix = document.querySelector('[data-translate-key-suffix]');
    
    if (titleBase && titleSuffix) {
        const baseKey = titleBase.getAttribute('data-translate-key-titlebase');
        const suffixKey = titleSuffix.getAttribute('data-translate-key-suffix');
        
        if (translations[currentLang] && translations[currentLang][baseKey] && translations[currentLang][suffixKey]) {
            document.title = `${translations[currentLang][baseKey]} | ${translations[currentLang][suffixKey]}`;
        }
    }
}

/**
 * Logout functionality
 * Handles user logout process
 */
function handleLogout() {
    const logoutLink = document.getElementById('logoutLink');
    
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show confirmation dialog
            if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                // In a real application, this would make an API call to logout
                // For now, just redirect to login page
                window.location.href = '../login.html';
            }
        });
    }
}

/**
 * Initialize lazy loading for images
 * Only loads images when they are about to enter the viewport
 */
function initializeLazyLoading() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    
                    // If there's a data-srcset attribute, set that too
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        // Load all images immediately
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
            img.classList.add('loaded');
        });
    }
}

/**
 * Defer loading of non-critical scripts
 * Improves initial page load performance
 */
function deferNonCriticalScripts() {
    // List of non-critical scripts to load after page load
    const nonCriticalScripts = [
        // Add paths to non-critical scripts here
    ];
    
    // Load scripts after a short delay
    setTimeout(() => {
        nonCriticalScripts.forEach(scriptSrc => {
            const script = document.createElement('script');
            script.src = scriptSrc;
            script.async = true;
            document.body.appendChild(script);
        });
    }, 1000); // 1 second delay
}

/**
 * Enable local storage for caching
 * Stores frequently used data to reduce server requests
 */
function enableLocalStorage() {
    // Check if localStorage is supported
    if (typeof(Storage) !== "undefined") {
        // Cache expiration time (24 hours in milliseconds)
        const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;
        
        // Clear expired cache items
        clearExpiredCache();
        
        // Example of storing data with expiration
        // storeWithExpiration('key', 'value');
    }
}

/**
 * Store data in localStorage with expiration
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
function storeWithExpiration(key, value) {
    const now = new Date().getTime();
    const item = {
        value: value,
        expiry: now + (24 * 60 * 60 * 1000) // 24 hours
    };
    localStorage.setItem(key, JSON.stringify(item));
}

/**
 * Get data from localStorage with expiration check
 * @param {string} key - Storage key
 * @returns {any} - Stored value or null if expired
 */
function getWithExpiration(key) {
    const itemStr = localStorage.getItem(key);
    
    // Return null if item doesn't exist
    if (!itemStr) {
        return null;
    }
    
    const item = JSON.parse(itemStr);
    const now = new Date().getTime();
    
    // Return null if expired
    if (now > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    
    return item.value;
}

/**
 * Clear expired cache items from localStorage
 */
function clearExpiredCache() {
    const now = new Date().getTime();
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const itemStr = localStorage.getItem(key);
        
        try {
            const item = JSON.parse(itemStr);
            
            // Check if item has expiry property
            if (item && item.expiry && now > item.expiry) {
                localStorage.removeItem(key);
            }
        } catch (e) {
            // Skip items that aren't JSON or don't have expiry
            continue;
        }
    }
}

// Initialize logout handler
document.addEventListener('DOMContentLoaded', handleLogout);
