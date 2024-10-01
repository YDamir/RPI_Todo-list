import {AbstractComponent} from '/src/framework/view/abstract-component.js';

function createNoTaskTemplate() {
    return `<p class="no-task">Перетащите карточку</p>`;
}

export default class NoTaskComponent extends AbstractComponent {
    get template() {
        return createNoTaskTemplate();
    }
}