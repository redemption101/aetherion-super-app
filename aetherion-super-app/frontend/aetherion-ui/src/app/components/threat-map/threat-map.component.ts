import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AetherionApiService, ThreatEvent } from '../../services/aetherion-api.service';

@Component({
  selector: 'app-threat-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="threat-panel">
      <div class="panel-header">
        <span class="panel-icon">🛡️</span>
        <h2>NEWTONIAN GUARD</h2>
        <div class="threat-counter">
          <span class="counter-val">{{ api.systemStats().threatsNeutralized }}</span>
          <span class="counter-lbl">VOIDED</span>
        </div>
      </div>

      <div class="threat-grid-header">
        <span>IP ADDRESS</span>
        <span>ORIGIN</span>
        <span>ATTACK TYPE</span>
        <span>SEV</span>
        <span>STATUS</span>
      </div>

      <div class="threat-list">
        @for (threat of api.threatFeed(); track threat.id) {
          <div class="threat-row" [class]="threat.severity" [@threatEntry]>
            <span class="threat-ip">{{ threat.ip }}</span>
            <span class="threat-country">{{ threat.country }}</span>
            <span class="threat-type">{{ threat.type }}</span>
            <span class="threat-sev" [class]="threat.severity">{{ threat.severity.toUpperCase() }}</span>
            <span class="threat-status" [class]="threat.status">
              {{ threat.status === 'neutralized' ? '⚫ VOID' : threat.status === 'detected' ? '🔴 ACTIVE' : '✓ CLEAR' }}
            </span>
          </div>
        }
        @if (api.threatFeed().length === 0) {
          <div class="no-threats">
            <span class="nt-icon">✓</span>
            <span>All vectors nominal — no threats detected</span>
          </div>
        }
      </div>

      <div class="threat-footer">
        <div class="sev-legend">
          <span class="sev-dot critical"></span><span>CRITICAL</span>
          <span class="sev-dot high"></span><span>HIGH</span>
          <span class="sev-dot medium"></span><span>MEDIUM</span>
          <span class="sev-dot low"></span><span>LOW</span>
        </div>
        <span class="guard-label">EQUAL & OPPOSITE REACTION PROTOCOL ACTIVE</span>
      </div>
    </div>
  `,
  styles: [`
    .threat-panel {
      background: rgba(13,17,23,0.92);
      border: 1px solid rgba(255,71,87,0.25);
      border-radius: 4px; padding: 20px;
      position: relative; z-index: 2;
      backdrop-filter: blur(12px);
    }
    .panel-header { display:flex; align-items:center; gap:10px; margin-bottom:14px; border-bottom:1px solid rgba(255,71,87,0.15); padding-bottom:12px; }
    .panel-icon { font-size:1.4rem; }
    h2 { font-family:'Orbitron',sans-serif; font-size:0.9rem; color:#ff4757; letter-spacing:3px; flex:1; text-shadow:0 0 10px rgba(255,71,87,0.5); }
    .threat-counter { display:flex; flex-direction:column; align-items:center; gap:1px; }
    .counter-val { font-family:'Orbitron',sans-serif; font-size:1.2rem; color:#ff4757; font-weight:700; }
    .counter-lbl { font-family:'Share Tech Mono',monospace; font-size:0.55rem; color:#45a29e; letter-spacing:2px; }
    .threat-grid-header {
      display:grid; grid-template-columns:1.4fr 0.8fr 1.2fr 0.6fr 0.8fr;
      gap:8px; padding:6px 8px;
      font-family:'Share Tech Mono',monospace; font-size:0.55rem;
      color:#45a29e; letter-spacing:1.5px;
      border-bottom:1px solid rgba(255,71,87,0.1);
      margin-bottom:4px;
    }
    .threat-list { display:flex; flex-direction:column; gap:3px; max-height:280px; overflow-y:auto; }
    .threat-row {
      display:grid; grid-template-columns:1.4fr 0.8fr 1.2fr 0.6fr 0.8fr;
      gap:8px; padding:7px 8px;
      font-family:'Share Tech Mono',monospace; font-size:0.65rem;
      border-radius:2px; border-left:2px solid transparent;
      transition:all 0.3s; animation:slideIn 0.3s ease;
    }
    @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
    .threat-row.critical { background:rgba(255,71,87,0.08); border-left-color:#ff4757; }
    .threat-row.high     { background:rgba(255,165,2,0.06);  border-left-color:#ffa502; }
    .threat-row.medium   { background:rgba(255,211,42,0.05); border-left-color:#ffd32a; }
    .threat-row.low      { background:rgba(46,213,115,0.04); border-left-color:#2ed573; }
    .threat-ip      { color:#66fcf1; }
    .threat-country { color:#c5c6c7; }
    .threat-type    { color:#a855f7; }
    .threat-sev { font-size:0.55rem; padding:1px 4px; border-radius:2px; align-self:center; }
    .threat-sev.critical { background:rgba(255,71,87,0.2);  color:#ff4757; }
    .threat-sev.high     { background:rgba(255,165,2,0.2);  color:#ffa502; }
    .threat-sev.medium   { background:rgba(255,211,42,0.2); color:#ffd32a; }
    .threat-sev.low      { background:rgba(46,213,115,0.2); color:#2ed573; }
    .threat-status.detected    { color:#ff4757; }
    .threat-status.neutralized { color:#a855f7; }
    .no-threats { text-align:center; padding:30px; color:#2ed573; font-family:'Share Tech Mono',monospace; font-size:0.75rem; }
    .nt-icon { font-size:1.5rem; display:block; margin-bottom:8px; }
    .threat-footer { margin-top:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; border-top:1px solid rgba(255,71,87,0.1); padding-top:10px; }
    .sev-legend { display:flex; align-items:center; gap:8px; font-family:'Share Tech Mono',monospace; font-size:0.58rem; color:#45a29e; }
    .sev-dot { width:7px; height:7px; border-radius:50%; }
    .sev-dot.critical { background:#ff4757; box-shadow:0 0 4px #ff4757; }
    .sev-dot.high     { background:#ffa502; box-shadow:0 0 4px #ffa502; }
    .sev-dot.medium   { background:#ffd32a; }
    .sev-dot.low      { background:#2ed573; }
    .guard-label { font-family:'Share Tech Mono',monospace; font-size:0.55rem; color:rgba(255,71,87,0.5); letter-spacing:1px; }
    .threat-list::-webkit-scrollbar { width:4px; }
    .threat-list::-webkit-scrollbar-thumb { background:rgba(255,71,87,0.2); }
  `]
})
export class ThreatMapComponent {
  api = inject(AetherionApiService);
}
