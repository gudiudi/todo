export default class Task {
  #title;
  #description;
  #dueDate;
  #priority;
  #completed;

  constructor(title, description, dueDate, priority, completed) {
    this.#title = title;
    this.#description = description;
    this.#dueDate = new Date(dueDate);
    this.#priority = priority;
    this.#completed = completed;
  }

  get title() {
    return this.#title;
  }

  set title(title) {
    this.#title = title;
  }

  get description() {
    return this.#description;
  }

  set description(description) {
    this.#description = description;
  }

  get dueDate() {
    return this.#dueDate;
  }

  set dueDate(dueDate) {
    this.#dueDate = new Date(dueDate);
  }

  get priority() {
    return this.#priority;
  }

  set priority(priority) {
    this.#priority = priority;
  }

  get completed() {
    return this.#completed;
  }

  toggleComplete() {
    this.#completed = !this.#completed;
  }

  toJSON() {
    return { 
      title: this.#title, 
      description: this.#description, 
      dueDate: this.#dueDate,
      priority: this.#priority,
      completed: this.#completed
    };
  }

  static fromObject(obj) {
    const task = new Task(obj.title, obj.description, obj.dueDate, obj.priority, obj.completed);
    return task;
  }
}