import React from "react";

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="justify-center items-center h-screen flex ">{children}</div>
  );
}
