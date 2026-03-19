import { useQuery } from "@tanstack/react-query";
import { VideosAPI } from "@/api/videos.api";

export function useVideos() {
  return useQuery({
    queryKey: ["parent", "videos"],
    queryFn: () => VideosAPI.listVideos(),
  });
}

export function useVideosBySection(sectionId: number) {
  return useQuery({
    queryKey: ["parent", "videos", "section", sectionId],
    queryFn: () => VideosAPI.getVideosBySection(sectionId),
    enabled: !!sectionId,
  });
}
