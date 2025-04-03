export interface TPostBase {
  title: string;
  body: string;
  tags: string[];
  likes: number;
}

export interface TPost extends TPostBase {
  id: string;
  date: Date;
}

export interface TPostResponse extends TPostBase {
  id: string;
  date: string;
}
