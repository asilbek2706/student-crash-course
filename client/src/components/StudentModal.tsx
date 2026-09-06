import { useEffect } from "react";

import type { Student } from "../interfaces/student.interface";

interface StudentModalProps {
  student: Student;
  onClose: () => void;
}

const StudentModal = ({ student, onClose }: StudentModalProps) => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    // Modal ochilganda orqa sahifa scroll bo'lmasin
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // Modal yopilganda eski scroll holatini qaytarish
      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const history = student.history ? [...student.history].reverse() : [];

  return (
    <div
      className="modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-modal-title"
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Modalni yopish"
        >
          ×
        </button>

        {/* STUDENT PROFILE */}
        <div className="modal-profile">
          <div className="modal-avatar">
            {student.fullName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 id="student-modal-title">{student.fullName}</h3>

            <span>{student.course}-kurs talabasi</span>
          </div>
        </div>

        {/* STUDENT INFO */}
        <div className="student-info-box">
          <div>
            <span>Kurs</span>

            <strong>{student.course}-kurs</strong>
          </div>

          <div>
            <span>Tarixlar</span>

            <strong>{student.history?.length ?? 0}</strong>
          </div>
        </div>

        {/* HISTORY */}
        <h4>Kunlik tarix</h4>

        <div className="history-list">
          {history.length > 0 ? (
            history.map((h) => (
              <div className="history-item" key={h.date}>
                <div>
                  <strong>{h.date}</strong>

                  <span>{h.attendance ? "Davomat bor" : "Davomat yo'q"}</span>
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

        {/* CLOSE BUTTON */}
        <button type="button" className="modal-close-btn" onClick={onClose}>
          Yopish
        </button>
      </div>
    </div>
  );
};

export default StudentModal;
