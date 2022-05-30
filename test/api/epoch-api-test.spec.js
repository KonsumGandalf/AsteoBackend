/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
import { assert } from "chai";
import { userService, epochService, consoleMan } from "./asteo-service.js";
import { assertSubset } from "../test-utils.js";
import { vaderRank2, lukeRank0, testEpochsJson } from "../fixtures.spec.js";

suite("Epoch API tests", () => {
  const testEpochs = [];
  let superUser;

  setup("Initializes the use", async () => {
    // reset the current elements
    await userService.clearAuth();
    superUser = await userService.createUser(vaderRank2);
    await userService.authenticate(vaderRank2);
    await epochService.deleteAllEpochs();

    for (let i = 0; i < testEpochsJson.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const epochTemplate = {
        name: testEpochsJson[i].name,
        description: testEpochsJson[i].description,
        yearSpan: testEpochsJson[i].yearSpan,
        user: superUser._id,
      };
      testEpochs[i] = await epochService.createEpoch(epochTemplate);
    }
  });
  teardown("Teardown cases", async () => {});

  test("create new epoch", async () => {
    const epochTemplate = {
      firstName: testEpochsJson[0].firstName,
      lastName: testEpochsJson[0].lastName,
      description: testEpochsJson[0].description,
      countPaintings: testEpochsJson[0].countPaintings,
      user: superUser._id,
    };
    const newEpoch = await epochService.createEpoch(epochTemplate);
    assertSubset(testEpochsJson[0], newEpoch);
    assert.isDefined(newEpoch._id);
  });

  test("get an epoch - success", async () => {
    const newEpoch = await epochService.getEpoch(testEpochs[0]._id);
    consoleMan(testEpochs[0], newEpoch);
    assertSubset(testEpochs[0], newEpoch);
  });

  test("get a epoch - bad id", async () => {
    try {
      const newEpoch = await epochService.getEpoch("6969");
      assert.deepEqual(testEpochs[0], newEpoch);
      assert.fail("No epoch should have the id: 6969");
    } catch (error) {
      assert.equal(error.response.data.message, "Database Error - No epoch with the given id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("delete all epochs - success", async () => {
    let returnedEpochs = await epochService.getAllEpochs();
    assert.equal(returnedEpochs.length, testEpochs.length);
    await epochService.deleteAllEpochs();
    returnedEpochs = await epochService.getAllEpochs();
    assert.equal(returnedEpochs.length, 0);
  });

  test("delete one user - fail - missing rights", async () => {
    await userService.createUser(lukeRank0);
    await userService.authenticate(lukeRank0);
    try {
      await userService.deleteUser(superUser._id);
      assert.fail("Should not be returned - user misses the rights to do this");
    } catch (error) {
      assert(error.response.data.message === "Missing rights to delete this user.");
      assert.equal(error.response.data.statusCode, 400);
    }
  });

  test("delete all users - fail - missing rights", async () => {
    await userService.createUser(lukeRank0);
    await userService.authenticate(lukeRank0);
    try {
      await userService.deleteAllUsers();
      assert.fail("Should not be returned - user misses the rights to do this");
    } catch (error) {
      assert(error.response.data.message === "Missing right to delete all users.");
      assert.equal(error.response.data.statusCode, 400);
    }
  });

  test("get a deleted epoch - fail", async () => {
    try {
      const success = await epochService.deleteEpoch(testEpochs[0]._id);
      assert.isNotNull(success);
    } catch (error) {
      assert.equal(error.response.data.message, "error deleting the epoch with id");
      assert.equal(error.response.data.statusCode, 404);
    }
    try {
      await epochService.getEpoch(testEpochs[0]._id);
      assert.fail("Should not be returned");
    } catch (error) {
      // assert.isEmpty(error.response);
      assert.equal(error.response.data.message, "No epoch with the given id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
