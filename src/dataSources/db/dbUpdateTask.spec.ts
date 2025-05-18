import { Task } from "../../entities/task";
import { UpdateTaskRepository } from "../../usecases";
import { DbUpdateTask } from "./dbUpdateTask";

interface SutType {
  sut: DbUpdateTask;
  updateTaskRepositoryStub: UpdateTaskRepository;
}

const makeFakeTask = (): Task => {
  return {
    id: "any_id",
    title: "any_title",
    description: "any_description",
    date: "any_date",
  };
};

const makeUpdateTaskRepository = (): UpdateTaskRepository => {
  class UpdateTaskRepositoryStub implements UpdateTaskRepository {
    async update(): Promise<Error | void> {
      return Promise.resolve();
    }
  }

  return new UpdateTaskRepositoryStub();
};

const makeSut = (): SutType => {
  const updateTaskRepositoryStub = makeUpdateTaskRepository();

  const sut = new DbUpdateTask(updateTaskRepositoryStub);

  return {
    sut,
    updateTaskRepositoryStub: updateTaskRepositoryStub,
  };
};

describe("DbListTasks", () => {
  test("It should call UpdateTasksRepository", async () => {
    const { sut, updateTaskRepositoryStub } = makeSut();

    const listSpy = jest.spyOn(updateTaskRepositoryStub, "update");

    await sut.update(makeFakeTask());

    expect(listSpy).toHaveBeenCalledWith(makeFakeTask());
  });

  test("It should thrown an exception if the repository throws an exception", async () => {
    const { sut, updateTaskRepositoryStub } = makeSut();

    jest
      .spyOn(updateTaskRepositoryStub, "update")
      .mockRejectedValueOnce(new Error());

    const promise = await sut.update(makeFakeTask());

    await expect(promise).rejects.toThrow();
  });
});
