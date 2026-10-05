# Hermes ↔ Bubo-Hub

USER → BUBO-HUB → HERMES → AGENT → TOOLS → RESULT → BUBO-HUB

Client → Hermes: `{"type":"prompt","agentId":"bubo-qc-portal","text":"Check why portal login returns 401"}`

Hermes → Client:
```json
{"type":"agent_state","agentId":"bubo-qc-portal","patch":{
  "status":"working","task":"Testing portal authentication","activity":"Running API tests",
  "progress":82,"location":"desk","animation":"type","tool":"Browser + API"}}
{"type":"agent_log","agentId":"bubo-qc-portal","line":"Found 401 response"}
```
Status: idle, working, thinking, walking, sitting, waiting, error, success, meeting, break, offline.
`location`: `desk` | `lounge` | `stairs`. Event ke agentId yang tidak ada di `config/agents.ts` diabaikan.
Reconnect otomatis setiap 3 detik.
