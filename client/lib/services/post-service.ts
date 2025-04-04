import axios from "axios";
import { TPost, TPostResponse } from "common";
import { TPostSchema } from "../form-schemas/post-schema";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const POSTS_ENDPOINT = BACKEND_URL + "/api/posts";

function postResponseToObject(post: TPostResponse): TPost {
  return { ...post, date: new Date(post.date) };
}

function postResponsesToObjects(posts: TPostResponse[]): TPost[] {
  return posts.map((post) => postResponseToObject(post));
}

export async function serverGetAllPosts(): Promise<TPost[]> {
  const response = await axios.get(`${POSTS_ENDPOINT}/all`);
  return postResponsesToObjects(response.data as TPostResponse[]);
}

export async function serverGetOldestPost(): Promise<TPost> {
  const response = await axios.get(`${POSTS_ENDPOINT}/oldest`);
  return postResponseToObject(response.data as TPostResponse);
}

export async function serverGetMostLikedPost(): Promise<TPost> {
  const response = await axios.get(`${POSTS_ENDPOINT}/mostLiked`);
  return postResponseToObject(response.data as TPostResponse);
}

export async function serverGetLeastLikedPost(): Promise<TPost> {
  const response = await axios.get(`${POSTS_ENDPOINT}/leastLiked`);
  return postResponseToObject(response.data as TPostResponse);
}

export async function serverGetNewestPost(): Promise<TPost> {
  const response = await axios.get(`${POSTS_ENDPOINT}/newest`);
  return postResponseToObject(response.data as TPostResponse);
}

export async function serverGetPostsOnPage(page: number): Promise<TPost[]> {
  const response = await axios.get(`${POSTS_ENDPOINT}?page=${page}`);
  return postResponsesToObjects(response.data as TPostResponse[]);
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

export async function serverLikePost(id: string) {
  await axios.put(`${POSTS_ENDPOINT}/${id}/like`);
}

export async function serverUnlikePost(id: string) {
  await axios.delete(`${POSTS_ENDPOINT}/${id}/like`);
}

export async function serverGetPostsWithTags(tags: string[]): Promise<TPost[]> {
  const response = await axios.get(
    `${POSTS_ENDPOINT}/filter?tags=${tags.join(",")}`,
  );

  return postResponsesToObjects(response.data as TPostResponse[]);
}

export async function serverGetPostsOrderedLikesAscending(
  page: number,
): Promise<TPost[]> {
  const response = await axios.get(
    `${POSTS_ENDPOINT}/order/likes?page=${page}`,
  );
  return postResponsesToObjects(response.data as TPostResponse[]);
}

export async function serverGetPostsOrderedLikesDescending(
  page: number,
): Promise<TPost[]> {
  const response = await axios.get(
    `${POSTS_ENDPOINT}/order/likes?page=${page}&descending=true`,
  );
  return postResponsesToObjects(response.data as TPostResponse[]);
}

export async function serverGetPostsOrderedDateAscending(
  page: number,
): Promise<TPost[]> {
  const response = await axios.get(`${POSTS_ENDPOINT}/order/date?page=${page}`);
  return postResponsesToObjects(response.data as TPostResponse[]);
}

export async function serverGetPostsOrderedDateDescending(
  page: number,
): Promise<TPost[]> {
  const response = await axios.get(
    `${POSTS_ENDPOINT}/order/date?page=${page}&descending=true`,
  );
  return postResponsesToObjects(response.data as TPostResponse[]);
}
