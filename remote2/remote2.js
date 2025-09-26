import { log } from "logger";
import { SharedButton } from "sharedButton";

// Remote 2: addBy5 function and render method
export function addBy5({ state, bus }) {
  state.setCounter(state.getCounter() + 5, "remote2");
  log("Remote 2 added 5 to counter.");
  bus.emit("remoteAction", { remote: "remote2", type: "addBy5" });
}

export function render(ctx, mount) {
  const { state, bus, navigate } = ctx;
  mount.innerHTML = `
    <h2 style="margin-top:0;">Remote 2 Microfrontend 🌱</h2>
    <p>This remote adds <b>+5</b> to the global counter.</p>
    <div id="r2-counter"></div>
    <div id="r2-event"></div>
  `;
  const btn = SharedButton("Add 5 (Remote 2)", "#50fa7b");
  btn.onclick = () => addBy5({ state, bus });
  mount.appendChild(btn);

  const navBtn = SharedButton("Go to Remote 3", "#ff72a6");
  navBtn.onclick = () => navigate("/remote3");
  mount.appendChild(navBtn);

  // Show counter
  const updateCounter = () => {
    mount.querySelector("#r2-counter").textContent = `Current Counter: ${state.getCounter()}`;
  };
  updateCounter();
  bus.subscribe("counterChanged", updateCounter);

  // Listen for remoteAction
  bus.subscribe("remoteAction", ({ remote, type }) => {
    if (remote !== "remote2") {
      mount.querySelector("#r2-event").textContent = `Other remote triggered: ${remote} (${type})`;
      setTimeout(() => { mount.querySelector("#r2-event").textContent = ""; }, 2200);
    }
  });

  log("Remote 2 loaded and rendered.");
}