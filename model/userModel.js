import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false, required: true },
  profile: {
    img: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    gender: { type: String },
    phone: { type: Number },
    business: { type: String },
    shopCode: { type: String },
    disable: { type: String, default: "active" },
    stats: { type: String },
  },
  createAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
