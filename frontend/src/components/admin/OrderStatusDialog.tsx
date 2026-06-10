import { useEffect, useState } from "react";
import { AdminDialog } from "./AdminDialog";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { Badge, orderStatusVariant } from "../ui/Badge";
import type { Order } from "../../hooks/orders";

export function OrderStatusDialog({
  open,
  order,
  nextStatus,
  onClose,
  onConfirm,
  isPending
}: {
  open: boolean;
  order: { id: string; status: Order["status"]; user?: { firstName: string; lastName: string } } | null;
  nextStatus: Order["status"] | null;
  onClose: () => void;
  onConfirm: (adminMessage: string) => void;
  isPending?: boolean;
}) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open) setMessage("");
  }, [open, nextStatus, order?.id]);

  if (!order || !nextStatus) return null;

  const isReject = nextStatus === "CANCELLED";

  return (
    <AdminDialog
      open={open}
      onClose={onClose}
      title={isReject ? "Reject order" : "Update order status"}
      description={
        order.user
          ? `Order for ${order.user.firstName} ${order.user.lastName} · #${order.id.slice(0, 8)}`
          : `Order #${order.id.slice(0, 8)}`
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant={isReject ? "danger" : "primary"}
            disabled={isPending || message.trim().length < 3}
            onClick={() => onConfirm(message.trim())}
          >
            {isReject ? "Confirm rejection" : "Confirm update"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={orderStatusVariant(order.status)}>{order.status}</Badge>
          <span className="text-slate-400">→</span>
          <Badge variant={orderStatusVariant(nextStatus)}>{nextStatus}</Badge>
        </div>

        <Textarea
          label="Message to customer"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            isReject
              ? "Explain why the order was rejected (e.g. item unavailable, address issue)..."
              : "Let the customer know what happens next (e.g. order approved, shipping soon)..."
          }
        />
        <p className="text-xs text-slate-500">
          This message will be visible to the customer on their orders page.
        </p>
      </div>
    </AdminDialog>
  );
}
