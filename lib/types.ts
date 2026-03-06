export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  location: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
  gpa: string;
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  link: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: string[];
  languages: string[];
  awards: string[];
}
