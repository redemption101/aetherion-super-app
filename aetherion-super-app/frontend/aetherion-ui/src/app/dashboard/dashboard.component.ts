import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AetherionApiService } from '../services/aetherion-api.service';
import { ParticleCanvasComponent } from '../components/particle-canvas/particle-canvas.component';
import { StatBarComponent } from '../components/stat-bar/stat-bar.component';
import { ConverterEngineComponent } from '../components/converter-engine/converter-engine.component';
import { TerminalFeedComponent } from '../components/terminal-feed/terminal-feed.component';
import { ThreatMapComponent } from '../components/threat-map/threat-map.component';
import { GlobeCounterComponent } from '../components/globe-counter/globe-counter.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ParticleCanvasComponent,
    StatBarComponent,
    ConverterEngineComponent,
    TerminalFeedComponent,
    ThreatMapComponent,
    GlobeCounterComponent
  ],
  template: `
    <div class="aetherion-root">

      <!-- Living particle field background -->
      <app-particle-canvas></app-particle-canvas>

      <!-- Master layout -->
      <div class="layout-wrapper">

        <!-- TOP NAV BAR -->
        <header class="top-nav">
          <div class="nav-brand">
            <div class="brand-logo">
              <span class="logo-ring"></span>
              <span class="logo-core">A</span>
            </div>
            <div class="brand-text">
              <span class="brand-title">AETHERION</span>
              <span class="brand-sub">SUPER APP CONVERTER — GLOBAL MATRIX</span>
            </div>
          </div>

          <div class="nav-center">
            <div class="ticker-wrap">
              <div class="ticker">
                @for (c of api.countries().slice(0, 40); track c.id) {
                  <span class="tick-item" [class]="c.status">
                    {{ c.code }} <span class="tick-lat">{{ c.latency }}ms</span>
                  </span>
                }
              </div>
            </div>
          </div>

          <div class="nav-right">
            <div class="nav-pill online">
              <span class="pill-dot"></span> SYSTEM ONLINE
            </div>
            <div class="nav-pill erlang">
              <span>ERLANG</span>
              <span class="pill-val">{{ api.systemStats().erlangNodes }} NODES</span>
            </div>
            <div class="nav-pill rust">
              <span>RUST FFI</span>
              <span class="pill-val">ACTIVE</span>
            </div>
          </div>
        </header>

        <!-- LIVE STAT BAR -->
        <app-stat-bar></app-stat-bar>

        <!-- MAIN GRID -->
        <main class="main-grid">

          <!-- LEFT COLUMN -->
          <div class="col-left">
            <app-converter-engine></app-converter-engine>
            <app-globe-counter></app-globe-counter>
          </div>

          <!-- RIGHT COLUMN -->
          <div class="col-right">
            <app-threat-map></app-threat-map>
            <app-terminal-feed></app-terminal-feed>
          </div>

        </main>

        <!-- FOOTER -->
        <footer class="footer">
          <span class="footer-left">
            SOVEREIGN ARCHITECT: <strong>MANDLENKOSI VUNDLA</strong> &nbsp;|&nbsp;
            CO-FOUNDERS: <strong>THEODORE SWARTS · SEMPI MVALA · MRS CODEX</strong>
          </span>
          <span class="footer-center">
            AETHERION v1.0.0 — BUILT ON ERLANG/OTP + RUST FFI + ANGULAR 17
          </span>
          <span class="footer-right">
            UPTIME: <strong>{{ api.formatUptime(api.systemStats().uptime) }}</strong>
          </span>
        </footer>

      </div>
    </div>
  `,
  styles: [`
    .aetherion-root {
      min-height: 100vh;
      background: #0b0c10;
      overflow-x: hidden;
    }
    .layout-wrapper {
      position: relative; z-index: 1;
      display: flex; flex-direction: column;
      min-height: 100vh;
    }

    /* ── TOP NAV ── */
    .top-nav {
      display: flex; align-items: center; gap: 16px;
      padding: 12px 24px;
      background: rgba(11,12,16,0.98);
      border-bottom: 1px solid rgba(102,252,241,0.15);
      backdrop-filter: blur(20px);
      position: sticky; top: 0; z-index: 100;
    }
    .nav-brand { display:flex; align-items:center; gap:12px; flex-shrink:0; }
    .brand-logo {
      width: 40px; height: 40px;
      position: relative; display:flex; align-items:center; justify-content:center;
    }
    .logo-ring {
      position: absolute; inset: 0; border-radius: 50%;
      border: 2px solid #66fcf1;
      box-shadow: 0 0 12px rgba(102,252,241,0.5), inset 0 0 12px rgba(102,252,241,0.1);
      animation: spin-ring 8s linear infinite;
    }
    @keyframes spin-ring { to { transform: rotate(360deg); } }
    .logo-core {
      font-family: 'Orbitron', sans-serif; font-size: 1.1rem; font-weight: 900;
      color: #66fcf1; z-index: 1;
    }
    .brand-title { font-family:'Orbitron',sans-serif; font-size:1.1rem; font-weight:900; color:#66fcf1; letter-spacing:4px; display:block; text-shadow:0 0 15px rgba(102,252,241,0.6); }
    .brand-sub   { font-family:'Share Tech Mono',monospace; font-size:0.55rem; color:#45a29e; letter-spacing:2px; display:block; }

    /* ticker */
    .nav-center { flex:1; overflow:hidden; }
    .ticker-wrap { overflow:hidden; position:relative; }
    .ticker { display:flex; gap:16px; animation:ticker-scroll 60s linear infinite; width:max-content; }
    @keyframes ticker-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    .tick-item { font-family:'Share Tech Mono',monospace; font-size:0.62rem; white-space:nowrap; }
    .tick-item.online   { color:#2ed573; }
    .tick-item.degraded { color:#ffd32a; }
    .tick-item.offline  { color:#ff4757; }
    .tick-lat { color:#45a29e; font-size:0.55rem; }

    /* nav pills */
    .nav-right { display:flex; gap:8px; flex-shrink:0; }
    .nav-pill {
      display: flex; flex-direction:column; align-items:center;
      padding: 4px 12px; border-radius: 2px;
      font-family:'Share Tech Mono',monospace; font-size:0.55rem;
      letter-spacing:1px; border:1px solid transparent;
    }
    .nav-pill.online  { border-color:rgba(46,213,115,0.4); color:#2ed573; background:rgba(46,213,115,0.06); }
    .nav-pill.erlang  { border-color:rgba(168,85,247,0.4); color:#a855f7; background:rgba(168,85,247,0.06); }
    .nav-pill.rust    { border-color:rgba(59,130,246,0.4); color:#3b82f6; background:rgba(59,130,246,0.06); }
    .pill-dot { width:6px; height:6px; border-radius:50%; background:#2ed573; animation:pulse-ring 1.5s infinite; margin-bottom:2px; }
    @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(46,213,115,0.7)} 70%{box-shadow:0 0 0 6px rgba(46,213,115,0)} 100%{box-shadow:0 0 0 0 rgba(46,213,115,0)} }
    .pill-val { color:#c5c6c7; }

    /* ── MAIN GRID ── */
    .main-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 16px;
      padding: 16px 24px;
      flex: 1;
    }
    .col-left, .col-right { display:flex; flex-direction:column; gap:16px; }

    /* ── FOOTER ── */
    .footer {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 24px;
      background: rgba(11,12,16,0.98);
      border-top: 1px solid rgba(102,252,241,0.12);
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.58rem; color: #45a29e;
      flex-wrap: wrap; gap: 8px;
    }
    .footer strong  { color: #66fcf1; }
    .footer-center  { color: rgba(102,252,241,0.3); letter-spacing: 1px; }

    /* ── RESPONSIVE ── */
    @media (max-width: 900px) {
      .main-grid { grid-template-columns: 1fr; }
      .nav-center { display: none; }
    }
  `]
})
export class DashboardComponent {
  api = inject(AetherionApiService);
}
