const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Enroll in a course
router.post("/:courseId", protect, async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "You are already enrolled in this course.",
        enrollment: existingEnrollment,
      });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId,
      paymentStatus: course.price === 0 ? "paid" : "pending",
    });

    res.status(201).json({
      message: "Enrollment successful.",
      enrollment,
    });
  } catch (error) {
    console.error("Enrollment error:", error);

    res.status(500).json({
      message: "Failed to enroll in course.",
    });
  }
});

// Get logged-in user's enrollments
router.get("/my-courses", protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.user._id,
    })
      .populate("course")
      .sort({ createdAt: -1 });

    res.json({
      enrollments,
    });
  } catch (error) {
    console.error("Get enrollments error:", error);

    res.status(500).json({
      message: "Failed to fetch enrolled courses.",
    });
  }
});

// Get single enrollment
router.get("/:id", protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("course");

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found.",
      });
    }

    res.json({
      enrollment,
    });
  } catch (error) {
    console.error("Get enrollment error:", error);

    res.status(500).json({
      message: "Failed to fetch enrollment.",
    });
  }
});

module.exports = router;