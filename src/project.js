export default class Project {
  #title;
  #tasks;

  constructor(title) {
    this.#title = title;
    this.#tasks = [];
  }

  get title() {
    return this.#title;
  }

  set title(title) {
    this.#title = title;
  }

  get tasks() {
    return [...this.#tasks];
  }

  addTask(task) {
    this.#tasks.push(task);
  }

  deleteTask(taskId) {
    const index = this.#tasks.findIndex(taskId);
    if (!index) return;
    this.#tasks.splice(index, 1);
  }
}