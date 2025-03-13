import { MainNav } from "@/components/main-nav";
import QueryWrapper from "@/components/query-wrapper";
import { UserNav } from "@/components/user-nav";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-8">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <QueryWrapper>{children}</QueryWrapper>
      </div>
    </div>
  );
}
