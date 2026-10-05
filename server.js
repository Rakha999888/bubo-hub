const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { WebSocketServer } = require('ws');
const { exec } = require('child_process');

const app = express();
const PORT = 4005;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// ─── DISCORD CHANNELS & BUBO AGENTS MAPPING ─────────────────────────
const DISCORD_CHANNELS = {
  '1553291734799220797': {
    agentId: 'bubo-manager',
    name: 'Atlas',
    channelName: '#💬・general-chat',
    role: 'Bubo Manager',
    isManager: true
  },
  '1553302924124360946': {
    agentId: 'bubo-n8n',
    name: 'Niko',
    channelName: '#⚡・bubo-n8n',
    role: 'Automation Engineer'
  },
  '1553302926095552553': {
    agentId: 'bubo-portal',
    name: 'Luna',
    channelName: '#🌐・bubo-portal',
    role: 'UI/UX & Frontend Engineer'
  },
  '1553346570827862094': {
    agentId: 'bubo-backend-portal',
    name: 'Darren',
    channelName: '#💻・bubo-backend-portal',
    role: 'Backend Engineer'
  },
  '1553398524584919151': {
    agentId: 'bubo-admin-portal',
    name: 'Arden',
    channelName: '#🛡・bubo-admin-portal',
    role: 'Admin System Specialist'
  },
  '1553406460199706624': {
    agentId: 'bubo-source-video',
    name: 'Kiro',
    channelName: '#🎬・bubo-source-video',
    role: 'Creative & Video Producer'
  },
  '1553406461445406994': {
    agentId: 'bubo-pdf',
    name: 'Milo',
    channelName: '#📄・bubo-pdf',
    role: 'Document Processing Specialist'
  },
  '1553545688116363325': {
    agentId: 'bubo-qc-portal',
    name: 'Riven',
    channelName: '#🔍・bubo-qc-portal',
    role: 'QA Testing Engineer'
  },
  '1553800580621668457': {
    agentId: 'bubo-ticketing',
    name: 'Theo',
    channelName: '#🎫・bubo-ticketing',
    role: 'Support & Ticketing Specialist'
  },
  '1556298595299233833': {
    agentId: 'bubo-building',
    name: 'Bubo Building',
    channelName: '#🏗・bubo-building',
    role: 'Infrastructure & DevOps'
  }
};

const ALL_DIVISION_AGENT_IDS = [
  'bubo-n8n', 'bubo-portal', 'bubo-backend-portal', 'bubo-admin-portal',
  'bubo-source-video', 'bubo-pdf', 'bubo-qc-portal', 'bubo-ticketing', 'bubo-building'
];

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

// Trigger Agent to walk to desk, sit down, and start working
function dispatchAgentWork(agentId, taskText, activityText, originChannel) {
  const channelInfo = Object.values(DISCORD_CHANNELS).find((c) => c.agentId === agentId);
  const name = channelInfo ? channelInfo.name : agentId;

  broadcast({
    type: 'agent_state',
    agentId,
    patch: {
      status: 'working',
      task: taskText.slice(0, 120),
      activity: activityText || `Mengerjakan instruksi dari Discord (${originChannel})`,
      progress: 35,
      animation: 'type',
      location: 'desk',
      tool: 'Discord Live Event'
    }
  });

  broadcast({
    type: 'agent_log',
    agentId,
    line: `[${originChannel}] ${name}: "${taskText.slice(0, 100)}"`
  });
}

// Complete agent work and reset back to idle after delay
function finishAgentWork(agentId, summaryText) {
  broadcast({
    type: 'agent_state',
    agentId,
    patch: {
      status: 'success',
      activity: summaryText || 'Tugas selesai dikerjakan',
      progress: 100,
      animation: 'success'
    }
  });

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
  }, 12000);
}

// ─── TAIL GATEWAY.LOG IN REAL TIME ──────────────────────────────────
const GATEWAY_LOG = '/root/.hermes/logs/gateway.log';
let lastLogSize = 0;

if (fs.existsSync(GATEWAY_LOG)) {
  try {
    const stats = fs.statSync(GATEWAY_LOG);
    lastLogSize = stats.size;
  } catch (e) {
    console.error('Error reading log file size', e);
  }
}

