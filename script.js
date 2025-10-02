// 初期設定
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// ロード開始時刻を取得
const loadingStart = Date.now();

window.addEventListener('load', function () {
    const elapsed = Date.now() - loadingStart;
    const minTime = 3000; // 3秒（3000ミリ秒）

    if (elapsed < minTime) {
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
        }, minTime - elapsed);
    } else {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }
});



// 粒子の配列
const particles = [];

// 粒子クラス
class Particle {
    constructor(x, y, size, speedY, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedY = speedY;
        this.color = color;
    }

    // 粒子を描画
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // 粒子を更新
    update() {
        this.y -= this.speedY; // 上方向に移動
        if (this.y + this.size < 0) {
            // 画面外に出たら再配置
            this.y = canvas.height + this.size;
            this.x = Math.random() * canvas.width;
        }
    }
}

// 粒子を生成
function initParticles() {
    const numParticles = 100; // 粒子の数
    for (let i = 0; i < numParticles; i++) {
        const size = Math.random() * 5 + 1; // 粒子のサイズ
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedY = Math.random() * 2 + 1; // 上方向の速度
        const color = `rgba(255, 255, 255, ${Math.random()})`; // 白色の粒子
        particles.push(new Particle(x, y, size, speedY, color));
    }
}

// アニメーションループ
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 画面をクリア
    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animate);
}

// リサイズ対応
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 初期化とアニメーション開始
initParticles();
animate();