import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bull';

@Injectable()
export class UpdateCommentService {
  constructor(
    @InjectQueue('comment')
    private readonly updateCommentQueue: Queue,
  ) {}

  async addJob(authorId: string, authorName: string, content: string,postId:string) {
    this.updateCommentQueue.add('update-comment', {
      authorId,
      authorName,
      content,
      postId
    });
  }
}
