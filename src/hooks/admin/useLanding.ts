import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LandingAPI } from "@/api/landing.api";
import { toast } from "sonner";
import type {
  HeroSectionRequest,
  PatchedHeroSectionRequest,
  AboutSectionRequest,
  PatchedAboutSectionRequest,
  PlatformSectionRequest,
  PatchedPlatformSectionRequest,
  ContactInfoRequest,
  PatchedContactInfoRequest,
  ContactRequestAdminRequest,
  FAQRequest,
  PatchedFAQRequest,
  GalleryItemRequest,
  PatchedGalleryItemRequest,
  SuccessStoryRequest,
  PatchedSuccessStoryRequest,
  TeamMemberRequest,
  PatchedTeamMemberRequest,
  TestimonialRequest,
  PatchedTestimonialRequest,
  ValueCardRequest,
  PatchedValueCardRequest,
} from "@/types/landing.types";

export const useLanding = () => {
  const queryClient = useQueryClient();

  const invalidate = (key: string) => {
    queryClient.invalidateQueries({ queryKey: ["landing", key] });
    queryClient.invalidateQueries({ queryKey: ["landing", "all"] });
  };

  // --- All ---
  const useLandingAll = () => useQuery({
    queryKey: ["landing", "all"],
    queryFn: () => LandingAPI.getAll(),
  });

  // --- Hero ---
  const useHeroList = () => useQuery({
    queryKey: ["landing", "hero"],
    queryFn: () => LandingAPI.listHero(),
  });

  const useUpdateHero = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: HeroSectionRequest }) =>
      LandingAPI.updateHero(id, data),
    onSuccess: () => { invalidate("hero"); toast.success("Hero bo'limi yangilandi"); },
    onError: () => toast.error("Hero yangilashda xatolik"),
  });

  const usePatchHero = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchedHeroSectionRequest }) =>
      LandingAPI.patchHero(id, data),
    onSuccess: () => { invalidate("hero"); toast.success("Hero bo'limi yangilandi"); },
    onError: () => toast.error("Hero yangilashda xatolik"),
  });

  // --- About ---
  const useAboutList = () => useQuery({
    queryKey: ["landing", "about"],
    queryFn: () => LandingAPI.listAbout(),
  });

  const useUpdateAbout = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: AboutSectionRequest }) =>
      LandingAPI.updateAbout(id, data),
    onSuccess: () => { invalidate("about"); toast.success("Biz haqimizda yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });

  const usePatchAbout = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchedAboutSectionRequest }) =>
      LandingAPI.patchAbout(id, data),
    onSuccess: () => { invalidate("about"); toast.success("Biz haqimizda yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });

  // --- Platform ---
  const usePlatformList = () => useQuery({
    queryKey: ["landing", "platform"],
    queryFn: () => LandingAPI.listPlatform(),
  });

  const useUpdatePlatform = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: PlatformSectionRequest }) =>
      LandingAPI.updatePlatform(id, data),
    onSuccess: () => { invalidate("platform"); toast.success("Platforma yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });

  const usePatchPlatform = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchedPlatformSectionRequest }) =>
      LandingAPI.patchPlatform(id, data),
    onSuccess: () => { invalidate("platform"); toast.success("Platforma yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });

  // --- Contact Info ---
  const useContactInfoList = () => useQuery({
    queryKey: ["landing", "contact-info"],
    queryFn: () => LandingAPI.listContactInfo(),
  });

  const useUpdateContactInfo = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: ContactInfoRequest }) =>
      LandingAPI.updateContactInfo(id, data),
    onSuccess: () => { invalidate("contact-info"); toast.success("Kontakt ma'lumotlari yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });

  const usePatchContactInfo = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchedContactInfoRequest }) =>
      LandingAPI.patchContactInfo(id, data),
    onSuccess: () => { invalidate("contact-info"); toast.success("Kontakt ma'lumotlari yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });

  // --- Contact Requests ---
  const useContactRequests = () => useQuery({
    queryKey: ["landing", "contact-requests"],
    queryFn: () => LandingAPI.listContactRequests(),
  });

  const useContactRequestStats = () => useQuery({
    queryKey: ["landing", "contact-requests-stats"],
    queryFn: () => LandingAPI.getContactRequestStats(),
  });

  const useUpdateContactRequest = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: ContactRequestAdminRequest }) =>
      LandingAPI.patchContactRequest(id, data),
    onSuccess: () => { invalidate("contact-requests"); toast.success("So'rov yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });

  const useMarkContactRequestRead = () => useMutation({
    mutationFn: (id: number) => LandingAPI.markContactRequestRead(id),
    onSuccess: () => { invalidate("contact-requests"); invalidate("contact-requests-stats"); },
  });

  const useDeleteContactRequest = () => useMutation({
    mutationFn: (id: number) => LandingAPI.deleteContactRequest(id),
    onSuccess: () => { invalidate("contact-requests"); toast.success("So'rov o'chirildi"); },
    onError: () => toast.error("O'chirishda xatolik"),
  });

  // --- FAQ ---
  const useFAQList = () => useQuery({
    queryKey: ["landing", "faqs"],
    queryFn: () => LandingAPI.listFAQs(),
  });

  const useCreateFAQ = () => useMutation({
    mutationFn: (data: FAQRequest) => LandingAPI.createFAQ(data),
    onSuccess: () => { invalidate("faqs"); toast.success("FAQ qo'shildi"); },
    onError: () => toast.error("FAQ qo'shishda xatolik"),
  });

  const useUpdateFAQ = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: FAQRequest }) =>
      LandingAPI.updateFAQ(id, data),
    onSuccess: () => { invalidate("faqs"); toast.success("FAQ yangilandi"); },
    onError: () => toast.error("FAQ yangilashda xatolik"),
  });

  const usePatchFAQ = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchedFAQRequest }) =>
      LandingAPI.patchFAQ(id, data),
    onSuccess: () => { invalidate("faqs"); toast.success("FAQ yangilandi"); },
    onError: () => toast.error("FAQ yangilashda xatolik"),
  });

  const useDeleteFAQ = () => useMutation({
    mutationFn: (id: number) => LandingAPI.deleteFAQ(id),
    onSuccess: () => { invalidate("faqs"); toast.success("FAQ o'chirildi"); },
    onError: () => toast.error("FAQ o'chirishda xatolik"),
  });

  // --- Gallery ---
  const useGalleryList = () => useQuery({
    queryKey: ["landing", "gallery"],
    queryFn: () => LandingAPI.listGallery(),
  });

  const useCreateGalleryItem = () => useMutation({
    mutationFn: (data: GalleryItemRequest) => LandingAPI.createGalleryItem(data),
    onSuccess: () => { invalidate("gallery"); toast.success("Galereya elementi qo'shildi"); },
    onError: () => toast.error("Qo'shishda xatolik"),
  });

  const useUpdateGalleryItem = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: GalleryItemRequest }) =>
      LandingAPI.updateGalleryItem(id, data),
    onSuccess: () => { invalidate("gallery"); toast.success("Galereya elementi yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });

  const useDeleteGalleryItem = () => useMutation({
    mutationFn: (id: number) => LandingAPI.deleteGalleryItem(id),
    onSuccess: () => { invalidate("gallery"); toast.success("Galereya elementi o'chirildi"); },
    onError: () => toast.error("O'chirishda xatolik"),
  });

  // --- Stories ---
  const useStoriesList = () => useQuery({
    queryKey: ["landing", "stories"],
    queryFn: () => LandingAPI.listStories(),
  });

  const useCreateStory = () => useMutation({
    mutationFn: (data: SuccessStoryRequest) => LandingAPI.createStory(data),
    onSuccess: () => { invalidate("stories"); toast.success("Muvaffaqiyat hikoyasi qo'shildi"); },
    onError: () => toast.error("Qo'shishda xatolik"),
  });

  const useUpdateStory = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: SuccessStoryRequest }) =>
      LandingAPI.updateStory(id, data),
    onSuccess: () => { invalidate("stories"); toast.success("Hikoya yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });

  const useDeleteStory = () => useMutation({
    mutationFn: (id: number) => LandingAPI.deleteStory(id),
    onSuccess: () => { invalidate("stories"); toast.success("Hikoya o'chirildi"); },
    onError: () => toast.error("O'chirishda xatolik"),
  });

  // --- Team ---
  const useTeamList = () => useQuery({
    queryKey: ["landing", "team"],
    queryFn: () => LandingAPI.listTeam(),
  });

  const useCreateTeamMember = () => useMutation({
    mutationFn: (data: TeamMemberRequest) => LandingAPI.createTeamMember(data),
    onSuccess: () => { invalidate("team"); toast.success("Jamoa a'zosi qo'shildi"); },
    onError: () => toast.error("Qo'shishda xatolik"),
  });

  const useUpdateTeamMember = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: TeamMemberRequest }) =>
      LandingAPI.updateTeamMember(id, data),
    onSuccess: () => { invalidate("team"); toast.success("Jamoa a'zosi yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });

  const useDeleteTeamMember = () => useMutation({
    mutationFn: (id: number) => LandingAPI.deleteTeamMember(id),
    onSuccess: () => { invalidate("team"); toast.success("Jamoa a'zosi o'chirildi"); },
    onError: () => toast.error("O'chirishda xatolik"),
  });

  // --- Testimonials ---
  const useTestimonialsList = () => useQuery({
    queryKey: ["landing", "testimonials"],
    queryFn: () => LandingAPI.listTestimonials(),
  });

  const useCreateTestimonial = () => useMutation({
    mutationFn: (data: TestimonialRequest) => LandingAPI.createTestimonial(data),
    onSuccess: () => { invalidate("testimonials"); toast.success("Sharh qo'shildi"); },
    onError: () => toast.error("Qo'shishda xatolik"),
  });

  const useUpdateTestimonial = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: TestimonialRequest }) =>
      LandingAPI.updateTestimonial(id, data),
    onSuccess: () => { invalidate("testimonials"); toast.success("Sharh yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });

  const useDeleteTestimonial = () => useMutation({
    mutationFn: (id: number) => LandingAPI.deleteTestimonial(id),
    onSuccess: () => { invalidate("testimonials"); toast.success("Sharh o'chirildi"); },
    onError: () => toast.error("O'chirishda xatolik"),
  });

  // --- Values ---
  const useValuesList = () => useQuery({
    queryKey: ["landing", "values"],
    queryFn: () => LandingAPI.listValues(),
  });

  const useCreateValueCard = () => useMutation({
    mutationFn: (data: ValueCardRequest) => LandingAPI.createValueCard(data),
    onSuccess: () => { invalidate("values"); toast.success("Qadriyat qo'shildi"); },
    onError: () => toast.error("Qo'shishda xatolik"),
  });

  const useUpdateValueCard = () => useMutation({
    mutationFn: ({ id, data }: { id: number; data: ValueCardRequest }) =>
      LandingAPI.updateValueCard(id, data),
    onSuccess: () => { invalidate("values"); toast.success("Qadriyat yangilandi"); },
    onError: () => toast.error("Yangilashda xatolik"),
  });

  const useDeleteValueCard = () => useMutation({
    mutationFn: (id: number) => LandingAPI.deleteValueCard(id),
    onSuccess: () => { invalidate("values"); toast.success("Qadriyat o'chirildi"); },
    onError: () => toast.error("O'chirishda xatolik"),
  });

  return {
    useLandingAll,
    // Hero
    useHeroList, useUpdateHero, usePatchHero,
    // About
    useAboutList, useUpdateAbout, usePatchAbout,
    // Platform
    usePlatformList, useUpdatePlatform, usePatchPlatform,
    // Contact Info
    useContactInfoList, useUpdateContactInfo, usePatchContactInfo,
    // Contact Requests
    useContactRequests, useContactRequestStats, useUpdateContactRequest,
    useMarkContactRequestRead, useDeleteContactRequest,
    // FAQ
    useFAQList, useCreateFAQ, useUpdateFAQ, usePatchFAQ, useDeleteFAQ,
    // Gallery
    useGalleryList, useCreateGalleryItem, useUpdateGalleryItem, useDeleteGalleryItem,
    // Stories
    useStoriesList, useCreateStory, useUpdateStory, useDeleteStory,
    // Team
    useTeamList, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember,
    // Testimonials
    useTestimonialsList, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial,
    // Values
    useValuesList, useCreateValueCard, useUpdateValueCard, useDeleteValueCard,
  };
};
