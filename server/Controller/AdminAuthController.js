import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {Admin} from '../Model/Admin.js';
export const AdminLogin = async (req,res)=>{
  try{
    let admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return res.status(404).json({Message: "No admin found"});
    let isMatch = bcrypt.compare(req.body.password, admin.password);
    if (!isMatch) return res.status(401).json({Message: "Invalid password"});
    let token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    res.cookie("adminToken", token, {
      httpOnly: true,
      sameSite: "strict"
    }).json({ success: true });
  } catch (error){
    res.status(500).json({message:"Server Error"});
  }
}
export const AdminLogout =(req,res)=>{
  try{
    res.clearCookie("adminToken").json({success:true});
  } catch (error){
    res.status(500).json({message:"Server Error"});
  }
}
export const AdminRegsiter = async (req,res)=>{
  try{
    const count = await Admin.countDocuments();
    if(count >= 1){
        return res.status(403).send("Admin account already created");
    }
    const hashed = await bcrypt.hash(req.body.password, 10);
    await Admin.create({
        email: req.body.email.toLowerCase(),
        password: hashed
    });
    res.json({ message: "Admin account created successfully" });
  } catch (error){
    res.status(500).json({message:"Server Error"});
  }
}
