/**
 * Live Invitation Preview Module
 * Provides real-time preview of invitations with device simulation
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initLivePreview();
    setupPreviewControls();
    setupColorPickers();
    setupFontSelectors();
    setupLayoutOptions();
    setupImageUploader();
    setupTextEditors();
});

/**
 * Initialize the live preview functionality
 */
function initLivePreview() {
    // Get preview container and editor elements
    const previewContainer = document.getElementById('previewContainer');
    const editorContainer = document.getElementById('editorContainer');
    
    if (!previewContainer || !editorContainer) return;
    
    // Set up initial preview content
    updatePreview();
    
    // Set up event delegation for all editor inputs
    editorContainer.addEventListener('input', function(e) {
        // Debounce preview updates for better performance
        clearTimeout(window.previewUpdateTimeout);
        window.previewUpdateTimeout = setTimeout(function() {
            updatePreview();
        }, 300);
    });
    
    // Handle template selection changes
    const templateSelector = document.getElementById('templateSelector');
    if (templateSelector) {
        templateSelector.addEventListener('change', function() {
            loadTemplate(this.value);
        });
    }
}

/**
 * Update the invitation preview based on current editor values
 */
function updatePreview() {
    const previewFrame = document.getElementById('previewFrame');
    const previewContainer = document.getElementById('previewContainer');
    
    if (!previewFrame || !previewContainer) return;
    
    // Get all form inputs
    const title = document.getElementById('invitationTitle')?.value || 'عنوان الدعوة';
    const subtitle = document.getElementById('invitationSubtitle')?.value || 'عنوان فرعي للدعوة';
    const date = document.getElementById('eventDate')?.value || '01/01/2025';
    const time = document.getElementById('eventTime')?.value || '7:00 مساءً';
    const location = document.getElementById('eventLocation')?.value || 'موقع الحدث';
    const description = document.getElementById('eventDescription')?.value || 'وصف الحدث والتفاصيل الإضافية';
    
    // Get selected styles
    const primaryColor = document.getElementById('primaryColor')?.value || '#4a6da7';
    const secondaryColor = document.getElementById('secondaryColor')?.value || '#5a8dee';
    const fontFamily = document.getElementById('fontFamily')?.value || 'Cairo, sans-serif';
    const layoutStyle = document.querySelector('input[name="layoutStyle"]:checked')?.value || 'centered';
    
    // Get selected template
    const template = document.getElementById('templateSelector')?.value || 'default';
    
    // Build HTML content for preview
    let previewHTML = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                /* Base styles */
                body {
                    font-family: ${fontFamily};
                    margin: 0;
                    padding: 0;
                    color: #333;
                    background-color: #f8f9fa;
                    text-align: center;
                }
                
                .invitation-container {
                    max-width: 100%;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                }
                
                /* Template-specific styles */
                ${getTemplateStyles(template, primaryColor, secondaryColor, layoutStyle)}
                
                /* Layout styles */
                ${getLayoutStyles(layoutStyle)}
                
                /* Responsive styles */
                @media (max-width: 768px) {
                    .invitation-header h1 {
                        font-size: 1.8rem;
                    }
                    
                    .invitation-header h2 {
                        font-size: 1.2rem;
                    }
                    
                    .invitation-details {
                        flex-direction: column;
                    }
                    
                    .detail-item {
                        margin-bottom: 10px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="invitation-container ${template}-template">
                ${getTemplateHTML(template, title, subtitle, date, time, location, description)}
            </div>
        </body>
        </html>
    `;
    
    // Update preview frame content
    const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(previewHTML);
    frameDoc.close();
    
    // Update preview status
    const previewStatus = document.getElementById('previewStatus');
    if (previewStatus) {
        previewStatus.textContent = 'تم تحديث المعاينة';
        previewStatus.classList.add('updated');
        
        // Remove updated class after animation
        setTimeout(() => {
            previewStatus.classList.remove('updated');
        }, 1000);
    }
}

/**
 * Get template-specific styles
 * @param {string} template - Template name
 * @param {string} primaryColor - Primary color
 * @param {string} secondaryColor - Secondary color
 * @param {string} layoutStyle - Layout style
 * @returns {string} - CSS styles
 */
function getTemplateStyles(template, primaryColor, secondaryColor, layoutStyle) {
    switch (template) {
        case 'wedding':
            return `
                .invitation-container {
                    background-color: #fff;
                    border: 1px solid ${primaryColor};
                    border-radius: 8px;
                    padding: 30px;
                    position: relative;
                    overflow: hidden;
                }
                
                .invitation-container::before,
                .invitation-container::after {
                    content: '';
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    background: ${primaryColor}10;
                    border-radius: 50%;
                    z-index: 0;
                }
                
                .invitation-container::before {
                    top: -100px;
                    right: -100px;
                }
                
                .invitation-container::after {
                    bottom: -100px;
                    left: -100px;
                }
                
                .invitation-header {
                    position: relative;
                    z-index: 1;
                    margin-bottom: 30px;
                }
                
                .invitation-header h1 {
                    color: ${primaryColor};
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                    font-weight: 700;
                }
                
                .invitation-header h2 {
                    color: ${secondaryColor};
                    font-size: 1.8rem;
                    margin-top: 0;
                    font-weight: 500;
                }
                
                .invitation-couple {
                    font-size: 2.2rem;
                    color: ${primaryColor};
                    margin: 20px 0;
                    font-weight: 700;
                    position: relative;
                    z-index: 1;
                }
                
                .invitation-couple::before,
                .invitation-couple::after {
                    content: '♥';
                    color: ${secondaryColor};
                    margin: 0 10px;
                    font-size: 1.5rem;
                    vertical-align: middle;
                }
                
                .invitation-text {
                    position: relative;
                    z-index: 1;
                    margin: 20px 0;
                    font-size: 1.2rem;
                    line-height: 1.6;
                }
                
                .invitation-details {
                    display: flex;
                    justify-content: space-around;
                    margin: 30px 0;
                    flex-wrap: wrap;
                }
                
                .detail-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 0 15px;
                }
                
                .detail-item i {
                    font-size: 2rem;
                    color: ${primaryColor};
                    margin-bottom: 10px;
                }
                
                .detail-item span {
                    font-size: 1.1rem;
                }
                
                .invitation-footer {
                    margin-top: 30px;
                    position: relative;
                    z-index: 1;
                }
                
                .rsvp-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 20px;
                }
                
                .rsvp-btn {
                    padding: 10px 25px;
                    border: none;
                    border-radius: 30px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .rsvp-yes {
                    background-color: ${primaryColor};
                    color: white;
                }
                
                .rsvp-no {
                    background-color: #f8f9fa;
                    color: #333;
                    border: 1px solid #ddd;
                }
                
                .rsvp-yes:hover {
                    background-color: ${secondaryColor};
                }
                
                .rsvp-no:hover {
                    background-color: #e9ecef;
                }
            `;
            
        case 'conference':
            return `
                .invitation-container {
                    background-color: #fff;
                    border-radius: 4px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    padding: 25px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .invitation-header {
                    border-bottom: 2px solid ${primaryColor};
                    padding-bottom: 20px;
                    margin-bottom: 25px;
                }
                
                .conference-logo {
                    max-width: 150px;
                    margin: 0 auto 15px;
                }
                
                .conference-logo img {
                    max-width: 100%;
                    height: auto;
                }
                
                .invitation-header h1 {
                    color: ${secondaryColor};
                    font-size: 1.5rem;
                    margin-bottom: 10px;
                    font-weight: 500;
                }
                
                .invitation-header h2 {
                    color: ${primaryColor};
                    font-size: 2rem;
                    margin-top: 0;
                    font-weight: 700;
                }
                
                .invitation-text {
                    margin: 20px 0;
                    font-size: 1.1rem;
                    line-height: 1.6;
                    color: #555;
                }
                
                .invitation-details {
                    display: flex;
                    justify-content: space-between;
                    margin: 25px 0;
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 4px;
                }
                
                .detail-item {
                    display: flex;
                    align-items: center;
                }
                
                .detail-item i {
                    font-size: 1.5rem;
                    color: ${primaryColor};
                    margin-left: 10px;
                }
                
                .detail-item span {
                    font-size: 1rem;
                }
                
                .invitation-agenda {
                    margin: 25px 0;
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 4px;
                }
                
                .invitation-agenda h3 {
                    color: ${primaryColor};
                    margin-top: 0;
                    margin-bottom: 15px;
                    font-size: 1.3rem;
                }
                
                .invitation-agenda ul {
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                }
                
                .invitation-agenda li {
                    padding: 8px 0;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .invitation-agenda li:last-child {
                    border-bottom: none;
                }
                
                .invitation-footer {
                    margin-top: 25px;
                    border-top: 1px solid #e9ecef;
                    padding-top: 20px;
                }
                
                .rsvp-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .rsvp-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .rsvp-yes {
                    background-color: ${primaryColor};
                    color: white;
                }
                
                .rsvp-no {
                    background-color: #f8f9fa;
                    color: #333;
                    border: 1px solid #ddd;
                }
                
                .invitation-contact {
                    font-size: 0.9rem;
                    color: #6c757d;
                    text-align: center;
                }
            `;
            
        case 'birthday':
            return `
                .invitation-container {
                    background-color: #fff;
                    border-radius: 20px;
                    padding: 30px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }
                
                .birthday-decoration {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    z-index: 0;
                    opacity: 0.1;
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="10" cy="10" r="5" fill="${primaryColor.replace('#', '%23')}"/><circle cx="30" cy="30" r="8" fill="${secondaryColor.replace('#', '%23')}"/><circle cx="50" cy="10" r="6" fill="${primaryColor.replace('#', '%23')}"/><circle cx="70" cy="30" r="7" fill="${secondaryColor.replace('#', '%23')}"/><circle cx="90" cy="10" r="5" fill="${primaryColor.replace('#', '%23')}"/></svg>');
                }
                
                .invitation-header {
                    position: relative;
                    z-index: 1;
                    margin-bottom: 30px;
                }
                
                .invitation-header h1 {
                    color: ${primaryColor};
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                    font-weight: 700;
                }
                
                .invitation-header h2 {
                    color: ${secondaryColor};
                    font-size: 1.8rem;
                    margin-top: 0;
                    font-weight: 500;
                }
                
                .birthday-person {
                    font-size: 2.2rem;
                    color: ${primaryColor};
                    margin: 20px 0;
                    font-weight: 700;
                    position: relative;
                    z-index: 1;
                }
                
                .birthday-age {
                    display: inline-block;
                    background-color: ${primaryColor};
                    color: white;
                    width: 60px;
                    height: 60px;
                    line-height: 60px;
                    border-radius: 50%;
                    font-size: 1.8rem;
                    font-weight: bold;
                    margin: 0 10px;
                }
                
                .invitation-text {
                    position: relative;
                    z-index: 1;
                    margin: 20px 0;
                    font-size: 1.2rem;
                    line-height: 1.6;
                }
                
                .invitation-details {
                    display: flex;
                    justify-content: space-around;
                    margin: 30px 0;
                    flex-wrap: wrap;
                    position: relative;
                    z-index: 1;
                }
                
                .detail-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 0 15px;
                }
                
                .detail-item i {
                    font-size: 2rem;
                    color: ${primaryColor};
                    margin-bottom: 10px;
                }
                
                .detail-item span {
                    font-size: 1.1rem;
                }
                
                .invitation-footer {
                    margin-top: 30px;
                    position: relative;
                    z-index: 1;
                }
                
                .rsvp-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 20px;
                }
                
                .rsvp-btn {
                    padding: 10px 25px;
                    border: none;
                    border-radius: 30px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .rsvp-yes {
                    background-color: ${primaryColor};
                    color: white;
                }
                
                .rsvp-no {
                    background-color: #f8f9fa;
                    color: #333;
                    border: 1px solid #ddd;
                }
            `;
            
        default: // Default template
            return `
                .invitation-container {
                    background-color: #fff;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    padding: 25px;
                }
                
                .invitation-header {
                    margin-bottom: 25px;
                }
                
                .invitation-header h1 {
                    color: ${primaryColor};
                    font-size: 2rem;
                    margin-bottom: 10px;
                }
                
                .invitation-header h2 {
                    color: ${secondaryColor};
                    font-size: 1.5rem;
                    margin-top: 0;
                }
                
                .invitation-text {
                    margin: 20px 0;
                    font-size: 1.1rem;
                    line-height: 1.6;
                }
                
                .invitation-details {
                    display: flex;
                    justify-content: space-around;
                    margin: 25px 0;
                    flex-wrap: wrap;
                }
                
                .detail-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 10px;
                }
                
                .detail-item i {
                    font-size: 1.8rem;
                    color: ${primaryColor};
                    margin-bottom: 10px;
                }
                
                .detail-item span {
                    font-size: 1rem;
                }
                
                .invitation-footer {
                    margin-top: 25px;
                    border-top: 1px solid #e9ecef;
                    padding-top: 20px;
                }
                
                .rsvp-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                }
                
                .rsvp-btn {
                    padding: 8px 20px;
                    border: none;
                    border-radius: 4px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .rsvp-yes {
                    background-color: ${primaryColor};
                    color: white;
                }
                
                .rsvp-no {
                    background-color: #f8f9fa;
                    color: #333;
                    border: 1px solid #ddd;
                }
            `;
    }
}

/**
 * Get layout-specific styles
 * @param {string} layoutStyle - Layout style
 * @returns {string} - CSS styles
 */
function getLayoutStyles(layoutStyle) {
    switch (layoutStyle) {
        case 'centered':
            return `
                .invitation-container {
                    text-align: center;
                }
                
                .invitation-details {
                    justify-content: center;
                }
            `;
            
        case 'right-aligned':
            return `
                .invitation-container {
                    text-align: right;
                }
                
                .invitation-details {
                    justify-content: flex-start;
                }
                
                .detail-item {
                    align-items: flex-start;
                }
            `;
            
        case 'left-aligned':
            return `
                .invitation-container {
                    text-align: left;
                }
                
                .invitation-details {
                    justify-content: flex-end;
                }
                
                .detail-item {
                    align-items: flex-end;
                }
            `;
            
        default:
            return '';
    }
}

/**
 * Get template-specific HTML
 * @param {string} template - Template name
 * @param {string} title - Invitation title
 * @param {string} subtitle - Invitation subtitle
 * @param {string} date - Event date
 * @param {string} time - Event time
 * @param {string} location - Event location
 * @param {string} description - Event description
 * @returns {string} - HTML content
 */
function getTemplateHTML(template, title, subtitle, date, time, location, description) {
    switch (template) {
        case 'wedding':
            return `
                <div class="invitation-header">
                    <h1>${title}</h1>
                    <h2>${subtitle}</h2>
                </div>
                
                <div class="invitation-couple">
                    محمد & سارة
                </div>
                
                <div class="invitation-text">
                    <p>${description}</p>
                    
                    <div class="invitation-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${date}</span>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>${time}</span>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${location}</span>
                        </div>
                    </div>
                </div>
                
                <div class="invitation-footer">
                    <div class="rsvp-buttons">
                        <button class="rsvp-btn rsvp-yes">سأحضر</button>
                        <button class="rsvp-btn rsvp-no">أعتذر عن الحضور</button>
                    </div>
                </div>
            `;
            
        case 'conference':
            return `
                <div class="invitation-header">
                    <div class="conference-logo">
                        <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' rx='10' fill='%234a6da7'/><text x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' fill='white' dominant-baseline='middle'>LOGO</text></svg>" alt="شعار المؤتمر">
                    </div>
                    <h1>${subtitle}</h1>
                    <h2>${title}</h2>
                </div>
                
                <div class="invitation-text">
                    <p>${description}</p>
                    
                    <div class="invitation-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${date}</span>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>${time}</span>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${location}</span>
                        </div>
                    </div>
                </div>
                
                <div class="invitation-agenda">
                    <h3>البرنامج</h3>
                    <ul>
                        <li><strong>9:00 - 10:00</strong>: التسجيل والإفطار</li>
                        <li><strong>10:00 - 12:00</strong>: الجلسات الصباحية</li>
                        <li><strong>12:00 - 1:00</strong>: استراحة الغداء</li>
                        <li><strong>1:00 - 4:00</strong>: الجلسات المسائية</li>
                        <li><strong>4:00 - 5:00</strong>: الختام والتواصل</li>
                    </ul>
                </div>
                
                <div class="invitation-footer">
                    <div class="rsvp-buttons">
                        <button class="rsvp-btn rsvp-yes">تأكيد الحضور</button>
                        <button class="rsvp-btn rsvp-no">الاعتذار</button>
                    </div>
                    
                    <div class="invitation-contact">
                        <p>للاستفسار: info@example.com | +966 12 345 6789</p>
                    </div>
                </div>
            `;
            
        case 'birthday':
            return `
                <div class="birthday-decoration"></div>
                
                <div class="invitation-header">
                    <h1>${title}</h1>
                    <h2>${subtitle}</h2>
                </div>
                
                <div class="birthday-person">
                    عيد ميلاد <span class="birthday-age">30</span> سعيد
                </div>
                
                <div class="invitation-text">
                    <p>${description}</p>
                    
                    <div class="invitation-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${date}</span>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>${time}</span>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${location}</span>
                        </div>
                    </div>
                </div>
                
                <div class="invitation-footer">
                    <div class="rsvp-buttons">
                        <button class="rsvp-btn rsvp-yes">سأحضر</button>
                        <button class="rsvp-btn rsvp-no">أعتذر عن الحضور</button>
                    </div>
                </div>
            `;
            
        default: // Default template
            return `
                <div class="invitation-header">
                    <h1>${title}</h1>
                    <h2>${subtitle}</h2>
                </div>
                
                <div class="invitation-text">
                    <p>${description}</p>
                </div>
                
                <div class="invitation-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${date}</span>
                    </div>
                    
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${time}</span>
                    </div>
                    
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${location}</span>
                    </div>
                </div>
                
                <div class="invitation-footer">
                    <div class="rsvp-buttons">
                        <button class="rsvp-btn rsvp-yes">تأكيد الحضور</button>
                        <button class="rsvp-btn rsvp-no">الاعتذار</button>
                    </div>
                </div>
            `;
    }
}

/**
 * Set up preview controls (device simulation, etc.)
 */
function setupPreviewControls() {
    const deviceButtons = document.querySelectorAll('.preview-device-btn');
    const previewContainer = document.getElementById('previewContainer');
    
    if (!deviceButtons.length || !previewContainer) return;
    
    // Handle device button clicks
    deviceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            deviceButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get device type
            const device = this.getAttribute('data-device');
            
            // Update preview container class
            previewContainer.className = 'preview-container';
            previewContainer.classList.add(`preview-${device}`);
            
            // Update preview frame
            updatePreviewFrameSize(device);
        });
    });
    
    // Initialize with desktop view
    updatePreviewFrameSize('desktop');
}

/**
 * Update preview frame size based on device
 * @param {string} device - Device type (desktop, tablet, mobile)
 */
function updatePreviewFrameSize(device) {
    const previewFrame = document.getElementById('previewFrame');
    if (!previewFrame) return;
    
    switch (device) {
        case 'mobile':
            previewFrame.style.width = '375px';
            previewFrame.style.height = '667px';
            break;
            
        case 'tablet':
            previewFrame.style.width = '768px';
            previewFrame.style.height = '1024px';
            break;
            
        case 'desktop':
        default:
            previewFrame.style.width = '100%';
            previewFrame.style.height = '600px';
            break;
    }
}

/**
 * Set up color pickers
 */
function setupColorPickers() {
    const colorPickers = document.querySelectorAll('.color-picker');
    
    colorPickers.forEach(picker => {
        picker.addEventListener('input', function() {
            // Update color preview
            const colorPreview = this.parentElement.querySelector('.color-preview');
            if (colorPreview) {
                colorPreview.style.backgroundColor = this.value;
            }
            
            // Update preview
            updatePreview();
        });
    });
}

/**
 * Set up font selectors
 */
function setupFontSelectors() {
    const fontSelector = document.getElementById('fontFamily');
    if (!fontSelector) return;
    
    fontSelector.addEventListener('change', function() {
        // Update font preview
        const fontPreview = document.getElementById('fontPreview');
        if (fontPreview) {
            fontPreview.style.fontFamily = this.value;
        }
        
        // Update preview
        updatePreview();
    });
}

/**
 * Set up layout options
 */
function setupLayoutOptions() {
    const layoutOptions = document.querySelectorAll('input[name="layoutStyle"]');
    
    layoutOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Update preview
            updatePreview();
        });
    });
}

/**
 * Set up image uploader
 */
function setupImageUploader() {
    const imageUploader = document.getElementById('imageUploader');
    const uploadedImagePreview = document.getElementById('uploadedImagePreview');
    
    if (!imageUploader || !uploadedImagePreview) return;
    
    imageUploader.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Check if file is an image
        if (!file.type.match('image.*')) {
            alert('الرجاء اختيار ملف صورة صالح');
            return;
        }
        
        // Read file as data URL
        const reader = new FileReader();
        reader.onload = function(e) {
            // Update image preview
            uploadedImagePreview.src = e.target.result;
            uploadedImagePreview.style.display = 'block';
            
            // Store image data for preview
            document.getElementById('imageData').value = e.target.result;
            
            // Update preview
            updatePreview();
        };
        
        reader.readAsDataURL(file);
    });
}

/**
 * Set up text editors
 */
function setupTextEditors() {
    const textEditors = document.querySelectorAll('.rich-text-editor');
    
    textEditors.forEach(editor => {
        // Add basic formatting buttons
        const toolbar = document.createElement('div');
        toolbar.className = 'editor-toolbar';
        toolbar.innerHTML = `
            <button type="button" data-command="bold" title="غامق"><i class="fas fa-bold"></i></button>
            <button type="button" data-command="italic" title="مائل"><i class="fas fa-italic"></i></button>
            <button type="button" data-command="underline" title="تحته خط"><i class="fas fa-underline"></i></button>
            <button type="button" data-command="insertLineBreak" title="سطر جديد"><i class="fas fa-level-down-alt"></i></button>
        `;
        
        // Insert toolbar before editor
        editor.parentNode.insertBefore(toolbar, editor);
        
        // Add event listeners to toolbar buttons
        const buttons = toolbar.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const command = this.getAttribute('data-command');
                
                if (command === 'insertLineBreak') {
                    // Insert line break
                    editor.value += '\n';
                } else {
                    // Get selected text
                    const start = editor.selectionStart;
                    const end = editor.selectionEnd;
                    const selectedText = editor.value.substring(start, end);
                    
                    // Apply formatting
                    let formattedText = '';
                    switch (command) {
                        case 'bold':
                            formattedText = `**${selectedText}**`;
                            break;
                        case 'italic':
                            formattedText = `*${selectedText}*`;
                            break;
                        case 'underline':
                            formattedText = `_${selectedText}_`;
                            break;
                    }
                    
                    // Replace selected text with formatted text
                    editor.value = editor.value.substring(0, start) + formattedText + editor.value.substring(end);
                }
                
                // Update preview
                updatePreview();
                
                // Focus back on editor
                editor.focus();
            });
        });
    });
}

/**
 * Load template
 * @param {string} templateName - Template name
 */
function loadTemplate(templateName) {
    // Set default values based on template
    switch (templateName) {
        case 'wedding':
            document.getElementById('invitationTitle').value = 'دعوة حفل زفاف';
            document.getElementById('invitationSubtitle').value = 'يتشرفان بدعوتكم لحضور حفل زفافهما';
            document.getElementById('eventDate').value = '15/05/2025';
            document.getElementById('eventTime').value = '7:00 مساءً';
            document.getElementById('eventLocation').value = 'قاعة الأميرات - الرياض';
            document.getElementById('eventDescription').value = 'يسرنا دعوتكم لمشاركتنا فرحة العمر وحضور حفل زفافنا';
            document.getElementById('primaryColor').value = '#4a6da7';
            document.getElementById('secondaryColor').value = '#e63946';
            break;
            
        case 'conference':
            document.getElementById('invitationTitle').value = 'مؤتمر التكنولوجيا السنوي';
            document.getElementById('invitationSubtitle').value = 'دعوة لحضور';
            document.getElementById('eventDate').value = '22/05/2025';
            document.getElementById('eventTime').value = '9:00 صباحاً - 5:00 مساءً';
            document.getElementById('eventLocation').value = 'فندق الريتز - الرياض';
            document.getElementById('eventDescription').value = 'يسرنا دعوتكم لحضور مؤتمر التكنولوجيا السنوي الذي يجمع نخبة من الخبراء والمختصين في مجال التكنولوجيا والابتكار';
            document.getElementById('primaryColor').value = '#2c3e50';
            document.getElementById('secondaryColor').value = '#3498db';
            break;
            
        case 'birthday':
            document.getElementById('invitationTitle').value = 'دعوة عيد ميلاد';
            document.getElementById('invitationSubtitle').value = 'انضموا إلينا للاحتفال';
            document.getElementById('eventDate').value = '10/06/2025';
            document.getElementById('eventTime').value = '6:00 مساءً';
            document.getElementById('eventLocation').value = 'منزل العائلة - حي الورود';
            document.getElementById('eventDescription').value = 'يسعدنا دعوتكم لحضور حفل عيد الميلاد ومشاركتنا لحظات الفرح والسعادة';
            document.getElementById('primaryColor').value = '#e74c3c';
            document.getElementById('secondaryColor').value = '#f1c40f';
            break;
            
        default:
            document.getElementById('invitationTitle').value = 'عنوان الدعوة';
            document.getElementById('invitationSubtitle').value = 'عنوان فرعي للدعوة';
            document.getElementById('eventDate').value = '01/01/2025';
            document.getElementById('eventTime').value = '7:00 مساءً';
            document.getElementById('eventLocation').value = 'موقع الحدث';
            document.getElementById('eventDescription').value = 'وصف الحدث والتفاصيل الإضافية';
            document.getElementById('primaryColor').value = '#4a6da7';
            document.getElementById('secondaryColor').value = '#5a8dee';
            break;
    }
    
    // Update color previews
    const primaryColorPreview = document.querySelector('#primaryColor').parentElement.querySelector('.color-preview');
    const secondaryColorPreview = document.querySelector('#secondaryColor').parentElement.querySelector('.color-preview');
    
    if (primaryColorPreview) {
        primaryColorPreview.style.backgroundColor = document.getElementById('primaryColor').value;
    }
    
    if (secondaryColorPreview) {
        secondaryColorPreview.style.backgroundColor = document.getElementById('secondaryColor').value;
    }
    
    // Update preview
    updatePreview();
}

// Export functions for use in other modules
window.livePreview = {
    update: updatePreview,
    loadTemplate: loadTemplate
};
