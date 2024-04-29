import {
  DbAddTask,
  MongoManager,
  TaskMongoRepository,
} from "../../../dataSources";
import { addTaskValidationCompositeFactory } from "../../factories";
import env from "../../presentations/api/config/env";
import { AddTaskController } from "./addTask";

describe("AddTask Controller", () => {
  test("Deve chamar AddTask com valores corretos", async () => {
    const httpRequest = {
      body: {
        title: "any_title",
        description: "any_description",
        date: "30/06/2024",
      },
    };
    await MongoManager.getInstance().connect(env.mongoUrl);
    const taskMongoRepository = new TaskMongoRepository();
    const dbAddTask = new DbAddTask(taskMongoRepository);
    const addTaskController = new AddTaskController(
      dbAddTask,
      addTaskValidationCompositeFactory()
    );

    const httpResponse = await addTaskController.handle(httpRequest);
    console.log(httpResponse);

    expect(httpResponse.statusCode).toBe(201);
    expect(httpResponse.body.title).toBe("any_title");
    expect(httpResponse.body.description).toBe("any_description");
    expect(httpResponse.body.date).toBe("30/06/2024");
  });
});
