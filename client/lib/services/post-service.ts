import axios from "axios";
import { TPost, TPostResponse } from "common";
import { TPostSchema } from "../form-schemas/post-schema";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const POSTS_ENDPOINT = BACKEND_URL + "/api/posts";

function postResponseToObject(post: TPostResponse): TPost {
  return { ...post, date: new Date(post.date) };
}

export async function serverGetPosts(): Promise<TPost[]> {
  const response = await axios.get(POSTS_ENDPOINT);
  return (response.data as TPostResponse[]).map((post) =>
    postResponseToObject(post),
  );
}

export async function serverCreatePost(values: TPostSchema): Promise<TPost> {
  const response = await axios.post(POSTS_ENDPOINT, values);
  return postResponseToObject(response.data as TPostResponse);
}

export async function serverUpdatePost(
  id: string,
  values: TPostSchema,
): Promise<TPost> {
  const response = await axios.patch(`${POSTS_ENDPOINT}/${id}`, values);
  return postResponseToObject(response.data as TPostResponse);
}

export async function serverDeletePost(id: string) {
  await axios.delete(`${POSTS_ENDPOINT}/${id}`);
}

export async function serverLikePost(id: string): Promise<TPost> {
  const response = await axios.post(`${POSTS_ENDPOINT}/like/${id}`);
  return postResponseToObject(response.data as TPostResponse);
}

export async function serverUnlikePost(id: string): Promise<TPost> {
  const response = await axios.post(`${POSTS_ENDPOINT}/unlike/${id}`);
  return postResponseToObject(response.data as TPostResponse);
}
