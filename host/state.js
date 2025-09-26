import { createEventBus } from './eventBus.js';
import { log } from 'logger';

export const bus = createEventBus();

function createCounterState(initialValue = 0) {
  let counter = initialValue;

  const getCounter = () => counter;

  const setCounter = (val, source = 'host') => {
    counter = val;
    bus.emit("counterChanged", { counter, source });
    log(`Counter updated to ${counter} by ${source}`);
  };

  return {
    getCounter,
    setCounter,
  };
}

export const { getCounter, setCounter } = createCounterState(0);

// Subscribe to counterChanged events for demo
bus.subscribe("counterChanged", ({ counter, source }) => {
  document.getElementById("global-counter").textContent = `Global Counter: ${counter} (changed by ${source})`;
});
