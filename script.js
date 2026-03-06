/**
 * Wish Galaxy - Independent Women's Day 8-3
 * Premium interactive galaxy experience.
 */

const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('wish-overlay');
const wishText = document.getElementById('wish-text');
const closeBtn = document.getElementById('close-wish');
const toggleAudio = document.getElementById('toggle-audio');
const bgMusic = document.getElementById('bg-music');
const audioIcon = document.getElementById('audio-icon');

let width, height;
let stars = [];
let particles = [];
const STAR_COUNT = 150;
const SPEED = 0.05;

const WISHES = [
    "Chúc phái đẹp ngày 8-3 luôn rạng rỡ như trăng rằm, xinh đẹp như đoá hoa và hạnh phúc như chính nụ cười của bạn! ✨",
    "Mong bạn luôn tự tin, kiêu hãnh và là phiên bản tuyệt vời nhất của chính mình. Chúc mừng 8-3! 🌸",
    "Gửi tới người phụ nữ tuyệt vời nhất: Chúc bạn ngày 8-3 tràn đầy niềm vui, sự ngọt ngào và những món quà bất ngờ. 🎁",
    "Ngày hôm nay là của bạn! Hãy toả sáng theo cách riêng, yêu thương bản thân thật nhiều nhé! ❤️",
    "Chúc bạn luôn có đủ dũng khí để thực hiện ước mơ, đủ bao dung để thấu hiểu và đủ hạnh phúc để sẻ chia. 💖",
    "Bạn là một vì sao lấp lánh nhất trong thiên hà này. Đừng bao giờ ngừng toả sáng nhé! ⭐",
    "Chúc các chị em 8-3 mãi xinh tươi, giỏi việc nước, đảm việc nhà và luôn được yêu chiều hết mực! 💐",
    "Một ngày 8-3 thật ý nghĩa, đầy ắp tiếng cười và những kỉ niệm đáng nhớ bên người thương yêu. 🥂",
    "Chúc bạn mỗi ngày đều là 8-3, luôn được trân trọng, thấu hiểu và ngập tràn hạnh phúc. 🌞",
    "Bạn chính là điều kì diệu của thế giới này. Chúc mừng Ngày Quốc tế Phụ nữ! 🌍✨"
];

// Initialize dimensions
function init() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Adjust star count for mobile performance
    const count = width < 768 ? 80 : STAR_COUNT;
    createStars(count);
}

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * width; 
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random();
        this.twinkleFactor = Math.random() * 0.05 + 0.01;
        this.color = this.getRandomColor();
        this.isInteractive = Math.random() > 0.6; 
        
        if (this.isInteractive) {
            this.size = Math.random() * 5 + 4; 
        }
    }

    getRandomColor() {
        const colors = [
            '#ffffff', // White
            '#fff7d1', // Soft Yellow
            '#ffd1dc', // Soft Pink
            '#d1f2ff', // Soft Blue
            '#f0e68c'  // Khaki Gold
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.z -= SPEED * 10;
        
        if (this.z <= 0) {
            this.reset();
            this.z = width;
        }

        this.opacity += this.twinkleFactor;
        if (this.opacity > 1 || this.opacity < 0.2) {
            this.twinkleFactor *= -1;
        }
    }

    draw() {
        const x = (this.x - width / 2) * (width / this.z);
        const y = (this.y - height / 2) * (width / this.z);
        const s = this.size * (width / this.z);
        
        const finalX = x + width / 2;
        const finalY = y + height / 2;

        if (finalX < 0 || finalX > width || finalY < 0 || finalY > height) return;

        ctx.globalCompositeOperation = 'screen';
        ctx.beginPath();
        
        if (this.isInteractive) {
            const glow = ctx.createRadialGradient(finalX, finalY, 0, finalX, finalY, s * 4);
            glow.addColorStop(0, this.color);
            glow.addColorStop(0.3, this.color + 'aa');
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.arc(finalX, finalY, s * 4, 0, Math.PI * 2);
        } else {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.arc(finalX, finalY, s, 0, Math.PI * 2);
        }
        
        ctx.fill();
        ctx.globalAlpha = 1;

        this.screenX = finalX;
        this.screenY = finalY;
        this.screenS = s * 4; 
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 4 + 1;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8;
        this.opacity = 1;
        this.friction = 0.95;
    }

    update() {
        this.speedX *= this.friction;
        this.speedY *= this.friction;
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.02;
    }

    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
        stars.push(new Star());
    }
}

function createExplosion(x, y, color) {
    for (let i = 0; i < 30; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.opacity <= 0) {
            particles.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

// Interaction
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const clickedStar = stars.find(star => {
        if (!star.isInteractive) return false;
        const dx = star.screenX - clickX;
        const dy = star.screenY - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < star.screenS * 1.5;
    });

    if (clickedStar) {
        createExplosion(clickedStar.screenX, clickedStar.screenY, clickedStar.color);
        setTimeout(() => showWish(), 400);
    }
});

function showWish() {
    const randomWish = WISHES[Math.floor(Math.random() * WISHES.length)];
    wishText.innerText = randomWish;
    overlay.classList.remove('hidden');
}

closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.classList.add('hidden');
    }
});

// Audio Logic
const startAudio = () => {
    bgMusic.play().then(() => {
        audioIcon.innerText = '🔊';
        // Remove listeners once it starts
        document.removeEventListener('click', startAudio);
        document.removeEventListener('touchstart', startAudio);
    }).catch(e => {
        console.log("Autoplay blocked, waiting for interaction...");
    });
};

// Start playback as soon as possible
window.addEventListener('load', startAudio);
// Also listen for first interaction as a fallback
document.addEventListener('click', startAudio);
document.addEventListener('touchstart', startAudio);

toggleAudio.addEventListener('click', (e) => {
    e.stopPropagation(); // Avoid triggering document click
    if (bgMusic.paused) {
        bgMusic.play();
        audioIcon.innerText = '🔊';
    } else {
        bgMusic.pause();
        audioIcon.innerText = '🔇';
    }
});

window.addEventListener('resize', init);

// Start
init();
animate();
