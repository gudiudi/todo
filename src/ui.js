import { isSameDay, parseISO, isBefore, startOfDay, format } from "date-fns";
import Storage from "./storage.js";
import Task from "./task.js";

export default class UIController {
  static renderTodayTasks() {
    const container = document.querySelector('.container');
    container.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = 'Today'
    container.appendChild(title)

    const tasksDiv = document.createElement('div');
    tasksDiv.className = 'tasks';

    const projects = Storage.load('Projects');
    const todayTasks = [];
    projects.forEach((project) => {
      project.tasks.forEach((task) => {
        if (isSameDay(task.dueDate, new Date())) {
          todayTasks.push(task);
        }
      });
    });

    console.log(todayTasks);

    todayTasks.forEach((task) => {
      const taskDiv = document.createElement('div');
      taskDiv.className = 'task';
      taskDiv.classList.add(`priority-${task.priority}`);

      const taskTitleDiv = document.createElement('div');
      taskTitleDiv.className = 'task-title';
      taskTitleDiv.textContent = task.title;

      const taskDueDateDiv = document.createElement('div');
      taskDueDateDiv.className = 'task-due-date';
      taskDueDateDiv.textContent = format(task.dueDate, 'MMMM do');

      taskDiv.appendChild(taskTitleDiv);
      taskDiv.appendChild(taskDueDateDiv);
      tasksDiv.appendChild(taskDiv);
    });

    container.appendChild(tasksDiv);
  }

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
    div.className = 'container-header';

    const projectTitleElement = document.createElement('h2');
    projectTitleElement.textContent = project.title
    div.appendChild(projectTitleElement);

    const taskAddButton = document.createElement('button')
    taskAddButton.id = 'new-task-btn';
    taskAddButton.textContent = '+';
    div.appendChild(taskAddButton);

    const tasksDiv = document.createElement('div');
    tasksDiv.className = 'tasks';

    taskAddButton.addEventListener('click', () => {
      const dialogElements = [
        { value: 'title', type: 'text' },
        { value: 'description', type: 'textarea' },
        { value: 'dueDate', type: 'date' },
        { value: 'priority', type: 'select', options: ['high', 'medium', 'low'] },
        { value: 'completed', type: 'checkbox' }
      ];
      
      const dialog = UIController.createDialogElement('task', dialogElements, (data) => {
        console.log(data);
        const newTask = new Task(data.title, data.description, format(new Date(data.dueDate), 'yyyy-MM-dd'), data.priority, data.completed);
        Storage.addTask(project.id, newTask)
        UIController.#reRender(project.id);
      });

      dialog.showModal();
    });

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
        UIController.#reRender(projectId);
      });

      dialog.querySelector('#title').value = task.title;
      dialog.querySelector('#dueDate').value = format(task.dueDate, 'yyyy-MM-dd');
      dialog.querySelector('#priority').value = task.priority;

      dialog.showModal();
    });

    taskRemoveBtn.addEventListener('click', () => {
      const dialogElements = [
        { value: 'Are you sure you want to delete this task?', type: 'delete' },
      ];

      const dialog = UIController.createDialogElement('delete', dialogElements, () => {
        Storage.deleteTask(projectId, task);
        UIController.#reRender(projectId);
      });

      dialog.showModal();
    });

    taskDiv.appendChild(taskCheckbox);
    taskDiv.appendChild(taskTitleDiv);
    taskDiv.appendChild(taskDueDateDiv);
    taskDiv.appendChild(taskEditBtn);
    taskDiv.appendChild(taskRemoveBtn);
    return taskDiv;
  }

  static #reRender(projectId) {
    const projects = Storage.load('Projects'); 
    const projectIndex = projects.findIndex((project) => project.id === projectId);
    UIController.renderProjects(projects);
    UIController.renderTasks(projects[projectIndex].tasks, projects[projectIndex]);
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
      } else if (prop.type === 'delete') {
        const p = document.createElement('p');
        p.textContent = prop.value;
        div.appendChild(p);
      } else if (prop.type === 'textarea') {
        const textarea = document.createElement('textarea');
        textarea.id = prop.value;
        textarea.name = prop.value;
        textarea.required = true;
        textarea.rows = 3;
        div.appendChild(label);
        div.appendChild(textarea);
      } else {
        const input = document.createElement('input');
        input.type = prop.type;
        input.id = prop.value;
        input.name = prop.value;
        input.required = true;

        if (prop.type === 'checkbox') {
          input.className = 'flex-0';
          input.required = false;
        }

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
        const element = form.elements[prop.value];

        if (element?.type === "checkbox") {
          formData[prop.value] = element.checked ? true : false;
        } else {
          formData[prop.value] = element?.value || '';
        }
      });

      if (formData.dueDate) {
        const isDueDateValid = UIController.#validateDueDate(formData.dueDate);
        console.log(isDueDateValid)
        if (!isDueDateValid) {
          const label = document.querySelector('label[for="dueDate"]');
          if (label.querySelector('span')) return;
          const input = label.nextElementSibling;
          input.className = 'error-input';
          const span = document.createElement('span');
          span.className = 'error-msg';
          span.textContent = 'Due date cannot be in the past.';
          label.appendChild(span);
          return;
        }
      }

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

  static #validateDueDate(dueDate) {
    const dueDateObj = parseISO(dueDate);
    const today = startOfDay(new Date());
    return !isBefore(dueDateObj, today);
  }
}