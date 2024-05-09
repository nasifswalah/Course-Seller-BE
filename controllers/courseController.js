import bcrypt from 'bcrypt';
import Instructor from '../models/instructorModel.js';
import Course from '../models/courseModel.js';
import { cloudinaryInstance } from '../config/cloudinary.js';

// Get all courses
export const getCourses = async (req, res) => {
    const courses = await Course.find();
    res.send(courses);
}

//Create new course
export const createCourse = async (req, res) => {
    try {
        if (!req.file) {
            return res.send("File not visible");
        }
        cloudinaryInstance.uploader.upload(req.file.path, async (err, result) => {
            if (err) {
                console.log(err, "error");
                res.status(500).json({
                    success: false,
                    message: "Error"
                });
            }

            const imageUrl = result.url;

            const { title, description, price, instructorEmail} = req.body;

            const findInstructor = await Instructor.findOne({email: instructorEmail});
            if (!findInstructor) {
                return res.send("Please add the instructor");
            }

            const newCourse = new Course({
                title,
                description,
                price,
                instructor: findInstructor._id,
                image: imageUrl
            });

            const newCourseCreated = await newCourse.save();

            if (!newCourseCreated) {
                return res.send("Course not created");
            }
            return res.send(newCourseCreated);
        });
    } catch (error) {
        console.log("Something went wrong", error);
        res.send("Course creation failed");
    }
}

//Update course
export const updateCourse = async (req, res) => {
    const id = req.params.id;

    const { description, price, instructor } = req.body;
  
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: id },
      { description, price, instructor },
      {
        new: true,
      }
    );
  
    if (!updatedCourse) {
      return res.send("Course is not updated");
    }
    console.log(updatedCourse);
    return res.send(updatedCourse);
  };

  //Delete Course
  export const deleteCourse = async (req, res) => {
    const id = req.params.id;
    const deleteId = await Course.deleteOne({ _id: id });
    if (!deleteId) {
      return res.send("not deleted");
    }
    res.send("deleted course");
  };