import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Email harus diisi",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setEmailSent(true);
        toast({
          title: "Email Terkirim!",
          description: `Link reset password telah dikirim ke ${email}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan, silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="p-0 space-y-6">
            {/* Forgot Password Illustration */}
            <div className="flex justify-center mb-8">
              <div className="w-48 h-48 bg-gray-200 rounded-3xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-gray-100"></div>
                <div className="relative">
                  {/* Forgot password illustration representation */}
                  <div className="w-16 h-20 bg-blue-500 rounded-full relative">
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full"></div>
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
                    <div className="absolute -right-4 top-8 w-6 h-6 bg-gray-300 rounded-lg"></div>
                    <div className="absolute -left-4 top-12 w-4 h-4 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Forget Password</h1>
            </div>

            {!emailSent ? (
              <form onSubmit={handleSendEmail} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="h-12 border-gray-200 rounded-xl bg-white"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send email
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-green-800 text-sm">
                    Email reset password telah dikirim ke <strong>{email}</strong>. 
                    Silakan cek inbox Anda dan ikuti instruksi untuk reset password.
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  variant="outline"
                  className="w-full h-12 rounded-xl"
                >
                  Kirim Ulang Email
                </Button>
              </div>
            )}

            <div className="text-center">
              <Link 
                to="/auth" 
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Already have an account? <span className="text-blue-600 font-medium">Login here</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;