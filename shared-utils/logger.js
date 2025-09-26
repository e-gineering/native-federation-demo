// Shared logger utility
import { eventBus } from './eventBus.js';

export const logger = {
  log,
};

function log(msg) {
  // Emit to shared event bus - host will handle console logging and UI updates
  eventBus.emit("log", msg);
}
