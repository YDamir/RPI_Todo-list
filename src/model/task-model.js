import Observable from '../framework/observable.js';
import {generateId} from '../utils.js';
import {UpdateType, UserAction} from '../const.js';

export default class TasksModel extends Observable {
  #tasksApiService = null;
  #boardTasks = [];

  constructor({ tasksApiService }) {
    super();
    this.#tasksApiService = tasksApiService;
  }

  get tasks() {
    return this.#boardTasks;
  }

  async init() {
    try {
      const tasks = await this.#tasksApiService.tasks;
      this.#boardTasks = tasks;
    } catch (err) {
      this.#boardTasks = [];
    }

    this._notify(UpdateType.INIT);
  }

  async addTask(title) {
    const newTask = {
      title,
      status: 'backlog',
      id: generateId(),
    };

    try {
      const createdTask = await this.#tasksApiService.addTask(newTask);
      this.#boardTasks.push(createdTask);
      this._notify(UserAction.ADD_TASK, createdTask);
      return createdTask;
    } catch (err) {
      console.error('Ошибка при добавлении задачи на сервер:', err);
      throw err;
    }
  }

  async updateTask(taskId, newStatus) {
    const task = this.#boardTasks.find((task) => task.id === taskId);
  
    if (!task) {
      console.error(`Ошибка: задача с id ${taskId} не найдена`);
      return;
    }
  
    task.status = newStatus;
  
    try {
      const updatedTask = await this.#tasksApiService.updateTask(task);
      Object.assign(task, updatedTask);
      this._notify(UserAction.UPDATE_TASK, task);
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи на сервере:', err);
      throw err;
    }
  }

  async updateTaskOrder(taskId, targetTaskId) {
    const task = this.#boardTasks.find((task) => task.id === taskId);
    const targetTask = this.#boardTasks.find((task) => task.id === targetTaskId);
  
    if (task && targetTask) {
      this.#boardTasks.splice(this.#boardTasks.indexOf(task), 1);
      const targetIndex = this.#boardTasks.indexOf(targetTask);
      this.#boardTasks.splice(targetIndex, 0, task);
  
      try {
        await Promise.all(this.#boardTasks.map((updatedTask) => this.#tasksApiService.updateTask(updatedTask)));
        this._notify(UserAction.UPDATE_TASK_ORDER, this.#boardTasks);
      } catch (err) {
        console.error('Ошибка при обновлении порядка задач:', err);
        throw err;
      }
    }
  }
  
  deleteTask(taskId) {
    this.#boardTasks = this.#boardTasks.filter((task) => task.id !== taskId);
    this._notify(UserAction.DELETE_TASK, {id: taskId});
  }

  async clearBasketTasks() {
    const basketTasks = this.#boardTasks.filter((task) => task.status === 'resyclebin');

    try {
      await Promise.all(basketTasks.map((task) => this.#tasksApiService.deleteTask(task.id)));
      this.#boardTasks = this.#boardTasks.filter((task) => task.status !== 'resyclebin');
      this._notify(UserAction.DELETE_TASK, {status: 'resyclebin'});
    } catch (err) {
      console.error('Ошибка при очистке корзины задач на сервере:', err);
      throw err;
    }
  }

  hasBasketTasks() {
    return this.#boardTasks.some((task) => task.status === 'resyclebin');
  }
}