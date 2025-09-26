import { router } from './router.js';
import { state } from 'state';
import { eventBus } from 'eventBus';
import { navigation } from 'navigation';
import { logger } from 'logger';
import { SharedButton } from 'sharedButton';

// Available remotes and their federated functions
const remotes = [
  { name: "Remote 1", key: "remote1", fn: "addBy1", color: "linear-gradient(135deg, #FFD700, #FF8C00)" },
  { name: "Remote 2", key: "remote2", fn: "addBy5", color: "linear-gradient(135deg, #50fa7b, #4f8cff)" },
  { name: "Remote 3", key: "remote3", fn: "addBy10", color: "linear-gradient(135deg, #e67ee6, #ff72a6)" }
];

const app = document.getElementById('app');

// --- Router Setup ---
const appRouter = router.createRouter({
  "/": () => render("/"),
  "/remote1": () => render("/remote1"),
  "/remote2": () => render("/remote2"),
  "/remote3": () => render("/remote3"),
  "*": () => render("/")
});
appRouter.init();

// Initialize shared navigation service with router's navigate function
navigation.initNavigation(appRouter.navigate);

// --- Global Counter UI ---
document.getElementById("global-counter").textContent = `Global Counter: ${state.getCounter()} (changed by host)`;

// Subscribe to counter changes for DOM updates
eventBus.subscribe("counterChanged", ({ counter, source }) => {
  document.getElementById("global-counter").textContent = `Global Counter: ${counter} (changed by ${source})`;
  logger.log(`Counter updated to ${counter} by ${source}`);
});

eventBus.subscribe("log", msg => {
  console.log("[Logger]", msg);

  // Update UI logs
  const logs = document.getElementById("logs");
  logs.innerHTML = (logs.innerHTML ? logs.innerHTML + "<br>" : "") + msg;
  // Auto-scroll to bottom
  logs.scrollTop = logs.scrollHeight;
});

// Initial log
logger.log("Host app started. Try loading a remote!");

// --- Header UI ---
function renderHeader(routePath) {
  const nav = document.createElement('nav');
  remotes.forEach(remote => {
    const link = document.createElement('a');
    link.textContent = remote.name;
    link.href = `/${remote.key}`;
    if (routePath === `/${remote.key}`) link.classList.add('active');
    link.onclick = (e) => {
      e.preventDefault();
      appRouter.navigate(`/${remote.key}`);
    };
    nav.appendChild(link);
  });

  // Home link
  const homeLink = document.createElement('a');
  homeLink.textContent = "Home";
  homeLink.href = "/";
  if (routePath === "/") homeLink.classList.add('active');
  homeLink.onclick = (e) => {
    e.preventDefault();
    appRouter.navigate("/");
  };
  nav.insertBefore(homeLink, nav.firstChild);

  // Host controls
  const remoteSelect = document.createElement('select');
  remoteSelect.id = "remote-select";
  remotes.forEach((r, idx) => {
    const opt = document.createElement('option');
    opt.value = r.key;
    opt.textContent = r.name;
    remoteSelect.appendChild(opt);
  });

  const fnSelect = document.createElement('select');
  fnSelect.id = "fn-select";
  [{fn:"addBy1", label:"+1"}, {fn:"addBy5", label:"+5"}, {fn:"addBy10", label:"+10"}].forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.fn;
    opt.textContent = item.label;
    fnSelect.appendChild(opt);
  });

  const callBtn = SharedButton("Call Remote Action", "#333");
  callBtn.onclick = async () => {
    const rKey = remoteSelect.value;
    const fn = fnSelect.value;
    try {
      const remoteModule = await import(rKey);
      const remoteObj = remoteModule[rKey];
      if (typeof remoteObj[fn] === "function") {
        logger.log(`Host called ${fn} from ${rKey}`);
        remoteObj[fn]();
      } else {
        logger.log(`Remote ${rKey} does not export ${fn}`);
      }
    } catch (err) {
      logger.log(`Error loading ${rKey}: ${err.message}`);
    }
  };

  const header = document.createElement('header');
  header.appendChild(nav);
  header.appendChild(remoteSelect);
  header.appendChild(fnSelect);
  header.appendChild(callBtn);

  return header;
}

// --- Content Renderer ---
function renderContent(routePath) {
  const content = document.createElement('div');
  content.className = "content";
  if (routePath === "/") {
    content.innerHTML = `
      <h2>Welcome!</h2>
      <p>This is the browser-native federation playground.<br>
      Select a remote from navigation to load a microfrontend.</p>
    `;
    return content;
  }
  const remoteKey = routePath.slice(1);
  const remoteObj = remotes.find(r => r.key === remoteKey);
  if (!remoteObj) {
    content.innerHTML = `<h2>404 - Not Found</h2>`;
    return content;
  }

  // Dynamically import remote and render its UI
  import(remoteKey)
    .then(mod => {
      content.innerHTML = "";
      content.style.background = remoteObj.color;
      content.style.borderRadius = "18px";
      content.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      const remote = mod[remoteKey];
      remote.render(content);
    })
    .catch(err => {
      content.innerHTML = `<h2>Error loading remote: ${remoteObj.name}</h2><pre>${err.message}</pre>`;
      logger.log(`Failed to load remote ${remoteKey}: ${err.message}`);
    });
  return content;
}

// --- App Renderer ---
function render(routePath) {
  app.innerHTML = "";
  app.appendChild(renderHeader(routePath));
  app.appendChild(renderContent(routePath));
}
