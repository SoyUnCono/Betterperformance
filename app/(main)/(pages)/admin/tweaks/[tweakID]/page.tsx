import { Button } from "@/components/ui/button";
import { ArrowLeft, FilePenLine, Info, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import TweaksPublishActions from "./components/tweak-publish-actions";
import { Banner } from "@/components/banner";
import TitleForm from "./components/Forms/title-form";
import DescriptionForm from "./components/Forms/description-form";
import CategoryForm from "./components/Forms/category-form";
import RegeditEditorForm from "./components/Forms/regedit-form";
import RegeditTypeForm from "./components/Forms/regedit-type-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { db } from "@/lib/db";
import { IconBagde } from "@/components/icon-bagde";
import ImageForm from "./components/Forms/image-form";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

interface TweakIdPageProps {
  params: {
    tweakID: string;
  };
}

export default async function TweakIdPage({ params }: TweakIdPageProps) {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  // Verificar si el usuario es admin usando los metadatos de Clerk
  const isAdmin = user.publicMetadata.role === "admin";

  if (!isAdmin) {
    return redirect("/");
  }

  const tweak = await db.tweak.findUnique({
    where: {
      id: params.tweakID,
    },
  });

  if (!tweak) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const requiredFields = [
    tweak.title,
    tweak.short_description,
    tweak.icon_url,
    tweak.categoryId,
    tweak.tweak_type,
    tweak.regedit,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields}/${totalFields} fields completed`;
  const completionPercentage = (completedFields / totalFields) * 100;

  const isCompleted = requiredFields.every(Boolean);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="sticky top-14 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-x-3">
            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
            </Link>
            <div className="flex flex-col">
              <div className="flex items-center gap-x-2">
                <h1 className="text-xl font-semibold">Tweak Editor</h1>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-primary transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="flex items-center gap-x-2"
                    >
                      <span className="font-medium">ID:</span>
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                        {params.tweakID}
                      </code>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-x-2 mt-1">
                <Progress
                  value={completionPercentage}
                  className={cn(
                    "h-2 w-[60px] transition-all",
                    completionPercentage === 100 ? "bg-emerald-500" : ""
                  )}
                />
                <span className="text-sm text-muted-foreground">
                  {completionText}
                </span>
              </div>
            </div>
          </div>
          <TweaksPublishActions
            tweakID={params.tweakID}
            isPublished={tweak.isPublished}
            isDisabled={!isCompleted}
          />
        </div>
      </div>

      <div className="px-6 py-6">
        {!tweak.isPublished && (
          <Banner
            variant="warning"
            label="This tweak is unpublished. Complete all required fields and publish it to make it visible to others."
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[minmax(120px,auto)]">
          {/* Title Form - 4 columns */}
          <div className="col-span-1 md:col-span-4 rounded-xl border bg-card text-card-foreground shadow transition hover:shadow-md">
            <div className="p-6">
              <TitleForm initialData={tweak} tweakID={tweak.id} />
            </div>
          </div>

          {/* Category Form - 2 columns */}
          <div className="col-span-1 md:col-span-2 rounded-xl border bg-card text-card-foreground shadow transition hover:shadow-md">
            <div className="p-6">
              <CategoryForm
                initialData={tweak}
                tweakID={tweak.id}
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
              />
            </div>
          </div>

          {/* Description Form - 3 columns */}
          <div className="col-span-1 md:col-span-3 rounded-xl border bg-card text-card-foreground shadow transition hover:shadow-md">
            <div className="p-6">
              <DescriptionForm initialData={tweak} tweakID={tweak.id} />
            </div>
          </div>

          {/* Image Form - 3 columns */}
          <div className="col-span-1 md:col-span-3 rounded-xl border bg-card text-card-foreground shadow transition hover:shadow-md">
            <div className="p-6">
              <ImageForm initialData={tweak} tweakID={tweak.id} />
            </div>
          </div>

          {/* Regedit Type Form - 2 columns */}
          <div className="col-span-1 md:col-span-2 rounded-xl border bg-card text-card-foreground shadow transition hover:shadow-md">
            <div className="p-6">
              <RegeditTypeForm
                initialTweakType={tweak.tweak_type || null}
                tweakID={tweak.id}
              />
            </div>
          </div>

          {/* Regedit Form - 4 columns */}
          <div className="col-span-1 md:col-span-4 rounded-xl border bg-card text-card-foreground shadow transition hover:shadow-md">
            <div className="p-6">
              <RegeditEditorForm
                tweakID={tweak.id}
                initialData={tweak}
                tweakType={tweak.tweak_type || ""}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
