import express from "express";
import { addProduct, disableProduct, getAllProducts, getAllProductsUsers, getSingleProduct, updateProduct } from "../controllers/productController.js";
import { upload } from "../middlewares/multar.js";
const router = express.Router();
router.post("/addProduct", upload.array("image",3), addProduct)
router.get("/getAllProduct", getAllProducts)
router.get("/getAllProductUsers", getAllProductsUsers)
router.get("/getproduct/:id", getSingleProduct)
router.put("/updateProduct/:id", upload.array("image", 3), updateProduct)
router.delete("/disableProduct/:id", disableProduct)
export default router