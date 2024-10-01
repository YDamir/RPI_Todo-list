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
  constructor({status = '', statusLabel = ''} = {}) {
    super();
    this.status = status;
    this.statusLabel = statusLabel;
  }

  get template() {
    return createTaskListComponentTemplate(this.status, this.statusLabel);
  }
}