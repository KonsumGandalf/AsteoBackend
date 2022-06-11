/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
import { assert } from "chai";
import {
 userService, paintingService, consoleMan, galleryService, epochService, artistService,
} from "./asteo-service.js";
import { assertSubset } from "../test-utils.js";
import {
 vaderRank2, lukeRank0, testPaintingsJson, testGalleriesJson, testEpochsJson, testArtistsJson,
 vaderCredentials, lukeCredentials,
} from "../fixtures.spec.js";

suite("Painting API tests", () => {
  const testPaintings = [];
  let superUser;
  let testEpoch;
  let testArtist;
  let testGallery;

  setup("Initializes the use", async () => {
    // reset the current elements
    await userService.clearAuth();
    superUser = await userService.createUser(vaderRank2);
    await userService.authenticate(vaderCredentials);
    // resetting all referred databases
    await paintingService.deleteAllPaintings();
    assert.equal((await paintingService.getAllPaintings()).length, 0);
    await epochService.deleteAllEpochs();
    await artistService.deleteAllArtists();
    await galleryService.deleteAllGalleries();
    // creating one DataObj for the testPaintings
    testEpoch = await epochService.createEpoch(testEpochsJson[0]);
    testArtist = await artistService.createArtist(testArtistsJson[0]);
    testGallery = await galleryService.createGallery(testGalleriesJson[0]);

    for (let i = 0; i < testPaintingsJson.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const paintingTemplate = {
        title: testPaintingsJson[i].title,
        year: testPaintingsJson[i].year,
        price: testPaintingsJson[i].price,
        epoch: testEpoch._id,
        artist: testArtist._id,
        gallery: testGallery._id,
        image: testPaintingsJson[i].image,
      };
      testPaintings[i] = await paintingService.createPainting(paintingTemplate);
    }
    const allPaintings = await paintingService.getAllPaintings();
    assert.equal(allPaintings.length, 3);
  });
  teardown("Teardown cases", async () => {});

  test("create new painting to a gallery", async () => {
    const paintingTemplate = {
      title: testPaintingsJson[0].title,
      year: testPaintingsJson[0].year,
      price: testPaintingsJson[0].price,
      epoch: testEpoch._id,
      artist: testArtist._id,
      gallery: testGallery._id,
      image: testPaintingsJson[0].image,
    };
    const newPainting = await paintingService.createPainting(paintingTemplate);
    assertSubset(testPaintingsJson[0], newPainting);
    assert.isDefined(newPainting._id);
  });

  test("get an painting - success", async () => {
    const newPainting = await paintingService.getPainting(testPaintings[0]._id);
    consoleMan(testPaintings[0], newPainting);
    assertSubset(testPaintings[0], newPainting);
  });

  test("get all paintings of an epoch, artist & gallery", async () => {
    // control Objects
    const testEpoch2 = await epochService.createEpoch(testEpochsJson[1]);
    const testArtist2 = await artistService.createArtist(testArtistsJson[1]);
    const testGallery2 = await galleryService.createGallery(testGalleriesJson[1]);

    for (let i = 0; i < testPaintingsJson.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const paintingTemplate = {
        title: testPaintingsJson[i].title,
        year: testPaintingsJson[i].year,
        price: testPaintingsJson[i].price,
        epoch: testEpoch2._id,
        artist: testArtist2._id,
        gallery: testGallery2._id,
        image: testPaintingsJson[i].image,
      };
      const u = await paintingService.createPainting(paintingTemplate);
    }
    const allPaintings = await paintingService.getAllPaintings();
    assert.equal(allPaintings.length, 6);

    const paintingsEpoch = await paintingService.getAllPaintingsByEpoch(testEpoch2._id);
    assert.equal(paintingsEpoch.length, 3);
    const paintingsArtist = await paintingService.getAllPaintingsByArtist(testArtist2._id);
    assert.equal(paintingsArtist.length, 3);
    const paintingsGallery = await paintingService.getAllPaintingsByGallery(testGallery2._id);
    assert.equal(paintingsGallery.length, 3);
  });

  test("get a painting - bad id", async () => {
    try {
      const newPainting = await paintingService.getPainting("6969");
      assert.deepEqual(testPaintings[0], newPainting);
      assert.fail("No painting should have the id: 6969");
    } catch (error) {
      assert.equal(error.response.data.message, "Database Error - No painting with the given id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("delete all paintings - success", async () => {
    // authenticated with superUser
    let returnedPaintings = await paintingService.getAllPaintings();
    assert.equal(returnedPaintings.length, testPaintingsJson.length);
    await paintingService.deleteAllPaintings();
    returnedPaintings = await paintingService.getAllPaintings();
    assert.equal(returnedPaintings.length, 0);
  });

  test("delete one painting - successful - baseUser deletes own object", async () => {
    // authenticated with superUser
    await paintingService.deleteAllPaintings();
    let allPaintings = await paintingService.getAllPaintings();
    assert.equal(allPaintings.length, 0);
    await userService.clearAuth();
    // new authentication with baseUser
    await userService.createUser(lukeRank0);
    await userService.authenticate(lukeCredentials);
    const paintingTemplate = {
      title: testPaintingsJson[0].title,
      year: testPaintingsJson[0].year,
      price: testPaintingsJson[0].price,
      epoch: testEpoch,
      artist: testArtist,
      gallery: testGallery,
      image: testPaintingsJson[0].image,
    };
    const newPainting = await paintingService.createPainting(paintingTemplate);
    allPaintings = await paintingService.getAllPaintings();
    assert.equal(allPaintings.length, 1);
    await paintingService.deletePainting(newPainting._id);
    allPaintings = await paintingService.getAllPaintings();
    assert.equal(allPaintings.length, 0);
  });

  test("delete one painting - fail - missing rights", async () => {
    await userService.clearAuth();
    await userService.createUser(lukeRank0);
    await userService.authenticate(lukeCredentials);
    try {
      await paintingService.deletePainting(testPaintings[0]._id);
      assert.fail("Should not be returned - user misses the rights to do this");
    } catch (error) {
      assert.equal(error.response.data.message, "Missing rights to delete this painting.");
      assert.equal(error.response.data.statusCode, 400);
    }
  });

  test("delete all pots - fail - missing rights", async () => {
    await userService.createUser(lukeRank0);
    await userService.authenticate(lukeCredentials);
    try {
      await paintingService.deleteAllPaintings();
      assert.fail("Should not be returned - user misses the rights to do this");
    } catch (error) {
      assert.equal(error.response.data.message, "Missing right to delete all paintings.");
      assert.equal(error.response.data.statusCode, 400);
    }
  });

  test("get a deleted painting - fail", async () => {
    try {
      const success = await paintingService.deletePainting(testPaintings[0]._id);
      assert.isNotNull(success);
    } catch (error) {
      assert.equal(error.response.data.message, "error deleting the painting with id");
      assert.equal(error.response.data.statusCode, 404);
    }
    try {
      await paintingService.getPainting(testPaintings[0]._id);
      assert.fail("Should not be returned");
    } catch (error) {
      // assert.isEmpty(error.response);
      assert.equal(error.response.data.message, "No painting with the given id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
