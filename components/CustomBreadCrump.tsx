"use client";
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

        {breadCrumpItem && (
          <>
            {breadCrumpItem.map((item, index) => (
              <>
                <BreadcrumbSeparator key={index} />
                <BreadcrumbLink href={item.link}>{item.label}</BreadcrumbLink>
              </>
            ))}
          </>
        )}
        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage>{breadCrumpPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
