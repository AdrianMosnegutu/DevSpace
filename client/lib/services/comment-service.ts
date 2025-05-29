import { TComment, TCommentResponse } from "@/common";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000";
const COMMENTS_ENDPOINT = BACKEND_URL + "/api/comments";

function commentResponseToObject(comment: TCommentResponse): TComment {
  return { ...comment, publishedAt: new Date(comment.publishedAt) };
}

function commentResponsesToObjects(comments: TCommentResponse[]): TComment[] {
  if (!comments) {
    return [];
  }
  return comments.map((post) => commentResponseToObject(post));
}

export async function serverGetAllComments(): Promise<TComment[]> {
  const response = await axios.get(`${COMMENTS_ENDPOINT}`);
  return commentResponsesToObjects(response.data as TCommentResponse[]);
}

export async function serverCreateComment(values: {
  body: string;
  postId: string;
}): Promise<TComment> {
  const response = await axios.post(COMMENTS_ENDPOINT, values);
  return commentResponseToObject(response.data as TCommentResponse);
}

export async function serverUpdateComment(
  id: string,
  values: { body: string },
): Promise<TComment> {
  const response = await axios.put(`${COMMENTS_ENDPOINT}/${id}`, values);
  return commentResponseToObject(response.data as TCommentResponse);
}

export async function serverGetCommentsForPost(postId: string) {
  const response = await axios.get(`${COMMENTS_ENDPOINT}/post/${postId}`);
  return commentResponsesToObjects(response.data as TCommentResponse[]);
}

export async function serverDeleteComment(id: string) {
  await axios.delete(`${COMMENTS_ENDPOINT}/${id}`);
}

export async function serverVoteComment(id: string, value: number) {
  await axios.patch(`${COMMENTS_ENDPOINT}/${id}/vote`, value.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function serverGetCommentsOrderedLikesAscending(): Promise<
  TComment[]
> {
  const response = await axios.get(`${COMMENTS_ENDPOINT}?sort=upvotes`);
  return commentResponsesToObjects(response.data as TCommentResponse[]);
}

export async function serverGetCommentsOrderedLikesDescending(): Promise<
  TComment[]
> {
  const response = await axios.get(
    `${COMMENTS_ENDPOINT}?sort=upvotes&descending=true`,
  );
  return commentResponsesToObjects(response.data as TCommentResponse[]);
}

export async function serverGetCommentsOrderedDateAscending(): Promise<
  TComment[]
> {
  const response = await axios.get(
    `${COMMENTS_ENDPOINT}?sort=date&descending=true`,
  );
  return commentResponsesToObjects(response.data as TCommentResponse[]);
}

export async function serverGetCommentsOrderedDateDescending(): Promise<
  TComment[]
> {
  const response = await axios.get(`${COMMENTS_ENDPOINT}?sort=date`);
  return commentResponsesToObjects(response.data as TCommentResponse[]);
}
