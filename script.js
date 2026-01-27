// Birthday Website JavaScript

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'wish.html' || currentPage === '') {
        initializeWishForm();
    } else if (currentPage === 'birthday.html') {
        initializeBirthdayPage();
    } else if (currentPage === 'wishes.html') {
        initializeWishesPage();
    }
}

// ==================== WISH FORM PAGE ====================
function initializeWishForm() {
    const wishForm = document.getElementById('wishForm');
    if (!wishForm) return;
    
    wishForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            senderName: document.getElementById('senderName').value,
            relationship: document.getElementById('relationship').value,
            wishMessage: document.getElementById('wishMessage').value,
            favoriteMemory: document.getElementById('favoriteMemory').value,
            wishColor: document.querySelector('input[name="wishColor"]:checked').value,
            timestamp: new Date().toLocaleString()
        };
        
        // Save to localStorage
        saveWish(formData);
        
        // Show success message
        wishForm.style.display = 'none';
        document.getElementById('successMessage').classList.remove('hidden');
        
        // Trigger celebration animation
        createConfetti();
    });
}

function saveWish(wishData) {
    let wishes = JSON.parse(localStorage.getItem('birthdayWishes')) || [];
    wishes.push(wishData);
    localStorage.setItem('birthdayWishes', JSON.stringify(wishes));
}

// ==================== BIRTHDAY PAGE ====================
function initializeBirthdayPage() {
    const revealBtn = document.getElementById('revealBtn');
    const celebrateAgainBtn = document.getElementById('celebrateAgain');
    
    if (revealBtn) {
        revealBtn.addEventListener('click', function() {
            triggerBirthdayReveal();
        });
    }
    
    if (celebrateAgainBtn) {
        celebrateAgainBtn.addEventListener('click', function() {
            resetBirthdayPage();
            triggerBirthdayReveal();
        });
    }
}

function triggerBirthdayReveal() {
    // Hide the gift button
    document.getElementById('beforeReveal').classList.add('hidden');
    
    // Show blast effect
    const blastEffect = document.getElementById('blastEffect');
    blastEffect.classList.remove('hidden');
    
    // Play blast animation
    setTimeout(() => {
        blastEffect.classList.add('hidden');
    }, 1000);
    
    // Create confetti
    setTimeout(() => {
        createConfetti();
    }, 300);
    
    // Create floating emojis
    setTimeout(() => {
        createFloatingEmojis();
    }, 500);
    
    // Show birthday message
    setTimeout(() => {
        document.getElementById('afterReveal').classList.remove('hidden');
    }, 800);
    
    // Play birthday sound effect (if available)
    playBirthdaySound();
}

function resetBirthdayPage() {
    document.getElementById('beforeReveal').classList.remove('hidden');
    document.getElementById('afterReveal').classList.add('hidden');
}

// ==================== WISHES PAGE ====================
function initializeWishesPage() {
    displayWishes();
    
    const clearBtn = document.getElementById('clearWishes');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all wishes?')) {
                localStorage.removeItem('birthdayWishes');
                displayWishes();
            }
        });
    }
}

function displayWishes() {
    const wishes = JSON.parse(localStorage.getItem('birthdayWishes')) || [];
    const wishesContainer = document.getElementById('wishesContainer');
    const noWishesDiv = document.getElementById('noWishes');
    const totalWishesSpan = document.getElementById('totalWishes');
    
    if (!wishesContainer) return;
    
    // Update total count
    if (totalWishesSpan) {
        totalWishesSpan.textContent = wishes.length;
    }
    
    if (wishes.length === 0) {
        wishesContainer.innerHTML = '';
        if (noWishesDiv) {
            noWishesDiv.classList.remove('hidden');
        }
        return;
    }
    
    if (noWishesDiv) {
        noWishesDiv.classList.add('hidden');
    }
    
    // Display wishes in reverse order (newest first)
    wishesContainer.innerHTML = wishes.reverse().map((wish, index) => `
        <div class="wish-card" style="border-left-color: ${wish.wishColor}; animation-delay: ${index * 0.1}s">
            <div class="wish-header">
                <div class="wish-sender">${escapeHtml(wish.senderName)}</div>
                <div class="wish-relationship">${escapeHtml(wish.relationship)}</div>
            </div>
            <div class="wish-message">${escapeHtml(wish.wishMessage)}</div>
            ${wish.favoriteMemory ? `
                <div class="wish-memory">
                    <div class="wish-memory-label">💭 Favorite Memory:</div>
                    <div class="wish-memory-text">${escapeHtml(wish.favoriteMemory)}</div>
                </div>
            ` : ''}
            <div class="wish-timestamp">📅 ${wish.timestamp}</div>
        </div>
    `).join('');
}

