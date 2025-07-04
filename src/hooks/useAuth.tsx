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
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const { toast } = useToast();

  const sendWelcomeEmail = async (user: User) => {
    try {
      // Cek apakah ini login pertama kali atau sudah pernah login
      const lastLoginKey = `last_login_${user.id}`;
      const lastLogin = localStorage.getItem(lastLoginKey);
      const now = new Date().getTime();
      
      // Jika belum pernah login atau sudah lebih dari 24 jam
      if (!lastLogin || (now - parseInt(lastLogin)) > 24 * 60 * 60 * 1000) {
        console.log(`Welcome email would be sent to: ${user.email}`);
        
        // Simpan waktu login terakhir
        localStorage.setItem(lastLoginKey, now.toString());
        
        // Show toast hanya jika belum pernah ditampilkan di session ini
        if (!hasShownWelcome) {
          toast({
            title: 'Selamat Datang!',
            description: `Selamat datang kembali ${user.email?.split('@')[0]}`,
          });
          setHasShownWelcome(true);
        }
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  };

  const handleAuthStateChange = async (event: string, session: Session | null) => {
    console.log('Auth event:', event, session?.user?.email ?? 'No user');
    
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);

    if (event === 'SIGNED_IN' && session?.user) {
      setTimeout(async () => {
        try {
          await ensureProfileExists(session.user);
          
          const isSocialLogin = session.user.app_metadata.provider && 
            session.user.app_metadata.provider !== 'email';
            
          if (isSocialLogin) {
            sendWelcomeEmail(session.user);
          }
        } catch (error) {
          console.error('Error in post-login processing:', error);
        }
      }, 100);
    }

    if (event === 'TOKEN_REFRESHED' && session) {
      console.log('Token refreshed successfully');
      setSession(session);
      setUser(session.user);
    }

    if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      setSession(null);
      setUser(null);
      setHasShownWelcome(false);
    }
  };

  useEffect(() => {
    let mounted = true;

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

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
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
  }, []);

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
      setHasShownWelcome(false);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  };

  const ensureProfileExists = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!data) {
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
