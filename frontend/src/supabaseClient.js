import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zxqlvusgbqodolzyaqnz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4cWx2dXNnYnFvZG9senlhcW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDc0MjMsImV4cCI6MjA3NjYyMzQyM30.vJ872RfmvODqoBqH3Ky-m5cXRXleIRZm-0-BrshijBo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);