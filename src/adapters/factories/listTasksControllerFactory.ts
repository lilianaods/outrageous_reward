import {
  LogErrorMongoRepository,
  TaskMongoRepository,
} from "../../dataSources";
import { DbListTasks } from "../../dataSources/db/dbListTasks";

import { ListTasksController } from "../controllers/task/listTasks";
import { LogErrorControllerDecorator } from "../decorators/logErrorControllerDecorator";
import { Controller } from "../interfaces/controller";

export const listTasksControllerFactory = (): Controller => {
  const taskMongoRepository = new TaskMongoRepository();
  const dbListTasks = new DbListTasks(taskMongoRepository);
  const listTasksController = new ListTasksController(dbListTasks);
  const logMongoRepository = new LogErrorMongoRepository();

  return new LogErrorControllerDecorator(
    listTasksController,
    logMongoRepository
  );
};
