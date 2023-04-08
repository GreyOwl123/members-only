const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  username: { email_only: { type: String, lowercase: true, trim: true },
  password: { type: String, required: true },
  membership_status: {
        type: String,
        enum: ["Newbie", "Stalite", "Exclusive"],
        default: "",
});

// Virtual for user's full name
UserSchema.virtual("name").get(function () {
  // To avoid errors in cases where a user does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.family_name) {
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
