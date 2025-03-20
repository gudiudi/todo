import { format } from "date-fns";
import "./styles.css";
import Project from "./project.js";
import Task from "./task.js";
import UIController from "./ui.js";
import Storage from "./storage.js";

(() => {
  const projects = Storage.load('Projects');
  if (projects.length < 1) {
    const defaultProject = new Project('Personal');
    const defaultTask = new Task('Workout', 'Go for a morning run', format(new Date(), 'yyyy-MM-dd'), 'high', false);
    const defaultTask2 = new Task('Study', 'Study for the day', format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), 'low', false);
    defaultProject.addTask(defaultTask);
    defaultProject.addTask(defaultTask2);
    projects.push(defaultProject);
    Storage.save('Projects', projects);
  }
  UIController.renderProjects(Storage.load('Projects'));

  const newProjectBtn = document.getElementById('new-project-btn');
  const newProjectModal = UIController.createDialogElement('project', [{value: 'title', type: 'text'}], (data) => {
    const projects = Storage.load('Projects');
    const newProject = new Project(data.title);
    projects.push(newProject);
    Storage.save('Projects', projects);

    const restoredProjects = Storage.load('Projects');
    console.log(restoredProjects);
    UIController.renderProjects(restoredProjects);
  });
  newProjectBtn.addEventListener("click", () => newProjectModal.showModal());

  UIController.renderTodayTasks();

  const today = document.getElementById('today');
  today.addEventListener("click", () => UIController.renderTodayTasks());
})();

/*
Use MVC
store by id for easier crud
*/