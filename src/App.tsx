
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  useEffect(() => {
    // Membuat folder "my_app_folder" di direktori aplikasi Android
    const createAppFolder = async () => {
      try {
        await Filesystem.mkdir({
          path: 'Com.Vvi_Studio',
          directory: Directory.External,
          recursive: true,
        });
         // Setelah folder dibuat, buat file version.txt dan readme.txt
        await Filesystem.writeFile({
          path: 'Com.Vvi_Studio/version.txt',
          data: '1.0.0',
          directory: Directory.External,
        });
        await Filesystem.writeFile({
          path: 'Com.Vvi_Studio/readme.txt',
          data: 'Ini adalah folder aplikasi.\nSilakan tambahkan file lain sesuai kebutuhan.',
          directory: Directory.External,
        });
        await Filesystem.writeFile({
          path: 'Com.Vvi_Studio/other/security.txt',
          data: 'Mohon Tidak Di salah Gunakan karena kami Menjaga Privasi Pengguna.\nJika ada yang ingin di laporkan silahkan hubungi kami di email: rozakadm@gmail.com',
          directory: Directory.External,
        });
      } catch (e) {
        if (
          typeof e === 'object' &&
          e &&
          'message' in e &&
          typeof (e as { message?: string }).message === 'string' &&
          !(e as { message: string }).message.includes('Directory exists')
        ) {
          // Log error if needed
        }
      }
    };
    createAppFolder();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route
                path="/auth"
                element={
                  <PublicRoute>
                    <Auth />
                  </PublicRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <ForgotPassword />
                  </PublicRoute>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <PublicRoute>
                    <ResetPassword />
                  </PublicRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