// ==================== CONFETTI ANIMATION ====================
function createConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) {
        // Create canvas if it doesn't exist
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'confettiCanvas';
        newCanvas.style.position = 'fixed';
        newCanvas.style.top = '0';
        newCanvas.style.left = '0';
        newCanvas.style.width = '100%';
        newCanvas.style.height = '100%';
        newCanvas.style.pointerEvents = 'none';
        newCanvas.style.zIndex = '9999';
        document.body.appendChild(newCanvas);
        
        animateConfetti(newCanvas);
    } else {
        animateConfetti(canvas);
    }
}

function animateConfetti(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiCount = 150;
    const confetti = [];
    const colors = ['#ff6b9d', '#4ecdc4', '#ffd93d', '#a78bfa', '#fb923c', '#f093fb'];
    
    // Create confetti particles
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * confettiCount,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    
    let animationFrame;
    let frameCount = 0;
    const maxFrames = 300; // Run for about 5 seconds at 60fps
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((c, index) => {
            ctx.beginPath();
            ctx.lineWidth = c.r / 2;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r / 4, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4);
            ctx.stroke();
            
            // Update position
            c.tiltAngle += c.tiltAngleIncremental;
            c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
            c.x += Math.sin(c.d);
            c.tilt = Math.sin(c.tiltAngle - index / 3) * 15;
            
            // Reset if out of bounds
            if (c.y > canvas.height) {
                confetti[index] = {
                    x: Math.random() * canvas.width,
                    y: -20,
                    r: c.r,
                    d: c.d,
                    color: c.color,
                    tilt: c.tilt,
                    tiltAngleIncremental: c.tiltAngleIncremental,
                    tiltAngle: c.tiltAngle
                };
            }
        });
        
        frameCount++;
        if (frameCount < maxFrames) {
            animationFrame = requestAnimationFrame(draw);
        } else {
            // Fade out and remove canvas
            canvas.style.opacity = '0';
            canvas.style.transition = 'opacity 1s';
            setTimeout(() => {
                if (canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                }
            }, 1000);
        }
    }
    
    draw();
}

// ==================== FLOATING EMOJIS ====================
function createFloatingEmojis() {
    const container = document.getElementById('floatingEmojis');
    if (!container) return;
    
    container.classList.remove('hidden');
    container.innerHTML = '';
    
    const emojis = ['🎉', '🎊', '🎈', '🎁', '🎂', '🥳', '✨', '⭐', '💖', '🌟'];
    const emojiCount = 30;
    
    for (let i = 0; i < emojiCount; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.animationDelay = Math.random() * 2 + 's';
        emoji.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(emoji);
    }
    
    // Clean up after animation
    setTimeout(() => {
        container.classList.add('hidden');
        container.innerHTML = '';
    }, 5000);
}

// ==================== SOUND EFFECTS ====================
function playBirthdaySound() {
    // Create a simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 523.25; // C5 note
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        // Play a second note
        setTimeout(() => {
            const oscillator2 = audioContext.createOscillator();
            const gainNode2 = audioContext.createGain();
            
            oscillator2.connect(gainNode2);
            gainNode2.connect(audioContext.destination);
            
            oscillator2.frequency.value = 659.25; // E5 note
            oscillator2.type = 'sine';
            
            gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator2.start(audioContext.currentTime);
            oscillator2.stop(audioContext.currentTime + 0.5);
        }, 200);
    } catch (e) {
        // Audio not supported, silently fail
        console.log('Audio not supported');
    }
}

// ==================== UTILITY FUNCTIONS ====================
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Handle window resize for canvas
window.addEventListener('resize', function() {
    const canvas = document.getElementById('confettiCanvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// Add sparkle effect on mouse move (optional enhancement)
document.addEventListener('mousemove', function(e) {
    if (Math.random() > 0.95) {
        createSparkle(e.clientX, e.clientY);
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.fontSize = '1.5rem';
    sparkle.style.zIndex = '10000';
    sparkle.style.animation = 'fadeOut 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 1000);
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(0.5);
        }
    }
`;
document.head.appendChild(style);
