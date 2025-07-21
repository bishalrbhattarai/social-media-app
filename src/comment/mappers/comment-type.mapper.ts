import { CommentType } from '../entities/comment.entity';
import { CommentDocument } from '../entities/comment.schema';

export function commentTypeMapper(document: CommentDocument): CommentType {
  return {
    id: String(document._id),
    postId: document.postId.toString(),
    authorId: document.authorId.toString(),
    authorName: document.authorName,
    content: document.content,
    parentCommentId: document.parentCommentId
      ? document.parentCommentId.toString()
      : null,
    parentContent: document.parentContent || '',
  };
}
