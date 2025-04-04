import axios, { AxiosError, AxiosResponse } from "axios";
import { itemsPerPage, mockPosts, TPostResponse } from "common";

const PORT = process.env.PORT || 4000;
const ENDPOINT = `http://localhost:${PORT}/api/posts`;

describe("/api/posts", () => {
  describe("GET", () => {
    describe("/all", () => {
      let response: AxiosResponse<any, any>;

      beforeAll(async () => {
        response = await axios.get(`${ENDPOINT}/all`);
      });

      test("response status is 200", () => {
        expect(response.status).toBe(200);
      });

      test("received an array", () => {
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.status).toBe(200);
      });

      test("received an array of post responses", () => {
        (response.data as Array<TPostResponse>).every((item) =>
          expect(item).toMatchObject<TPostResponse>({
            id: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            tags: expect.any(Array),
            date: expect.any(String),
            likes: expect.any(Number),
          }),
        );
      });

      test(`posts array should be of length ${mockPosts.length}`, () => {
        expect((response.data as Array<TPostResponse>).length).toBe(
          mockPosts.length,
        );
      });

      test("initial posts are the same as the mock posts", () => {
        (response.data as Array<TPostResponse>).every((post, index) =>
          expect(post).toEqual({
            ...mockPosts[index],
            date: mockPosts[index].date.toISOString(),
          }),
        );
      });
    });

    describe("?page=...", () => {
      let response: AxiosResponse<any, any>;

      beforeAll(async () => {
        response = await axios.get(`${ENDPOINT}?page=0`);
      });

      test("response status is 200", () => {
        expect(response.status).toBe(200);
      });

      test("response status is 400 when a page isn't provided", async () => {
        try {
          await axios.get(`${ENDPOINT}`);
          expect(false);
        } catch (error) {
          if (error instanceof AxiosError) {
            expect(error.status).toBe(400);
          }
        }
      });

      test("received an array", () => {
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.status).toBe(200);
      });

      test("received an array of post responses", () => {
        (response.data as Array<TPostResponse>).every((item) =>
          expect(item).toMatchObject<TPostResponse>({
            id: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            tags: expect.any(Array),
            date: expect.any(String),
            likes: expect.any(Number),
          }),
        );
      });

      test(`full page should be of length ${itemsPerPage}`, () => {
        expect((response.data as Array<TPostResponse>).length).toBe(
          itemsPerPage,
        );
      });

      test(`posts on the first page should be the first ${itemsPerPage} from mockPosts`, () => {
        (response.data as Array<TPostResponse>).every((post, index) =>
          expect(post).toEqual({
            ...mockPosts[index],
            date: mockPosts[index].date.toISOString(),
          }),
        );
      });

      test(`posts on the second page should be the next ${itemsPerPage} from mockPosts`, async () => {
        response = await axios.get(`${ENDPOINT}?page=1`);
        (response.data as Array<TPostResponse>).every((post, index) =>
          expect(post).toEqual({
            ...mockPosts[index + itemsPerPage],
            date: mockPosts[index + itemsPerPage].date.toISOString(),
          }),
        );
      });
    });

    describe("/newest", () => {
      let response: AxiosResponse<any, any>;

      beforeAll(async () => {
        response = await axios.get(`${ENDPOINT}/newest`);
      });

      test("response status is 200", () => {
        expect(response.status).toBe(200);
      });

      test("response satisfies the post response object", () => {
        expect(response.data).toMatchObject<TPostResponse>({
          id: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          tags: expect.any(Array),
          date: expect.any(String),
          likes: expect.any(Number),
        });
      });

      test("the post is the newest in the list", async () => {
        const postsResponse = await axios.get(`${ENDPOINT}/all`);
        const posts = postsResponse.data as TPostResponse[];

        let newestPost: TPostResponse | undefined = undefined;

        posts.forEach((post) => {
          if (!newestPost) {
            newestPost = post;
          } else {
            const newestDate = new Date(newestPost.date);
            const date = new Date(post.date);

            if (!newestPost || newestDate < date) {
              newestPost = post;
            }
          }
        });

        expect(newestPost).toBeDefined();
        expect(response.data).toEqual(newestPost);
      });
    });

    describe("/oldest", () => {
      let response: AxiosResponse<any, any>;

      beforeAll(async () => {
        response = await axios.get(`${ENDPOINT}/oldest`);
      });

      test("response status is 200", () => {
        expect(response.status).toBe(200);
      });

      test("response satisfies the post response object", () => {
        expect(response.data).toMatchObject<TPostResponse>({
          id: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          tags: expect.any(Array),
          date: expect.any(String),
          likes: expect.any(Number),
        });
      });

      test("the post is the oldest in the list", async () => {
        const postsResponse = await axios.get(`${ENDPOINT}/all`);
        const posts = postsResponse.data as TPostResponse[];

        let oldestPost: TPostResponse | undefined = undefined;

        posts.forEach((post) => {
          if (!oldestPost) {
            oldestPost = post;
          } else {
            const newestDate = new Date(oldestPost.date);
            const date = new Date(post.date);

            if (!oldestPost || newestDate > date) {
              oldestPost = post;
            }
          }
        });

        expect(oldestPost).toBeDefined();
        expect(response.data).toEqual(oldestPost);
      });
    });

    describe("/mostLiked", () => {
      let response: AxiosResponse<any, any>;

      beforeAll(async () => {
        response = await axios.get(`${ENDPOINT}/mostLiked`);
      });

      test("response status is 200", () => {
        expect(response.status).toBe(200);
      });

      test("response satisfies the post response object", () => {
        expect(response.data).toMatchObject<TPostResponse>({
          id: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          tags: expect.any(Array),
          date: expect.any(String),
          likes: expect.any(Number),
        });
      });

      test("the post is the most liked in the list", async () => {
        const postsResponse = await axios.get(`${ENDPOINT}/all`);
        const posts = postsResponse.data as TPostResponse[];

        let mostLikedPost: TPostResponse | undefined = undefined;

        posts.forEach((post) => {
          if (!mostLikedPost) {
            mostLikedPost = post;
          } else {
            if (!mostLikedPost || post.likes > mostLikedPost.likes) {
              mostLikedPost = post;
            }
          }
        });

        expect(mostLikedPost).toBeDefined();
        expect(response.data).toEqual(mostLikedPost);
      });
    });

    describe("/leastLiked", () => {
      let response: AxiosResponse<any, any>;

      beforeAll(async () => {
        response = await axios.get(`${ENDPOINT}/leastLiked`);
      });

      test("response status is 200", () => {
        expect(response.status).toBe(200);
      });

      test("response satisfies the post response object", () => {
        expect(response.data).toMatchObject<TPostResponse>({
          id: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          tags: expect.any(Array),
          date: expect.any(String),
          likes: expect.any(Number),
        });
      });

      test("the post is the least liked in the list", async () => {
        const postsResponse = await axios.get(`${ENDPOINT}/all`);
        const posts = postsResponse.data as TPostResponse[];

        let leastLikedPost: TPostResponse | undefined = undefined;

        posts.forEach((post) => {
          if (!leastLikedPost) {
            leastLikedPost = post;
          } else {
            if (!leastLikedPost || post.likes < leastLikedPost.likes) {
              leastLikedPost = post;
            }
          }
        });

        expect(leastLikedPost).toBeDefined();
        expect(response.data).toEqual(leastLikedPost);
      });
    });

    describe("/filter", () => {
      test("response status is 400 when no tags are provided", async () => {
        try {
          await axios.get(`${ENDPOINT}/filter`);
          expect(true).toBe(false);
        } catch (error) {
          if (error instanceof AxiosError) {
            expect(error.status).toBe(400);
          }
        }
      });

      test("response status is 200 when tags are provided", async () => {
        try {
          const response = await axios.get(`${ENDPOINT}/filter?tags=test`);
          expect(response.status).toBe(200);
        } catch (error) {
          expect(false);
        }
      });

      test("responds with all posts containing the tags", async () => {
        const tags = ["career", "python"];

        const allPostsResponse = await axios.get(`${ENDPOINT}/all`);
        const filteredPostResponse = await axios.get(
          `${ENDPOINT}/filter?tags=${tags.join(",")}`,
        );

        const filteredPosts = (allPostsResponse.data as TPostResponse[]).filter(
          (post) => post.tags.some((tag) => tags.includes(tag)),
        );

        (filteredPostResponse.data as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(filteredPosts[index]),
        );
      });
    });

    describe("/order/date", () => {
      test("response status is 400 when a page isn't provided", async () => {
        try {
          await axios.get(`${ENDPOINT}/order/date`);
          expect(true).toBe(false);
        } catch (error) {
          if (error instanceof AxiosError) {
            expect(error.status).toBe(400);
          }
        }
      });

      test("response status is 200 when page is provided", async () => {
        try {
          const response = await axios.get(`${ENDPOINT}/order/date?page=0`);
          expect(response.status).toBe(200);
        } catch (error) {
          expect(true).toBe(false);
        }
      });

      test(`responds with the first ${itemsPerPage} items in order of date`, async () => {
        const allPostsResponse = await axios.get(`${ENDPOINT}/all`);
        const orderedPostsResponse = await axios.get(
          `${ENDPOINT}/order/date?page=0`,
        );

        const orderedPosts = (allPostsResponse.data as TPostResponse[])
          .slice()
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );

        (orderedPostsResponse.data as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(orderedPosts[index]),
        );
      });

      test(`responds with the next ${itemsPerPage} items in order of date`, async () => {
        const allPostsResponse = await axios.get(`${ENDPOINT}/all`);
        const orderedPostsResponse = await axios.get(
          `${ENDPOINT}/order/date?page=1`,
        );

        const orderedPosts = (allPostsResponse.data as TPostResponse[])
          .slice()
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );

        (orderedPostsResponse.data as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(orderedPosts[index + itemsPerPage]),
        );
      });
    });

    describe("/order/date?descending=true", () => {
      test("response status is 400 when a page isn't provided", async () => {
        try {
          await axios.get(`${ENDPOINT}/order/date`);
          expect(true).toBe(false);
        } catch (error) {
          if (error instanceof AxiosError) {
            expect(error.status).toBe(400);
          }
        }
      });

      test("response status is 400 when a 'descending' isn't true or false", async () => {
        try {
          await axios.get(`${ENDPOINT}/order/date?page=0&descending=2`);
          expect(true).toBe(false);
        } catch (error) {
          if (error instanceof AxiosError) {
            expect(error.status).toBe(400);
          }
        }
      });

      test("response status is 200 when page is provided and 'descending' is true", async () => {
        try {
          const response = await axios.get(
            `${ENDPOINT}/order/date?page=0&descending=true`,
          );
          expect(response.status).toBe(200);
        } catch (error) {
          expect(true).toBe(false);
        }
      });

      test(`responds with the first ${itemsPerPage} items in descending order of date`, async () => {
        const allPostsResponse = await axios.get(`${ENDPOINT}/all`);
        const orderedPostsResponse = await axios.get(
          `${ENDPOINT}/order/date?page=0&descending=true`,
        );

        const orderedPosts = (allPostsResponse.data as TPostResponse[])
          .slice()
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          );

        (orderedPostsResponse.data as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(orderedPosts[index]),
        );
      });

      test(`responds with the next ${itemsPerPage} items in descending order of date`, async () => {
        const allPostsResponse = await axios.get(`${ENDPOINT}/all`);
        const orderedPostsResponse = await axios.get(
          `${ENDPOINT}/order/date?page=1&descending=true`,
        );

        const orderedPosts = (allPostsResponse.data as TPostResponse[])
          .slice()
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          );

        (orderedPostsResponse.data as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(orderedPosts[index + itemsPerPage]),
        );
      });
    });

    describe("/order/likes", () => {
      test("response status is 400 when a page isn't provided", async () => {
        try {
          await axios.get(`${ENDPOINT}/order/likes`);
          expect(true).toBe(false);
        } catch (error) {
          if (error instanceof AxiosError) {
            expect(error.status).toBe(400);
          }
        }
      });

      test("response status is 200 when page is provided", async () => {
        try {
          const response = await axios.get(`${ENDPOINT}/order/likes?page=0`);
          expect(response.status).toBe(200);
        } catch (error) {
          expect(true).toBe(false);
        }
      });

      test(`responds with the first ${itemsPerPage} items in order of likes`, async () => {
        const allPostsResponse = await axios.get(`${ENDPOINT}/all`);
        const orderedPostsResponse = await axios.get(
          `${ENDPOINT}/order/likes?page=0`,
        );

        const orderedPosts = (allPostsResponse.data as TPostResponse[])
          .slice()
          .sort((a, b) => a.likes - b.likes);

        (orderedPostsResponse.data as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(orderedPosts[index]),
        );
      });

      test(`responds with the next ${itemsPerPage} items in order of date`, async () => {
        const allPostsResponse = await axios.get(`${ENDPOINT}/all`);
        const orderedPostsResponse = await axios.get(
          `${ENDPOINT}/order/likes?page=1`,
        );

        const orderedPosts = (allPostsResponse.data as TPostResponse[])
          .slice()
          .sort((a, b) => a.likes - b.likes);

        (orderedPostsResponse.data as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(orderedPosts[index + itemsPerPage]),
        );
      });
    });

    describe("/order/likes?descending=true", () => {
      test("response status is 400 when a page isn't provided", async () => {
        try {
          await axios.get(`${ENDPOINT}/order/likes`);
          expect(true).toBe(false);
        } catch (error) {
          if (error instanceof AxiosError) {
            expect(error.status).toBe(400);
          }
        }
      });

      test("response status is 400 when a 'descending' isn't true or false", async () => {
        try {
          await axios.get(`${ENDPOINT}/order/likes?page=0&descending=2`);
          expect(true).toBe(false);
        } catch (error) {
          if (error instanceof AxiosError) {
            expect(error.status).toBe(400);
          }
        }
      });

      test("response status is 200 when page is provided and 'descending' is true", async () => {
        try {
          const response = await axios.get(
            `${ENDPOINT}/order/likes?page=0&descending=true`,
          );
          expect(response.status).toBe(200);
        } catch (error) {
          expect(true).toBe(false);
        }
      });

      test(`responds with the first ${itemsPerPage} items in descending order of likes`, async () => {
        const allPostsResponse = await axios.get(`${ENDPOINT}/all`);
        const orderedPostsResponse = await axios.get(
          `${ENDPOINT}/order/likes?page=0&descending=true`,
        );

        const orderedPosts = (allPostsResponse.data as TPostResponse[])
          .slice()
          .sort((a, b) => b.likes - a.likes);

        (orderedPostsResponse.data as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(orderedPosts[index]),
        );
      });

      test(`responds with the next ${itemsPerPage} items in descending order of likes`, async () => {
        const allPostsResponse = await axios.get(`${ENDPOINT}/all`);
        const orderedPostsResponse = await axios.get(
          `${ENDPOINT}/order/likes?page=1&descending=true`,
        );

        const orderedPosts = (allPostsResponse.data as TPostResponse[])
          .slice()
          .sort((a, b) => b.likes - a.likes);

        (orderedPostsResponse.data as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(orderedPosts[index + itemsPerPage]),
        );
      });
    });

    describe("/:postId", () => {
      test("response status is 404 when an invalid id is provided", async () => {
        try {
          await axios.get(`${ENDPOINT}/123`);
          expect(true).toBe(false);
        } catch (error) {
          if (error instanceof AxiosError) {
            expect(error.status).toBe(404);
          }
        }
      });

      test("response status is 200 when a valid id is provided", async () => {
        const id = mockPosts[0].id;

        try {
          const response = await axios.get(`${ENDPOINT}/${id}`);
          expect(response.status).toBe(200);
        } catch (error) {
          expect(true).toBe(false);
        }
      });

      test("post with a given id is the same as in the mock posts", async () => {
        const id = mockPosts[0].id;
        const response = await axios.get(`${ENDPOINT}/${id}`);

        expect(response.data).toEqual({
          ...mockPosts[0],
          date: mockPosts[0].date.toISOString(),
        });
      });
    });
  });

  describe("POST", () => {
    describe("/", () => {
      test("responds with 400 if not all body fields are provided", async () => {
        try {
          await axios.post(ENDPOINT, { title: "test" });
          expect(true).toBe(false);
        } catch (error) {
          if (error instanceof AxiosError) {
            expect(error.status).toBe(400);
          }
        }
      });

      test("responds with 201 if all body fields are provided", async () => {
        try {
          const response = await axios.post(ENDPOINT, {
            title: "Test",
            body: "Lorem Ipsum",
            tags: [""],
          });
          expect(response.status).toBe(201);
          axios.delete(`${ENDPOINT}/${response.data.id}`);
        } catch (error) {
          expect(true).toBe(false);
        }
      });

      test("post is created and appears inside the list", async () => {
        const postResponse = await axios.post(ENDPOINT, {
          title: "Test",
          body: "Lorem Ipsum",
          tags: [""],
        });
        const allPostsResponse = await axios.get(`${ENDPOINT}/all`);

        const post = (allPostsResponse.data as TPostResponse[]).find(
          (item) => item.id === (postResponse.data as TPostResponse).id,
        );

        expect(post).toBeDefined();
        expect(post).toEqual(postResponse.data);

        axios.delete(`${ENDPOINT}/${postResponse.data.id}`);
      });
    });
  });

  describe("PUT", () => {
    describe("/:postId/like", () => {
      test("response status is 404 when the id is invalid", async () => {
        try {
          await axios.put(`${ENDPOINT}/1323/like`);
          expect(true).toBe(false);
        } catch (error) {
          if (error instanceof AxiosError) {
            expect(error.status).toBe(404);
          }
        }
      });

      test("response is 204 when the id is valid", async () => {
        const id = mockPosts[0].id;

        try {
          const response = await axios.put(`${ENDPOINT}/${id}/like`);
          expect(response.status).toBe(204);
          axios.delete(`${ENDPOINT}/${id}/like`);
        } catch (error) {
          expect(true).toBe(false);
        }
      });

      test("added a like to the specified post", async () => {
        const id = mockPosts[0].id;
        const { likes } = (await axios.get(`${ENDPOINT}/${id}`)).data;

        await axios.put(`${ENDPOINT}/${id}/like`);
        const allPostsResponse = await axios.get(`${ENDPOINT}/all`);

        const post = (allPostsResponse.data as TPostResponse[]).find(
          (item) => item.id === id,
        );

        expect(post).toBeDefined();
        expect(post?.likes).toBe(likes + 1);

        axios.delete(`${ENDPOINT}/${id}/like`);
      });
    });
  });

  describe("PATCH", () => {
    describe("/:postId", () => {
      test("response status is 404 when the id is invalid", async () => {
        try {
          await axios.patch(`${ENDPOINT}/1323`);
          expect(true).toBe(false);
        } catch (error) {
          if (error instanceof AxiosError) {
            expect(error.status).toBe(404);
          }
        }
      });

      test("response is 200 when the id is valid", async () => {
        const { id } = (await axios.get(`${ENDPOINT}/all`))
          .data[0] as TPostResponse;

        try {
          const response = await axios.patch(`${ENDPOINT}/${id}`, {});
          expect(response.status).toBe(200);
        } catch (error) {
          expect(true).toBe(false);
        }
      });

      test("post is updated inside the list", async () => {
        const oldPost = (await axios.get(`${ENDPOINT}/all`))
          .data[0] as TPostResponse;

        const postResponse = await axios.patch(`${ENDPOINT}/${oldPost.id}`, {
          title: "Test",
          body: "Lorem Ipsum",
          tags: [""],
        });
        const allPostsResponse = await axios.get(`${ENDPOINT}/all`);

        const post = (allPostsResponse.data as TPostResponse[]).find(
          (item) => item.id === (postResponse.data as TPostResponse).id,
        );

        expect(post).toBeDefined();
        expect(post).toEqual(postResponse.data);

        axios.patch(`${ENDPOINT}/${oldPost.id}`, oldPost);
      });
    });
  });

  describe("DELETE", () => {
    describe("/:postId", () => {
      test("response status is 404 when the id is invalid", async () => {
        try {
          await axios.delete(`${ENDPOINT}/1323`);
          expect(true).toBe(false);
        } catch (error) {
          if (error instanceof AxiosError) {
            expect(error.status).toBe(404);
          }
        }
      });

      test("response is 204 when the id is valid", async () => {
        const oldPost = (await axios.get(`${ENDPOINT}/all`))
          .data[0] as TPostResponse;

        try {
          const response = await axios.delete(`${ENDPOINT}/${oldPost.id}`);
          expect(response.status).toBe(204);
          axios.post(ENDPOINT, oldPost);
        } catch (error) {
          expect(true).toBe(false);
        }
      });

      test("post is deleted from the list", async () => {
        const oldPost = (await axios.get(`${ENDPOINT}/all`))
          .data[0] as TPostResponse;

        const postResponse = await axios.delete(`${ENDPOINT}/${oldPost.id}`);
        const allPostsResponse = await axios.get(`${ENDPOINT}/all`);

        const post = (allPostsResponse.data as TPostResponse[]).find(
          (item) => item.id === (postResponse.data as TPostResponse).id,
        );

        expect(post).toBeUndefined();
        axios.post(ENDPOINT, oldPost);
      });
    });

    describe("/:postId/like", () => {
      test("response status is 404 when the id is invalid", async () => {
        try {
          await axios.delete(`${ENDPOINT}/1323/like`);
          expect(true).toBe(false);
        } catch (error) {
          if (error instanceof AxiosError) {
            expect(error.status).toBe(404);
          }
        }
      });

      test("response is 204 when the id is valid", async () => {
        const { id } = (await axios.get(`${ENDPOINT}/all`))
          .data[0] as TPostResponse;

        try {
          const response = await axios.delete(`${ENDPOINT}/${id}/like`);
          expect(response.status).toBe(204);
          axios.put(`${ENDPOINT}/${id}/like`);
        } catch (error) {
          expect(true).toBe(false);
        }
      });

      test("deleted a like to the specified post", async () => {
        const { id } = (await axios.get(`${ENDPOINT}/all`))
          .data[0] as TPostResponse;
        const { likes } = (await axios.get(`${ENDPOINT}/${id}`)).data;

        await axios.delete(`${ENDPOINT}/${id}/like`);
        const allPostsResponse = await axios.get(`${ENDPOINT}/all`);

        const post = (allPostsResponse.data as TPostResponse[]).find(
          (item) => item.id === id,
        );

        expect(post).toBeDefined();
        expect(post?.likes).toBe(likes - 1);

        axios.put(`${ENDPOINT}/${id}/like`);
      });
    });
  });
});
