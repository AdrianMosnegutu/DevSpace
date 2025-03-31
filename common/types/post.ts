export interface TPostBase {
  title: string;
  body: string;
  date: Date;
  tags: string[];
  likes: number;
}

export interface TPost extends TPostBase {
  id: string;
}
