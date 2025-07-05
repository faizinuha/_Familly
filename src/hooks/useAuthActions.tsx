
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const useAuthActions = () => {
  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError || !data.user) return { error: signUpError };

      // Insert ke tabel 'profiles' secara manual
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        role: 'member',
      });

      return { error: profileError };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  };

  const ensureProfileExists = async (user: User) => {
    try {
      // Cek apakah profile sudah ada
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!data) {
        // Insert profile jika belum ada data
        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || 
            user.user_metadata?.name || 
            user.email?.split('@')[0] || 
            'User',
          role: 'member',
        });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          console.log('Profile created successfully for user:', user.id);
        }
      }
    } catch (error) {
      console.error('Error in ensureProfileExists:', error);
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    ensureProfileExists,
  };
};
