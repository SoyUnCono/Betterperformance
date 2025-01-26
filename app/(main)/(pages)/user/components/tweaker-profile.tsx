"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { TweakerProfile } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const specialtiesList = [
    "Windows Optimization",
    "Gaming Performance",
    "Network Tweaks",
    "System Security",
    "Memory Management",
    "CPU Optimization",
    "GPU Tweaks",
    "Registry Optimization",
    "Batch Scripting",
    "PowerShell",
    "VBScript",
    "System Monitoring"
];

const profileSchema = z.object({
    biography: z.string().min(10, "Biography must be at least 10 characters").max(500, "Biography must be less than 500 characters"),
    contactEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    github: z.string().url("Invalid URL").optional().or(z.literal("")),
    twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
    discord: z.string().optional(),
    linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
    pricingInfo: z.string().optional(),
    isPublic: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface TweakerProfileFormProps {
    initialData?: Partial<TweakerProfile>;
}

export function TweakerProfileForm({ initialData }: TweakerProfileFormProps) {
    const [specialties, setSpecialties] = useState<string[]>(initialData?.specialties || []);
    const [newSpecialty, setNewSpecialty] = useState("");
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            biography: initialData?.biography || "",
            contactEmail: initialData?.contactEmail || "",
            website: initialData?.website || "",
            github: initialData?.github || "",
            twitter: initialData?.twitter || "",
            discord: initialData?.discord || "",
            linkedin: initialData?.linkedin || "",
            pricingInfo: initialData?.pricingInfo?.toString() || "",
            isPublic: initialData?.isPublic ?? true,
        },
    });

    const addSpecialty = () => {
        if (newSpecialty && !specialties.includes(newSpecialty)) {
            setSpecialties([...specialties, newSpecialty]);
            setNewSpecialty("");
        }
    };

    const removeSpecialty = (specialty: string) => {
        setSpecialties(specialties.filter((s) => s !== specialty));
    };

    async function onSubmit(data: ProfileFormValues) {
        try {
            const response = await fetch("/api/user/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    specialties,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            toast({
                title: "Success",
                description: "Your profile has been updated",
            });

            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                            Tell us about yourself and your expertise
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="biography"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Biography</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us about yourself..."
                                            {...field}
                                            rows={4}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Share your experience and expertise in performance optimization
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <FormLabel>Specialties</FormLabel>
                            <div className="flex flex-wrap gap-2">
                                {specialties.map((specialty) => (
                                    <Badge
                                        key={specialty}
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        {specialty}
                                        <button
                                            type="button"
                                            onClick={() => removeSpecialty(specialty)}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    list="specialties"
                                    placeholder="Add a specialty..."
                                    value={newSpecialty}
                                    onChange={(e) => setNewSpecialty(e.target.value)}
                                />
                                <Button type="button" onClick={addSpecialty}>
                                    Add
                                </Button>
                            </div>
                            <datalist id="specialties">
                                {specialtiesList.map((specialty) => (
                                    <option key={specialty} value={specialty} />
                                ))}
                            </datalist>
                            <FormDescription>
                                Add your areas of expertise in performance optimization
                            </FormDescription>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>
                            How can others reach you?
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your@email.com" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This email will be visible to others
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://your-website.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="github"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>GitHub</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://github.com/username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="twitter"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Twitter</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://twitter.com/username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="discord"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discord</FormLabel>
                                        <FormControl>
                                            <Input placeholder="username#0000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="linkedin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>LinkedIn</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://linkedin.com/in/username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Services & Pricing</CardTitle>
                        <CardDescription>
                            Share information about your services and pricing
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="pricingInfo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe your services and pricing..."
                                            {...field}
                                            rows={6}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        You can use HTML for formatting
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
    );
} 