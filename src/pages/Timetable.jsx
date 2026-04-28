import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Timetable() {
  const { enrolledCourses, user } = useContext(AuthContext);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const times = ["9AM", "10AM", "11AM", "12PM", "2PM", "3PM", "4PM"];

  const normalizeDay = (rawDay) => {
    const value = String(rawDay || "").trim().toLowerCase();
    const dayMap = {
      mon: "Mon",
      monday: "Mon",
      tue: "Tue",
      tues: "Tue",
      tuesday: "Tue",
      wed: "Wed",
      wednesday: "Wed",
      thu: "Thu",
      thur: "Thu",
      thurs: "Thu",
      thursday: "Thu",
      fri: "Fri",
      friday: "Fri"
    };
    return dayMap[value] || "TBA";
  };

  const normalizeTime = (rawTime) => {
    const value = String(rawTime || "").trim().toUpperCase();
    if (!value || value === "TBA") return "TBA";

    const directMap = {
      "9AM": "9AM",
      "09AM": "9AM",
      "10AM": "10AM",
      "11AM": "11AM",
      "12PM": "12PM",
      "2PM": "2PM",
      "02PM": "2PM",
      "3PM": "3PM",
      "03PM": "3PM",
      "4PM": "4PM",
      "04PM": "4PM",
      "09:00": "9AM",
      "10:00": "10AM",
      "11:00": "11AM",
      "12:00": "12PM",
      "14:00": "2PM",
      "15:00": "3PM",
      "16:00": "4PM",
      "9:00 AM": "9AM",
      "10:00 AM": "10AM",
      "11:00 AM": "11AM",
      "12:00 PM": "12PM",
      "2:00 PM": "2PM",
      "3:00 PM": "3PM",
      "4:00 PM": "4PM"
    };

    return directMap[value] || value.replace(":00", "") || "TBA";
  };

  const normalizedEnrolledCourses = enrolledCourses.map((course) => ({
    ...course,
    day: normalizeDay(course.day),
    time: normalizeTime(course.time)
  }));

  const scheduledCourses = normalizedEnrolledCourses.filter(
    (c) => days.includes(c.day) && times.includes(c.time)
  );

  const unscheduledCourses = normalizedEnrolledCourses.filter(
    (c) => !days.includes(c.day) || !times.includes(c.time)
  );

  const occupied = new Set(scheduledCourses.map((c) => `${c.day}-${c.time}`));
  const autoPlacedCourses = [];

  unscheduledCourses.forEach((course) => {
    let placed = false;
    for (const day of days) {
      for (const time of times) {
        const slot = `${day}-${time}`;
        if (!occupied.has(slot)) {
          occupied.add(slot);
          autoPlacedCourses.push({
            ...course,
            day,
            time,
            autoPlaced: true
          });
          placed = true;
          break;
        }
      }
      if (placed) break;
    }
  });

  const displayCourses = [...scheduledCourses, ...autoPlacedCourses];

  const exportToText = () => {
    let text = `====================================\n`;
    text += `   WEEKLY TIMETABLE - ${user?.username || 'Student'}\n`;
    text += `   Student Course Manager\n`;
    text += `====================================\n\n`;

    days.forEach(day => {
      text += `${day}:\n`;
      const dayCourses = displayCourses.filter(c => c.day === day);
      if (dayCourses.length === 0) {
        text += `  No classes scheduled\n`;
      } else {
        dayCourses.forEach(course => {
          text += `  ${course.time} - ${course.code}: ${course.name} (${course.credits} credits)\n`;
        });
      }
      text += `\n`;
    });

    text += `\nTotal Enrolled: ${displayCourses.length} courses\n`;
    text += `Total Credits: ${displayCourses.reduce((sum, c) => sum + c.credits, 0)}\n`;
    text += `====================================\n`;

    // Create a blob and download
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable_${user?.username || 'student'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    let text = `WEEKLY TIMETABLE - ${user?.username || 'Student'}\n\n`;
    days.forEach(day => {
      text += `${day}: `;
      const dayCourses = displayCourses.filter(c => c.day === day);
      if (dayCourses.length === 0) {
        text += `No classes`;
      } else {
        text += dayCourses.map(c => `${c.time} ${c.code}`).join(', ');
      }
      text += `\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Timetable copied to clipboard!');
    }).catch(() => {
      alert('❌ Failed to copy to clipboard');
    });
  };

  const printTimetable = () => {
    window.print();
  };

  return (
    <div className="page-container">
      {user?.registrationApproved !== 1 ? (
        <div className="card timetable-lock-card">
          <div className="timetable-lock-icon">🔒</div>
          <h2 className="timetable-lock-title">Timetable Locked</h2>
          <p className="timetable-lock-text">
            Your class schedule is completely locked until an Admin approves your registration request. 
            Please visit your Dashboard to request approval.
          </p>
        </div>
      ) : (
        <>
          <div className="timetable-header">
        <div>
          <h2>🗓 Weekly Timetable</h2>
          <p className="subtitle">
            Your personalized class schedule for the week
          </p>
        </div>
        <div className="export-buttons">
          <button className="export-btn" onClick={exportToText} title="Export as Text File">
            📄 Export
          </button>
          <button className="export-btn" onClick={copyToClipboard} title="Copy to Clipboard">
            📋 Copy
          </button>
          <button className="export-btn" onClick={printTimetable} title="Print Timetable">
            🖨 Print
          </button>
        </div>
      </div>

      <div className="card timetable-card">
        <table className="timetable">
          <thead>
            <tr>
              <th className="time-header">Day / Time</th>
              {times.map(time => <th key={time}>{time}</th>)}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td className="day-cell"><strong>{day}</strong></td>
                {times.map(time => {
                  const course = displayCourses.find(
                    c => c.day === day && c.time === time
                  );
                  return (
                    <td key={time} className={course ? "has-course" : "empty-cell"}>
                      {course ? (
                        <div className="tt-course" title={course.name}>
                          <div className="course-code">{course.code}</div>
                          <div className="course-name-mini">{course.name}{course.autoPlaced ? " (TBA)" : ""}</div>
                        </div>
                      ) : (
                        <span className="free-slot">Free</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Unscheduled / Online Courses */}
      {unscheduledCourses.length > 0 && (
        <div className="card timetable-note-card">
          <h3>
            📌 Auto-Placed Courses Without Specific Timings
          </h3>
          <p className="subtitle">
            These courses had no fixed day/time from backend, so they were auto-placed on the grid temporarily.
          </p>
          <div className="timetable-note-list">
            {unscheduledCourses
              .map((c, index) => (
                <div key={c.code || index} className="timetable-note-item">
                  <div className="timetable-note-dot"></div>
                  <span><strong>{c.code}</strong> - {c.name || "Course"} <span className="subtitle">({c.credits} Credits)</span></span>
                </div>
            ))}
          </div>
        </div>
      )}

      {displayCourses.length === 0 && (
        <div className="empty-timetable-message">
          <p>📚 Your timetable is empty. Start enrolling in courses to see them here!</p>
        </div>
      )}

      {/* Legend */}
      <div className="timetable-legend card">
        <h4>Legend:</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ background: "#355dfc" }}></div>
            <span>Enrolled Course</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: "#f1f5f9" }}></div>
            <span>Free Slot</span>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}

export default Timetable;