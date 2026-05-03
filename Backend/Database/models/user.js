import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
      required: true,
      select: false,
    },
    email: {
      type: String,
      minlength: 10,
      maxlength: 30,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "superAdmin", "codeReviewer"],
    },
    Image: {
      type: String,
      default: "default-avatar.png",
    },
    account_status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
