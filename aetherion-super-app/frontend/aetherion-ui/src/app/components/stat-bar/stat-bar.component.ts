import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AetherionApiService } from '../../services/aetherion-api.service';

@Component({
  selector: 'app-stat-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-bar">
      <div class="stat-item">
        <span class="stat-label">GLOBAL USERS</span>
        <span class="stat-value cyan">{{ api.formatBigNumber(api.systemStats().totalUsers) }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-label">COUNTRIES ONLINE</span>
        <span class="stat-value green">{{ api.systemStats().countriesOnline }} / 195</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-label">ACTIVE CONVERSIONS</span>
        <span class="stat-value yellow">{{ api.systemStats().activeConversions }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-label">THREATS NEUTRALIZED</span>
        <span class="stat-value red">{{ api.systemStats().threatsNeutralized }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-label">ERLANG NODES</span>
        <span class="stat-value purple">{{ api.systemStats().erlangNodes }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-label">RUST JOBS/s</span>
        <span class="stat-value cyan">{{ api.systemStats().rustJobs }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-label">UPTIME</span>
        <span class="stat-value green">{{ api.formatUptime(api.systemStats().uptime) }}</span>
      </div>
      <div class="stat-item pulse-dot-wrap">
        <span class="pulse-dot"></span>
        <span class="stat-label">SYSTEM NOMINAL</span>
      </div>
    </div>
  `,
  styles: [`
    .stat-bar {
      display: flex; align-items: center; gap: 0;
      background: rgba(13,17,23,0.95);
      border-bottom: 1px solid rgba(102,252,241,0.2);
      border-top: 1px solid rgba(102,252,241,0.2);
      padding: 10px 24px; flex-wrap: wrap;
      backdrop-filter: blur(10px);
      position: relative; z-index: 10;
    }
    .stat-item { display: flex; flex-direction: column; align-items: center; padding: 0 20px; gap: 2px; }
    .stat-divider { width: 1px; height: 36px; background: rgba(102,252,241,0.15); }
    .stat-label { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #45a29e; letter-spacing: 1.5px; text-transform: uppercase; }
    .stat-value { font-family: 'Orbitron', sans-serif; font-size: 1rem; font-weight: 700; }
    .cyan   { color: #66fcf1; text-shadow: 0 0 8px rgba(102,252,241,0.6); }
    .green  { color: #2ed573; text-shadow: 0 0 8px rgba(46,213,115,0.6); }
    .yellow { color: #ffd32a; text-shadow: 0 0 8px rgba(255,211,42,0.6); }
    .red    { color: #ff4757; text-shadow: 0 0 8px rgba(255,71,87,0.6); }
    .purple { color: #a855f7; text-shadow: 0 0 8px rgba(168,85,247,0.6); }
    .pulse-dot-wrap { flex-direction: row; gap: 8px; }
    .pulse-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #2ed573;
      box-shadow: 0 0 0 0 rgba(46,213,115,0.7);
      animation: pulse-ring 1.5s infinite;
    }
    @keyframes pulse-ring {
      0%   { box-shadow: 0 0 0 0 rgba(46,213,115,0.7); }
      70%  { box-shadow: 0 0 0 8px rgba(46,213,115,0); }
      100% { box-shadow: 0 0 0 0 rgba(46,213,115,0); }
    }
  `]
})
export class StatBarComponent {
  api = inject(AetherionApiService);
}
