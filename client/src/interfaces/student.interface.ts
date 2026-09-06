import type { TaskStatus } from "../types/student.type";

export interface HistoryRecord {
  date: string;
  attendance: boolean;
  taskStatus: TaskStatus;
}

export interface Student {
  _id: string;
  fullName: string;
  course: number;
  history: HistoryRecord[];
}
