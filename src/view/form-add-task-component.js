import {AbstractComponent} from '/src/framework/view/abstract-component.js';

function createFormAddTaskComponentTemplate() {
    return (
        `<form class="new-task_form">
            <h2>Новая задача</h2>
            <input type="text" placeholder="Название задачи...">
            <button>+ Добавить</button>
        </form>`
    );
}

export default class FormAddTaskComponent extends AbstractComponent {
  get template() {
    return createFormAddTaskComponentTemplate();
  }
}