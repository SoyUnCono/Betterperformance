import { Button } from "@/components/ui/button";
import { ArrowLeft, FilePenLine, Info, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import TweaksPublishActions from "./_components/tweaksPublishActions";
import { Banner } from "@/components/Banner";
import { IconBagde } from "@/components/IconBagde";
import TitleForm from "./_components/Forms/TitleForm";
import AuthorForm from "./_components/Forms/AuthorForm";
import CategoryForm from "./_components/Forms/CategoryForm";
import DescriptionForm from "./_components/Forms/DescriptionForm";
import ImageForm from "./_components/Forms/ImageForm";
import ShortDescriptionForm from "./_components/Forms/ShortDescription";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { db } from "@/lib/db";
import RegeditEditorForm from "./_components/Forms/RegeditEditorForm";

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
    tweak.author,
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
              You need to complete ({completionText}) to continue. regedit:
            </span>
          </div>
        </div>
        <TweaksPublishActions
          tweakID={params.tweakID}
          isPublished={tweak.isPublished}
          disabled={!isCompleted}
        />
      </div>
      {!tweak.isPublished && (
        <Banner
          variant="warning"
          label="This tweak is not published yet. Make sure to publish it after finishing the edits; otherwise, this tweak will not be visible to others."
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
        <div className="mb-2">
          <div className="flex items-center gap-x-2">
            <IconBagde icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">Tweak Information</h2>
          </div>
          <TitleForm initialData={tweak} tweakID={params.tweakID} />
          <CategoryForm
            initialData={tweak}
            tweakID={params.tweakID}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
          <ImageForm initialData={tweak} tweakID={params.tweakID} />
          <ShortDescriptionForm initialData={tweak} tweakID={params.tweakID} />
          <AuthorForm initialData={tweak} tweakID={params.tweakID} />
          <DescriptionForm initialData={tweak} tweakID={params.tweakID} />
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center gap-x-2">
            <IconBagde icon={FilePenLine} />
            <h2 className="text-xl text-neutral-700">Regedits Information</h2>
          </div>
          <RegeditEditorForm tweakID={params.tweakID} initialData={tweak} />
        </div>
      </div>
    </>
  );
}
