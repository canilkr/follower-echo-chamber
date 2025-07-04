
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://juhvjvqamzylvtumhkde.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aHZqdnFhbXp5bHZ0dW1oa2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NDUwMzMsImV4cCI6MjA2NzIyMTAzM30.fr058tgCEbhBSIQDuNrvXgvwGiUK-dGLYej7hl-RMyA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
