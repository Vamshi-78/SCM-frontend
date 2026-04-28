import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function CourseComparison() {
  const { courses, enrollments, enrollCourse } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedCourses, setSelectedCourses] = useState([]);

  const toggleCourseSelection = (course) => {
    if (selectedCourses.find(c => c.code === course.code)) {
      setSelectedCourses(selectedCourses.filter(c => c.code !== course.code));
    } else {
      if (selectedCourses.length < 3) {
        setSelectedCourses([...selectedCourses, course]);
      } else {
        alert("⚠ You can compare up to 3 courses at a time");
      }
    }
  };

  const getEnrollmentCount = (courseCode) => {
    return enrollments.filter(e => e.course.code === courseCode).length;
  };

  const getAvailableSeats = (course) => {
    return course.capacity - getEnrollmentCount(course.code);
  };

  const clearComparison = () => {
    setSelectedCourses([]);
  };

  const ComparisonRow = ({ label, icon, values, colorMap }) => (
    <div className="comparison-row">
      <div className="comparison-label">
        {icon && <span className="row-icon">{icon}</span>}
        <strong>{label}</strong>
      </div>
      <div className="comparison-values">
        {values.map((value, index) => (
          <div 
            key={index} 
            className="comparison-cell"
            style={colorMap ? { color: colorMap(value) } : {}}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="comparison-header">
        <div>
          <h2>🔍 Course Comparison</h2>
          <p className="subtitle">Compare courses side-by-side to make better decisions</p>
        </div>
        <button className="back-btn" onClick={() => navigate('/courses')}>
          ← Back to Courses
        </button>
      </div>

      {/* Course Selection */}
      <div className="card course-selector">
        <h3>📚 Select Courses to Compare (Max 3)</h3>
        <div className="course-chips-grid">
          {courses.map(course => (
            <div
              key={course.code}
              className={`course-chip-selectable ${
                selectedCourses.find(c => c.code === course.code) ? "selected" : ""
              }`}
              onClick={() => toggleCourseSelection(course)}
            >
              <input
                type="checkbox"
                checked={!!selectedCourses.find(c => c.code === course.code)}
                onChange={() => {}}
              />
              <span>{course.code}</span>
            </div>
          ))}
        </div>
        {selectedCourses.length > 0 && (
          <button className="clear-selection-btn" onClick={clearComparison}>
            Clear Selection
          </button>
        )}
      </div>

      {/* Comparison Table */}
      {selectedCourses.length > 0 ? (
        <div className="card comparison-table">
          <div className="comparison-header-row">
            <div className="comparison-label-header">
              <strong>Attributes</strong>
            </div>
            <div className="comparison-values">
              {selectedCourses.map(course => (
                <div key={course.code} className="comparison-header-cell">
                  <div className="course-code-large">{course.code}</div>
                  <div className="course-name-small">{course.name}</div>
                </div>
              ))}
            </div>
          </div>

          <ComparisonRow
            label="Credits"
            icon="💳"
            values={selectedCourses.map(c => `${c.credits} credits`)}
          />

          <ComparisonRow
            label="Day"
            icon="📅"
            values={selectedCourses.map(c => c.day)}
          />

          <ComparisonRow
            label="Time"
            icon="⏰"
            values={selectedCourses.map(c => c.time)}
          />

          <ComparisonRow
            label="Capacity"
            icon="👥"
            values={selectedCourses.map(c => `${c.capacity} students`)}
          />

          <ComparisonRow
            label="Enrolled"
            icon="✅"
            values={selectedCourses.map(c => getEnrollmentCount(c.code))}
          />

          <ComparisonRow
            label="Available Seats"
            icon="💺"
            values={selectedCourses.map(c => getAvailableSeats(c))}
            colorMap={(val) => 
              val === 0 ? "#ef4444" : val < 5 ? "#f59e0b" : "#10b981"
            }
          />

          <ComparisonRow
            label="Prerequisites"
            icon="📋"
            values={selectedCourses.map(c => 
              c.prerequisites && c.prerequisites.length > 0 
                ? c.prerequisites.join(", ") 
                : "None"
            )}
          />

          {/* Action Buttons */}
          <div className="comparison-row comparison-actions">
            <div className="comparison-label"></div>
            <div className="comparison-values">
              {selectedCourses.map(course => (
                <div key={course.code} className="comparison-cell">
                  <button
                    className="compare-enroll-btn"
                    onClick={() => {
                      enrollCourse(course);
                      navigate('/courses');
                    }}
                  >
                    Enroll Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Conflict Detection */}
          {selectedCourses.length > 1 && (
            <div className="conflict-detection">
              <h4>⚠ Conflict Detection</h4>
              {(() => {
                const conflicts = [];
                for (let i = 0; i < selectedCourses.length; i++) {
                  for (let j = i + 1; j < selectedCourses.length; j++) {
                    if (
                      selectedCourses[i].day === selectedCourses[j].day &&
                      selectedCourses[i].time === selectedCourses[j].time
                    ) {
                      conflicts.push(
                        `${selectedCourses[i].code} and ${selectedCourses[j].code} conflict (${selectedCourses[i].day} at ${selectedCourses[i].time})`
                      );
                    }
                  }
                }
                return conflicts.length > 0 ? (
                  <div className="conflict-warnings">
                    {conflicts.map((conflict, i) => (
                      <div key={i} className="conflict-warning">
                        ⚠ {conflict}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-conflicts">
                    ✅ No schedule conflicts detected!
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      ) : (
        <div className="empty-comparison">
          <div className="empty-icon">📊</div>
          <h3>No Courses Selected</h3>
          <p>Select 1-3 courses from above to start comparing them</p>
        </div>
      )}
    </div>
  );
}

export default CourseComparison;
