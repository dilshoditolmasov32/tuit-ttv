export type Language = "uz" | "ru" | "en";

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
  email: string;
  profileUrl: string;
  office: Record<Language, string>;
  bio: Record<Language, string>;
  highlights: Record<Language, string>[];
  career: {
    year: string;
    desc: Record<Language, string>;
  }[];
}

export interface HistoryItem {
  year: string;
  dateLabel: Record<Language, string>;
  title: Record<Language, string>;
  desc: Record<Language, string>;
  facts: Record<Language, string>[];
  metricLabel: Record<Language, string>;
  metricValue: string;
  sourceLabel: Record<Language, string>;
  sourceUrl: string;
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
  stats: { label: Record<Language, string>; value: string | Record<Language, string> }[];
  sourceLabel: Record<Language, string>;
  sourceUrl: string;
}

export interface StudentProject {
  id: string;
  title: Record<Language, string>;
  student: string;
  type: "video" | "ar" | "3d";
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

// VR Module Types
export interface VRObject {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  modelUrl?: string;
  color?: string;
  info: Record<Language, string>;
  interactive: boolean;
}

export interface VRScene {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  models: VRObject[];
  lightingPresets: {
    ambientIntensity: number;
    pointLightIntensity: number;
    pointLightColor: string;
  };
}

// AR Module Types
export interface ARMarker {
  id: string;
  name: string;
  imageUrl: string;
  width: number;
  height: number;
}

export interface ARObject {
  id: string;
  name: string;
  modelUrl: string;
  scale: [number, number, number];
  rotation: [number, number, number];
  info: Record<Language, string>;
}

export interface ARConfig {
  marker: ARMarker;
  object: ARObject;
  autoRotate: boolean;
}
