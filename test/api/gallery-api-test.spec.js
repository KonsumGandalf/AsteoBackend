/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
import { assert } from "chai";
import { userService, galleryService, consoleMan } from "./asteo-service.js";
import { assertSubset } from "../test-utils.js";
import { vaderRank2, lukeRank0, testGalleriesJson } from "../fixtures.spec.js";

suite("Gallery API tests", () => {
  const testGalleries = [];
  let superUser;

  setup("Initializes the use", async () => {
    // reset the current elements
    await userService.clearAuth();
    superUser = await userService.createUser(vaderRank2);
    await userService.authenticate(vaderRank2);
    await galleryService.deleteAllGalleries();

    for (let i = 0; i < testGalleriesJson.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const galleryTemplate = {
        name: testGalleriesJson[i].name,
        lat: testGalleriesJson[i].lat,
        lng: testGalleriesJson[i].lng,
        countAllVisitors: testGalleriesJson[i].countAllVisitors,
        countCurVisitors: testGalleriesJson[i].countCurVisitors,
        avgRating: testGalleriesJson[i].avgRating,
      };
      testGalleries[i] = await galleryService.createGallery(galleryTemplate);
    }
  });
  teardown("Teardown cases", async () => {});

  test("create new gallery", async () => {
    const galleryTemplate = {
      name: testGalleriesJson[0].name,
      lat: testGalleriesJson[0].lat,
      lng: testGalleriesJson[0].lng,
      countAllVisitors: testGalleriesJson[0].countAllVisitors,
      countCurVisitors: testGalleriesJson[0].countCurVisitors,
      avgRating: testGalleriesJson[0].avgRating,
    };
    const newGallery = await galleryService.createGallery(galleryTemplate);
    assertSubset(testGalleriesJson[0], newGallery);
    assert.isDefined(newGallery._id);
  });

  test("get an gallery - success", async () => {
    const newGallery = await galleryService.getGallery(testGalleries[0]._id);
    consoleMan(testGalleries[0], newGallery);
    assertSubset(testGalleries[0], newGallery);
  });

  test("get a gallery - bad id", async () => {
    try {
      const newGallery = await galleryService.getGallery("6969");
      assert.deepEqual(testGalleries[0], newGallery);
      assert.fail("No gallery should have the id: 6969");
    } catch (error) {
      assert.equal(error.response.data.message, "Database Error - No gallery with the given id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("delete all galleries - success", async () => {
    let returnedGalleries = await galleryService.getAllGalleries();
    assert.equal(returnedGalleries.length, testGalleries.length);
    await galleryService.deleteAllGalleries();
    returnedGalleries = await galleryService.getAllGalleries();
    assert.equal(returnedGalleries.length, 0);
  });

  test("delete one gallery - successful - baseUser deletes own object", async () => {
    // authenticate with superUser
    await galleryService.deleteAllGalleries();
    let allGalleries = await galleryService.getAllGalleries();
    assert.equal(allGalleries.length, 0);
    await userService.clearAuth();
    // new authentication with baseUser
    await userService.createUser(lukeRank0);
    await userService.authenticate(lukeRank0);
    try{
      const galleryTemplate = {
        name: testGalleriesJson[0].name,
        lat: testGalleriesJson[0].lat,
        lng: testGalleriesJson[0].lng,
        countAllVisitors: testGalleriesJson[0].countAllVisitors,
        countCurVisitors: testGalleriesJson[0].countCurVisitors,
        avgRating: testGalleriesJson[0].avgRating,
      };
      const newGallery = await galleryService.createGallery(galleryTemplate);
      allGalleries = await galleryService.getAllGalleries();
      assert.equal(allGalleries.length, 1);
      await galleryService.deleteGallery(newGallery._id);
      allGalleries = await galleryService.getAllGalleries();
      assert.equal(allGalleries.length, 0);
    } catch (error) {
      assert.fail("Should not be returned - user has the rights to do this since he created the gallery.");
    }
  });

  test("delete one gallery - fail - missing rights", async () => {
    await userService.clearAuth();
    await userService.createUser(lukeRank0);
    await userService.authenticate(lukeRank0);
    try {
      await galleryService.deleteGallery(testGalleries[0]._id);
      assert.fail("Should not be returned - user misses the rights to do this");
    } catch (error) {
      assert.equal(error.response.data.message, "Missing rights to delete this gallery.");
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

  test("get a deleted gallery - fail", async () => {
    try {
      const success = await galleryService.deleteGallery(testGalleries[0]._id);
      assert.isNotNull(success);
    } catch (error) {
      assert.equal(error.response.data.message, "error deleting the gallery with id");
      assert.equal(error.response.data.statusCode, 404);
    }
    try {
      await galleryService.getGallery(testGalleries[0]._id);
      assert.fail("Should not be returned");
    } catch (error) {
      // assert.isEmpty(error.response);
      assert.equal(error.response.data.message, "No gallery with the given id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});