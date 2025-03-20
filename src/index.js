import { format } from "date-fns";
import "./styles.css";
import Project from "./project.js";
import Task from "./task.js";
import UIController from "./ui.js";
import Storage from "./storage.js";

(() => {
  const projects = Storage.load('Projects', Project, Task);
  if (projects.length < 1) {
    const defaultProject = new Project('Personal');
    const defaultTask = new Task('Workout', 'Go for a morning run', format(new Date(), 'yyyy-MM-dd'), 'high', false);
    const defaultTask2 = new Task('Study', 'Study for the day', format(new Date(), 'yyyy-MM-dd'), 'low', false);
    defaultProject.addTask(defaultTask);
    defaultProject.addTask(defaultTask2);
    projects.push(defaultProject);
    Storage.save('Projects', projects);
  }
  UIController.renderProjects(Storage.load('Projects', Project, Task));

  const newProjectBtn = document.getElementById('new-project-btn');
  const newProjectModal = UIController.createDialogElement('project', [{value: 'title', type: 'text'}], (data) => {
    const newProject = new Project(data.title);
    projects.push(newProject);
    Storage.save('Projects', projects);

    const restoredProjects = Storage.load('Projects', Project, Task);
    console.log(restoredProjects);
    UIController.renderProjects(restoredProjects);
  });
  newProjectBtn.addEventListener("click", () => newProjectModal.showModal());
})();