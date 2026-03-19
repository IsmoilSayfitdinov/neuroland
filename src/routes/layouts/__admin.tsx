import { createRoute, Outlet, redirect } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminNavbar from "@/components/admin/Navbar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { OfflineBanner } from "@/components/admin/ui/OfflineBanner";
import { useAuthStore } from "@/store/useAuthStore";
import Role from "@/types/auth";

export const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_admin",
  beforeLoad: () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      throw redirect({ to: "/login" });
    }
    if (user.role !== Role.ADMIN) {
      throw redirect({ to: "/" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
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
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col w-full lg:w-[calc(100%-256px)]">
        {/* Navbar - Fixed height at the top */}
        <AdminNavbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
