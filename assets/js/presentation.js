// Presentation Viewer Module
class PresentationViewer {
    constructor() {
        this.currentPresentation = null;
        this.currentSlide = 0;
        this.slides = [];
        this.containerElement = null;
        
        this.init();
    }

    init() {
        this.containerElement = document.getElementById('presentationContainer');
        this.setupKeyboardNavigation();
    }

    load(presentationData) {
        this.currentPresentation = presentationData;
        this.slides = presentationData.slides || [];
        this.currentSlide = 0;
        
        this.renderViewer();
        this.updateSlideDisplay();
    }

    renderViewer() {
        if (!this.containerElement) return;

        this.containerElement.innerHTML = `
            <div class="slide-viewer">
                <div class="slide-container" id="slideContainer">
                    <img class="slide-image" id="slideImage" alt="Slide">
                </div>
                <div class="slide-controls">
                    <div class="slide-nav">
                        <button id="prevSlide" ${this.currentSlide === 0 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i> Previous
                        </button>
                        <button id="nextSlide" ${this.currentSlide >= this.slides.length - 1 ? 'disabled' : ''}>
                            Next <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="slide-info">
                        <span id="slideInfo">${this.currentSlide + 1} of ${this.slides.length}</span>
                    </div>
                </div>
                <div class="slide-thumbnails" id="slideThumbnails">
                    ${this.renderThumbnails()}
                </div>
            </div>
        `;

        this.setupViewerEventListeners();
    }

    renderThumbnails() {
        return this.slides.map((slide, index) => `
            <div class="slide-thumbnail ${index === this.currentSlide ? 'active' : ''}" 
                 data-slide="${index}" 
                 title="${slide.title}">
                <img src="${slide.thumbnail}" alt="${slide.title}">
            </div>
        `).join('');
    }

    setupViewerEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');
        const thumbnails = document.querySelectorAll('.slide-thumbnail');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Thumbnail navigation
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                const slideIndex = parseInt(thumbnail.dataset.slide);
                this.goToSlide(slideIndex);
            });
        });

        // Fullscreen on slide click
        const slideImage = document.getElementById('slideImage');
        if (slideImage) {
            slideImage.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.currentPresentation) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.slides.length - 1);
                    break;
                case 'f':
                case 'F11':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'Escape':
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                    break;
            }
        });
    }

    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.currentSlide++;
            this.updateSlideDisplay();
            this.updateNavigation();
            this.updateThumbnails();
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlideDisplay();
            this.updateNavigation();
            this.updateThumbnails();
        }
    }

    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.slides.length) {
            this.currentSlide = slideIndex;
            this.updateSlideDisplay();
            this.updateNavigation();
            this.updateThumbnails();
        }
    }

    updateSlideDisplay() {
        const slideImage = document.getElementById('slideImage');
        const slideInfo = document.getElementById('slideInfo');
        
        if (slideImage && this.slides[this.currentSlide]) {
            slideImage.src = this.slides[this.currentSlide].content;
            slideImage.alt = this.slides[this.currentSlide].title;
        }
        
        if (slideInfo) {
            slideInfo.textContent = `${this.currentSlide + 1} of ${this.slides.length}`;
        }
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentSlide === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentSlide >= this.slides.length - 1;
        }
    }

    updateThumbnails() {
        const thumbnails = document.querySelectorAll('.slide-thumbnail');
        
        thumbnails.forEach((thumbnail, index) => {
            if (index === this.currentSlide) {
                thumbnail.classList.add('active');
            } else {
                thumbnail.classList.remove('active');
            }
        });

        // Scroll active thumbnail into view
        const activeThumbnail = document.querySelector('.slide-thumbnail.active');
        if (activeThumbnail) {
            activeThumbnail.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    toggleFullscreen() {
        const slideContainer = document.getElementById('slideContainer');
        
        if (!document.fullscreenElement) {
            if (slideContainer.requestFullscreen) {
                slideContainer.requestFullscreen();
            } else if (slideContainer.webkitRequestFullscreen) {
                slideContainer.webkitRequestFullscreen();
            } else if (slideContainer.msRequestFullscreen) {
                slideContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    // Public API methods
    static load(presentationData) {
        if (!window.presentationViewer) {
            window.presentationViewer = new PresentationViewer();
        }
        
        window.presentationViewer.load(presentationData);
    }

    static nextSlide() {
        if (window.presentationViewer) {
            window.presentationViewer.nextSlide();
        }
    }

    static previousSlide() {
        if (window.presentationViewer) {
            window.presentationViewer.previousSlide();
        }
    }

    static goToSlide(slideNumber) {
        if (window.presentationViewer) {
            window.presentationViewer.goToSlide(slideNumber);
        }
    }

    static getCurrentSlide() {
        return window.presentationViewer ? window.presentationViewer.currentSlide : 0;
    }

    static getTotalSlides() {
        return window.presentationViewer ? window.presentationViewer.slides.length : 0;
    }
}

// Initialize presentation viewer
document.addEventListener('DOMContentLoaded', () => {
    window.PresentationViewer = PresentationViewer;
    
    // Initialize the instance
    if (!window.presentationViewer) {
        window.presentationViewer = new PresentationViewer();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PresentationViewer;
}