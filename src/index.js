import { format } from "date-fns";
import "./styles.css";
import Project from "./project.js";
import Task from "./task.js";

(() => {
  const project = new Project('Personal');
  console.log(project.tasks);
  const task = new Task('Workout', 'Go for a morning run', '2025-06-11', 'high', false);
  project.addTask(task);
  console.log(project.tasks);
  console.log(format(task.dueDate, "dd-MM-yyyy"));
})();