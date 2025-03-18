import "./styles.css";
import Project from "./project.js";
import Task from "./task.js";

(() => {
  const project = new Project('Personal');
  console.log(project.tasks);
  const task = new Task('Workout', 'Go for a morning run', '03-19-2025', 'high', false);
  project.addTask(task);
  console.log(project.tasks);
})();