import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iwfbkvstsfykchfxdmwe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3ZmJrdnN0c2Z5a2NoZnhkbXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNDI4NjYsImV4cCI6MjA2MTcxODg2Nn0.iyU-Faw_cn9jQn644E_eOvDcBWc0AjsAriSf-8XMYkE'

export const supabase = createClient(supabaseUrl, supabaseKey) 