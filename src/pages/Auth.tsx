import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast({
        title: "Error",
        description: "Nama lengkap harus diisi",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Berhasil!",
        description: "Akun berhasil dibuat. Silakan cek email untuk verifikasi.",
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal login dengan Google",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal login dengan Facebook",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="signin">Login</TabsTrigger>
            <TabsTrigger value="signup">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-0">
            <Card className="border-0 shadow-none bg-transparent">
              <CardContent className="p-0 space-y-6">
                {/* Login Illustration */}
                <div className="flex justify-center mb-8">
                  <div className="w-48 h-48 bg-gray-200 rounded-3xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-gray-100"></div>
                    <div className="relative">
                      {/* Simple illustration representation */}
                      <div className="w-16 h-20 bg-blue-500 rounded-lg relative">
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full"></div>
                        <div className="absolute -right-4 top-8 w-3 h-3 bg-blue-400 rounded-full"></div>
                      </div>
                      <div className="absolute -left-8 -bottom-4 w-12 h-8 bg-gray-300 rounded-lg"></div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-8">Login</h1>
                </div>

                <form onSubmit={handleSignIn} className="space-y-6">
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="h-12 border-gray-200 rounded-xl bg-white"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl" 
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue
                  </Button>
                </form>

                {/* Social Login Section */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="h-12 border-gray-200 hover:bg-gray-50 rounded-xl"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleFacebookSignIn}
                      disabled={loading}
                      className="h-12 border-gray-200 hover:bg-gray-50 rounded-xl"
                    >
                      <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <button 
                    onClick={() => setActiveTab('signup')}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Don't have an account? <span className="text-blue-600 font-medium">Register here</span>
                  </button>
                  <div>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Forget password
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-0">
            <Card className="border-0 shadow-none bg-transparent">
              <CardContent className="p-0 space-y-6">
                {/* Register Illustration */}
                <div className="flex justify-center mb-8">
                  <div className="w-48 h-48 bg-gray-200 rounded-3xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-gray-100"></div>
                    <div className="relative">
                      {/* Register illustration representation */}
                      <div className="w-20 h-16 bg-blue-500 rounded-lg relative">
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full"></div>
                        <div className="absolute -right-6 top-4 w-8 h-6 bg-blue-400 rounded-lg"></div>
                        <div className="absolute -left-4 bottom-2 w-4 h-4 bg-blue-300 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-8">Register</h1>
                </div>

                <form onSubmit={handleSignUp} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      className="h-12 border-gray-200 rounded-xl bg-white"
                    />
                  </div>
                  
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      minLength={6}
                      className="h-12 border-gray-200 rounded-xl bg-white"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl" 
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create an account
                  </Button>
                </form>

                {/* Social Login Section */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="h-12 border-gray-200 hover:bg-gray-50 rounded-xl"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleFacebookSignIn}
                      disabled={loading}
                      className="h-12 border-gray-200 hover:bg-gray-50 rounded-xl"
                    >
                      <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <button 
                    onClick={() => setActiveTab('signin')}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Already have an account? <span className="text-blue-600 font-medium">Login here</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;