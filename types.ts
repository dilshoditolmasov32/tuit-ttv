
export type Language = 'uz' | 'ru' | 'en';

export interface NavItem {
  id: string;
  label: Record<Language, string>;
  path: string;
}

export interface StaffMember {
  id: number;
  name: Record<Language, string>;
  role: Record<Language, string>;
  image: string;
  bio: Record<Language, string>;
  career: {
    year: string;
    desc: Record<Language, string>;
  }[];
}

export interface Lecture {
  id: number;
  title: string;
  author: string;
  duration: string;
  description: string;
}

export interface Program {
  id: string;
  title: Record<Language, string>;
  shortDesc: Record<Language, string>;
  fullDesc: Record<Language, string>;
  icon: string;
  color: string;
  stats: { label: Record<Language, string>; value: string }[];
}

export interface StudentProject {
  id: string;
  title: Record<Language, string>;
  student: string;
  type: 'video' | 'ar' | '3d';
  thumbnail: string;
  description: Record<Language, string>;
  caseStudy: {
    challenge: Record<Language, string>;
    solution: Record<Language, string>;
    outcome: Record<Language, string>;
  };
  color: string;
}

export interface NewsItem {
  id: string;
  title: Record<Language, string>;
  date: string;
  image: string;
  category: Record<Language, string>;
  content: Record<Language, string>;
}
