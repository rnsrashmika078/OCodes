import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sobpckargvnsinuohsyx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvYnBja2FyZ3Zuc2ludW9oc3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MDE0MTYsImV4cCI6MjA3MzE3NzQxNn0.9vT1m3-QMbCfclnnnWExEHiqLqB-M30fa7NDgLSzJNk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
