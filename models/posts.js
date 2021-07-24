const mongoose = require("mongoose");
const Schema = mongoose.Schema

const postsSchema = new Schema({
  image_url: { type: String, required: true },
  review: { type: String, required: true },
  rating: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  posted_by: { type: Schema.Types.ObjectId, ref: "Users"}, //"Users" references User Schema
  liked_by: [String], //? do we need this? - ame
  hc_id: String, //? to delete? - ame
  hs_id: String, //? to delete - ame
  dishes_id: { type: String, required: true }, //? to delete? - ame

  //! + hawker centre they are referring to (query from HAWKER CENTRE id)
  //! + hawker stall they are referring to (query from HAWKER STALL id)
  //! + dishes they are referring to (query from DISHES id)

  //! NEED TO RELOOK AT THIS ONE
});

const Posts = mongoose.model("Posts", postsSchema);

module.exports = Posts;
