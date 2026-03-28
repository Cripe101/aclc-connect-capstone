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
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8AJM9wkP__z2M-hovSAWcTb_9XJ6smy3NKw&s",
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
