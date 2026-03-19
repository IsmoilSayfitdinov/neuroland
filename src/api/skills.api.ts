import api from "./api";
import type {
  AgeGroupOut,
  SectionOut,
  ExerciseOut,
  AgeGroupCreateRequest,
  SectionCreateRequest,
  PatchedSectionUpdateRequest,
  ExerciseCreateRequest, 
  PatchedExerciseUpdateRequest,
} from "../types/skills.types";

export class SkillsAPI {
  // --- Age Groups ---
  static async createAgeGroup(data: AgeGroupCreateRequest): Promise<AgeGroupOut> {
    const response = await api.post<AgeGroupOut>("/v1/skills/age-groups/", data);
    return response.data;
  }

  static async listAgeGroups(): Promise<AgeGroupOut[]> {
    const response = await api.get<AgeGroupOut[]>("/v1/skills/age-groups/");
    return response.data;
  }

  static async deleteAgeGroup(ageGroupId: number): Promise<void> {
    await api.delete(`/v1/skills/age-groups/${ageGroupId}/`);
  }

  // NOTE: Swagger doesn't currently list a PUT/PATCH for AgeGroups, so we'll omit updateAgeGroup unless specified

  // --- Sections ---
  static async listSections(): Promise<SectionOut[]> {
    const response = await api.get<SectionOut[]>("/v1/skills/sections/");
    return response.data;
  }

  static async createSection(data: SectionCreateRequest): Promise<SectionOut> {
    const response = await api.post<SectionOut>("/v1/skills/sections/", data);
    return response.data;
  }

  static async updateSection(sectionId: number, data: PatchedSectionUpdateRequest): Promise<SectionOut> {
    const response = await api.patch<SectionOut>(`/v1/skills/sections/${sectionId}/`, data);
    return response.data;
  }

  static async deleteSection(sectionId: number): Promise<void> {
    await api.delete(`/v1/skills/sections/${sectionId}/`);
  }

  // --- Exercises ---
  static async createExercise(data: ExerciseCreateRequest): Promise<ExerciseOut> {
    const response = await api.post<ExerciseOut>("/v1/skills/exercises/", data);
    return response.data;
  }

  static async listExercises(): Promise<ExerciseOut[]> {
    const response = await api.get<ExerciseOut[]>("/v1/skills/exercises/");
    return response.data;
  }

  static async getExercise(exerciseId: number): Promise<ExerciseOut> {
    const response = await api.get<ExerciseOut>(`/v1/skills/exercises/${exerciseId}/`);
    return response.data;
  }

  static async listExercisesBySection(sectionId: number): Promise<ExerciseOut[]> {
    const response = await api.get<ExerciseOut[]>(`/v1/skills/sections/${sectionId}/exercises/`);
    return response.data;
  }

  static async updateExercise(exerciseId: number, data: PatchedExerciseUpdateRequest): Promise<ExerciseOut> {
    const response = await api.patch<ExerciseOut>(`/v1/skills/exercises/${exerciseId}/`, data);
    return response.data;
  }

  static async deleteExercise(exerciseId: number): Promise<void> {
    await api.delete(`/v1/skills/exercises/${exerciseId}/`);
  }
}
