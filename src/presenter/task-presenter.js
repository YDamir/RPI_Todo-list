import TaskComponent from '/src/view/task-component.js';
import { render, remove } from '/src/framework/render.js';

export default class TaskPresenter {
  #taskContainer = null;
  #task = null;
  #taskComponent = null;
  #handleTaskChange = null;

  constructor(taskContainer, handleTaskChange) {
    this.#taskContainer = taskContainer;
    this.#handleTaskChange = handleTaskChange; // Обработчик изменений задачи
  }

  init(task) {
    this.#task = task;

    // Создаем компонент задачи
    this.#taskComponent = new TaskComponent({ task: this.#task });

    // Рендерим задачу в контейнер
    render(this.#taskComponent, this.#taskContainer);
  }

  // Метод для удаления задачи
  destroy() {
    remove(this.#taskComponent);
  }
}
