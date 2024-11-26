import HeaderComponent from './view/header-component.js';
import FormAddTaskComponent from './view/form-add-task-component.js';
import TasksBoardPresenter from './presenter/tasks-board-presenter.js';
import {render, RenderPosition, remove} from './framework/render.js';
import TasksModel from './model/task-model.js';
import LoadingViewComponent from './view/loading-view-component.js';
import TasksApiService from './tasks-api-service.js';

const END_POINT = 'https://673d7d2d0118dbfe86076c52.mockapi.io';
const bodyContainer = document.querySelector('body');
const formContainer = document.querySelector('.new-task');
const tasksBoardContainer = document.querySelector('.tasks');

const tasksModel = new TasksModel({
  tasksApiService: new TasksApiService(END_POINT)
});

const headerComponent = new HeaderComponent();
render(headerComponent, bodyContainer, RenderPosition.AFTERBEGIN);

const tasksBoardPresenter = new TasksBoardPresenter({
  boardContainer: tasksBoardContainer,
  tasksModel: tasksModel,
});

tasksBoardPresenter.init();

const handleNewTaskSubmit = (taskTitle) => {
  tasksBoardPresenter.handleAddNewTask(taskTitle);
};

const formAddTaskComponent = new FormAddTaskComponent({
  onSubmit: handleNewTaskSubmit,
});

render(formAddTaskComponent, formContainer, RenderPosition.BEFOREEND);

const loadingComponent = new LoadingViewComponent();
render(loadingComponent, tasksBoardContainer);
tasksModel.init().then(() => {
  remove(loadingComponent);
  tasksBoardPresenter.init();
});