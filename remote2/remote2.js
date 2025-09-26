import { logger } from "logger";
import { SharedButton } from "sharedButton";
import { eventBus } from "eventBus";
import { state } from "state";
import { navigation } from "navigation";

export const remote2 = {
  addBy5,
  render,
};

// Remote 2: addBy5 function and render method
function addBy5() {
  logger.log("Remote 2 added 5 to counter.");
  state.setCounter(state.getCounter() + 5, "remote2");
  eventBus.emit("remoteAction", { remote: "remote2", type: "addBy5" });
}

function render(mount) {
  mount.innerHTML = `
    <h2 style="margin-top:0;">Remote 2 Microfrontend 🌱</h2>
    <p>This remote adds <b>+5</b> to the global counter.</p>
    <div id="r2-counter"></div>
    <div id="r2-event"></div>
  `;
  const btn = SharedButton("Add 5 (Remote 2)", "#50fa7b");
  btn.onclick = () => addBy5();
  mount.appendChild(btn);

  const navBtn = SharedButton("Go to Remote 3", "#ff72a6");
  navBtn.onclick = () => navigation.navigate("/remote3");
  mount.appendChild(navBtn);

  // Show counter
  const updateCounter = () => {
    mount.querySelector("#r2-counter").textContent = `Current Counter: ${state.getCounter()}`;
  };
  updateCounter();
  eventBus.subscribe("counterChanged", updateCounter);

  // Listen for remoteAction
  eventBus.subscribe("remoteAction", ({ remote, type }) => {
    if (remote !== "remote2") {
      mount.querySelector("#r2-event").textContent = `Other remote triggered: ${remote} (${type})`;
      setTimeout(() => { mount.querySelector("#r2-event").textContent = ""; }, 2200);
    }
  });

  logger.log("Remote 2 loaded and rendered.");
}
