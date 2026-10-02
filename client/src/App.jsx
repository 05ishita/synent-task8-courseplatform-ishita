



import Admin from "./pages/Admin";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("synent_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("synent_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("synent_user");
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem("synent_token");
    localStorage.removeItem("synent_user");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={logout} />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            user ? <Navigate to="/courses" /> : <Login setUser={setUser} />
          }
        />

        <Route
          path="/register"
          element={
            user ? <Navigate to="/courses" /> : <Register setUser={setUser} />
          }
        />

        <Route path="/courses" element={<Courses />} />

        <Route path="/courses/:id" element={<CourseDetails user={user} />} />

        <Route
          path="/dashboard"
          element={
            user ? <Dashboard user={user} /> : <Navigate to="/login" />
          }
        />
        <Route
  path="/admin"
  element={
    user?.role === "admin" ? <Admin /> : <Navigate to="/courses" />
  }
/>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;