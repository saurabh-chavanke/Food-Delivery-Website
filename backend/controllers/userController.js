import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// Login user function
const loginUser = async (req, res) => {
  const {email,password} = req.body;
  try {
    const user = await userModel.findOne({email});

    if (!user) {
        return res.status(200).json({ success: false, message: "User Doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if (!isMatch) {
        return res.status(200).json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(200).json({ success: false, message: "Error" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET); // Adding token expiration time
};

// Register user function
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(200).json({ success: false, message: "User already exists" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    // Validate strong password (minimum 8 characters)
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password should be at least 8 characters long" });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user object
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user in the database
    const user = await newUser.save();

    // Create a token for the user
    const token = createToken(user._id);

    // Return the token and success message
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "An error occurred" });
  }
};

export { loginUser, registerUser };
