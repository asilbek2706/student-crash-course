import React, { useEffect, useMemo, useState } from "react";
import type { Student } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

const getTodayDate = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [fullName, setFullName] = useState("");
  const [course, setCourse] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  /* ================================
     DARK MODE
  ================================= */

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);

    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  /* ================================
     FETCH STUDENTS
  ================================= */

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/students`);

      if (!res.ok) {
        throw new Error("Talabalarni olishda xatolik");
      }

      const data = await res.json();

      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ================================
     GET RECORD BY DATE
  ================================= */

  const getRecordForDate = (student: Student, date: string) => {
    return (
      student.history?.find((h) => h.date === date) || {
        attendance: false,
        taskStatus: "bajarilmagan",
      }
    );
  };

  /* ================================
     STATISTICS
     Bugungi sana bo'yicha
  ================================= */

  const statistics = useMemo(() => {
    const today = getTodayDate();

    let todayPresent = 0;
    let todayAbsent = 0;
    let taskCompleted = 0;
    let taskNotCompleted = 0;

    students.forEach((student) => {
      const record = getRecordForDate(student, today);

      if (record.attendance) {
        todayPresent++;
      } else {
        todayAbsent++;
      }

      if (record.taskStatus === "bajarilgan") {
        taskCompleted++;
      } else {
        taskNotCompleted++;
      }
    });

    return {
      total: students.length,
      todayPresent,
      todayAbsent,
      taskCompleted,
      taskNotCompleted,
    };
  }, [students]);

  /* ================================
     ADD STUDENT
  ================================= */

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) return;

    try {
      const res = await fetch(`${API_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          course,
        }),
      });

      if (!res.ok) {
        throw new Error("Talaba qo'shishda xatolik");
      }

      setFullName("");
      setCourse(1);

      await fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================================
     DELETE STUDENT
  ================================= */

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Ushbu talabani o'chirishga ishonchingiz komilmi?",
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Talabani o'chirishda xatolik");
      }

      await fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================================
     ATTENDANCE
  ================================= */

  const handleAttendanceChange = async (
    id: string,
    currentAttendance: boolean,
  ) => {
    try {
      await fetch(`${API_URL}/students/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          attendance: !currentAttendance,
        }),
      });

      await fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================================
     TASK
  ================================= */

  const handleTaskChange = async (id: string, taskStatus: string) => {
    try {
      await fetch(`${API_URL}/students/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          taskStatus,
        }),
      });

      await fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================================
     GET STUDENT BY ID
  ================================= */

  const handleGetById = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/students/${id}`);

      if (!res.ok) {
        throw new Error("Talaba ma'lumotlarini olishda xatolik");
      }

      const data = await res.json();

      setSelectedStudent(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app">
      <main className="container">
        {/* ================================
            HEADER
        ================================= */}

        <header className="page-header">
          <div>
            <span className="page-label">ADMIN PANEL</span>

            <h1>Talabalar boshqaruvi</h1>

            <p>Talabalar davomatini va vazifalarini boshqaring</p>
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label="Theme toggle"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </header>

        {/* ================================
            STATISTICS
        ================================= */}

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>

            <div className="stat-info">
              <span>Jami talabalar</span>
              <strong>{statistics.total}</strong>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">✓</div>

            <div className="stat-info">
              <span>Bugun kelgan</span>
              <strong>{statistics.todayPresent}</strong>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">×</div>

            <div className="stat-info">
              <span>Bugun kelmagan</span>
              <strong>{statistics.todayAbsent}</strong>
            </div>
          </div>

          <div className="stat-card primary">
            <div className="stat-icon">✓</div>

            <div className="stat-info">
              <span>Vazifani bajargan</span>
              <strong>{statistics.taskCompleted}</strong>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">!</div>

            <div className="stat-info">
              <span>Vazifani bajarmagan</span>
              <strong>{statistics.taskNotCompleted}</strong>
            </div>
          </div>
        </section>

        {/* ================================
            DATE + ADD STUDENT
        ================================= */}

        <section className="toolbar">
          <div className="date-picker-group">
            <div className="date-icon">📅</div>

            <div className="date-content">
              <label>Sana</label>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          <form onSubmit={handleAddStudent} className="form-group">
            <input
              type="text"
              placeholder="Ism Familiya"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <select
              value={course}
              onChange={(e) => setCourse(Number(e.target.value))}
            >
              <option value={1}>1-kurs</option>
              <option value={2}>2-kurs</option>
              <option value={3}>3-kurs</option>
              <option value={4}>4-kurs</option>
            </select>

            <button type="submit">
              <span>+</span>
              Qo'shish
            </button>
          </form>
        </section>

        {/* ================================
            TABLE
        ================================= */}

        <section className="table-card">
          <div className="table-header">
            <div>
              <h2>Talabalar ro'yxati</h2>

              <p>{selectedDate} sanasi uchun davomat</p>
            </div>

            <span className="student-count">{students.length} ta talaba</span>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Talaba</th>
                  <th>Davomat</th>
                  <th>Vazifa holati</th>
                  <th>Amallar</th>
                </tr>
              </thead>

              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-state">
                      <div className="empty-icon">👨‍🎓</div>

                      <strong>Talabalar mavjud emas</strong>

                      <span>Birinchi talabani qo'shing</span>
                    </td>
                  </tr>
                ) : (
                  students.map((st, index) => {
                    const record = getRecordForDate(st, selectedDate);

                    return (
                      <tr key={st._id}>
                        <td className="index-cell">{index + 1}</td>

                        <td>
                          <button
                            type="button"
                            className="student-profile"
                            onClick={() => handleGetById(st._id)}
                          >
                            <span className="avatar">
                              {st.fullName.charAt(0).toUpperCase()}
                            </span>

                            <span className="student-details">
                              <strong>{st.fullName}</strong>

                              <small>{st.course}-kurs</small>
                            </span>
                          </button>
                        </td>

                        <td>
                          <label className="attendance">
                            <input
                              type="checkbox"
                              checked={record.attendance}
                              onChange={() =>
                                handleAttendanceChange(
                                  st._id,
                                  record.attendance,
                                )
                              }
                            />

                            <span className="checkmark">
                              {record.attendance ? "✓" : ""}
                            </span>

                            <span
                              className={
                                record.attendance
                                  ? "present-text"
                                  : "absent-text"
                              }
                            >
                              {record.attendance ? "Kelgan" : "Kelmagan"}
                            </span>
                          </label>
                        </td>

                        <td>
                          <select
                            className={`task-select ${record.taskStatus}`}
                            value={record.taskStatus}
                            onChange={(e) =>
                              handleTaskChange(st._id, e.target.value)
                            }
                          >
                            <option value="bajarilgan">Bajarilgan</option>

                            <option value="toliq bajarilmagan">
                              To'liq bajarilmagan
                            </option>

                            <option value="bajarilmagan">Bajarilmagan</option>
                          </select>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleDelete(st._id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================================
            MODAL
        ================================= */}

        {selectedStudent && (
          <div
            className="modal"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedStudent(null);
              }
            }}
          >
            <div className="modal-content">
              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedStudent(null)}
              >
                ×
              </button>

              <div className="modal-profile">
                <div className="modal-avatar">
                  {selectedStudent.fullName.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3>{selectedStudent.fullName}</h3>

                  <span>{selectedStudent.course}-kurs talabasi</span>
                </div>
              </div>

              <div className="student-info-box">
                <div>
                  <span>Kurs</span>
                  <strong>{selectedStudent.course}-kurs</strong>
                </div>

                <div>
                  <span>Tarixlar</span>
                  <strong>{selectedStudent.history?.length || 0}</strong>
                </div>
              </div>

              <h4>Kunlik tarix</h4>

              <div className="history-list">
                {selectedStudent.history &&
                selectedStudent.history.length > 0 ? (
                  [...selectedStudent.history].reverse().map((h, idx) => (
                    <div className="history-item" key={idx}>
                      <div>
                        <strong>{h.date}</strong>

                        <span>
                          {h.attendance ? "Davomat bor" : "Davomat yo'q"}
                        </span>
                      </div>

                      <div className="history-status">
                        <span
                          className={
                            h.attendance ? "history-present" : "history-absent"
                          }
                        >
                          {h.attendance ? "✓ Kelgan" : "× Kelmagan"}
                        </span>

                        <span
                          className={
                            h.taskStatus === "bajarilgan"
                              ? "history-task-done"
                              : "history-task-not"
                          }
                        >
                          {h.taskStatus}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-history">📋 Tarix mavjud emas</div>
                )}
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedStudent(null)}
              >
                Yopish
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
