import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// データベーステーブルの型定義
export interface User {
  id: string
  email: string
  name?: string
  image?: string
  created_at: string
  updated_at: string
}

export interface FavoriteArtist {
  id: string
  user_id: string
  spotify_id: string
  name: string
  image_url?: string
  genre?: string
  added_at: string
}

export interface SearchHistory {
  id: string
  user_id: string
  query: string
  searched_at: string
} 