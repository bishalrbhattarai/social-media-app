import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bull';
import { Types } from 'mongoose';

@Injectable()
export class UpdateCommentService {
  constructor(
    @InjectQueue('comment')
    private readonly updateCommentQueue: Queue,
  ) {}

  async addCommentJob(
    authorId: string,
    authorName: string,
    content: string,
    postId: string,
    commentId: string,
  ) {
    this.updateCommentQueue.add('update-comment', {
      authorId,
      authorName,
      content,
      postId,
      commentId,
    });
  }

  async removeCommentJob(
    authorId: Types.ObjectId,
    authorName: string,
    content: string,
    commentId: string,
    postId: string,
  ) {
    this.updateCommentQueue.add('remove-comment', {
      authorId: String(authorId),
      authorName,
      content,
      commentId,
      postId,
    });
  }
}
