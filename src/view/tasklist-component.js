import {createElement} from '/src/framework/render.js';

function createTaskListComponentTemplate() {
    return (
        `<section class="task backlog">
            <h3>Название блока</h3>
            
            <ul>
                    
            </ul>
        </section>`
    );
}

export default class TaskListComponent {
  getTemplate() {
    return createTaskListComponentTemplate();
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