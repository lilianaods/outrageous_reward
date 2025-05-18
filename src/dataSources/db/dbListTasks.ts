import { Controller } from "../../adapters/interfaces";
import { ListTasks, ListTasksRepository } from "../../usecases";

export class DbListTasks implements ListTasksRepository {
  constructor(private readonly listTasks: ListTasksRepository) {}

  async list() {
    return await this.listTasks.list();
  }
}
