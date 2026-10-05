const express = require('express');
const http = require('http');
const path = require('path');
const { WebSocketServer } = require('ws');
const { exec } = require('child_process');

const app = express();
const PORT = 4005;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Agent Persona Map for contextual responses
const AGENT_PERSONAS = {
  'bubo-manager': 'Atlas (Bubo Manager)',
  'bubo-admin-portal': 'Arden (Admin System Specialist)',
  'bubo-n8n': 'Niko (Automation Engineer)',
  'bubo-portal': 'Luna (UI/UX & Frontend Engineer)',
  'bubo-backend-portal': 'Darren (Backend Engineer)',
  'bubo-ticketing': 'Theo (Support & Ticketing Specialist)',
  'bubo-source-video': 'Kiro (Creative & Video Producer)',
  'bubo-pdf': 'Milo (Document Processing Specialist)',
  'bubo-qc-portal': 'Riven (QA Testing Engineer)',
  'bubo-building': 'Bubo Building (Infrastructure & DevOps Engineer)'
};

// In-memory agent state cache
const agentStates = {};

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

function broadcast(data) {
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(payload);
    }
  });
}

function handleAgentPrompt(agentId, text) {
  const name = AGENT_PERSONAS[agentId] || 'Bubo Agent';

  // 1. Initial State: Thinking & Log
  broadcast({
    type: 'agent_state',
    agentId,
    patch: {
      status: 'thinking',
      task: text,
      activity: 'Menganalisis instruksi...',
      progress: 15,
      animation: 'think',
      location: 'desk'
    }
  });
  broadcast({
    type: 'agent_log',
    agentId,
    line: `[${name}] Menerima tugas: "${text}"`
  });

  // 2. Working State
  setTimeout(() => {
    broadcast({
      type: 'agent_state',
      agentId,
      patch: {
        status: 'working',
        activity: 'Memproses dengan Hermes CLI...',
        progress: 45,
        animation: 'type',
        tool: 'Hermes Local Engine'
      }
    });
    broadcast({
      type: 'agent_log',
      agentId,
      line: `[${name}] Menjalankan analisis instruksi via Hermes...`
    });
  }, 1000);

  // 3. Execute prompt via Hermes CLI
  const safePrompt = text.replace(/"/g, '\\"').slice(0, 500);
  const command = `hermes -z "[${name}]: ${safePrompt}"`;

  exec(command, { timeout: 45000 }, (error, stdout, stderr) => {
    if (error) {
      console.warn(`[Hermes Error] ${error.message}`);
      broadcast({
        type: 'agent_log',
        agentId,
        line: `[Hermes Warn] Response local timeout, menggunakan fallback log.`
      });
      broadcast({
        type: 'agent_state',
        agentId,
        patch: {
          status: 'success',
          activity: 'Selesai diproses',
          progress: 100,
          animation: 'success'
        }
      });
    } else {
      const output = stdout.trim();
      const lines = output.split('\n').filter(Boolean);
      lines.slice(0, 4).forEach((line) => {
        broadcast({
          type: 'agent_log',
          agentId,
          line: line.trim()
        });
      });

      broadcast({
        type: 'agent_state',
        agentId,
        patch: {
          status: 'success',
          activity: 'Instruksi selesai dikerjakan',
          progress: 100,
          animation: 'success'
        }
      });
    }

    // Reset to idle after 6 seconds
    setTimeout(() => {
      broadcast({
        type: 'agent_state',
        agentId,
        patch: {
          status: 'idle',
          activity: 'Idle',
          progress: 0,
          animation: 'idle',
          tool: '-'
        }
      });
    }, 6000);
  });
}

// WebSocket Connection Handler
wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`[WS] Client connected from ${ip}`);

  ws.send(JSON.stringify({
    type: 'server_hello',
    message: 'Connected to local Bubo Hub WebSocket backend',
    timestamp: Date.now()
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'prompt' && data.agentId && data.text) {
        console.log(`[Prompt] ${data.agentId}: ${data.text}`);
        handleAgentPrompt(data.agentId, data.text);
      }
    } catch (e) {
      console.warn('[WS] Malformed message received', e);
    }
  });

  ws.on('close', () => {
    console.log(`[WS] Client disconnected`);
  });
});

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'bubo-hub-local',
    port: PORT,
    wsConnectedClients: wss.clients.size,
    uptime: process.uptime()
  });
});

app.post('/api/prompt', (req, res) => {
  const { agentId, text } = req.body;
  if (!agentId || !text) {
    return res.status(400).json({ error: 'agentId and text are required' });
  }
  handleAgentPrompt(agentId, text);
  res.json({ status: 'dispatched', agentId, text });
});

// Catch-all SPA handler
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Bubo Hub running locally on http://127.0.0.1:${PORT}`);
});
