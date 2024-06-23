const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const User = require("../models/user");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: { type: String, required: true },
  timestamp: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

commentSchema.virtual("timestamp_formatted").get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Comment", commentSchema);
