import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Github,
    Twitter,
    Linkedin,
    Globe,
    Mail,
    MessageSquare,
    Star,
    Download,
    Package,
    Crown
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TweakerTweaks } from "./_components/TweakerTweaks";
import { formatDistanceToNow } from "date-fns";
import { Reviews } from "./_components/Reviews";
import CustomBreadCrump from "@/components/CustomBreadCrump";
import { clerkClient } from "@clerk/nextjs/server";

interface SocialLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
    if (!href) return null;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
            {icon}
            <span>{label}</span>
        </a>
    );
}

export default async function TweakerProfile({ params }: { params: { tweakerId: string } }) {
    const tweakerProfile = await db.tweakerProfile.findUnique({
        where: {
            id: params.tweakerId,
        },
        include: {
            tweaks: {
                include: {
                    category: true
                }
            },
            reviews: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    });

    if (!tweakerProfile || !tweakerProfile.isPublic) {
        notFound();
    }

    // Obtener la información del usuario de Clerk
    const user = await clerkClient.users.getUser(tweakerProfile.userId);

    const breadCrumpItems = [
        {
            label: "Explore",
            link: "/explore",
        },
        {
            label: "Tweakers",
            link: "/tweakers",
        }
    ];

    return (
        <div className="container mx-auto py-10 space-y-8">
            <CustomBreadCrump
                items={breadCrumpItems}
                currentPage={user.username || tweakerProfile.username || "Anonymous Tweaker"}
            />

            {/* Header con información básica */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div className="relative">
                            <Avatar className="h-32 w-32 border-4 border-primary/20">
                                <AvatarImage src={user.imageUrl} />
                                <AvatarFallback>
                                    {user.username?.slice(0, 2).toUpperCase() || "TW"}
                                </AvatarFallback>
                            </Avatar>
                            {tweakerProfile.rating >= 4.5 && (
                                <div className="absolute -top-2 -right-2">
                                    <Crown className="h-6 w-6 text-yellow-500 animate-[float_3s_ease-in-out_infinite]" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div>
                                <h1 className="text-3xl font-bold">
                                    {user.username || tweakerProfile.username || "Anonymous Tweaker"}
                                </h1>
                                <p className="text-muted-foreground">
                                    {user.emailAddresses[0]?.emailAddress || tweakerProfile.contactEmail}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Joined {formatDistanceToNow(tweakerProfile.joinedAt || new Date(), { addSuffix: true })}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {tweakerProfile.specialties?.map((specialty, index) => (
                                    <Badge key={index} variant="secondary">
                                        {specialty}
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <span>{tweakerProfile.rating?.toFixed(1) || "New"}</span>
                                    <span className="text-xs">({tweakerProfile.reviewCount || 0} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Download className="h-4 w-4" />
                                    <span>{tweakerProfile.totalDownloads} downloads</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Package className="h-4 w-4" />
                                    <span>{tweakerProfile.tweaks.length} tweaks</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {tweakerProfile.contactEmail && (
                                <Button asChild>
                                    <a href={`mailto:${tweakerProfile.contactEmail}`}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Contact
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Contenido Principal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sidebar */}
                <div className="space-y-6">
                    {/* About */}
                    <Card>
                        <CardHeader>
                            <CardTitle>About</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {tweakerProfile.biography || "No biography provided"}
                            </p>
                            <Separator />
                            <div className="space-y-2">
                                <SocialLink
                                    href={tweakerProfile.github || ""}
                                    icon={<Github className="h-4 w-4" />}
                                    label="GitHub"
                                />
                                <SocialLink
                                    href={tweakerProfile.twitter || ""}
                                    icon={<Twitter className="h-4 w-4" />}
                                    label="Twitter"
                                />
                                <SocialLink
                                    href={tweakerProfile.linkedin || ""}
                                    icon={<Linkedin className="h-4 w-4" />}
                                    label="LinkedIn"
                                />
                                <SocialLink
                                    href={tweakerProfile.website || ""}
                                    icon={<Globe className="h-4 w-4" />}
                                    label="Website"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Services & Pricing</CardTitle>
                            <CardDescription>Custom tweaks and consultancy</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {tweakerProfile.pricingInfo ? (
                                    <div dangerouslySetInnerHTML={{ __html: tweakerProfile.pricingInfo.toString() }} />
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Contact for pricing information
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2">
                    <Tabs defaultValue="tweaks">
                        <TabsList>
                            <TabsTrigger value="tweaks">Tweaks</TabsTrigger>
                            <TabsTrigger value="achievements">Achievements</TabsTrigger>
                            <TabsTrigger value="reviews">
                                Reviews
                                {tweakerProfile.reviewCount > 0 && (
                                    <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                                        {tweakerProfile.reviewCount}
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="tweaks" className="space-y-4">
                            <TweakerTweaks tweaks={tweakerProfile.tweaks} />
                        </TabsContent>
                        <TabsContent value="achievements">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tweakerProfile.achievements?.map((achievement, index) => (
                                    <Card key={index}>
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-4">
                                                <Star className="h-8 w-8 text-yellow-500" />
                                                <div>
                                                    <h3 className="font-semibold">{achievement}</h3>
                                                    <p className="text-sm text-muted-foreground">Achievement unlocked</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="reviews" className="space-y-6">
                            <Reviews
                                reviews={tweakerProfile.reviews}
                                tweakerId={tweakerProfile.id}
                                tweakerName={tweakerProfile.username || "Anonymous Tweaker"}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
} 