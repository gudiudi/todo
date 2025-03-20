import Project from "./project.js";
import Task from "./task.js";

export default class Storage {
  static save(name, objects) {
    localStorage.setItem(name, JSON.stringify(objects));
  }

  static load(name) {
    const objects = JSON.parse(localStorage.getItem(name)) || [];
    return objects.map((object) => Project.fromObject(object, Task));
  }

  static addTask(projectId, task) {
    const projects = Storage.load('Projects'); 
    const projectIndex = projects.findIndex((project) => project.id === projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].addTask(task);
      
      Storage.save('Projects', projects);
    }
  }

  static updateTask(projectId, task) {
    const projects = Storage.load('Projects'); 
    const projectIndex = projects.findIndex((project) => project.id === projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].deleteTask(task.id);
      projects[projectIndex].addTask(task);
      
      Storage.save('Projects', projects);
    }
  }

  static deleteTask(projectId, task) {
    const projects = Storage.load('Projects'); 
    const projectIndex = projects.findIndex((project) => project.id === projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].deleteTask(task.id);
      
      Storage.save('Projects', projects);
    }
  }
}