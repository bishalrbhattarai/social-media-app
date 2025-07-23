import {
  FilterQuery,
  Model,
  PipelineStage,
  ProjectionFields,
  SortOrder,
  Types,
  UpdateQuery,
} from 'mongoose';

interface FindOptions {
  first?: number;
  after?: string;
  sort?: Record<string, SortOrder>;
}

export abstract class DatabaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options = { upsert: true, new: true },
  ) {
    return this.model.findByIdAndUpdate(filter, update, options);
  }


  async aggregate(pipeline: PipelineStage[]): Promise<any[]> {
    return this.model.aggregate(pipeline).exec();
  }

  async updateOneByFilter(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options = { upsert: true, new: true },
  ) {
    return this.model.findOneAndUpdate(filter, update, options);
  }

  async findOne(
    filter: FilterQuery<T>,
    projection: ProjectionFields<T> = {},
  ): Promise<T | null> {
    return await this.model.findOne(filter, projection).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async delete(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter).exec();
  }

  async deleteMany(filter: FilterQuery<T>) {
    return this.model.deleteMany(filter).exec();
  }

  async find(
    filter: FilterQuery<T> = {},
    { first = 10, after, sort = { _id: -1 } }: FindOptions = {},
  ): Promise<T[]> {
    const query: FilterQuery<T> = { ...filter };

    if (after) query._id = { $lt: new Types.ObjectId(after) };
    return this.model.find(query).sort(sort).limit(first).exec();
  }
}
