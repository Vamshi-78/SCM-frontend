import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/dashboard.css";

function AdminDashboard() {
  const { courses, enrollments, waitlist, supportTickets } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");

  // Unique students
  const uniqueStudents = [...new Set(enrollments.map(e => e.studentUsername))];

  // Department stats
  const departmentStats = courses.reduce((acc, course) => {
    const dept = course.code.substring(0, 4);
    if (!acc[dept]) {
      acc[dept] = { name: dept, courseCount: 0, enrollmentCount: 0, capacity: 0 };
    }
    acc[dept].courseCount++;
    acc[dept].enrollmentCount += enrollments.filter(e => e.course.code === course.code).length;
    acc[dept].capacity += course.capacity;
    return acc;
  }, {});

  // Time stats
  const timeSlotStats = courses.reduce((acc, course) => {
    if (!acc[course.time]) {
      acc[course.time] = { time: course.time, enrollmentCount: 0 };
    }
    acc[course.time].enrollmentCount += enrollments.filter(e => e.course.code === course.code).length;
    return acc;
  }, {});

  // Day stats
  const dayStats = courses.reduce((acc, course) => {
    if (!acc[course.day]) {
      acc[course.day] = { day: course.day, courseCount: 0 };
    }
    acc[course.day].courseCount++;
    return acc;
  }, {});

  // Capacity
  const totalCapacity = courses.reduce((sum, c) => sum + c.capacity, 0);
  const capacityUtilization = totalCapacity > 0
    ? ((enrollments.length / totalCapacity) * 100).toFixed(1)
    : 0;

  // Filter
  const filteredEnrollments = enrollments.filter(e =>
    e.studentUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
  <div className="page-container">

    {/* HEADER */}
    <div className="page-header">
      <h2>Admin Dashboard</h2>
      <p className="subtitle">System overview and performance insights</p>
    </div>

    {/* KPI CARDS */}
    <div className="dashboard-cards">
      <div className="card stat-card">
        <h4>Total Courses</h4>
        <h1>{courses.length}</h1>
      </div>

      <div className="card stat-card">
        <h4>Total Students</h4>
        <h1>{uniqueStudents.length}</h1>
      </div>

      <div className="card stat-card">
        <h4>Total Enrollments</h4>
        <h1>{enrollments.length}</h1>
      </div>

      <div className="card stat-card">
        <h4>Avg / Course</h4>
        <h1>
          {courses.length > 0
            ? (enrollments.length / courses.length).toFixed(1)
            : 0}
        </h1>
      </div>

      <div className="card stat-card">
        <h4>Waitlist</h4>
        <h1>{waitlist.length}</h1>
      </div>

      <div className="card stat-card">
        <h4>Support Tickets</h4>
        <h1>{supportTickets.length}</h1>
      </div>
    </div>

    {/* ANALYTICS */}
    <div className="analytics-grid">

      <div className="card">
        <h3>Department Utilization</h3>
        {Object.values(departmentStats).map((dept) => (
          <div key={dept.name} className="dept-stat-item">
            <span>{dept.name}</span>
            <span>{dept.enrollmentCount}/{dept.capacity}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Time Slot Usage</h3>
        {Object.values(timeSlotStats).map((slot) => (
          <div key={slot.time} className="dept-stat-item">
            <span>{slot.time}</span>
            <span>{slot.enrollmentCount}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Daily Distribution</h3>
        {Object.values(dayStats).map((day) => (
          <div key={day.day} className="dept-stat-item">
            <span>{day.day}</span>
            <span>{day.courseCount} courses</span>
          </div>
        ))}
      </div>

    </div>

  </div>
);
}

export default AdminDashboard;