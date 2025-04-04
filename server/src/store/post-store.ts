import { itemsPerPage, mockPosts, TPost } from "common";
import { v4 as uuidv4 } from "uuid";

export default class PostsStore {
  #posts: TPost[] = mockPosts;

  getAllPosts(): TPost[] {
    return this.#posts;
  }

  getPostsOnPage(page: number): TPost[] {
    return this.#posts.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  }

  getPost(id: string): TPost | undefined {
    return this.#posts.find((post) => post.id === id);
  }

  getNewestPost(): TPost | undefined {
    let newestPost: TPost | undefined;
    this.#posts.forEach((post) => {
      if (!newestPost || post.date > newestPost.date) {
        newestPost = post;
      }
    });
    return newestPost;
  }

  getOldestPost(): TPost | undefined {
    let oldestPost: TPost | undefined;
    this.#posts.forEach((post) => {
      if (!oldestPost || post.date < oldestPost.date) {
        oldestPost = post;
      }
    });
    return oldestPost;
  }

  getMostLikedPost(): TPost | undefined {
    let mostLikedPost: TPost | undefined;
    this.#posts.forEach((post) => {
      if (!mostLikedPost || post.likes > mostLikedPost.likes) {
        mostLikedPost = post;
      }
    });
    return mostLikedPost;
  }

  getLeastLikedPost(): TPost | undefined {
    let leastLikedPost: TPost | undefined;
    this.#posts.forEach((post) => {
      if (!leastLikedPost || post.likes < leastLikedPost.likes) {
        leastLikedPost = post;
      }
    });
    return leastLikedPost;
  }

  getPostsWithTags(tags: string[]): TPost[] {
    return this.#posts.filter((post) =>
      post.tags.some((tag) => tags.includes(tag)),
    );
  }

  getPostsOrderedByDate(page: number, descending: boolean): TPost[] {
    return this.#posts
      .sort((a, b) => {
        const order = descending ? -1 : 1;
        return order * (b.date.getTime() - a.date.getTime());
      })
      .slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  }

  getPostsOrderedByLikes(page: number, descending: boolean): TPost[] {
    return this.#posts
      .sort((a, b) => {
        const order = descending ? -1 : 1;
        return order * (a.likes - b.likes);
      })
      .slice(page * itemsPerPage, (page + 1) * itemsPerPage);
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
    this.#posts = [newPost, ...this.#posts];
    return newPost;
  }

  addLike(id: string) {
    this.#posts = this.#posts.map((post) =>
      post.id === id ? ({ ...post, likes: post.likes + 1 } as TPost) : post,
    );
  }

  removeLike(id: string) {
    this.#posts = this.#posts.map((post) =>
      post.id === id ? ({ ...post, likes: post.likes - 1 } as TPost) : post,
    );
  }

  updatePost(id: string, title: string, body: string, tags: string[]): TPost {
    let postToBeUpdated: TPost = this.#posts.find((post) => post.id === id) as TPost;

    postToBeUpdated = Object.assign(postToBeUpdated, {
      title,
      body,
      tags,
      date: new Date(),
    });

    this.#posts.map((post) => (post.id === id ? postToBeUpdated : post));
    return postToBeUpdated;
  }

  deletePost(id: string) {
    this.#posts = this.#posts.filter((post) => post.id !== id);
  }
}
