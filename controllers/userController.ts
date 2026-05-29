import type { Request,Response } from 'express';
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface AuthBody{
  name?: string,
  email: string,
  password: string
}

export const SignUp = async (req:Request, res:Response) => {
  try {
    const { name, email, password } = req.body as AuthBody;
    if (!name || !email || !password) return res.status(400).json({ message: "All Fields Are Required", success: false });

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User Already Exist...", success: false });

    const saltRounds = Number(process.env.SALT) || 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      name,
      email,
      password: hashPassword
    })

    // Remove password before sending
    const userWithoutPassword = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email
    };

    return res.status(200).json({
      message: "Account Created SuccessFully...",
      success: true,
      user: userWithoutPassword
    })
  } catch (err:any) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
}

export const Login = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body as AuthBody;

    if (!email || !password) {
      return res.status(400).json({
        message: "All Fields Are Required...",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect Email And Password...",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect Email And Password...",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(
      tokenData,
      process.env.SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    // Remove password from user object
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax", // Changed from strict for better dev compatibility
      })
      .json({
        message: `${user.name} Login Successfully...`,
        success: true,
        user: userWithoutPassword,
      });

  } catch (err:any) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const Logout = async (req:Request, res:Response) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged Out SuccessFully"
    })
  } catch (err:any) {
    console.log(err);
  }
}