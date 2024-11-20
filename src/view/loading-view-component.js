import {AbstractComponent} from '../framework/view/abstract-component.js';

export default class LoadingViewComponent extends AbstractComponent {
  get template() {
    return `<p class="loading">Загрузка...</p>`;
  }
}
