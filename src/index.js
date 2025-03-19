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
})();