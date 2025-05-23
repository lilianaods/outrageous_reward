import {
  UpdateTask,
  UpdateTaskModel,
  UpdateTaskRepository,
} from "../../usecases";

export class DbUpdateTask implements UpdateTask {
  constructor(private readonly updateTaskRepository: UpdateTaskRepository) {}

  async update(taskData: UpdateTaskModel): Promise<Error | void> {
    return await this.updateTaskRepository.update(taskData);
  }
}
