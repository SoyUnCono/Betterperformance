import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TweakAuthorProps {
  userId: string;
  username?: string;
  avatarUrl?: string;
}

export function TweakAuthor({ userId, username, avatarUrl }: TweakAuthorProps) {
  return (
    <Link
      href={`/tweaker/${userId}`}
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <Avatar className="h-5 w-5">
        <AvatarImage src={avatarUrl || "/placeholder-avatar.svg"} />
        <AvatarFallback className="text-[10px]">
          {username?.[0]?.toUpperCase() || "A"}
        </AvatarFallback>
      </Avatar>
      <div className="text-xs font-medium">{username || "Anonymous"}</div>
    </Link>
  );
}
