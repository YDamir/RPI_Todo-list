import TasksListComponent from '/src/view/tasklist-component.js';
import TaskComponent from '/src/view/task-component.js';
import TaskBoardComponent from '/src/view/taskboard-component.js';
import {render} from '/src/framework/render.js';
import {Status, StatusLabel} from '/src/const.js';
import ClearButtonComponent from '/src/view/clear-button-component.js';
import NoTaskComponent from '/src/view/no-task-component.js';

export default class TasksBoardPresenter {
  #tasksBoardComponent = new TaskBoardComponent();

  #boardContainer = null;
  #tasksModel = null;
  #boardTasks = [];

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
  }

  init() {
    this.#boardTasks = [...this.#tasksModel.tasks];
    this.#renderBoard();
  }

  #renderBoard() {
    render(this.#tasksBoardComponent, this.#boardContainer);
    this.#renderTaskList();
  }

  #renderTaskList() {
    const statuses = [Status.BACKLOG, Status.INPROGRESS, Status.COMPLETED, Status.RESYCLEBIN];
    
    statuses.forEach((status) => {
      const tasksListComponent = new TasksListComponent({status, statusLabel: StatusLabel[status]});
      render(tasksListComponent, this.#tasksBoardComponent.element);

      const tasksForStatus = this.#boardTasks.filter((task) => task.status === status);
      if (tasksForStatus.length === 0) {
        this.#renderNoTask(tasksListComponent);
      } else {
        tasksForStatus.forEach((task) => this.#renderTask(task, tasksListComponent.element));
      }

      if (status === Status.RESYCLEBIN) {
        this.#renderClearButton(tasksListComponent);
      }
    });
  }

  #renderNoTask(tasksListComponent) {
    const noTaskComponent = new NoTaskComponent();
    render(noTaskComponent, tasksListComponent.element);
  }

  #renderClearButton(tasksListComponent) {
    const clearButtonComponent = new ClearButtonComponent();
    render(clearButtonComponent, tasksListComponent.element);
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent({task});
    render(taskComponent, container);
  }
}