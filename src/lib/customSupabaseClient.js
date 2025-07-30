import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bfxamibaxsyxltqkiftd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeGFtaWJheHN5eGx0cWtpZnRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzODQ4MTMsImV4cCI6MjA2NDk2MDgxM30.Yr3tTDElbMAewKq-MqBFeh6PG11N48ruy-xbUOa1EUQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);