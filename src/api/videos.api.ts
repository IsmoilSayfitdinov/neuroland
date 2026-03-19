import api from "./api";
import type {
  VideoOut,
  VideoCreateRequest,
  PatchedVideoUpdateRequest
} from "../types/videos.types";

export class VideosAPI {
  /**
   * Video yaratish (Admin)
   */
  static async createVideo(data: VideoCreateRequest): Promise<VideoOut> {
    const response = await api.post<VideoOut>("/v1/videos/", data);
    return response.data;
  }

  /**
   * Barcha videolar
   */
  static async listVideos(): Promise<VideoOut[]> {
    const response = await api.get<VideoOut[]>("/v1/videos/");
    return response.data;
  }

  /**
   * Bo'limdagi videolar
   */
  static async getVideosBySection(sectionId: number): Promise<VideoOut[]> {
    const response = await api.get<VideoOut[]>(`/v1/videos/section/${sectionId}/`);
    return response.data;
  }

  /**
   * Yosh guruhidagi videolar
   */
  static async getVideosByAgeGroup(ageGroupId: number): Promise<VideoOut[]> {
    const response = await api.get<VideoOut[]>(`/v1/videos/age_group/${ageGroupId}/`);
    return response.data;
  }

  /**
   * Video yangilash (Admin)
   */
  static async updateVideo(videoId: number, data: PatchedVideoUpdateRequest): Promise<VideoOut> {
    const response = await api.patch<VideoOut>(`/v1/videos/${videoId}/`, data);
    return response.data;
  }

  /**
   * Video o'chirish (Admin)
   */
  static async deleteVideo(videoId: number): Promise<void> {
    await api.delete(`/v1/videos/${videoId}/`);
  }
}

