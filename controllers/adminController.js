import bcrypt from "bcryptjs"
import Users from "../models/userModel.js"
// export const adminLogin = async (req, res)=>{
//     try{
//         const {email, password } = req.body
//         if (!email || !password){
//             return res.status(400).json({message:"Email and password are required"})    
//         }
//         const user = await Users.findOne({email})
//         if (!user){
//             return res.status(401).json({message:"invalid email or password"})
//         }
//         const isMatch = await bcrypt.compare(password, user.password)
//         if (!isMatch){
//             return res.status(404).json({message:"Invalid email or password"})
//         }
//         if (user.role !== "admin") {
//             return res.status(403).json({message:"Acess denied: Admins only"})
//         }
//         req.session.admin = {
//             id : user._id,
//             name: user.name,
//             email:user.email,
//             role:user.role,
//         }
//         console.log("✅ Admin session created:", req.session.admin);
//         res.status(200).json({message:"Admin login successful", admin:req.session.admin,})
//     }catch (err) {
//         console.error("Admin login error",err)
//         res.status(500).json({message:"Server error", error:err.message})
        
//     }
// }
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🟡 Admin login attempt:", email, password);

    const user = await Users.findOne({ email });
    console.log("🔵 Found user:", user);

    if (!user) return res.status(401).json({ message: "invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🟢 Password match:", isMatch);

    if (!isMatch) return res.status(404).json({ message: "Invalid email or password" });

    if (user.role !== "admin") {
      console.log("🚫 Not an admin:", user.role);
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    req.session.admin = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    console.log("✅ Admin session created:", req.session.admin);
    res.status(200).json({ message: "Admin login successful", admin: req.session.admin });
  } catch (err) {
    console.error("Admin login error", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getAllUsers = async (req, res) => {
  console.log("reached hrer");
  
  try {
    const users = await Users.find()
    res.status(200).json({ message: "All users fetched", users })
  } catch (err) {
    console.error("Get all users error:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}


export const getSingleUser = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })
    res.status(200).json({ message: "User fetched", user })
  } catch (err) {
    console.error("Get single user error:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    user.isDisabled = !user.isDisabled
    await user.save()

    res.status(200).json({
      message: `User ${user.isDisabled ? "disabled" : "enabled"} successfully`,
      user,})
  } catch (err) {
    console.error("Toggle user status error:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}
export const logoutAdmin = (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ message: "Not logged in as admin" });
  }

  req.session.destroy(err => {
    if (err) {
      console.error("Admin logout error:", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }

    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Admin logged out successfully" });
  });
}


