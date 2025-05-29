import axios from "@/lib/axios";

const BACKEND_URL = "http://localhost:5000";
const USERS_ENDPOINT = BACKEND_URL + "/api/users";

export interface TUser {
  id: string;
  username: string;
  email: string;
}

export async function serverGetUserById(id: string): Promise<TUser> {
  // Ensure the ID is a valid GUID
  const guid = id.replace(/[^0-9a-fA-F-]/g, '');
  const response = await axios.get(`${USERS_ENDPOINT}/${guid}`);
  return response.data as TUser;
} 