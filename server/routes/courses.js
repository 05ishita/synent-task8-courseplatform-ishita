const express = require("express");
const Course = require("../models/Course");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const courses = await Course.find(filter)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.json({
      courses,
    });
  } catch (error) {
    console.error("Get courses error:", error);

    res.status(500).json({
      message: "Failed to fetch courses.",
    });
  }
});

// Get single course
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "createdBy",
      "name"
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    res.json({
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch course.",
    });
  }
});

// Admin: create course
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      category,
      modules,
    } = req.body;

    if (!title || !description || price === undefined) {
      return res.status(400).json({
        message: "Title, description and price are required.",
      });
    }

    const course = await Course.create({
      title,
      description,
      price,
      thumbnail,
      category,
      modules: modules || [],
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Course created successfully.",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);

    res.status(500).json({
      message: "Failed to create course.",
    });
  }
});

// Admin: update course
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    res.json({
      message: "Course updated successfully.",
      course,
    });
  } catch (error) {
    console.error("Update course error:", error);

    res.status(500).json({
      message: "Failed to update course.",
    });
  }
});

// Admin: delete course
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    res.json({
      message: "Course deleted successfully.",
    });
  } catch (error) {
    console.error("Delete course error:", error);

    res.status(500).json({
      message: "Failed to delete course.",
    });
  }
});

module.exports = router;