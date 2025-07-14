import { PostType } from '../entities/post.entity';
import { PostDocument } from '../entities/post.schema';

export function toPostType(post: PostDocument): PostType {
  return {
    ...post,
    id: post._id as string,
    description: post.description,
    authorId: post.authorId.toString(),
    authorName: post.authorName,
    image: post.image,
    likes: post.likes,
    commentsCount: post.commentsCount,
    recentComments: post.recentComments.map((comment) => ({
      content: comment.content,
      authorId: comment.authorId.toString(),
      authorName: comment.authorName,
    })),
  };
}
