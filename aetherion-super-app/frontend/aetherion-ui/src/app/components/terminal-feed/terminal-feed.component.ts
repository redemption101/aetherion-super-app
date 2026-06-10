import { Component, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AetherionApiService } from '../../services/aetherion-api.service';

@Component({
  selector: 'app-terminal-feed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="terminal-panel">
      <div class="terminal-header">
        <div class="terminal-dots">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <span class="terminal-title">AETHERION CORE — LIVE SYSTEM LOG</span>
        <span class="terminal-badge">BEAM VM</span>
      </div>
      <div class="terminal-body" #termBody>
        <div class="scan-line"></div>
        @for (line of api.terminalLines(); track $index) {
          <div class="term-line" [class]="getLineClass(line)">
            <span class="term-prompt">{{ getPrompt(line) }}</span>
            <span class="term-text">{{ getContent(line) }}</span>
          </div>
        }
        <div class="cursor-line">
          <span class="blink-cursor">█</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .terminal-panel {
      background: rgba(5,8,12,0.97);
      border: 1px solid rgba(102,252,241,0.2);
      border-radius: 4px;
      display: flex; flex-direction: column;
      position: relative; z-index: 2;
      backdrop-filter: blur(12px);
      overflow: hidden;
    }
    .terminal-header {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 16px;
      background: rgba(102,252,241,0.04);
      border-bottom: 1px solid rgba(102,252,241,0.12);
    }
    .terminal-dots { display: flex; gap: 6px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot.red    { background: #ff4757; box-shadow: 0 0 4px #ff4757; }
    .dot.yellow { background: #ffd32a; box-shadow: 0 0 4px #ffd32a; }
    .dot.green  { background: #2ed573; box-shadow: 0 0 4px #2ed573; animation: pulse-dot 2s infinite; }
    @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.5} }
    .terminal-title { font-family: 'Share Tech Mono',monospace; font-size: 0.65rem; color: #45a29e; letter-spacing: 2px; flex: 1; }
    .terminal-badge { font-family: 'Share Tech Mono',monospace; font-size: 0.55rem; color: #a855f7; border: 1px solid rgba(168,85,247,0.4); padding: 2px 6px; border-radius: 2px; }
    .terminal-body {
      padding: 12px 16px;
      flex: 1; overflow-y: auto;
      max-height: 320px;
      display: flex; flex-direction: column-reverse;
      position: relative;
    }
    .scan-line {
      position: absolute; left: 0; width: 100%; height: 2px;
      background: linear-gradient(90deg, transparent, rgba(102,252,241,0.15), transparent);
      animation: scan 4s linear infinite;
      pointer-events: none;
    }
    @keyframes scan { 0%{top:0%} 100%{top:100%} }
    .term-line { display: flex; gap: 8px; font-family: 'Share Tech Mono',monospace; font-size: 0.7rem; line-height: 1.8; word-break: break-all; }
    .term-prompt { color: #45a29e; white-space: nowrap; }
    .term-text { color: #c5c6c7; }
    .term-line.success .term-text  { color: #2ed573; }
    .term-line.threat  .term-text  { color: #ff4757; }
    .term-line.warning .term-text  { color: #ffd32a; }
    .term-line.info    .term-text  { color: #66fcf1; }
    .term-line.void    .term-text  { color: #a855f7; }
    .cursor-line { font-family: 'Share Tech Mono',monospace; }
    .blink-cursor { color: #66fcf1; animation: blink 1s step-end infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    .terminal-body::-webkit-scrollbar { width: 4px; }
    .terminal-body::-webkit-scrollbar-thumb { background: rgba(102,252,241,0.2); }
  `]
})
export class TerminalFeedComponent {
  api = inject(AetherionApiService);

  getLineClass(line: string): string {
    if (line.includes('SUCCESS') || line.includes('✓')) return 'success';
    if (line.includes('THREAT') || line.includes('DETECTED') || line.includes('INTRUSION')) return 'threat';
    if (line.includes('VOID') || line.includes('BANISHED') || line.includes('flagged')) return 'void';
    if (line.includes('WARNING') || line.includes('OFFLINE')) return 'warning';
    if (line.includes('ONLINE') || line.includes('initialized') || line.includes('loaded')) return 'info';
    return '';
  }

  getPrompt(line: string): string {
    if (line.includes('NEWTONIAN')) return '[GUARD]$';
    if (line.includes('JOB-')) return '[COMPILER]$';
    if (line.includes('OFFLINE')) return '[WARN]$';
    return '[AETHERION]$';
  }

  getContent(line: string): string {
    return line.replace(/^\[\d{2}:\d{2}:\d{2}\]\s*>\s*/, '').replace(/^> /, '');
  }
}
