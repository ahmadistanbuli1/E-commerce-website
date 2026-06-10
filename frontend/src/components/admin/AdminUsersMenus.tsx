import { Menu } from "@headlessui/react";
import type { ReactNode } from "react";
import { Archive, ChevronDown, MoreHorizontal, Shield, UserCog } from "lucide-react";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { cn } from "../../utils/cn";

const menuItemsClass =
  "absolute z-30 mt-1 min-w-[10rem] origin-top-left rounded-xl border border-slate-100 bg-white p-1 shadow-lg focus:outline-none";

const menuButtonClass =
  "inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

function MenuOption({
  active,
  selected,
  children,
  onClick
}: {
  active: boolean;
  selected?: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm",
        active ? "bg-slate-50 text-slate-900" : "text-slate-700",
        selected && "font-semibold text-blue-700"
      )}
    >
      {children}
    </button>
  );
}

export function UserRoleMenu({
  role,
  onChange
}: {
  role: "ADMIN" | "CUSTOMER";
  onChange: (role: "ADMIN" | "CUSTOMER") => void;
}) {
  const options: Array<{ value: "ADMIN" | "CUSTOMER"; label: string }> = [
    { value: "CUSTOMER", label: "Customer" },
    { value: "ADMIN", label: "Admin" }
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className={menuButtonClass}>
        <UserCog className="h-4 w-4 text-slate-500" />
        <span>{role}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </Menu.Button>

      <Menu.Items className={menuItemsClass}>
        {options.map((opt) => (
          <Menu.Item key={opt.value}>
            {({ active }) => (
              <MenuOption
                active={active}
                selected={role === opt.value}
                onClick={() => onChange(opt.value)}
              >
                <AdminStatusBadge status={opt.value} />
              </MenuOption>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}

export function UserStatusMenu({
  isBanned,
  onChange
}: {
  isBanned: boolean;
  onChange: (isBanned: boolean) => void;
}) {
  const status = isBanned ? "Banned" : "Active";

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className={menuButtonClass}>
        <Shield className="h-4 w-4 text-slate-500" />
        <AdminStatusBadge status={status} />
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </Menu.Button>

      <Menu.Items className={menuItemsClass}>
        <Menu.Item>
          {({ active }) => (
            <MenuOption active={active} selected={!isBanned} onClick={() => onChange(false)}>
              <AdminStatusBadge status="Active" />
            </MenuOption>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <MenuOption active={active} selected={isBanned} onClick={() => onChange(true)}>
              <AdminStatusBadge status="Banned" />
            </MenuOption>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}

export function UserActionsMenu({ onArchive }: { onArchive: () => void }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className={cn(menuButtonClass, "px-2")} aria-label="User actions">
        <MoreHorizontal className="h-4 w-4 text-slate-500" />
      </Menu.Button>

      <Menu.Items className={cn(menuItemsClass, "left-auto right-0 origin-top-right")}>
        <Menu.Item>
          {({ active }) => (
            <MenuOption
              active={active}
              onClick={onArchive}
            >
              <Archive className="h-4 w-4 text-red-500" />
              Archive user
            </MenuOption>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
