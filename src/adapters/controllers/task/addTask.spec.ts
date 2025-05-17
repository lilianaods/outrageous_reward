import { Task } from "../../../entities/task";
import { AddTask } from "../../../usecases";
import { Validation } from "../../interfaces";
import { AddTaskController } from "./addTask";

class AddTaskStub implements AddTask {
  async add(): Promise<Task> {
    return Promise.resolve({
      id: "any_id",
      title: "any_title",
      description: "any_description",
      date: "30/06/2024",
    });
  }
}

class ValidationStub implements Validation {
  validate(): Error | void {
    return;
  }
}

describe("AddTask Controller", () => {
  test("Deve chamar AddTask com valores corretos", async () => {
    const httpRequest = {
      body: {
        title: "any_title",
        description: "any_description",
        date: "30/06/2024",
      },
    };

    const addTaskStub = new AddTaskStub();
    const addTaskController = new AddTaskController(
      addTaskStub,
      new ValidationStub()
    );

    const addSpy = jest.spyOn(addTaskStub, "add");

    await addTaskController.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith({
      title: "any_title",
      description: "any_description",
      date: "30/06/2024",
    });
  });
});
