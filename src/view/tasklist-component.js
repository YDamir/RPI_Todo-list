import {AbstractComponent} from '/src/framework/view/abstract-component.js';

function createTaskListComponentTemplate(status, statusLabel) {
  return (
    `<section class="task ${status}">
        <h3>${statusLabel}</h3>
        <ul class="task-list"></ul>
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
    const container = this.element.querySelector('.task-list');
  
    container.addEventListener('dragover', (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    });
  
    container.addEventListener('drop', (event) => {
      event.preventDefault();

      const taskId = event.dataTransfer.getData('text/plain');
      const targetElement = event.target.closest('li');
      const targetTaskId = targetElement ? targetElement.dataset.taskId : null;
  
      onTaskDrop(taskId, this.status, targetTaskId);
    });
  }
}