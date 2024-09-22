export type Mentor = {
  id: number;
  type: string;
  first_name: string;
  last_name: string;
  name: string;
  username: string;
  uuid: string;
  avatar: string;
  bio: string;
  education: string;
  social_links: {
    maroof: null | string;
    tiktok: null | string;
    podcast: null | string;
    twitter: null | string;
    youtube: null | string;
    facebook: null | string;
    snapchat: null | string;
    telegram: null | string;
    whatsapp: null | string;
    instagram: null | string;
    soundcloud: null | string;
  } | null;
  courses_count: number;
  enrollments: number;
};
