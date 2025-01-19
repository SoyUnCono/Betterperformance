"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Star, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { auth } from "@clerk/nextjs";

interface ReviewsProps {
    reviews: Array<{
        id: string;
        content: string;
        rating: number;
        createdAt: Date;
        userId: string;
        userName: string;
    }>;
    tweakerId: string;
    tweakerName: string;
}

export function Reviews({ reviews, tweakerId, tweakerName }: ReviewsProps) {
    const [isWriting, setIsWriting] = useState(false);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async () => {
        try {
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content,
                    rating,
                    tweakerId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit review");
            }

            toast({
                title: "Success",
                description: "Your review has been submitted",
            });

            setIsWriting(false);
            setContent("");
            setRating(5);
            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit review. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (!reviews.length && !isWriting) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center space-y-4">
                        <p className="text-muted-foreground">
                            No reviews yet for {tweakerName}
                        </p>
                        <Button onClick={() => setIsWriting(true)}>
                            Write First Review
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {!isWriting && (
                <div className="flex justify-end">
                    <Button onClick={() => setIsWriting(true)}>
                        Write Review
                    </Button>
                </div>
            )}

            {isWriting && (
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <Star
                                    key={value}
                                    className={`h-6 w-6 cursor-pointer transition-colors ${value <= (hoveredRating || rating)
                                        ? "text-yellow-500"
                                        : "text-muted-foreground"
                                        }`}
                                    onClick={() => setRating(value)}
                                    onMouseEnter={() => setHoveredRating(value)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                />
                            ))}
                        </div>
                        <Textarea
                            placeholder="Write your review..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsWriting(false);
                                    setContent("");
                                    setRating(5);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!content.trim() || rating === 0}
                            >
                                Submit Review
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {reviews.map((review) => (
                    <Card key={review.id}>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <User className="h-6 w-6 text-muted-foreground" />
                                    <span className="font-medium">
                                        {review.userName}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating
                                                ? "text-yellow-500"
                                                : "text-muted-foreground"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {review.content}
                            </p>
                            <div className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(review.createdAt), {
                                    addSuffix: true,
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 