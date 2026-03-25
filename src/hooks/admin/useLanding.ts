import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LandingAPI } from "@/api/landing.api";
import { toast } from "sonner";
import type {
  PatchedHeroSectionRequest,
  PatchedAboutSectionRequest,
  PatchedPlatformSectionRequest,
  PatchedContactInfoRequest,
  FAQRequest,
  GalleryItemRequest,
  SuccessStoryRequest,
  TeamMemberRequest,
  TestimonialRequest,
  ValueCardRequest,
} from "@/types/landing.types";

function useInvalidateLanding() {
  const queryClient = useQueryClient();
  return (key: string) => {
    queryClient.invalidateQueries({ queryKey: ["landing", key] });
    queryClient.invalidateQueries({ queryKey: ["landing", "all"] });
  };
}

// --- Hero (Singleton) ---
export function useHero() {
  return useQuery({
    queryKey: ["landing", "hero"],
    queryFn: () => LandingAPI.getHero(),
  });
}

export function usePatchHero() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (data: PatchedHeroSectionRequest) => LandingAPI.patchHero(data),
    onSuccess: () => { invalidate("hero"); toast.success("Hero bo'limi yangilandi"); },
    onError: () => toast.error("Hero yangilashda xatolik"),
  });
}

// --- About (Singleton) ---
export function useAbout() {
  return useQuery({
    queryKey: ["landing", "about"],
    queryFn: () => LandingAPI.getAbout(),
  });
}

export function usePatchAbout() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (data: PatchedAboutSectionRequest) => LandingAPI.patchAbout(data),
    onSuccess: () => { invalidate("about"); toast.success("Biz haqimizda yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });
}

// --- Platform (Singleton) ---
export function usePlatform() {
  return useQuery({
    queryKey: ["landing", "platform"],
    queryFn: () => LandingAPI.getPlatform(),
  });
}

export function usePatchPlatform() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (data: PatchedPlatformSectionRequest) => LandingAPI.patchPlatform(data),
    onSuccess: () => { invalidate("platform"); toast.success("Platforma yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });
}

// --- Contact Info (Singleton) ---
export function useContactInfo() {
  return useQuery({
    queryKey: ["landing", "contact-info"],
    queryFn: () => LandingAPI.getContactInfo(),
  });
}

export function usePatchContactInfo() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (data: PatchedContactInfoRequest) => LandingAPI.patchContactInfo(data),
    onSuccess: () => { invalidate("contact-info"); toast.success("Kontakt ma'lumotlari yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });
}

// --- Contact Requests ---
export function useContactRequests() {
  return useQuery({
    queryKey: ["landing", "contact-requests"],
    queryFn: () => LandingAPI.listContactRequests(),
  });
}

export function useContactRequestStats() {
  return useQuery({
    queryKey: ["landing", "contact-requests-stats"],
    queryFn: () => LandingAPI.getContactRequestStats(),
  });
}

export function useMarkContactRequestRead() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (id: number) => LandingAPI.markContactRequestRead(id),
    onSuccess: () => { invalidate("contact-requests"); invalidate("contact-requests-stats"); },
  });
}

export function useDeleteContactRequest() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (id: number) => LandingAPI.deleteContactRequest(id),
    onSuccess: () => { invalidate("contact-requests"); toast.success("So'rov o'chirildi"); },
    onError: () => toast.error("O'chirishda xatolik"),
  });
}

// --- FAQ ---
export function useFAQList() {
  return useQuery({
    queryKey: ["landing", "faqs"],
    queryFn: () => LandingAPI.listFAQs(),
  });
}

export function useCreateFAQ() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (data: FAQRequest) => LandingAPI.createFAQ(data),
    onSuccess: () => { invalidate("faqs"); toast.success("FAQ qo'shildi"); },
    onError: () => toast.error("FAQ qo'shishda xatolik"),
  });
}

export function useUpdateFAQ() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FAQRequest }) => LandingAPI.updateFAQ(id, data),
    onSuccess: () => { invalidate("faqs"); toast.success("FAQ yangilandi"); },
    onError: () => toast.error("FAQ yangilashda xatolik"),
  });
}

export function useDeleteFAQ() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (id: number) => LandingAPI.deleteFAQ(id),
    onSuccess: () => { invalidate("faqs"); toast.success("FAQ o'chirildi"); },
    onError: () => toast.error("FAQ o'chirishda xatolik"),
  });
}

// --- Gallery ---
export function useGalleryList() {
  return useQuery({
    queryKey: ["landing", "gallery"],
    queryFn: () => LandingAPI.listGallery(),
  });
}

export function useCreateGalleryItem() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (data: GalleryItemRequest) => LandingAPI.createGalleryItem(data),
    onSuccess: () => { invalidate("gallery"); toast.success("Galereya elementi qo'shildi"); },
    onError: () => toast.error("Qo'shishda xatolik"),
  });
}

