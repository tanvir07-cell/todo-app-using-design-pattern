export const observerMixin = {
  observers: new Set(),
  addObserver(obs) {
    this.observers.add(obs);
  },

  removeObserver(obs) {
    this.observers.delete(obs);
  },

  notify() {
    this.observers.forEach((obs) => {
      if (typeof obs === "function") {
        obs();
      }
    });
  },
};
