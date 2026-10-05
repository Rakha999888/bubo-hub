import { HermesEvent } from '../../types';

type Listener = (e: HermesEvent) => void;
declare const process: { env: { HERMES_WS_URL: string } };

/**
 * Hermes client.
 *  - If HERMES_WS_URL is set -> WebSocket. Protocol (adjust to your Hermes AgentOS):
 *      send:    { "type": "prompt", "agentId": "...", "text": "..." }
 *      receive: HermesEvent (see types/index.ts)
 *  - Otherwise -> local mock that simulates a task lifecycle so the visuals can be tested.
 */
class HermesClient {
  private listener: Listener = () => {};
  private ws: WebSocket | null = null;
  private url = process.env.HERMES_WS_URL;

  connect(l: Listener) {
    this.listener = l;
    if (!this.url) return;
    this.ws = new WebSocket(this.url);
    this.ws.onmessage = (m) => { try { this.listener(JSON.parse(m.data)); } catch { /* ignore bad frame */ } };
    this.ws.onclose = () => setTimeout(() => this.connect(this.listener), 3000);
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
    emit({ status: 'thinking', task: text, activity: 'Reading the request', progress: 5, animation: 'think', location: 'desk' });
    log('Bubo: Investigating...');
    setTimeout(() => { emit({ status: 'walking', activity: 'Heading to workstation', animation: 'walk' }); }, 900);
    setTimeout(() => { emit({ status: 'working', activity: 'Running tools', tool: 'Browser + API', progress: 30, animation: 'type' }); log('Tool started: Browser + API'); }, 3200);
    setTimeout(() => { emit({ progress: 65, activity: 'Analyzing results' }); log('Found relevant output, analyzing'); }, 6000);
    setTimeout(() => { emit({ progress: 90, activity: 'Writing summary' }); }, 8500);
    setTimeout(() => { emit({ status: 'success', progress: 100, activity: 'Completed', animation: 'success' }); log('Result ready (mock).'); }, 10500);
    setTimeout(() => { emit({ status: 'idle', activity: 'Idle', animation: 'idle', tool: '-' }); }, 14000);
  }
}

export const hermes = new HermesClient();
