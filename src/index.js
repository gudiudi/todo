import { format } from "date-fns";
import "./styles.css";
import Project from "./project.js";
import Task from "./task.js";
import UIController from "./ui.js";

(() => {
  const project = new Project('Personal');
  const task = new Task('Workout', 'Go for a morning run', format(new Date(), 'yyyy-MM-dd'), 'high', false);
  project.addTask(task);

  const project2 = new Project('Work');

  UIController.renderProjects([project, project2]);

  const newProjectBtn = document.querySelector("#new-project-btn");
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
    
    newProjectForm.reset();
    newProjectModal.close();

    UIController.renderProjects([newProject]);
  });


  closeModalBtn.addEventListener("click", (e) => {
    e.preventDefault();
    newProjectModal.close();
  });
})();