import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AetherionApiService, ConversionJob } from '../../services/aetherion-api.service';

@Component({
  selector: 'app-converter-engine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="converter-panel">
      <div class="panel-header">
        <span class="panel-icon">⚡</span>
        <h2>CONVERSION ENGINE</h2>
        <span class="badge">ERLANG/RUST FFI</span>
      </div>

      <div class="converter-form">
        <div class="form-row">
          <div class="form-group">
            <label>APP NAME</label>
            <input [(ngModel)]="appName" placeholder="e.g. MyApp.apk" class="cyber-input"/>
          </div>
          <div class="form-group">
            <label>SOURCE PLATFORM</label>
            <select [(ngModel)]="source" class="cyber-select">
              <option value="Android">Android (.apk)</option>
              <option value="iOS">iOS (.ipa)</option>
              <option value="Windows">Windows (.exe)</option>
              <option value="macOS">macOS (.dmg)</option>
              <option value="Linux">Linux (.deb)</option>
            </select>
          </div>
          <div class="form-group">
            <label>TARGET PLATFORM</label>
            <select [(ngModel)]="target" class="cyber-select">
              <option value="Windows">Windows Desktop</option>
              <option value="macOS">macOS Desktop</option>
              <option value="Linux">Linux Desktop</option>
              <option value="Android">Android Mobile</option>
              <option value="iOS">iOS Mobile</option>
            </select>
          </div>
        </div>

        <button class="engage-btn" (click)="engage()" [class.firing]="firing()">
          <span class="btn-glow"></span>
          <span class="btn-text">{{ firing() ? 'COMPILING...' : 'ENGAGE COMPILER' }}</span>
          <span class="btn-sub">{{ firing() ? 'Rust FFI Active' : 'Erlang → Rust → Binary' }}</span>
        </button>
      </div>

      <div class="jobs-section">
        <div class="jobs-header">
          <span class="jobs-title">LIVE JOB QUEUE</span>
          <span class="jobs-count">{{ api.activeJobs().length }} jobs</span>
        </div>
        <div class="jobs-list">
          @for (job of api.activeJobs(); track job.id) {
            <div class="job-card" [class]="job.status">
              <div class="job-top">
                <span class="job-id">{{ job.id }}</span>
                <span class="job-name">{{ job.appName }}</span>
                <span class="job-route">{{ job.sourcePlatform }} → {{ job.targetPlatform }}</span>
                <span class="job-country">📍 {{ job.country }}</span>
                <span class="job-status" [class]="job.status">{{ job.status.toUpperCase() }}</span>
              </div>
              <div class="progress-bar-track">
                <div class="progress-bar-fill" [style.width.%]="job.progress" [class]="job.status"></div>
              </div>
              <div class="progress-label">{{ job.progress }}%</div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .converter-panel {
      background: rgba(13,17,23,0.92);
      border: 1px solid rgba(102,252,241,0.2);
      border-radius: 4px;
      padding: 20px;
      position: relative; z-index: 2;
      backdrop-filter: blur(12px);
    }
    .panel-header {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 18px;
      border-bottom: 1px solid rgba(102,252,241,0.1);
      padding-bottom: 12px;
    }
    .panel-icon { font-size: 1.4rem; }
    h2 { font-family: 'Orbitron',sans-serif; font-size: 0.9rem; color: #66fcf1; letter-spacing: 3px; flex: 1; }
    .badge { font-family: 'Share Tech Mono',monospace; font-size: 0.6rem; background: rgba(168,85,247,0.2); color: #a855f7; border: 1px solid rgba(168,85,247,0.4); padding: 3px 8px; border-radius: 2px; }
    .form-row { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
    .form-group { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 140px; }
    label { font-family: 'Share Tech Mono',monospace; font-size: 0.6rem; color: #45a29e; letter-spacing: 1.5px; }
    .cyber-input, .cyber-select {
      background: rgba(102,252,241,0.04);
      border: 1px solid rgba(102,252,241,0.25);
      color: #c5c6c7; padding: 8px 12px;
      font-family: 'Share Tech Mono',monospace; font-size: 0.8rem;
      outline: none; border-radius: 2px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .cyber-input:focus, .cyber-select:focus {
      border-color: #66fcf1;
      box-shadow: 0 0 12px rgba(102,252,241,0.2);
    }
    .cyber-select option { background: #0d1117; }
    .engage-btn {
      width: 100%; padding: 14px; cursor: pointer;
      background: transparent;
      border: 2px solid #66fcf1;
      color: #66fcf1; border-radius: 2px;
      display: flex; flex-direction: column; align-items: center; gap: 3px;
      position: relative; overflow: hidden;
      transition: all 0.3s;
    }
    .engage-btn:hover, .engage-btn.firing {
      background: rgba(102,252,241,0.08);
      box-shadow: 0 0 24px rgba(102,252,241,0.35), inset 0 0 24px rgba(102,252,241,0.05);
    }
    .btn-glow {
      position: absolute; top: -50%; left: -50%;
      width: 200%; height: 200%;
      background: radial-gradient(ellipse at center, rgba(102,252,241,0.15) 0%, transparent 70%);
      animation: glow-sweep 3s infinite;
    }
    @keyframes glow-sweep { 0%,100% { opacity:0; } 50% { opacity:1; } }
    .btn-text { font-family: 'Orbitron',sans-serif; font-size: 0.85rem; font-weight: 700; letter-spacing: 3px; position: relative; z-index: 1; }
    .btn-sub { font-family: 'Share Tech Mono',monospace; font-size: 0.6rem; color: #45a29e; position: relative; z-index: 1; }
    .jobs-section { margin-top: 20px; }
    .jobs-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .jobs-title { font-family: 'Share Tech Mono',monospace; font-size: 0.65rem; color: #45a29e; letter-spacing: 2px; }
    .jobs-count { font-family: 'Orbitron',sans-serif; font-size: 0.7rem; color: #66fcf1; }
    .jobs-list { display: flex; flex-direction: column; gap: 6px; max-height: 280px; overflow-y: auto; }
    .job-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(102,252,241,0.1); padding: 8px 12px; border-radius: 2px; }
    .job-card.success { border-color: rgba(46,213,115,0.3); }
    .job-card.error   { border-color: rgba(255,71,87,0.3); }
    .job-top { display: flex; gap: 10px; align-items: center; margin-bottom: 6px; flex-wrap: wrap; }
    .job-id   { font-family: 'Share Tech Mono',monospace; font-size: 0.6rem; color: #45a29e; }
    .job-name { font-family: 'Orbitron',sans-serif; font-size: 0.7rem; color: #66fcf1; }
    .job-route { font-family: 'Share Tech Mono',monospace; font-size: 0.65rem; color: #a855f7; flex: 1; }
    .job-country { font-size: 0.65rem; color: #c5c6c7; }
    .job-status { font-family: 'Share Tech Mono',monospace; font-size: 0.58rem; padding: 2px 6px; border-radius: 2px; }
    .job-status.compiling { background: rgba(255,211,42,0.15); color: #ffd32a; }
    .job-status.success   { background: rgba(46,213,115,0.15); color: #2ed573; }
    .job-status.error     { background: rgba(255,71,87,0.15);  color: #ff4757; }
    .job-status.queued    { background: rgba(168,85,247,0.15); color: #a855f7; }
    .progress-bar-track { width: 100%; height: 3px; background: rgba(255,255,255,0.05); border-radius: 2px; }
    .progress-bar-fill { height: 100%; border-radius: 2px; transition: width 0.4s ease; }
    .progress-bar-fill.compiling { background: linear-gradient(90deg,#ffd32a,#ff9f43); box-shadow: 0 0 6px rgba(255,211,42,0.5); }
    .progress-bar-fill.success   { background: linear-gradient(90deg,#2ed573,#7bed9f); }
    .progress-bar-fill.error     { background: #ff4757; }
    .progress-label { font-family: 'Share Tech Mono',monospace; font-size: 0.55rem; color: #45a29e; text-align: right; margin-top: 2px; }
  `]
})
export class ConverterEngineComponent {
  api = inject(AetherionApiService);
  appName = '';
  source = 'Android';
  target = 'Windows';
  firing = signal(false);

  engage(): void {
    if (!this.appName.trim()) { this.appName = 'UnnamedApp'; }
    this.firing.set(true);
    this.api.requestConversion({
      appName: this.appName,
      sourcePlatform: this.source,
      targetPlatform: this.target
    }).subscribe(() => setTimeout(() => this.firing.set(false), 2000));
  }
}
