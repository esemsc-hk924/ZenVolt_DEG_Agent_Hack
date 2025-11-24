"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useUI } from "@/store/ui";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem,
  CommandList, CommandSeparator, CommandShortcut
} from "@/components/ui/command";
import { toast } from "sonner";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();
  const toggleSidebar = useUI((s) => s.toggleSidebar);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  const go = (href: string) => { setOpen(false); router.push(href); };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search actions, pages…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => go("/")}>Driver</CommandItem>
          <CommandItem onSelect={() => go("/org")}>Organization</CommandItem>
          <CommandItem onSelect={() => go("/coach")}>AI Coach</CommandItem>
          <CommandItem onSelect={() => go("/council")}>AI Council</CommandItem>
          <CommandItem onSelect={() => go("/rewards")}>Rewards</CommandItem>
          <CommandItem onSelect={() => go("/badges")}>Badges</CommandItem>
          <CommandItem onSelect={() => go("/settings")}>Settings</CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => { toggleSidebar(); toast.message("Sidebar toggled"); }}>
            Toggle sidebar <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => setTheme("light")}>Theme: Light</CommandItem>
          <CommandItem onSelect={() => setTheme("dark")}>Theme: Dark</CommandItem>
          <CommandItem onSelect={() => setTheme("system")}>Theme: System</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
