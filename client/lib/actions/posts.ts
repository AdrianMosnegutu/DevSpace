'use server';

import { TPost, TPostResponse } from "@/common";
import { getUserById } from "./users";

const BACKEND_URL = 'http://localhost:5000';

async function postResponseToObject(post: TPostResponse): Promise<TPost> {
  // Ensure the user ID is a valid GUID
  const userId = post.userId.replace(/[^0-9a-fA-F-]/g, '');
  
  // Fetch user data using the userId
  const user = await getUserById(userId);
  
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
  return Promise.all(posts.map((post) => postResponseToObject(post)));
}

export async function getPosts(): Promise<TPost[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/posts`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return postResponsesToObjects(data as TPostResponse[]);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
} 