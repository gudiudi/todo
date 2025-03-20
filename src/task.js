export default class Task {
	#id;
	#title;
	#description;
	#dueDate;
	#priority;
	#completed;

	constructor(
		title,
		description,
		dueDate,
		priority,
		completed,
		id = crypto.randomUUID(),
	) {
		this.#id = id;
		this.#title = title;
		this.#description = description;
		this.#dueDate = new Date(dueDate);
		this.#priority = priority;
		this.#completed = completed;
	}

	get id() {
		return this.#id;
	}

	set id(id) {
		this.#id = id;
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
			id: this.#id,
			title: this.#title,
			description: this.#description,
			dueDate: this.#dueDate,
			priority: this.#priority,
			completed: this.#completed,
		};
	}

	static fromObject(obj) {
		const task = new Task(
			obj.title,
			obj.description,
			obj.dueDate,
			obj.priority,
			obj.completed,
			obj.id,
		);
		return task;
	}
}
