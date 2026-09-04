export interface HistoryRecord {
  date: string;
  attendance: boolean;
  taskStatus: "bajarilgan" | "toliq bajarilmagan" | "bajarilmagan";
}

export interface Student {
  _id: string;
  fullName: string;
  course: number;
  history: HistoryRecord[];
}
