import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/layout.css";
import "../styles/dashboard.css";

function ManageCourses() {
  const { courses, addCourse, deleteCourse, editCourse, enrollments } = useContext(AuthContext);

  const resolveEnrollmentCourseCode = (enrollment) => {
    return (
      enrollment?.course?.code ||
      enrollment?.courseCode ||
      enrollment?.course_code ||
      enrollment?.code ||
      ""
    )
      .toString()
      .trim()
      .toUpperCase();
  };

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [credits, setCredits] = useState("");
  const [capacity, setCapacity] = useState("");
  const [prerequisites, setPrerequisites] = useState("");

  const [editingCode, setEditingCode] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleAddCourse = async () => {
    if (!code || !name || !day || !time || !credits) {
      alert("⚠ Please fill all required fields");
      return;
    }

    if (day === "TBA" || time === "TBA") {
      alert("⚠ Please select a valid day and time. TBA is not allowed.");
      return;
    }

    // Check if course code already exists locally
    if (courses.some(c => c.code === code)) {
      alert("⚠ Course code already exists!");
      return;
    }

    const newCourse = {
      code: code.toUpperCase(),
      name: name.toUpperCase(),
      title: name.toUpperCase(),
      day,
      time,
      credits: Number(credits),
      capacity: Number(capacity) || 30,
      enrolled: 0,
      prerequisites: prerequisites || ""  // Send as STRING, not array
    };

    try {
      await addCourse(newCourse);
      alert("✅ Course perfectly saved to MySQL Database!");

      // Clear inputs
      setCode("");
      setName("");
      setDay("");
      setTime("");
      setCredits("");
      setCapacity("");
      setPrerequisites("");
    } catch (err) {
      console.error(err);
      alert("❌ Backend rejected the course. Check your Spring Boot console for errors!");
    }
  };

  const handleDeleteCourse = async (courseCode) => {
    const normalizedCode = String(courseCode || "").trim().toUpperCase();
    const enrolled = enrollments.filter(
      (e) => resolveEnrollmentCourseCode(e) === normalizedCode
    ).length;

    if (enrolled > 0) {
      alert(
        `Cannot delete course ${normalizedCode}: ${enrolled} active enrollment(s) exist. Please unenroll students first.`
      );
      return;
    }

    if (!window.confirm("Are you sure you want to delete this course?")) {
        return;
    }

    try {
      await deleteCourse(courseCode);
    } catch (err) {
      // Error alerts are already handled in context; keep this silent.
      console.error("Delete course action failed:", err);
    }
  };

  const handleEditClick = (course) => {
    setEditingCode(course.code);
    setEditFormData({
      name: course.name || "",
      day: (course.day && course.day !== "TBA") ? course.day : "Mon",
      time: (course.time && course.time !== "TBA") ? course.time : "9AM",
      credits: course.credits || 0,
      capacity: course.capacity || 30,
      prerequisites: course.prerequisites || ""  // Keep as string
    });
  };

  const handleSaveEdit = async (courseCode) => {
    if (!editFormData.day || !editFormData.time || editFormData.day === "TBA" || editFormData.time === "TBA") {
      alert("⚠ Please select a valid day and time. TBA is not allowed.");
      return;
    }

    await editCourse(courseCode, {
      ...editFormData,
      credits: Number(editFormData.credits),
      capacity: Number(editFormData.capacity),
      prerequisites: editFormData.prerequisites || ""  // Send as STRING
    });
    setEditingCode(null);
  };

  const getEnrollmentCount = (courseCode) => {
    const normalizedCode = String(courseCode || "").trim().toUpperCase();
    return enrollments.filter(
      (e) => resolveEnrollmentCourseCode(e) === normalizedCode
    ).length;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>⚙ Manage Courses</h2>
          <p className="subtitle">Add, edit, and remove courses from the system</p>
        </div>
      </div>

      {/* ===== Add Course Form ===== */}
      <div className="card manage-form-card">
        <h3>➕ Add New Course</h3>
        <div className="admin-form">
          <input
            className="table-input"
            placeholder="Course Code (e.g., 24CS2101)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            className="table-input"
            placeholder="Course Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="table-select"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            <option value="">Select Day</option>
            <option value="Mon">Monday</option>
            <option value="Tue">Tuesday</option>
            <option value="Wed">Wednesday</option>
            <option value="Thu">Thursday</option>
            <option value="Fri">Friday</option>
          </select>
          <select
            className="table-select"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="">Select Time</option>
            <option value="9AM">9:00 AM</option>
            <option value="10AM">10:00 AM</option>
            <option value="11AM">11:00 AM</option>
            <option value="12PM">12:00 PM</option>
            <option value="2PM">2:00 PM</option>
            <option value="3PM">3:00 PM</option>
            <option value="4PM">4:00 PM</option>
          </select>
          <input
            className="table-input"
            placeholder="Credits"
            type="number"
            min="1"
            max="5"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
          />
          <input
            className="table-input"
            placeholder="Capacity (default: 30)"
            type="number"
            min="10"
            max="100"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
          <input
            className="table-input"
            placeholder="Prerequisites (comma-separated codes)"
            value={prerequisites}
            onChange={(e) => setPrerequisites(e.target.value)}
          />
          <button className="primary-btn" onClick={handleAddCourse}>
            ➕ Add Course
          </button>
        </div>
      </div>

      {/* ===== Course Table ===== */}
      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: "20px" }}>📚 All Courses ({courses.length})</h3>
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Day</th>
                <th>Time</th>
                <th>Credits</th>
                <th>Capacity</th>
                <th>Enrolled</th>
                <th>Prerequisites</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.code}>
                  <td><strong>{course.code}</strong></td>
                  
                  {editingCode === course.code ? (
                    <>
                      <td><input className="table-input" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} /></td>
                      <td>
                        <select className="table-select" value={editFormData.day} onChange={e => setEditFormData({...editFormData, day: e.target.value})}>
                          <option value="Mon">Mon</option><option value="Tue">Tue</option><option value="Wed">Wed</option><option value="Thu">Thu</option><option value="Fri">Fri</option>
                        </select>
                      </td>
                      <td>
                        <select className="table-select" value={editFormData.time} onChange={e => setEditFormData({...editFormData, time: e.target.value})}>
                          <option value="9AM">9AM</option><option value="10AM">10AM</option><option value="11AM">11AM</option><option value="12PM">12PM</option><option value="2PM">2PM</option><option value="3PM">3PM</option><option value="4PM">4PM</option>
                        </select>
                      </td>
                      <td><input className="table-input" type="number" min="1" max="5" value={editFormData.credits} onChange={e => setEditFormData({...editFormData, credits: e.target.value})} /></td>
                      <td><input className="table-input" type="number" min="1" value={editFormData.capacity} onChange={e => setEditFormData({...editFormData, capacity: e.target.value})} /></td>
                      <td>
                        <span className="enrollment-count-badge">
                          {getEnrollmentCount(course.code)}
                        </span>
                      </td>
                      <td><input className="table-input" value={editFormData.prerequisites} onChange={e => setEditFormData({...editFormData, prerequisites: e.target.value})} placeholder="CS101" /></td>
                      <td>
                        <div className="table-actions">
                          <button className="primary-btn compact-btn" onClick={() => handleSaveEdit(course.code)}>💾</button>
                          <button className="cancel-btn compact-btn" onClick={() => setEditingCode(null)}>❌</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{course.name}</td>
                      <td><span className="day-badge">{String(course.day || "TBA").trim() || "TBA"}</span></td>
                      <td><span className="time-badge">{String(course.time || "TBA").trim() || "TBA"}</span></td>
                      <td>{course.credits}</td>
                      <td>{course.capacity || 30}</td>
                      <td>
                        <span className="enrollment-count-badge">
                          {getEnrollmentCount(course.code)}
                        </span>
                      </td>
                      <td>
                        {Array.isArray(course.prerequisites)
                          ? (course.prerequisites.length > 0 ? course.prerequisites.join(", ") : "None")
                          : (String(course.prerequisites || "").trim() || "None")}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="modern-btn compact-btn secondary"
                            onClick={() => handleEditClick(course)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="danger-btn compact-btn"
                            onClick={() => handleDeleteCourse(course.code)}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}

              {courses.length === 0 && (
                <tr>
                  <td colSpan="9" className="no-data">
                    📚 No courses available. Add your first course above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageCourses;