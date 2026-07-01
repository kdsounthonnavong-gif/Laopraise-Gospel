export type Locale = 'lo' | 'th' | 'en' | 'ko'
export type Lang   = 'lo' | 'th' | 'en' | 'ko'
export type Role   = 'admin' | 'editor'

export type LocalizedName = Record<Locale, string>

export interface Category {
  id:         string
  name:       LocalizedName
  parent_id:  string | null
  sort_order: number
  created_at: string
}

export interface Song {
  id:           string
  title:        LocalizedName
  original_key: string | null
  youtube_url:  string | null
  audio_url:    string | null
  category_id:  string | null
  lang:         Lang
  created_by:   string | null
  created_at:   string
  updated_at:   string
}

export interface SongImage {
  id:         string
  song_id:    string
  image_url:  string
  sort_order: number
}

export interface UserRole {
  id:      string
  user_id: string
  role:    Role
}

export interface SongWithImages extends Song {
  song_images: SongImage[]
  categories:  Category | null
}
