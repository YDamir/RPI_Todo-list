import {AbstractComponent} from '../framework/view/abstract-component.js';

function createClearButtonComponentTemplate() {
    return (
        `<button>x Очистить</button>`
    );
}

export default class ClearButtonComponent extends AbstractComponent {
    get template() {
        return createClearButtonComponentTemplate();
    }

    setClickHandler(callback) {
        this.element.addEventListener('click', callback);
    }

    enable() {
        this.element.disabled = false;
    }

    disable() {
        this.element.disabled = true;
    }    
}