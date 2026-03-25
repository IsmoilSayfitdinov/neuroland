import api from "./api";
import type {
  Session,
  SessionRequest,
  PatchedSessionRequest,
  PaginatedSessionList,
  ScheduleSlot,
  ScheduleSlotRequest,
  PatchedScheduleSlotRequest,
  PaginatedScheduleSlotList,
  HomeTask,
  HomeTaskRequest,
  PatchedHomeTaskRequest,
  PaginatedHomeTaskList,
  AttendanceEntry,
  AttendanceResult,
  SessionReport,
  SessionReportRequest,
  SessionReportMedia,
  HomeTaskReviewRequest,
} from "../types/session.types";

export class SessionsAPI {
  // --- Sessions ---

  static async list(params?: { page?: number; date?: string; group?: number }): Promise<Session[]> {
    const response = await api.get<PaginatedSessionList | Session[]>(
      "/v1/sessions/",
      { params }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async create(data: SessionRequest): Promise<Session> {
    const response = await api.post<Session>("/v1/sessions/", data);
    return response.data;
  }

  static async getById(id: number): Promise<Session> {
    const response = await api.get<Session>(`/v1/sessions/${id}/`);
    return response.data;
  }

  static async update(id: number, data: SessionRequest): Promise<Session> {
    const response = await api.put<Session>(`/v1/sessions/${id}/`, data);
    return response.data;
  }

  static async patch(id: number, data: PatchedSessionRequest): Promise<Session> {
    const response = await api.patch<Session>(`/v1/sessions/${id}/`, data);
    return response.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/v1/sessions/${id}/`);
  }

  /** POST /sessions/{id}/start/ — no body needed */
  static async start(id: number): Promise<Session> {
    const response = await api.post<Session>(`/v1/sessions/${id}/start/`);
    return response.data;
  }

  /** POST /sessions/{id}/end/ — no body needed */
  static async end(id: number): Promise<Session> {
    const response = await api.post<Session>(`/v1/sessions/${id}/end/`);
    return response.data;
  }

  /** POST /sessions/{id}/attendance/ */
  static async markAttendance(
    id: number,
    attendances: AttendanceEntry[]
  ): Promise<AttendanceResult[]> {
    const response = await api.post<AttendanceResult[]>(
      `/v1/sessions/${id}/attendance/`,
      { attendances }
    );
    return response.data;
  }

  /** GET /sessions/{id}/report/ */
  static async getReport(id: number): Promise<SessionReport> {
    const response = await api.get<SessionReport>(`/v1/sessions/${id}/report/`);
    return response.data;
  }

  /** POST /sessions/{id}/report/ */
  static async createReport(id: number, data: SessionReportRequest): Promise<SessionReport> {
    const response = await api.post<SessionReport>(`/v1/sessions/${id}/report/`, data);
    return response.data;
  }

  /** POST /sessions/{id}/report/media/ */
  static async uploadReportMedia(
    id: number,
    file: File,
    mediaType: "image" | "video" = "image"
  ): Promise<SessionReportMedia> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("media_type", mediaType);
    const response = await api.post<SessionReportMedia>(
      `/v1/sessions/${id}/report/media/`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  }

  /** GET /sessions/today/ — returns array */
  static async getToday(): Promise<Session[]> {
    const response = await api.get<Session[]>("/v1/sessions/today/");
    const data = response.data;
    return Array.isArray(data) ? data : [];
  }

  // --- Schedule Slots ---

  static async listSlots(params?: { page?: number; group?: number; specialist?: number }): Promise<ScheduleSlot[]> {
    const response = await api.get<PaginatedScheduleSlotList | ScheduleSlot[]>(
      "/v1/sessions/schedule-slots/",
      { params }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async createSlot(data: ScheduleSlotRequest): Promise<ScheduleSlot> {
    const response = await api.post<ScheduleSlot>("/v1/sessions/schedule-slots/", data);
    return response.data;
  }

  static async getSlotById(id: number): Promise<ScheduleSlot> {
    const response = await api.get<ScheduleSlot>(`/v1/sessions/schedule-slots/${id}/`);
    return response.data;
  }

  static async updateSlot(id: number, data: ScheduleSlotRequest): Promise<ScheduleSlot> {
    const response = await api.put<ScheduleSlot>(`/v1/sessions/schedule-slots/${id}/`, data);
    return response.data;
  }

  static async patchSlot(id: number, data: PatchedScheduleSlotRequest): Promise<ScheduleSlot> {
    const response = await api.patch<ScheduleSlot>(`/v1/sessions/schedule-slots/${id}/`, data);
    return response.data;
  }

  static async deleteSlot(id: number): Promise<void> {
    await api.delete(`/v1/sessions/schedule-slots/${id}/`);
  }

  // --- Home Tasks ---

  static async listHomeTasks(params?: { child_id?: number; page?: number }): Promise<HomeTask[]> {
    const response = await api.get<PaginatedHomeTaskList | HomeTask[]>(
      "/v1/sessions/home-tasks/",
      { params }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async createHomeTask(data: HomeTaskRequest): Promise<HomeTask> {
    const response = await api.post<HomeTask>("/v1/sessions/home-tasks/", data);
    return response.data;
  }

  static async getHomeTaskById(id: number): Promise<HomeTask> {
    const response = await api.get<HomeTask>(`/v1/sessions/home-tasks/${id}/`);
    return response.data;
  }

  static async updateHomeTask(id: number, data: HomeTaskRequest): Promise<HomeTask> {
    const response = await api.put<HomeTask>(`/v1/sessions/home-tasks/${id}/`, data);
    return response.data;
  }

  static async patchHomeTask(id: number, data: PatchedHomeTaskRequest): Promise<HomeTask> {
    const response = await api.patch<HomeTask>(`/v1/sessions/home-tasks/${id}/`, data);
    return response.data;
  }

  static async deleteHomeTask(id: number): Promise<void> {
    await api.delete(`/v1/sessions/home-tasks/${id}/`);
  }

  /** POST /sessions/home-tasks/{id}/submit/ — multipart with evidence_file */
  static async submitHomeTask(id: number, evidenceFile: File): Promise<HomeTask> {
    const formData = new FormData();
    formData.append("evidence_file", evidenceFile);
    const response = await api.post<HomeTask>(
      `/v1/sessions/home-tasks/${id}/submit/`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  }

  /** POST /sessions/home-tasks/{id}/review/ */
  static async reviewHomeTask(id: number, data: HomeTaskReviewRequest): Promise<HomeTask> {
    const response = await api.post<HomeTask>(`/v1/sessions/home-tasks/${id}/review/`, data);
    return response.data;
  }
}
