const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const message = document.getElementById('message');

let width, height;
let particles = [];
let isActive = false;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Parametric Heart Formula
function getHeartPoint(t, scale = 14) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x: x * scale, y: y * scale };
}

class Particle {
  constructor(targetX, targetY) {
    this.x = width / 2;
    this.y = height / 2;
    this.targetX = targetX;
    this.targetY = targetY;
    
    this.speed = 0.03 + Math.random() * 0.03;
    this.radius = Math.random() * 1.8 + 0.8;
    this.alpha = 0;
    this.maxAlpha = Math.random() * 0.8 + 0.2;
    this.color = '#ff2a6d';
  }

  update() {
    this.x += (this.targetX - this.x) * this.speed;
    this.y += (this.targetY - this.y) * this.speed;

    if (this.alpha < this.maxAlpha) {
      this.alpha += 0.015;
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initHeart() {
  particles = [];
  const particleCount = 700;
  const centerX = width / 2;
  const centerY = height / 2 - 10;

  for (let i = 0; i < particleCount; i++) {
    const step = (i / particleCount) * (Math.PI * 2);
    
    for (let layer = 0; layer < 3; layer++) {
      const scale = 15 + (Math.random() - 0.5) * 2;
      const point = getHeartPoint(step, scale);
      particles.push(new Particle(centerX + point.x, centerY + point.y));
    }
  }
}

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, width, height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

startBtn.addEventListener('click', () => {
  if (isActive) return;
  isActive = true;

  startBtn.classList.add('hidden');
  initHeart();
  animate();

  setTimeout(() => {
    message.classList.add('visible');
  }, 900);
});
