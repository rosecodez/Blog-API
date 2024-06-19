const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const user = require("../models/user");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: { type: String, require: true },
  timestamp: { type: Date, require: true },
  user: { type: Schema.Types.ObjectId, ref: "User", require: true },
});

commentSchema.virtual("timestamp_formatted").get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("user", commentSchema);
