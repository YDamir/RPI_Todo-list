import TasksListComponent from '/src/view/tasklist-component.js';
import TaskBoardComponent from '/src/view/taskboard-component.js';
import {render} from '/src/framework/render.js';
import {Status, StatusLabel} from '/src/const.js';
import ClearButtonComponent from '/src/view/clear-button-component.js';
import NoTaskComponent from '/src/view/no-task-component.js';
import TaskPresenter from '/src/presenter/task-presenter.js';
import {generateId} from '/src/utils.js';

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

  init() {
    this.#boardTasks = [...this.#tasksModel.tasks];
    this.#renderBoard();
  }

  handleAddNewTask(taskTitle) {
    const newTask = {
      id: generateId(),
      title: taskTitle,
      status: 'backlog',
    };

    this.#tasksModel.addTask(newTask);
    this.#handleModelChange();
  }

  #renderBoard() {
    render(this.#tasksBoardComponent, this.#boardContainer);
    this.#renderTaskList();
  }

  #renderTaskList() {
    const statuses = [Status.BACKLOG, Status.INPROGRESS, Status.COMPLETED, Status.RESYCLEBIN];
    
    statuses.forEach((status) => {
      const tasksListComponent = new TasksListComponent({status, statusLabel: StatusLabel[status],
        onTaskDrop: this.#handleTaskDrop.bind(this)});
      render(tasksListComponent, this.#tasksBoardComponent.element);

      if (status === Status.RESYCLEBIN) {
        this.#renderRecycleBinTasks(tasksListComponent);
      } else {
        this.#renderTasksList(status, tasksListComponent);
      }
    });
  }

  #handleTaskDrop(taskId, newStatus) {
    this.#tasksModel.updateTaskStatus(taskId, newStatus);
  }

  #renderTasksList(status, tasksListComponent) {
    const tasksForStatus = this.#boardTasks.filter((task) => task.status === status);
    
    if (tasksForStatus.length === 0) {
      this.#renderNoTask(tasksListComponent);
    } else {
      tasksForStatus.forEach((task) => this.#renderTask(task, tasksListComponent.element));
    }
  }

  #renderRecycleBinTasks(tasksListComponent) {
    const tasksInBin = this.#boardTasks.filter((task) => task.status === Status.RESYCLEBIN);

    if (tasksInBin.length === 0) {
      this.#renderNoTask(tasksListComponent);
    } else {
      tasksInBin.forEach((task) => this.#renderTask(task, tasksListComponent.element));
    }

    this.#renderClearButton(tasksListComponent);
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
    render(noTaskComponent, tasksListComponent.element);
  }

  #renderClearButton(tasksListComponent) {
    const clearButtonComponent = new ClearButtonComponent();
    render(clearButtonComponent, tasksListComponent.element);

    clearButtonComponent.element.addEventListener('click', this.#handleClearBin.bind(this));
  }

  #handleClearBin() {
    this.#tasksModel.clearTasksInResycleBin();
    this.#handleModelChange();
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