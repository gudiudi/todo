import { format } from "date-fns";
import Storage from "./storage.js";

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
        UIController.renderTasks(project.tasks, project);
      });
    });
  }

  static renderTasks(tasks, project) {
    tasks = tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const container = document.querySelector('.container');
    container.innerHTML = '';

    const div = document.createElement('div');
    const projectTitleElement = document.createElement('h2');
    projectTitleElement.textContent = project.title
    div.appendChild(projectTitleElement);

    const taskAddButton = document.createElement('button')
    taskAddButton.id = 'new-task-btn';
    taskAddButton.textContent = '+';
    div.appendChild(taskAddButton);

    const tasksDiv = document.createElement('div');
    tasksDiv.className = 'tasks';

    tasks.forEach((task) => {
      const taskDiv = UIController.#createTaskElement(task, project.id);
      tasksDiv.appendChild(taskDiv);
    });

    container.appendChild(div);
    container.appendChild(tasksDiv);
  }

  static #createTaskElement(task, projectId) {
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

      Storage.updateTask(projectId, task);
    });

    taskEditBtn.addEventListener('click', () => {
      const dialogElements = [
        { value: 'title', type: 'text' },
        { value: 'dueDate', type: 'date' },
        { value: 'priority', type: 'select', options: ['high', 'medium', 'low'] }
      ];
      
      const dialog = UIController.createDialogElement('task', dialogElements, (data) => {
        task.title = data.title;
        task.dueDate = data.dueDate;
        task.priority = data.priority;

        Storage.updateTask(projectId, task);
        const projects = Storage.load('Projects'); 
        const projectIndex = projects.findIndex((project) => project.id === projectId);
        UIController.renderTasks(projects[projectIndex].tasks, projects[projectIndex]);
      });

      dialog.querySelector('#title').value = task.title;
      dialog.querySelector('#dueDate').value = format(task.dueDate, 'yyyy-MM-dd');
      dialog.querySelector('#priority').value = task.priority;

      dialog.showModal();
    });

    taskDiv.appendChild(taskCheckbox);
    taskDiv.appendChild(taskTitleDiv);
    taskDiv.appendChild(taskDueDateDiv);
    taskDiv.appendChild(taskDetailsBtn);
    taskDiv.appendChild(taskEditBtn);
    taskDiv.appendChild(taskRemoveBtn);
    return taskDiv;
  }

  static createDialogElement(type, properties, onSubmit) {
    const body = document.querySelector('body');

    const existingDialog = document.querySelector(`#${type}-dialog`);
    if (existingDialog) existingDialog.remove();

    const dialog = document.createElement('dialog');
    dialog.id = type + '-dialog';
    const form = document.createElement('form');
    form.method = 'dialog';

    properties.forEach((prop) => {
      const div = document.createElement('div');
      const label = document.createElement('label');
      label.htmlFor = prop.value;
      label.textContent = prop.value[0].toUpperCase() + prop.value.slice(1, prop.value.length) + ':';

      if (prop.type === 'select') {
        const select = document.createElement('select');
        select.id = prop.value;
        select.name = prop.value;
        select.required = true;

        prop.options.forEach((option) => {
          const opt = document.createElement('option');
          opt.value = option;
          opt.textContent = option[0].toUpperCase() + option.slice(1, option.length);
          select.appendChild(opt);
        });

        div.appendChild(label);
        div.appendChild(select);
      } else {
        const input = document.createElement('input');
        input.type = prop.type;
        input.id = prop.value;
        input.name = prop.value;
        input.required = true;

        div.appendChild(label);
        div.appendChild(input);
      }
      
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
      if (type !== 'project') dialog.remove();
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

      if (type !== 'project') dialog.remove();
    });

    buttonGroup.appendChild(closeModalBtn);
    buttonGroup.appendChild(submitModalBtn);
    form.appendChild(buttonGroup);
    dialog.appendChild(form);
    body.appendChild(dialog);
    return dialog;
  }
}