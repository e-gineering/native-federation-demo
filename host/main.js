import { Router } from './router.js';
import { state, bus } from './state.js';
import { log } from 'logger';
import { SharedButton } from 'sharedButton';

// Available remotes and their federated functions
const remotes = [
  { name: "Remote 1", key: "remote1", fn: "addBy1", color: "linear-gradient(135deg, #FFD700, #FF8C00)" },
  { name: "Remote 2", key: "remote2", fn: "addBy5", color: "linear-gradient(135deg, #50fa7b, #4f8cff)" },
  { name: "Remote 3", key: "remote3", fn: "addBy10", color: "linear-gradient(135deg, #e67ee6, #ff72a6)" }
];

const app = document.getElementById('app');

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
      router.navigate(`/${remote.key}`);
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
    router.navigate("/");
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
      const remote = await import(rKey);
      if (typeof remote[fn] === "function") {
        remote[fn]({ state, bus });
        log(`Host called ${fn} from ${rKey}`);
      } else {
        log(`Remote ${rKey} does not export ${fn}`);
      }
    } catch (err) {
      log(`Error loading ${rKey}: ${err.message}`);
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
      // Each remote exports render({ state, bus, navigate })
      content.innerHTML = "";
      content.style.background = remoteObj.color;
      content.style.borderRadius = "18px";
      content.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      mod.render({
        state,
        bus,
        navigate: (path) => router.navigate(path)
      }, content);
    })
    .catch(err => {
      content.innerHTML = `<h2>Error loading remote: ${remoteObj.name}</h2><pre>${err.message}</pre>`;
      log(`Failed to load remote ${remoteKey}: ${err.message}`);
    });
  return content;
}

// --- App Renderer ---
function render(routePath) {
  app.innerHTML = "";
  app.appendChild(renderHeader(routePath));
  app.appendChild(renderContent(routePath));
}

// --- Router Setup ---
const router = new Router({
  "/": () => render("/"),
  "/remote1": () => render("/remote1"),
  "/remote2": () => render("/remote2"),
  "/remote3": () => render("/remote3"),
  "*": () => render("/")
});
router.init();

// --- Global Counter UI ---
document.getElementById("global-counter").textContent = `Global Counter: ${state.getCounter()} (changed by host)`;

// --- Logger UI ---
function updateLogs(msg) {
  const logs = document.getElementById("logs");
  logs.innerHTML = msg;
}
bus.subscribe("log", msg => {
  const logs = document.getElementById("logs");
  logs.innerHTML = (logs.innerHTML ? logs.innerHTML + "<br>" : "") + msg;
});

// Initial log
log("Host app started. Try loading a remote!");
