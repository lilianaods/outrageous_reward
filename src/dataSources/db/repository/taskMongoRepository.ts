import { ObjectId } from "mongodb";
import {
  InvalidParamError,
  NotFoundError,
} from "../../../adapters/presentations/api/errors";
import { Task } from "../../../entities/task";
import {
  AddTaskModel,
  AddTaskRepository,
  DeleteTaskModel,
  DeleteTaskRepository,
  ListTasksRepository,
  UpdateTaskModel,
  UpdateTaskRepository,
} from "../../../usecases";
import { MongoManager } from "../../config/mongoManager";

export class TaskMongoRepository
implements
    AddTaskRepository,
    DeleteTaskRepository,
    ListTasksRepository,
    UpdateTaskRepository
{
  async add(taskData: AddTaskModel): Promise<Task> {
    const taskCollection = MongoManager.getInstance().getCollection("tasks");
    const { insertedId } = await taskCollection.insertOne(taskData);
    const taskById = await taskCollection.findOne({ _id: insertedId });
    if (!taskById) throw new Error("Task not found");

    const task: Task = {
      id: taskById._id.toHexString(),
      title: taskById.title,
      description: taskById.description,
      date: taskById.date,
    };
    return task;
  }

  async delete(taskData: DeleteTaskModel): Promise<void | Error> {
    const taskCollection = MongoManager.getInstance().getCollection("tasks");

    if (!ObjectId.isValid(taskData.id)) {
      return new InvalidParamError(taskData.id);
    }
    const { deletedCount } = await taskCollection.deleteOne({
      _id: new ObjectId(taskData.id),
    });
    if (!deletedCount) return new NotFoundError("task");
  }

  async list(): Promise<Task[]> {
    const taskCollection = MongoManager.getInstance().getCollection("tasks");

    const tasks = await taskCollection.find().toArray();

    return tasks.map((task) => ({
      id: task._id.toHexString(),
      title: task.title,
      description: task.description,
      date: task.date,
    }));
  }

  async update(taskData: UpdateTaskModel): Promise<Error | void> {
    const taskCollection = MongoManager.getInstance().getCollection("tasks");

    if (!ObjectId.isValid(taskData.id)) {
      return new InvalidParamError(taskData.id);
    }

    const updateFields: any = {};
    if (taskData.title !== undefined) {
      updateFields.title = taskData.title;
    }
    if (taskData.description !== undefined) {
      updateFields.description = taskData.description;
    }
    if (taskData.date !== undefined) {
      updateFields.date = taskData.date;
    }

    const { modifiedCount } = await taskCollection.updateOne(
      { _id: new ObjectId(taskData.id) },
      { $set: updateFields }
    );

    if (modifiedCount === 0) {
      return new NotFoundError("task");
    }
  }
}
