"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, CircleDot, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUnreadCount } from "@/hooks/use-notifications";

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: unread = 0 } = useUnreadCount(Boolean(user));

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <header className="sticky top-0 z-40 border-b border-primary-light/30 bg-surface/90 backdrop-blur-md">
      <div
        className={cn(
          "mx-auto flex h-16 items-center justify-between px-4 sm:px-6",
          pathname === "/" ? "max-w-6xl" : "max-w-5xl",
        )}
      >
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-accent">
            <CircleDot className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold text-primary sm:text-xl">
            Pocket Circle
          </span>
        </Link>

        {!loading && (
          <nav className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden text-sm font-medium text-text-muted transition-colors hover:text-primary sm:inline"
                >
                  Dashboard
                </Link>
                {user.isSuperAdmin === true && (
                  <Link
                    href="/admin"
                    className="hidden text-sm font-medium text-text-muted transition-colors hover:text-primary sm:inline"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/notifications"
                  className="relative rounded-lg p-2 text-text-muted transition-colors hover:bg-bg hover:text-primary"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unread > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white animate-[pc-pop_.3s_ease-out]">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </Link>
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-bg"
                    aria-label="Profile menu"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                      {getInitials(user.name)}
                    </span>
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-primary-light/40 bg-surface py-1 shadow-lg animate-[pc-scale-in_.18s_ease-out]">
                      <div className="border-b border-primary-light/30 px-3 py-2">
                        <p className="truncate text-sm font-medium">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-text-muted">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/notifications"
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-bg sm:hidden"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Bell className="h-4 w-4" /> Notifications
                      </Link>
                      {user.isSuperAdmin === true && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-bg sm:hidden"
                          onClick={() => setMenuOpen(false)}
                        >
                          Admin
                        </Link>
                      )}
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-bg"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" /> Account settings
                      </Link>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/5"
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4" /> Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              !isAuthPage && (
                <>
                  <Link
                    href="/how-it-works"
                    className="hidden text-sm font-medium text-text-muted transition-colors hover:text-primary sm:inline"
                  >
                    How it works
                  </Link>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">Sign up</Button>
                  </Link>
                </>
              )
            )}
            {loading && (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light/40">
                <User className="h-4 w-4 text-primary-light" />
              </span>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
