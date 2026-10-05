# Consolidation Plan (Phase 1–4 → Phase 5)

| Area | Keputusan |
|---|---|
| Navigasi | SATU header: `Lihat Kantor` / `Lihat Agent`. Office/Agents/Activity dihapus. Activity ada di Agent Panel. |
| State | SATU store (`state/store.ts`) berisi view, floor, kamera, selection, `agents`. Tidak ada state agent ganda. |
| Kamera | SATU `CameraRig` dengan level city/building/floor + preset agent view. |
| Karakter | Penguin/hewan DIHAPUS. Satu `BuboCharacter` + accessory per departemen. |
| Data | Agent & room dari `config/`. UI dan 3D tidak punya hardcode per-agent. |
| Hermes | `hermesClient` (WebSocket / mock) → `applyEvent` → store → animasi. |

## Bila Anda punya kode Phase 1–4
Jangan timpa. Petakan: komponen UI lama → `components/`, scene lama → `3d/`, lalu pindahkan
data agent/room ke `config/` dan sambungkan ke `store.ts`. Ganti hanya karakter lama dengan `BuboCharacter`.
