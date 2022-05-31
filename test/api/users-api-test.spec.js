/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
import { assert } from "chai";
import { userService } from "./asteo-service.js";
import { assertSubset } from "../test-utils.js";
import { vaderRank2, lukeRank0, testUsersJson, vaderCredentials, lukeCredentials } from "../fixtures.spec.js";

suite("User API tests", () => {
  let testUsers = [];

  setup("Initializes the use", async () => {
    // assert.equal(userService.playtimeUrl, "http://localhost:4000");
    await userService.clearAuth();
    await userService.createUser(vaderRank2);
    await userService.authenticate(vaderCredentials);
    await userService.deleteAllUsers();
    for (let i = 0; i < testUsersJson.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await userService.createUser(testUsersJson[i]);
    }
    await userService.createUser(vaderRank2);
    await userService.authenticate(vaderCredentials);
  });
  teardown("Teardown cases", async () => {});

  test("create new user", async () => {
    const newUser = await userService.createUser(vaderRank2);
    assertSubset(vaderRank2, newUser);
    assert.isDefined(newUser._id);
  });

  test("get a user - success", async () => {
    const newUser = await userService.getUser(testUsers[0]._id);
    assert.deepEqual(testUsers[0], newUser);
  });

  test("get a user - bad id", async () => {
    try {
      const newUser = await userService.getUser("2022");
      assert.deepEqual(testUsers[0], newUser);
    } catch (error) {
      assert.equal(error.response.data.message, "Database Error - No user with the given id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("delete all users - success", async () => {
    let returnedUsers = await userService.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length);
    await userService.deleteAllUsers();
    await userService.createUser(vaderRank2);
    await userService.authenticate(vaderCredentials);
    returnedUsers = await userService.getAllUsers();
    assert.equal(returnedUsers.length, 1);
  });

  test("delete one user - fail - missing rights", async () => {
    const normalUser = await userService.createUser(lukeRank0);
    const superUser = await userService.createUser(vaderRank2);
    await userService.clearAuth();
    await userService.authenticate(lukeCredentials);
    try {
      await userService.deleteUser(superUser._id);
      assert.fail("Should not be returned - user misses the rights to do this");
    } catch (error) {
      assert.equal(error.response.data.message, "Missing rights to delete this user.");
      assert.equal(error.response.data.statusCode, 400);
      assert.equal(1, 1);
    }
  });

  test("delete all users - fail - missing rights", async () => {
    await userService.createUser(lukeRank0);
    await userService.authenticate(lukeCredentials);
    try {
      await userService.deleteAllUsers();
      assert.fail("Should not be returned - user misses the rights to do this");
    } catch (error) {
      assert(error.response.data.message === "Missing right to delete all users.");
      assert.equal(error.response.data.statusCode, 400);
      assert.equal(1, 1);
    }
  });

  test("get a deleted user - fail", async () => {
    try {
      const success = await userService.deleteUser(testUsers[0]._id);
      assert.isNotNull(success);
    } catch (error) {
      assert(error.response.data.message === "No user with the given id");
      assert.equal(error.response.data.statusCode, 404);
    }
    try {
      await userService.getUser(testUsers[0]._id);
      assert.fail("Should not be returned");
    } catch (error) {
      assert(error.response.data.message === "No user with the given id");
      assert.equal(error.response.data.statusCode, 404);
      assert.equal(1, 1);
    }
  });
});
