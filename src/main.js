import HeaderComponent from '/src/view/header-component.js';
import FormAddTaskComponent from '/src/view/form-add-task-component.js';
import TasksBoardPresenter from '/src/presenter/tasks-board-presenter.js';
import { render, RenderPosition } from '/src/framework/render.js';
import TasksModel from '/src/model/task-model.js';

// Контейнеры для элементов интерфейса
const bodyContainer = document.querySelector('body');
const formContainer = document.querySelector('.new-task');
const tasksBoardContainer = document.querySelector('.tasks');

// Модель задач
const tasksModel = new TasksModel();

// Презентер для управления доской с задачами
const tasksBoardPresenter = new TasksBoardPresenter({
  boardContainer: tasksBoardContainer,
  tasksModel: tasksModel,
});

// Инициализируем доску с задачами
tasksBoardPresenter.init();

// Обработчик для добавления новой задачи
const handleNewTaskSubmit = (taskTitle) => {
  tasksBoardPresenter.handleAddNewTask(taskTitle);
};

// Форма добавления задачи
const formAddTaskComponent = new FormAddTaskComponent({
  onSubmit: handleNewTaskSubmit,
});

// Рендерим форму добавления задачи
render(formAddTaskComponent, formContainer, RenderPosition.BEFOREEND);
