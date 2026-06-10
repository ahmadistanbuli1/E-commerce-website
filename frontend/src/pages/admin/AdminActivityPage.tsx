import { useState } from "react";
import { ScrollText } from "lucide-react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminPagination } from "../../components/admin/AdminPagination";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { useAdminActivityLogs } from "../../hooks/admin";

function formatAction(action: string) {
  return action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export function AdminActivityPage() {
  const [page, setPage] = useState(1);
  const logsQuery = useAdminActivityLogs(page, 20);

  return (
    <AdminLayout>
      <AdminPageHeader title="Activity log" />
      <p className="mb-6 text-sm text-muted-foreground">
        Full audit trail of actions across the platform.
      </p>

      {logsQuery.isLoading ? (
        <LoadingState message="Loading activity logs..." />
      ) : logsQuery.isError ? (
        <ErrorState message="Failed to load activity logs." onRetry={() => logsQuery.refetch()} />
      ) : !logsQuery.data?.items.length ? (
        <EmptyState
          icon={ScrollText}
          title="No activity yet"
          description="System actions will appear here as users and admins interact with the store."
        />
      ) : (
        <>
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-border bg-muted/80">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Action</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Actor</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Entity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logsQuery.data.items.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/40">
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary dark:bg-primary/15 dark:text-blue-300">
                          {formatAction(log.action)}
                        </span>
                      </td>
                      <td className="max-w-md px-4 py-3 text-foreground/80">{log.description}</td>
                      <td className="px-4 py-3 text-foreground/70">
                        {log.actorEmail ?? "System"}
                        {log.actorRole ? (
                          <span className="ml-1 text-xs text-muted-foreground">({log.actorRole})</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {log.entityType ? `${log.entityType}` : "—"}
                        {log.entityId ? (
                          <span className="block truncate text-xs text-muted-foreground/80">
                            {log.entityId}
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <AdminPagination
            page={page}
            totalPages={logsQuery.data.meta.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </AdminLayout>
  );
}
