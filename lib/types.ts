export interface Database {
  public: {
    Tables: {
      profile: {
        Row: {
          id: string
          full_name: string | null
          nickname: string | null
          email: string | null
          location: string | null
          bio: string | null
          linkedin_url: string | null
          website_url: string | null
          cv_url: string | null
          profile_picture_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          full_name?: string | null
          nickname?: string | null
          email?: string | null
          location?: string | null
          bio?: string | null
          linkedin_url?: string | null
          website_url?: string | null
          cv_url?: string | null
          profile_picture_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          nickname?: string | null
          email?: string | null
          location?: string | null
          bio?: string | null
          linkedin_url?: string | null
          website_url?: string | null
          cv_url?: string | null
          profile_picture_url?: string | null
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          profile_id: string
          title: string
          description: string | null
          image_url: string | null
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          description?: string | null
          image_url?: string | null
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          description?: string | null
          image_url?: string | null
        }
      }
      technologies: {
        Row: {
          id: string
          name: string
          icon_url: string | null
        }
        Insert: {
          id?: string
          name: string
          icon_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          icon_url?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          profile_id: string
          title: string
          slug: string
          detail: string | null
          image_url: string | null
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          slug: string
          detail?: string | null
          image_url?: string | null
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          slug?: string
          detail?: string | null
          image_url?: string | null
        }
      }
      project_features: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          order: number | null
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          order?: number | null
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          order?: number | null
        }
      }
      project_technologies: {
        Row: {
          project_id: string
          technology_id: string
        }
        Insert: {
          project_id: string
          technology_id: string
        }
        Update: {
          project_id?: string
          technology_id?: string
        }
      }
      work_experiences: {
        Row: {
          id: string
          profile_id: string
          company_name: string
          job_title: string
          start_date: string | null
          end_date: string | null
          is_current: boolean | null
          experience_type: string | null
          description: string[] | null
        }
        Insert: {
          id?: string
          profile_id: string
          company_name: string
          job_title: string
          start_date?: string | null
          end_date?: string | null
          is_current?: boolean | null
          experience_type?: string | null
          description?: string[] | null
        }
        Update: {
          id?: string
          profile_id?: string
          company_name?: string
          job_title?: string
          start_date?: string | null
          end_date?: string | null
          is_current?: boolean | null
          experience_type?: string | null
          description?: string[] | null
        }
      }
      education: {
        Row: {
          id: string
          profile_id: string
          institution: string
          degree: string | null
          field_of_study: string | null
          gpa: string | null
          start_date: string | null
          end_date: string | null
          description: string | null
        }
        Insert: {
          id?: string
          profile_id: string
          institution: string
          degree?: string | null
          field_of_study?: string | null
          gpa?: string | null
          start_date?: string | null
          end_date?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          profile_id?: string
          institution?: string
          degree?: string | null
          field_of_study?: string | null
          gpa?: string | null
          start_date?: string | null
          end_date?: string | null
          description?: string | null
        }
      }
      organizational_experiences: {
        Row: {
          id: string
          profile_id: string
          organization_name: string
          role: string
          location: string | null
          start_date: string | null
          end_date: string | null
        }
        Insert: {
          id?: string
          profile_id: string
          organization_name: string
          role: string
          location?: string | null
          start_date?: string | null
          end_date?: string | null
        }
        Update: {
          id?: string
          profile_id?: string
          organization_name?: string
          role?: string
          location?: string | null
          start_date?: string | null
          end_date?: string | null
        }
      }
      achievements: {
        Row: {
          id: string
          profile_id: string
          title: string
          year: number | null
          description: string | null
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          year?: number | null
          description?: string | null
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          year?: number | null
          description?: string | null
        }
      }
      certifications: {
        Row: {
          id: string
          profile_id: string
          name: string
          issuer: string | null
          year: number | null
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          issuer?: string | null
          year?: number | null
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          issuer?: string | null
          year?: number | null
        }
      }
    }
  }
}

export type Profile = Database["public"]["Tables"]["profile"]["Row"]
export type Service = Database["public"]["Tables"]["services"]["Row"]
export type Technology = Database["public"]["Tables"]["technologies"]["Row"]
export type Project = Database["public"]["Tables"]["projects"]["Row"]
export type ProjectFeature = Database["public"]["Tables"]["project_features"]["Row"]
export type WorkExperience = Database["public"]["Tables"]["work_experiences"]["Row"]
export type Education = Database["public"]["Tables"]["education"]["Row"]
export type OrganizationalExperience = Database["public"]["Tables"]["organizational_experiences"]["Row"]
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"]
export type Certification = Database["public"]["Tables"]["certifications"]["Row"]
