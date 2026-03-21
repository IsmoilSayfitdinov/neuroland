// --- Paginated wrapper ---
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// --- Hero Section ---
export interface HeroSection {
  id: number;
  title: string;
  subtitle: string;
  hero_image_url: string;
  cta_text: string;
  cta_link: string;
}

export interface HeroSectionRequest {
  title: string;
  subtitle: string;
  hero_image_url: string;
  cta_text: string;
  cta_link: string;
}

export interface PatchedHeroSectionRequest {
  title?: string;
  subtitle?: string;
  hero_image_url?: string;
  cta_text?: string;
  cta_link?: string;
}

// --- About Section ---
export interface AboutSection {
  id: number;
  title: string;
  description: string;
  image_url: string;
  mission: string;
  vision: string;
}

export interface AboutSectionRequest {
  title: string;
  description: string;
  image_url: string;
  mission: string;
  vision: string;
}

export interface PatchedAboutSectionRequest {
  title?: string;
  description?: string;
  image_url?: string;
  mission?: string;
  vision?: string;
}

// --- Platform Section ---
export interface PlatformSection {
  id: number;
  title: string;
  description: string;
  features: any[];
  image_url: string;
}

export interface PlatformSectionRequest {
  title: string;
  description: string;
  features: any[];
  image_url: string;
}

export interface PatchedPlatformSectionRequest {
  title?: string;
  description?: string;
  features?: any[];
  image_url?: string;
}

// --- Contact Info ---
export interface ContactInfo {
  id: number;
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  social_media: Record<string, string>;
}

export interface ContactInfoRequest {
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  social_media: Record<string, string>;
}

export interface PatchedContactInfoRequest {
  phone?: string;
  email?: string;
  address?: string;
  working_hours?: string;
  social_media?: Record<string, string>;
}

// --- Contact Requests ---
export interface ContactRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface ContactRequestAdmin {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  is_read: boolean;
  created_at: string;
  response: string | null;
}

export interface ContactRequestCreateData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactRequestAdminRequest {
  response?: string;
  status?: string;
  is_read?: boolean;
}

export interface PatchedContactRequestAdminRequest {
  response?: string;
  status?: string;
  is_read?: boolean;
}

export interface ContactRequestStats {
  total_requests: number;
  unread_count: number;
  by_status: Record<string, number>;
}

// --- FAQ ---
export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface FAQRequest {
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface PatchedFAQRequest {
  question?: string;
  answer?: string;
  category?: string;
  order?: number;
}

// --- Gallery ---
export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  order: number;
  created_at: string;
}

export interface GalleryItemRequest {
  title: string;
  description: string;
  image_url: string;
  category: string;
  order: number;
}

export interface PatchedGalleryItemRequest {
  title?: string;
  description?: string;
  image_url?: string;
  category?: string;
  order?: number;
}

// --- Success Stories ---
export interface SuccessStory {
  id: number;
  title: string;
  description: string;
  image_url: string;
  child_name: string;
  age: number;
  results: string;
  testimonial?: string;
  created_at: string;
}

export interface SuccessStoryRequest {
  title: string;
  description: string;
  image_url: string;
  child_name: string;
  age: number;
  results: string;
  testimonial?: string;
}

export interface PatchedSuccessStoryRequest {
  title?: string;
  description?: string;
  image_url?: string;
  child_name?: string;
  age?: number;
  results?: string;
  testimonial?: string;
}

// --- Team ---
export interface TeamMember {
  id: number;
  name: string;
  title: string;
  bio: string;
  image_url: string;
  email: string;
  social_links: Record<string, string>;
}

export interface TeamMemberRequest {
  name: string;
  title: string;
  bio: string;
  image_url: string;
  email: string;
  social_links: Record<string, string>;
}

export interface PatchedTeamMemberRequest {
  name?: string;
  title?: string;
  bio?: string;
  image_url?: string;
  email?: string;
  social_links?: Record<string, string>;
}

// --- Testimonials ---
export interface Testimonial {
  id: number;
  client_name: string;
  client_role: string;
  testimonial_text: string;
  rating: number;
  image_url: string;
  created_at: string;
}

export interface TestimonialRequest {
  client_name: string;
  client_role: string;
  testimonial_text: string;
  rating: number;
  image_url: string;
}

export interface PatchedTestimonialRequest {
  client_name?: string;
  client_role?: string;
  testimonial_text?: string;
  rating?: number;
  image_url?: string;
}

// --- Values ---
export interface ValueCard {
  id: number;
  title: string;
  description: string;
  icon_url: string;
  order: number;
  created_at: string;
}

export interface ValueCardRequest {
  title: string;
  description: string;
  icon_url: string;
  order: number;
}

export interface PatchedValueCardRequest {
  title?: string;
  description?: string;
  icon_url?: string;
  order?: number;
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
