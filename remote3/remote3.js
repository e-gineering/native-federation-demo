import { log } from "logger";
import { SharedButton } from "sharedButton";

// Remote 3: addBy10 function and render method
export function addBy10({ state, bus }) {
  state.setCounter(state.getCounter() + 10, "remote3");
  log("Remote 3 added 10 to counter.");
  bus.emit("remoteAction", { remote: "remote3", type: "addBy10" });
}

export function render(ctx, mount) {
  const { state, bus, navigate } = ctx;
  mount.innerHTML = `
    <h2 style="margin-top:0;">Remote 3 Microfrontend 💜</h2>
    <p>This remote adds <b>+10</b> to the global counter.</p>
    <div id="r3-counter"></div>
    <div id="r3-event"></div>
  `;
  const btn = SharedButton("Add 10 (Remote 3)", "#e67ee6");
  btn.onclick = () => addBy10({ state, bus });
  mount.appendChild(btn);

  const navBtn = SharedButton("Go to Home", "#FFD700");
  navBtn.onclick = () => navigate("/");
  mount.appendChild(navBtn);

  // Show counter
  const updateCounter = () => {
    mount.querySelector("#r3-counter").textContent = `Current Counter: ${state.getCounter()}`;
  };
  updateCounter();
  bus.subscribe("counterChanged", updateCounter);

  // Listen for remoteAction
  bus.subscribe("remoteAction", ({ remote, type }) => {
    if (remote !== "remote3") {
      mount.querySelector("#r3-event").textContent = `Other remote triggered: ${remote} (${type})`;
      setTimeout(() => { mount.querySelector("#r3-event").textContent = ""; }, 2200);
    }
  });

  log("Remote 3 loaded and rendered.");
}