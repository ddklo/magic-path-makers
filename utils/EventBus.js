// Singleton event bus for cross-scene communication.
// Phaser is loaded as a global from the CDN script tag.
let _bus = null;

export function getEventBus() {
  if (!_bus) {
    _bus = new window.Phaser.Events.EventEmitter();
  }
  return _bus;
}

export function resetEventBus() {
  if (_bus) {
    _bus.removeAllListeners();
  }
}
