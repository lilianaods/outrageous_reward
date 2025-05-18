import { ObjectId } from "mongodb";
import {
  InvalidParamError,
  NotFoundError,
} from "../../../adapters/presentations/api/errors";
import { UpdateTaskModel } from "../../../usecases";
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

  test("It should update a task", async () => {
    const { sut } = makeSut();
    const task = await sut.add({
      title: "old_title",
      description: "old_description",
      date: "old_date",
    });

    const updateData: UpdateTaskModel = {
      id: task.id,
      title: "new_title",
      description: "new_description",
      date: "new_date",
    };

    await sut.update(updateData);

    const updatedTask = await client
      .getCollection("tasks")
      .findOne({ _id: new ObjectId(task.id) });

    expect(updatedTask).toBeTruthy();
    expect(updatedTask?.title).toBe("new_title");
    expect(updatedTask?.description).toBe("new_description");
    expect(updatedTask?.date).toBe("new_date");
  });

  test("It should return InvalidParamError if the task id is not valid", async () => {
    const { sut } = makeSut();
    const updateData: UpdateTaskModel = {
      id: "invalid_id",
      title: "new_title",
      description: "new_description",
      date: "new_date",
    };

    const error = await sut.update(updateData);

    expect(error).toEqual(new InvalidParamError("invalid_id"));
  });

  test("It should return NotFoundError if no task is found for update", async () => {
    const { sut } = makeSut();
    const updateData: UpdateTaskModel = {
      id: new ObjectId().toHexString(),
      title: "new_title",
      description: "new_description",
      date: "new_date",
    };

    const error = await sut.update(updateData);

    expect(error).toEqual(new NotFoundError("task"));
  });
});
