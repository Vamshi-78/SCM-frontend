import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Courses from "./pages/Courses";
import Timetable from "./pages/Timetable";
import Profile from "./pages/Profile";
import ManageCourses from "./pages/ManageCourses";
import Help from "./pages/Help";
import SupportManagement from "./pages/SupportManagement";
import Notifications from "./pages/Notifications";
import CourseComparison from "./pages/CourseComparison";
import AdminRegistrations from "./pages/AdminRegistrations";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import "./styles/layout.css";

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-section">
        <Navbar />
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
}

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/register" element={<Signup />} />

        <Route path="/student" element={
          <ProtectedRoute>
            <Layout>
              <StudentDashboard />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/courses" element={
          <ProtectedRoute>
            <Layout>
              <Courses />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/compare-courses" element={
          <ProtectedRoute>
            <Layout>
              <CourseComparison />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/timetable" element={
          <ProtectedRoute>
            <Layout>
              <Timetable />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <Layout>
        <AdminDashboard />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/registrations"
  element={
    <ProtectedRoute>
      <Layout>
        <AdminRegistrations />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/manage-courses"
  element={
    <ProtectedRoute>
      <Layout>
        <ManageCourses />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/help"
  element={
    <ProtectedRoute>
      <Layout>
        <Help />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <Layout>
        <Notifications />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/support-management"
  element={
    <ProtectedRoute>
      <Layout>
        <SupportManagement />
      </Layout>
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;