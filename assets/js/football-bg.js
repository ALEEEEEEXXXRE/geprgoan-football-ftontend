(() => {
  const canvas = document.createElement('canvas');
  canvas.id = 'bgCanvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const R = n => Math.random() * n;
  let mx = 0, my = 0, down = false, HAS_HIT = false;

  function drawRealisticFootball(radius) {
    ctx.fillStyle = '#fefefe';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ccc';
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = ((Math.PI * 2) / 5) * i - Math.PI / 2;
      const x = Math.cos(angle) * radius * 0.4;
      const y = Math.sin(angle) * radius * 0.4;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    for (let h = 0; h < 6; h++) {
      const angleOffset = h * (Math.PI * 2 / 6);
      const hx = Math.cos(angleOffset) * radius * 0.75;
      const hy = Math.sin(angleOffset) * radius * 0.75;

      ctx.beginPath();
      for (let j = 0; j < 6; j++) {
        const a = angleOffset + (j * Math.PI / 3);
        const x = hx + Math.cos(a) * radius * 0.25;
        const y = hy + Math.sin(a) * radius * 0.25;
        j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = h % 2 === 0 ? '#222' : '#fff';
      ctx.fill();
      ctx.stroke();
    }
  }

  function football(idx, sx, sy, fromTop = Math.random() < 0.5) {
    const radius = 20 + R(10);
    const x = sx ?? R(innerWidth);
    const y = sy ?? (fromTop ? -radius : innerHeight + radius);
    const vx = R(1.2) - 0.6;
    const vy = fromTop ? R(2.5) + 1 : -(R(2.5) + 1);
    const grav = fromTop ? 0.03 : -0.03; // Fall down or rise up
    let rot = 0;
    let rinc = R(0.03);

    return {
      x, y, vx, vy, radius, grav,
      draw() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.grav;
        rot += rinc;

        if (
          (this.grav > 0 && this.y - this.radius > innerHeight) ||
          (this.grav < 0 && this.y + this.radius < 0)
        ) {
          balls[idx] = football(idx);
        }

        const dx = mx - this.x;
        const dy = my - this.y;
        const dst = Math.sqrt(dx * dx + dy * dy);

        if (dst < this.radius && down) {
          const spawn = 3 + ~~R(4);
          for (let i = 0; i < spawn; i++) {
            balls.push(football(balls.length, this.x, this.y));
          }
          balls[idx] = { draw() {} };
          down = false;
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(rot);
        drawRealisticFootball(this.radius);
        ctx.restore();
      }
    };
  }

  const balls = Array.from({ length: 20 }, (_, i) => football(i));

  onpointermove = e => { mx = e.clientX; my = e.clientY; };
  onpointerdown = () => { down = true; };
  onpointerup = () => { down = false; };

  function animate() {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    balls.forEach(ball => ball.draw());

    document.body.style.cursor = HAS_HIT ? 'pointer' : '';
    HAS_HIT = false;
    requestAnimationFrame(animate);
  }

  animate();
})();
