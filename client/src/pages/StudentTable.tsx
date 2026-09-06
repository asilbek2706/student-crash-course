import type { Student } from "../interfaces/student.interface";

interface StudentTableProps {
  students: Student[];
  selectedDate: string;
  getRecordForDate: (
    student: Student,
    date: string,
  ) => {
    attendance: boolean;
    taskStatus: string;
  };
  onAttendanceChange: (id: string, currentAttendance: boolean) => void;
  onTaskChange: (id: string, taskStatus: string) => void;
  onDelete: (id: string) => void;
  onStudentClick: (id: string) => void;
}

const StudentTable = ({
  students,
  selectedDate,
  getRecordForDate,
  onAttendanceChange,
  onTaskChange,
  onDelete,
  onStudentClick,
}: StudentTableProps) => {
  return (
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
                        onClick={() => onStudentClick(st._id)}
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
                            onAttendanceChange(st._id, record.attendance)
                          }
                        />

                        <span className="checkmark">
                          {record.attendance ? "✓" : ""}
                        </span>

                        <span
                          className={
                            record.attendance ? "present-text" : "absent-text"
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
                        onChange={(e) => onTaskChange(st._id, e.target.value)}
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
                        onClick={() => onDelete(st._id)}
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
  );
};

export default StudentTable;
