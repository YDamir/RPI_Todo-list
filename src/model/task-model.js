import { tasks } from '/src/mock/task.js';

export default class TasksModel {
 #boardtasks = tasks;

 get tasks() {
   return this.#boardtasks;
 }
}
