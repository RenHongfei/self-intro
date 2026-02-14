export interface Section {
  id: string;
  title: string;
  slug: string;
  content: string;
  type: 'hero' | 'text' | 'projects' | 'contact';
  order_index: number;
  is_visible: boolean;
  background_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  role: 'admin' | 'user';
}
