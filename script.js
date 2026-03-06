/**
 * Wish Galaxy - Independent Women's Day 8-3
 * Premium interactive galaxy experience with categories.
 */

const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
const bgMusic = document.getElementById('bg-music');
const audioIcon = document.getElementById('audio-icon');
const toggleAudio = document.getElementById('toggle-audio');

// Overlays
const wishOverlay = document.getElementById('wish-overlay');
const galleryOverlay = document.getElementById('gallery-overlay');
const crushOverlay = document.getElementById('crush-overlay');
const wishText = document.getElementById('wish-text');

// Nav items
const navItems = document.querySelectorAll('.nav-item');

let width, height;
let stars = [];
let particles = [];
let currentMode = 'stars'; // 'stars', 'gallery', 'crush'

const PUBLIC_WISHES = [
    "Chúc phái đẹp ngày 8-3 luôn rạng rỡ như trăng rằm, xinh đẹp như đoá hoa! ✨",
    "Mong bạn luôn tự tin, kiêu hãnh và là phiên bản tuyệt vời nhất của chính mình. 🌸",
    "Gửi tới người phụ nữ tuyệt vời nhất: Chúc bạn ngày 8-3 tràn đầy niềm vui. 🎁",
    "Ngày hôm nay là của bạn! Hãy toả sáng theo cách riêng nhé! ❤️",
    "Chúc bạn luôn có đủ hạnh phúc để sẻ chia. 💖",
    "Bạn là một vì sao lấp lánh nhất trong thiên hà này. ⭐"
];

const CRUSH_WISHES = [
    "Có những ngày thường bỗng trở nên đặc biệt, chỉ vì có người ấy xuất hiện trong Thiên hà của người nào đó...",
    "Tháng Ba năm nay thật đẹp, vì bầu trời bỗng dưng có thêm một vì sao lấp lánh như người ấy. ✨",
    "Hy vọng người ấy luôn hạnh phúc, vì nụ cười của người ấy chính là thuốc độc ngọt ngào nhất 🌹",
    "Giữa muôn vàn những điều xa xôi, có một vì sao cứ âm thầm tỏa sáng trong lòng một người nào đó từng ngày...",
    "Mong người ấy mãi rạng rỡ như thế nhé, vì nụ cười ấy từ lâu đã là cả bầu trời đối với một người nào đó... ❤️"
];

function init() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const count = width < 768 ? 80 : 150;
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

        // Randomly assign type
        const typeRoll = Math.random();
        if (typeRoll > 0.85) {
            this.type = 'CRUSH';
            this.color = '#ff4d6d'; // Romantic Pink/Red
            this.size = Math.random() * 6 + 5;
        } else if (typeRoll > 0.6) {
            this.type = 'WISH';
            this.color = '#ffd700'; // Gold
            this.size = Math.random() * 4 + 3;
        } else {
            this.type = 'DECOR';
            this.color = '#ffffff';
        }
    }

    update() {
        this.z -= 0.5; // Constant speed
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

        if (this.type !== 'DECOR') {
            const glow = ctx.createRadialGradient(finalX, finalY, 0, finalX, finalY, s * 4);
            glow.addColorStop(0, this.color);
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(finalX, finalY, s * 4, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(finalX, finalY, s, 0, Math.PI * 2);
            ctx.fill();
        }

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

    particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.opacity <= 0) particles.splice(i, 1);
    });

    requestAnimationFrame(animate);
}

// Interaction
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const clickedStar = stars.find(star => {
        if (star.type === 'DECOR') return false;
        const dx = star.screenX - clickX;
        const dy = star.screenY - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < star.screenS * 1.5;
    });

    if (clickedStar) {
        createExplosion(clickedStar.screenX, clickedStar.screenY, clickedStar.color);
        setTimeout(() => {
            if (clickedStar.type === 'CRUSH') {
                showModal('wish', CRUSH_WISHES);
            } else {
                showModal('wish', PUBLIC_WISHES);
            }
        }, 400);
    }
});

function showModal(id, list = null) {
    if (id === 'wish' && list) {
        wishText.innerText = list[Math.floor(Math.random() * list.length)];
        wishOverlay.classList.remove('hidden');
    } else if (id === 'gallery') {
        galleryOverlay.classList.remove('hidden');
    } else if (id === 'crush') {
        crushOverlay.classList.remove('hidden');
    }
}

// Close buttons
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.overlay').forEach(ov => ov.classList.add('hidden'));

        // Reset navigation to "Điều ước" (Stars)
        navItems.forEach(i => i.classList.remove('active'));
        document.getElementById('nav-stars').classList.add('active');
    });
});

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const id = item.id;
        if (id === 'nav-gallery') {
            showModal('gallery');
        } else if (id === 'nav-crush') {
            showModal('crush');
        } else {
            // General Stars mode - no modal, just resets view
            document.querySelectorAll('.overlay').forEach(ov => ov.classList.add('hidden'));
        }
    });
});

// Audio
const startAudio = () => {
    bgMusic.play().then(() => {
        audioIcon.innerText = '🔊';
        document.removeEventListener('click', startAudio);
        document.removeEventListener('touchstart', startAudio);
    }).catch(() => { });
};

window.addEventListener('load', startAudio);
document.addEventListener('click', startAudio);
document.addEventListener('touchstart', startAudio);

toggleAudio.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
        bgMusic.play();
        audioIcon.innerText = '🔊';
    } else {
        bgMusic.pause();
        audioIcon.innerText = '🔇';
    }
});

window.addEventListener('resize', init);
init();
animate();
