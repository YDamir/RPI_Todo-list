import {createElement} from '/src/framework/render.js';

function createTaskListComponentTemplate(status, statusLabel) {
  return (
    `<section class="task ${status}">
        <h3>${statusLabel}</h3>
        <ul></ul>
    </section>`
  );
}

export default class TasksListComponent {
  constructor({status = '', statusLabel = ''} = {}) {
    this.status = status;
    this.statusLabel = statusLabel;
  }

  getTemplate() {
    return createTaskListComponentTemplate(this.status, this.statusLabel);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}