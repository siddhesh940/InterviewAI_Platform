"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { useSidebar } from "@/contexts/SidebarContext";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { PanelLeft, PanelLeftClose } from "lucide-react";
import Link from "next/link";

function Navbar() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className="fixed inset-x-0 top-0 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-[10] h-fit py-4 transition-colors duration-200">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto">
        <div className="flex flex-row gap-3 justify-center items-center">
          {/* Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          
          <Link href="/dashboard" className="flex items-center gap-2">
            <p className="px-2 py-1 text-2xl font-bold text-black dark:text-white">
              Interview<span className="text-indigo-600 dark:text-indigo-400">.ai</span>{" "}
              <span className="text-[8px]">Beta</span>
            </p>
          </Link>
          <p className="my-auto text-xl text-gray-400 dark:text-gray-500">/</p>
          <div className="my-auto">
            <OrganizationSwitcher
              afterCreateOrganizationUrl="/dashboard"
              hidePersonal={true}
              afterSelectOrganizationUrl="/dashboard"
              afterLeaveOrganizationUrl="/dashboard"
              appearance={{
                variables: {
                  fontSize: "0.9rem",
                },
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/sign-in" signInUrl="/sign-in" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
