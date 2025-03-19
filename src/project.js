export default class Project {
  #title;
  #tasks;

  constructor(title) {
    this.#title = title;
    this.#tasks = []; // should've use id and store them to localstorage instead of this
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

  static fromObject(obj, Task) {
    const project = new Project(obj.title);
    obj.tasks.forEach((task) => project.addTask(Task.fromObject(task)));
    return project;
  }

  addTask(task) {
    this.#tasks.push(task);
  }

  deleteTask(taskId) {
    const index = this.#tasks.findIndex((task) => task.id === taskId);
    if (index === -1) return;
    this.#tasks.splice(index, 1);
  }
}