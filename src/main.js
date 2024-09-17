import HeaderComponent from '/src/view/header-component.js';
import FormAddTaskComponent from '/src/view/form-add-task-component.js';
import {render, RenderPosition} from '/src/framework/render.js';
import TaskListComponent from '/src/view/tasklist-component.js';
import TaskComponent from '/src/view/task-component.js';

const bodyContainer = document.querySelector('body');
const formContainer = document.querySelector('.new-task');
const taskListContainer = document.querySelector('.tasks')
const taskConstainer = document.querySelector('tasks');

render(new HeaderComponent(), bodyContainer, RenderPosition.BEFOREBEGIN);
render(new FormAddTaskComponent(), formContainer);

render(new TaskListComponent(), taskListContainer);
render(new TaskListComponent(), taskListContainer);
render(new TaskListComponent(), taskListContainer);
render(new TaskListComponent(), taskListContainer);

render(new TaskComponent(), taskConstainer);