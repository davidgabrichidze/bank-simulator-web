import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CreditCard,
  ArrowRightLeft,
  Receipt,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
}

function SidebarLink({ href, icon, label, isActive }: SidebarLinkProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all cursor-pointer",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <div className="font-bold text-xl text-primary flex items-center gap-2 cursor-pointer">
              <CreditCard className="h-6 w-6" />
              <span>Bank Simulator</span>
            </div>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/admin">
            <div className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer">
              Admin
            </div>
          </Link>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
          <nav className="flex-1 overflow-auto py-6 px-4">
            <div className="space-y-1.5">
              <SidebarLink
                href="/"
                icon={<LayoutDashboard className="h-4 w-4" />}
                label="Dashboard"
                isActive={location === "/"}
              />
              <SidebarLink
                href="/accounts"
                icon={<CreditCard className="h-4 w-4" />}
                label="Accounts"
                isActive={location.startsWith("/accounts")}
              />
              <SidebarLink
                href="/transactions"
                icon={<ArrowRightLeft className="h-4 w-4" />}
                label="Transactions"
                isActive={location.startsWith("/transactions")}
              />
              <SidebarLink
                href="/loans"
                icon={<Receipt className="h-4 w-4" />}
                label="Loans"
                isActive={location.startsWith("/loans")}
              />
              <SidebarLink
                href="/events"
                icon={<Bell className="h-4 w-4" />}
                label="Events"
                isActive={location.startsWith("/events")}
              />
              <SidebarLink
                href="/admin"
                icon={<Settings className="h-4 w-4" />}
                label="Admin"
                isActive={location.startsWith("/admin")}
              />
            </div>
          </nav>
          <div className="mt-auto p-4">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <LogOut className="h-4 w-4" />
              <span>Exit Simulator</span>
            </button>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}