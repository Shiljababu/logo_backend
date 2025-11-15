import express from "express"
import { addCategory, getAllCategories, getSingleCategory, toggleCategory, updateCategory } from "../controllers/categoryController.js";
const router = express.Router();

router.post("/addCategory", addCategory)
router.get("/getAllCategory", getAllCategories)
router.get("/getCategory/:id", getSingleCategory);
router.put("/editCategory/:id", updateCategory);
router.delete("/dltCategory/:id", toggleCategory);

export default router;