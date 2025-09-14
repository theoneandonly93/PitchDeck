// Pitch Deck Navigation Script
let currentSlide = 1;
const totalSlides = 10;

// Initialize the presentation
document.addEventListener('DOMContentLoaded', function() {
    updateSlideDisplay();
    updateProgressBar();
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyPress);
    
    // Add touch/swipe support for mobile
    addTouchSupport();
    
    // Initialize slide counter
    document.getElementById('total-slides').textContent = totalSlides;
});

// Navigate to next slide
function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        updateSlideDisplay();
        updateProgressBar();
        updateNavButtons();
    }
}

// Navigate to previous slide
function previousSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        updateSlideDisplay();
        updateProgressBar();
        updateNavButtons();
    }
}

// Go to specific slide
function goToSlide(slideNumber) {
    if (slideNumber >= 1 && slideNumber <= totalSlides) {
        currentSlide = slideNumber;
        updateSlideDisplay();
        updateProgressBar();
        updateNavButtons();
    }
}

// Update slide display
function updateSlideDisplay() {
    // Hide all slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show current slide
    const currentSlideElement = document.getElementById(`slide-${currentSlide}`);
    if (currentSlideElement) {
        currentSlideElement.classList.add('active');
    }
    
    // Update slide counter
    document.getElementById('current-slide').textContent = currentSlide;
    
    // Update navigation buttons
    updateNavButtons();
}

// Update navigation buttons state
function updateNavButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Disable/enable previous button
    if (currentSlide === 1) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }
    
    // Disable/enable next button
    if (currentSlide === totalSlides) {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }
}

// Update progress bar
function updateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    const progressPercentage = (currentSlide / totalSlides) * 100;
    progressFill.style.width = `${progressPercentage}%`;
}

// Handle keyboard navigation
function handleKeyPress(event) {
    switch(event.key) {
        case 'ArrowRight':
        case ' ': // Spacebar
        case 'PageDown':
            event.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
        case 'PageUp':
            event.preventDefault();
            previousSlide();
            break;
        case 'Home':
            event.preventDefault();
            goToSlide(1);
            break;
        case 'End':
            event.preventDefault();
            goToSlide(totalSlides);
            break;
        case 'Escape':
            event.preventDefault();
            toggleFullscreen();
            break;
        // Number keys for direct slide navigation
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            event.preventDefault();
            const slideNum = parseInt(event.key);
            if (slideNum <= totalSlides) {
                goToSlide(slideNum);
            }
            break;
        case '0':
            event.preventDefault();
            if (totalSlides >= 10) {
                goToSlide(10);
            }
            break;
    }
}

// Add touch/swipe support for mobile devices
function addTouchSupport() {
    let startX = 0;
    let endX = 0;
    
    const slidesContainer = document.querySelector('.slides-container');
    
    slidesContainer.addEventListener('touchstart', function(event) {
        startX = event.touches[0].clientX;
    });
    
    slidesContainer.addEventListener('touchend', function(event) {
        endX = event.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for a swipe
        const swipeDistance = startX - endX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                previousSlide();
            }
        }
    }
}

// Toggle fullscreen mode
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Auto-advance slides (optional feature - can be enabled)
function startAutoAdvance(intervalSeconds = 30) {
    return setInterval(() => {
        if (currentSlide < totalSlides) {
            nextSlide();
        } else {
            // Loop back to first slide or stop
            goToSlide(1);
        }
    }, intervalSeconds * 1000);
}

// Stop auto-advance
function stopAutoAdvance(intervalId) {
    if (intervalId) {
        clearInterval(intervalId);
    }
}

// Add slide transition animations
function addSlideTransition(direction = 'next') {
    const currentSlideElement = document.getElementById(`slide-${currentSlide}`);
    
    if (direction === 'next') {
        currentSlideElement.style.transform = 'translateX(-100px)';
    } else {
        currentSlideElement.style.transform = 'translateX(100px)';
    }
    
    setTimeout(() => {
        currentSlideElement.style.transform = 'translateX(0)';
    }, 100);
}

// Presentation mode utilities
const PresentationUtils = {
    // Get current slide information
    getCurrentSlideInfo() {
        return {
            current: currentSlide,
            total: totalSlides,
            title: this.getCurrentSlideTitle(),
            progress: (currentSlide / totalSlides) * 100
        };
    },
    
    // Get current slide title
    getCurrentSlideTitle() {
        const currentSlideElement = document.getElementById(`slide-${currentSlide}`);
        const titleElement = currentSlideElement.querySelector('.slide-title, .company-name, h1');
        return titleElement ? titleElement.textContent : `Slide ${currentSlide}`;
    },
    
    // Jump to slide by title (partial match)
    goToSlideByTitle(title) {
        const slides = document.querySelectorAll('.slide');
        for (let i = 0; i < slides.length; i++) {
            const slideElement = slides[i];
            const titleElement = slideElement.querySelector('.slide-title, .company-name, h1');
            if (titleElement && titleElement.textContent.toLowerCase().includes(title.toLowerCase())) {
                goToSlide(i + 1);
                return true;
            }
        }
        return false;
    },
    
    // Get slide outline/agenda
    getSlideOutline() {
        const slides = document.querySelectorAll('.slide');
        const outline = [];
        
        slides.forEach((slide, index) => {
            const titleElement = slide.querySelector('.slide-title, .company-name, h1');
            const title = titleElement ? titleElement.textContent : `Slide ${index + 1}`;
            outline.push({
                number: index + 1,
                title: title,
                isCurrent: (index + 1) === currentSlide
            });
        });
        
        return outline;
    }
};

// Export functions for external use
window.PitchDeck = {
    nextSlide,
    previousSlide,
    goToSlide,
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => totalSlides,
    startAutoAdvance,
    stopAutoAdvance,
    toggleFullscreen,
    utils: PresentationUtils
};

// Console helper for presenters
console.log(`
🎯 Pitch Deck Controls:
- Arrow keys or spacebar: Navigate slides
- Numbers 1-9/0: Jump to specific slides
- Home/End: Go to first/last slide  
- Escape: Toggle fullscreen
- Swipe left/right on mobile

📊 Available commands:
- PitchDeck.nextSlide()
- PitchDeck.previousSlide()
- PitchDeck.goToSlide(n)
- PitchDeck.utils.getCurrentSlideInfo()
- PitchDeck.utils.getSlideOutline()
`);