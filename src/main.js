import HeaderComponent from '/src/view/header-component.js';
import FormAddTaskComponent from '/src/view/form-add-task-component.js';
import TasksBoardPresenter from '/src/presenter/tasks-board-presenter.js';
import { render, RenderPosition} from '/src/framework/render.js';
import TasksModel from '/src/model/task-model.js';

const bodyContainer = document.querySelector('body');
const formContainer = document.querySelector('.new-task');
const tasksBoardContainer = document.querySelector('.tasks');

const headerComponent = new HeaderComponent();
render(headerComponent, bodyContainer, RenderPosition.AFTERBEGIN);

const tasksModel = new TasksModel();

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