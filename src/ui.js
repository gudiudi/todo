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

      taskDiv.addEventListener('click', () => {
        task.toggleComplete();
      });
    });

    container.appendChild(projectTitleElement);
    container.appendChild(tasksDiv);
  }

  static #createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';

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

    const priorities = {
      'high': 'solid 3px red',
      'medium': 'solid 3px yellow',
      'low': 'solid 3px green'
    }
    taskDiv.style = `border-left: ${priorities[task.priority]};`;

    taskDiv.appendChild(taskTitleDiv);
    taskDiv.appendChild(taskDueDateDiv);
    taskDiv.appendChild(taskDetailsBtn);
    taskDiv.appendChild(taskEditBtn);
    taskDiv.appendChild(taskRemoveBtn);
    return taskDiv;
  }
}