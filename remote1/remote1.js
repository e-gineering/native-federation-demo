import { logger } from "logger";
import { SharedButton } from "sharedButton";
import { eventBus } from "eventBus";
import { state } from "state";
import { navigation } from "navigation";

export const remote1 = {
  addBy1,
  render,
};

// Remote 1: addBy1 function and render method
function addBy1() {
  logger.log("Remote 1 added 1 to counter.");
  state.setCounter(state.getCounter() + 1, "remote1");
  eventBus.emit("remoteAction", { remote: "remote1", type: "addBy1" });
}

function render(mount) {
  mount.innerHTML = `
    <h2 style="margin-top:0;">Remote 1 Microfrontend 🚀</h2>
    <p>This remote adds <b>+1</b> to the global counter.</p>
    <div id="r1-counter"></div>
    <div id="r1-event"></div>
  `;
  const btn = SharedButton("Add 1 (Remote 1)", "#FFD700");
  btn.onclick = () => addBy1();
  mount.appendChild(btn);

  const navBtn = SharedButton("Go to Remote 2", "#4f8cff");
  navBtn.onclick = () => navigation.navigate("/remote2");
  mount.appendChild(navBtn);

  // Show counter
  const updateCounter = () => {
    mount.querySelector("#r1-counter").textContent = `Current Counter: ${state.getCounter()}`;
  };
  updateCounter();
  eventBus.subscribe("counterChanged", updateCounter);

  // Listen for remoteAction
  eventBus.subscribe("remoteAction", ({ remote, type }) => {
    if (remote !== "remote1") {
      mount.querySelector("#r1-event").textContent = `Other remote triggered: ${remote} (${type})`;
      setTimeout(() => { mount.querySelector("#r1-event").textContent = ""; }, 2200);
    }
  });

  logger.log("Remote 1 loaded and rendered.");
}
