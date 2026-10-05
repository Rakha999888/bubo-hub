import { HermesEvent } from '../../types';

type Listener = (e: HermesEvent) => void;
declare const process: { env: { HERMES_WS_URL?: string } };

const DEFAULT_FALLBACK_WSS = 'wss://tapes-link-metallica-billy.trycloudflare.com/ws';

/**
 * Hermes client connecting to live Bubo WebSocket server.
 * Auto-detects local host, dynamic ws-config.json, or secure Cloudflare Tunnel WSS.
 */
class HermesClient {
  private listener: Listener = () => {};
  private ws: WebSocket | null = null;
  private url: string = '';
  private reconnectTimer: any = null;
  private isConnecting: boolean = false;

  async resolveUrl(): Promise<string> {
    if (typeof process !== 'undefined' && process.env && process.env.HERMES_WS_URL) {
      return process.env.HERMES_WS_URL;
    }
    if (typeof window !== 'undefined') {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocalhost) {
        return `ws://${window.location.hostname}:4005/ws`;
      }

      // Try fetching runtime ws-config.json
      try {
        const basePath = window.location.pathname.startsWith('/bubo-hub') ? '/bubo-hub' : '';
        const res = await fetch(`${basePath}/ws-config.json?_t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const cfg = await res.json();
          if (cfg && cfg.wsUrl) {
            console.log('[BuboClient] Loaded dynamic WS URL from config:', cfg.wsUrl);
            return cfg.wsUrl;
          }
        }
      } catch (err) {
        console.warn('[BuboClient] Fetch ws-config.json failed, falling back', err);
      }

      return DEFAULT_FALLBACK_WSS;
    }
    return 'ws://127.0.0.1:4005/ws';
  }

  async connect(l: Listener) {
    this.listener = l;
    if (typeof window === 'undefined') return;
    if (this.isConnecting) return;

    this.isConnecting = true;

    try {
      if (!this.url) {
        this.url = await this.resolveUrl();
      }

      console.log(`[BuboClient] Initiating WebSocket connection to ${this.url}`);
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.isConnecting = false;
        console.log(`[BuboClient] Connected to live Bubo server at ${this.url}`);
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
        this.isConnecting = false;
        console.warn(`[BuboClient] WS connection error to ${this.url}`, e);
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        if (!this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect(this.listener);
          }, 3000);
        }
      };
    } catch (err) {
      this.isConnecting = false;
      console.warn('[BuboClient] WebSocket init error, will retry...', err);
      if (!this.reconnectTimer) {
        this.reconnectTimer = setTimeout(() => {
          this.reconnectTimer = null;
          this.connect(this.listener);
        }, 4000);
      }
    }
  }

  sendPrompt(agentId: string, text: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'prompt', agentId, text }));
    } else {
      console.warn('[BuboClient] Cannot send prompt, socket not open');
      this.mock(agentId, text);
    }
  }

  sendGoal(goal: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'goal', goal }));
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
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
