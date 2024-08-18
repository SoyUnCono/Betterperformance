"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PanelLeft } from "lucide-react";
import React from "react";
import { routes } from "../../_constants/routes";
import Logo from "../Logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MobileNavbarItem from "./MobileNavbarItem";

export default function MobileNavbar() {
  return (
    <div className="flex flex-col md:hidden md:gap-4 md:py-4 md:pl-14">
      <header className="sticky top-0 bg-background z-30 flex h-14 items-center gap-4  px-4 md:static md:h-auto md:border-0 md:bg-transparent md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="md:hidden">
              <PanelLeft className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          {/* Aviso: Dejar titulo y descripcion en vacio para evitar errores de console innecesarios */}
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
          <SheetContent side="left" className="sm:max-w-xs flex flex-col">
            <div className="flex flex-col justify-center border-b w-full mb-2">
              <Logo className="mb-4" />
              <h1>BetterPerformance</h1>
              <p className="text-sm text-muted-foreground mb-4">
                A tool for Windows users to optimize performance and tailor your
                computer to your preferences. Become the owner of your own
                system!
              </p>
            </div>
            {routes.map(({ icon: Icon, label, path }) => (
              <nav key={path} className="grid gap-6 text-lg font-medium">
                <MobileNavbarItem
                  icon={Icon}
                  path={path}
                  label={label}
                  isBottom={false}
                />
              </nav>
            ))}
            <div className="mt-auto bottom-0">
              <Card>
                <CardHeader>
                  <CardTitle>Support Our Project</CardTitle>
                  <CardDescription>
                    If you would like to support our project and make a
                    donation, please click here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="sm" className="w-full" variant={"outline"}>
                    Donate
                  </Button>
                </CardContent>
              </Card>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  );
}
