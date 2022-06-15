import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const AuthSpec = Joi.object().keys({
  success: Joi.boolean().example("true").required(),
  token: Joi.string().example("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9").required(),
  _id: IdSpec.optional(),
}).label("Auth Details");

export const UserLoginSpec = Joi.object().keys({
  username: Joi.string().min(3).example("DarkMenial").required(),
  password: Joi.string().min(5).example("IamYourFather").required(),
}).label("User Credentials - Login");

export const UserRegisterSpec = UserLoginSpec.keys({
  firstName: Joi.string().min(3).example("Darth").required(),
  lastName: Joi.string().min(3).example("Vader").required(),
  email: Joi.string().min(8).example("DarkMenial@empire.com").required(),
  rank: Joi.number().example(1).optional(),
  countPosting: Joi.number().example(0).optional(),
}).label("User Credentials - Register");

export const UserDBSpec = UserRegisterSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("User Credentials - In DataBase Syntax");

export const UserRef = Joi.alternatives().try(IdSpec, UserDBSpec).description("a valid User ID");

export const ArtistTemplateSpec = Joi.object().keys({
  firstName: Joi.string().min(3).example("Richard").required(),
  lastName: Joi.string().min(3).example(" Prince").required(),
  description: Joi.string().min(3).example("Your artwork is now mine :) Thanks.").required(),
  countPaintings: Joi.number(),
  image: Joi.string().example("https://de.wikipedia.org/wiki/Vincent_van_Gogh#/media/Datei:Van_Gogh_Self-Portrait_with_Straw_Hat_1887-Metropolitan.jpg").required(),
}).label("Artist Details - Handed by the User");

export const ArtistDBSpec = ArtistTemplateSpec.keys({
  user: UserRef,
  _id: IdSpec,
  __v: Joi.number(),
}).label("Artist Details - In DataBase Syntax");

export const ArtistRef = Joi.alternatives().try(IdSpec, ArtistDBSpec).description("a valid Artist ID");

export const EpochTemplateSpec = Joi.object().keys({
  name: Joi.string().min(3).example("Cubism").required(),
  description: Joi.string().min(3).example("The Epoch was focused on abstract forms and shapes.").required(),
  yearSpan: Joi.string().min(3).example("1950-1980").required(),
  image: Joi.string().example("https://de.wikipedia.org/wiki/Vincent_van_Gogh#/media/Datei:Van_Gogh_Self-Portrait_with_Straw_Hat_1887-Metropolitan.jpg").required(),
}).label("Epoch Details - Handed by the User");

export const EpochDBSpec = EpochTemplateSpec.keys({
  user: UserRef,
  _id: IdSpec,
  __v: Joi.number(),
}).label("Epoch Details - In DataBase Syntax");

export const EpochRef = Joi.alternatives().try(IdSpec, EpochDBSpec).description("a valid Epoch ID");

export const GalleryTemplateSpec = Joi.object().keys({
  name: Joi.string().min(3).example("National Gallery").required(),
  lat: Joi.number().example(49.01).required(),
  lng: Joi.number().example(12.10).required(),
  countAllVisitors: Joi.number().example(0).optional(),
  countCurVisitors: Joi.number().example(0).optional(),
  avgRating: Joi.number().optional(4.2),
}).label("Gallery Details - Handed by the User");

export const GalleryDBSpec = GalleryTemplateSpec.keys({
  user: UserRef,
  _id: IdSpec,
  __v: Joi.number(),
}).label("Gallery Details - In DataBase Syntax");

export const GalleryRef = Joi.alternatives().try(IdSpec, GalleryDBSpec).description("a valid Gallery ID");

export const PostTemplateSpec = Joi.object().keys({
  headline: Joi.string().min(4).example("Inspiring!").required(),
  comment: Joi.string().min(10).example("The collection of art is large and dives deep in the undiscovered ocean of thoughts and meaningfulness.").required(),
  rating: Joi.number().example(5).required(),
  gallery: GalleryRef,
  time: Joi.date().example(new Date()).optional(),
}).label("Post Details - Handed by the User");

export const PostDBSpec = PostTemplateSpec.keys({
  user: UserRef,
  _id: IdSpec,
  __v: Joi.number(),
}).label("Post Details - In DataBase Syntax");

export const PostRef = Joi.alternatives().try(IdSpec, PostDBSpec).description("a valid Post ID");

export const PaintingTemplateSpec = Joi.object().keys({
  title: Joi.string().min(3).example("Inspiring!").required(),
  year: Joi.number().example(1404).required(),
  price: Joi.number().example(24000000).required(),
  gallery: GalleryRef,
  epoch: EpochRef,
  artist: ArtistRef,
  image: Joi.string().example("https://de.wikipedia.org/wiki/Vincent_van_Gogh#/media/Datei:Van_Gogh_Self-Portrait_with_Straw_Hat_1887-Metropolitan.jpg").required(),
}).label("Painting Details - Handed by the User");

export const PaintingDBSpec = PaintingTemplateSpec.keys({
  user: UserRef,
  _id: IdSpec,
  __v: Joi.number(),
}).label("Painting Details - In DataBase Syntax");

export const PaintingRef = Joi.alternatives().try(IdSpec, PaintingDBSpec).description("a valid Painting ID");

export const ExampleArrays = {
  UserArray: Joi.array().items(UserDBSpec).label("UserArray"),
  EpochArray: Joi.array().items(EpochDBSpec).label("EpochArray"),
  ArtistArray: Joi.array().items(ArtistDBSpec).label("ArtistArray"),
  GalleryArray: Joi.array().items(GalleryDBSpec).label("GalleryArray"),
  PostArray: Joi.array().items(PostDBSpec).label("PostArray"),
  PaintingArray: Joi.array().items(PaintingDBSpec).label("PaintingArray"),
};
