# Native Federation Microfrontend Playground (Vanilla JS)

## Overview

This playground demonstrates **browser-native module federation** with vanilla HTML/JS/CSS...no frameworks, no bundlers.
Features:
- Multiple microfrontends (“remotes”) loaded at runtime via ES modules and import maps
- Host handles routing (browser history API) and UI composition
- Remotes can trigger navigation, update global state, trigger cross-remote events
- Shared services (state, eventBus, navigation, logger) accessible to all modules via singleton patterns
- Shared federated utilities (logger, navigation) and styled button used by host/remotes
- Host composes UI with header (routes/nav), content area, footer (counter/viewer/logs)
- Each remote served from a different origin (port) with CORS
- Host HTML demonstrates **multiple `<script type="importmap">`** for browser-native merging

## File Structure

```
native-federation-demo/
├── host/
│   ├── index.html
│   ├── main.js
│   ├── router.js
│   ├── styles.css
├── shared-utils/
│   ├── eventBus.js
│   ├── state.js
│   ├── navigation.js
│   ├── logger.js
│   ├── sharedButton.js
├── remote1/
│   ├── remote1.js
│   ├── styles.css
├── remote2/
│   ├── remote2.js
│   ├── styles.css
├── remote3/
│   ├── remote3.js
│   ├── styles.css
├── package.json
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start servers (host + remotes + shared-utils) with one command:**
   ```bash
   npm run start
   ```
   This launches five static servers:
   - Host:        http://localhost:8000/
   - Remote 1:    http://localhost:8001/
   - Remote 2:    http://localhost:8002/
   - Remote 3:    http://localhost:8003/
   - Shared Utils: http://localhost:8004/

   (All servers use CORS.)

3. **Open the host app:**
   - Visit [http://localhost:8000/](http://localhost:8000/)
   - Browse between routes (Home, Remote 1, Remote 2, Remote 3)
   - Use UI to update counter, trigger cross-remote actions, and view logs

## Features

- **Routing:** Browser history API with factory function pattern, nav links in header, remotes can trigger navigation via shared navigation service
- **Global State:** Counter managed by shared singleton state service, remotes update directly, all areas display current value
- **Event Bus:** Shared singleton service for cross-remote and host/remote communication using functional patterns
- **Navigation Service:** Shared navigation abstraction allowing remotes to navigate without direct router coupling
- **Multiple Remotes:** Each remote is visually distinct, exports federated functions using object export patterns (addByX), uses shared services directly
- **Import Maps:** Host HTML uses multiple `<script type="importmap">` tags—demonstrates browser-native module merging
- **Federated Shared Services:** All services (eventBus, state, navigation, logger, sharedButton) imported via import map, used by host and remotes
- **Functional Architecture:** Modern JS patterns with factory functions, closures, and singleton services replacing class-based patterns

## Requirements

- Node.js (for running http-server)
- Modern browser supporting ES Modules and import maps (Chrome, Edge, Opera, Safari 17+)

## Notes

- **CORS:** Remotes must be loaded with CORS headers (`Access-Control-Allow-Origin: *`). The included server setup handles this.
- **Firefox:** Only the first import map is used in Firefox. Chrome/Edge/Opera/Safari merge multiple import maps per spec.

## Customize/Expand

- Add more remotes, federated functions, or shared utilities.
- Style further—each remote has its own CSS.
- Enhance host UI (e.g., show loaded remotes, error messages).

---

**Enjoy exploring browser-native module federation!**
