import { format } from "date-fns";
import "./styles.css";
import Project from "./project.js";
import Task from "./task.js";
import UIController from "./ui.js";

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
    localStorage.setItem('Projects', JSON.stringify(projects));

    const storedProjects = JSON.parse(localStorage.getItem('Projects')) || [];
    const restoredProjects = storedProjects.map((project) => Project.fromObject(project, Task));
    console.log(restoredProjects);

    UIController.renderProjects(restoredProjects);
  });
  newProjectBtn.addEventListener("click", () => newProjectModal.showModal());
})();