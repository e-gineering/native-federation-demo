// Shared logger utility
export function log(msg) {
  console.log("[Logger]", msg);
  // Emit to host event bus if present (for log area in host UI)
  if (window && window.hostBus) {
    window.hostBus.emit("log", msg);
  }
}