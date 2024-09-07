const state = {
  todos: [],
};

const todosProxy = new Proxy(state, {
  set: function (target, prop, value) {
    target[prop] = value;
    console.log("todosProxy set:", target, prop, value);
    if (prop === "todos") {
      globalThis.dispatchEvent(new Event("app:todos"));
    }
    return true;
  },
  get: function (target, prop) {
    console.log("todosProxy get", target, prop);
    return target[prop];
  },
});

export default todosProxy;
