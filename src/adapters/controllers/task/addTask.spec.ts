import { Task } from "../../../entities/task";
import { AddTask } from "../../../usecases";
import { HttpRequest, Validation } from "../../interfaces";
import { AddTaskController } from "./addTask";

interface SutType {
  addTaskStub: AddTask;
  validationStub: Validation;
  sut: AddTaskController;
}

const makeAddTask = (): AddTask => {
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

  return new AddTaskStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(): Error | void {
      return;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutType => {
  const addTaskStub = makeAddTask();
  const validationStub = makeValidation();

  const sut = new AddTaskController(addTaskStub, validationStub);

  return {
    addTaskStub,
    validationStub,
    sut,
  };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    title: "any_title",
    description: "any_description",
    date: "30/06/2024",
  },
});

describe("AddTask Controller", () => {
  test("Deve chamar AddTask com valores corretos", async () => {
    const { sut, addTaskStub } = makeSut();

    const addSpy = jest.spyOn(addTaskStub, "add");

    await sut.handle(makeFakeRequest());

    expect(addSpy).toHaveBeenCalledWith({
      title: "any_title",
      description: "any_description",
      date: "30/06/2024",
    });
  });
});
