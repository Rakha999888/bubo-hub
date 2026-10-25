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

// ─── DISCORD CHANNELS & BUBO AGENTS MAPPING (EXACT 1:1 WITH SMLONE DISCORD) ───
const DISCORD_CHANNELS = {
  '1553291734799220797': {
    agentId: 'bubo-manager',
    name: 'Rakha (Coordinator)',
    channelName: '#💬・general-chat',
    role: 'Head of AI Operations & Coordinator',
    isManager: true
  },
  '1553302924124360946': {
    agentId: 'bubo-n8n',
    name: 'Bubo n8n',
    channelName: '#⚡・bubo-n8n',
    role: 'Otomasi Alur Kerja & Integrasi n8n'
  },
  '1553302926095552553': {
    agentId: 'bubo-portal',
    name: 'Bubo Portal',
    channelName: '#🌐・bubo-portal',
    role: 'Frontend UI/UX Web Portal Trainee'
  },
  '1553346570827862094': {
    agentId: 'bubo-backend-portal',
    name: 'Bubo Backend',
    channelName: '#💻・bubo-backend-portal',
    role: 'Backend Engineering & DB Neon PostgreSQL'
  },
  '1553398524584919151': {
    agentId: 'bubo-admin-portal',
    name: 'Bubo Admin Portal',
    channelName: '#🛡・bubo-admin-portal',
    role: 'Dashboard Admin & Operasional Sistem'
  },
  '1553545688116363325': {
    agentId: 'bubo-qc-portal',
    name: 'Bubo QC Portal',
    channelName: '#🔍・bubo-qc-portal',
    role: 'Quality Control & Troubleshooting Audit'
  },
  '1553800580621668457': {
    agentId: 'bubo-ticketing',
    name: 'Bubo Ticketing',
    channelName: '#🎫・bubo-ticketing',
    role: 'IT Ticketing & Jira Cloud Helpdesk'
  },
  '1556298595299233833': {
    agentId: 'bubo-building',
    name: 'Bubo Building',
    channelName: '#🏗・bubo-building',
    role: 'Arsitektur Sistem & Server Build SMLONE'
  },
  '1557076368737439874': {
    agentId: 'bubo-ptm',
    name: 'Bubo PTM',
    channelName: '#📊・bubo-ptm',
    role: 'Pelaporan & Tracking Monitoring PTM'
  },
  '1559853093850587166': {
    agentId: 'bubo-sheet',
    name: 'Bubo Sheet',
    channelName: '#bubo-sheet',
    role: 'Automasi & Pipeline Google Sheets'
  }
};

const ALL_DIVISION_AGENT_IDS = Object.values(DISCORD_CHANNELS)
  .filter((c) => !c.isManager)
  .map((c) => c.agentId);

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
      task: taskText || 'Sedang memproses instruksi prompt...',
      activity: activityText || 'Bekerja aktif di depan laptop',
      progress: 45,
      animation: 'type',
      location: 'desk',
      tool: 'Workstation'
    }
  });

  // broadcast({
  //   type: 'agent_log',
  //   agentId,
  //   line: `[${originChannel}] ${name}: Aktif memproses tugas.`
  // });
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
        task: '',
        activity: 'Selesai tugas, bebas beraktivitas',
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
  // Format: inbound message: platform=discord user=test api chat=1556298595299233833 msg='...' reply_to_id=...
  const inboundMatch = line.match(/inbound message: platform=discord (?:user=(.*?) )?chat=(\d+) msg='(.*?)'(?: reply_to_id=.*)?$/);
  if (inboundMatch) {
    const user = inboundMatch[1] || 'User';
    const chatId = inboundMatch[2];
    const msg = inboundMatch[3];
    const channel = DISCORD_CHANNELS[chatId];

    if (channel) {
      console.log(`[Discord Inbound] ${channel.channelName} (${channel.name}): "${msg.slice(0, 60)}"`);

      if (channel.isManager) {
        // Manager triggered in #general-chat -> ONLY manager (Rakha) goes to laptop!
        dispatchAgentWork('bubo-manager', msg, 'Mengoordinasikan tim dari General Chat', channel.channelName);
      } else {
        // Specific division channel triggered -> ONLY that specific agent goes to laptop!
        dispatchAgentWork(channel.agentId, msg, `Mengerjakan tugas dari ${channel.channelName}`, channel.channelName);
      }
    }
    return;
  }

  // 2. Detect response ready / finished from Discord
  // Format: response ready: platform=discord chat=1556298595299233833 session=...
  // Or: Sending response (xxxx chars) to 1556298595299233833
  const responseMatch = line.match(/(?:response ready: platform=discord chat=(\d+)|Sending response \(\d+ chars\) to (\d+))/);
  if (responseMatch) {
    const chatId = responseMatch[1] || responseMatch[2];
    const channel = DISCORD_CHANNELS[chatId];
    if (channel) {
      console.log(`[Discord Response] Finished for ${channel.channelName} (${channel.name})`);
      finishAgentWork(channel.agentId, `Tugas selesai di ${channel.channelName}`);
    }
  }
}

// Watch gateway.log with 200ms polling
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
  } catch (err) {}
}, 200);

// ─── CLOUDFLARE TUNNEL URL AUTO-SYNC ─────────────────────────────────
function syncTunnelUrl() {
  const tunnelLog = '/root/.pm2/logs/bubo-tunnel-error.log';
  if (!fs.existsSync(tunnelLog)) return;
  try {
    const content = fs.readFileSync(tunnelLog, 'utf-8');
    const matches = content.match(/https:\/\/[-a-z0-9.]+\.trycloudflare\.com/g);
    if (matches && matches.length > 0) {
      const activeUrl = matches[matches.length - 1];
      const wsUrl = activeUrl.replace('https://', 'wss://') + '/ws';
      const wsConfig = {
        wsUrl,
        httpUrl: activeUrl,
        updatedAt: new Date().toISOString()
      };
      const jsonStr = JSON.stringify(wsConfig, null, 2);
      fs.writeFileSync(path.join(__dirname, 'public/ws-config.json'), jsonStr);
      if (fs.existsSync(path.join(__dirname, 'dist'))) {
        fs.writeFileSync(path.join(__dirname, 'dist/ws-config.json'), jsonStr);
      }
    }
  } catch (e) {}
}
syncTunnelUrl();
setInterval(syncTunnelUrl, 30000);

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
