import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  color: string;
}

@Component({
  selector: 'app-particle-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #canvas class="particle-bg"></canvas>`,
  styles: [`
    .particle-bg {
      position: fixed; top: 0; left: 0;
      width: 100vw; height: 100vh;
      z-index: 0; pointer-events: none;
    }
  `]
})
export class ParticleCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animId = 0;
  private colors = ['#66fcf1','#45a29e','#a855f7','#3b82f6','#66fcf1'];

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.spawnParticles();
    this.animate();
  }

  @HostListener('window:resize')
  resize(): void {
    const c = this.canvasRef.nativeElement;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }

  private spawnParticles(): void {
    for (let i = 0; i < 160; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.7 + 0.2,
        color: this.colors[Math.floor(Math.random() * this.colors.length)]
      });
    }
  }

  private animate(): void {
    const { ctx } = this;
    const W = window.innerWidth, H = window.innerHeight;
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(102,252,241,${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(this.particles[i].x, this.particles[i].y);
          ctx.lineTo(this.particles[j].x, this.particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw & move particles
    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }

    this.animId = requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy(): void { cancelAnimationFrame(this.animId); }
}
