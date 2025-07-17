import {InjectQueue} from '@nestjs/bull';
import {Injectable} from '@nestjs/common';
import {Queue} from 'bull';

@Injectable()
export class DeletePostJobService {
  constructor(
    @InjectQueue('post')
    private readonly deletePostQueue: Queue,
  ) {}

  async addJob(postId: string) {
    console.log("Adding job to delete post with ID:", postId);
    await this.deletePostQueue.add('delete-post', {
      postId,
    });
  }
}