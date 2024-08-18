import { UserButton } from "@clerk/nextjs";
import MobileNavbar from "./_components/_mobile/MobileNavbar";
import Navbar from "./_components/Navbar";
import TopSection from "./_components/TopSection";
import { Suspense } from "react";

export default function Dashboardlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" flex w-screen flex-col">
      {/* Header */}
      <Navbar />

      {/* Top header */}
      <TopSection className="w-full pl-0 md:pl-20  sticky top-0" />

      <main className="m-2 sm:md-10 md:ml-20">{children}</main>
    </div>
  );
}
