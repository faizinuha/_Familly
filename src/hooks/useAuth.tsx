
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle new user signup and social login
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if this is a new user or social login
          const isNewUser = session.user.app_metadata.provider !== 'email' || 
                           event === 'SIGNED_UP';
          
          if (isNewUser) {
            // Send welcome email for new users
            setTimeout(() => {
              sendWelcomeEmail(session.user);
            }, 1000);
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const sendWelcomeEmail = async (user: User) => {
    try {
      // In production, you would call an edge function to send email
      console.log(`Welcome email would be sent to: ${user.email}`);
      
      // For now, just show a toast notification
      // This would be replaced with actual email sending logic
      if (window && 'toast' in window) {
        // @ts-ignore
        window.toast({
          title: "Selamat Datang!",
          description: `Email selamat datang telah dikirim ke ${user.email}`,
        });
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  };
  
  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
        }
      }
    });

    if (signUpError || !data.user) return { error: signUpError };

    // Insert ke tabel 'profiles' secara manual
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      role: 'member',
    });

    return { error: profileError };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      signUp,
      signIn,
      signOut,
      loading
    }}>
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
