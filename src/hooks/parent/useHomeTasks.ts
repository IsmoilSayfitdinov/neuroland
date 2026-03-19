import { useQuery } from "@tanstack/react-query";
import { SessionsAPI } from "@/api/sessions.api";

export function useHomeTasks() {
  return useQuery({
    queryKey: ["parent", "home-tasks"],
    queryFn: () => SessionsAPI.listHomeTasks(),
  });
}
