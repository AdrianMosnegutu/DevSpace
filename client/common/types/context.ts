import { TPost } from "./post";

export interface TPostsContext {
  posts: TPost[];
  setPosts: React.Dispatch<React.SetStateAction<TPost[]>>;
  createPost: (post: TPost) => void;
  updatePost: (updatedPost: TPost) => void;
  deletePost: (id: string) => void;
  currentPage: number;
  incrementPage: () => void;
  decrementPage: () => void;
}
