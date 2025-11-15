import mongoose from "mongoose";
import connectDb from "./connectionDB.js"
import Order from "./models/orderModel.js";

const run = async () => {
  await connectDb();

  await Order.updateMany(
    { isDeleted: { $exists: false } },
    { $set: { isDeleted: false } }
  );

  console.log("All existing orders now have isDeleted:false");
  process.exit();
};

run();
