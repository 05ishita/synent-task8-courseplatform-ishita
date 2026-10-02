import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🚀 Learn. Build. Grow.</span>

          <h1>
            Learn skills that
            <span> build your future.</span>
          </h1>

          <p>
            Explore practical courses, learn from structured lessons and
            track your progress from one simple platform.
          </p>

          <div className="hero-actions">
            <Link to="/courses" className="primary-btn">
              Explore Courses
            </Link>

            <Link to="/register" className="secondary-btn">
              Get Started
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="floating-icon">💻</div>
          <h3>Full Stack Development</h3>
          <p>React • Node.js • Express • MongoDB</p>

          <div className="progress-demo">
            <div></div>
          </div>

          <small>Continue learning →</small>
        </div>
      </section>

      <section className="features">
        <div className="section-heading">
          <span>WHY LEARNIFY?</span>
          <h2>Everything you need to learn</h2>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div>📚</div>
            <h3>Structured Courses</h3>
            <p>
              Learn through organized modules and lessons designed for
              practical learning.
            </p>
          </div>

          <div className="feature-card">
            <div>🎯</div>
            <h3>Track Progress</h3>
            <p>
              Keep track of your completed lessons and continue where you
              left off.
            </p>
          </div>

          <div className="feature-card">
            <div>💡</div>
            <h3>Practical Skills</h3>
            <p>
              Build knowledge around technologies used in real-world
              development.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;