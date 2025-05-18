import {
  DbUpdateTask,
  LogErrorMongoRepository,
  TaskMongoRepository,
} from "../../dataSources";
import { UpdateTaskController } from "../controllers/task/updateTask";
import { LogErrorControllerDecorator } from "../decorators/logErrorControllerDecorator";
import { RequiredFieldsValidation } from "../validations/requiredFieldsValidation";

export const updateTaskControllerFactory = () => {
  const taskMongoRepository = new TaskMongoRepository();
  const dbUpdateTask = new DbUpdateTask(taskMongoRepository);
  const updateTaskController = new UpdateTaskController(
    dbUpdateTask,
    new RequiredFieldsValidation("id")
  );
  const logErrorMongoRepository = new LogErrorMongoRepository();
  return new LogErrorControllerDecorator(
    updateTaskController,
    logErrorMongoRepository
  );
};
