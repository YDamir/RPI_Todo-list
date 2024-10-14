import { tasks } from '/src/mock/task.js';

export default class TasksModel {
  #boardTasks = tasks; // Приватное поле для хранения задач

  get tasks() {
    return this.#boardTasks; // Возвращаем массив задач
  }

  // Функция для добавления задачи в модель
  addTask(newTask) {
    this.#boardTasks.push(newTask);
  }

  // Функция для очистки задач в корзине
  clearTasksInResycleBin() {
    this.#boardTasks = this.#boardTasks.filter(task => task.status !== 'resyclebin');
  }

  // Наблюдатели (например, для обновлений модели)
  #observers = [];

  addObserver(observer) {
    this.#observers.push(observer);
  }

  #notifyObservers() {
    this.#observers.forEach(observer => observer());
  }
}
