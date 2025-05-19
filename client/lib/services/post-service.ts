import axios from "axios";
import { TPost, TPostResponse } from "@/common";
import { TPostSchema } from "../form-schemas/post-schema";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const POSTS_ENDPOINT = BACKEND_URL + "/api/posts";

function postResponseToObject(post: TPostResponse): TPost {
  return { ...post, publishedAt: new Date(post.publishedAt) };
}

function postResponsesToObjects(posts: TPostResponse[]): TPost[] {
  if (!posts) {
    return [];
  }
  return posts.map((post) => postResponseToObject(post));
}

export async function serverGetAllPosts(): Promise<TPost[]> {
  const response = await axios.get(`${POSTS_ENDPOINT}`);
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

export async function serverVotePost(id: string, value: number) {
  await axios.patch(`${POSTS_ENDPOINT}/${id}/vote`, value.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function serverGetPostsWithTags(tags: string[]): Promise<TPost[]> {
  const response = await axios.get(
    `${POSTS_ENDPOINT}/filter?tags=${tags.join(",")}`,
  );

  return postResponsesToObjects(response.data as TPostResponse[]);
}

export async function serverGetPostsOrderedLikesAscending(): Promise<TPost[]> {
  const response = await axios.get(`${POSTS_ENDPOINT}?sort=upvotes`);
  return postResponsesToObjects(response.data as TPostResponse[]);
}

export async function serverGetPostsOrderedLikesDescending(): Promise<TPost[]> {
  const response = await axios.get(
    `${POSTS_ENDPOINT}?sort=upvotes&descending=true`,
  );
  return postResponsesToObjects(response.data as TPostResponse[]);
}

export async function serverGetPostsOrderedDateAscending(): Promise<TPost[]> {
  const response = await axios.get(
    `${POSTS_ENDPOINT}?sort=date&descending=true`,
  );
  return postResponsesToObjects(response.data as TPostResponse[]);
}

export async function serverGetPostsOrderedDateDescending(): Promise<TPost[]> {
  const response = await axios.get(`${POSTS_ENDPOINT}?sort=date`);
  return postResponsesToObjects(response.data as TPostResponse[]);
}
