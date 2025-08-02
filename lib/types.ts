export interface Profile {
  id: string
  full_name?: string
  nickname?: string
  email?: string
  location?: string
  bio?: string
  linkedin_url?: string
  website_url?: string
  cv_url?: string
  profile_picture_url?: string
  created_at: string
}

export interface Service {
  id: string
  profile_id: string
  title: string
  description?: string
  image_url?: string
}

export interface Technology {
  id: string
  name: string
  icon_url?: string
}

export interface Project {
  id: string
  profile_id: string
  title: string
  slug: string
  detail?: string
  image_url?: string
}

export interface ProjectFeature {
  id: string
  project_id: string
  title: string
  description?: string
  order?: number
}

export interface WorkExperience {
  id: string
  profile_id: string
  company_name: string
  job_title: string
  start_date?: string
  end_date?: string
  is_current: boolean
  experience_type?: string
  description?: string[]
}

export interface Education {
  id: string
  profile_id: string
  institution: string
  degree?: string
  field_of_study?: string
  gpa?: string
  start_date?: string
  end_date?: string
  description?: string
}

export interface OrganizationalExperience {
  id: string
  profile_id: string
  organization_name: string
  role: string
  location?: string
  start_date?: string
  end_date?: string
}

export interface Achievement {
  id: string
  profile_id: string
  title: string
  year?: number
  description?: string
}

export interface Certification {
  id: string
  profile_id: string
  name: string
  issuer?: string
  year?: number
}
