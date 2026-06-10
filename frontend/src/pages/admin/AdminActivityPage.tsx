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
      <p className="mb-6 text-sm text-slate-600">Full audit trail of actions across the platform.</p>

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
                <thead className="border-b border-slate-100 bg-slate-50/80">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Action</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Description</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Actor</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Entity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logsQuery.data.items.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          {formatAction(log.action)}
                        </span>
                      </td>
                      <td className="max-w-md px-4 py-3 text-slate-700">{log.description}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {log.actorEmail ?? "System"}
                        {log.actorRole ? (
                          <span className="ml-1 text-xs text-slate-400">({log.actorRole})</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {log.entityType ? `${log.entityType}` : "—"}
                        {log.entityId ? (
                          <span className="block truncate text-xs text-slate-400">{log.entityId}</span>
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
