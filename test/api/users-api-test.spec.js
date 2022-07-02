/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
import { assert } from "chai";
import { userService } from "./asteo-service.js";
import { assertSubset } from "../test-utils.js";
import {
 vaderRank2, lukeRank0, testUsersJson, vaderCredentials, lukeCredentials,
} from "../fixtures.spec.js";

suite("User API tests", () => {
  const testUsers = [];
  let superUser;

  setup("Initializes the use", async () => {
    // assert.equal(userService.playtimeUrl, "http://localhost:4000");

    await userService.createUser(vaderRank2);
    await userService.authenticate(vaderCredentials);
    await userService.deleteAllUsers();
    for (let i = 0; i < testUsersJson.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await userService.createUser(testUsersJson[i]);
    }
    superUser = await userService.createUser(vaderRank2);
    await userService.authenticate(vaderCredentials);
  });
  teardown("Teardown cases", async () => {});

  test("create new user", async () => {
    const newUser = await userService.createUser(lukeRank0);
    assertSubset(lukeRank0, newUser);
    assert.isDefined(newUser._id);
  });

  test("update an existing user", async () => {
    const newUser = await userService.createUser(lukeRank0);
    assertSubset(lukeRank0, newUser);
    newUser.username = "SupiSkywalker";
    newUser.rank = 1;
    const updatedUser = await userService.updateUser(newUser);
    assertSubset(lukeRank0, updatedUser);
    assert.equal(updatedUser.rank, 1);
  });

  test("get a user by Id - success", async () => {
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
});
