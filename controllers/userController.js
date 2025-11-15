import Users from "../models/userModel.js"
import bcrypt from "bcryptjs"

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" })
    const existing_user = await Users.findOne({ email })
    if (existing_user) {
      res.status(409).json({ message: "User already exists" })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new Users({ name, email, password: hashedPassword, })
    await newUser.save()
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      }
    })
  } catch (err) {
    console.error("Error during refistration", err);
    res.status(500).json({ message: "Server error", error: err.message })

  }

}

export const getSingleUser = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const user = await Users.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("getSingleUser error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const login = async (req, res) => {
  console.log("reached");
  
  try {
    const { email, password } = req.body
    console.log(req.body);
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }
    const user = await Users.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "Cannot find user. Please Sign Up" })
    }
    if (user.isDisabled) {
      return res.status(403).json({ message: "Your account has been disabled by the admin." });
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }
    console.log("before admin");
    
    if (user.role == "admin") {
      req.session.admin = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
      return res.status(200).json({ message: "admin logged in", user: req.session.admin,success:true })
    }
    console.log("before user");
    
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
    return res.status(200).json({ message: "Login successful", user: req.session.user,success:true })
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ message: "Server error", error: err.message })

  }
}



export const updateUser = async (req, res) => {
  try {
    const userId = req.session.user.id
    const { name, email, password, address, gender, profile_picture, phone } = req.body
    const updateData = { name, email, address, gender, profile_picture, phone }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateData.password = hashedPassword
    }
    const updatedUser = await Users.findByIdAndUpdate(userId, updateData, { new: true })
    req.session.user.name = updatedUser.name
    req.session.user.email = updatedUser.email
    req.session.user.address = updatedUser.address
    req.session.user.phone = updatedUser.phone
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        phone: updatedUser.phone,
        time: updatedUser.createdAt,
      }
    })
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}


export const deleteUser = async (req, res) => {
  try {
    const userId = req.session.user.id;
    await Users.findByIdAndDelete(userId);
    req.session.destroy(err => {
      if (err) console.error("Session destroy error:", err);
    });
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
    res.clearCookie("connect.sid")
    res.status(200).json({ message: "Logout successful" });
  })
}

export const test = (req,res)=>{
  res.json({message:"reached"})
}



 export const sessioncheck = (req,res) =>{
  if(req.session.user){
    return res.json({loggedin:true,user:req.session.user})
  }else{
    return res.json({loggedin:false,user:null})
  }
 }