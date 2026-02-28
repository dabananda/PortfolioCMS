export interface PublicProfile {
  username: string;
  firstName: string;
  lastName: string;
  headLine: string;
  status: number;
  imageUrl?: string;
  resumeUrl?: string;
  location?: string;
  dateOfBirth: string;
}

export interface Skill {
  id: string;
  skillName: string;
  category?: string;
  proficiency: number;
}

export interface Education {
  id: string;
  instituteName: string;
  department: string;
  cgpa: number;
  scale: number;
  startDate: string;
  endDate?: string;
  instituteLocation: string;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  companyDescription?: string;
  role: string;
  startDate: string;
  endDate?: string;
  workDescription?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  gitHubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

export interface Certification {
  id: string;
  certificationName: string;
  issuingOrganization: string;
  dateObtained: string;
  credentialId?: string;
  certificateUrl?: string;
}

export interface SocialLink {
  id: string;
  name: string;
  link: string;
}

export interface Review {
  id: string;
  name: string;
  designation?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ExtraCurricularActivity {
  id: string;
  title: string;
  organization: string;
  description: string;
  startDate: string;
  endDate?: string;
}

export interface ProblemSolving {
  id: string;
  judgeName: string;
  totalSolved: number;
  rank?: string;
  handle?: string;
  profileUrl: string;
}

export interface PublicPortfolio {
  profile: PublicProfile;
  skills: Skill[];
  educations: Education[];
  workExperiences: WorkExperience[];
  projects: Project[];
  certifications: Certification[];
  socialLinks: SocialLink[];
  reviews: Review[];
  extraCurricularActivities: ExtraCurricularActivity[];
  problemSolvings: ProblemSolving[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  imageUrl?: string;
  isPublished: boolean;
  publishedAt?: string;
  blogPostCategoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BlogPostPagedResponse {
  items: BlogPost[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ContactMessageRequest {
  fullName: string;
  email: string;
  subject: string;
  description: string;
}
