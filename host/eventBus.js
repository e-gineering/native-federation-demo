// Simple event bus for pub/sub
export class EventBus {
  constructor() {
    this.listeners = {};
  }

  subscribe(event, handler) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(handler);
    return () => this.unsubscribe(event, handler);
  }

  unsubscribe(event, handler) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(h => h !== handler);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(handler => handler(data));
    }
  }
}