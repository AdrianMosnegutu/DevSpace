export interface TCommentBase {
  body: string;
  upvotes: number;
}

export interface TComment extends TCommentBase {
  id: string;
  postId: string;
  publishedAt: Date;
}

export interface TCommentResponse extends TCommentBase {
  id: string;
  postId: string;
  publishedAt: string;
}
