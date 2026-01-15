"use client";

import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import SideMenu from "@/components/sideMenu";
import { ClerkProvider } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ClerkProvider
      signInFallbackRedirectUrl={"/dashboard"}
      afterSignOutUrl={"/sign-in"}
    >
      <Providers>
        <div className="antialiased overflow-hidden min-h-screen">
          {!pathname.includes("/sign-in") &&
            !pathname.includes("/sign-up") && <Navbar />}
          <div className="flex flex-row h-screen">
            {!pathname.includes("/sign-in") &&
              !pathname.includes("/sign-up") && <SideMenu />}
            <div className="ml-72 pt-[64px] h-full overflow-y-auto flex-grow">
              {children}
            </div>
          </div>
          <Toaster
            toastOptions={{
              classNames: {
                toast: "bg-white",
                title: "text-black",
                description: "text-red-400",
                actionButton: "bg-indigo-400",
                cancelButton: "bg-orange-400",
                closeButton: "bg-white-400",
              },
            }}
          />
        </div>
      </Providers>
    </ClerkProvider>
  );
}
