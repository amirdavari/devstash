"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  Code,
  File as FileIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  type LucideIcon,
  Plus,
  Search,
  Settings2,
  Sparkles,
  StickyNote,
  Terminal,
} from "lucide-react";

import { collections, currentUser, itemTypes } from "@/lib/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Maps the lucide icon names stored on ItemType.icon to their components.
const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File: FileIcon,
  Image: ImageIcon,
};

// Type-scoped list route, e.g. "Snippets" -> /items/snippets.
const typeHref = (label: string) => `/items/${label.toLowerCase()}`;

// Most recent collections shown in the sidebar (full list lives on the
// collections page).
const recentCollections = collections.slice(0, 5);

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3">
        <div className="flex items-center justify-between px-1 pt-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 group-data-[collapsible=icon]:gap-0"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand text-brand-foreground">
              <Boxes className="size-4" />
            </span>
            <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">
              DevStash
            </span>
          </Link>
          <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
        </div>

        <Button
          className="w-full justify-center bg-brand text-brand-foreground hover:bg-brand/90 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0!"
          size="lg"
        >
          <Plus />
          <span className="group-data-[collapsible=icon]:hidden">New item</span>
        </Button>

        <div className="relative group-data-[collapsible=icon]:hidden">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items..."
            className="pl-8"
            aria-label="Search items"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Types</SidebarGroupLabel>
          <SidebarMenu>
            {itemTypes.map((type) => {
              const Icon = ICON_MAP[type.icon] ?? FileIcon;
              const href = typeHref(type.label);
              return (
                <SidebarMenuItem key={type.id}>
                  <SidebarMenuButton
                    isActive={pathname === href}
                    tooltip={type.label}
                    render={<Link href={href} />}
                  >
                    <Icon style={{ color: type.color }} />
                    <span>{type.label}</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>{type.count}</SidebarMenuBadge>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Collections</SidebarGroupLabel>
          <SidebarGroupAction title="New collection">
            <Plus />
            <span className="sr-only">New collection</span>
          </SidebarGroupAction>
          <SidebarMenu>
            {recentCollections.map((collection) => {
              const href = `/collections/${collection.id}`;
              return (
                <SidebarMenuItem key={collection.id}>
                  <SidebarMenuButton
                    isActive={pathname === href}
                    tooltip={collection.name}
                    render={<Link href={href} />}
                  >
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: collection.accentColor }}
                    />
                    <span>{collection.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-md p-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
          <Avatar>
            <AvatarFallback className="bg-brand text-brand-foreground">
              {currentUser.initials}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium">
              {currentUser.name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {currentUser.plan} plan
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Account settings"
            nativeButton={false}
            render={<Link href="/settings" />}
            className="group-data-[collapsible=icon]:hidden"
          >
            <Settings2 />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}