import { UpdateTask } from "../../../usecases";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from "../../interfaces";

import {
  badRequest,
  noContent,
  serverError,
} from "../../presentations/api/httpResponses/httpResponses";

export class UpdateTaskController implements Controller {
  constructor(
    private readonly updateTask: UpdateTask,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id, title, description, date } = httpRequest.body;

      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      await this.updateTask.update({
        id,
        title,
        description,
        date,
      });

      return noContent();
    } catch (error: any) {
      return serverError(error);
    }
  }
}
