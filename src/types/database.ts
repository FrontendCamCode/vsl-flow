export interface Script {
  id: string
  title: string
  product_name: string
  features: string
  target_audience: string
  current_version: number
  created_at: string
  updated_at: string
  script_blocks?: ScriptBlock[]
}

export interface ScriptBlock {
  id: string
  script_id: string
  content: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface ScriptVersion {
  id: string
  script_id: string
  version_number: number
  created_at: string
}

export interface VersionBlock {
  id: string
  version_id: string
  content: string
  order_index: number
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      scripts: {
        Row: Script
        Insert: Omit<Script, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Script, 'id' | 'created_at' | 'updated_at'>>
      }
      script_blocks: {
        Row: ScriptBlock
        Insert: Omit<ScriptBlock, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ScriptBlock, 'id' | 'created_at' | 'updated_at'>>
      }
      script_versions: {
        Row: ScriptVersion
        Insert: Omit<ScriptVersion, 'id' | 'created_at'>
        Update: Partial<Omit<ScriptVersion, 'id' | 'created_at'>>
      }
      version_blocks: {
        Row: VersionBlock
        Insert: Omit<VersionBlock, 'id' | 'created_at'>
        Update: Partial<Omit<VersionBlock, 'id' | 'created_at'>>
      }
    }
  }
} 