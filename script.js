// App State Management
let currentStep = 'initial'; // 'initial', 'concern', 'bible'

// DOM Elements
const stepInitial = document.getElementById('step-initial');
const stepConcern = document.getElementById('step-concern');
const stepBible = document.getElementById('step-bible');
const mainButton = document.getElementById('main-button');
const backButton = document.getElementById('back-button');
const confettiContainer = document.getElementById('confetti-container');

// Audio for sparkle sound (using Web Audio API)
let audioContext;
let isAudioInitialized = false;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateUI();
});

// Event Listeners
function setupEventListeners() {
    mainButton.addEventListener('click', handleMainButtonClick);
    backButton.addEventListener('click', handleBackButtonClick);
    
    // Initialize audio on first user interaction
    document.addEventListener('click', initializeAudio, { once: true });
}

// Audio Setup
function initializeAudio() {
    if (!isAudioInitialized) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            isAudioInitialized = true;
        } catch (error) {
            console.log('Audio not supported');
        }
    }
}

function playSparkleSound() {
    if (!audioContext) return;
    
    try {
        // Create a gentle chime sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create a pleasant chime
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Could not play sound');
    }
}

// Main Button Click Handler
function handleMainButtonClick() {
    switch (currentStep) {
        case 'initial':
            currentStep = 'concern';
            break;
        case 'concern':
            currentStep = 'bible';
            playSparkleSound();
            setTimeout(() => {
                createConfetti();
            }, 300);
            break;
    }
    updateUI();
}

// Back Button Click Handler
function handleBackButtonClick() {
    currentStep = 'initial';
    clearConfetti();
    updateUI();
}

// Update UI based on current step
function updateUI() {
    // Reset all steps
    stepInitial.classList.remove('active');
    stepConcern.classList.remove('active');
    stepBible.classList.remove('active');
    
    // Activate current step
    switch (currentStep) {
        case 'initial':
            stepInitial.classList.add('active');
            mainButton.textContent = 'Click Me';
            mainButton.style.display = 'block';
            backButton.classList.add('hidden');
            break;
            
        case 'concern':
            stepConcern.classList.add('active');
            mainButton.textContent = '💝 Continue 💝';
            mainButton.style.display = 'block';
            backButton.classList.remove('hidden');
            break;
            
        case 'bible':
            stepBible.classList.add('active');
            mainButton.style.display = 'none';
            backButton.classList.remove('hidden');
            break;
    }
}

// Confetti Animation
function createConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#db7093', '#dda0dd', '#da70d6'];
    const confettiCount = 30;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
            
            confettiContainer.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }, i * 50);
    }
}

function clearConfetti() {
    confettiContainer.innerHTML = '';
}

// Add some extra sparkle to the sparkles
function enhanceSparkles() {
    const sparkles = document.querySelectorAll('.sparkle');
    sparkles.forEach((sparkle, index) => {
        sparkle.style.animationDelay = (index * 0.3) + 's';
        sparkle.style.animationDuration = (Math.random() * 2 + 2) + 's';
    });
}

// Enhanced button interactions
function setupButtonEffects() {
    mainButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    mainButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    backButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    backButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// Add floating hearts effect for extra princess magic
function createFloatingHearts() {
    if (currentStep === 'bible') {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = '100%';
        heart.style.fontSize = '20px';
        heart.style.pointerEvents = 'none';
        heart.style.animation = 'floatUp 3s ease-out forwards';
        heart.style.zIndex = '4';
        
        // Add floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% {
                    opacity: 1;
                    transform: translateY(0) rotate(0deg);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-100vh) rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 3000);
    }
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    enhanceSparkles();
    setupButtonEffects();
    
    // Add periodic floating hearts when on bible verse step
    setInterval(() => {
        if (currentStep === 'bible' && Math.random() < 0.3) {
            createFloatingHearts();
        }
    }, 2000);
});

// Add keyboard support for accessibility
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        if (currentStep !== 'bible' && document.activeElement === mainButton) {
            handleMainButtonClick();
        } else if (currentStep !== 'initial' && document.activeElement === backButton) {
            handleBackButtonClick();
        }
    }
    
    if (event.key === 'Escape' && currentStep !== 'initial') {
        handleBackButtonClick();
    }
});

// Add touch support for mobile
let touchStartY = 0;
document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    const touchEndY = e.changedTouches[0].clientY;
    const touchDiff = touchStartY - touchEndY;
    
    // Swipe up to continue, swipe down to go back
    if (Math.abs(touchDiff) > 50) {
        if (touchDiff > 0 && currentStep !== 'bible') {
            // Swipe up - continue
            handleMainButtonClick();
        } else if (touchDiff < 0 && currentStep !== 'initial') {
            // Swipe down - go back
            handleBackButtonClick();
        }
    }
}); 