// for the list (li)
export class TodoItem {
  constructor(text) {
    this.text = text;
  }

  equals(other) {
    // value object design pattern
    return this.text === other.text;
  }
}

// for the list (ul)

// singleton design pattern:

export class TodoList {
  #data = [];
  get items() {
    return this.#data;
  }

  static instance = null;

  static getInstance() {
    return this.instance;
  }

  // run only one time and this is the singleton
  static {
    this.instance = new TodoList();
    console.log("singleton instance created");
  }

  constructor() {
    if (TodoList.instance) {
      throw new Error("Singleton class, cannot create instance");
    }
  }

  addTodo(item) {
    const itemAlreadyExists = this.#data.some((i) => i.equals(item));
    if (itemAlreadyExists) {
      alert("Item already exists");

      this.#data = this.#data.map((i) => (i.equals(item) ? item : i));
      return this.#data;
    }
    this.#data.push(item);
    app.state.todos = this.#data;
  }

  removeTodo(item) {
    const itemIndex = this.#data.findIndex((i) => i.equals(item));
    if (itemIndex === -1) {
      return;
    }
    this.#data.splice(itemIndex, 1);
    app.state.todos = this.#data;
  }

  clearTodos() {
    this.#data = [];
    return this.#data;
  }
}
