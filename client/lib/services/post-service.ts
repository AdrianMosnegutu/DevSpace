import axios, { AxiosResponse } from "axios";
import { TPostResponse } from "common";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const POSTS_ENDPOINT = BACKEND_URL + "/api/posts";

export async function fetchPosts(): Promise<TPostResponse[]> {
  const response = await axios.get(POSTS_ENDPOINT);
  return response.data;
}

export async function deletePost(id: string): Promise<AxiosResponse<unknown, unknown>> {
  return await axios.delete(`${POSTS_ENDPOINT}/${id}`);
}
