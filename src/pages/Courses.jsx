import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Courses() {
  const { courses, enrollCourse, enrollments, user, joinWaitlist, waitlist } = useContext(AuthContext);
  const normalizeCode = (rawCode) => String(rawCode || "").trim().toUpperCase();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterCredits, setFilterCredits] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  // Check if user is already enrolled in a course
  const isEnrolled = (courseCode) => {
    const normalizedCourseCode = normalizeCode(courseCode);
    return enrollments.some(
      e => e.studentEmail === user?.email && normalizeCode(e?.course?.code) === normalizedCourseCode
    );
  };

  // Check if user is already waitlisted
  const isWaitlisted = (courseCode) => {
    const normalizedCourseCode = normalizeCode(courseCode);
    return waitlist.some(
      w => w.studentEmail === user?.email && normalizeCode(w?.course?.code) === normalizedCourseCode
    );
  };

  // Get enrollment count for a course
  const getEnrollmentCount = (courseCode) => {
    const normalizedCourseCode = normalizeCode(courseCode);
    const course = courses.find(c => normalizeCode(c?.code) === normalizedCourseCode);
    return Number(course?.enrolled || 0);
  };

  // Check if course is full
  const isFull = (course) => {
    return getEnrollmentCount(course.code) >= course.capacity;
  };

  // Get available seats
  const getAvailableSeats = (course) => {
    return course.capacity - getEnrollmentCount(course.code);
  };

  // Get unique departments safely
  const departments = [...new Set(courses.map(c => c.code ? c.code.substring(0, 2) : "UN"))];

  // Filter and sort courses robustly
  const filteredCourses = courses
    .filter(course => {
      const courseName = course.name || course.title || "";
      const courseCode = course.code || "";
      const sTerm = searchTerm.toLowerCase();

      const matchesSearch = 
        courseName.toLowerCase().includes(sTerm) ||
        courseCode.toLowerCase().includes(sTerm);
      
      const matchesDepartment = 
        filterDepartment === "All" || courseCode.startsWith(filterDepartment);
      
      const matchesCredits = 
        filterCredits === "All" || course.credits === parseInt(filterCredits);
      
      return matchesSearch && matchesDepartment && matchesCredits;
    })
    .sort((a, b) => {
      const nameA = a.name || a.title || "";
      const nameB = b.name || b.title || "";
      const codeA = a.code || "";
      const codeB = b.code || "";

      switch (sortBy) {
        case "name":
          return nameA.localeCompare(nameB);
        case "code":
          return codeA.localeCompare(codeB);
        case "credits":
          return (b.credits || 0) - (a.credits || 0);
        case "availability":
          return getAvailableSeats(b) - getAvailableSeats(a);
        default:
          return 0;
      }
    });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>📚 Available Courses</h2>
          <p className="subtitle">Browse and enroll in courses for this semester</p>
        </div>
        <button 
          className="compare-courses-btn"
          onClick={() => navigate('/compare-courses')}
        >
          🔍 Compare Courses
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search courses by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={filterCredits}
            onChange={(e) => setFilterCredits(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Credits</option>
            <option value="2">2 Credits</option>
            <option value="3">3 Credits</option>
            <option value="4">4 Credits</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Sort by Name</option>
            <option value="code">Sort by Code</option>
            <option value="credits">Sort by Credits</option>
            <option value="availability">Sort by Availability</option>
          </select>
        </div>
      </div>

      <div className="course-count">
        Showing {filteredCourses.length} of {courses.length} courses
      </div>

      <div className="course-grid">
        {filteredCourses.length === 0 ? (
          <div className="empty-state">
            <p>No courses found matching your criteria.</p>
          </div>
        ) : (
          filteredCourses.map(course => {
          const enrolled = isEnrolled(course.code);
          const enrollCount = getEnrollmentCount(course.code);
          const availableSeats = getAvailableSeats(course);
          const courseFull = isFull(course);
          
          return (
            <div key={course.code} className="course-card enhanced-course-card">
              <div className="course-header">
                <span className="course-code-badge">{course.code}</span>
                <span className="credit-badge">{course.credits} Credits</span>
              </div>
              
              <h3>{course.name}</h3>
              
              <div className="course-meta">
                <p>📅 <strong>Day:</strong> {String(course.day || "TBA").trim() || "TBA"}</p>
                <p>⏰ <strong>Time:</strong> {String(course.time || "TBA").trim() || "TBA"}</p>
                <p>👥 <strong>Enrolled:</strong> {enrollCount}/{course.capacity}</p>
                <p>
                  <strong>Available:</strong> 
                  <span className={availableSeats === 0 ? "seats-full" : availableSeats < 5 ? "seats-low" : "seats-available"}>
                    {" "}{availableSeats} seats
                  </span>
                </p>
                {((Array.isArray(course.prerequisites) && course.prerequisites.length > 0) ||
                  (!Array.isArray(course.prerequisites) && String(course.prerequisites || "").trim().length > 0)) && (
                  <p>
                    <strong>Prerequisites:</strong> 
                    <span className="prerequisites-text">
                      {" "}{Array.isArray(course.prerequisites)
                        ? course.prerequisites.join(", ")
                        : String(course.prerequisites || "").trim()}
                    </span>
                  </p>
                )}
              </div>

              {enrolled ? (
                <button className="enrolled-btn" disabled>
                  ✅ Already Enrolled
                </button>
              ) : isWaitlisted(course.code) ? (
                <button className="waitlist-btn" disabled>
                  ⏳ Waitlisted
                </button>
              ) : user?.registrationApproved !== 1 ? (
                <button 
                  className="locked-btn"
                  disabled
                  onClick={() => alert("🔒 Your account must be approved by an Admin before you can enroll in courses.")}
                >
                  🔒 Enrollment Locked
                </button>
              ) : courseFull ? (
                <button
                  className="waitlist-btn"
                  onClick={() => joinWaitlist(course)}
                >
                  ⏳ Join Waitlist
                </button>
              ) : (
                <button
                  className="primary-btn"
                  onClick={() => enrollCourse(course)}
                >
                  Enroll Now
                </button>
              )}
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}

export default Courses;