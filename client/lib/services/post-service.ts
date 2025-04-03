import axios from "axios";
import { TPostResponse } from "common";
import { TPostSchema } from "../form-schemas/post-schema";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const POSTS_ENDPOINT = BACKEND_URL + "/api/posts";

export async function fetchPosts(): Promise<TPostResponse[]> {
  const response = await axios.get(POSTS_ENDPOINT);
  return response.data as TPostResponse[];
}

export async function createPost(values: TPostSchema): Promise<TPostResponse> {
  const response = await axios.post(`${BACKEND_URL}/api/posts`, values);
  return response.data as TPostResponse;
}

export async function editPost(
  id: string,
  values: TPostSchema,
): Promise<TPostResponse> {
  const response = await axios.patch(`${BACKEND_URL}/api/posts/${id}`, values);
  return response.data as TPostResponse;
}

export async function deletePost(id: string) {
  await axios.delete(`${POSTS_ENDPOINT}/${id}`);
}

export async function likePost(id: string): Promise<TPostResponse> {
  const response = await axios.post(`${BACKEND_URL}/api/posts/like/${id}`);
  return response.data as TPostResponse;
}

export async function unlikePost(id: string): Promise<TPostResponse> {
  const response = await axios.post(`${BACKEND_URL}/api/posts/unlike/${id}`);
  return response.data as TPostResponse;
}
