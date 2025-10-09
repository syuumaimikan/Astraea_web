const canvas = document.getElementById("particleCanvas");
const loadContent = document.getElementById("load-content");
const overlay = document.getElementById("overlay");
// ロード開始時刻を取得
const loadingStart = Date.now();
window.addEventListener("load", function () {
    const label = document.getElementById("label");
    const elapsed = Date.now() - loadingStart;
    const minTime = 3000; // 3秒（3000ミリ秒）
    label.classList.add("is-visible");

    setInterval(() => {
        if (!clicked) {
            if (clicked) return;
            $("#overlay").fadeToggle(1000);
        }
    }, 1000);
    // フェードアウト後にdisplay: noneを設定
    label.addEventListener("transitionend", function () {
        if (!label.classList.contains("is-visible")) {
            label.style.display = "none";
            label.style.pointerEvents = "none";
        }
    });
    if (elapsed < minTime) {
        setTimeout(() => {
            label.classList.remove("is-visible");
        }, minTime - elapsed);
    } else {
        label.classList.remove("is-visible");
    }
});

class StarParticle {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.particles = [];
        this.options = {
            particleCount: options.particleCount || 200,
            particleSize: options.particleSize || 1,
            particleColor: options.particleColor || "#ffffff",
            twinkleSpeed: options.twinkleSpeed || 0.02,
            starDepth: options.starDepth || 1000, // 星の奥行き
            ...options,
        };
        this.lastScrollY = window.scrollY;
        this.scrollSpeed = 0;

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener("resize", () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        // 星を球状にランダム配置
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * this.canvas.width * 0.5;
        // 中心を避けるための最小半径を指定（例：50px）
        const minCenterRadius = 50;

        // 中心からの距離が小さい星は再生成する（再帰呼び出し）
        if (radius < minCenterRadius) {
            return this.createParticle(); // やり直し
        }
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            z: Math.random() * this.options.starDepth,
            prevZ: null,
            size: Math.random() * this.options.particleSize + 0.5,
            opacity: Math.random() * 0.8 + 0.2,
            twinkleDirection: Math.random() > 0.5 ? 1 : -1,
        };
    }

    updateParticles() {
        // スクロール速度に応じてzを減らす
        for (const p of this.particles) {
            p.prevZ = p.z;
            p.z -= this.scrollSpeed * 10 + 2; // スクロールで加速、+2で常に動く
            if (p.z <= 1) {
                // 奥に戻す
                Object.assign(p, this.createParticle());
                p.z = this.options.starDepth;
                p.prevZ = p.z + 10;
            }
        }
    }

    drawParticles() {
        const { width, height } = this.canvas;
        this.ctx.clearRect(0, 0, width, height);

        for (const p of this.particles) {
            // 3D→2D変換
            const scale = 500 / p.z;
            const x = this.centerX + p.x * scale;
            const y = this.centerY + p.y * scale;

            // 線を描画（前フレーム位置→現在位置）
            if (p.prevZ) {
                const prevScale = 500 / p.prevZ;
                const prevX = this.centerX + p.x * prevScale;
                const prevY = this.centerY + p.y * prevScale;
                this.ctx.strokeStyle = `rgba(255,255,255,${p.opacity})`;
                this.ctx.lineWidth = p.size * scale;
                this.ctx.beginPath();
                this.ctx.moveTo(prevX, prevY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
            }

            // 星本体
            this.ctx.beginPath();
            this.ctx.arc(x, y, p.size * scale, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
            this.ctx.fill();
        }
    }

    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
    // スクロール速度をセット
    setScrollSpeed(speed) {
        this.scrollSpeed = speed;
    }
}

let starParticleInstance = null;
let lastScrollY = window.scrollY;
let lastTimestamp = performance.now();
let speed = 0;
let accelerateInterval = null;
let clicked = false;
let wait_time = 0;
const handleClick = () => {
    if (!clicked) {
        overlay.style.display = "none";
        overlay.style.pointerEvents = "none";
        clicked = true;
        speed = 0;

        let accelerateInterval = setInterval(() => {
            speed = parseFloat(speed.toFixed(1));
            if (speed >= 2) {
                clearInterval(accelerateInterval);
                return;
            }

            console.log(`speed: ${speed}`);
            speed += 0.1;

            if (starParticleInstance) {
                starParticleInstance.setScrollSpeed(speed);
            }
        }, 100); // 100msごとに
        setInterval(() => {
            if (wait_time >= 3) return;
            if (speed >= 1.9) {
                wait_time += 1;
                console.log(`wait_time: ${wait_time}`);
                if (wait_time >= 2) {
                    $("#loading").fadeOut(3000);
                    $("#main-content").fadeIn(7000);
                }
            }
        }, 1000); // 1000ms = 1sごとに
    }
};
document
    .getElementById("load-content")
    .addEventListener("click", handleClick);
// 初期化
document.addEventListener("DOMContentLoaded", () => {
    starParticleInstance = new StarParticle(canvas, {
        particleCount: 500,
        particleSize: 0.1,
        particleColor: "#ffffff",
        twinkleSpeed: 0.02,
        starDepth: 1000,
    });
});