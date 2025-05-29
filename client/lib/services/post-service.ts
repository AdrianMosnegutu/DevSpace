import { TPost, TPostResponse } from "@/common";
import axios from "@/lib/axios";
import { TPostSchema } from "../form-schemas/post-schema";
import { serverGetUserById } from "./user-service";

const BACKEND_URL = "http://localhost:5000";
const POSTS_ENDPOINT = BACKEND_URL + "/api/posts";

async function postResponseToObject(post: TPostResponse): Promise<TPost> {
  console.log('Post response:', post);
  console.log('Post userId:', post.userId);
  
  // Ensure the user ID is a valid GUID
  const userId = post.userId.replace(/[^0-9a-fA-F-]/g, '');
  
  // Fetch user data using the userId
  const user = await serverGetUserById(userId);
  console.log('Fetched user:', user);
  
  return { 
    ...post, 
    publishedAt: new Date(post.publishedAt),
    userId: userId,
    user: {
      username: user.username
    }
  };
}

async function postResponsesToObjects(posts: TPostResponse[]): Promise<TPost[]> {
  if (!posts) {
    return [];
  }
  console.log('Posts response:', posts);
  console.log('Posts userIds:', posts.map(p => p.userId));
  return Promise.all(posts.map((post) => postResponseToObject(post)));
}

export async function serverGetPost(id: string): Promise<TPost> {
  const response = await axios.get(`${POSTS_ENDPOINT}/${id}`);
  return postResponseToObject(response.data as TPostResponse);
}

export async function serverGetAllPosts(): Promise<TPost[]> {
  const response = await axios.get(`${POSTS_ENDPOINT}`);
  console.log('Server response:', response.data);
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
