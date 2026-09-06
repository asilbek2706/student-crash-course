import React from "react";

interface StudentToolbarProps {
  selectedDate: string;
  fullName: string;
  course: number;

  onDateChange: (date: string) => void;
  onFullNameChange: (name: string) => void;
  onCourseChange: (course: number) => void;
  onAddStudent: (e: React.FormEvent) => void;
}

const StudentToolbar = ({
  selectedDate,
  fullName,
  course,
  onDateChange,
  onFullNameChange,
  onCourseChange,
  onAddStudent,
}: StudentToolbarProps) => {
  return (
    <section className="toolbar">
      <div className="date-picker-group">
        <div className="date-icon">📅</div>

        <div className="date-content">
          <label>Sana</label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              onDateChange(e.target.value)
            }
          />
        </div>
      </div>

      <form
        onSubmit={onAddStudent}
        className="form-group"
      >
        <input
          type="text"
          placeholder="Ism Familiya"
          value={fullName}
          onChange={(e) =>
            onFullNameChange(e.target.value)
          }
        />

        <select
          value={course}
          onChange={(e) =>
            onCourseChange(Number(e.target.value))
          }
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
  );
};

export default StudentToolbar;