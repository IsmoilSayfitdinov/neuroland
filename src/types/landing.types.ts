// --- Paginated wrapper ---
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// --- Hero Section (Singleton) ---
export interface HeroSection {
  id?: number;
  title: string;
  subtitle: string;
  button_text: string;
  image: string | null;
  stat_1_value: string;
  stat_1_label: string;
  stat_2_value: string;
  stat_2_label: string;
  stat_3_value: string;
  stat_3_label: string;
}

export interface HeroSectionRequest {
  title?: string;
  subtitle?: string;
  button_text?: string;
  image?: File | string | null;
  stat_1_value?: string;
  stat_1_label?: string;
  stat_2_value?: string;
  stat_2_label?: string;
  stat_3_value?: string;
  stat_3_label?: string;
}

export type PatchedHeroSectionRequest = Partial<HeroSectionRequest>;

// --- About Section (Singleton) ---
export interface AboutSection {
  id?: number;
  title: string;
  description: string;
  image: string | null;
  mission_title: string;
  mission_text: string;
  mission_icon: string;
  goal_title: string;
  goal_text: string;
  goal_icon: string;
}

export interface AboutSectionRequest {
  title?: string;
  description?: string;
  image?: File | string | null;
  mission_title?: string;
  mission_text?: string;
  mission_icon?: string;
  goal_title?: string;
  goal_text?: string;
  goal_icon?: string;
}

export type PatchedAboutSectionRequest = Partial<AboutSectionRequest>;

// --- Platform Section (Singleton) ---
export interface PlatformSection {
  id?: number;
  title: string;
  subtitle: string;
  image: string | null;
  doctor_title: string;
  doctor_subtitle: string;
  doctor_features: Record<string, any>;
  parent_title: string;
  parent_subtitle: string;
  parent_features: Record<string, any>;
}

export interface PlatformSectionRequest {
  title?: string;
  subtitle?: string;
  image?: File | string | null;
  doctor_title?: string;
  doctor_subtitle?: string;
  doctor_features?: Record<string, any>;
  parent_title?: string;
  parent_subtitle?: string;
  parent_features?: Record<string, any>;
}

export type PatchedPlatformSectionRequest = Partial<PlatformSectionRequest>;

// --- Contact Info (Singleton) ---
export interface ContactInfo {
  id?: number;
  address: string;
  phone: string;
  email: string;
  work_hours: string;
  footer_description: string;
}

export interface ContactInfoRequest {
  address?: string;
  phone?: string;
  email?: string;
  work_hours?: string;
  footer_description?: string;
}

export type PatchedContactInfoRequest = Partial<ContactInfoRequest>;

// --- Contact Requests ---
export interface ContactRequest {
  id: number;
  name: string;
  phone: string;
  child_age: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface ContactRequestAdmin {
  id: number;
  name: string;
  phone: string;
  child_age: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface ContactRequestCreateData {
  name: string;
  phone: string;
  child_age?: string;
  message?: string;
}

export interface ContactRequestAdminRequest {
  is_read?: boolean;
}

export type PatchedContactRequestAdminRequest = ContactRequestAdminRequest;

export interface ContactRequestStats {
  total_requests: number;
  unread_count: number;
}

// --- FAQ ---
export interface FAQ {
  id: number;
  question: string;
  answer: string;
  order: number;
  is_active: boolean;
}

export interface FAQRequest {
  question: string;
  answer: string;
  order?: number;
  is_active?: boolean;
}

export interface PatchedFAQRequest {
  question?: string;
  answer?: string;
  order?: number;
  is_active?: boolean;
}

// --- Gallery ---
export interface GalleryItem {
  id: number;
  photo: string;
  title: string;
  description: string;
  order: number;
  is_active: boolean;
}

export interface GalleryItemRequest {
  photo: File | string;
  title: string;
  description?: string;
  order?: number;
  is_active?: boolean;
}

export interface PatchedGalleryItemRequest {
  photo?: File | string;
  title?: string;
  description?: string;
  order?: number;
  is_active?: boolean;
}

// --- Success Stories ---
export interface SuccessStory {
  id: number;
  child_name: string;
  child_age: string;
  duration_text: string;
  diagnosis: string;
  before_text: string;
  after_text: string;
  metrics: Record<string, any>;
  order: number;
  is_active: boolean;
}

export interface SuccessStoryRequest {
  child_name: string;
  child_age: string;
  duration_text: string;
  diagnosis: string;
  before_text: string;
  after_text: string;
  metrics?: Record<string, any>;
  order?: number;
  is_active?: boolean;
}

export interface PatchedSuccessStoryRequest {
  child_name?: string;
  child_age?: string;
  duration_text?: string;
  diagnosis?: string;
  before_text?: string;
  after_text?: string;
  metrics?: Record<string, any>;
  order?: number;
  is_active?: boolean;
}

// --- Team ---
export interface TeamMember {
  id: number;
  photo: string | null;
  name: string;
  specialty: string;
  experience_years: number;
  order: number;
  is_active: boolean;
  bio?: string | null;
}

export interface TeamMemberRequest {
  photo?: File | string | null;
  name: string;
  specialty: string;
  experience_years?: number;
  order?: number;
  is_active?: boolean;
}

export interface PatchedTeamMemberRequest {
  photo?: File | string | null;
  name?: string;
  specialty?: string;
  experience_years?: number;
  order?: number;
  is_active?: boolean;
}

// --- Testimonials ---
export interface Testimonial {
  id: number;
  text: string;
  author_name: string;
  author_info: string;
  photo: string | null;
  order: number;
  is_active: boolean;
}

export interface TestimonialRequest {
  text: string;
  author_name: string;
  author_info: string;
  photo?: File | string | null;
  order?: number;
  is_active?: boolean;
}

export interface PatchedTestimonialRequest {
  text?: string;
  author_name?: string;
  author_info?: string;
  photo?: File | string | null;
  order?: number;
  is_active?: boolean;
}

// --- Values ---
export interface ValueCard {
  id: number;
  icon: string;
  title: string;
  description: string;
  image: string | null;
  order: number;
  is_active: boolean;
}

export interface ValueCardRequest {
  icon: string;
  title: string;
  description: string;
  image?: File | string | null;
  order?: number;
  is_active?: boolean;
}

export interface PatchedValueCardRequest {
  icon?: string;
  title?: string;
  description?: string;
  image?: File | string | null;
  order?: number;
  is_active?: boolean;
}

// --- Landing All ---
export interface LandingAll {
  hero: HeroSection;
  about: AboutSection;
  platform: PlatformSection;
  team: TeamMember[];
  testimonials: Testimonial[];
  stories: SuccessStory[];
  gallery: GalleryItem[];
  faqs: FAQ[];
  values: ValueCard[];
  contact_info: ContactInfo;
}
