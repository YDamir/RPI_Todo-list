import {AbstractComponent} from '/src/framework/view/abstract-component.js';

function createClearButtonComponentTemplate() {
    return (
        `<button>x Очистить</button>`
    );
}

export default class ClearButtonComponent extends AbstractComponent {
    get template() {
        return createClearButtonComponentTemplate();
    }
}