import express from "express"
import { addCart, deleteProductCart, editCart, getCart } from "../controllers/cartController.js"
const router = express.Router()
router.post("/addCart", addCart)
router.put("/editCart", editCart)
router.delete("/deleteCart/:productId", deleteProductCart)
router.get("/viewCart", getCart)
export default router