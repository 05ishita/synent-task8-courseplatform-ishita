import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function Admin() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Web Development",
    thumbnail: "",
  });

  const token = localStorage.getItem("synent_token");

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data.courses);
    } catch (err) {
      setError("Unable to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createCourse = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.post(
        `${API_URL}/courses`,
        {
          ...form,
          price: Number(form.price),
          modules: [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Course created successfully.");

      setForm({
        title: "",
        description: "",
        price: "",
        category: "Web Development",
        thumbnail: "",
      });

      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course.");
    }
  };

  const deleteCourse = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Course deleted successfully.");
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete course.");
    }
  };

  return (
    <main className="page-container">
      <section className="dashboard-header">
        <div>
          <span>ADMIN PANEL</span>
          <h1>Course Management</h1>
          <p>Create and manage courses on the Learnify platform.</p>
        </div>

        <div className="dashboard-stat">
          <strong>{courses.length}</strong>
          <span>Total Courses</span>
        </div>
      </section>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <section className="admin-form-card">
        <div className="section-heading">
          <span>COURSE MANAGEMENT</span>
          <h2>Create New Course</h2>
        </div>

        <form onSubmit={createCourse} className="admin-form">
          <div className="form-row">
            <div>
              <label>Course Title</label>
              <input
                name="title"
                placeholder="e.g. React Development"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Category</label>
              <input
                name="category"
                placeholder="Web Development"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Course description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            required
          />

          <div className="form-row">
            <div>
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                placeholder="999"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Thumbnail URL</label>
              <input
                name="thumbnail"
                placeholder="https://..."
                value={form.thumbnail}
                onChange={handleChange}
              />
            </div>
          </div>

          <button className="primary-btn" type="submit">
            + Create Course
          </button>
        </form>
      </section>

      <section className="admin-courses">
        <div className="section-heading">
          <span>DATABASE COURSES</span>
          <h2>Manage Courses</h2>
        </div>

        {loading ? (
          <div className="status-box">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="status-box">No courses available.</div>
        ) : (
          <div className="admin-course-list">
            {courses.map((course) => (
              <article className="admin-course-item" key={course._id}>
                <div>
                  <span className="course-category">{course.category}</span>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>

                  <div className="course-meta">
                    <span>
                      📚 {course.modules?.length || 0} modules
                    </span>
                    <strong>₹{course.price}</strong>
                  </div>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => deleteCourse(course._id)}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Admin;