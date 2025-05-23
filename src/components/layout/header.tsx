import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/layout/user-nav";
import { Logo } from "@/components/icons/logo";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="flex items-center gap-2">
         <Logo className="h-7 w-7 text-primary" />
         <h1 className="text-xl font-semibold text-foreground">ResqTrack Admin</h1>
        </Link>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <UserNav />
      </div>
    </header>
  );
}
