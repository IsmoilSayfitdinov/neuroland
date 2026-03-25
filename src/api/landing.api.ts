import api from "./api";
import type {
  LandingAll,
  HeroSection,
  PatchedHeroSectionRequest,
  AboutSection,
  PatchedAboutSectionRequest,
  PlatformSection,
  PatchedPlatformSectionRequest,
  ContactInfo,
  PatchedContactInfoRequest,
  ContactRequest,
  ContactRequestAdmin,
  ContactRequestCreateData,
  PatchedContactRequestAdminRequest,
  ContactRequestStats,
  FAQ,
  FAQRequest,
  PatchedFAQRequest,
  GalleryItem,
  GalleryItemRequest,
  PatchedGalleryItemRequest,
  SuccessStory,
  SuccessStoryRequest,
  PatchedSuccessStoryRequest,
  TeamMember,
  TeamMemberRequest,
  PatchedTeamMemberRequest,
  Testimonial,
  TestimonialRequest,
  PatchedTestimonialRequest,
  ValueCard,
  ValueCardRequest,
  PatchedValueCardRequest,
  Paginated,
} from "../types/landing.types";

/** Convert plain object (possibly with File values) to FormData */
function toFormData(data: Record<string, any>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (value instanceof File) {
      fd.append(key, value);
    } else if (typeof value === "object" && !(value instanceof Blob)) {
      fd.append(key, JSON.stringify(value));
    } else {
      fd.append(key, String(value));
    }
  }
  return fd;
}

/** Check if data contains any File objects */
function hasFile(data: Record<string, any>): boolean {
  return Object.values(data).some((v) => v instanceof File);
}

/** File fields — string URL bo'lsa olib tashlash (backend faqat File kutadi) */
const FILE_FIELDS = ["image", "photo", "thumbnail"];

function stripStringFiles(data: Record<string, any>): Record<string, any> {
  const cleaned = { ...data };
  for (const key of FILE_FIELDS) {
    if (key in cleaned && typeof cleaned[key] === "string") {
      delete cleaned[key];
    }
  }
  return cleaned;
}

/** Send as FormData if files present, otherwise JSON */
function preparePayload(data: Record<string, any>): FormData | Record<string, any> {
  const cleaned = stripStringFiles(data);
  return hasFile(cleaned) ? toFormData(cleaned) : cleaned;
}

export class LandingAPI {
  // --- Main ---
  static async getAll(): Promise<LandingAll> {
    const response = await api.get<LandingAll>("/v1/landing/");
    return response.data;
  }

  // --- Hero (Singleton) ---
  static async getHero(): Promise<HeroSection> {
    const response = await api.get<HeroSection>("/v1/landing/hero/");
    return response.data;
  }

  static async patchHero(data: PatchedHeroSectionRequest): Promise<HeroSection> {
    const response = await api.post<HeroSection>("/v1/landing/hero/", preparePayload(data));
    return response.data;
  }

  // --- About (Singleton) ---
  static async getAbout(): Promise<AboutSection> {
    const response = await api.get<AboutSection>("/v1/landing/about/");
    return response.data;
  }

  static async patchAbout(data: PatchedAboutSectionRequest): Promise<AboutSection> {
    const response = await api.post<AboutSection>("/v1/landing/about/", preparePayload(data));
    return response.data;
  }

  // --- Platform (Singleton) ---
  static async getPlatform(): Promise<PlatformSection> {
    const response = await api.get<PlatformSection>("/v1/landing/platform/");
    return response.data;
  }

  static async patchPlatform(data: PatchedPlatformSectionRequest): Promise<PlatformSection> {
    const response = await api.post<PlatformSection>("/v1/landing/platform/", preparePayload(data));
    return response.data;
  }

  // --- Contact Info (Singleton) ---
  static async getContactInfo(): Promise<ContactInfo> {
    const response = await api.get<ContactInfo>("/v1/landing/contact-info/");
    return response.data;
  }

