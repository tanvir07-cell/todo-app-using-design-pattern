import { TodoList } from "./classes.js";

// for quota:
export const openDB = async () => {
  return await idb.openDB("todo-web-app", 1, {
    async upgrade(db) {
      await db.createObjectStore("app:todos");
    },
  });
};

export const saveDB = async () => {
  const db = await openDB();
  await db.put("app:todos", JSON.stringify(app.state.todos), "todos");
};

export const loadDB = async () => {
  const db = await openDB();
  const todos = await db.get("app:todos", "todos");
  if (todos) {
    app.state.todos = JSON.parse(todos);
  }
};
