"use client";

import { Tweak } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface TweakCardProps {
    tweak: Tweak & {
        category: {
            id: string;
            name: string;
        } | null;
    };
}

export function TweakCard({ tweak }: TweakCardProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/explore/${tweak.id}`);
    };

    return (
        <Card
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={handleClick}
        >
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                        {tweak.category?.name || "Uncategorized"}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{tweak.downloadCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{tweak.viewCount}</span>
                        </div>
                    </div>
                </div>
                <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                    {tweak.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                    {tweak.short_description || tweak.description || "No description provided"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                            {tweak.tweak_type || "Unknown"}
                        </Badge>
                        {tweak.price && (
                            <Badge variant="default" className="text-xs">
                                ${tweak.price}
                            </Badge>
                        )}
                    </div>
                    <span>
                        {formatDistanceToNow(new Date(tweak.createdAt), { addSuffix: true })}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
} 