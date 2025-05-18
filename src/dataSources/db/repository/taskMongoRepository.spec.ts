import { MongoManager } from "../../config/mongoManager";
import { TaskMongoRepository } from "./taskMongoRepository";

interface SutType {
  sut: TaskMongoRepository;
}

const makeSut = (): SutType => {
  const sut = new TaskMongoRepository();
  return {
    sut,
  };
};

describe("TaskMongoRepository", () => {
  const client = MongoManager.getInstance();
  beforeAll(async () => {
    await client.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await client.disconnect();
  });

  test("It should return task on success case", async () => {
    const { sut } = makeSut();

    await sut.add({
      title: "any_title",
      description: "any_description",
      date: "any_date",
    });
    const tasks = await sut.list();

    expect(tasks[0].id).toBeTruthy();
    expect(tasks.length).toBe(1);
  });
});
