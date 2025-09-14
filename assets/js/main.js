// Main JavaScript for PitchDeck Documentation Site
class PitchDeckApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentSection = 'getting-started';
        this.uploadedFiles = [];
        
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupSearch();
        this.setupFileUpload();
        this.setupEventListeners();
        
        // Initialize sections
        this.showSection(this.currentSection);
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');
        
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.showSection(target);
                this.setActiveNavItem(link);
                
                // Close mobile menu if open
                this.closeMobileMenu();
            });
        });

        // Handle internal links
        document.addEventListener('click', (e) => {
            if (e.target.matches('.internal-link')) {
                e.preventDefault();
                const target = e.target.getAttribute('href').substring(1);
                this.showSection(target);
                this.setActiveNavItem(document.querySelector(`[href="#${target}"]`));
            }
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }
        
        // Update navigation
        const navLink = document.querySelector(`[href="#${sectionId}"]`);
        if (navLink) {
            this.setActiveNavItem(navLink);
        }
    }

    setActiveNavItem(activeLink) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to parent nav item
        if (activeLink) {
            activeLink.closest('.nav-item').classList.add('active');
        }
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.remove('open');
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }

    closeMobileMenu() {
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('open');
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.clearSearchResults();
            return;
        }

        // Simple search implementation
        const sections = document.querySelectorAll('.content-section');
        let results = [];

        sections.forEach(section => {
            const sectionId = section.id;
            const sectionTitle = section.querySelector('h1')?.textContent || '';
            const sectionContent = section.textContent.toLowerCase();
            
            if (sectionContent.includes(query.toLowerCase())) {
                results.push({
                    id: sectionId,
                    title: sectionTitle,
                    type: 'section'
                });
            }
        });

        this.displaySearchResults(results, query);
    }

    displaySearchResults(results, query) {
        // This would typically show a dropdown or modal with results
        // For now, we'll just highlight the first result
        if (results.length > 0) {
            console.log(`Found ${results.length} results for "${query}"`);
        }
    }

    clearSearchResults() {
        // Clear any search results UI
    }

    setupFileUpload() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        const uploadBtn = document.getElementById('uploadBtn');

        // Click to upload
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });
        }

        if (uploadZone) {
            uploadZone.addEventListener('click', () => {
                fileInput.click();
            });
        }

        // File input change
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const files = e.target.files;
                if (files.length > 0) {
                    this.handleFileUpload(files[0]);
                }
            });
        }

        // Drag and drop
        if (uploadZone) {
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });

            uploadZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
            });

            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileUpload(files[0]);
                }
            });
        }
    }

    async handleFileUpload(file) {
        // Validate file type
        if (!file.name.toLowerCase().endsWith('.pptx')) {
            this.showNotification('Please upload a .pptx file', 'error');
            return;
        }

        // Validate file size (50MB limit)
        const maxSize = 50 * 1024 * 1024; // 50MB in bytes
        if (file.size > maxSize) {
            this.showNotification('File size must be less than 50MB', 'error');
            return;
        }

        try {
            this.showLoadingState(true);
            
            // Process the file
            const processedFile = await this.processFile(file);
            
            // Add to uploaded files
            this.uploadedFiles.push(processedFile);
            
            // Update UI
            this.updateUploadedFilesList();
            this.showNotification('File uploaded successfully!', 'success');
            
            // Automatically show the presentation
            this.loadPresentation(processedFile);
            
        } catch (error) {
            console.error('Error uploading file:', error);
            this.showNotification('Error uploading file. Please try again.', 'error');
        } finally {
            this.showLoadingState(false);
        }
    }

    async processFile(file) {
        // Use the enhanced PPTX processor
        if (!this.pptxProcessor) {
            this.pptxProcessor = new PPTXProcessor();
        }
        
        return await this.pptxProcessor.processFile(file);
    }

    updateUploadedFilesList() {
        const uploadedFilesSection = document.getElementById('uploadedFiles');
        const fileList = document.getElementById('fileList');
        
        if (this.uploadedFiles.length > 0) {
            uploadedFilesSection.style.display = 'block';
            
            fileList.innerHTML = this.uploadedFiles.map(file => `
                <div class="file-item">
                    <div class="file-info">
                        <i class="fas fa-file-powerpoint"></i>
                        <div class="file-details">
                            <h4>${file.name}</h4>
                            <p>${this.formatFileSize(file.size)} • ${this.formatDate(file.uploadDate)}</p>
                        </div>
                    </div>
                    <div class="file-actions">
                        <button class="btn-small btn-primary" onclick="app.loadPresentation(${JSON.stringify(file).replace(/"/g, '&quot;')})">
                            View
                        </button>
                        <button class="btn-small btn-secondary" onclick="app.removeFile(${file.id})">
                            Remove
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            uploadedFilesSection.style.display = 'none';
        }
    }

    loadPresentation(file) {
        if (window.PresentationViewer) {
            window.PresentationViewer.load(file);
            this.showSection('presentation-viewer');
        }
    }

    removeFile(fileId) {
        this.uploadedFiles = this.uploadedFiles.filter(file => file.id !== fileId);
        this.updateUploadedFilesList();
        this.showNotification('File removed', 'info');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showLoadingState(loading) {
        const uploadZone = document.getElementById('uploadZone');
        if (loading) {
            uploadZone.classList.add('loading');
            uploadZone.innerHTML = `
                <div class="upload-content">
                    <div class="spinner"></div>
                    <h3>Processing file...</h3>
                    <p>Please wait while we process your presentation</p>
                </div>
            `;
        } else {
            uploadZone.classList.remove('loading');
            uploadZone.innerHTML = `
                <div class="upload-content">
                    <i class="fas fa-cloud-upload-alt upload-icon"></i>
                    <h3>Drop your .pptx file here</h3>
                    <p>or <button class="upload-btn" id="uploadBtn">browse files</button></p>
                    <input type="file" id="fileInput" accept=".pptx" style="display: none;">
                </div>
            `;
            // Re-setup upload handlers
            this.setupFileUpload();
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'
        });

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Window resize handler
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                document.getElementById('sidebar').classList.remove('open');
            }
        });

        // Global function for section navigation
        window.showSection = (sectionId) => {
            this.showSection(sectionId);
        };
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PitchDeckApp();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PitchDeckApp;
}