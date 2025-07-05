
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useWelcomeMessage = () => {
  const { toast } = useToast();

  const showWelcomeMessage = async (user: User) => {
    try {
      // Ambil data profile untuk mendapatkan nama lengkap
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      const userName = profile?.full_name || 
        user.user_metadata?.full_name || 
        user.user_metadata?.name || 
        user.email?.split('@')[0] || 
        'User';

      // Tampilkan toast selamat datang
      toast({
        title: `Selamat datang ${userName}!`,
        description: `Senang melihat Anda kembali di Family App`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error showing welcome message:', error);
    }
  };

  return { showWelcomeMessage };
};
