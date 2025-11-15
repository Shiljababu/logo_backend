import express from "express"
import { adminLogin, getAllUsers, getSingleUser, logoutAdmin, toggleUserStatus } from "../controllers/adminController.js"
import categoryRouter from "./categoryRoutes.js";
import { authAdmin } from "../middlewares/adminmiddleware.js";
const router = express.Router()
router.post("/login", adminLogin)
router.get("/getUsers",authAdmin, getAllUsers);
router.get("/getUserById/:id", authAdmin, getSingleUser)
router.delete("/disableUser/:id", authAdmin, toggleUserStatus);
router.delete("/admin_logout", authAdmin, logoutAdmin);


router.use("/", categoryRouter);
export default router