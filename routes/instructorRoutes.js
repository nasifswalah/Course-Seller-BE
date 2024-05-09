import express from "express";
import {
  getCourses,
  createCourse,
  deleteCourse,
  updateCourse,
} from "../controllers/courseController.js";
import upload from "../middlewares/uploadMiddleware.js";
import {
  getAllInstructors,
  singin,
  singup,
} from "../controllers/instuctorController.js";
import authenticateAdmin from "../middlewares/adminMiddleware.js";
import authenticateInstructor from "../middlewares/instructorMiddleware.js";

const instructorRouter = express.Router();

instructorRouter.post("/signup", singup);
instructorRouter.post("/signin", singin);

instructorRouter.get("/get-courses", getCourses);
instructorRouter.get("/get-instructors", authenticateInstructor, getAllInstructors);

instructorRouter.post("/add-courses", authenticateAdmin, upload.single("image"), createCourse);

instructorRouter.put("/update-courses/:id", updateCourse);

instructorRouter.delete("/delete-instructors/:id", deleteCourse);

export default instructorRouter;