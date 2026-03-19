import { createRoute, Outlet, redirect } from "@tanstack/react-router";
import { OfflineBanner } from "@/components/admin/ui/OfflineBanner";
import { rootRoute } from "./__root";
import ParentSidebar from "@/components/parent/Sidebar";
import ParentNavbar from "@/components/parent/Navbar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import Role from "@/types/auth";

export const parentLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_parents",
  beforeLoad: () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      throw redirect({ to: "/login" });
    }
    if (user.role !== Role.PARENT) {
      throw redirect({ to: "/" });
    }
  },
  component: ParentLayout,
});

function ParentLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FD]">
      <OfflineBanner />
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed width on desktop, absolute drawer on mobile */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out w-[256px] h-full",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ParentSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col w-full lg:w-[calc(100%-256px)]">
        {/* Navbar - Fixed height at the top */}
        <ParentNavbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
