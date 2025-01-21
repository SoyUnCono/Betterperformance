import { Button } from "@/components/ui/button";
import { ArrowLeft, FilePenLine, Info, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import TweaksPublishActions from "./_components/tweaksPublishActions";
import { Banner } from "@/components/Banner";
import { IconBagde } from "@/components/IconBagde";
import TitleForm from "./_components/Forms/TitleForm";
import DescriptionForm from "./_components/Forms/DescriptionForm";
import CategoryForm from "./_components/Forms/CategoryForm";
import RegeditEditorForm from "./_components/Forms/RegeditEditorForm";
import RegeditTypeForm from "./_components/Forms/RegeditTypeForm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { db } from "@/lib/db";

interface TweaksDetailProps {
  tweakID: string;
}

export default async function TweaksDetailPage({
  params,
}: {
  params: TweaksDetailProps;
}) {
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(params.tweakID)) return redirect("/");

  const tweak = await db.tweak.findUnique({
    where: {
      id: params.tweakID,
    },
  });

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  if (!tweak) return redirect("/admin/create-new-tweak");

  const requiredFields = [
    tweak.title,
    tweak.short_description,
    tweak.regedit,
    tweak.authorId,
    tweak.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields}/${totalFields}`;

  const isCompleted = requiredFields.every(Boolean);

  return (
    <>
      <div className="flex items-center justify-between my-2 mb-6">
        <Link href={"/admin"} className="sm:hidden flex">
          <Button
            className="flex items-center gap-3 text-sm text-neutral-500"
            variant="ghost"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="sm:flex hidden">Back</span>
          </Button>
        </Link>
        <div className="flex items-center gap-x-2">
          <Link href={"/admin"} className="sm:flex hidden">
            <Button
              className="flex items-center gap-3 text-sm text-neutral-500"
              variant="ghost"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="sm:flex hidden">Back</span>
            </Button>
          </Link>
          <div className="flex flex-col gap-y">
            <div className="flex gap-x-1">
              <h1 className="text-2xl font-medium">Admin Panel</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 sm:flex hidden" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="text-xs text-muted-foreground">
                      Unique Tweak ID: {params.tweakID}
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm text-neutral-500">
              You need to complete ({completionText}) to continue.
            </span>
          </div>
        </div>
        <TweaksPublishActions
          tweakID={params.tweakID}
          isPublished={tweak.isPublished}
          isDisabled={!isCompleted}
        />
      </div>
      {!tweak.isPublished && (
        <Banner
          variant="warning"
          label="This tweak is not published yet. Make sure to publish it after finishing the edits; otherwise, this tweak will not be visible to others."
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBagde icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your tweak</h2>
            </div>
            <TitleForm initialData={tweak} tweakID={params.tweakID} />
            <DescriptionForm initialData={tweak} tweakID={params.tweakID} />
            <CategoryForm
              initialData={tweak}
              tweakID={params.tweakID}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center gap-x-2">
            <IconBagde icon={FilePenLine} />
            <h2 className="text-xl text-neutral-700">Regedits Information</h2>
          </div>
          <RegeditEditorForm
            tweakID={params.tweakID}
            initialData={tweak}
            tweakType={tweak.tweak_type || ""}
          />
          <RegeditTypeForm
            tweakID={params.tweakID}
            initialTweakType={tweak.tweak_type || null}
          />
        </div>
      </div>
    </>
  );
}
