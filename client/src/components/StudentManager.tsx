import { useCallback, useEffect, useMemo, useState } from "react";

import Swal from "sweetalert2";

import type { Student } from "../interfaces/student.interface";
import Statistics from "../pages/Statistics";
import StudentToolbar from "../pages/StudentToolbar";
import StudentTable from "../pages/StudentTable";
import StudentModal from "../pages/StudentModal";

interface StudentManagerProps {
  token: string;
  onLogout: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const getTodayDate = () => {
  const d = new Date();

  return d.toISOString().split("T")[0];
};

const StudentManager = ({ token, onLogout }: StudentManagerProps) => {
  const [students, setStudents] = useState<Student[]>([]);

  const [fullName, setFullName] = useState("");

  const [course, setCourse] = useState<number>(1);

  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // =========================================
  // AUTHENTICATED FETCH
  // =========================================

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers);

      headers.set("Authorization", `Bearer ${token}`);

      const res = await fetch(url, {
        ...options,
        headers,
      });

      if (res.status === 401) {
        localStorage.removeItem("token");

        setStudents([]);
        setSelectedStudent(null);

        onLogout();

        throw new Error("Sessiya tugagan. Qayta login qiling.");
      }

      return res;
    },
    [token, onLogout],
  );

  // =========================================
  // GET STUDENTS
  // =========================================

  const fetchStudents = useCallback(async () => {
    try {
      const res = await authFetch(`${API_URL}/students`);

      if (!res.ok) {
        throw new Error("Talabalarni olishda xatolik");
      }

      const data: Student[] = await res.json();

      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  }, [authFetch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStudents();
  }, [fetchStudents]);

  // =========================================
  // GET RECORD
  // =========================================

  const getRecordForDate = (student: Student, date: string) => {
    return (
      student.history?.find((history) => history.date === date) || {
        attendance: false,
        taskStatus: "bajarilmagan" as const,
      }
    );
  };

  // =========================================
  // STATISTICS
  // =========================================

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

  // =========================================
  // ADD STUDENT
  // =========================================

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      await Swal.fire({
        title: "Ism kiriting!",
        text: "Talabaning ism va familiyasini kiriting.",
        icon: "warning",
        confirmButtonText: "Tushunarli",
        confirmButtonColor: "#4f46e5",
      });

      return;
    }

    try {
      const studentName = fullName.trim();

      const res = await authFetch(`${API_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: studentName,
          course,
        }),
      });

      if (!res.ok) {
        throw new Error("Talaba qo'shishda xatolik");
      }

      setFullName("");
      setCourse(1);

      await fetchStudents();

      await Swal.fire({
        title: "Muvaffaqiyatli!",
        text: `${studentName} muvaffaqiyatli qo'shildi.`,
        icon: "success",
        confirmButtonText: "Ajoyib!",
        confirmButtonColor: "#4f46e5",
      });
    } catch (err) {
      console.error(err);

      await Swal.fire({
        title: "Xatolik!",
        text: "Talabani qo'shishda xatolik yuz berdi.",
        icon: "error",
        confirmButtonText: "Yopish",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // =========================================
  // DELETE STUDENT
  // =========================================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "O'chirishni xohlaysizmi?",
      text: "Bu talabani o'chirgandan keyin ma'lumotlarni qaytarib bo'lmaydi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ha, o'chirish",
      cancelButtonText: "Bekor qilish",
      reverseButtons: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await authFetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Talabani o'chirishda xatolik");
      }

      await fetchStudents();

      await Swal.fire({
        title: "O'chirildi!",
        text: "Talaba muvaffaqiyatli o'chirildi.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#4f46e5",
      });
    } catch (err) {
      console.error(err);

      await Swal.fire({
        title: "Xatolik!",
        text: "Talabani o'chirishda xatolik yuz berdi.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // =========================================
  // ATTENDANCE
  // =========================================

  const handleAttendanceChange = async (
    id: string,
    currentAttendance: boolean,
  ) => {
    try {
      const res = await authFetch(`${API_URL}/students/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          attendance: !currentAttendance,
        }),
      });

      if (!res.ok) {
        throw new Error("Davomatni o'zgartirishda xatolik");
      }

      await fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================================
  // TASK
  // =========================================

  const handleTaskChange = async (id: string, taskStatus: string) => {
    try {
      const res = await authFetch(`${API_URL}/students/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          taskStatus,
        }),
      });

      if (!res.ok) {
        throw new Error("Vazifa holatini o'zgartirishda xatolik");
      }

      await fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================================
  // GET STUDENT BY ID
  // =========================================

  const handleGetById = async (id: string) => {
    try {
      const res = await authFetch(`${API_URL}/students/${id}`);

      if (!res.ok) {
        throw new Error("Talaba ma'lumotlarini olishda xatolik");
      }

      const data: Student = await res.json();

      setSelectedStudent(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Statistics statistics={statistics} />

      <StudentToolbar
        fullName={fullName}
        course={course}
        selectedDate={selectedDate}
        onFullNameChange={setFullName}
        onCourseChange={setCourse}
        onDateChange={setSelectedDate}
        onAddStudent={handleAddStudent}
      />

      <StudentTable
        students={students}
        selectedDate={selectedDate}
        getRecordForDate={getRecordForDate}
        onAttendanceChange={handleAttendanceChange}
        onTaskChange={handleTaskChange}
        onDelete={handleDelete}
        onStudentClick={handleGetById}
      />

      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  );
};

export default StudentManager;
