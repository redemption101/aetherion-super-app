import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AetherionApiService, Country } from '../../services/aetherion-api.service';

@Component({
  selector: 'app-globe-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="globe-panel">
      <div class="panel-header">
        <span class="panel-icon">🌍</span>
        <h2>195-COUNTRY GRID</h2>
        <div class="region-tabs">
          @for (r of regions; track r) {
            <button class="region-tab" [class.active]="activeRegion() === r" (click)="activeRegion.set(r)">{{ r }}</button>
          }
        </div>
        <div class="grid-summary">
          <span class="online-count">{{ onlineCount() }} <small>ONLINE</small></span>
        </div>
      </div>

      <div class="country-grid">
        @for (c of filteredCountries(); track c.id) {
          <div class="country-node" [class]="c.status" [title]="c.name + ' — ' + api.formatBigNumber(c.users) + ' users — ' + c.latency + 'ms'">
            <div class="node-pulse" [class]="c.status"></div>
            <span class="country-code">{{ c.code }}</span>
            <span class="country-lat">{{ c.latency }}ms</span>
          </div>
        }
      </div>

      <div class="globe-footer">
        <div class="status-legend">
          <span class="leg-dot online"></span><span>ONLINE</span>
          <span class="leg-dot degraded"></span><span>DEGRADED</span>
          <span class="leg-dot offline"></span><span>OFFLINE</span>
        </div>
        <span class="total-users">
          TOTAL GLOBAL USERS: <strong>{{ api.formatBigNumber(api.systemStats().totalUsers) }}</strong>
        </span>
      </div>
    </div>
  `,
  styles: [`
    .globe-panel {
      background: rgba(13,17,23,0.92);
      border: 1px solid rgba(102,252,241,0.2);
      border-radius: 4px; padding: 20px;
      position: relative; z-index: 2;
      backdrop-filter: blur(12px);
    }
    .panel-header { display:flex; align-items:center; gap:10px; margin-bottom:14px; border-bottom:1px solid rgba(102,252,241,0.1); padding-bottom:12px; flex-wrap:wrap; }
    .panel-icon { font-size:1.4rem; }
    h2 { font-family:'Orbitron',sans-serif; font-size:0.9rem; color:#66fcf1; letter-spacing:3px; }
    .region-tabs { display:flex; gap:4px; flex-wrap:wrap; flex:1; }
    .region-tab { background:transparent; border:1px solid rgba(102,252,241,0.2); color:#45a29e; padding:3px 8px; font-family:'Share Tech Mono',monospace; font-size:0.58rem; cursor:pointer; border-radius:2px; transition:all 0.2s; letter-spacing:1px; }
    .region-tab:hover,.region-tab.active { background:rgba(102,252,241,0.1); border-color:#66fcf1; color:#66fcf1; }
    .grid-summary { display:flex; align-items:center; }
    .online-count { font-family:'Orbitron',sans-serif; font-size:1rem; color:#2ed573; font-weight:700; display:flex; align-items:baseline; gap:4px; }
    .online-count small { font-family:'Share Tech Mono',monospace; font-size:0.55rem; color:#45a29e; letter-spacing:2px; }
    .country-grid { display:flex; flex-wrap:wrap; gap:5px; max-height:220px; overflow-y:auto; padding:4px 0; }
    .country-node {
      width:52px; height:48px;
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      border:1px solid rgba(102,252,241,0.1);
      border-radius:3px; position:relative; gap:2px;
      transition:all 0.3s; cursor:default;
      background: rgba(255,255,255,0.01);
    }
    .country-node:hover { transform:scale(1.1); z-index:5; }
    .country-node.online   { border-color:rgba(46,213,115,0.3); }
    .country-node.degraded { border-color:rgba(255,211,42,0.3); }
    .country-node.offline  { border-color:rgba(255,71,87,0.2); opacity:0.5; }
    .node-pulse {
      position:absolute; top:4px; right:4px;
      width:5px; height:5px; border-radius:50%;
    }
    .node-pulse.online   { background:#2ed573; animation:micro-pulse 2s infinite; }
    .node-pulse.degraded { background:#ffd32a; animation:micro-pulse 1s infinite; }
    .node-pulse.offline  { background:#ff4757; }
    @keyframes micro-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .country-code { font-family:'Share Tech Mono',monospace; font-size:0.65rem; color:#66fcf1; font-weight:700; }
    .country-lat  { font-family:'Share Tech Mono',monospace; font-size:0.5rem; color:#45a29e; }
    .globe-footer { margin-top:12px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(102,252,241,0.1); padding-top:10px; flex-wrap:wrap; gap:8px; }
    .status-legend { display:flex; align-items:center; gap:8px; font-family:'Share Tech Mono',monospace; font-size:0.58rem; color:#45a29e; }
    .leg-dot { width:7px; height:7px; border-radius:50%; }
    .leg-dot.online   { background:#2ed573; box-shadow:0 0 4px #2ed573; }
    .leg-dot.degraded { background:#ffd32a; }
    .leg-dot.offline  { background:#ff4757; }
    .total-users { font-family:'Share Tech Mono',monospace; font-size:0.65rem; color:#45a29e; }
    .total-users strong { color:#66fcf1; font-family:'Orbitron',sans-serif; }
    .country-grid::-webkit-scrollbar { width:4px; }
    .country-grid::-webkit-scrollbar-thumb { background:rgba(102,252,241,0.15); }
  `]
})
export class GlobeCounterComponent {
  api = inject(AetherionApiService);
  regions = ['ALL', 'Africa', 'Asia', 'Europe', 'Americas', 'Oceania'];
  activeRegion = signal('ALL');

  filteredCountries = computed(() => {
    const r = this.activeRegion();
    return r === 'ALL' ? this.api.countries() : this.api.countries().filter(c => c.region === r);
  });

  onlineCount = computed(() => this.api.countries().filter(c => c.status === 'online').length);
}
