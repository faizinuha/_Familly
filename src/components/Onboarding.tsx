
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Heart, Shield, Users, MessageCircle, Monitor, Smartphone } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const onboardingSteps = [
  {
    id: 1,
    title: "Selamat Datang di Family",
    subtitle: "Aplikasi untuk menghubungkan keluarga tercinta",
    description: "Kelola aktivitas keluarga, pantau perangkat, dan tetap terhubung dengan mudah.",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-gradient-to-br from-pink-50 to-rose-50"
  },
  {
    id: 2,
    title: "Chat & Komunikasi",
    subtitle: "Tetap terhubung dengan keluarga",
    description: "Kirim pesan, foto, dan file dengan aman. Buat grup keluarga dan nikmati obrolan yang menyenangkan.",
    icon: MessageCircle,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50"
  },
  {
    id: 3,
    title: "Monitoring Perangkat",
    subtitle: "Pantau aktivitas digital keluarga",
    description: "Lihat penggunaan aplikasi, waktu layar, dan pastikan keamanan digital untuk seluruh keluarga.",
    icon: Monitor,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-gradient-to-br from-green-50 to-emerald-50"
  },
  {
    id: 4,
    title: "Keamanan Terjamin",
    subtitle: "Data keluarga yang aman",
    description: "Enkripsi end-to-end, autentikasi biometrik, dan kontrol privasi yang lengkap untuk ketenangan pikiran.",
    icon: Shield,
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50"
  },
  {
    id: 5,
    title: "Siap Memulai?",
    subtitle: "Mari bergabung dengan Family",
    description: "Daftar sekarang dan mulai menghubungkan keluarga Anda dengan cara yang lebih modern dan aman.",
    icon: Users,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50"
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const current = onboardingSteps[currentStep];
  const IconComponent = current.icon;

  return (
    <div className={`min-h-screen ${current.bgColor} dark:bg-gray-900 flex items-center justify-center p-4 transition-all duration-500`}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-white/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Progress indicators */}
        <div className="flex justify-center mb-8 space-x-2">
          {onboardingSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? `bg-gradient-to-r ${current.color} shadow-lg scale-125`
                  : index < currentStep
                  ? 'bg-gray-400 dark:bg-gray-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        <Card className="backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 border-0 shadow-2xl p-8 text-center animate-scale-in">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${current.color} rounded-3xl shadow-lg mb-6 animate-pulse`}>
            <IconComponent className="w-10 h-10 text-white" />
          </div>

          {/* Content */}
          <div className="space-y-4 mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {current.title}
            </h1>
            <h2 className={`text-lg font-medium bg-gradient-to-r ${current.color} bg-clip-text text-transparent`}>
              {current.subtitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali
            </Button>

            <Button
              onClick={nextStep}
              className={`bg-gradient-to-r ${current.color} hover:shadow-lg text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2`}
            >
              {currentStep === onboardingSteps.length - 1 ? 'Mulai' : 'Lanjut'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Skip button */}
        <div className="text-center mt-6">
          <button
            onClick={onComplete}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            Lewati Onboarding
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
