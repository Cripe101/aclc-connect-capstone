const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+Vhttps://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
    },
    bio: {
      type: Object,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "student", "faculty", "offices"],
      default: "student",
    },
    // resetPasswordToken: {
    //     type: String
    // },
    // resetPasswordExpires: {
    //     type: Date
    // },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
