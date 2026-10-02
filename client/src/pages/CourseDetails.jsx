import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function CourseDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/${id}`);
      setCourse(response.data.course);
    } catch (error) {
      setError("Course not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setEnrolling(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("synent_token");

      const response = await axios.post(
        `${API_URL}/enrollments/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Enrollment failed."
      );
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <div className="status-box">Loading course...</div>;
  }

  if (error && !course) {
    return <div className="status-box">{error}</div>;
  }

  return (
    <main className="details-page">
      <section className="course-hero">
        <div className="details-image">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} />
          ) : (
            <div className="course-placeholder">💻</div>
          )}
        </div>

        <div className="details-info">
          <span className="course-category">
            {course.category}
          </span>

          <h1>{course.title}</h1>

          <p>{course.description}</p>

          <div className="price">
            ₹{course.price}
          </div>

          <button
            className="primary-btn"
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? "Enrolling..." : "Enroll Now"}
          </button>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </section>

      <section className="curriculum">
        <div className="section-heading">
          <span>COURSE CONTENT</span>
          <h2>Course Curriculum</h2>
        </div>

        {course.modules?.map((module, moduleIndex) => (
          <div className="module-card" key={module._id || moduleIndex}>
            <div className="module-header">
              <h3>
                Module {moduleIndex + 1}: {module.title}
              </h3>

              <span>
                {module.lessons?.length || 0} lessons
              </span>
            </div>

            <div className="lesson-list">
              {module.lessons?.map((lesson, lessonIndex) => (
                <div
                  className="lesson"
                  key={lesson._id || lessonIndex}
                >
                  <span className="lesson-number">
                    {lessonIndex + 1}
                  </span>

                  <div>
                    <strong>{lesson.title}</strong>
                    <small>{lesson.duration}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="back-link">
        <Link to="/courses">← Back to Courses</Link>
      </div>
    </main>
  );
}

export default CourseDetails;