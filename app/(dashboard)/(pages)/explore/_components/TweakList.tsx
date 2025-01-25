"use client";

import { Tweak } from "@prisma/client";
import { TweakCard } from "./TweakCard";

interface TweakListProps {
    tweaks: Array<Tweak & {
        category: {
            id: string;
            name: string;
        } | null;
    }>;
}

export function TweakList({ tweaks }: TweakListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tweaks.map((tweak) => (
                <TweakCard key={tweak.id} tweak={tweak} />
            ))}
        </div>
    );
} 