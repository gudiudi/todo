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
  const newProjectModal = document.getElementById('new-project-modal');
  const newProjectForm = document.getElementById('new-project-form');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const submitModalBtn = document.getElementById('submit-modal-btn');

  newProjectBtn.addEventListener("click", () => newProjectModal.showModal());

  submitModalBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (!newProjectForm.checkValidity()) {
      newProjectForm.reportValidity();
      return;
    }

    const titleValue = document.getElementById("title").value;
    const newProject = new Project(titleValue);
    projects.push(newProject);
    localStorage.setItem('Projects', JSON.stringify(projects));

    newProjectForm.reset();
    newProjectModal.close();

    const storedProjects = JSON.parse(localStorage.getItem('Projects')) || [];

    const restoredProjects = storedProjects.map((project) => Project.fromObject(project, Task));

    console.log(restoredProjects);

    UIController.renderProjects(restoredProjects);
  });


  closeModalBtn.addEventListener("click", (e) => {
    e.preventDefault();
    newProjectModal.close();
  });
})();