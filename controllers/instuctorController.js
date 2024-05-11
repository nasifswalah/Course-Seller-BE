import bcrypt from "bcrypt";
import Instructor from "../models/instructorModel.js";
import { adminToken } from "../utlis/generateToken.js";

export const singup = async (req, res) => {
    try {
      console.log(req.body);
  
      const { email, password, name } = req.body;
      const instructorExist = await Instructor.findOne({ email });
      if (instructorExist) {
        return res.send("Instructor is already exist");
      }
  
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);
  
      const newInstructor = new Instructor({
        name,
        email,
        hashPassword,
        role: "instructor",
      });
      const newInstructorCreated = await newInstructor.save();
  
      if (!newInstructorCreated) {
        return res.send("instructor is not created");
      }
  
      const token = adminToken(newInstructorCreated);
      res.cookie("token", token);
      res.send("Signed successfully");
    } catch (error) {
      console.log(error, "Something wrong");
    }
  };

  
  export const singin = async (req, res) => {
    try {
      const body = req.body;
      const { email, password } = body;
      console.log(body);
  
      const instructor = await Instructor.findOne({ email });
  
      if (!instructor) {
        return res.send("instructor is not found");
      }
  
      const matchPassword = await bcrypt.compare(
        password,
        instructor.hashPassword
      );
  
      console.log(matchPassword, "matchpassword");
      if (!matchPassword) {
        return res.send("password is not match");
      }
  
      const token = adminToken(instructor);
  
      res.cookie("token", token);
      res.json({ message: "Logged in!", token });
    } catch (error) {
      console.error("Error", error);
      res.status(500).send("Internal Server Error");
    }
  };

  export const getAllInstructors = async (req, res) => {
    const instructors = await Instructor.find();
    return res.send(instructors);
  };

  export const removeInstructor = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const instructor = await Instructor.find({ _id: id });
    if (!instructor) {
      return res.send("Instructor is not exist");
    }
    const remove = await Instructor.deleteOne({ _id: id });
  
    if (!remove) {
      return res.send("failed to remove");
    }
  
    return res.send("removed sucessfully");
  };