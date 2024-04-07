const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/projectData");

const userSchema = mongoose.Schema({
  username: {
    type: String,
  },
  name: {
    type: String,
  },
  bio: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  contact: {
    type: Number,
  },
  profileImage: String,
  savedImg: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "savedImg",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});

userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);
