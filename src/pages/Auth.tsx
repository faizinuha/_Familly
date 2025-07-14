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