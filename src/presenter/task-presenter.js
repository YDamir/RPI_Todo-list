import TaskComponent from '/src/view/task-component.js';
import {render, remove} from '/src/framework/render.js';

export default class TaskPresenter {
  #taskContainer = null;
  #task = null;
  #taskComponent = null;
  #handleTaskChange = null;

  constructor(taskContainer, handleTaskChange) {
    this.#taskContainer = taskContainer;
    this.#handleTaskChange = handleTaskChange;
  }

  init(task) {
    this.#task = task;
    this.#taskComponent = new TaskComponent({ task: this.#task });

    render(this.#taskComponent, this.#taskContainer);
  }

  destroy() {
    remove(this.#taskComponent);
  }
}