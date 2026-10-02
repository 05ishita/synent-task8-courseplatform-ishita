import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async (searchValue = "") => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/courses`, {
        params: searchValue ? { search: searchValue } : {},
      });

      setCourses(response.data.courses);
    } catch (error) {
      setError("Unable to load courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses(search);
  };

  return (
    <main className="page-container">
      <section className="page-heading">
        <div>
          <span>LEARNIFY COURSES</span>
          <h1>Explore Courses</h1>
          <p>Find courses and build practical development skills.</p>
        </div>

        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">Search</button>
        </form>
      </section>

      {loading && <div className="status-box">Loading courses...</div>}

      {error && <div className="error-message">{error}</div>}

      {!loading && courses.length === 0 && (
        <div className="status-box">
          No courses found.
        </div>
      )}

      <section className="course-grid">
        {courses.map((course) => (
          <article className="course-card" key={course._id}>
            <div className="course-image">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} />
              ) : (
                <div className="course-placeholder">💻</div>
              )}
            </div>

            <div className="course-content">
              <span className="course-category">
                {course.category}
              </span>

              <h2>{course.title}</h2>

              <p>{course.description}</p>

              <div className="course-meta">
                <span>
                  📚 {course.modules?.length || 0} modules
                </span>

                <strong>₹{course.price}</strong>
              </div>

              <Link
                to={`/courses/${course._id}`}
                className="primary-btn course-btn"
              >
                View Course
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Courses;