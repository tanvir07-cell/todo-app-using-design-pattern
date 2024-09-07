import { TodoList } from "./webapp/classes.js";
import cmd from "./webapp/command.js";
import { loadDB, openDB, saveDB } from "./webapp/indexDb.js";
import todosProxy from "./webapp/state.js";

globalThis.app = {
  state: todosProxy,
  todoInput: document.querySelector("#todo-input"),
  todoList: document.querySelector("#todo-list"),
  addBtn: document.querySelector("#add-btn"),
  undoBtn: document.querySelector("#undo-btn"),

  openDB,
  saveDB,
  loadDB,
};

globalThis.addEventListener("DOMContentLoaded", () => {
  // load from indexdb
  app.loadDB();

  app.undoBtn.addEventListener("click", (e) => {
    cmd.undo();
  });

  app.addBtn.addEventListener("click", (e) => {
    const text = app.todoInput.value.trim();

    if (!text) {
      return;
    }

    cmd.add(text);

    app.todoInput.value = "";
  });

  app.todoList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      let text = e.target.parentElement.textContent.trim();

      if (text.includes("Delete")) {
        text = text.split("Delete")[0];
      }

      console.log(text);
      cmd.remove(text.trim());
    }
  });
});

// when reactivity is triggered
globalThis.addEventListener("app:todos", () => {
  const ul = app.todoList;

  ul.innerHTML = "";

  app.state.todos.forEach((todo) => {
    ul.innerHTML += `<li>${todo.text} <button class="delete-btn btn-candy-mesh">Delete</button></li>`;
  });

  // save to indexdb
  // app.saveDB();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    app.addBtn.click();

    // app.saveDB();
  }

  if (e.key === "s" && e.ctrlKey && app.todoInput.value) {
    e.preventDefault();
    app.addBtn.click();

    // app.saveDB();
  }

  if (e.key === "Escape" && app.todoInput.value) {
    e.preventDefault();
    app.todoInput.value = "";
  }
});

(async function () {
  if (navigator.storage && navigator.storage.persist) {
    if (!(await navigator.storage.persisted())) {
      const result = await navigator.storage.persist();
      console.log(`Was Persistent Storage Request granted? ${result}`);
    } else {
      console.log(`Persistent Storage already granted`);
    }
  }
})();
// for quota:

(async function () {
  if (navigator.storage && navigator.storage.estimate) {
    const q = await navigator.storage.estimate();
    console.log(`quota available: ${parseInt(q.quota / 1024 / 1024)}MiB`);
    console.log(`quota usage: ${q.usage / 1024}KiB`);
  }
})();

const startButton = document.getElementById("start-button");
const transcription = app.todoInput;

let recognition;
if ("webkitSpeechRecognition" in globalThis) {
  recognition = new webkitSpeechRecognition();
} else if ("SpeechRecognition" in globalThis) {
  recognition = new SpeechRecognition();
} else {
  console.error("Speech Recognition API not supported in this browser.");
}

if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = true; // Keep this true for real-time updates
  recognition.lang = "en-US";

  let fullTranscript = ""; // Keep track of the full transcript

  recognition.onresult = (event) => {
    let interimTranscript = ""; // Store interim transcripts

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcriptSegment = event.results[i][0].transcript
        .trim()
        .toLowerCase();

      if (event.results[i].isFinal) {
        // If the user says "add", trigger the command with the previous transcript
        if (transcriptSegment === "add") {
          cmd.add(fullTranscript);
          transcriptSegment = "";
          fullTranscript = ""; // Clear the full transcript after the command is executed
        } else if (fullTranscript.includes("remove")) {
          fullTranscript += " " + transcriptSegment; // Append the final transcript

          cmd.remove(fullTranscript);
          transcriptSegment = "";
          fullTranscript = "";
        } else {
          fullTranscript += " " + transcriptSegment; // Append the final transcript
        }
      } else {
        interimTranscript += " " + transcriptSegment; // Append interim transcript
      }
    }

    // Display the combined final and interim transcript in real-time
    transcription.value = (fullTranscript + interimTranscript).trim();
    console.log("Interim transcript:", interimTranscript);
    console.log("Full transcript:", fullTranscript);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  startButton.addEventListener("click", () => {
    recognition.start();
  });
}
