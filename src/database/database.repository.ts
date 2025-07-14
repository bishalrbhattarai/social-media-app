import { FilterQuery, Model, SortOrder, Types } from 'mongoose';

interface FindOptions {
  first?: number;
  after?: string;
  sort?: Record<string, SortOrder>;
}

export abstract class DatabaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
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
