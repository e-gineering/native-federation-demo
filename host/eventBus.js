// Simple event bus for pub/sub
export function createEventBus() {
  const listeners = {};

  const subscribe = (event, handler) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(handler);
    return () => unsubscribe(event, handler);
  };

  const unsubscribe = (event, handler) => {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(h => h !== handler);
  };

  const emit = (event, data) => {
    if (listeners[event]) {
      listeners[event].forEach(handler => handler(data));
    }
  };

  return {
    subscribe,
    unsubscribe,
    emit,
  };
}
