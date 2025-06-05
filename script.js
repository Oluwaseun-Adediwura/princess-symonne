// App State Management
let currentStep = 'initial'; // 'initial', 'concern', 'bible'

// DOM Elements
let stepInitial, stepConcern, stepBible, mainButton, backButton, confettiContainer;

// Audio context
let audioContext;

// Initialize when page loads
window.addEventListener('load', function() {
    console.log('Page loaded, initializing app...');
    initializeApp();
});

// Also try with DOMContentLoaded as backup
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    setTimeout(initializeApp, 100); // Small delay to ensure everything is ready
});

function initializeApp() {
    console.log('Initializing app...');
    
    // Get DOM elements
    stepInitial = document.getElementById('step-initial');
    stepConcern = document.getElementById('step-concern');
    stepBible = document.getElementById('step-bible');
    mainButton = document.getElementById('main-button');
    backButton = document.getElementById('back-button');
    confettiContainer = document.getElementById('confetti-container');
    
    // Check if elements exist
    if (!mainButton) {
        console.error('Main button not found!');
        return;
    }
    
    console.log('Elements found, setting up listeners...');
    
    // Remove any existing listeners first
    if (mainButton) {
        mainButton.removeEventListener('click', handleMainButtonClick);
        mainButton.onclick = null;
    }
    if (backButton) {
        backButton.removeEventListener('click', handleBackButtonClick);
        backButton.onclick = null;
    }
    
    // Add event listeners with multiple methods for better compatibility
    if (mainButton) {
        mainButton.addEventListener('click', handleMainButtonClick, true);
        mainButton.onclick = handleMainButtonClick;
        
        // Also add touch events for mobile
        mainButton.addEventListener('touchend', function(e) {
            e.preventDefault();
            handleMainButtonClick();
        });
    }
    
    if (backButton) {
        backButton.addEventListener('click', handleBackButtonClick, true);
        backButton.onclick = handleBackButtonClick;
    }
    
    // Initialize audio on first interaction
    document.addEventListener('click', initializeAudio, { once: true });
    
    // Reset to initial state
    currentStep = 'initial';
    updateUI();
    
    console.log('App initialized successfully!');
}

// Audio Setup
function initializeAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('Audio initialized');
    } catch (error) {
        console.log('Audio not supported:', error);
    }
}

function playSparkleSound() {
    if (!audioContext) return;
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Could not play sound:', error);
    }
}

// Main Button Click Handler
function handleMainButtonClick(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    console.log('🌸 BUTTON CLICKED! Current step:', currentStep);
    
    switch (currentStep) {
        case 'initial':
            console.log('🔄 Moving from initial to concern step');
            currentStep = 'concern';
            break;
        case 'concern':
            console.log('🔄 Moving from concern to bible step');
            currentStep = 'bible';
            playSparkleSound();
            setTimeout(createConfetti, 300);
            break;
        default:
            console.log('❌ Unknown step:', currentStep);
            return;
    }
    
    updateUI();
    console.log('✅ UI updated for step:', currentStep);
}

// Back Button Click Handler
function handleBackButtonClick() {
    console.log('Handling back button click');
    currentStep = 'initial';
    clearConfetti();
    updateUI();
}

// Update UI based on current step
function updateUI() {
    console.log('🎨 Updating UI for step:', currentStep);
    
    if (!stepInitial || !stepConcern || !stepBible || !mainButton || !backButton) {
        console.error('❌ Missing UI elements!');
        return;
    }
    
    // Reset all steps
    stepInitial.classList.remove('active');
    stepConcern.classList.remove('active');
    stepBible.classList.remove('active');
    
    // Activate current step with delay for smooth transitions
    setTimeout(() => {
        switch (currentStep) {
            case 'initial':
                console.log('🏠 Showing initial step');
                stepInitial.classList.add('active');
                mainButton.textContent = 'Click Me';
                mainButton.style.display = 'block';
                mainButton.style.visibility = 'visible';
                backButton.classList.add('hidden');
                break;
                
            case 'concern':
                console.log('💗 Showing concern step');
                stepConcern.classList.add('active');
                mainButton.textContent = '💝 Continue 💝';
                mainButton.style.display = 'block';
                mainButton.style.visibility = 'visible';
                backButton.classList.remove('hidden');
                break;
                
            case 'bible':
                console.log('📖 Showing bible step');
                stepBible.classList.add('active');
                mainButton.style.display = 'none';
                mainButton.style.visibility = 'hidden';
                backButton.classList.remove('hidden');
                break;
        }
    }, 100);
}

// Confetti Animation
function createConfetti() {
    if (!confettiContainer) return;
    
    const colors = ['#ff69b4', '#ff1493', '#db7093', '#dda0dd', '#da70d6'];
    const confettiCount = 25;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.3 + 's';
            confetti.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
            
            confettiContainer.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }, i * 40);
    }
}

function clearConfetti() {
    if (confettiContainer) {
        confettiContainer.innerHTML = '';
    }
}

// Add button hover effects
function addButtonEffects() {
    if (mainButton) {
        mainButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        mainButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    if (backButton) {
        backButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        backButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (currentStep !== 'bible') {
            handleMainButtonClick();
        } else {
            handleBackButtonClick();
        }
    }
    
    if (event.key === 'Escape' && currentStep !== 'initial') {
        handleBackButtonClick();
    }
});

// Mobile touch support
let touchStartY = 0;
document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    const touchEndY = e.changedTouches[0].clientY;
    const touchDiff = touchStartY - touchEndY;
    
    if (Math.abs(touchDiff) > 50) {
        if (touchDiff > 0 && currentStep !== 'bible') {
            handleMainButtonClick();
        } else if (touchDiff < 0 && currentStep !== 'initial') {
            handleBackButtonClick();
        }
    }
});

// Add sparkle animations
setTimeout(function() {
    const sparkles = document.querySelectorAll('.sparkle');
    sparkles.forEach((sparkle, index) => {
        sparkle.style.animationDelay = (index * 0.4) + 's';
        sparkle.style.animationDuration = (Math.random() * 2 + 3) + 's';
    });
}, 500);

console.log('Script loaded successfully!'); 
