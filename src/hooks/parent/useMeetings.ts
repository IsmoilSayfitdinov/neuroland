import { useQuery } from "@tanstack/react-query";
import { MeetingsAPI } from "@/api/meetings.api";

export function useUpcomingEvents() {
  return useQuery({
    queryKey: ["parent", "events"],
    queryFn: () => MeetingsAPI.listMothersEvents(),
  });
}
