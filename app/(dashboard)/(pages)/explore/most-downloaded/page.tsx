import { getTweaks } from "@/actions/getTweaks";
import { auth } from "@clerk/nextjs/server";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Download, Star } from "lucide-react";
import Link from "next/link";
import CustomBreadCrump from "@/components/CustomBreadCrump";

export default async function MostDownloadedPage() {
  const { userId } = auth();

  const tweaks = await getTweaks({
    orderBy: "downloadCount",
    orderDirection: "desc",
  });

  return (
    <div className="w-full space-y-6">
      <div className="p-6 border-b">
        <CustomBreadCrump
          breadCrumpPage="Most Downloaded"
          breadCrumpItem={[{ link: "/explore", label: "Explore" }]}
        />
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tweaks.map((tweak) => (
            <Link href={`/explore/${tweak.id}`} key={tweak.id}>
              <Card className="group hover:shadow-md transition-all duration-300">
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-[64px] h-[64px] rounded-lg overflow-hidden bg-secondary/10 flex-shrink-0">
                      <Image
                        src={tweak.icon_url || "/placeholder.svg"}
                        alt={tweak.title}
                        width={64}
                        height={64}
                        className="object-contain group-hover:scale-110 transition-all duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-base truncate group-hover:text-primary transition-colors">
                        {tweak.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {tweak.short_description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{tweak.downloadCount} downloads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>{tweak.savedUsers.length} favorites</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
