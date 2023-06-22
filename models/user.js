const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  last_name: { type: String, required: true, maxLength: 100 },
  username: { type: String, lowercase: true, trim: true },
  password: { type: String, required: true },
  membership_status: {
        type: String,
        enum: ["Newbie", "Stalite", "Exclusive"],
        default: "Newbie" },
  });

// Virtual for user's full name
UserSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.last_name) {
    fullname = `${this.last_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.last_name) {
    fullname = "";
  }
  return fullname;
});

// Virtual for user's URL
UserSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/user/${this._id}`;
});



// Export model
module.exports = mongoose.model("User", UserSchema);