function processLogLine(line) {
  // 1. Detect inbound message from Discord
  const inboundMatch = line.match(/inbound message: platform=discord (?:user=(.*?) )?chat=(\d+) msg='(.*)'/);
  if (inboundMatch) {
    const user = inboundMatch[1] || 'User';
    const chatId = inboundMatch[2];
    const msg = inboundMatch[3];
    const channel = DISCORD_CHANNELS[chatId];

    if (channel) {
      console.log(`[Discord Inbound] ${channel.channelName} (${channel.name}): "${msg}"`);

      if (channel.isManager) {
        // Manager Atlas triggered in #💬・general-chat!
        dispatchAgentWork('bubo-manager', msg, 'Mengoordinasikan tim dari General Chat', channel.channelName);

        // All division characters auto-walk to their chairs to work!
        ALL_DIVISION_AGENT_IDS.forEach((divAgentId, idx) => {
          setTimeout(() => {
            dispatchAgentWork(
              divAgentId,
              `Arahan Manager: ${msg}`,
              'Menerima arahan & bekerja dari General Chat',
              '#💬・general-chat'
            );
          }, idx * 200); // slight natural stagger
        });
      } else {
        // Specific division channel triggered
        dispatchAgentWork(channel.agentId, msg, `Mengerjakan tugas dari ${channel.channelName}`, channel.channelName);
      }
    }
    return;
  }

  // 2. Detect response ready / finished from Discord
  const responseMatch = line.match(/(?:response ready: platform=discord chat=(\d+)|Sending response \(\d+ chars\) to (\d+))/);
  if (responseMatch) {
    const chatId = responseMatch[1] || responseMatch[2];
    const channel = DISCORD_CHANNELS[chatId];
    if (channel) {
      console.log(`[Discord Response] Finished for ${channel.channelName} (${channel.name})`);
      finishAgentWork(channel.agentId, `Respon terkirim ke ${channel.channelName}`);

      if (channel.isManager) {
        ALL_DIVISION_AGENT_IDS.forEach((divAgentId) => {
          finishAgentWork(divAgentId, 'Arahan General Chat selesai');
        });
      }
    }
  }
}

// Watch gateway.log with 250ms polling
setInterval(() => {
  if (!fs.existsSync(GATEWAY_LOG)) return;
  try {
    const currentSize = fs.statSync(GATEWAY_LOG).size;
    if (currentSize > lastLogSize) {
      const buffer = Buffer.alloc(currentSize - lastLogSize);
      const fd = fs.openSync(GATEWAY_LOG, 'r');
      fs.readSync(fd, buffer, 0, buffer.length, lastLogSize);
      fs.closeSync(fd);
      lastLogSize = currentSize;

      const lines = buffer.toString('utf-8').split('\n');
      lines.forEach((l) => {
        if (l.trim()) processLogLine(l);
      });
    } else if (currentSize < lastLogSize) {
      lastLogSize = currentSize; // log rotated
    }
  } catch (err) {
    // Ignore transient file lock
  }
}, 250);

// ─── DISCORD BOT RECENT HEALTH CHECK ─────────────────────────────────
let discordToken = '';
try {
  const envContent = fs.readFileSync('/root/.hermes/.env', 'utf-8');
  const tokenMatch = envContent.match(/DISCORD_BOT_TOKEN=([^\n\r]+)/);
  if (tokenMatch) discordToken = tokenMatch[1].replace(/['"]/g, '').trim();
} catch (e) {}

if (discordToken) {
  const req = https.request('https://discord.com/api/v10/channels/1553291734799220797/messages?limit=1', {
    headers: { Authorization: `Bot ${discordToken}` }
  }, (res) => {
    let body = '';
    res.on('data', (d) => body += d);
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log(`✅ Discord Bot connected successfully to SMLONE server`);
      }
    });
  });
  req.on('error', () => {});
  req.end();
}

// ─── WEBSOCKET HANDLING ─────────────────────────────────────────────
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({
    type: 'server_hello',
    message: 'Connected to local Bubo Hub Discord sync backend',
    timestamp: Date.now()
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'prompt' && data.agentId && data.text) {
        dispatchAgentWork(data.agentId, data.text, 'Menerima instruksi manual via Bubo-Hub', 'Web');
        const cmd = `hermes -z "[${data.agentId}]: ${data.text.replace(/"/g, '\\"').slice(0, 300)}"`;
        exec(cmd, { timeout: 35000 }, (err, stdout) => {
          if (!err && stdout) {
            broadcast({ type: 'agent_log', agentId: data.agentId, line: stdout.trim().slice(0, 300) });
          }
          finishAgentWork(data.agentId, 'Instruksi selesai');
        });
      }
    } catch (e) {}
  });
});

// REST Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'bubo-hub-discord-sync',
    port: PORT,
    wsConnectedClients: wss.clients.size,
    discordChannelsMonitored: Object.keys(DISCORD_CHANNELS).length,
    uptime: process.uptime()
  });
});

// Trigger test simulation endpoint
app.post('/api/discord-event', (req, res) => {
  const { channelId, user, msg } = req.body;
  const channel = DISCORD_CHANNELS[channelId || '1553291734799220797'];
  if (!channel) return res.status(404).json({ error: 'Channel not found' });

  if (channel.isManager) {
    dispatchAgentWork('bubo-manager', msg || 'Briefing Tim SMLONE', 'Mengoordinasikan tim dari General Chat', channel.channelName);
    ALL_DIVISION_AGENT_IDS.forEach((id) => {
      dispatchAgentWork(id, `Arahan Manager: ${msg || 'Briefing'}`, 'Menerima arahan & bekerja dari General Chat', '#💬・general-chat');
    });
  } else {
    dispatchAgentWork(channel.agentId, msg || 'Task baru', `Mengerjakan tugas dari ${channel.channelName}`, channel.channelName);
  }

  res.json({ success: true, channel: channel.channelName, agent: channel.name });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Bubo Hub Discord Sync running on http://127.0.0.1:${PORT}`);
});
