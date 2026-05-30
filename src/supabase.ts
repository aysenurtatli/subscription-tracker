import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jjhrnaqqnfrbgljaqdgp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqaHJuYXFxbmZyYmdsamFxZGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5ODYzMTMsImV4cCI6MjA5NTU2MjMxM30.WyWWxkk1JrAfzthYci2sEQSZz994nX5z3rmEA480uH4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