  static async patchContactInfo(data: PatchedContactInfoRequest): Promise<ContactInfo> {
    const response = await api.post<ContactInfo>("/v1/landing/contact-info/", preparePayload(data));
    return response.data;
  }

  // --- Contact Requests ---
  static async listContactRequests(page?: number): Promise<ContactRequestAdmin[]> {
    const response = await api.get<Paginated<ContactRequestAdmin>>(
      "/v1/landing/contact-requests/", { params: { page } }
    );
    return response.data.results ?? [];
  }

  static async getContactRequest(id: number): Promise<ContactRequestAdmin> {
    const response = await api.get<ContactRequestAdmin>(`/v1/landing/contact-requests/${id}/`);
    return response.data;
  }

  static async createContactRequest(data: ContactRequestCreateData): Promise<ContactRequest> {
    const response = await api.post<ContactRequest>("/v1/landing/contact-requests/", data);
    return response.data;
  }

  static async patchContactRequest(id: number, data: PatchedContactRequestAdminRequest): Promise<ContactRequestAdmin> {
    const response = await api.patch<ContactRequestAdmin>(`/v1/landing/contact-requests/${id}/`, data);
    return response.data;
  }

  static async deleteContactRequest(id: number): Promise<void> {
    await api.delete(`/v1/landing/contact-requests/${id}/`);
  }

  static async markContactRequestRead(id: number): Promise<ContactRequestAdmin> {
    const response = await api.post<ContactRequestAdmin>(
      `/v1/landing/contact-requests/${id}/mark-read/`
    );
    return response.data;
  }

  static async getContactRequestStats(): Promise<ContactRequestStats> {
    const response = await api.get<ContactRequestStats>("/v1/landing/contact-requests/stats/");
    return response.data;
  }

  // --- FAQ ---
  static async listFAQs(page?: number): Promise<FAQ[]> {
    const response = await api.get<Paginated<FAQ>>(
      "/v1/landing/faqs/", { params: { page } }
    );
    return response.data.results ?? [];
  }

  static async createFAQ(data: FAQRequest): Promise<FAQ> {
    const response = await api.post<FAQ>("/v1/landing/faqs/", data);
    return response.data;
  }

  static async updateFAQ(id: number, data: FAQRequest): Promise<FAQ> {
    const response = await api.put<FAQ>(`/v1/landing/faqs/${id}/`, data);
    return response.data;
  }

  static async patchFAQ(id: number, data: PatchedFAQRequest): Promise<FAQ> {
    const response = await api.patch<FAQ>(`/v1/landing/faqs/${id}/`, data);
    return response.data;
  }

  static async deleteFAQ(id: number): Promise<void> {
    await api.delete(`/v1/landing/faqs/${id}/`);
  }

  // --- Gallery ---
  static async listGallery(page?: number): Promise<GalleryItem[]> {
    const response = await api.get<Paginated<GalleryItem>>(
      "/v1/landing/gallery/", { params: { page } }
    );
    return response.data.results ?? [];
  }

  static async createGalleryItem(data: GalleryItemRequest): Promise<GalleryItem> {
    const response = await api.post<GalleryItem>("/v1/landing/gallery/", preparePayload(data));
    return response.data;
  }

  static async updateGalleryItem(id: number, data: GalleryItemRequest): Promise<GalleryItem> {
    const response = await api.put<GalleryItem>(`/v1/landing/gallery/${id}/`, preparePayload(data));
    return response.data;
  }

  static async patchGalleryItem(id: number, data: PatchedGalleryItemRequest): Promise<GalleryItem> {
    const response = await api.patch<GalleryItem>(`/v1/landing/gallery/${id}/`, preparePayload(data));
    return response.data;
  }

  static async deleteGalleryItem(id: number): Promise<void> {
    await api.delete(`/v1/landing/gallery/${id}/`);
  }

  // --- Success Stories ---
  static async listStories(page?: number): Promise<SuccessStory[]> {
    const response = await api.get<Paginated<SuccessStory>>(
      "/v1/landing/stories/", { params: { page } }
    );
    return response.data.results ?? [];
  }

