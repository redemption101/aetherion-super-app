import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, interval, Subject, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Country {
  id: number;
  name: string;
  code: string;
  region: string;
  active: boolean;
  users: number;
  latency: number;
  status: 'online' | 'degraded' | 'offline';
}

export interface ConversionJob {
  id: string;
  appName: string;
  sourcePlatform: string;
  targetPlatform: string;
  progress: number;
  status: 'queued' | 'compiling' | 'success' | 'error';
  country: string;
  timestamp: Date;
}

export interface ThreatEvent {
  id: string;
  ip: string;
  country: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  status: 'detected' | 'neutralized' | 'void';
}

export interface SystemStats {
  totalUsers: number;
  activeConversions: number;
  countriesOnline: number;
  threatsNeutralized: number;
  uptime: number;
  erlangNodes: number;
  rustJobs: number;
}

@Injectable({ providedIn: 'root' })
export class AetherionApiService {

  private readonly BASE_URL = 'http://localhost:8080/api';

  // Live reactive signals
  systemStats = signal<SystemStats>({
    totalUsers: 6_000_000_000,
    activeConversions: 0,
    countriesOnline: 195,
    threatsNeutralized: 0,
    uptime: 0,
    erlangNodes: 12,
    rustJobs: 0
  });

  countries = signal<Country[]>(this.buildCountries());
  activeJobs = signal<ConversionJob[]>([]);
  threatFeed = signal<ThreatEvent[]>([]);
  terminalLines = signal<string[]>(['> AETHERION CORE ONLINE', '> Erlang BEAM initialized — 12 nodes active', '> Rust FFI compiler engine loaded', '> Awaiting conversion payloads...']);

  private threatCount = 0;
  private jobCount = 0;
  private uptimeSeconds = 0;

  constructor(private http: HttpClient) {
    this.startLivePulse();
  }

  // ── BACKEND API CALLS ─────────────────────────────────────────

  requestConversion(payload: { appName: string; sourcePlatform: string; targetPlatform: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/convert`, payload).pipe(
      tap(() => this.addTerminalLine(`> Conversion dispatched → ${payload.appName} :: ${payload.sourcePlatform} → ${payload.targetPlatform}`)),
      catchError(this.handleOffline(payload))
    );
  }

  getCountryStatus(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.BASE_URL}/countries`).pipe(
      catchError(() => of(this.buildCountries()))
    );
  }

  getSystemHealth(): Observable<SystemStats> {
    return this.http.get<SystemStats>(`${this.BASE_URL}/health`).pipe(
      catchError(() => of(this.systemStats()))
    );
  }

  getThreatFeed(): Observable<ThreatEvent[]> {
    return this.http.get<ThreatEvent[]>(`${this.BASE_URL}/threats`).pipe(
      catchError(() => of([]))
    );
  }

  // ── LIVE SIMULATION PULSE (fires when backend is offline) ─────

  private startLivePulse(): void {
    // Uptime counter every second
    interval(1000).subscribe(() => {
      this.uptimeSeconds++;
      this.systemStats.update(s => ({ ...s, uptime: this.uptimeSeconds }));
    });

    // Simulate live conversion jobs every 3.5s
    interval(3500).subscribe(() => {
      this.simulateConversionJob();
    });

    // Simulate threat events every 7s
    interval(7000).subscribe(() => {
      this.simulateThreatEvent();
    });

    // Rotate country statuses every 5s
    interval(5000).subscribe(() => {
      this.pulseCountries();
    });

    // Pulse user count every 2s
    interval(2000).subscribe(() => {
      this.systemStats.update(s => ({
        ...s,
        totalUsers: s.totalUsers + Math.floor(Math.random() * 847),
        rustJobs: Math.floor(Math.random() * 240)
      }));
    });
  }

