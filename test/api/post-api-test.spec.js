/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
import { assert } from "chai";
import {
 userService, postService, consoleMan, galleryService,
} from "./asteo-service.js";
import { assertSubset } from "../test-utils.js";
import {
 vaderRank2, lukeRank0, testPostsJson, testGalleriesJson, vaderCredentials, lukeCredentials
} from "../fixtures.spec.js";

suite("Post API tests", () => {
  const testPosts = [];
  let superUser;
  let testGallery;

  setup("Initializes the use", async () => {
    // reset the current elements
    await userService.clearAuth();
    superUser = await userService.createUser(vaderRank2);
    await userService.authenticate(vaderCredentials);
    await postService.deleteAllPosts();
    testGallery = await galleryService.createGallery(testGalleriesJson[0]);

    for (let i = 0; i < testPostsJson.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const postTemplate = {
        headline: testPostsJson[i].headline,
        comment: testPostsJson[i].comment,
        /* this will be determined at the backend creation
        time: testPostsJson[i].time,
        user ...
        */
       rating: testPostsJson[i].rating,
      };
      testPosts[i] = await postService.createPost(testGallery._id, postTemplate);
    }
  });
  teardown("Teardown cases", async () => {});

  test("create new post to a gallery", async () => {
    const postTemplate = {
      headline: testPostsJson[0].headline,
      comment: testPostsJson[0].comment,
      /* this will be determined at the backend creation
      time: testPostsJson[0].time,
      user ...
      */
      rating: testPostsJson[0].rating,
    };
    const newPost = await postService.createPost(testGallery._id, postTemplate);
    assertSubset(testPostsJson[0], newPost);
    assert.isDefined(newPost._id);
  });

  test("get an post - success", async () => {
    const newPost = await postService.getPost(testPosts[0]._id);
    consoleMan(testPosts[0], newPost);
    assertSubset(testPosts[0], newPost);
  });

  test("get all posts of a gallery and an user", async () => {
    await postService.deleteAllPosts();
    for (let i = 0; i < testPostsJson.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const postTemplate = {
        headline: testPostsJson[i].headline,
        comment: testPostsJson[i].comment,
        rating: testPostsJson[i].rating,
      };
      testPosts[i] = await postService.createPost(testGallery._id, postTemplate);
    }
    const postsGallery = await postService.getAllPostsByGallery(testGallery._id);
    assert.equal(postsGallery.length, 2);
    // change the size to 1
    await postService.deletePost(testPosts[0]._id);
    const postsUser = await postService.getAllPostsByUser(superUser._id);
    assert.equal(postsUser.length, 1);
  });

  test("get a post - bad id", async () => {
    try {
      const newPost = await postService.getPost("6969");
      assert.deepEqual(testPosts[0], newPost);
      assert.fail("No post should have the id: 6969");
    } catch (error) {
      assert.equal(error.response.data.message, "Database Error - No post with the given id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("delete all posts - success", async () => {
    let returnedPosts = await postService.getAllPosts();
    assert.equal(returnedPosts.length, testPostsJson.length);
    await postService.deleteAllPosts();
    returnedPosts = await postService.getAllPosts();
    assert.equal(returnedPosts.length, 0);
  });

  test("delete one post - successful - baseUser deletes own object", async () => {
    // authenticate with superUser
    await postService.deleteAllPosts();
    let allPosts = await postService.getAllPosts();
    assert.equal(allPosts.length, 0);
    await userService.clearAuth();
    // new authentication with baseUser
    await userService.createUser(lukeRank0);
    await userService.authenticate(lukeCredentials);

    try {
      const postTemplate = {
        headline: testPostsJson[0].headline,
        comment: testPostsJson[0].comment,
        rating: testPostsJson[0].rating,
      };
      const newPost = await postService.createPost(testGallery._id, postTemplate);
      allPosts = await postService.getAllPosts();
      assert.equal(allPosts.length, 1);
      await postService.deletePost(newPost._id);
      allPosts = await postService.getAllPosts();
      assert.equal(allPosts.length, 0);
    } catch (error) {
      assert.fail("Should not be returned - user has the rights to do this since he created the post.");
    }
  });

  test("delete one post - fail - missing rights", async () => {
    await userService.clearAuth();
    await userService.createUser(lukeRank0);
    await userService.authenticate(lukeCredentials);
    try {
      await postService.deletePost(testPosts[0]._id);
      assert.fail("Should not be returned - user misses the rights to do this");
    } catch (error) {
      assert.equal(error.response.data.message, "Missing rights to delete this post.");
      assert.equal(error.response.data.statusCode, 400);
    }
  });

  test("delete all pots - fail - missing rights", async () => {
    await userService.createUser(lukeRank0);
    await userService.authenticate(lukeCredentials);
    try {
      await postService.deleteAllPosts();
      assert.fail("Should not be returned - user misses the rights to do this");
    } catch (error) {
      assert.equal(error.response.data.message, "Missing right to delete all posts.");
      assert.equal(error.response.data.statusCode, 400);
    }
  });

  test("get a deleted post - fail", async () => {
    try {
      const success = await postService.deletePost(testPosts[0]._id);
      assert.isNotNull(success);
    } catch (error) {
      assert.equal(error.response.data.message, "error deleting the post with id");
      assert.equal(error.response.data.statusCode, 404);
    }
    try {
      await postService.getPost(testPosts[0]._id);
      assert.fail("Should not be returned");
    } catch (error) {
      // assert.isEmpty(error.response);
      assert.equal(error.response.data.message, "No post with the given id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
