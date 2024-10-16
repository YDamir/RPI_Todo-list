import {tasks} from '/src/mock/task.js';

export default class TasksModel {
  #boardTasks = tasks;
  #observers = [];

  get tasks() {
    return this.#boardTasks;
  }

  addTask(newTask) {
    this.#boardTasks.push(newTask);
    this.#notifyObservers();
  }

  clearTasksInResycleBin() {
    this.#boardTasks = this.#boardTasks.filter(task => task.status !== 'resyclebin');
    this.#notifyObservers();
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  #notifyObservers() {
    this.#observers.forEach(observer => observer());
  }
}