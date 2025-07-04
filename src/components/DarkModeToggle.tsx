
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/hooks/useDarkMode';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode, isLoading } = useDarkMode();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleDarkMode}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
          <span>Memproses...</span>
        </>
      ) : (
        <>
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </>
      )}
    </Button>
  );
};

export default DarkModeToggle;
