import api from "./api";
import type {
  Topic,
  TopicList,
  TopicListRequest,
  PatchedTopicListRequest,
  TopicExercise,
  TopicExerciseProgress,
  PaginatedTopicList,
  PaginatedTopicExerciseList,
} from "../types/topic.types";

export class TopicsAPI {
  // --- Topics ---

  static async listTopics(params?: { group_id?: number; page?: number }): Promise<TopicList[]> {
    const response = await api.get<PaginatedTopicList | TopicList[]>("/v1/topics/", { params });
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async createTopic(data: TopicListRequest): Promise<TopicList> {
    const response = await api.post<TopicList>("/v1/topics/", data);
    return response.data;
  }

  static async getTopicById(id: number): Promise<Topic> {
    const response = await api.get<Topic>(`/v1/topics/${id}/`);
    return response.data;
  }

  static async updateTopic(id: number, data: TopicListRequest): Promise<TopicList> {
    const response = await api.put<TopicList>(`/v1/topics/${id}/`, data);
    return response.data;
  }

  static async patchTopic(id: number, data: PatchedTopicListRequest): Promise<TopicList> {
    const response = await api.patch<TopicList>(`/v1/topics/${id}/`, data);
    return response.data;
  }

  static async deleteTopic(id: number): Promise<void> {
    await api.delete(`/v1/topics/${id}/`);
  }

  static async assignGroup(id: number, data: { group: number; week_start?: string }): Promise<TopicList> {
    const response = await api.post<TopicList>(`/v1/topics/${id}/assign-group/`, data);
    return response.data;
  }

  static async detachGroup(id: number, groupId: number): Promise<void> {
    await api.post(`/v1/topics/${id}/detach-group/${groupId}/`);
  }

  static async addExercise(id: number, data: { title: string; notes?: string | null; video_url?: string | null }): Promise<TopicList> {
    const response = await api.post<TopicList>(`/v1/topics/${id}/exercises/`, data);
    return response.data;
  }

  static async removeExercise(id: number, exId: number): Promise<void> {
    await api.delete(`/v1/topics/${id}/exercises/${exId}/`);
  }

  static async getActiveTopics(groupId?: number): Promise<TopicList> {
    const response = await api.get<TopicList>("/v1/topics/active/", {
      params: groupId ? { group_id: groupId } : undefined,
    });
    return response.data;
  }

  static async rotateTopics(groupIds: number[]): Promise<any> {
    const response = await api.post("/v1/topics/rotate/", { group_ids: groupIds });
    return response.data;
  }

  // --- Topic Exercises (Bilim Markazi - Video) ---

  static async listExercises(page?: number): Promise<TopicExercise[]> {
    const response = await api.get<PaginatedTopicExerciseList | TopicExercise[]>(
      "/v1/topics/exercises/",
      { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async getExerciseById(id: number): Promise<TopicExercise> {
    const response = await api.get<TopicExercise>(`/v1/topics/exercises/${id}/`);
    return response.data;
  }

  static async startExercise(id: number): Promise<TopicExerciseProgress> {
    const response = await api.post<TopicExerciseProgress>(`/v1/topics/exercises/${id}/start/`);
    return response.data;
  }

  static async endExercise(id: number): Promise<TopicExerciseProgress> {
    const response = await api.post<TopicExerciseProgress>(`/v1/topics/exercises/${id}/end/`);
    return response.data;
  }
}
