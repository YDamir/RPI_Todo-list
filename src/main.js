import HeaderComponent from '/src/view/header-component.js';
import FormAddTaskComponent from '/src/view/form-add-task-component.js';
import TasksBoardPresenter from '/src/presenter/tasks-board-presenter.js';
import { render, RenderPosition, remove} from '/src/framework/render.js';
import TasksModel from '/src/model/task-model.js';
import LoadingViewComponent from './view/loading-view-component.js';
import TasksApiService from '../src/tasks-api-service.js';


const bodyContainer = document.querySelector('body');
const formContainer = document.querySelector('.new-task');
const tasksBoardContainer = document.querySelector('.tasks');

const tasksApiService = new TasksApiService('https://673d7d2d0118dbfe86076c52.mockapi.io');


const headerComponent = new HeaderComponent();
render(headerComponent, bodyContainer, RenderPosition.AFTERBEGIN);

const tasksModel = new TasksModel({
  tasksApiService: tasksApiService,
});

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