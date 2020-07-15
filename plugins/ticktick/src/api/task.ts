export class Task {
  id: string;
  projectId: string;
  sortOrder: number;
  title: string;
  content: string;
  desc: string;
  startDate: string;
  dueDate: string;
  timeZone: string;
  isAllDay: boolean;
  repeatFirstDate: string;
  repeatFlag: string;
  completedTime: string;
  completedUserId: number;
  repeatTaskId: string;
  priority: number;
  status: number;
  items: SubTask[];
  progress: number;
  modifiedTime: string;
  etag: string;
  deleted: number;
  createdTime: string;
  creator: number;
  remindTime: string;
  repeatFrom: string;
  pomodoroSummaries: any[];
  kind: string;
  tags: string[];
}

export class SubTask {
  id: string;
  status: number;
  sortOrder: number;
  startDate: string;
  isAllDay: boolean;
  completedTime: string;
  timeZone: string;
}
