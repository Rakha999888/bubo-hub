import { HermesEvent } from '../../types';

type Listener = (e: HermesEvent) => void;
declare const process: { env: { HERMES_WS_URL?: string } };

/**
 * Hermes client connecting to local Bubo WebSocket server.
 * Auto-detects local host / proxy subpath (/bubo-hub/ws or /ws).
 */
class HermesClient {
  private listener: Listener = () => {};
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectTimer: any = null;

  constructor() {
    if (typeof process !== 'undefined' && process.env && process.env.HERMES_WS_URL) {
      this.url = process.env.HERMES_WS_URL;
    } else if (typeof window !== 'undefined') {
      const isHttps = window.location.protocol === 'https:';
      const proto = isHttps ? 'wss:' : 'ws:';
      const host = window.location.host;
      const isSubpath = window.location.pathname.startsWith('/bubo-hub');
      this.url = `${proto}//${host}${isSubpath ? '/bubo-hub' : ''}/ws`;
    } else {
      this.url = 'ws://127.0.0.1:4005/ws';
    }
  }

  connect(l: Listener) {
    this.listener = l;
    if (typeof window === 'undefined') return;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log(`[BuboClient] Connected to Bubo server at ${this.url}`);
      };

      this.ws.onmessage = (m) => {
        try {
          const data = JSON.parse(m.data);
          this.listener(data);
        } catch (e) {
          console.warn('[BuboClient] Failed to parse message', e);
        }
      };

      this.ws.onerror = (e) => {
        console.warn(`[BuboClient] WS error connecting to ${this.url}`);
      };

      this.ws.onclose = () => {
        if (!this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect(this.listener);
          }, 3000);
        }
      };
    } catch (err) {
      console.warn('[BuboClient] WebSocket init error, fallback active', err);
    }
  }

  sendPrompt(agentId: string, text: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'prompt', agentId, text }));
    } else {
      this.mock(agentId, text);
    }
  }

  private mock(agentId: string, text: string) {
    const emit = (patch: any) => this.listener({ type: 'agent_state', agentId, patch });
    const log = (line: string) => this.listener({ type: 'agent_log', agentId, line });
    emit({ status: 'thinking', task: text, activity: 'Membaca instruksi...', progress: 5, animation: 'think', location: 'desk' });
    log(`[Bubo] Menerima instruksi: "${text}"`);
    setTimeout(() => { emit({ status: 'walking', activity: 'Menuju workstation', animation: 'walk' }); }, 900);
    setTimeout(() => { emit({ status: 'working', activity: 'Menjalankan tools', tool: 'Hermes Local Engine', progress: 35, animation: 'type' }); log('[Bubo] Tool aktif: Hermes Local Engine'); }, 3000);
    setTimeout(() => { emit({ progress: 70, activity: 'Menganalisis hasil' }); log('[Bubo] Hasil terverifikasi, memfinalisasi output'); }, 6000);
    setTimeout(() => { emit({ progress: 95, activity: 'Menyusun laporan' }); }, 8500);
    setTimeout(() => { emit({ status: 'success', progress: 100, activity: 'Selesai', animation: 'success' }); log('[Bubo] Tugas selesai dikerjakan.'); }, 10500);
    setTimeout(() => { emit({ status: 'idle', activity: 'Idle', animation: 'idle', tool: '-' }); }, 14000);
  }
}

export const hermes = new HermesClient();
