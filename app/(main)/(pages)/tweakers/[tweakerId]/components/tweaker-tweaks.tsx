"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface TweakerTweaksProps {
    tweaks: Array<{
        id: string;
        title: string;
        short_description?: string | null;
        downloadCount: number;
        tweak_type?: string | null;
        category?: {
            name: string;
        } | null;
        updatedAt: Date;
    }>;
}

export function TweakerTweaks({ tweaks }: TweakerTweaksProps) {
    const router = useRouter();

    if (!tweaks.length) {
        return (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No tweaks published yet
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {tweaks.map((tweak) => (
                <Card
                    key={tweak.id}
                    className="group hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(`/explore/${tweak.id}`)}
                >
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                    {tweak.title}
                                </h3>
                                {tweak.short_description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {tweak.short_description}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Download className="h-4 w-4" />
                                    <span>{tweak.downloadCount} downloads</span>
                                </div>
                                {tweak.tweak_type && (
                                    <div className="flex items-center gap-1">
                                        <FileCode className="h-4 w-4" />
                                        <Badge variant="outline">{tweak.tweak_type}</Badge>
                                    </div>
                                )}
                                {tweak.category && (
                                    <Badge variant="secondary">{tweak.category.name}</Badge>
                                )}
                                <span className="text-xs">
                                    Updated {formatDistanceToNow(new Date(tweak.updatedAt), { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
} 