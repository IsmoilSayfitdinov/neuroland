import { createRoute, Outlet, redirect } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import Sidebar from "@/components/specialist/Sidebar";
import Navbar from "@/components/specialist/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import Role from "@/types/auth";

export const specialistLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_specalits",
  beforeLoad: () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      throw redirect({ to: "/login" });
    }
    if (user.role !== Role.SPECIALIST) {
       throw redirect({ to: "/" });
    }
  },
  component: SpecialistLayout,
});

function SpecialistLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FD]">
      {/* Sidebar - Fixed width */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Navbar - Fixed height at the top */}
        <Navbar />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
