import { ListTasks } from "../../../usecases";
import { Controller } from "../../interfaces";
import {
  noContent,
  ok,
  serverError,
} from "../../presentations/api/httpResponses/httpResponses";

export class ListTasksController implements Controller {
  constructor(private readonly listTasks: ListTasks) {}

  async handle() {
    try {
      const tasks = await this.listTasks.list();

      if (tasks.length) {
        return ok(tasks);
      }

      return noContent();
    } catch (error: any) {
      return serverError(error);
    }
  }
}
