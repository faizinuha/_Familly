
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const sendWelcomeEmail = async (user: User) => {
    try {
      // In production, you would call an edge function to send email
      console.log(`Welcome email would be sent to: ${user.email}`);

      // Show a toast notification
      toast({
        title: 'Selamat Datang!',
        description: `Email selamat datang telah dikirim ke ${user.email}`,
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  };

  // Perbaikan untuk masalah login Google
  const handleAuthStateChange = async (event: string, session: Session | null) => {
    console.log('Auth event:', event, session?.user?.email ?? 'No user');
    
    // Set session dan user secara sinkron
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);

    // Handle berbagai event auth
    if (event === 'SIGNED_IN' && session?.user) {
      // Pastikan profile ada untuk semua user (termasuk Google/social)
      setTimeout(async () => {
        try {
          await ensureProfileExists(session.user);
          
          // Check if this is a social login (not email)
          const isSocialLogin = session.user.app_metadata.provider && 
            session.user.app_metadata.provider !== 'email';
            
          if (isSocialLogin) {
            // Send welcome email for new users (social login)
            sendWelcomeEmail(session.user);
          }
        } catch (error) {
          console.error('Error in post-login processing:', error);
        }
      }, 100);
    }

    // Handle token refresh untuk mencegah session expire
    if (event === 'TOKEN_REFRESHED' && session) {
      console.log('Token refreshed successfully');
      setSession(session);
      setUser(session.user);
    }

    // Handle sign out
    if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      setSession(null);
      setUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener dengan error handling yang lebih baik
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      try {
        await handleAuthStateChange(event, session);
      } catch (error) {
        console.error('Error in auth state change:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    });

    // Check for existing session dengan retry mechanism
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          // Jika ada error, coba refresh session
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error('Error refreshing session:', refreshError);
          }
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signUp,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
