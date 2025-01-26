import Image from "next/image";
import Link from "next/link";
import { TweakTags } from "./tweak-tags";
import { TweakType } from "@prisma/client";

interface TweakHeaderProps {
  id: string;
  title: string;
  iconUrl: string;
  shortDescription: string;
  categoryName?: string;
  tweakType?: TweakType | null;
}

export function TweakHeader({
  id,
  title,
  iconUrl,
  shortDescription,
  categoryName,
  tweakType,
}: TweakHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={iconUrl || "/placeholder.svg"}
          alt={title}
          width={48}
          height={48}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-1">
          <div className="min-w-0">
            <Link
              href={`/explore/${id}`}
              className="hover:underline inline-flex items-center gap-2"
            >
              <h3 className="font-semibold text-sm line-clamp-1">{title}</h3>
            </Link>
            <div className="flex gap-1 flex-wrap mt-0.5">
              <TweakTags categoryName={categoryName} tweakType={tweakType} />
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 h-8">
              {shortDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
