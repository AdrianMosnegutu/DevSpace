'use server';

import { TUser } from "@/common";

const BACKEND_URL = 'http://localhost:5000';

export async function getUserById(id: string): Promise<TUser> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/users/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
} 