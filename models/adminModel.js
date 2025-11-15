import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "admin" },
}, { timestamps: true });

export const Admin = mongoose.model("Admin", adminSchema);
export default Admin