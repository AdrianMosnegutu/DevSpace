import { TUser } from "@/common";
import axios from "@/lib/axios";
import { serverApiGet } from "../server-api";

const BACKEND_URL = "http://localhost:5000";
const USERS_ENDPOINT = BACKEND_URL + "/api/users";

export async function serverGetUserById(id: string): Promise<TUser> {
  const response = await serverApiGet<TUser>(`/api/users/${id}`);
  return response;
}

export async function serverGetCurrentUser(): Promise<TUser> {
  const response = await axios.get(`${USERS_ENDPOINT}/me`);
  return response.data;
}

export async function serverUpdateUser(id: string, values: Partial<TUser>): Promise<TUser> {
  const response = await axios.patch(`${USERS_ENDPOINT}/${id}`, values);
  return response.data;
} 