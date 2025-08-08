import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yxeefhayfgzmkiytvidd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4ZWVmaGF5Zmd6bWtpeXR2aWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NjE0NzcsImV4cCI6MjA3MDEzNzQ3N30.qXASh7jt2ViYun8kIwa2OJYJ06n4bZUt9PG5eNklgXs' // get this from Supabase dashboard

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
