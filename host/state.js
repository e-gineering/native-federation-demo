// Global state management (counter) with event bus integration
import { EventBus } from './eventBus.js';
import { log } from 'logger';

export const bus = new EventBus();

let counter = 0;

export const state = {
  getCounter: () => counter,
  setCounter: (val, source = 'host') => {
    counter = val;
    bus.emit("counterChanged", { counter, source });
    log(`Counter updated to ${counter} by ${source}`);
  }
};

// Subscribe to counterChanged events for demo
bus.subscribe("counterChanged", ({ counter, source }) => {
  document.getElementById("global-counter").textContent = `Global Counter: ${counter} (changed by ${source})`;
});