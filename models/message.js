const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
 // timestamp: { createdAt: 'created_at',
 //            updatedAt: 'updated_at' },
});

// Virtual for author's URL
MessageSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/message/${this._id}`;
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
