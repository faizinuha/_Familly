
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import DarkModeToggle from "./DarkModeToggle";

const ProfileSection = () => {
  const { profile, isHeadOfFamily } = useProfile();
  const { user, signOut } = useAuth();

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <Avatar className="h-20 w-20 mb-2">
        <AvatarFallback className="text-3xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
          {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{profile?.full_name || user?.email}</h2>
        <Badge className={isHeadOfFamily ? "bg-blue-500" : "bg-gray-500"}>
          {isHeadOfFamily ? "Ketua" : "Anggota"}
        </Badge>
      </div>
      <div className="w-full mt-4 space-y-2">
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Email</Label>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</div>
        </div>
      </div>
      
      {/* Dark Mode Toggle */}
      <div className="w-full mt-4">
        <DarkModeToggle />
      </div>
      
      <Button variant="destructive" className="w-full mt-4" onClick={signOut}>
        Keluar
      </Button>
    </div>
  );
};

export default ProfileSection;
