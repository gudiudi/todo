export default class Project {
	#id;
	#title;
	#tasks;

	constructor(title, id = crypto.randomUUID()) {
		this.#id = id;
		this.#title = title;
		this.#tasks = []; // should've use id and store them to localstorage instead of this
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

	get tasks() {
		return [...this.#tasks];
	}

	toJSON() {
		return { id: this.#id, title: this.#title, tasks: this.#tasks };
	}

	static fromObject(obj, Task) {
		const project = new Project(obj.title, obj.id);
		for (const task of obj.tasks) {
			project.addTask(Task.fromObject(task));
		}
		return project;
	}

	addTask(task) {
		this.#tasks.push(task);
	}

	deleteTask(taskId, projectId) {
		const index = this.#tasks.findIndex((task) => task.id === taskId);
		if (index === -1) return;
		this.#tasks.splice(index, 1);
	}
}
