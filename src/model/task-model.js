import { tasks } from '/src/mock/task.js';

export default class TasksModel {
 boardtasks = tasks;

 getTasks() {
   return this.boardtasks;
 }
}