export function useUpdateGalleryItem() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GalleryItemRequest }) => LandingAPI.updateGalleryItem(id, data),
    onSuccess: () => { invalidate("gallery"); toast.success("Galereya elementi yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });
}

export function useDeleteGalleryItem() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (id: number) => LandingAPI.deleteGalleryItem(id),
    onSuccess: () => { invalidate("gallery"); toast.success("Galereya elementi o'chirildi"); },
    onError: () => toast.error("O'chirishda xatolik"),
  });
}

// --- Stories ---
export function useStoriesList() {
  return useQuery({
    queryKey: ["landing", "stories"],
    queryFn: () => LandingAPI.listStories(),
  });
}

export function useCreateStory() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (data: SuccessStoryRequest) => LandingAPI.createStory(data),
    onSuccess: () => { invalidate("stories"); toast.success("Muvaffaqiyat hikoyasi qo'shildi"); },
    onError: () => toast.error("Qo'shishda xatolik"),
  });
}

export function useUpdateStory() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SuccessStoryRequest }) => LandingAPI.updateStory(id, data),
    onSuccess: () => { invalidate("stories"); toast.success("Hikoya yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });
}

export function useDeleteStory() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (id: number) => LandingAPI.deleteStory(id),
    onSuccess: () => { invalidate("stories"); toast.success("Hikoya o'chirildi"); },
    onError: () => toast.error("O'chirishda xatolik"),
  });
}

// --- Team ---
export function useTeamList() {
  return useQuery({
    queryKey: ["landing", "team"],
    queryFn: () => LandingAPI.listTeam(),
  });
}

export function useCreateTeamMember() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (data: TeamMemberRequest) => LandingAPI.createTeamMember(data),
    onSuccess: () => { invalidate("team"); toast.success("Jamoa a'zosi qo'shildi"); },
    onError: () => toast.error("Qo'shishda xatolik"),
  });
}

export function useUpdateTeamMember() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TeamMemberRequest }) => LandingAPI.updateTeamMember(id, data),
    onSuccess: () => { invalidate("team"); toast.success("Jamoa a'zosi yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });
}

export function useDeleteTeamMember() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (id: number) => LandingAPI.deleteTeamMember(id),
    onSuccess: () => { invalidate("team"); toast.success("Jamoa a'zosi o'chirildi"); },
    onError: () => toast.error("O'chirishda xatolik"),
  });
}

// --- Testimonials ---
export function useTestimonialsList() {
  return useQuery({
    queryKey: ["landing", "testimonials"],
    queryFn: () => LandingAPI.listTestimonials(),
  });
}

export function useCreateTestimonial() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (data: TestimonialRequest) => LandingAPI.createTestimonial(data),
    onSuccess: () => { invalidate("testimonials"); toast.success("Sharh qo'shildi"); },
    onError: () => toast.error("Qo'shishda xatolik"),
  });
}

export function useUpdateTestimonial() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TestimonialRequest }) => LandingAPI.updateTestimonial(id, data),
    onSuccess: () => { invalidate("testimonials"); toast.success("Sharh yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });
}

export function useDeleteTestimonial() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (id: number) => LandingAPI.deleteTestimonial(id),
    onSuccess: () => { invalidate("testimonials"); toast.success("Sharh o'chirildi"); },
    onError: () => toast.error("O'chirishda xatolik"),
  });
}

// --- Values ---
export function useValuesList() {
  return useQuery({
    queryKey: ["landing", "values"],
    queryFn: () => LandingAPI.listValues(),
  });
}

export function useCreateValueCard() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (data: ValueCardRequest) => LandingAPI.createValueCard(data),
    onSuccess: () => { invalidate("values"); toast.success("Qadriyat qo'shildi"); },
    onError: () => toast.error("Qo'shishda xatolik"),
  });
}

export function useUpdateValueCard() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ValueCardRequest }) => LandingAPI.updateValueCard(id, data),
    onSuccess: () => { invalidate("values"); toast.success("Qadriyat yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });
}

export function useDeleteValueCard() {
  const invalidate = useInvalidateLanding();
  return useMutation({
    mutationFn: (id: number) => LandingAPI.deleteValueCard(id),
    onSuccess: () => { invalidate("values"); toast.success("Qadriyat o'chirildi"); },
    onError: () => toast.error("O'chirishda xatolik"),
  });
}

// --- Backward compat wrapper ---
export const useLanding = () => ({
  useHero, usePatchHero,
  useAbout, usePatchAbout,
  usePlatform, usePatchPlatform,
  useContactInfo, usePatchContactInfo,
  useContactRequests, useContactRequestStats,
  useMarkContactRequestRead, useDeleteContactRequest,
  useFAQList, useCreateFAQ, useUpdateFAQ, useDeleteFAQ,
  useGalleryList, useCreateGalleryItem, useUpdateGalleryItem, useDeleteGalleryItem,
  useStoriesList, useCreateStory, useUpdateStory, useDeleteStory,
  useTeamList, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember,
  useTestimonialsList, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial,
  useValuesList, useCreateValueCard, useUpdateValueCard, useDeleteValueCard,
});
