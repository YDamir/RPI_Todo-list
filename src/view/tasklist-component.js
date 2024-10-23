import {AbstractComponent} from '/src/framework/view/abstract-component.js';

function createTaskListComponentTemplate(status, statusLabel) {
  return (
    `<section class="task ${status}">
        <h3>${statusLabel}</h3>
        <ul></ul>
    </section>`
  );
}

export default class TasksListComponent extends AbstractComponent {
  constructor({status = '', statusLabel = '', onTaskDrop} = {}) {
    super();
    this.status = status;
    this.statusLabel = statusLabel;
    this.#setDropHandler(onTaskDrop);
  }

  get template() {
    return createTaskListComponentTemplate(this.status, this.statusLabel);
  }

  #setDropHandler(onTaskDrop) {
    const container = this.element;

    container.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    container.addEventListener('drop', (event) => {
      event.preventDefault();
      const taskId = event.dataTransfer.getData('text/plain');
      onTaskDrop(taskId, this.status);
    });
  }
}