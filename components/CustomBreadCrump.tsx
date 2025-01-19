"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface CustomBreadCrumpProps {
  breadCrumpPage: string;
  breadCrumpItem?: { link: string; label: string }[];
}

export default function CustomBreadCrump({
  breadCrumpPage,
  breadCrumpItem,
}: CustomBreadCrumpProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center justify-center">
            <Home className="h-3 w-3 mr-2" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadCrumpItem && breadCrumpItem.map((item, index) => (
          <React.Fragment key={item.link + index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={item.link}>{item.label}</BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}

        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{breadCrumpPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
