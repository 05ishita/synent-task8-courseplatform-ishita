import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function Dashboard({ user }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem("synent_token");

      const response = await axios.get(
        `${API_URL}/enrollments/my-courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEnrollments(response.data.enrollments);
    } catch (error) {
      setError("Unable to load your courses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <section className="dashboard-header">
        <div>
          <span>MY LEARNING</span>
          <h1>Welcome, {user.name} 👋</h1>
          <p>
            Continue learning and keep building your skills.
          </p>
        </div>

        <div className="dashboard-stat">
          <strong>{enrollments.length}</strong>
          <span>Enrolled Courses</span>
        </div>
      </section>

      {loading && (
        <div className="status-box">
          Loading your courses...
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!loading && enrollments.length === 0 && (
        <div className="empty-dashboard">
          <div>📚</div>
          <h2>No courses yet</h2>
          <p>Explore our courses and start learning.</p>

          <Link to="/courses" className="primary-btn">
            Explore Courses
          </Link>
        </div>
      )}

      <section className="dashboard-grid">
        {enrollments.map((enrollment) => {
          const course = enrollment.course;

          if (!course) return null;

          return (
            <article
              className="enrolled-card"
              key={enrollment._id}
            >
              <div className="enrolled-image">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                  />
                ) : (
                  <div className="course-placeholder">💻</div>
                )}
              </div>

              <div className="enrolled-content">
                <span className="course-category">
                  {course.category}
                </span>

                <h2>{course.title}</h2>

                <div className="progress-row">
                  <span>Progress</span>
                  <strong>{enrollment.progress}%</strong>
                </div>

                <div className="progress-bar">
                  <div
                    style={{
                      width: `${enrollment.progress}%`,
                    }}
                  ></div>
                </div>

                <div className="enrollment-status">
                  <span>
                    Payment: {enrollment.paymentStatus}
                  </span>
                </div>

                <Link
                  to={`/courses/${course._id}`}
                  className="primary-btn course-btn"
                >
                  Continue Learning
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default Dashboard;