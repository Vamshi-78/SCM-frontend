function CourseCard({ course, onSelect }) {
  return (
    <div className="course-card">
      <h3>{course.title || course.name || "Untitled Course"}</h3>
      <p>📅 {String(course.day || "TBA").trim() || "TBA"} | ⏰ {String(course.time || "TBA").trim() || "TBA"}</p>
      <p>🎓 Credits: {course.credits}</p>
      <button onClick={() => onSelect(course)}>
        Enroll Now
      </button>
    </div>
  );
}

export default CourseCard;