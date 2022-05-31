/* eslint-disable no-undef */
import { assert } from "chai";
import { userService } from "./asteo-service.js";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { vaderRank2 } from "../fixtures.spec.js";

suite("Authentication API tests", async () => {
  setup(async () => {
    await userService.createUser(vaderRank2);
    await userService.authenticate(vaderRank2);
    await userService.deleteAllUsers(vaderRank2);
  });

  test("authenticate", async () => {
    userService.clearAuth();
    await userService.createUser(vaderRank2);
    const response = await userService.authenticate(vaderRank2);
    assert.equal(response.success, true);
    // assert.fail(12);
    assert.isDefined(response.token);
  });

  test("verify token", async () => {
    const returnedUser = await userService.createUser(vaderRank2);
    const response = await userService.authenticate(vaderRank2);
    const userInfo = decodeToken(response.token);
    assert.equal(userInfo.username, returnedUser.username);
    assert.equal(userInfo.userId, returnedUser._id);
  });

  test("check unauthorized", async () => {
    userService.clearAuth();
    try {
      await userService.deleteAllUsers();
      assert.fail("Route not protected");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 401);
    }
  });
});
