export class AsyncLocalStorage {
  disable() {}
  getStore() {}
  run(store, callback, ...args) {
    return callback(...args);
  }
  enterWith(store) {}
}
