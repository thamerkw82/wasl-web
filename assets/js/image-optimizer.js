/**
 * Image Optimization Module for Electronic Invitations System
 * This script handles image optimization, lazy loading, and responsive images
 */

// Initialize image optimization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    setupResponsiveImages();
    optimizeImageLoading();
});

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
                    
                    // Set src from data-src
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    
                    // Set srcset from data-srcset if available
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    
                    // Remove lazy-image class to apply loaded styles
                    img.classList.remove('lazy-image');
                    img.classList.add('loaded');
                    
                    // Stop observing the image
                    observer.unobserve(img);
                }
            });
        }, {
            // Root margin to start loading images before they enter viewport
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        // Load all images immediately
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
            img.classList.remove('lazy-image');
            img.classList.add('loaded');
        });
    }
}

/**
 * Setup responsive images with appropriate srcset and sizes
 * Ensures optimal image size is loaded based on device
 */
function setupResponsiveImages() {
    const responsiveImages = document.querySelectorAll('img[data-responsive]');
    
    responsiveImages.forEach(img => {
        const basePath = img.dataset.src.replace(/\.[^/.]+$/, '');
        const extension = img.dataset.src.match(/\.[^/.]+$/)[0];
        
        // Create srcset for different sizes
        const srcset = `
            ${basePath}-small${extension} 400w,
            ${basePath}-medium${extension} 800w,
            ${basePath}${extension} 1200w
        `;
        
        // Set sizes attribute based on image role
        let sizes;
        if (img.classList.contains('hero-image')) {
            sizes = '(max-width: 600px) 100vw, (max-width: 1200px) 80vw, 1200px';
        } else if (img.classList.contains('thumbnail')) {
            sizes = '(max-width: 600px) 50vw, (max-width: 1200px) 33vw, 400px';
        } else {
            sizes = '(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 800px';
        }
        
        // Apply attributes
        img.setAttribute('srcset', srcset);
        img.setAttribute('sizes', sizes);
    });
}

/**
 * Optimize image loading sequence
 * Prioritizes visible and critical images
 */
function optimizeImageLoading() {
    // Identify critical images (above the fold)
    const criticalImages = document.querySelectorAll('img[data-critical="true"]');
    
    // Preload critical images
    criticalImages.forEach(img => {
        if (img.dataset.src) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = img.dataset.src;
            document.head.appendChild(preloadLink);
            
            // Set src immediately for critical images
            img.src = img.dataset.src;
            img.classList.remove('lazy-image');
            img.classList.add('loaded');
        }
    });
    
    // Defer loading of non-critical background images
    const bgElements = document.querySelectorAll('[data-bg]');
    
    if ('IntersectionObserver' in window) {
        const bgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.style.backgroundImage = `url(${element.dataset.bg})`;
                    observer.unobserve(element);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        bgElements.forEach(element => {
            bgObserver.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        bgElements.forEach(element => {
            element.style.backgroundImage = `url(${element.dataset.bg})`;
        });
    }
}

/**
 * Generate low-quality image placeholder
 * Creates a blurred placeholder while the main image loads
 * @param {string} src - Image source URL
 * @param {function} callback - Callback function with placeholder data URL
 */
function generateImagePlaceholder(src, callback) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        // Create a small canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set small dimensions for placeholder
        canvas.width = 20;
        canvas.height = 20 * (img.height / img.width);
        
        // Draw small blurry version
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get data URL
        const placeholderUrl = canvas.toDataURL('image/jpeg', 0.5);
        callback(placeholderUrl);
    };
    
    img.onerror = function() {
        console.error('Error generating placeholder for:', src);
        callback(null);
    };
    
    img.src = src;
}

/**
 * Apply image placeholder to element
 * @param {HTMLElement} element - Element to apply placeholder to
 * @param {string} src - Main image source
 */
function applyImagePlaceholder(element, src) {
    generateImagePlaceholder(src, function(placeholderUrl) {
        if (placeholderUrl) {
            if (element.tagName === 'IMG') {
                element.src = placeholderUrl;
                element.classList.add('placeholder-image');
                
                // Load the real image
                const realImg = new Image();
                realImg.onload = function() {
                    element.src = src;
                    element.classList.remove('placeholder-image');
                    element.classList.add('loaded');
                };
                realImg.src = src;
            } else {
                // For background images
                element.style.backgroundImage = `url(${placeholderUrl})`;
                element.classList.add('placeholder-bg');
                
                // Load the real background image
                const realImg = new Image();
                realImg.onload = function() {
                    element.style.backgroundImage = `url(${src})`;
                    element.classList.remove('placeholder-bg');
                    element.classList.add('loaded-bg');
                };
                realImg.src = src;
            }
        }
    });
}

/**
 * Create WebP version of image if browser supports it
 * @param {string} src - Original image source
 * @returns {string} - WebP source if supported, original otherwise
 */
function getOptimalImageFormat(src) {
    // Check WebP support
    const webpSupported = document.createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') === 0;
    
    if (webpSupported && !src.endsWith('.svg') && !src.endsWith('.gif')) {
        // Replace extension with .webp
        return src.replace(/\.(jpe?g|png)$/i, '.webp');
    }
    
    return src;
}

// Export functions for use in other modules
window.imageOptimizer = {
    lazyLoad: initializeLazyLoading,
    setupResponsive: setupResponsiveImages,
    optimize: optimizeImageLoading,
    generatePlaceholder: generateImagePlaceholder,
    applyPlaceholder: applyImagePlaceholder,
    getOptimalFormat: getOptimalImageFormat
};
