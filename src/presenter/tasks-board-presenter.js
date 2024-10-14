import TasksListComponent from '/src/view/tasklist-component.js';
import TaskBoardComponent from '/src/view/taskboard-component.js';
import { render } from '/src/framework/render.js';
import { Status, StatusLabel } from '/src/const.js';
import ClearButtonComponent from '/src/view/clear-button-component.js';
import NoTaskComponent from '/src/view/no-task-component.js';
import TaskPresenter from '/src/presenter/task-presenter.js';
import { generateId } from '/src/utils.js'; // Функция для генерации ID

export default class TasksBoardPresenter {
  #tasksBoardComponent = new TaskBoardComponent();
  #boardContainer = null;
  #tasksModel = null;
  #boardTasks = [];
  #taskPresenters = new Map(); // Сохраняем все презентеры задач

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
    this.#tasksModel.addObserver(this.#handleModelChange.bind(this)); // Добавление наблюдателя
  }

  init() {
    this.#boardTasks = [...this.#tasksModel.tasks];
    this.#renderBoard();
  }

  // Метод для добавления новой задачи
  handleAddNewTask(taskTitle) {
    const newTask = {
      id: generateId(),
      title: taskTitle,
      status: 'backlog',
    };

    this.#tasksModel.addTask(newTask); // Добавляем задачу в модель
    this.#handleModelChange();
  }

  // Отрисовка всей доски задач
  #renderBoard() {
    render(this.#tasksBoardComponent, this.#boardContainer);
    this.#renderTaskList();
  }

  // Метод для рендеринга списков задач по статусам
  #renderTaskList() {
    const statuses = [Status.BACKLOG, Status.INPROGRESS, Status.COMPLETED, Status.RESYCLEBIN];
    
    statuses.forEach((status) => {
      const tasksListComponent = new TasksListComponent({status, statusLabel: StatusLabel[status]});
      render(tasksListComponent, this.#tasksBoardComponent.element);

      if (status === Status.RESYCLEBIN) {
        this.#renderRecycleBinTasks(tasksListComponent); // Специальный метод для корзины
      } else {
        this.#renderTasksList(status, tasksListComponent); // Общий метод для остальных статусов
      }
    });
  }

  // Метод для рендеринга задач по статусу
  #renderTasksList(status, tasksListComponent) {
    const tasksForStatus = this.#boardTasks.filter((task) => task.status === status);
    
    if (tasksForStatus.length === 0) {
      this.#renderNoTask(tasksListComponent);
    } else {
      tasksForStatus.forEach((task) => this.#renderTask(task, tasksListComponent.element));
    }
  }

  // Метод для рендеринга задач в корзине
  #renderRecycleBinTasks(tasksListComponent) {
    const tasksInBin = this.#boardTasks.filter((task) => task.status === Status.RESYCLEBIN);

    if (tasksInBin.length === 0) {
      this.#renderNoTask(tasksListComponent); // Если задач в корзине нет, рендерим заглушку
    } else {
      tasksInBin.forEach((task) => this.#renderTask(task, tasksListComponent.element)); // Отрисовываем каждую задачу
    }

    this.#renderClearButton(tasksListComponent); // Отрисовываем кнопку очистки
  }

  // Метод для рендеринга одной задачи с использованием TaskPresenter
  #renderTask(task, container) {
    // Создаем новый экземпляр TaskPresenter для каждой задачи
    const taskPresenter = new TaskPresenter(container, this.#handleModelChange);

    // Сохраняем презентер в карту
    this.#taskPresenters.set(task.id, taskPresenter);

    // Инициализируем презентер задачи
    taskPresenter.init(task);
  }

  // Очистка всех презентеров задач
  #clearTaskPresenters() {
    this.#taskPresenters.forEach((presenter) => presenter.destroy());
    this.#taskPresenters.clear();
  }

  // Отрисовка заглушки, если задач нет
  #renderNoTask(tasksListComponent) {
    const noTaskComponent = new NoTaskComponent();
    render(noTaskComponent, tasksListComponent.element);
  }

  // Отрисовка кнопки очистки для корзины
  #renderClearButton(tasksListComponent) {
    const clearButtonComponent = new ClearButtonComponent();
    render(clearButtonComponent, tasksListComponent.element);
    clearButtonComponent.element.addEventListener('click', this.#handleClearBin.bind(this));

    if (this.#boardTasks.some(task => task.status === Status.RESYCLEBIN)) {
      clearButtonComponent.enable();
    } else {
      clearButtonComponent.disable();
    }
  }

  handleAddNewTask(taskTitle) {
    const newTask = {
      id: generateId(), // Генерируем уникальный идентификатор
      title: taskTitle,  // Используем введённое название задачи
      status: 'backlog', // Новая задача всегда добавляется в "Бэклог"
    };
  
    this.#tasksModel.addTask(newTask); // Добавляем задачу в модель
    this.#handleModelChange(); // Перерисовываем доску с задачами
  }
  

  // Обработчик для кнопки очистки корзины
  #handleClearBin() {
    this.#tasksModel.clearTasksInResycleBin(); // Очистка задач в корзине
    this.#handleModelChange();
  }

  // Метод для обновления задач и перерисовки доски
  #handleModelChange() {
    this.#boardTasks = [...this.#tasksModel.tasks];
    this.#clearTaskPresenters(); // Очищаем все старые презентеры
    this.#clearBoard();
    this.#renderBoard();
  }

  // Очистка доски
  #clearBoard() {
    this.#tasksBoardComponent.element.innerHTML = '';
  }
}
