const Command = {
  history: [],

  add: (text) => {
    const isDuplicate = app.state.todos.some(
      (todo) => todo.text.trim() === text.trim()
    );
    if (isDuplicate) {
      alert("Item already exists");
      app.state.todos = app.state.todos.map((todo) =>
        todo.text === text ? { text } : todo
      );
      return;
    }
    // before any change, we push the current state to the history array
    // push the previous state to the history array
    Command.history.push([...app.state.todos]);

    console.log(Command.history);

    app.state.todos = [...app.state.todos, { text: text.trim() }];

    app.saveDB();
  },
  remove: (text) => {
    Command.history.push([...app.state.todos]);
    console.log(Command.history);

    if (text.trim().includes("remove")) {
      text = text.trim().split("remove")[1];

      console.log("inside remove", text);
    }

    const todos = app.state.todos.filter((todo) => todo.text !== text.trim());
    app.state.todos = todos;
    app.saveDB();
  },
  undo: () => {
    console.log(Command.history);
    if (Command.history.length > 0) {
      app.state.todos = Command.history.pop();
      app.saveDB();
    } else {
      alert("No actions to undo");
    }
  },
};

export default Command;
