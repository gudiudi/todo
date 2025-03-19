import { format } from "date-fns";
import "./styles.css";
import Project from "./project.js";
import Task from "./task.js";
import UIController from "./ui.js";

(() => {
  const project = new Project('Personal');
  const task = new Task('Workout', 'Go for a morning run', format(new Date(), 'yyyy-MM-dd'), 'high', false);
  project.addTask(task);
  UIController.renderProjects([project]);

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
    localStorage.setItem('Projects', JSON.stringify(newProject));
    
    newProjectForm.reset();
    newProjectModal.close();

    let storedProject = JSON.parse(localStorage.getItem('Projects'));
    storedProject = Project.fromObject(storedProject);
    console.log(storedProject);
  });


  closeModalBtn.addEventListener("click", (e) => {
    e.preventDefault();
    newProjectModal.close();
  });
})();