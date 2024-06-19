const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const user = require("../models/user");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, require: true },
  text: { type: String, require: true },
  timestamp: { type: Date, require: true },
  published: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: "User", require: true },
});

postSchema.virtual("timestamp_formatted").get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("user", postSchema);
