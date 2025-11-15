import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "other"]
    },
    profile_picture: {
        type: String
    },
    phone:{
        type:String
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isDisabled: {
        type: Boolean,
        default: false
    },


    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Users = mongoose.model("Users", userSchema)

export default Users