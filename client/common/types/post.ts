export interface TPostBase {
  title: string;
  body: string;
  postTags: string[];
  upvotes: number;
  userId: string;
  user: {
    username: string;
  };
}

export interface TPost extends TPostBase {
  id: string;
  publishedAt: Date;
}

export interface TPostResponse extends TPostBase {
  id: string;
  publishedAt: string;
}
