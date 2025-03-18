import { format } from "date-fns";
import "./styles.css";
import Project from "./project.js";
import Task from "./task.js";

(() => {
  const project = new Project('Personal');
  const task = new Task('Workout', 'Go for a morning run', '2025-06-11', 'high', false);
  project.addTask(task);

  const projectsDiv = document.querySelector('.projects');
  const projectDiv = document.createElement('div');
  projectDiv.className = 'project';
  projectDiv.textContent = project.title;
  projectsDiv.appendChild(projectDiv);
})();