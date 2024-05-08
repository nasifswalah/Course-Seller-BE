import bcrypt from 'bcrypt';
import Instructor from '../models/instructorModel';
import Course from '../models/courseModel';
import { cloudinaryInstance } from '../config/cloudinary';

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