# showeq-web

React + TypeScript web client for the ShowEQ daemon. Connects to a running
`showeq-daemon` over WebSocket, decodes `seq.v1` protobuf messages, and
renders spawns, zones, and player state in the browser.

## Stack

- [Vite](https://vitejs.dev/) for the dev server and build
- React 18 + TypeScript
- [`@bufbuild/protobuf`](https://github.com/bufbuild/protobuf-es) for protobuf
- Native `WebSocket` for transport

## Quick start

`bun run gen` runs `buf generate proto`, where `proto/` is the
[`showeq-proto`](https://github.com/showeq-unofficial/showeq-proto)
git submodule. Initialize it on first checkout:

```sh
git clone --recurse-submodules https://github.com/showeq-unofficial/showeq-web.git
# or, if already cloned:
git submodule update --init --recursive

cd showeq-web
bun install
bun run gen           # generates src/gen/ from proto/
bun run dev           # starts dev server on :5173
```

Open http://localhost:5173 with a running `showeq-daemon` on
`ws://localhost:9090`.

## Connecting from an HTTPS-hosted page

When you load showeq-web from `https://...` (e.g. the GitHub Pages
build), browsers block insecure `ws://` connections as mixed content,
and the daemon doesn't terminate TLS itself. Two ways around it:

- **Run the dev server locally.** `bun run dev` serves over plain
  `http://localhost:5173`, which is allowed to open `ws://localhost`
  connections — no TLS or tunneling needed.
- **SSH-tunnel a remote daemon to localhost.** If the daemon is on a
  different machine, forward its port over SSH and connect as if it
  were local:

  ```sh
  ssh -N -L 9090:localhost:9090 user@daemon-host
  ```

  Then point the client at `ws://localhost:9090` (Settings → Daemon
  URL). The browser sees a localhost target, so the mixed-content
  rule doesn't fire even on an HTTPS page; SSH carries the traffic.

## Layout

```
src/
  main.tsx                    # Vite entry, mounts <App>
  index.css                   # Tailwind base + shared tokens
  title.ts                    # document.title sync (zone + connection state)
  gen/                        # generated protobuf (git-ignored)
  net/
    client.ts                 # WebSocket + subscribe/receive loop, resume
  state/
    store.ts                  # in-memory spawn/zone/chat/combat/buffs/group/prefs
    localPrefs.ts             # browser-only UI prefs (panel layout, etc.)
  ui/
    App.tsx                   # root layout, rails, panel orchestration
    MapCanvas.tsx             # canvas-based spawn map (geometry, FOV, hits)
    SpawnList.tsx             # tanstack-table spawn grid + tinting
    SpawnPointList.tsx        # SpawnMonitor's promoted points
    StatsPanel.tsx            # HP/mana/stamina/exp bars
    GroupPanel.tsx            # 6-slot group readout
    BuffsPanel.tsx            # active buff list + tickdown
    ChatLog.tsx               # scrolling chat lines by channel
    CombatLog.tsx             # scrolling combat events
    FilterRulesPanel.tsx      # FilterMgr rule editor (add/remove)
    PreferencesPanel.tsx      # daemon-side prefs editor (allowlisted)
    CategorySelect.tsx        # CategoryMgr filter dropdown
    SettingsContent.tsx,      # daemon URL, panel toggles, theme
    SettingsModal.tsx
    Panel.tsx,                # generic collapsible/resizable panel chrome
    ResizeHandle.tsx,
    VerticalResizeHandle.tsx
    classes.ts                # EQ class id → name + color
    concolor.ts               # con-color level math
    filterflags.ts            # FilterMgr bitmask helpers + row tints
```

## License

MIT. Deliberately permissive so any client fork can remain closed-source if
someone wants to build a private overlay against the same daemon.
