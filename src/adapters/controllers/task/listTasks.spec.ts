import { Task } from "../../../entities/task";
import { ListTasks } from "../../../usecases";
import {
  noContent,
  ok,
  serverError,
} from "../../presentations/api/httpResponses/httpResponses";
import { ListTasksController } from "./listTasks";

interface SutType {
  sut: ListTasksController;
  listTasksStub: ListTasks;
}

const makeListTasks = (): ListTasks => {
  class ListTasksStub implements ListTasks {
    async list(): Promise<Task[]> {
      return Promise.resolve(makeFakeTasks());
    }
  }

  return new ListTasksStub();
};

const makeSut = (): SutType => {
  const listTasksStub = makeListTasks();
  const sut = new ListTasksController(listTasksStub);
  return {
    sut,
    listTasksStub,
  };
};

const makeFakeTasks = (): Task[] => {
  return [
    {
      id: "any_id",
      title: "any_title",
      description: "any_description",
      date: "any_date",
    },
    {
      id: "other_id",
      title: "other_title",
      description: "other_description",
      date: "other_date",
    },
  ];
};

describe("ListTasks Controller", () => {
  test("Should return 204 if the list is empty", async () => {
    const { sut, listTasksStub } = makeSut();
    jest.spyOn(listTasksStub, "list").mockReturnValueOnce(Promise.resolve([]));

    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual(noContent());
  });

  test("Should return 200 with a list of tasks", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle();

    expect(httpResponse).toEqual(ok(makeFakeTasks()));
  });

  test("You should check that the functionality that lists tasks is called correctly.", async () => {
    const { sut, listTasksStub } = makeSut();

    const listSpy = jest.spyOn(listTasksStub, "list");
    await sut.handle();

    expect(listSpy).toHaveBeenCalled();
  });

  test("Should return 500 if any error occurs", async () => {
    const { sut, listTasksStub } = makeSut();

    jest
      .spyOn(listTasksStub, "list")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const httpResponse = await sut.handle();

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
