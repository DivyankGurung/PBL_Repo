import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="p-4 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Logo className="h-8 w-8 text-primary hidden group-data-[collapsible=icon]:block" />
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                <Logo className="h-8 w-8 text-primary" />
                <span className="font-semibold text-lg text-foreground">ResqTrack</span>
              </div>
            </Link>
            <div className="block group-data-[collapsible=icon]:hidden">
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarNav />
          </SidebarContent>
          <SidebarFooter className="p-4 mt-auto">
            <Button variant="outline" className="w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:aspect-square" asChild>
              <a href="https://firebase.google.com/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 group-data-[collapsible=icon]:m-0 mr-2" />
                <span className="group-data-[collapsible=icon]:hidden">Firebase Console</span>
              </a>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <Header />
          <SidebarInset>
            <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background/70">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
