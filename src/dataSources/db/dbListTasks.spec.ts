import { Task } from "../../entities/task";
import { ListTasksRepository } from "../../usecases";
import { DbListTasks } from "./dbListTasks";

interface SutType {
  sut: DbListTasks;
  listTasksRepositoryStub: ListTasksRepository;
}

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

const makeListTasksRepository = (): ListTasksRepository => {
  class ListTasksRepositoryStub implements ListTasksRepository {
    async list(): Promise<Task[]> {
      return Promise.resolve(makeFakeTasks());
    }
  }

  return new ListTasksRepositoryStub();
};

const makeSut = (): SutType => {
  const listTasksRepositoryStub = makeListTasksRepository();

  const sut = new DbListTasks(listTasksRepositoryStub);

  return {
    sut,
    listTasksRepositoryStub,
  };
};

describe("DbListTasks", () => {
  test("It should call ListTasksRepository", async () => {
    const { sut, listTasksRepositoryStub } = makeSut();

    const listSpy = jest.spyOn(listTasksRepositoryStub, "list");

    await sut.list();

    expect(listSpy).toHaveBeenCalled();
  });

  test("It should return a list of tasks on success", async () => {
    const { sut } = makeSut();

    const tasks = await sut.list();

    expect(tasks).toEqual(makeFakeTasks());
  });

  test("It should throw an error if ListTasksRepository throws an error", async () => {
    const { sut, listTasksRepositoryStub } = makeSut();

    jest
      .spyOn(listTasksRepositoryStub, "list")
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.list();

    await expect(promise).rejects.toThrow();
  });
});
