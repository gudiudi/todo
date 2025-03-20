export default class Storage {
  static save(name, objects) {
    localStorage.setItem(name, JSON.stringify(objects));
  }

  static load(name, Project, Task) {
    const objects = JSON.parse(localStorage.getItem(name)) || [];
    return objects.map((object) => Project.fromObject(object, Task));
  }
}