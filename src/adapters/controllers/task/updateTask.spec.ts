import { UpdateTask } from "../../../usecases";
import { HttpRequest, Validation } from "../../interfaces";
import {
  badRequest,
  noContent,
  serverError,
} from "../../presentations/api/httpResponses/httpResponses";
import { UpdateTaskController } from "./updateTask";

interface SutType {
  sut: UpdateTaskController;
  updateTaskStub: UpdateTask;
  validationStub: Validation;
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(): Error | void {
      return;
    }
  }
  return new ValidationStub();
};

const makeUpdateTask = (): UpdateTask => {
  class UpdateTaskStub implements UpdateTask {
    async update(): Promise<Error | void> {
      return Promise.resolve();
    }
  }
  return new UpdateTaskStub();
};

const makeSut = (): SutType => {
  const updateTaskStub = makeUpdateTask();
  const validationStub = makeValidation();
  const sut = new UpdateTaskController(updateTaskStub, validationStub);

  return {
    updateTaskStub,
    validationStub,
    sut,
  };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    id: "any_id",
    title: "any_title",
    description: "any_description",
    date: "30/06/2024",
  },
});

describe("UpdateTaskController", () => {
  it("It should return 204 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(noContent());
  });

  it("It should return 500 if an error is thrown", async () => {
    const { sut, updateTaskStub } = makeSut();

    jest.spyOn(updateTaskStub, "update").mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("It should return 400 if validation fails", async () => {
    const { sut, validationStub } = makeSut();

    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error());

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  it("It should call UpdateTask with the right arguments when the request is not complete", async () => {
    const { sut, updateTaskStub } = makeSut();
    const updateSpy = jest.spyOn(updateTaskStub, "update");
    const httpRequest: HttpRequest = {
      body: {
        id: "valid_id",
        title: "new_title",
      },
    };

    await sut.handle(httpRequest);

    expect(updateSpy).toHaveBeenCalledWith({
      id: "valid_id",
      title: "new_title",
    });
  });

  it("It should call UpdateTask with the right arguments when the request is complete", async () => {
    const { sut, updateTaskStub } = makeSut();
    const updateSpy = jest.spyOn(updateTaskStub, "update");
    const httpRequest: HttpRequest = {
      body: {
        id: "valid_id",
        title: "new_title",
        description: "new_description",
        date: "new_date",
      },
    };

    await sut.handle(httpRequest);

    expect(updateSpy).toHaveBeenCalledWith({
      id: "valid_id",
      title: "new_title",
      description: "new_description",
      date: "new_date",
    });
  });
});
