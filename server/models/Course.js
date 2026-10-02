const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  videoUrl: {
    type: String,
    default: "",
  },

  duration: {
    type: String,
    default: "10 min",
  },
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "Web Development",
    },

    modules: [moduleSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);