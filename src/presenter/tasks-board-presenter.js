import TasksListComponent from '../view/tasklist-component.js';
import TaskBoardComponent from '../view/taskboard-component.js';
import {render} from '../framework/render.js';
import {Status, StatusLabel} from '../const.js';
import ClearButtonComponent from '../view/clear-button-component.js';
import NoTaskComponent from '../view/no-task-component.js';
import TaskPresenter from '../presenter/task-presenter.js';

export default class TasksBoardPresenter {
  #tasksBoardComponent = new TaskBoardComponent();
  #boardContainer = null;
  #tasksModel = null;
  #boardTasks = [];
  #taskPresenters = new Map();

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
    this.#tasksModel.addObserver(this.#handleModelChange.bind(this));
  }

  async init() {
    await this.#tasksModel.init(); 
    this.#clearBoard();
    this.#renderBoard();
  }
  
  handleAddNewTask(taskTitle) {
    this.#tasksModel.addTask(taskTitle);
    this.#handleModelChange();
  }

  #renderBoard() {
    render(this.#tasksBoardComponent, this.#boardContainer);
    this.#renderTaskList();
  }

  #renderTaskList() {
    const statuses = [Status.BACKLOG, Status.INPROGRESS, Status.COMPLETED, Status.RESYCLEBIN];
    
    statuses.forEach((status) => {
      const tasksListComponent = new TasksListComponent({
        status, 
        statusLabel: StatusLabel[status],
        onTaskDrop: this.#handleTaskDrop.bind(this)
      });
  
      render(tasksListComponent, this.#tasksBoardComponent.element);
  
      if (status === Status.RESYCLEBIN) {
        this.#renderRecycleBinTasks(tasksListComponent);
      } else {
        this.#renderTasksList(status, tasksListComponent);
      }
    });
  }
  
  async #handleTaskDrop(taskId, newStatus, targetTaskId = null) {
    try {
      const task = this.#boardTasks.find(task => task.id === taskId);
      if (!task) {
        console.error(`Ошибка: задача с id ${taskId} не найдена`);
        return;
      }
  
      const isSameStatus = task.status === newStatus;
  
      if (isSameStatus && targetTaskId) {
        await this.#tasksModel.updateTaskOrder(taskId, targetTaskId);
      } else {
        await this.#tasksModel.updateTask(taskId, newStatus);
  
        if (targetTaskId) {
          await this.#tasksModel.updateTaskOrder(taskId, targetTaskId);
        }
      }
  
      this.#handleModelChange();
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи:', err);
    }
  }
  
  #renderTasksList(status, tasksListComponent) {
    const tasksForStatus = this.#boardTasks.filter((task) => task.status === status);
    const taskListContainer = tasksListComponent.element.querySelector('.task-list');

    if (tasksForStatus.length === 0) {
      this.#renderNoTask(tasksListComponent);
    } else {
      tasksForStatus.forEach((task) => this.#renderTask(task, taskListContainer));
    }
  
    if (status === Status.RESYCLEBIN) {
      this.#renderClearButton(taskListContainer);
    }
  }

  #renderRecycleBinTasks(tasksListComponent) {
    const tasksInBin = this.#boardTasks.filter((task) => task.status === Status.RESYCLEBIN);
    const taskListContainer = tasksListComponent.element.querySelector('.task-list');
  
    if (tasksInBin.length === 0) {
      this.#renderNoTask(tasksListComponent);
    } else {
      tasksInBin.forEach((task) => this.#renderTask(task, taskListContainer));
    }
  
    this.#renderClearButton(taskListContainer);
  }
  
  #renderTask(task, container) {
    const taskPresenter = new TaskPresenter(container, this.#handleModelChange);
    this.#taskPresenters.set(task.id, taskPresenter);
    taskPresenter.init(task);
  }
  
  #clearTaskPresenters() {
    this.#taskPresenters.forEach((presenter) => presenter.destroy());
    this.#taskPresenters.clear();
  }

  #renderNoTask(tasksListComponent) {
    const noTaskComponent = new NoTaskComponent();
    const taskListContainer = tasksListComponent.element.querySelector('.task-list');
    render(noTaskComponent, taskListContainer);
  }
  
  #renderClearButton(taskListContainer) {
    const clearButtonComponent = new ClearButtonComponent();
    render(clearButtonComponent, taskListContainer);

    const clearButtonElement = clearButtonComponent.element;

    if (this.#boardTasks.filter((task) => task.status === Status.RESYCLEBIN).length === 0) {
        clearButtonElement.disabled = true;
        clearButtonElement.classList.add('inactive');
    }

    clearButtonElement.addEventListener('click', (event) => {
        if (clearButtonElement.disabled) {
            event.preventDefault();
            return;
        }

        this.#handleClearBin();
    });
  }  
  
  async #handleClearBin() {
    try {
      await this.#tasksModel.clearBasketTasks();
    } catch (err) {
      console.error('Ошибка при очистке корзины задач:', err);
    }
    this.#handleModelChange();
  }

  async createTask() {
    const taskTitle = document.querySelector('#add-task').value.trim();
    if (!taskTitle) {
      return;
    }
    try {
      await this.#tasksModel.addTask(taskTitle);
      document.querySelector('#add-task').value = '';
    } catch (err) {
      console.error('Ошибка при создании задачи', err);
    }
  }

  #handleModelChange() {
    this.#boardTasks = [...this.#tasksModel.tasks];
    this.#clearTaskPresenters();
    this.#clearBoard();
    this.#renderBoard();
  }

  #clearBoard() {
    this.#tasksBoardComponent.element.innerHTML = '';
  }
}