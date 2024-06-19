const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, require: true },
  password: { type: String, require: true },
  author: { type: Boolean, default: false },
});

userSchema.virtual("url").get(function () {
  return `/members-only/user/${this._id}`;
});

module.exports = mongoose.model("user", userSchema);
