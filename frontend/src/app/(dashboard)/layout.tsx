"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  ClipboardList,
  CreditCard,
  User,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/videos", label: "Videos", icon: Video },
  { href: "/exams", label: "Exams", icon: ClipboardList },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/profile", label: "Profile", icon: User },
];

const adminItems = [{ href: "/admin", label: "Admin", icon: ShieldCheck }];

type NavLinksProps = {
  pathname: string;
  userRole?: string;
  onClick?: () => void;
};

function NavLinks({ pathname, userRole, onClick }: NavLinksProps) {
  return (
    <nav className="flex flex-col gap-1 flex-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}

      {userRole === "ADMIN" && (
        <>
          <div className="my-2 border-t border-slate-800" />

          {adminItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                onClick={onClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </>
      )}
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isHydrated, isAuthenticated, logout } = useAuthStore();

  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-4 fixed inset-y-0 left-0">
        {/* Logo */}
        <div className="mb-8 px-3">
          <span className="text-lg font-bold text-white tracking-tight">
            Exam<span className="text-indigo-400">Platform</span>
          </span>
        </div>

        {/* Navigation */}
        <NavLinks pathname={pathname} userRole={user?.role} />

        {/* User + logout */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>

              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 h-14 bg-slate-900 border-b border-slate-800">
        <span className="text-base font-bold">
          Exam<span className="text-indigo-400">Platform</span>
        </span>

        <button
          onClick={() => setSidebarOpen(true)}
          className="text-slate-400 hover:text-white"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />

          <aside className="relative flex flex-col w-72 bg-slate-900 p-4 h-full">
            <div className="flex items-center justify-between mb-8 px-3">
              <span className="text-lg font-bold">
                Exam<span className="text-indigo-400">Platform</span>
              </span>

              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <NavLinks
              pathname={pathname}
              userRole={user?.role}
              onClick={() => setSidebarOpen(false)}
            />

            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 px-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name}
                  </p>

                  <p className="text-xs text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
