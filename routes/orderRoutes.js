import express from "express";
import { deleteOrder, editOrderByAdmin, editPaymentStatus, getAllOrders, getOrderById, getUserOrder, placeOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/placeOrder", placeOrder);
router.get("/getAllOrders", getAllOrders)
router.get("/getuserOrder", getUserOrder)
router.get("/getOrderById/:id",getOrderById)
router.put("/editOrderByAdmin/:id", editOrderByAdmin)
router.put("/editpayment/:id",editPaymentStatus)
router.delete("/deleteOrder/:id",deleteOrder)
export default router;

