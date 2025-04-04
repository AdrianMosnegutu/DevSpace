import { itemsPerPage, mockPosts, STATUS_CODE, TPostResponse } from "common";
import request from "supertest";
import app from "../app";

const ENDPOINT = "/api/posts";

describe("/api/posts", () => {
  describe("GET", () => {
    describe("/all", () => {
      test("received an array", async () => {
        const response = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        expect(Array.isArray(response.body)).toBe(true);
      });

      test("received an array of post responses", async () => {
        const response = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        (response.body as Array<TPostResponse>).every((item) =>
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

      test(`posts array should be of length ${mockPosts.length}`, async () => {
        const response = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        expect((response.body as Array<TPostResponse>).length).toBe(
          mockPosts.length,
        );
      });

      test("initial posts are the same as the mock posts", async () => {
        const response = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        (response.body as Array<TPostResponse>).every((post, index) =>
          expect(post).toEqual({
            ...mockPosts[index],
            date: mockPosts[index].date.toISOString(),
          }),
        );
      });
    });

    describe("?page=...", () => {
      test("response status is 400 when a page isn't provided", async () => {
        await request(app).get(ENDPOINT).expect(STATUS_CODE.BAD_REQUEST);
      });

      test("response status is 400 when a page isn't provided as an integer", async () => {
        await request(app)
          .get(`${ENDPOINT}?page=test`)
          .expect(STATUS_CODE.BAD_REQUEST);
      });

      test("received an array", async () => {
        const response = await request(app)
          .get(`${ENDPOINT}?page=0`)
          .expect(STATUS_CODE.OK);
        expect(Array.isArray(response.body)).toBe(true);
      });

      test("received an array of post responses", async () => {
        const response = await request(app)
          .get(`${ENDPOINT}?page=0`)
          .expect(STATUS_CODE.OK);

        (response.body as Array<TPostResponse>).every((item) =>
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

      test(`full page should be of length ${itemsPerPage}`, async () => {
        const response = await request(app)
          .get(`${ENDPOINT}?page=0`)
          .expect(STATUS_CODE.OK);

        expect((response.body as Array<TPostResponse>).length).toBe(
          itemsPerPage,
        );
      });

      test(`posts on the first page should be the first ${itemsPerPage} from mockPosts`, async () => {
        const response = await request(app)
          .get(`${ENDPOINT}?page=0`)
          .expect(STATUS_CODE.OK);

        (response.body as Array<TPostResponse>).every((post, index) =>
          expect(post).toEqual({
            ...mockPosts[index],
            date: mockPosts[index].date.toISOString(),
          }),
        );
      });

      test(`posts on the second page should be the next ${itemsPerPage} from mockPosts`, async () => {
        const response = await request(app)
          .get(`${ENDPOINT}?page=1`)
          .expect(STATUS_CODE.OK);

        (response.body as Array<TPostResponse>).every((post, index) =>
          expect(post).toEqual({
            ...mockPosts[index + itemsPerPage],
            date: mockPosts[index + itemsPerPage].date.toISOString(),
          }),
        );
      });
    });

    describe("/newest", () => {
      test("response satisfies the post response object", async () => {
        const response = await request(app)
          .get(`${ENDPOINT}/newest`)
          .expect(STATUS_CODE.OK);

        expect(response.body).toMatchObject<TPostResponse>({
          id: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          tags: expect.any(Array),
          date: expect.any(String),
          likes: expect.any(Number),
        });
      });

      test("the post is the newest in the list", async () => {
        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const newestPostResponse = await request(app)
          .get(`${ENDPOINT}/newest`)
          .expect(STATUS_CODE.OK);

        const allPosts = allPostsResponse.body as TPostResponse[];

        let newestPost: TPostResponse | undefined = undefined;

        allPosts.forEach((post) => {
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
        expect(newestPostResponse.body).toEqual(newestPost);
      });
    });

    describe("/oldest", () => {
      test("response satisfies the post response object", async () => {
        const response = await request(app)
          .get(`${ENDPOINT}/oldest`)
          .expect(STATUS_CODE.OK);

        expect(response.body).toMatchObject<TPostResponse>({
          id: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          tags: expect.any(Array),
          date: expect.any(String),
          likes: expect.any(Number),
        });
      });

      test("the post is the oldest in the list", async () => {
        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const oldestPostResponse = await request(app)
          .get(`${ENDPOINT}/oldest`)
          .expect(STATUS_CODE.OK);

        const allPosts = allPostsResponse.body as TPostResponse[];

        let oldestPost: TPostResponse | undefined = undefined;

        allPosts.forEach((post) => {
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
        expect(oldestPostResponse.body).toEqual(oldestPost);
      });
    });

    describe("/mostLiked", () => {
      test("response satisfies the post response object", async () => {
        const response = await request(app)
          .get(`${ENDPOINT}/mostLiked`)
          .expect(STATUS_CODE.OK);

        expect(response.body).toMatchObject<TPostResponse>({
          id: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          tags: expect.any(Array),
          date: expect.any(String),
          likes: expect.any(Number),
        });
      });

      test("the post is the most liked in the list", async () => {
        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const mostLikedPostResponse = await request(app)
          .get(`${ENDPOINT}/mostLiked`)
          .expect(STATUS_CODE.OK);

        const allPosts = allPostsResponse.body as TPostResponse[];

        let mostLikedPost: TPostResponse | undefined = undefined;

        allPosts.forEach((post) => {
          if (!mostLikedPost) {
            mostLikedPost = post;
          } else {
            if (!mostLikedPost || post.likes > mostLikedPost.likes) {
              mostLikedPost = post;
            }
          }
        });

        expect(mostLikedPost).toBeDefined();
        expect(mostLikedPostResponse.body).toEqual(mostLikedPost);
      });
    });

    describe("/leastLiked", () => {
      test("response satisfies the post response object", async () => {
        const response = await request(app)
          .get(`${ENDPOINT}/leastLiked`)
          .expect(STATUS_CODE.OK);

        expect(response.body).toMatchObject<TPostResponse>({
          id: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          tags: expect.any(Array),
          date: expect.any(String),
          likes: expect.any(Number),
        });
      });

      test("the post is the least liked in the list", async () => {
        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const leastLikedPostResponse = await request(app)
          .get(`${ENDPOINT}/leastLiked`)
          .expect(STATUS_CODE.OK);

        const allPosts = allPostsResponse.body as TPostResponse[];

        let leastLikedPost: TPostResponse | undefined = undefined;

        allPosts.forEach((post) => {
          if (!leastLikedPost) {
            leastLikedPost = post;
          } else {
            if (!leastLikedPost || post.likes < leastLikedPost.likes) {
              leastLikedPost = post;
            }
          }
        });

        expect(leastLikedPost).toBeDefined();
        expect(leastLikedPostResponse.body).toEqual(leastLikedPost);
      });
    });

    describe("/filter", () => {
      test("response status is 400 when no tags are provided", async () => {
        await request(app)
          .get(`${ENDPOINT}/filter`)
          .expect(STATUS_CODE.BAD_REQUEST);
      });

      test("responds with all posts containing the tags", async () => {
        const tags = ["career", "python"];

        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const filteredPostResponse = await request(app)
          .get(`${ENDPOINT}/filter?tags=${tags.join(",")}`)
          .expect(STATUS_CODE.OK);

        const filteredPosts = (allPostsResponse.body as TPostResponse[]).filter(
          (post) => post.tags.some((tag) => tags.includes(tag)),
        );

        (filteredPostResponse.body as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(filteredPosts[index]),
        );
      });
    });

    describe("/order/date", () => {
      test("response status is 400 when a page isn't provided", async () => {
        await request(app)
          .get(`${ENDPOINT}/order/date`)
          .expect(STATUS_CODE.BAD_REQUEST);
      });

      test(`responds with the first ${itemsPerPage} items in order of date`, async () => {
        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const orderedPostsResponse = await request(app)
          .get(`${ENDPOINT}/order/date?page=0`)
          .expect(STATUS_CODE.OK);

        const orderedPosts = (allPostsResponse.body as TPostResponse[])
          .slice()
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );

        (orderedPostsResponse.body as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(orderedPosts[index]),
        );
      });

      test(`responds with the next ${itemsPerPage} items in order of date`, async () => {
        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const orderedPostsResponse = await request(app)
          .get(`${ENDPOINT}/order/date?page=1`)
          .expect(STATUS_CODE.OK);

        const orderedPosts = (allPostsResponse.body as TPostResponse[])
          .slice()
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );

        (orderedPostsResponse.body as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(orderedPosts[index + itemsPerPage]),
        );
      });
    });

    describe("/order/date?descending=true", () => {
      test("response status is 400 when a page isn't provided", async () => {
        await request(app)
          .get(`${ENDPOINT}/order/date`)
          .expect(STATUS_CODE.BAD_REQUEST);
      });

      test("response status is 400 when a 'descending' isn't true or false", async () => {
        await request(app)
          .get(`${ENDPOINT}/order/date?page=0&descending=2`)
          .expect(STATUS_CODE.BAD_REQUEST);
      });

      test(`responds with the first ${itemsPerPage} items in descending order of date`, async () => {
        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const orderedPostsResponse = await request(app)
          .get(`${ENDPOINT}/order/date?page=0&descending=true`)
          .expect(STATUS_CODE.OK);

        const orderedPosts = (allPostsResponse.body as TPostResponse[])
          .slice()
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          );

        (orderedPostsResponse.body as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(orderedPosts[index]),
        );
      });

      test(`responds with the next ${itemsPerPage} items in descending order of date`, async () => {
        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const orderedPostsResponse = await request(app)
          .get(`${ENDPOINT}/order/date?page=1&descending=true`)
          .expect(STATUS_CODE.OK);

        const orderedPosts = (allPostsResponse.body as TPostResponse[])
          .slice()
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          );

        (orderedPostsResponse.body as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(orderedPosts[index + itemsPerPage]),
        );
      });
    });

    describe("/order/likes", () => {
      test("response status is 400 when a page isn't provided", async () => {
        await request(app)
          .get(`${ENDPOINT}/order/likes`)
          .expect(STATUS_CODE.BAD_REQUEST);
      });

      test(`responds with the first ${itemsPerPage} items in order of likes`, async () => {
        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const orderedPostsResponse = await request(app)
          .get(`${ENDPOINT}/order/likes?page=0`)
          .expect(STATUS_CODE.OK);

        const orderedPosts = (allPostsResponse.body as TPostResponse[])
          .slice()
          .sort((a, b) => a.likes - b.likes);

        (orderedPostsResponse.body as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(orderedPosts[index]),
        );
      });

      test(`responds with the next ${itemsPerPage} items in order of date`, async () => {
        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const orderedPostsResponse = await request(app)
          .get(`${ENDPOINT}/order/likes?page=1`)
          .expect(STATUS_CODE.OK);

        const orderedPosts = (allPostsResponse.body as TPostResponse[])
          .slice()
          .sort((a, b) => a.likes - b.likes);

        (orderedPostsResponse.body as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(orderedPosts[index + itemsPerPage]),
        );
      });
    });

    describe("/order/likes?descending=true", () => {
      test("response status is 400 when a page isn't provided", async () => {
        await request(app)
          .get(`${ENDPOINT}/order/likes`)
          .expect(STATUS_CODE.BAD_REQUEST);
      });

      test("response status is 400 when a 'descending' isn't true or false", async () => {
        await request(app)
          .get(`${ENDPOINT}/order/likes?page=0&descending=2`)
          .expect(STATUS_CODE.BAD_REQUEST);
      });

      test(`responds with the first ${itemsPerPage} items in descending order of likes`, async () => {
        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const orderedPostsResponse = await request(app)
          .get(`${ENDPOINT}/order/likes?page=0&descending=true`)
          .expect(STATUS_CODE.OK);

        const orderedPosts = (allPostsResponse.body as TPostResponse[])
          .slice()
          .sort((a, b) => b.likes - a.likes);

        (orderedPostsResponse.body as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(orderedPosts[index]),
        );
      });

      test(`responds with the next ${itemsPerPage} items in descending order of likes`, async () => {
        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const orderedPostsResponse = await request(app)
          .get(`${ENDPOINT}/order/likes?page=1&descending=true`)
          .expect(STATUS_CODE.OK);

        const orderedPosts = (allPostsResponse.body as TPostResponse[])
          .slice()
          .sort((a, b) => b.likes - a.likes);

        (orderedPostsResponse.body as TPostResponse[]).every((post, index) =>
          expect(post).toEqual(orderedPosts[index + itemsPerPage]),
        );
      });
    });

    describe("/:postId", () => {
      test("response status is 404 when an invalid id is provided", async () => {
        await request(app).get(`${ENDPOINT}/123`).expect(STATUS_CODE.NOT_FOUND);
      });

      test("post with a given id is the same as in the mock posts", async () => {
        const id = mockPosts[0].id;
        const response = await request(app)
          .get(`${ENDPOINT}/${id}`)
          .expect(STATUS_CODE.OK);

        expect(response.body).toEqual({
          ...mockPosts[0],
          date: mockPosts[0].date.toISOString(),
        });
      });
    });
  });

  describe("POST", () => {
    describe("/", () => {
      test("responds with 400 if not all body fields are provided", async () => {
        await request(app)
          .post(ENDPOINT)
          .send({ title: "test" })
          .expect(STATUS_CODE.BAD_REQUEST);

        await request(app)
          .post(ENDPOINT)
          .send({ title: 123 })
          .expect(STATUS_CODE.BAD_REQUEST);

        await request(app)
          .post(ENDPOINT)
          .send({ title: "test", body: "test" })
          .expect(STATUS_CODE.BAD_REQUEST);

        await request(app)
          .post(ENDPOINT)
          .send({ title: "test", body: 123 })
          .expect(STATUS_CODE.BAD_REQUEST);

        await request(app)
          .post(ENDPOINT)
          .send({ body: 123 })
          .expect(STATUS_CODE.BAD_REQUEST);

        await request(app)
          .post(ENDPOINT)
          .send({ title: "test", body: "test", tags: "test" })
          .expect(STATUS_CODE.BAD_REQUEST);

        await request(app)
          .post(ENDPOINT)
          .send({ title: "test", body: "test", tags: ["test", 123] })
          .expect(STATUS_CODE.BAD_REQUEST);

        await request(app)
          .post(ENDPOINT)
          .send({ tags: [123] })
          .expect(STATUS_CODE.BAD_REQUEST);
      });

      test("post is created and appears inside the list", async () => {
        const postResponse = await request(app)
          .post(ENDPOINT)
          .send({
            title: "Test",
            body: "Lorem Ipsum",
            tags: [""],
          })
          .expect(STATUS_CODE.CREATED);

        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const post = (allPostsResponse.body as TPostResponse[]).find(
          (item) => item.id === (postResponse.body as TPostResponse).id,
        );

        expect(post).toBeDefined();
        expect(post).toEqual(postResponse.body);
      });
    });
  });

  describe("PUT", () => {
    describe("/:postId/like", () => {
      test("response status is 404 when the id is invalid", async () => {
        await request(app)
          .put(`${ENDPOINT}/1323/like`)
          .expect(STATUS_CODE.NOT_FOUND);
      });

      test("added a like to the specified post", async () => {
        const { id, likes } = (
          await request(app).get(`${ENDPOINT}/all`).expect(STATUS_CODE.OK)
        ).body[0] as TPostResponse;

        await request(app)
          .put(`${ENDPOINT}/${id}/like`)
          .expect(STATUS_CODE.NO_CONTENT);

        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const post = (allPostsResponse.body as TPostResponse[]).find(
          (item) => item.id === id,
        );

        expect(post).toBeDefined();
        expect(post?.likes).toBe(likes + 1);
      });
    });
  });

  describe("PATCH", () => {
    describe("/:postId", () => {
      test("response status is 404 when the id is invalid", async () => {
        await request(app)
          .patch(`${ENDPOINT}/1323`)
          .expect(STATUS_CODE.NOT_FOUND);
      });

      test("post is updated inside the list", async () => {
        const { id } = (
          await request(app).get(`${ENDPOINT}/all`).expect(STATUS_CODE.OK)
        ).body[0] as TPostResponse;

        let postResponse = await request(app)
          .patch(`${ENDPOINT}/${id}`)
          .send({
            title: "Test",
          })
          .expect(STATUS_CODE.OK);

        postResponse = await request(app)
          .patch(`${ENDPOINT}/${id}`)
          .send({
            body: "Lorem Ipsum",
          })
          .expect(STATUS_CODE.OK);

        postResponse = await request(app)
          .patch(`${ENDPOINT}/${id}`)
          .send({
            tags: ["test"],
          })
          .expect(STATUS_CODE.OK);

        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const post = (allPostsResponse.body as TPostResponse[]).find(
          (item) => item.id === (postResponse.body as TPostResponse).id,
        );

        expect(post).toBeDefined();
        expect(post).toEqual(postResponse.body);
      });
    });
  });

  describe("DELETE", () => {
    describe("/:postId", () => {
      test("response status is 404 when the id is invalid", async () => {
        await request(app)
          .delete(`${ENDPOINT}/1323`)
          .expect(STATUS_CODE.NOT_FOUND);
      });

      test("post is deleted from the list", async () => {
        const oldPost = (
          await request(app).get(`${ENDPOINT}/all`).expect(STATUS_CODE.OK)
        ).body[0] as TPostResponse;

        const postResponse = await request(app)
          .delete(`${ENDPOINT}/${oldPost.id}`)
          .expect(STATUS_CODE.NO_CONTENT);

        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const post = (allPostsResponse.body as TPostResponse[]).find(
          (item) => item.id === (postResponse.body as TPostResponse).id,
        );

        expect(post).toBeUndefined();
      });
    });

    describe("/:postId/like", () => {
      test("response status is 404 when the id is invalid", async () => {
        await request(app)
          .delete(`${ENDPOINT}/1323/like`)
          .expect(STATUS_CODE.NOT_FOUND);
      });

      test("deleted a like to the specified post", async () => {
        const { id } = (
          await request(app).get(`${ENDPOINT}/all`).expect(STATUS_CODE.OK)
        ).body[0] as TPostResponse;

        const { likes } = (
          await request(app).get(`${ENDPOINT}/${id}`).expect(STATUS_CODE.OK)
        ).body;

        await request(app)
          .delete(`${ENDPOINT}/${id}/like`)
          .expect(STATUS_CODE.NO_CONTENT);

        const allPostsResponse = await request(app)
          .get(`${ENDPOINT}/all`)
          .expect(STATUS_CODE.OK);

        const post = (allPostsResponse.body as TPostResponse[]).find(
          (item) => item.id === id,
        );

        expect(post).toBeDefined();
        expect(post?.likes).toBe(likes - 1);
      });
    });
  });

  describe("empty post list", () => {
    beforeAll(() => {
      mockPosts.forEach(
        async (post) =>
          await request(app)
            .delete(`${ENDPOINT}/${post.id}`)
            .expect(STATUS_CODE.NO_CONTENT),
      );
    });

    test("response code is 404 if fetching the newest post and the post list is empty", async () => {
      await request(app)
        .get(`${ENDPOINT}/newest`)
        .expect(STATUS_CODE.NOT_FOUND);
    });

    test("response code is 404 if fetching the oldest post and the post list is empty", async () => {
      await request(app)
        .get(`${ENDPOINT}/oldest`)
        .expect(STATUS_CODE.NOT_FOUND);
    });

    test("response code is 404 if fetching the most liked post and the post list is empty", async () => {
      await request(app)
        .get(`${ENDPOINT}/mostLiked`)
        .expect(STATUS_CODE.NOT_FOUND);
    });

    test("response code is 404 if fetching the least liked post and the post list is empty", async () => {
      await request(app)
        .get(`${ENDPOINT}/leastLiked`)
        .expect(STATUS_CODE.NOT_FOUND);
    });
  });
});
