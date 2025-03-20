import { format } from "date-fns";

export default class UIController {
  static renderProjects(projects) {
    const projectsDiv = document.querySelector('.project-sections');
    projectsDiv.innerHTML = '';

    projects.forEach((project) => {
      const projectDiv = document.createElement('div');
      projectDiv.className = 'project-section';
      projectDiv.textContent = project.title;
      projectsDiv.appendChild(projectDiv);

      projectDiv.addEventListener('click', () => {
        UIController.renderTasks(project.tasks, project.title);
      });
    });
  }

  static renderTasks(tasks, projectTitle) {
    const container = document.querySelector('.container');
    container.innerHTML = '';

    const projectTitleElement = document.createElement('h2');
    projectTitleElement.textContent = projectTitle

    const tasksDiv = document.createElement('div');
    tasksDiv.className = 'tasks';

    tasks.forEach((task) => {
      const taskDiv = UIController.#createTaskElement(task);
      tasksDiv.appendChild(taskDiv);
    });

    container.appendChild(projectTitleElement);
    container.appendChild(tasksDiv);
  }

  static #createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    taskDiv.classList.add(`priority-${task.priority}`);

    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.className = 'task-checkbox';
    taskCheckbox.checked = task.completed;
    (task.completed) ? taskDiv.classList.add('completed') : taskDiv.classList.remove('completed');

    const taskTitleDiv = document.createElement('div');
    taskTitleDiv.className = 'task-title';
    taskTitleDiv.textContent = task.title;

    const taskDueDateDiv = document.createElement('div');
    taskDueDateDiv.className = 'task-due-date';
    taskDueDateDiv.textContent = format(task.dueDate, 'MMMM do');

    const taskDetailsBtn = document.createElement('button');
    taskDetailsBtn.id = 'task-details-btn';
    taskDetailsBtn.textContent = 'Details';

    const taskEditBtn = document.createElement('button');
    taskEditBtn.id = 'task-edit-btn';
    taskEditBtn.textContent = 'Edit';

    const taskRemoveBtn = document.createElement('button');
    taskRemoveBtn.id = 'task-remove-btn';
    taskRemoveBtn.textContent = 'Remove';

    taskCheckbox.addEventListener('change', () => {
      task.toggleComplete();
      (task.completed) ? taskDiv.classList.add('completed') : taskDiv.classList.remove('completed');
    });

    taskDiv.appendChild(taskCheckbox);
    taskDiv.appendChild(taskTitleDiv);
    taskDiv.appendChild(taskDueDateDiv);
    taskDiv.appendChild(taskDetailsBtn);
    taskDiv.appendChild(taskEditBtn);
    taskDiv.appendChild(taskRemoveBtn);
    return taskDiv;
  }

  static createDialogElement(properties, onSubmit) {
    const body = document.querySelector('body');

    const dialog = document.createElement('dialog');
    const form = document.createElement('form');
    form.method = 'dialog';

    properties.forEach((prop) => {
      const div = document.createElement('div');
      const label = document.createElement('label');
      label.htmlFor = prop.value;
      label.textContent = prop.value[0].toUpperCase() + prop.value.slice(1, prop.value.length) + ':';
      const input = document.createElement('input');
      input.type = prop.type;
      input.id = prop.value;
      input.name = prop.value;
      input.required = true;

      div.appendChild(label);
      div.appendChild(input);
      form.appendChild(div);
    });

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    const closeModalBtn = document.createElement('button');
    closeModalBtn.type = 'button';
    closeModalBtn.textContent = 'Close';
    const submitModalBtn = document.createElement('button');
    submitModalBtn.type = 'submit';
    submitModalBtn.textContent = 'Submit';

    closeModalBtn.addEventListener("click", (e) => {
      e.preventDefault();
      dialog.close();
    })

    submitModalBtn.addEventListener("click", (e) => {
      e.preventDefault();
  
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = {};
      properties.forEach(prop => {
        formData[prop.value] = form.elements[prop.value].value;
      });

      if (onSubmit) onSubmit(formData);

      form.reset();
      dialog.close();
    });

    buttonGroup.appendChild(closeModalBtn);
    buttonGroup.appendChild(submitModalBtn);
    form.appendChild(buttonGroup);
    dialog.appendChild(form);
    body.appendChild(dialog);
    return dialog;
  }
}