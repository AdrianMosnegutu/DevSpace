import { cookies } from 'next/headers';

const BACKEND_URL = 'http://localhost:5000';

export async function serverApiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function serverApiPost<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function serverApiPatch<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'PATCH',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function serverApiDelete(endpoint: string): Promise<void> {
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'DELETE',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
} 