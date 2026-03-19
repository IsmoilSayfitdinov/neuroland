import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VideosAPI } from "@/api/videos.api";
import type { VideoCreateRequest, PatchedVideoUpdateRequest } from "@/types/videos.types";
import { toast } from "sonner";

export const useVideos = () => {
  const queryClient = useQueryClient();

  // Barcha videolar
  const useVideosList = () => {
    return useQuery({
      queryKey: ["videos"],
      queryFn: () => VideosAPI.listVideos(),
    });
  };

  // Bo'limdagi videolar
  const useVideosBySection = (sectionId: number) => {
    return useQuery({
      queryKey: ["videos", "section", sectionId],
      queryFn: () => VideosAPI.getVideosBySection(sectionId),
      enabled: !!sectionId,
    });
  };

  // Yosh guruhidagi videolar
  const useVideosByAgeGroup = (ageGroupId: number) => {
    return useQuery({
      queryKey: ["videos", "age_group", ageGroupId],
      queryFn: () => VideosAPI.getVideosByAgeGroup(ageGroupId),
      enabled: !!ageGroupId,
    });
  };

  // Video yaratish
  const useCreateVideo = () => {
    return useMutation({
      mutationFn: (data: VideoCreateRequest) => VideosAPI.createVideo(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["videos"] });
        toast.success("Video muvaffaqiyatli qo'shildi");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Video qo'shishda xatolik yuz berdi");
      },
    });
  };

  // Video yangilash
  const useUpdateVideo = () => {
    return useMutation({
      mutationFn: ({ videoId, data }: { videoId: number; data: PatchedVideoUpdateRequest }) =>
        VideosAPI.updateVideo(videoId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["videos"] });
        toast.success("Video muvaffaqiyatli yangilandi");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Video yangilashda xatolik yuz berdi");
      },
    });
  };

  // Video o'chirish
  const useDeleteVideo = () => {
    return useMutation({
      mutationFn: (videoId: number) => VideosAPI.deleteVideo(videoId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["videos"] });
        toast.success("Video o'chirildi");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Video o'chirishda xatolik yuz berdi");
      },
    });
  };

  return {
    useVideosList,
    useVideosBySection,
    useVideosByAgeGroup,
    useCreateVideo,
    useUpdateVideo,
    useDeleteVideo,
  };
};
