"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Star, Users } from "lucide-react";

interface TweakerCardProps {
    tweaker: {
        id: string;
        userId: string;
        username?: string;
        specialties: string[];
        rating?: number;
        totalDownloads: number;
        tweaks: Array<{
            id: string;
            title: string;
            downloadCount: number;
        }>;
    };
}

function TweakerCard({ tweaker }: TweakerCardProps) {
    const router = useRouter();

    return (
        <Card
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => router.push(`/tweakers/${tweaker.id}`)}
        >
            <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-20 w-20 border-2 border-primary/20">
                        <AvatarImage src={`https://avatar.vercel.sh/${tweaker.userId}`} />
                        <AvatarFallback>
                            {tweaker.username?.slice(0, 2).toUpperCase() || "TW"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {tweaker.username || "Anonymous Tweaker"}
                        </h3>
                        <p className="text-sm text-muted-foreground">AI Performance Specialist</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {tweaker.specialties.slice(0, 3).map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{tweaker.rating?.toFixed(1) || "New"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{tweaker.totalDownloads} downloads</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface FeaturedTweakersProps {
    tweakers: TweakerCardProps["tweaker"][];
}

export function FeaturedTweakers({ tweakers }: FeaturedTweakersProps) {
    const router = useRouter();

    if (!tweakers.length) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Featured Tweakers</h2>
                    <p className="text-muted-foreground">
                        Meet our AI Performance Specialists
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push('/tweakers')}
                >
                    View All
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tweakers.map((tweaker) => (
                    <TweakerCard key={tweaker.id} tweaker={tweaker} />
                ))}
            </div>
        </div>
    );
} 