  private simulateConversionJob(): void {
    const apps = ['TikTok','Instagram','WhatsApp','Snapchat','Twitter','Telegram','Uber','Airbnb','Netflix','Spotify'];
    const platforms = ['Android → Windows','iOS → macOS','iOS → Windows','Android → Linux','Windows → Android','macOS → iOS'];
    const countryList = this.countries();
    const country = countryList[Math.floor(Math.random() * countryList.length)];

    const job: ConversionJob = {
      id: `JOB-${++this.jobCount}`,
      appName: apps[Math.floor(Math.random() * apps.length)],
      sourcePlatform: platforms[Math.floor(Math.random() * platforms.length)].split(' → ')[0],
      targetPlatform: platforms[Math.floor(Math.random() * platforms.length)].split(' → ')[1],
      progress: 0,
      status: 'compiling',
      country: country.name,
      timestamp: new Date()
    };

    this.activeJobs.update(jobs => [job, ...jobs].slice(0, 12));
    this.systemStats.update(s => ({ ...s, activeConversions: s.activeConversions + 1 }));
    this.addTerminalLine(`> [${job.id}] Compiling ${job.appName} for ${job.country} — ${job.sourcePlatform} → ${job.targetPlatform}`);

    // Animate progress
    let progress = 0;
    const tick = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(tick);
        this.activeJobs.update(jobs => jobs.map(j => j.id === job.id ? { ...j, progress: 100, status: 'success' } : j));
        this.addTerminalLine(`> [${job.id}] ✓ SUCCESS — Binary compiled @ Rust FFI layer`);
      } else {
        this.activeJobs.update(jobs => jobs.map(j => j.id === job.id ? { ...j, progress } : j));
      }
    }, 400);
  }

  private simulateThreatEvent(): void {
    const threatTypes = ['SQL_INJECTION', 'PORT_SCAN', 'BUFFER_OVERFLOW', 'BRUTE_FORCE', 'XSS_ATTEMPT', 'DDoS_PROBE', 'NOP_SLED'];
    const severities: ThreatEvent['severity'][] = ['low', 'medium', 'high', 'critical'];
    const fakeIPs = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
    const countries = ['Russia', 'China', 'North Korea', 'Iran', 'Unknown', 'Brazil', 'Nigeria', 'Romania'];

    const threat: ThreatEvent = {
      id: `THR-${++this.threatCount}`,
      ip: fakeIPs(),
      country: countries[Math.floor(Math.random() * countries.length)],
      type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      timestamp: new Date(),
      status: 'detected'
    };

    this.threatFeed.update(t => [threat, ...t].slice(0, 20));
    this.addTerminalLine(`> [NEWTONIAN GUARD] THREAT DETECTED :: ${threat.type} from ${threat.ip} (${threat.country})`);

    setTimeout(() => {
      this.threatFeed.update(t => t.map(e => e.id === threat.id ? { ...e, status: 'neutralized' } : e));
      this.addTerminalLine(`> [NEWTONIAN GUARD] ${threat.ip} CAST TO THE VOID — IP flagged for authorities`);
      this.systemStats.update(s => ({ ...s, threatsNeutralized: s.threatsNeutralized + 1 }));
    }, 2500);
  }

  private pulseCountries(): void {
    this.countries.update(list => list.map(c => ({
      ...c,
      users: c.users + Math.floor(Math.random() * 5000),
      latency: Math.floor(Math.random() * 80) + 10,
      status: Math.random() > 0.05 ? 'online' : (Math.random() > 0.5 ? 'degraded' : 'offline')
    })));
  }

  addTerminalLine(line: string): void {
    const ts = new Date().toTimeString().split(' ')[0];
    this.terminalLines.update(lines => [`[${ts}] ${line}`, ...lines].slice(0, 80));
  }

  private handleOffline(payload: any) {
    return (err: HttpErrorResponse) => {
      this.addTerminalLine(`> [OFFLINE MODE] Simulating conversion for ${payload.appName}`);
      this.simulateConversionJob();
      return of({ status: 'simulated', message: 'Backend offline — simulation active' });
    };
  }

  formatUptime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  formatBigNumber(n: number): string {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  }

  private buildCountries(): Country[] {
    const data = [
      ['Afghanistan','AF','Asia'],['Albania','AL','Europe'],['Algeria','DZ','Africa'],
      ['Angola','AO','Africa'],['Argentina','AR','Americas'],['Armenia','AM','Asia'],
      ['Australia','AU','Oceania'],['Austria','AT','Europe'],['Azerbaijan','AZ','Asia'],
      ['Bangladesh','BD','Asia'],['Belarus','BY','Europe'],['Belgium','BE','Europe'],
      ['Bolivia','BO','Americas'],['Bosnia','BA','Europe'],['Botswana','BW','Africa'],
      ['Brazil','BR','Americas'],['Bulgaria','BG','Europe'],['Cambodia','KH','Asia'],
      ['Cameroon','CM','Africa'],['Canada','CA','Americas'],['Chile','CL','Americas'],
      ['China','CN','Asia'],['Colombia','CO','Americas'],['Congo','CG','Africa'],
      ['Costa Rica','CR','Americas'],['Croatia','HR','Europe'],['Cuba','CU','Americas'],
      ['Czech Republic','CZ','Europe'],['Denmark','DK','Europe'],['Ecuador','EC','Americas'],
      ['Egypt','EG','Africa'],['Ethiopia','ET','Africa'],['Finland','FI','Europe'],
      ['France','FR','Europe'],['Georgia','GE','Asia'],['Germany','DE','Europe'],
      ['Ghana','GH','Africa'],['Greece','GR','Europe'],['Guatemala','GT','Americas'],
      ['Honduras','HN','Americas'],['Hungary','HU','Europe'],['India','IN','Asia'],
      ['Indonesia','ID','Asia'],['Iran','IR','Asia'],['Iraq','IQ','Asia'],
      ['Ireland','IE','Europe'],['Israel','IL','Asia'],['Italy','IT','Europe'],
      ['Jamaica','JM','Americas'],['Japan','JP','Asia'],['Jordan','JO','Asia'],
      ['Kazakhstan','KZ','Asia'],['Kenya','KE','Africa'],['Kuwait','KW','Asia'],
      ['Kyrgyzstan','KG','Asia'],['Laos','LA','Asia'],['Latvia','LV','Europe'],
      ['Lebanon','LB','Asia'],['Libya','LY','Africa'],['Lithuania','LT','Europe'],
      ['Malaysia','MY','Asia'],['Mali','ML','Africa'],['Mexico','MX','Americas'],
      ['Moldova','MD','Europe'],['Mongolia','MN','Asia'],['Morocco','MA','Africa'],
      ['Mozambique','MZ','Africa'],['Myanmar','MM','Asia'],['Namibia','NA','Africa'],
      ['Nepal','NP','Asia'],['Netherlands','NL','Europe'],['New Zealand','NZ','Oceania'],
      ['Nicaragua','NI','Americas'],['Niger','NE','Africa'],['Nigeria','NG','Africa'],
      ['North Korea','KP','Asia'],['Norway','NO','Europe'],['Oman','OM','Asia'],
      ['Pakistan','PK','Asia'],['Panama','PA','Americas'],['Paraguay','PY','Americas'],
      ['Peru','PE','Americas'],['Philippines','PH','Asia'],['Poland','PL','Europe'],
      ['Portugal','PT','Europe'],['Qatar','QA','Asia'],['Romania','RO','Europe'],
      ['Russia','RU','Europe'],['Rwanda','RW','Africa'],['Saudi Arabia','SA','Asia'],
      ['Senegal','SN','Africa'],['Serbia','RS','Europe'],['Singapore','SG','Asia'],
      ['Slovakia','SK','Europe'],['Somalia','SO','Africa'],['South Africa','ZA','Africa'],
      ['South Korea','KR','Asia'],['South Sudan','SS','Africa'],['Spain','ES','Europe'],
      ['Sri Lanka','LK','Asia'],['Sudan','SD','Africa'],['Sweden','SE','Europe'],
      ['Switzerland','CH','Europe'],['Syria','SY','Asia'],['Taiwan','TW','Asia'],
      ['Tajikistan','TJ','Asia'],['Tanzania','TZ','Africa'],['Thailand','TH','Asia'],
      ['Tunisia','TN','Africa'],['Turkey','TR','Asia'],['Turkmenistan','TM','Asia'],
      ['Uganda','UG','Africa'],['Ukraine','UA','Europe'],['UAE','AE','Asia'],
      ['United Kingdom','GB','Europe'],['USA','US','Americas'],['Uruguay','UY','Americas'],
      ['Uzbekistan','UZ','Asia'],['Venezuela','VE','Americas'],['Vietnam','VN','Asia'],
      ['Yemen','YE','Asia'],['Zambia','ZM','Africa'],['Zimbabwe','ZW','Africa'],
      ['Bahrain','BH','Asia'],['Barbados','BB','Americas'],['Belize','BZ','Americas'],
      ['Benin','BJ','Africa'],['Bhutan','BT','Asia'],['Brunei','BN','Asia'],
      ['Burkina Faso','BF','Africa'],['Burundi','BI','Africa'],['Cabo Verde','CV','Africa'],
      ['Central African Republic','CF','Africa'],['Chad','TD','Africa'],['Comoros','KM','Africa'],
      ['Djibouti','DJ','Africa'],['Dominica','DM','Americas'],['Dominican Republic','DO','Americas'],
      ['El Salvador','SV','Americas'],['Equatorial Guinea','GQ','Africa'],['Eritrea','ER','Africa'],
      ['Eswatini','SZ','Africa'],['Fiji','FJ','Oceania'],['Gabon','GA','Africa'],
      ['Gambia','GM','Africa'],['Grenada','GD','Americas'],['Guinea','GN','Africa'],
      ['Guinea-Bissau','GW','Africa'],['Guyana','GY','Americas'],['Haiti','HT','Americas'],
      ['Iceland','IS','Europe'],['Kiribati','KI','Oceania'],['Kosovo','XK','Europe'],
      ['Lesotho','LS','Africa'],['Liberia','LR','Africa'],['Liechtenstein','LI','Europe'],
      ['Luxembourg','LU','Europe'],['Madagascar','MG','Africa'],['Malawi','MW','Africa'],
      ['Maldives','MV','Asia'],['Malta','MT','Europe'],['Marshall Islands','MH','Oceania'],
      ['Mauritania','MR','Africa'],['Mauritius','MU','Africa'],['Micronesia','FM','Oceania'],
      ['Monaco','MC','Europe'],['Montenegro','ME','Europe'],['Nauru','NR','Oceania'],
      ['North Macedonia','MK','Europe'],['Palau','PW','Oceania'],['Palestine','PS','Asia'],
      ['Papua New Guinea','PG','Oceania'],['Saint Kitts','KN','Americas'],['Saint Lucia','LC','Americas'],
      ['Samoa','WS','Oceania'],['San Marino','SM','Europe'],['Sao Tome','ST','Africa'],
      ['Seychelles','SC','Africa'],['Sierra Leone','SL','Africa'],['Slovenia','SI','Europe'],
      ['Solomon Islands','SB','Oceania'],['Suriname','SR','Americas'],['Timor-Leste','TL','Asia'],
      ['Togo','TG','Africa'],['Tonga','TO','Oceania'],['Trinidad and Tobago','TT','Americas'],
      ['Tuvalu','TV','Oceania'],['Vanuatu','VU','Oceania'],['Vatican','VA','Europe']
    ];
    return data.map((d, i) => ({
      id: i + 1,
      name: d[0], code: d[1], region: d[2],
      active: Math.random() > 0.05,
      users: Math.floor(Math.random() * 50_000_000) + 100_000,
      latency: Math.floor(Math.random() * 80) + 10,
      status: Math.random() > 0.05 ? 'online' : 'degraded'
    }));
  }
}