  static async createStory(data: SuccessStoryRequest): Promise<SuccessStory> {
    const response = await api.post<SuccessStory>("/v1/landing/stories/", data);
    return response.data;
  }

  static async updateStory(id: number, data: SuccessStoryRequest): Promise<SuccessStory> {
    const response = await api.put<SuccessStory>(`/v1/landing/stories/${id}/`, data);
    return response.data;
  }

  static async patchStory(id: number, data: PatchedSuccessStoryRequest): Promise<SuccessStory> {
    const response = await api.patch<SuccessStory>(`/v1/landing/stories/${id}/`, data);
    return response.data;
  }

  static async deleteStory(id: number): Promise<void> {
    await api.delete(`/v1/landing/stories/${id}/`);
  }

  // --- Team ---
  static async listTeam(page?: number): Promise<TeamMember[]> {
    const response = await api.get<Paginated<TeamMember>>(
      "/v1/landing/team/", { params: { page } }
    );
    return response.data.results ?? [];
  }

  static async createTeamMember(data: TeamMemberRequest): Promise<TeamMember> {
    const response = await api.post<TeamMember>("/v1/landing/team/", preparePayload(data));
    return response.data;
  }

  static async updateTeamMember(id: number, data: TeamMemberRequest): Promise<TeamMember> {
    const response = await api.put<TeamMember>(`/v1/landing/team/${id}/`, preparePayload(data));
    return response.data;
  }

  static async patchTeamMember(id: number, data: PatchedTeamMemberRequest): Promise<TeamMember> {
    const response = await api.patch<TeamMember>(`/v1/landing/team/${id}/`, preparePayload(data));
    return response.data;
  }

  static async deleteTeamMember(id: number): Promise<void> {
    await api.delete(`/v1/landing/team/${id}/`);
  }

  // --- Testimonials ---
  static async listTestimonials(page?: number): Promise<Testimonial[]> {
    const response = await api.get<Paginated<Testimonial>>(
      "/v1/landing/testimonials/", { params: { page } }
    );
    return response.data.results ?? [];
  }

  static async createTestimonial(data: TestimonialRequest): Promise<Testimonial> {
    const response = await api.post<Testimonial>("/v1/landing/testimonials/", preparePayload(data));
    return response.data;
  }

  static async updateTestimonial(id: number, data: TestimonialRequest): Promise<Testimonial> {
    const response = await api.put<Testimonial>(`/v1/landing/testimonials/${id}/`, preparePayload(data));
    return response.data;
  }

  static async patchTestimonial(id: number, data: PatchedTestimonialRequest): Promise<Testimonial> {
    const response = await api.patch<Testimonial>(`/v1/landing/testimonials/${id}/`, preparePayload(data));
    return response.data;
  }

  static async deleteTestimonial(id: number): Promise<void> {
    await api.delete(`/v1/landing/testimonials/${id}/`);
  }

  // --- Values ---
  static async listValues(page?: number): Promise<ValueCard[]> {
    const response = await api.get<Paginated<ValueCard>>(
      "/v1/landing/values/", { params: { page } }
    );
    return response.data.results ?? [];
  }

  static async createValueCard(data: ValueCardRequest): Promise<ValueCard> {
    const response = await api.post<ValueCard>("/v1/landing/values/", preparePayload(data));
    return response.data;
  }

  static async updateValueCard(id: number, data: ValueCardRequest): Promise<ValueCard> {
    const response = await api.put<ValueCard>(`/v1/landing/values/${id}/`, preparePayload(data));
    return response.data;
  }

  static async patchValueCard(id: number, data: PatchedValueCardRequest): Promise<ValueCard> {
    const response = await api.patch<ValueCard>(`/v1/landing/values/${id}/`, preparePayload(data));
    return response.data;
  }

  static async deleteValueCard(id: number): Promise<void> {
    await api.delete(`/v1/landing/values/${id}/`);
  }
}
