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

  toJSON() {
    return { title: this.#title, tasks: this.#tasks };
  }

  static fromObject(obj) {
    const project = new Project(obj.title);
    project.#tasks = obj.tasks || [];
    return project;
  }

  addTask(task) {
    this.#tasks.push(task);
  }

  deleteTask(taskId) {
    const index = this.#tasks.findIndex((task) => task.id === taskId);
    if (!index) return;
    this.#tasks.splice(index, 1);
  }
}