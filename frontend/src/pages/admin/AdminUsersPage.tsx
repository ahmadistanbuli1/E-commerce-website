import { useMemo, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminPagination } from "../../components/admin/AdminPagination";
import { UserActionsMenu, UserRoleMenu, UserStatusMenu } from "../../components/admin/AdminUsersMenus";
import { DataTable } from "../../components/ui/DataTable";
import { TableSkeleton } from "../../components/ui/LoadingState";
import { useAdminUsers, useArchiveUser, useUpdateUserRoleStatus } from "../../hooks/admin";

export function AdminUsersPage() {
  const usersQuery = useAdminUsers();
  const updateRoleStatus = useUpdateUserRoleStatus();
  const archiveUser = useArchiveUser();
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const sorted = useMemo(() => {
    const rows = [...(usersQuery.data ?? [])];
    rows.sort((a, b) => {
      let av: string | number = "";
      let bv: string | number = "";
      if (sortKey === "name") {
        av = `${a.firstName} ${a.lastName}`;
        bv = `${b.firstName} ${b.lastName}`;
      } else if (sortKey === "email") {
        av = a.email;
        bv = b.email;
      } else if (sortKey === "role") {
        av = a.role;
        bv = b.role;
      } else {
        av = new Date(a.createdAt).getTime();
        bv = new Date(b.createdAt).getTime();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [usersQuery.data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const onSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Users Management"
          breadcrumb={[
            { label: "Dashboard", to: "/admin" },
            { label: "Users" }
          ]}
        />

        {usersQuery.isLoading ? (
          <TableSkeleton rows={6} />
        ) : (
          <>
            <DataTable
              rows={paged}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
              columns={[
                {
                  key: "name",
                  header: "Name",
                  sortValue: (u) => `${u.firstName} ${u.lastName}`,
                  render: (u) => (
                    <div>
                      <p className="font-medium">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                  )
                },
                {
                  key: "role",
                  header: "Role",
                  sortValue: (u) => u.role,
                  render: (u) => (
                    <UserRoleMenu
                      role={u.role}
                      onChange={(role) =>
                        updateRoleStatus.mutate({
                          userId: u.id,
                          role
                        })
                      }
                    />
                  )
                },
                {
                  key: "status",
                  header: "Status",
                  render: (u) => (
                    <UserStatusMenu
                      isBanned={u.isBanned}
                      onChange={(isBanned) =>
                        updateRoleStatus.mutate({
                          userId: u.id,
                          isBanned
                        })
                      }
                    />
                  )
                },
                {
                  key: "createdAt",
                  header: "Joined",
                  sortValue: (u) => new Date(u.createdAt).getTime(),
                  render: (u) => new Date(u.createdAt).toLocaleDateString()
                },
                {
                  key: "actions",
                  header: "Actions",
                  render: (u) => <UserActionsMenu onArchive={() => archiveUser.mutate(u.id)} />
                }
              ]}
            />

            <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </AdminLayout>
  );
}
