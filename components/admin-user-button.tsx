import { useClerk, useUser } from "@clerk/nextjs";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AdminUserButtonProps {
  appearance?: any;
}

export function AdminUserButton({ appearance }: AdminUserButtonProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const handleClick = () => {
    signOut(() => router.push("/"));
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/user");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            className="relative w-12 h-12 rounded-full hover:bg-background"
          >
            <div className="relative group">
              {isAdmin && (
                <div className="absolute -top-2 -right-1 z-50">
                  <Crown
                    className={cn(
                      "h-4 w-4 text-yellow-400 transform rotate-12 transition-all duration-300",
                      "group-hover:scale-110 group-hover:text-yellow-300 group-hover:animate-[float_3s_ease-in-out_infinite]"
                    )}
                  />
                </div>
              )}
              <Avatar
                className="h-11 w-11 cursor-pointer border-2 border-primary/10 group-hover:border-primary/30 transition-colors"
                onClick={handleProfileClick}
              >
                <AvatarImage src={user?.imageUrl} alt="Profile picture" />
                <AvatarFallback>
                  {user?.firstName?.[0] || user?.username?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click para cerrar sesión</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
