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

```sh
bun install
bun run gen           # generate TypeScript from showeq-proto
bun run dev           # starts dev server on :5173
```

Open http://localhost:5173 with a running `showeq-daemon` on
`ws://localhost:9090`.

## Layout

```
src/
  gen/                # generated protobuf (git-ignored)
  net/
    client.ts         # WebSocket + subscribe/receive loop
  state/
    store.ts          # spawn/zone state
  ui/
    App.tsx
    MapCanvas.tsx     # the spawn map
```

## License

MIT. Deliberately permissive so any client fork can remain closed-source if
someone wants to build a private overlay against the same daemon.
