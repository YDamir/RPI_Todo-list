import {AbstractComponent} from '../framework/view/abstract-component.js';

function createNoTaskTemplate() {
    return `<p class="no-task">Перетащите карточку</p>`;
}

export default class NoTaskComponent extends AbstractComponent {
    get template() {
        return createNoTaskTemplate();
    }

    constructor() {
        super();
        
        this.element.addEventListener('dragover', (event) => {
            event.preventDefault();
        });
        this.element.addEventListener('drop', (event) => {
            event.preventDefault();
        });
    }
}