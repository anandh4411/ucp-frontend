import { Outlet } from "@tanstack/react-router";
import {
  Monitor,
  Bell,
  Palette,
  Settings as SettingsIcon,
  User,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SidebarNav from "./components/sidebar-nav";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export default function Settings() {
  const smoothScrollRef = useSmoothScroll(false);

  return (
    <div className="h-[calc(100vh-200px)]">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex flex-1 flex-col space-y-2 md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12 lg:h-[calc(100vh-200px)]">
        <aside className="lg:sticky lg:top-0 lg:w-1/5 lg:h-fit">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 overflow-y-auto p-1" ref={smoothScrollRef}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const sidebarNavItems = [
  {
    title: "Profile",
    icon: <User size={18} />,
    href: "/settings",
  },
  {
    title: "Account",
    icon: <SettingsIcon size={18} />,
    href: "/settings/account",
  },
  {
    title: "Appearance",
    icon: <Palette size={18} />,
    href: "/settings/appearance",
  },
  {
    title: "Notifications",
    icon: <Bell size={18} />,
    href: "/settings/notifications",
  },
  {
    title: "Display",
    icon: <Monitor size={18} />,
    href: "/settings/display",
  },
];
