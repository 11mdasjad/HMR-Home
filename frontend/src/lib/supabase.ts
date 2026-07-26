import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://zwxagtiiqdzqbcpdisgo.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3eGFndGlpcWR6cWJjcGRpc2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODA0NDMsImV4cCI6MjEwMDY1NjQ0M30.377ybOypwi-0YEaaJDf6v7R0e88ZxZgkwozYN7R135Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
