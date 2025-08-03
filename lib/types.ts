export interface Profile {
  id: string
  full_name: string
  email: string
  phone?: string
  location?: string
  bio?: string
  avatar_url?: string
  website_url?: string
  linkedin_url?: string
  github_url?: string
  resume_url?: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon_url?: string
  created_at: string
  updated_at: string
}

export interface Technology {
  id: string
  name: string
  category: "frontend" | "backend" | "database" | "devops" | "mobile" | "other"
  proficiency_level: "beginner" | "intermediate" | "advanced" | "expert"
  icon_url?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string
  status: "planning" | "in_progress" | "completed" | "on_hold"
  github_url?: string
  live_url?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  location?: string
  start_date: string
  end_date?: string
  description?: string
  is_current: boolean
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field_of_study: string
  start_date: string
  end_date?: string
  gpa?: string
  description?: string
  is_current: boolean
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  position: string
  start_date: string
  end_date?: string
  description?: string
  is_current: boolean
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  title: string
  description?: string
  date_achieved: string
  issuer?: string
  certificate_url?: string
  created_at: string
  updated_at: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issue_date: string
  expiry_date?: string
  credential_id?: string
  credential_url?: string
  created_at: string
  updated_at: string
}

export interface ProjectFeature {
  id: string
  project_id: string
  title: string
  description?: string
  created_at: string
  updated_at: string
}
