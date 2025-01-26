"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Crown, Star, Users } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface TweakerCardProps {
    tweaker: {
        id: string;
        userId: string;
        username?: string;
        biography?: string;
        specialties: string[];
        rating: number;
        totalDownloads: number;
        isPublic: boolean;
        contactEmail?: string;
        imageUrl?: string;
        tweaks: any[];
        reviews: any[];
    };
}

function TweakerCard({ tweaker }: TweakerCardProps) {
    const router = useRouter();

    return (
        <Card
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
            onClick={() => router.push(`/tweakers/${tweaker.id}`)}
        >
            <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                        <Avatar className="h-20 w-20 border-2 border-primary/20">
                            <AvatarImage src={tweaker.imageUrl} />
                            <AvatarFallback>
                                {tweaker.username?.slice(0, 2).toUpperCase() || "TW"}
                            </AvatarFallback>
                        </Avatar>
                        <Crown
                            className="absolute -top-6 left-1/2 -translate-x-1/2 h-8 w-8 text-yellow-500 transform -rotate-12 animate-[float_3s_ease-in-out_infinite]"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {tweaker.username || "Anonymous Tweaker"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {tweaker.contactEmail}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {tweaker.biography || "AI Performance Specialist"}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {tweaker.specialties?.slice(0, 2).map((specialty, index) => (
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

interface TweakerCarouselProps {
    tweakers: TweakerCardProps["tweaker"][];
}

export function TweakerCarousel({ tweakers }: TweakerCarouselProps) {
    if (!tweakers.length) return null;

    return (
        <div className="w-full px-12">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Featured Tweakers</h2>
                    <p className="text-muted-foreground">
                        Meet our AI Performance Specialists
                    </p>
                </div>
            </div>
            <div className="relative">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {tweakers.map((tweaker) => (
                            <CarouselItem key={tweaker.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <TweakerCard tweaker={tweaker} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-12" />
                    <CarouselNext className="-right-12" />
                </Carousel>
            </div>
        </div>
    );
} 