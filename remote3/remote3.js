import { logger } from "logger";
import { SharedButton } from "sharedButton";
import { eventBus } from "eventBus";
import { state } from "state";
import { navigation } from "navigation";

export const remote3 = {
  addBy10,
  render,
};

// Remote 3: addBy10 function and render method
function addBy10() {
  logger.log("Remote 3 added 10 to counter.");
  state.setCounter(state.getCounter() + 10, "remote3");
  eventBus.emit("remoteAction", { remote: "remote3", type: "addBy10" });
}

function render(mount) {
  mount.innerHTML = `
    <h2 style="margin-top:0;">Remote 3 Microfrontend 💜</h2>
    <p>This remote adds <b>+10</b> to the global counter.</p>
    <div id="r3-counter"></div>
    <div id="r3-event"></div>
  `;
  const btn = SharedButton("Add 10 (Remote 3)", "#e67ee6");
  btn.onclick = () => addBy10();
  mount.appendChild(btn);

  const navBtn = SharedButton("Go to Home", "#FFD700");
  navBtn.onclick = () => navigation.navigate("/");
  mount.appendChild(navBtn);

  // Show counter
  const updateCounter = () => {
    mount.querySelector("#r3-counter").textContent = `Current Counter: ${state.getCounter()}`;
  };
  updateCounter();
  eventBus.subscribe("counterChanged", updateCounter);

  // Listen for remoteAction
  eventBus.subscribe("remoteAction", ({ remote, type }) => {
    if (remote !== "remote3") {
      mount.querySelector("#r3-event").textContent = `Other remote triggered: ${remote} (${type})`;
      setTimeout(() => { mount.querySelector("#r3-event").textContent = ""; }, 2200);
    }
  });

  logger.log("Remote 3 loaded and rendered.");
}
