/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
import { assert } from "chai";
import { userService, artistService } from "./asteo-service.js";
import { assertSubset } from "../test-utils.js";
import { vaderRank2, lukeRank0, testArtistsJson } from "../fixtures.spec.js";

suite("Artist API tests", () => {
  const testArtists = [];
  let superUser;

  setup("Initializes the use", async () => {
    // reset the current elements
    await userService.clearAuth();
    superUser = await userService.createUser(vaderRank2);
    await userService.authenticate(vaderRank2);
    await artistService.deleteAllArtists();

    for (let i = 0; i < testArtistsJson.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const artistTemplate = {
        firstName: testArtistsJson[i].firstName,
        lastName: testArtistsJson[i].lastName,
        description: testArtistsJson[i].description,
        countPaintings: testArtistsJson[i].countPaintings,
      };
      testArtists[i] = await artistService.createArtist(artistTemplate);
    }
  });
  teardown("Teardown cases", async () => {});

  test("create new artist", async () => {
    const artistTemplate = {
      firstName: testArtistsJson[0].firstName,
      lastName: testArtistsJson[0].lastName,
      description: testArtistsJson[0].description,
      countPaintings: testArtistsJson[0].countPaintings,
    };
    const newArtist = await artistService.createArtist(artistTemplate);
    assertSubset(testArtistsJson[0], newArtist);
    assert.isDefined(newArtist._id);
  });

  test("get an artist - success", async () => {
    const newArtist = await artistService.getArtist(testArtists[0]._id);
    assertSubset(testArtists[0], newArtist);
  });

  test("get a artist - bad id", async () => {
    try {
      const newArtist = await artistService.getArtist("6969");
      assert.deepEqual(testArtists[0], newArtist);
      assert.fail("No artist should have the id: 6969");
    } catch (error) {
      assert.equal(error.response.data.message, "Database Error - No artist with the given id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("delete all artists - success", async () => {
    let returnedArtists = await artistService.getAllArtists();
    assert.equal(returnedArtists.length, testArtists.length);
    await artistService.deleteAllArtists();
    returnedArtists = await artistService.getAllArtists();
    assert.equal(returnedArtists.length, 0);
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

  test("delete one artist - successful - baseUser deletes own object", async () => {
    // authenticate with superUser
    await artistService.deleteAllArtists();
    let allArtists = await artistService.getAllArtists();
    assert.equal(allArtists.length, 0);
    await userService.clearAuth();
    // new authentication with baseUser
    await userService.createUser(lukeRank0);
    await userService.authenticate(lukeRank0);
    try{
      const artistTemplate = {
        name: testArtistsJson[0].name,
        lat: testArtistsJson[0].lat,
        lng: testArtistsJson[0].lng,
        countAllVisitors: testArtistsJson[0].countAllVisitors,
        countCurVisitors: testArtistsJson[0].countCurVisitors,
        avgRating: testArtistsJson[0].avgRating,
      };
      const newArtist = await artistService.createArtist(artistTemplate);
      allArtists = await artistService.getAllArtists();
      assert.equal(allArtists.length, 1);
      await artistService.deleteArtist(newArtist._id);
      allArtists = await artistService.getAllArtists();
      assert.equal(allArtists.length, 0);
    } catch (error) {
      assert.fail("Should not be returned - user has the rights to do this since he created the artist.");
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

  test("get a deleted artist - fail", async () => {
    try {
      const success = await artistService.deleteArtist(testArtists[0]._id);
      assert.isNotNull(success);
    } catch (error) {
      assert.equal(error.response.data.message, "error deleting the artist with id");
      assert.equal(error.response.data.statusCode, 404);
    }
    try {
      await artistService.getArtist(testArtists[0]._id);
      assert.fail("Should not be returned");
    } catch (error) {
      // assert.isEmpty(error.response);
      assert.equal(error.response.data.message, "No artist with the given id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
