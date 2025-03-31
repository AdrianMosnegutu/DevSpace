import { mockPosts, TPost } from "common";
import { v4 as uuidv4 } from "uuid";

export default class PostsStore {
  #posts: TPost[] = mockPosts;

  getAllPosts(): TPost[] {
    return this.#posts;
  }

  getPost(id: string): TPost | undefined {
    return this.#posts.find((post) => post.id === id);
  }

  getPostsWithTags(tags: string[]): TPost[] {
    return this.#posts.filter((post) =>
      post.tags.some((tag) => tags.includes(tag)),
    );
  }

  getPostsOrderedByDate(descending: boolean): TPost[] {
    return this.#posts.slice().sort((a, b) => {
      const order = descending ? -1 : 1;
      return order * (a.date.getTime() - b.date.getTime());
    });
  }

  getPostsOrderedByLikes(descending: boolean): TPost[] {
    return this.#posts.slice().sort((a, b) => {
      const order = descending ? -1 : 1;
      return order * (a.likes - b.likes);
    });
  }

  addPost(title: string, body: string, tags: string[]): TPost {
    const newPost: TPost = {
      id: uuidv4(),
      title,
      body,
      date: new Date(),
      tags,
      likes: 0,
    };
    this.#posts.push(newPost);
    return newPost;
  }

  updatePost(
    id: string,
    title: string,
    body: string,
    tags: string[],
  ): TPost | undefined {
    let postToBeUpdated = this.#posts.find((post) => post.id === id);

    if (postToBeUpdated === undefined) {
      return undefined;
    }

    postToBeUpdated = Object.assign(postToBeUpdated, {
      title,
      body,
      tags,
      time: new Date(),
    });

    this.#posts.map((post) => (post.id === id ? postToBeUpdated : post));
    return postToBeUpdated;
  }

  deletePost(id: string) {
    this.#posts = this.#posts.filter((post) => post.id !== id);
  }
}
