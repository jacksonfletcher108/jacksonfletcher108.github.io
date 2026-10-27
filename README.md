# App Hub

A single-page portfolio and launchpad for my apps, built with React, Vite, Tailwind CSS v4 and Lucide icons.

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # static site in dist/
```

## How it's put together

- `src/data/apps.js`: the three apps (copy, tags, features, stats, live URLs) and the tech stack. Add the next app here.
- `src/components/AppHub.jsx`: the page; owns routing and which overlay is open
- `src/components/AppCard.jsx`: launchpad card with live status ping, tags, features and launch buttons
- `src/components/AppModal.jsx`: browser-style window that runs an app in an iframe, with tabs to switch apps, reload and open in a new tab
- `src/components/NfcGuideModal.jsx` + `NfcGuide.jsx`: fridge NFC tag setup (sticker method and iPhone Shortcut method)
- `src/components/TechDrawer.jsx`: "Under the hood" slide-over with a filterable stack breakdown and the NFC guide toggle
- `src/components/SandboxPanel.jsx`: placeholder for the next tool, an idea board with votes and stages
- `src/hooks/`: `useHashRoute` (`#app/budget`, `#nfc`; the browser Back button closes overlays), `useAppStatus` (pings each live app), `useClock`, `useModalBehavior`
