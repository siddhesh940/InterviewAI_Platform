import { useAuth } from '@clerk/nextjs';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const createClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export const useSupabaseWithAuth = () => {
  const supabase = createClient();
  const { userId, isSignedIn } = useAuth();
  
  return { supabase, userId, isSignedIn };
};
