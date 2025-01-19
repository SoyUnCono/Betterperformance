import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import TweakHeader from "./_components/TweakHeader";
import TweakDescription from "./_components/TweakDescription";
import { Card } from "@/components/ui/card";
import { FileText, Info, User2, Calendar, Hash, FileCode } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CopyButton from "./_components/CopyButton";

interface TweakPageProps {
  params: {
    tweakID: string;
  };
}

export default async function TweakPage({ params }: TweakPageProps) {
  const { userId } = auth();

  const tweak = await db.tweak.findUnique({
    where: {
      id: params.tweakID,
    },
    include: {
      category: true,
    },
  });               

  if (!tweak) {
    return redirect("/explore");
  }

  return (
    <div className="flex flex-col min-h-screen pb-6">
      <TweakHeader
        tweak={tweak}
        categoryName={tweak.category?.name || ""}
        userId={userId}
      />

      <div className="flex-1 container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Description */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Description</h2>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <TweakDescription description={tweak.description || ""} />
            </div>
          </Card>

          {/* Right Column - Registry Content & Info */}
          <div className="space-y-6">
            {tweak.regedit && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Registry Content</h2>
                  </div>
                  <CopyButton content={tweak.regedit} />
                </div>
                <div className="relative">
                  <pre className="bg-secondary/30 p-4 rounded-lg overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent whitespace-pre-wrap scroll-smooth">
                    {tweak.regedit}
                  </pre>
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                </div>
              </Card>
            )}

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Info className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Information</h2>
              </div>

              <div className="space-y-6">
                {/* Author Section */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-avatar.svg" />
                    <AvatarFallback>
                      {tweak.author?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {tweak.author || "Anonymous"}
                    </div>
                    <div className="text-sm text-muted-foreground">Author</div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Hash className="h-4 w-4 text-primary mt-1" />
                    <div>
                      <div className="text-sm font-medium">Category</div>
                      <Badge variant="secondary" className="mt-1">
                        {tweak.category?.name || "Uncategorized"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileCode className="h-4 w-4 text-primary mt-1" />
                    <div>
                      <div className="text-sm font-medium">Type</div>
                      <Badge variant="outline" className="mt-1">
                        {tweak.tweak_type || "Not specified"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-primary mt-1" />
                    <div>
                      <div className="text-sm font-medium">Last Updated</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(tweak.updatedAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
