import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qlcfmjmipkbzomskqnan.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsY2Ztam1pcGtiem9tc2txbmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDYzOTAsImV4cCI6MjA4OTkyMjM5MH0.kSa5_RVHHDNw88L2ym0XXiGrl-GP-beytNtr_x1cT5g";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
