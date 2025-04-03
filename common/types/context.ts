import { TPost } from "./post";

export interface TPostsContext {
  posts: TPost[];
  createPost: (post: TPost) => void;
  updatePost: (updatedPost: TPost) => void;
  deletePost: (id: string) => void;
}
