import express from "express"
import { deleteUser, getSingleUser, login, logoutUser, register, updateUser } from "../controllers/userController.js";
import { authUser } from "../middlewares/usermiddleware.js"
import { sessioncheck } from "../controllers/userController.js"
const router = express.Router()
router.post("/register", (req,res,next) =>{
    console.log("register router hit")
    next()
}, register)
router.post("/login", login)
router.get("/session", sessioncheck)
router.put("/update", (req,res,next) =>{
    console.log("update router hit")
    next()
}, authUser, updateUser)
router.get("/getAccount", authUser, getSingleUser)
router.delete("/delete", authUser, deleteUser)
router.delete("/logout", authUser, logoutUser);

export default router