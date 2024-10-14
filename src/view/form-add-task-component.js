import { AbstractComponent } from '/src/framework/view/abstract-component.js';

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
    this.element.addEventListener('submit', this.#submitHandler); // Добавляем обработчик события
  }

  get template() {
    return createFormAddTaskComponentTemplate();
  }

  // Обработчик отправки формы
  #submitHandler = (evt) => {
    evt.preventDefault();
    const taskTitle = this.element.querySelector('#add-task').value.trim(); // Получаем значение из поля ввода
    if (!taskTitle) {
      return; // Если поле пустое, ничего не делаем
    }
    this.#handleSubmit(taskTitle); // Вызываем переданный callback для создания новой задачи
    this.element.querySelector('#add-task').value = ''; // Очищаем поле ввода после добавления задачи
  };
}
