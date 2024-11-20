import Observable from '../framework/observable.js';

export default class TasksModel extends Observable {
  #tasksApiService = null;
  #boardTasks = [];

  constructor({ tasksApiService }) {
    super();
    this.#tasksApiService = tasksApiService;
  }

  async init() {
    try {
      const tasks = await this.#tasksApiService.tasks;
      this.#boardTasks = tasks;
      this._notify('INIT', tasks);
    } catch (err) {
      this.#boardTasks = [];
    }
  }

  async addTask(task) {
    try {
      const newTask = await this.#tasksApiService.addTask(task);
      this.#boardTasks.push(newTask);
      this._notify('ADD_TASK', newTask);
    } catch (err) {
      console.error('Ошибка добавления задачи:', err);
    }
  }

  async updateTask(task) {
    try {
      const updatedTask = await this.#tasksApiService.updateTask(task);
      const index = this.#boardTasks.findIndex((item) => item.id === task.id);
      this.#boardTasks[index] = updatedTask;
      this._notify('UPDATE_TASK', updatedTask);
    } catch (err) {
      console.error('Ошибка обновления задачи:', err);
    }
  }

  async deleteTask(id) {
    try {
      await this.#tasksApiService.deleteTask(id);
      this.#boardTasks = this.#boardTasks.filter((task) => task.id !== id);
      this._notify('DELETE_TASK', id);
    } catch (err) {
      console.error('Ошибка удаления задачи:', err);
    }
  }

  get tasks() {
    return this.#boardTasks;
  }
}
