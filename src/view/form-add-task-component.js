import {AbstractComponent} from '../framework/view/abstract-component.js';

function createFormAddTaskComponentTemplate() {
  return (
    `<form class="new-task_form">
      <h2>Новая задача</h2>
      <input type="text" id="add-task" placeholder="Введите название задачи..." required>
      <button type="submit">+ Добавить</button>
    </form>`
  );
}

export default class FormAddTaskComponent extends AbstractComponent {
  #handleSubmit = null;

  constructor({ onSubmit }) {
    super();
    this.#handleSubmit = onSubmit;
    this.element.addEventListener('submit', this.#submitHandler);
  }

  get template() {
    return createFormAddTaskComponentTemplate();
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    const taskTitle = this.element.querySelector('#add-task').value.trim();

    if (!taskTitle) {
      return;
    }

    this.#handleSubmit(taskTitle);
    this.element.querySelector('#add-task').value = '';
  };
}