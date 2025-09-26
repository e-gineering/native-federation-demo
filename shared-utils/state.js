// Shared state management - Global counter state for federated modules
import { eventBus } from './eventBus.js';
import { logger } from './logger.js';

// Create singleton state instance
export const state = createCounterState(0);

function createCounterState(initialValue = 0) {
  let counter = initialValue;

  const getCounter = () => counter;

  const setCounter = (val, source = 'host') => {
    counter = val;
    eventBus.emit("counterChanged", { counter, source });
  };

  const incrementCounter = (amount = 1, source = 'unknown') => {
    setCounter(counter + amount, source);
  };

  return {
    getCounter,
    setCounter,
    incrementCounter,
  };
}
