# Jackson's Apps

My app hub, styled like a fridge door with my apps pinned to it, built with React, Vite, Tailwind CSS v4 and Lucide icons.

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # static site in dist/
```

## How it's put together

- `src/data/apps.js`: the apps on the fridge (copy, handwritten notes, colors, stats, live URLs) and the tools list. Add the next app here.
- `src/components/AppHub.jsx`: the page; owns routing and which overlay is open
- `src/components/Intro.jsx`: the "Hey, I'm Jackson" intro and sticky note
- `src/components/AppCard.jsx`: an app pinned to the fridge (magnet or tape), with a live check and open buttons
- `src/components/AppModal.jsx`: browser-style window that runs an app in an iframe, with tabs to switch apps, reload and open in a new tab
- `src/components/NfcGuideModal.jsx` + `NfcGuide.jsx`: fridge NFC tag setup (sticker method and iPhone Shortcut method)
- `src/components/TechDrawer.jsx`: "How I build these" slide-over with the tools behind each app and the NFC guide toggle
- `src/components/SandboxPanel.jsx`: "Next up", an idea board with votes and stages
- `src/hooks/`: `useHashRoute` (`#app/budget`, `#nfc`; the browser Back button closes overlays), `useAppStatus` (pings each live app), `useClock`, `useModalBehavior`
