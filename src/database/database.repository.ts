import { FilterQuery, Model } from 'mongoose';

export abstract class DatabaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }
}
