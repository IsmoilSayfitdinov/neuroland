import api from "./api";
import type {
  LandingAll,
  HeroSection,
  HeroSectionRequest,
  PatchedHeroSectionRequest,
  AboutSection,
  AboutSectionRequest,
  PatchedAboutSectionRequest,
  PlatformSection,
  PlatformSectionRequest,
  PatchedPlatformSectionRequest,
  ContactInfo,
  ContactInfoRequest,
  PatchedContactInfoRequest,
  ContactRequest,
  ContactRequestAdmin,
  ContactRequestCreateData,
  ContactRequestAdminRequest,
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

export class LandingAPI {
  // --- Main ---
  static async getAll(): Promise<LandingAll> {
    const response = await api.get<LandingAll>("/v1/landing/");
    return response.data;
  }

  // --- Hero ---
  static async listHero(page?: number): Promise<HeroSection[]> {
    const response = await api.get<Paginated<HeroSection> | HeroSection[]>(
      "/v1/landing/hero/", { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async getHero(id: number): Promise<HeroSection> {
    const response = await api.get<HeroSection>(`/v1/landing/hero/${id}/`);
    return response.data;
  }

  static async updateHero(id: number, data: HeroSectionRequest): Promise<HeroSection> {
    const response = await api.put<HeroSection>(`/v1/landing/hero/${id}/`, data);
    return response.data;
  }

  static async patchHero(id: number, data: PatchedHeroSectionRequest): Promise<HeroSection> {
    const response = await api.patch<HeroSection>(`/v1/landing/hero/${id}/`, data);
    return response.data;
  }

  // --- About ---
  static async listAbout(page?: number): Promise<AboutSection[]> {
    const response = await api.get<Paginated<AboutSection> | AboutSection[]>(
      "/v1/landing/about/", { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async getAbout(id: number): Promise<AboutSection> {
    const response = await api.get<AboutSection>(`/v1/landing/about/${id}/`);
    return response.data;
  }

  static async updateAbout(id: number, data: AboutSectionRequest): Promise<AboutSection> {
    const response = await api.put<AboutSection>(`/v1/landing/about/${id}/`, data);
    return response.data;
  }

  static async patchAbout(id: number, data: PatchedAboutSectionRequest): Promise<AboutSection> {
    const response = await api.patch<AboutSection>(`/v1/landing/about/${id}/`, data);
    return response.data;
  }

  // --- Platform ---
  static async listPlatform(page?: number): Promise<PlatformSection[]> {
    const response = await api.get<Paginated<PlatformSection> | PlatformSection[]>(
      "/v1/landing/platform/", { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async getPlatform(id: number): Promise<PlatformSection> {
    const response = await api.get<PlatformSection>(`/v1/landing/platform/${id}/`);
    return response.data;
  }

  static async updatePlatform(id: number, data: PlatformSectionRequest): Promise<PlatformSection> {
    const response = await api.put<PlatformSection>(`/v1/landing/platform/${id}/`, data);
    return response.data;
  }

  static async patchPlatform(id: number, data: PatchedPlatformSectionRequest): Promise<PlatformSection> {
    const response = await api.patch<PlatformSection>(`/v1/landing/platform/${id}/`, data);
    return response.data;
  }

  // --- Contact Info ---
  static async listContactInfo(page?: number): Promise<ContactInfo[]> {
    const response = await api.get<Paginated<ContactInfo> | ContactInfo[]>(
      "/v1/landing/contact-info/", { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async getContactInfo(id: number): Promise<ContactInfo> {
    const response = await api.get<ContactInfo>(`/v1/landing/contact-info/${id}/`);
    return response.data;
  }

  static async updateContactInfo(id: number, data: ContactInfoRequest): Promise<ContactInfo> {
    const response = await api.put<ContactInfo>(`/v1/landing/contact-info/${id}/`, data);
    return response.data;
  }

  static async patchContactInfo(id: number, data: PatchedContactInfoRequest): Promise<ContactInfo> {
    const response = await api.patch<ContactInfo>(`/v1/landing/contact-info/${id}/`, data);
    return response.data;
  }

  // --- Contact Requests ---
  static async listContactRequests(page?: number): Promise<ContactRequestAdmin[]> {
    const response = await api.get<Paginated<ContactRequestAdmin> | ContactRequestAdmin[]>(
      "/v1/landing/contact-requests/", { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async getContactRequest(id: number): Promise<ContactRequestAdmin> {
    const response = await api.get<ContactRequestAdmin>(`/v1/landing/contact-requests/${id}/`);
    return response.data;
  }

  static async createContactRequest(data: ContactRequestCreateData): Promise<ContactRequest> {
    const response = await api.post<ContactRequest>("/v1/landing/contact-requests/", data);
    return response.data;
  }

  static async updateContactRequest(id: number, data: ContactRequestAdminRequest): Promise<ContactRequestAdmin> {
    const response = await api.put<ContactRequestAdmin>(`/v1/landing/contact-requests/${id}/`, data);
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
    const response = await api.get<Paginated<FAQ> | FAQ[]>(
      "/v1/landing/faqs/", { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async getFAQ(id: number): Promise<FAQ> {
    const response = await api.get<FAQ>(`/v1/landing/faqs/${id}/`);
    return response.data;
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
    const response = await api.get<Paginated<GalleryItem> | GalleryItem[]>(
      "/v1/landing/gallery/", { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async getGalleryItem(id: number): Promise<GalleryItem> {
    const response = await api.get<GalleryItem>(`/v1/landing/gallery/${id}/`);
    return response.data;
  }

  static async createGalleryItem(data: GalleryItemRequest): Promise<GalleryItem> {
    const response = await api.post<GalleryItem>("/v1/landing/gallery/", data);
    return response.data;
  }

  static async updateGalleryItem(id: number, data: GalleryItemRequest): Promise<GalleryItem> {
    const response = await api.put<GalleryItem>(`/v1/landing/gallery/${id}/`, data);
    return response.data;
  }

  static async patchGalleryItem(id: number, data: PatchedGalleryItemRequest): Promise<GalleryItem> {
    const response = await api.patch<GalleryItem>(`/v1/landing/gallery/${id}/`, data);
    return response.data;
  }

  static async deleteGalleryItem(id: number): Promise<void> {
    await api.delete(`/v1/landing/gallery/${id}/`);
  }

  // --- Success Stories ---
  static async listStories(page?: number): Promise<SuccessStory[]> {
    const response = await api.get<Paginated<SuccessStory> | SuccessStory[]>(
      "/v1/landing/stories/", { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async getStory(id: number): Promise<SuccessStory> {
    const response = await api.get<SuccessStory>(`/v1/landing/stories/${id}/`);
    return response.data;
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
    const response = await api.get<Paginated<TeamMember> | TeamMember[]>(
      "/v1/landing/team/", { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async getTeamMember(id: number): Promise<TeamMember> {
    const response = await api.get<TeamMember>(`/v1/landing/team/${id}/`);
    return response.data;
  }

  static async createTeamMember(data: TeamMemberRequest): Promise<TeamMember> {
    const response = await api.post<TeamMember>("/v1/landing/team/", data);
    return response.data;
  }

  static async updateTeamMember(id: number, data: TeamMemberRequest): Promise<TeamMember> {
    const response = await api.put<TeamMember>(`/v1/landing/team/${id}/`, data);
    return response.data;
  }

  static async patchTeamMember(id: number, data: PatchedTeamMemberRequest): Promise<TeamMember> {
    const response = await api.patch<TeamMember>(`/v1/landing/team/${id}/`, data);
    return response.data;
  }

  static async deleteTeamMember(id: number): Promise<void> {
    await api.delete(`/v1/landing/team/${id}/`);
  }

  // --- Testimonials ---
  static async listTestimonials(page?: number): Promise<Testimonial[]> {
    const response = await api.get<Paginated<Testimonial> | Testimonial[]>(
      "/v1/landing/testimonials/", { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async getTestimonial(id: number): Promise<Testimonial> {
    const response = await api.get<Testimonial>(`/v1/landing/testimonials/${id}/`);
    return response.data;
  }

  static async createTestimonial(data: TestimonialRequest): Promise<Testimonial> {
    const response = await api.post<Testimonial>("/v1/landing/testimonials/", data);
    return response.data;
  }

  static async updateTestimonial(id: number, data: TestimonialRequest): Promise<Testimonial> {
    const response = await api.put<Testimonial>(`/v1/landing/testimonials/${id}/`, data);
    return response.data;
  }

  static async patchTestimonial(id: number, data: PatchedTestimonialRequest): Promise<Testimonial> {
    const response = await api.patch<Testimonial>(`/v1/landing/testimonials/${id}/`, data);
    return response.data;
  }

  static async deleteTestimonial(id: number): Promise<void> {
    await api.delete(`/v1/landing/testimonials/${id}/`);
  }

  // --- Values ---
  static async listValues(page?: number): Promise<ValueCard[]> {
    const response = await api.get<Paginated<ValueCard> | ValueCard[]>(
      "/v1/landing/values/", { params: { page } }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  }

  static async getValueCard(id: number): Promise<ValueCard> {
    const response = await api.get<ValueCard>(`/v1/landing/values/${id}/`);
    return response.data;
  }

  static async createValueCard(data: ValueCardRequest): Promise<ValueCard> {
    const response = await api.post<ValueCard>("/v1/landing/values/", data);
    return response.data;
  }

  static async updateValueCard(id: number, data: ValueCardRequest): Promise<ValueCard> {
    const response = await api.put<ValueCard>(`/v1/landing/values/${id}/`, data);
    return response.data;
  }

  static async patchValueCard(id: number, data: PatchedValueCardRequest): Promise<ValueCard> {
    const response = await api.patch<ValueCard>(`/v1/landing/values/${id}/`, data);
    return response.data;
  }

  static async deleteValueCard(id: number): Promise<void> {
    await api.delete(`/v1/landing/values/${id}/`);
  }
}
