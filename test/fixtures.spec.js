export const serviceUrl = "http://127.0.0.1:4000";

export const vaderRank2 = {
  firstName: "Darth",
  lastName: "Vader",
  username: "DarkVader",
  email: "vader@imperium.com",
  password: "secret",
  rank: 0,
  countPosting: 0,
};

export const lukeRank0 = {
  firstName: "Luke",
  lastName: "Skywalker",
  username: "LukeSkywalker",
  email: "skywalker@rebels.com",
  password: "secret",
  rank: 0,
  countPosting: 0,
};

export const vaderCredentials = {
  username: "DarkVader",
  password: "secret",
};

export const testUsersJson = [
  {
    firstName: "David",
    lastName: "Schmidt",
    username: "PaintingGandalf",
    email: "david_schmidt_privat@outlook.com",
    password: "password123",
    rank: 1,
    countPosting: 0,
  },
  {
    firstName: "Darth",
    lastName: "Vader",
    username: "DarkVader",
    email: "vader@imperium.com",
    password: "secret",
    rank: 2,
    countPosting: 0,
  },
  {
    firstName: "Luke",
    lastName: "Skywalker",
    username: "LukeSkywalker",
    email: "skywalker@rebels.com",
    password: "secret",
    rank: 0,
    countPosting: 0,
  },
];

export const testArtistsJson = [
  {
    firstName: "Vincent",
    lastName: "van Gogh",
    description: "Vincent van Gogh was a Dutch painter, generally considered to be the greatest after Rembrandt van Rijn, and one of the greatest of the PostImpressionists. He sold only one artwork during his life, but in the century after his death he became perhaps the most recognized painter of all time.",
    countPaintings: 20,
  },
  {
    firstName: "Leonardo",
    lastName: "da Vinci",
    description: "Leonardo da Vinci was an artist and engineer who is best known for his paintings, notably the Mona Lisa (c. 1503–19) and the Last Supper (1495–98). His drawing of the Vitruvian Man (c. 1490) has also become a cultural icon. Leonardo is sometimes credited as the inventor of the tank, helicopter, parachute, and flying machine, among other vehicles and devices, but later scholarship has disputed such claims. Nonetheless, Leonardo's notebooks reveal a sharp intellect, and his contributions to art, including methods of representing space, threedimensional objects, and the human figure, cannot be overstated.",
    countPaintings: 5,
  },
];

export const testEpochsJson = [
  {
    name: "Post-Impressionism",
    description: "Post-Impressionism, in Western painting, movement in France that represented both an extension of Impressionism and a rejection of that style’s inherent limitations. The term Post-Impressionism was coined by the English art critic Roger Fry for the work of such late 19th-century painters as Paul Cézanne, Georges Seurat, Paul Gauguin, Vincent van Gogh, Henri de Toulouse-Lautrec, and others. All of these painters except van Gogh were French, and most of them began as Impressionists; each of them abandoned the style, however, to form his own highly personal art. Impressionism was based, in its strictest sense, on the objective recording of nature ...",
    yearSpan: "1890 - 1920",
  },
  {
    name: "Renaissance",
    description: "Renaissance art, painting, sculpture, architecture, music, and literature produced during the 14th, 15th, and 16th centuries in Europe under the combined influences of an increased awareness of nature, a revival of classical learning, and a more individualistic view of man. Scholars no longer believe that the Renaissance marked an abrupt break with medieval values, as is suggested by the French word renaissance, literally “rebirth.” Rather, historical sources suggest that interest in nature, humanistic learning, and individualism were already present in the late medieval period and became dominant in 15th- and 16th-century Italy concurrently with social and economic changes such as the secularization of daily life, the rise of a rational money-credit economy, and greatly increased social mobility.",
    yearSpan: "14th - 17th century",
  },
];

export const testGalleriesJson = [
  {
    name: "Van Gogh Museum",
    lat: "52.358353",
    lng: "4.880563",
    countAllVisitors: 0,
    countCurVisitors: 0,
    avgRating: 0,
  },
  {
    name: "Rijksmuseum",
    lat: "52.359438",
    lng: "4.884338",
    countAllVisitors: 0,
    countCurVisitors: 0,
    avgRating: 0,
  },
];

export const testPostsJson = [
  {
    headline: "The artist just had ONE ear!😯",
    comment: "Very impressive exhibition! The pictures are super presented. Also the curriculum vitae of the artist is well presented.Also very interesting how the pictures are secured",
    time: new Date("2016-05-18T16:00:00Z"),
    rating: 5,
  },
  {
    headline: "Overtrumps with Donald get me Goosebumps😇",
    comment: "The museum is a clear must for every Amsterdam visitor! There is so much to see on different floors, you would need several hours to really look at everything in detail and read through! Of course, you have to be aware that it is very crowded inside and you sometimes have to wait to be able to read through a picture or a description. Especially before the night watch you have to fight for your slot. Also the museum garden and the library are dreamlike!❤️🌷",
    time: new Date(),
    rating: 4,
  },
];

export const testPaintingsJson = [
  {
    title: "Starry Night",
    year: 1889,
    price: 70000000,
  },
  {
    title: "The Night Watch",
    year: 1642,
    price: 1300000,
  },
  {
    title: "Crying Woman",
    year: 1937,
    price: 2000000,
  },
];
