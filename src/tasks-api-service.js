import ApiService from './framework/view/api-service.js';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export default class TasksApiService extends ApiService {
  get tasks() {
    return this._load({ url: 'tasks' })
    .then(ApiService.parseResponse);
  }

  async addTask(task) {
    const response = await this._load({ 
      url: 'tasks', 
      method: Method.POST, 
      body: JSON.stringify(task),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return ApiService.parseResponse(response);
  }

  async updateTask(task) {
    const response = await this._load({
      url: `tasks/${task.id}`,
      method: Method.PUT,
      body: JSON.stringify(task),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
  
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  
    return await ApiService.parseResponse(response);
  }
  

  async updateTaskOrder(tasks) {
    try {
      for (const task of tasks) {
        await this.updateTask(task);
      }
    } catch (err) {
      console.error('Ошибка при обновлении порядка задач:', err);
      throw err;
    }
  }
  

  async deleteTask(taskId) {
    await this._load({ 
      url: `tasks/${taskId}`, 
      method: Method.DELETE, 
    });
  }
}