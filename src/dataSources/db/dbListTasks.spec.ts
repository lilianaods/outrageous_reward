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
});
