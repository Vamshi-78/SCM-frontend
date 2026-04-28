import { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!raw || !token) return null;
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [courses, setCourses] = useState([]);

  const normalizeCode = (rawCode) => String(rawCode || "").trim().toUpperCase();

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

  const normalizeCourses = (courseList = []) => {
    return courseList.map((c) => ({
      ...c,
      code: normalizeCode(c.code || c.courseCode || ""),
      name: c.name || c.courseName || c.title || "No Name",
      day: normalizeDay(c.day || c.courseDay || c.days),
      time: normalizeTime(c.time || c.courseTime || c.timing),
      credits: Number(c.credits || c.courseCredits || c.creditHours || 2),
      capacity: Number(c.capacity || c.courseCapacity || 30),
      enrolled: Number(c.enrolled || c.enrolledCount || 0),
      prerequisites: c.prerequisites || c.coursePrerequisites || ""
    }));
  };

  // Fetch REAL courses from MySQL backend
  useEffect(() => {
    if (user) {
      api.getCourses()
        .then(res => {
          const rawCourses = res.data || [];
          setCourses(normalizeCourses(rawCourses));
        })
        .catch(err => {
          console.error("ERROR: Failed to fetch courses from backend:", err.response?.data || err.message);
          const path = window.location.pathname || "/";
          const isAuthPage = path.startsWith("/login") || path === "/" || path === "/register";
          if (!isAuthPage) {
            alert("❌ Failed to load courses. Backend may be offline or API URL is misconfigured.");
          }
        });
    }
  }, [user]);


  const [enrollments, setEnrollments] = useState([]);

  const normalizeEnrollments = (enrollmentList = []) => {
    return enrollmentList.map((e) => ({
      // Backend may return enrollment rows without nested course fields, so enrich from catalog.
      ...e,
      _courseCodeResolved: normalizeCode(e.course?.code || e.courseCode || e.course_code || e.code || ""),
      _courseFromCatalog: courses.find(
        (c) => c.code === normalizeCode(e.course?.code || e.courseCode || e.course_code || e.code || "")
      ),
      studentEmail: e.studentEmail || e.student_email || e.email || "",
      studentUsername: e.studentUsername || e.student_username || e.username || "",
      studentName: e.studentName || e.studentUsername || e.student_username || "",
      course: {
        code: normalizeCode(e.course?.code || e.courseCode || e.course_code || e.code || ""),
        name: e.course?.name || e.courseName || e.course_name || e.course?.title || (courses.find((c) => c.code === normalizeCode(e.course?.code || e.courseCode || e.course_code || e.code || ""))?.name) || "No Name",
        day: normalizeDay(e.course?.day || e.courseDay || e.course_day || (courses.find((c) => c.code === normalizeCode(e.course?.code || e.courseCode || e.course_code || e.code || ""))?.day)),
        time: normalizeTime(e.course?.time || e.courseTime || e.course_time || (courses.find((c) => c.code === normalizeCode(e.course?.code || e.courseCode || e.course_code || e.code || ""))?.time)),
        credits: Number(e.course?.credits || e.courseCredits || e.course_credits || (courses.find((c) => c.code === normalizeCode(e.course?.code || e.courseCode || e.course_code || e.code || ""))?.credits) || 2),
        capacity: Number(e.course?.capacity || e.courseCapacity || e.course_capacity || (courses.find((c) => c.code === normalizeCode(e.course?.code || e.courseCode || e.course_code || e.code || ""))?.capacity) || 30),
        enrolled: Number(e.course?.enrolled || e.enrolled || 0)
      }
    })).map(({ _courseCodeResolved, _courseFromCatalog, ...rest }) => rest);
  };

  // Fetch enrollments from backend for current user
  useEffect(() => {
    if (user?.email) {
      api.getEnrollments(user.email)
        .then(res => {
          setEnrollments(normalizeEnrollments(res.data || []));
        })
        .catch(err => {
          console.error("ERROR: Failed to fetch enrollments from backend:", err.response?.data || err.message);
          setEnrollments([]);
        });
    }
  }, [user?.email, courses]);


  const [waitlist, setWaitlist] = useState([]);

  // Fetch waitlist from backend
  useEffect(() => {
    if (user?.email) {
      api.getWaitlist()
        .then(res => {
          const waitlistData = res.data || [];
          const userWaitlist = waitlistData.filter(w => w.studentEmail === user.email);
          const normalized = userWaitlist.map(w => ({
            studentEmail: w.studentEmail || w.email || "",
            studentUsername: w.studentUsername || w.username || "",
            studentName: w.studentName || w.studentUsername || "",
            course: {
              code: normalizeCode(w.course?.code || w.courseCode || w.code || ""),
              name:
                w.course?.name ||
                w.courseName ||
                courses.find((c) => c.code === normalizeCode(w.course?.code || w.courseCode || w.code || ""))?.name ||
                "No Name",
              day:
                w.course?.day ||
                courses.find((c) => c.code === normalizeCode(w.course?.code || w.courseCode || w.code || ""))?.day ||
                "TBA",
              time:
                w.course?.time ||
                courses.find((c) => c.code === normalizeCode(w.course?.code || w.courseCode || w.code || ""))?.time ||
                "TBA",
              credits: Number(
                w.course?.credits ||
                courses.find((c) => c.code === normalizeCode(w.course?.code || w.courseCode || w.code || ""))?.credits ||
                2
              )
            }
          }));
          setWaitlist(normalized);
        })
        .catch(err => {
          console.error("ERROR: Failed to fetch waitlist from backend:", err.response?.data || err.message);
          setWaitlist([]);
        });
    }
  }, [user?.email, courses]);


  const [supportTickets, setSupportTickets] = useState([]);

  const normalizeSupportTickets = (payload) => {
    const rawTickets = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.tickets)
        ? payload.tickets
        : [];

    return rawTickets.map((ticket) => ({
      ...ticket,
      status: String(ticket?.status || "OPEN"),
      priority: String(ticket?.priority || "Medium"),
      responses: Array.isArray(ticket?.responses)
        ? ticket.responses.map((resp) => ({
            ...resp,
            by: resp?.by || resp?.responseBy || "Support",
            role: resp?.role || resp?.responseRole || "admin",
            timestamp: resp?.timestamp || resp?.createdAt || new Date().toISOString(),
            message: resp?.message || ""
          }))
        : []
    }));
  };

  const refreshSupportTickets = async (activeUser = user) => {
    if (!activeUser) {
      setSupportTickets([]);
      return;
    }

    const isAdmin = String(activeUser?.role || "").toLowerCase() === "admin";
    try {
      const res = isAdmin
        ? await api.getAllSupportTickets()
        : await api.getSupportTickets(activeUser.email);
      setSupportTickets(normalizeSupportTickets(res?.data));
    } catch (err) {
      const message = String(err?.response?.data?.message || err?.message || "").toLowerCase();
      const isMissingSupportEndpoint = message.includes("no static resource") || message.includes("support-ticket") || message.includes("support-tickets");
      if (!isMissingSupportEndpoint) {
        throw err;
      }

      // Compatibility fallback: reconstruct support requests from notifications when support endpoints are unavailable.
      const allNotifications = await api.getNotifications("all");
      const rows = Array.isArray(allNotifications?.data) ? allNotifications.data : [];
      const parsedTickets = rows
        .filter((n) => String(n?.type || "").toLowerCase() === "support_request")
        .map((n) => {
          let payload = {};
          try {
            payload = JSON.parse(String(n?.message || "{}"));
          } catch {
            payload = { description: String(n?.message || "") };
          }
          return {
            id: n?.id,
            studentEmail: payload?.studentEmail || "",
            studentUsername: payload?.studentUsername || "",
            subject: payload?.subject || n?.title || "Support Request",
            description: payload?.description || "",
            category: payload?.category || "Other",
            status: payload?.status || "OPEN",
            priority: payload?.priority || "Medium",
            createdAt: n?.timestamp || new Date().toISOString(),
            responses: Array.isArray(payload?.responses) ? payload.responses : []
          };
        });

      setSupportTickets(
        isAdmin
          ? parsedTickets
          : parsedTickets.filter((t) => String(t?.studentEmail || "").toLowerCase() === String(activeUser?.email || "").toLowerCase())
      );
    }
  };

  // Fetch support tickets from backend (this endpoint will need to be added to backend)
  useEffect(() => {
    if (user?.email) {
      refreshSupportTickets(user)
        .catch(err => {
          console.error("ERROR: Failed to fetch support tickets from backend:", err.response?.data || err.message);
          setSupportTickets([]);
        });
    }
  }, [user?.email]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      userId: "all",
      userType: "all",
      type: "system",
      title: "Welcome to SCM Platform",
      message: "Welcome to Student Course Manager. Browse courses and start building your schedule!",
      timestamp: new Date().toISOString(),
      read: false
    }
  ]);

  useEffect(() => {
    if (user?.email) {
      api.getNotifications(user.email)
        .then((res) => {
          const rows = Array.isArray(res?.data) ? res.data : [];
          const normalized = rows.map((n) => ({
            id: n.id,
            userId: n.userId || n.user_id || n.userEmail || n.user_email || user.email,
            userType: n.userType || n.user_type || "student",
            type: n.type || "info",
            title: n.title || "Notification",
            message: n.message || "",
            timestamp: n.timestamp || n.createdAt || new Date().toISOString(),
            read: Boolean(n.read ?? n.is_read ?? false)
          }));
          setNotifications(normalized.length > 0 ? normalized : []);
        })
        .catch((err) => {
          console.error("ERROR: Failed to fetch notifications from backend:", err.response?.data || err.message);
        });
    }
  }, [user?.email]);

  const inferRoleFromEmail = (email) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const localPart = normalizedEmail.split("@")[0] || "";
    return /(^|[._-])admin([._-]|$)/i.test(localPart) ? "admin" : "student";
  };

  const login = async (email, password, roleHint) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPassword = String(password || "");
    const resolvedRole = String(roleHint || inferRoleFromEmail(normalizedEmail)).toLowerCase();

    let res;
    if (resolvedRole === "admin") {
      res = await api.loginAdmin({ email: normalizedEmail, password: normalizedPassword });
    } else {
      res = await api.loginStudent({ email: normalizedEmail, password: normalizedPassword });
    }
    
    // Explicit token separation as demanded by Backend
    const token = res?.data?.token || res?.data?.jwt || res?.data?.accessToken || "";
    if (token) {
      localStorage.setItem("token", token);
    }
    
    let userData = { email: normalizedEmail, role: resolvedRole, username: normalizedEmail.split('@')[0], ...res.data };
    userData.role = String(userData.role || resolvedRole).toLowerCase();
    
    // Default to unapproved securely if backend doesn't pass it yet or if student
    if (userData.role === "student") {
      userData.registrationApproved = res.data.registrationApproved === 1 ? 1 : 0;
    } else {
      userData.registrationApproved = 1; // Admins are always approved
    }

    if (!token) {
      throw new Error("Login succeeded but token not returned by backend.");
    }

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Add course to backend database
  const addCourse = async (course) => {
    try {
      const payload = {
        ...course,
        courseCode: course.code,
        courseName: course.name,
        courseDay: course.day,
        courseTime: course.time,
        courseCredits: course.credits,
        courseCapacity: course.capacity
      };

      const res = await api.addCourse(payload);
      console.log("✅ Course added to backend successfully:", res.data);
      
      // Refresh courses from backend
      const coursesRes = await api.getCourses();
      setCourses(normalizeCourses(coursesRes.data || []));
      return res;
    } catch (err) {
      console.error("❌ BACKEND ERROR: Failed to add course:", err.response?.data || err.message);
      alert(`❌ Failed to add course: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  };

  const deleteCourse = async (code) => {
    const normalizedCode = String(code || "").trim().toUpperCase();

    try {
      await api.deleteCourse(normalizedCode);
      console.log("✅ Course deleted from backend successfully:", normalizedCode);

      // Update UI immediately so deleted row disappears even if refresh is slow.
      setCourses((prev) =>
        prev.filter(
          (c) => String(c?.code || "").trim().toUpperCase() !== normalizedCode
        )
      );

      // Best-effort refresh to stay in sync with backend truth.
      try {
        const coursesRes = await api.getCourses();
        setCourses(normalizeCourses(coursesRes.data || []));
      } catch (refreshErr) {
        console.warn(
          "⚠ Course deleted, but failed to refresh full course list:",
          refreshErr.response?.data || refreshErr.message
        );
      }
    } catch (err) {
      const rawError = err.response?.data;
      const backendMessage =
        typeof rawError === "string"
          ? rawError
          : rawError?.message || err.message;

      const isForeignKeyError =
        /foreign key|constraint fails|cannot delete or update a parent row/i.test(
          String(backendMessage || "")
        );

      console.error("❌ BACKEND ERROR: Failed to delete course:", rawError || err.message);

      if (isForeignKeyError) {
        alert(
          "❌ Cannot delete this course because students are still enrolled in it. Please unenroll students first, then delete the course."
        );
      } else {
        alert(`❌ Failed to delete course: ${backendMessage}`);
      }

      throw err;
    }
  };

  const editCourse = async (courseCode, updatedData) => {
    try {
      const payload = {
        ...updatedData,
        code: courseCode,
        courseCode: courseCode,
        courseName: updatedData.name,
        courseDay: updatedData.day,
        courseTime: updatedData.time,
        courseCredits: updatedData.credits,
        courseCapacity: updatedData.capacity
      };

      await api.updateCourse(courseCode, payload);
      console.log("✅ Course updated in backend successfully:", courseCode, updatedData);
      
      // Refresh courses from backend
      const coursesRes = await api.getCourses();
      setCourses(normalizeCourses(coursesRes.data || []));
      alert("✅ Course Successfully Updated in Database!");
    } catch (err) {
      console.error("❌ BACKEND ERROR: Failed to update course:", err.response?.data || err.message);
      alert(`❌ Failed to update course: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  };

  const enrollCourse = async (course) => {
    // Validation checks
    const cCredits = course.credits || 0;
    const studentCourses = enrollments.filter(e => e.studentEmail === user.email);

    // Check total credits
    const totalCredits = studentCourses.reduce((sum, e) => sum + (e.course.credits || 0), 0);
    if (totalCredits + cCredits > 18) {
      alert("⚠ Maximum credit limit (18) exceeded!");
      return;
    }

    if (!course.day || !course.time || course.day === "TBA" || course.time === "TBA") {
      alert("⚠ This course has no fixed timetable yet. Ask admin to set Day/Time before enrolling.");
      return;
    }

    // Check schedule conflict (only if day/time exist)
    if (course.day && course.time && course.day !== "TBA" && course.time !== "TBA") {
      const conflict = studentCourses.find(
        e => e.course.day === course.day && e.course.time === course.time
      );
      if (conflict) {
        alert("⚠ Schedule Conflict Detected!");
        return;
      }
    }

    try {
      // Send to backend with clean data
      const enrollRes = await api.enroll({
        studentEmail: user.email,
        studentUsername: user.username,
        courseCode: normalizeCode(course.code),
        courseName: course.name,
        credits: course.credits
      });
      console.log("✅ Enrollment sent to backend successfully");

      const backendStatus = enrollRes?.data || {};

      if (backendStatus.waitlisted === true) {
        const waitRes = await api.getWaitlist();
        const waitlistData = waitRes.data || [];
        const userWaitlist = waitlistData.filter((w) => w.studentEmail === user.email);
        setWaitlist(
          userWaitlist.map((w) => ({
            studentEmail: w.studentEmail || w.email || "",
            studentUsername: w.studentUsername || w.username || "",
            studentName: w.studentName || w.studentUsername || "",
            course: {
              code: normalizeCode(w.course?.code || w.courseCode || w.code || ""),
              name:
                w.course?.name ||
                w.courseName ||
                courses.find((c) => c.code === normalizeCode(w.course?.code || w.courseCode || w.code || ""))?.name ||
                "No Name",
              day:
                w.course?.day ||
                courses.find((c) => c.code === normalizeCode(w.course?.code || w.courseCode || w.code || ""))?.day ||
                "TBA",
              time:
                w.course?.time ||
                courses.find((c) => c.code === normalizeCode(w.course?.code || w.courseCode || w.code || ""))?.time ||
                "TBA",
              credits: Number(
                w.course?.credits ||
                courses.find((c) => c.code === normalizeCode(w.course?.code || w.courseCode || w.code || ""))?.credits ||
                2
              )
            }
          }))
        );

        const coursesRes = await api.getCourses();
        setCourses(normalizeCourses(coursesRes.data || []));

        alert("⏳ Course is full. Added to waitlist and saved to database.");
        return;
      }

      // Refresh enrollments from backend
      const refreshedEnrollments = await api.getEnrollments(user.email);
      setEnrollments(normalizeEnrollments(refreshedEnrollments.data || []));

      const coursesRes = await api.getCourses();
      setCourses(normalizeCourses(coursesRes.data || []));

      alert("✅ Enrolled Successfully and Saved to Database!");

    } catch (err) {
      console.error("❌ BACKEND ERROR: Enrollment failed:", err.response?.data || err.message);
      alert(`❌ Enrollment failed: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  };

  const joinWaitlist = async (course) => {
    try {
      await api.joinWaitlist({
        studentEmail: user.email,
        studentUsername: user.username,
        courseCode: normalizeCode(course.code),
        courseName: course.name
      });
      console.log("✅ Waitlist join sent to backend successfully");

      // Refresh waitlist from backend
      const waitRes = await api.getWaitlist();
      const userWaitlist = waitRes.data?.filter(w => w.studentEmail === user.email) || [];
      setWaitlist(userWaitlist);

      const coursesRes = await api.getCourses();
      setCourses(normalizeCourses(coursesRes.data || []));

      alert("⏳ Joined Waitlist Successfully and Saved to Database!");

      // Send notification
      await addNotification({
        userId: user.email,
        type: "info",
        title: "Waitlist Joined",
        message: `You are placed on the waitlist for ${course.name || course.code}`
      });

    } catch (err) {
      const backendMessage = String(err?.response?.data?.message || err?.message || "").toLowerCase();
      const isPostNotSupported = backendMessage.includes("request method 'post' is not supported") || backendMessage.includes("method not allowed");

      // Compatibility fallback for backends that do waitlisting through /enroll when the course is full.
      if (isPostNotSupported) {
        try {
          const fallbackEnroll = await api.enroll({
            studentEmail: user.email,
            studentUsername: user.username,
            courseCode: normalizeCode(course.code),
            courseName: course.name,
            credits: course.credits
          });

          const waitlisted = Boolean(fallbackEnroll?.data?.waitlisted);
          if (!waitlisted) {
            console.warn("⚠ Waitlist fallback enroll succeeded but did not return waitlisted=true");
          }

          const waitRes = await api.getWaitlist();
          const userWaitlist = waitRes.data?.filter(w => w.studentEmail === user.email) || [];
          setWaitlist(userWaitlist);

          const coursesRes = await api.getCourses();
          setCourses(normalizeCourses(coursesRes.data || []));

          alert("⏳ Joined Waitlist Successfully and Saved to Database!");
          return;
        } catch (fallbackErr) {
          console.error("❌ BACKEND ERROR: Waitlist fallback via enroll failed:", fallbackErr.response?.data || fallbackErr.message);
          alert(`❌ Waitlist join failed: ${fallbackErr.response?.data?.message || fallbackErr.message}`);
          throw fallbackErr;
        }
      }

      console.error("❌ BACKEND ERROR: Waitlist join failed:", err.response?.data || err.message);
      alert(`❌ Waitlist join failed: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  };

  const unenrollCourse = async (courseCode) => {
    try {
      // Call backend to unenroll (will need to add API endpoint)
      await api.unenroll({
        studentEmail: user.email,
        courseCode: normalizeCode(courseCode)
      });
      console.log("✅ Unenrollment sent to backend successfully");

      // Refresh enrollments from backend
      const enrollRes = await api.getEnrollments(user.email);
      setEnrollments(normalizeEnrollments(enrollRes.data || []));

      const waitRes = await api.getWaitlist();
      const userWaitlist = waitRes.data?.filter(w => w.studentEmail === user.email) || [];
      setWaitlist(userWaitlist);

      const coursesRes = await api.getCourses();
      setCourses(normalizeCourses(coursesRes.data || []));

      alert("✅ Course Removed Successfully from Database");

    } catch (err) {
      console.error("❌ BACKEND ERROR: Unenrollment failed:", err.response?.data || err.message);
      alert(`❌ Unenrollment failed: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  };

  // Support ticket functions - saved to backend database
  const createTicket = async (ticket) => {
    try {
      const res = await api.createSupportTicket({
        studentEmail: user.email,
        studentUsername: user.username,
        subject: ticket.subject,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority || "Medium"
      });
      console.log("✅ Support ticket created in backend:", res.data);

      // Refresh tickets from backend
      await refreshSupportTickets(user);

      alert("✅ Support Ticket Created and Saved to Database");
      return res.data?.id || Date.now();

    } catch (err) {
      const message = String(err?.response?.data?.message || err?.message || "").toLowerCase();
      const isMissingSupportEndpoint = message.includes("no static resource") || message.includes("support-ticket") || message.includes("support-tickets");
      if (!isMissingSupportEndpoint) {
        console.error("❌ BACKEND ERROR: Failed to create ticket:", err.response?.data || err.message);
        alert(`❌ Failed to create ticket: ${err.response?.data?.message || err.message}`);
        throw err;
      }

      const fallbackPayload = {
        studentEmail: user.email,
        studentUsername: user.username,
        subject: ticket.subject,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority || "Medium",
        status: "OPEN",
        responses: []
      };

      const fallbackNotification = await api.addNotification({
        userId: "all",
        userType: "all",
        type: "support_request",
        title: `Support Ticket: ${ticket.subject}`,
        message: JSON.stringify(fallbackPayload)
      });

      await refreshSupportTickets(user);
      alert("✅ Support Ticket Saved to Database (compatibility mode)");
      return fallbackNotification?.data?.id || Date.now();
    }
  };

  const isSupportEndpointMissing = (err) => {
    const message = String(err?.response?.data?.message || err?.message || "").toLowerCase();
    return message.includes("no static resource") || message.includes("support-ticket") || message.includes("support-tickets");
  };

  const requestRegistrationApproval = async () => {
    if (!user?.email) return;
    try {
      await api.submitRegistrationRequest({
        studentEmail: user.email,
        studentUsername: user.username,
        email: user.email,
        username: user.username,
        status: "PENDING"
      });
      alert("✅ Registration request submitted and saved to database.");
    } catch (err) {
      console.error("❌ BACKEND ERROR: Failed to submit registration request:", err.response?.data || err.message);
      alert(`❌ Failed to submit registration request: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  };

  const respondToTicket = async (ticketId, response) => {
    try {
      await api.respondToTicket(ticketId, {
        by: user.username,
        role: user.role,
        message: response
      });
      console.log("✅ Response added to ticket in backend:", ticketId);

      // Refresh tickets from backend
      await refreshSupportTickets(user);

      alert("✅ Response Saved to Database");

    } catch (err) {
      if (isSupportEndpointMissing(err)) {
        const selected = (Array.isArray(supportTickets) ? supportTickets : []).find((t) => Number(t?.id) === Number(ticketId));
        const targetEmail = selected?.studentEmail || "";

        if (targetEmail) {
          await api.addNotification({
            userId: targetEmail,
            userType: "student",
            type: "support_response",
            title: `Support response for #${ticketId}`,
            message: response
          });
        }

        setSupportTickets((prev) => (Array.isArray(prev) ? prev : []).map((ticket) => {
          if (Number(ticket?.id) !== Number(ticketId)) return ticket;
          const existingResponses = Array.isArray(ticket.responses) ? ticket.responses : [];
          return {
            ...ticket,
            responses: [
              ...existingResponses,
              {
                by: user.username || "Admin",
                role: user.role || "admin",
                message: response,
                timestamp: new Date().toISOString()
              }
            ]
          };
        }));

        alert("✅ Response sent to student (compatibility mode)");
        return;
      }

      console.error("❌ BACKEND ERROR: Failed to respond to ticket:", err.response?.data || err.message);
      alert(`❌ Failed to add response: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  };

  const updateTicketStatus = async (ticketId, status) => {
    try {
      await api.updateTicketStatus(ticketId, { status });
      console.log("✅ Ticket status updated in backend:", ticketId, status);

      // Refresh tickets from backend
      await refreshSupportTickets(user);

      alert(`✅ Ticket Status Updated to ${status}`);

    } catch (err) {
      if (isSupportEndpointMissing(err)) {
        const selected = (Array.isArray(supportTickets) ? supportTickets : []).find((t) => Number(t?.id) === Number(ticketId));
        const targetEmail = selected?.studentEmail || "";

        if (targetEmail) {
          await api.addNotification({
            userId: targetEmail,
            userType: "student",
            type: "support_status",
            title: `Support ticket #${ticketId} status updated`,
            message: `Your support ticket status is now: ${status}`
          });
        }

        setSupportTickets((prev) => (Array.isArray(prev) ? prev : []).map((ticket) => {
          if (Number(ticket?.id) !== Number(ticketId)) return ticket;
          return { ...ticket, status };
        }));

        alert(`✅ Ticket Status Updated to ${status} (compatibility mode)`);
        return;
      }

      console.error("❌ BACKEND ERROR: Failed to update ticket status:", err.response?.data || err.message);
      alert(`❌ Failed to update status: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  };

  // Notification functions - sent to backend
  const addNotification = async (notification) => {
    try {
      await api.addNotification({
        userId: notification.userId || user?.email,
        userType: notification.userType || "student",
        type: notification.type || "info",
        title: notification.title,
        message: notification.message
      });
      console.log("✅ Notification sent to backend and saved to database");

      // Add notification to local state for immediate UI feedback
      const newNotification = {
        id: Date.now() + Math.random(),
        userId: notification.userId || user?.email,
        userType: notification.userType || "user",
        type: notification.type || "info",
        title: notification.title,
        message: notification.message,
        timestamp: new Date().toISOString(),
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);

    } catch (err) {
      console.error("❌ BACKEND ERROR: Failed to send notification:", err.response?.data || err.message);
      // Still add to local state even if backend fails
      const newNotification = {
        id: Date.now() + Math.random(),
        userId: notification.userId || user?.email,
        userType: notification.userType || "user",
        type: notification.type || "info",
        title: notification.title,
        message: notification.message,
        timestamp: new Date().toISOString(),
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await api.markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (err) {
      console.error("❌ BACKEND ERROR: Failed to mark notification as read:", err.response?.data || err.message);
      // Still mark as read locally
      setNotifications(prev => prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
    }
  };

  const clearAllNotifications = async () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      try {
        await api.clearNotifications();
        setNotifications([]);
        alert("✅ All notifications cleared from database");
      } catch (err) {
        console.error("❌ BACKEND ERROR: Failed to clear notifications:", err.response?.data || err.message);
        alert(`❌ Failed to clear notifications: ${err.message}`);
      }
    }
  };

  // Get enrolled courses for current user (for Timetable)
  const enrolledCourses = user
    ? enrollments
        .filter(e => e.studentEmail === user.email)
        .map(e => ({
          code: e.course?.code || "",
          name: e.course?.name || "No Name",
          day: normalizeDay(e.course?.day),
          time: normalizeTime(e.course?.time),
          credits: Number(e.course?.credits || 2),
          capacity: Number(e.course?.capacity || 30),
          enrolled: Number(e.course?.enrolled || 0)
        }))
    : [];

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        courses,
        addCourse,
        deleteCourse,
        editCourse,
        enrollCourse,
        unenrollCourse,
        joinWaitlist,
        enrollments,
        enrolledCourses,
        waitlist,
        supportTickets,
        createTicket,
        respondToTicket,
        updateTicketStatus,
        requestRegistrationApproval,
        notifications,
        addNotification,
        markNotificationAsRead,
        clearAllNotifications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};