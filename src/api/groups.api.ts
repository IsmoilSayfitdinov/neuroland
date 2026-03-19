import api from "./api";
import type { ChildOut } from "../types/children.types";
import type {
  GroupOut,
  GroupCreateRequest,
  GroupUpdateRequest
} from "../types/groups.types";

export class GroupsAPI {
  static async createGroup(data: GroupCreateRequest): Promise<GroupOut> {
    const response = await api.post<GroupOut>("/v1/groups/", data);
    return response.data;
  }

  static async listGroups(): Promise<GroupOut[]> {
    const response = await api.get<GroupOut[]>("/v1/groups/");
    return response.data;
  }

  static async getGroupById(groupId: number): Promise<GroupOut> {
    const response = await api.get<GroupOut>(`/v1/groups/${groupId}/`);
    return response.data;
  }

  static async updateGroup(groupId: number, data: GroupUpdateRequest): Promise<GroupOut> {
    const response = await api.put<GroupOut>(`/v1/groups/${groupId}/`, data);
    return response.data;
  }

  static async deleteGroup(groupId: number): Promise<void> {
    await api.delete(`/v1/groups/${groupId}/`);
  }

  static async listUnassignedPatients(): Promise<ChildOut[]> {
    const response = await api.get<ChildOut[]>("/v1/groups/unassigned-children/");
    return response.data;
  }
}

