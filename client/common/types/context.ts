import { TPost } from "./post";

export interface TPostsContext {
  posts: TPost[];
  setPosts: (posts: TPost[]) => void;
  createPost: (post: TPost) => void;
  deletePost: (id: string) => void;
  updatePost: (post: TPost) => void;
  currentPage: number;
  incrementPage: () => void;
  decrementPage: () => void;
  setSearchQuery: (query: string) => void;
  setSortOrder: (order: string) => void;
}
