# Bubo-Hub — Phase 5 (Final Unified Experience)

> "A living headquarters for your AI workforce."

React + TypeScript + Three.js (React Three Fiber + Drei) + GSAP, bundled with **Webpack (no Vite)**.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # output ke dist/
npm run typecheck  # tsc --noEmit (ts-loader memakai transpileOnly agar build cepat)
```

Hubungkan ke Hermes AgentOS sungguhan:

```bash
HERMES_WS_URL=ws://localhost:8787/agents npm run dev
```

Tanpa `HERMES_WS_URL`, `hermesClient.ts` memakai **mock** yang mensimulasikan siklus task
(thinking → walking → working → success → idle) supaya animasi bisa diuji.

## Cara pakai

1. Buka app: kota + gedung Bubo-Hub terlihat. Tombol kanan atas: **Lihat Kantor** / **Lihat Agent**.
2. **Lihat Kantor**: orbit bebas, tombol Kota / Gedung / Lantai untuk zoom bertingkat.
3. **Lihat Agent**: pilih Floor 1/2/3 (kiri), kamera pindah ke ruang kerja lantai itu.
4. Klik Bubo → panel detail (role, status, task, activity, progress, tool, recent).
5. **Open Agent** → Agent Mode (log + prompt bar). Kirim prompt, Bubo berjalan ke meja, duduk, mengetik.

Navigasi lama `Office / Agents / Activity` sudah **tidak ada** (tidak dirender sama sekali).

## Struktur

```
src/
  config/        agents.ts, rooms.ts      <- data-driven (tambah agent = tambah 1 objek)
  types/         AgentState, HermesEvent  <- model state ternormalisasi
  state/         store.ts (zustand)       <- satu-satunya sumber state UI + agent
  services/hermes/hermesClient.ts         <- WebSocket + mock
  3d/characters/ BuboCharacter (1 keluarga karakter), AgentActor (state -> gerak/pose)
  3d/building/   BuboBuilding (3 lantai, tangga, workstation, lounge, server rack)
  3d/city/       BuboCity (jalan, parkir, pohon instanced, mobil, lampu lalu lintas)
  3d/cameras/    CameraRig (City → Building → Floor → Agent, tween GSAP)
  components/    navigation, agent-panel, prompt
docs/            CONSOLIDATION_PLAN.md, HERMES_PROTOCOL.md, PHASE5_CHECKLIST.md
```

## Protokol Hermes (ringkas)

Kirim: `{ "type":"prompt", "agentId":"bubo-backend-portal", "text":"..." }`
Terima: `{ "type":"agent_state", "agentId":"...", "patch":{ "status":"working", "progress":40 } }`
dan `{ "type":"agent_log", "agentId":"...", "line":"..." }`. Detail di `docs/HERMES_PROTOCOL.md`.

## Status jujur (baca ini)

Paket ini dibuat dari spesifikasi Phase 5 saja. **Kode Phase 1–4 dan gambar referensi karakter
tidak tersedia** saat dibuat, jadi ini starter *fresh* yang mengikuti spesifikasi, bukan
merge dari kode lama Anda. Belum dijalankan/di-build (tidak ada akses npm di lingkungan pembuatnya).

Sudah ada: model state & config data-driven, view switcher, floor selector, panel agent, prompt bar,
store tunggal, kamera bertingkat, karakter humanoid prosedural (kepala kuning, baju teal, celana gelap,
aksesori per departemen, Bubo Manager berpakaian lebih formal), pose duduk (pinggul di kursi, kaki
menapak, tangan di keyboard), alur Walk → Sit → Type, kota + parkir + pohon instanced + lalu lintas
sederhana dengan lampu merah/hijau, tangga eksternal tanpa lift.

Belum / perlu dikerjakan:
- **Karakter dari gambar referensi**: model sekarang prosedural (kotak membulat). Ganti ke GLB hasil
  modeling dari gambar Anda, lalu muat via `useGLTF` + `AnimationMixer` di `BuboCharacter.tsx`.
- **Berjalan antar lantai lewat tangga**: geometri tangga ada, tapi pathfinding/animasi naik tangga
  belum; agent hanya bergerak di lantainya. Perlu waypoint (kaki tangga → pendaratan → lantai atas).
- **Collision / obstacle avoidance** hanya berupa tata letak jalur aman, belum collider sungguhan.
- Duduk di sofa & minum kopi (state `break`) baru berjalan ke spot kopi, belum animasi duduk/minum.
- Pagar tangga minimal, motor/bus/pejalan kaki baru placeholder atau belum ada.
- LOD, kompresi tekstur GLB, dan animation culling belum; yang sudah: instancing pohon, `AdaptiveDpr`.
