"use client";

import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import SideMenu from "@/components/sideMenu";
import { GamesProvider } from "@/contexts/GamesContext";
import { InterviewResourcesProvider } from "@/contexts/InterviewResourcesContext";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { ClerkProvider } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

// Separate component to use sidebar context safely
function MainContent({ children, isAuthPage }: { children: React.ReactNode; isAuthPage: boolean }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div 
      className={`pt-[64px] h-full overflow-y-auto flex-grow transition-all duration-300 ease-in-out ${
        isAuthPage ? 'ml-0' : isCollapsed ? 'ml-0' : 'ml-72'
      }`}
    >
      {children}
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.includes("/sign-in") || pathname.includes("/sign-up");

  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      afterSignOutUrl="/sign-in"
    >
      <Providers>
        <SidebarProvider>
          <GamesProvider>
            <InterviewResourcesProvider>
              <div className="antialiased overflow-hidden min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
                {!isAuthPage && <Navbar />}
                <div className="flex flex-row h-screen">
                  {!isAuthPage && <SideMenu />}
                  <MainContent isAuthPage={isAuthPage}>{children}</MainContent>
                </div>
                <Toaster
                  toastOptions={{
                    classNames: {
                      toast: "bg-white dark:bg-slate-900 border dark:border-slate-700",
                      title: "text-black dark:text-white",
                      description: "text-red-400 dark:text-red-300",
                      actionButton: "bg-indigo-400 dark:bg-indigo-600",
                      cancelButton: "bg-orange-400 dark:bg-orange-600",
                      closeButton: "bg-white-400 dark:bg-slate-700",
                    },
                  }}
                />
              </div>
            </InterviewResourcesProvider>
          </GamesProvider>
        </SidebarProvider>
      </Providers>
    </ClerkProvider>
  );
}
