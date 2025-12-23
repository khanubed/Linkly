import bcrypt, { hash } from "bcryptjs";
import User  from "../models/user.js";
import { generateToken } from "../lib/util.js";


export const userSignup =  async (req , res) => {
    const {email , fullName , password} = req.body;
    try {
        if(!email || !fullName || !password){
            return res.json({success : false , message : "All fields are required"});
        }

        const user  = await User.findOne({email});
        if (user) {
            return res.json({success : false , message : "Email already exists"});            
        }

        const salt  = await bcrypt.genSalt(10);
        const hashedPassword  = await bcrypt.hash(password, salt);

        const newUser  =  await  User.create(
            {email , fullName , password : hashedPassword , linkCount : 0 , isPremium : false}
        );

        const token = generateToken(newUser._id);

        res.json({success : true , userData : newUser , token , message : "Account has been created successfully"});

    } catch (error) {
        console.log(error.message);
        res.json({success : false , message : error.message})
    }
}

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log("BODY RECEIVED:", req.body);

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const userData = await User.findOne({ email }).select("+password");;
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isPasswordMatched = await bcrypt.compare(password, userData.password);
    if (!isPasswordMatched) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userData._id);

    return res.status(200).json({
      success: true,
      userData,
      token,
      message: "Logged in successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const authCheck =  async (req , res) => {
    res.json({success : true , user : req.user});
}


// export const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };