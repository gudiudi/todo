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

  toggleComplete() {
    this.#completed = !this.#completed;
  }
}