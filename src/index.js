import { format } from "date-fns";
import "./styles.css";
import Project from "./project.js";
import Task from "./task.js";
import UIController from "./ui.js";
import Storage from "./storage.js";

(() => {
  const projects = [];

  const defaultProject = new Project('Personal');
  const defaultTask = new Task('Workout', 'Go for a morning run', format(new Date(), 'yyyy-MM-dd'), 'high', false);
  const defaultTask2 = new Task('Study', 'Study for the day', format(new Date(), 'yyyy-MM-dd'), 'low', false);
  defaultProject.addTask(defaultTask);
  defaultProject.addTask(defaultTask2);
  projects.push(defaultProject);
  localStorage.setItem('Projects', [JSON.stringify(projects)]);
  UIController.renderProjects([defaultProject]);

  const newProjectBtn = document.getElementById('new-project-btn');
  const newProjectModal = UIController.createDialogElement([{value: 'title', type: 'text'}], (data) => {
    const newProject = new Project(data.title);
    projects.push(newProject);
    Storage.save('Projects', projects);

    const restoredProjects = Storage.load('Projects', Project, Task);
    UIController.renderProjects(restoredProjects);
  });
  newProjectBtn.addEventListener("click", () => newProjectModal.showModal());

  const dialogElements = [
    { value: 'title', type: 'text' },
    { value: 'dueDate', type: 'date' },
    { value: 'priority', type: 'number' }
  ];
  const taskModal = UIController.createDialogElement(dialogElements);
  console.log(taskModal);
})();


/*
TODO
move this to index js use delegation?
projectDiv.addEventListener('click', () => {
        UIController.renderTasks(project.tasks, project.title);
      });
then render when rendering task add the task modal 
*/