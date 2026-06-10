import type { Request, Response } from "express";

import { z } from "zod";

import { OrdersService } from "../services/orders.service";

import { ActivityLogService } from "../services/activity-log.service";

import { activityActorFromRequest } from "../utils/request-context";



const emptyMsg = "This field is required";



const checkoutSchema = z.object({

  paymentMethod: z.string({ error: emptyMsg }).trim().min(1, emptyMsg),

  shippingAddress: z.string({ error: emptyMsg }).trim().min(1, emptyMsg)

});



const statusSchema = z.object({

  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),

  adminMessage: z.string().trim().max(1000).optional()

});



const idParamSchema = z.object({

  id: z.string().uuid("Invalid id")

});



export class OrdersController {

  static async checkout(req: Request, res: Response) {

    const b = checkoutSchema.safeParse(req.body);

    if (!b.success) return res.status(400).json({ message: "Validation error", errors: b.error.flatten().fieldErrors });



    const result = await OrdersService.checkoutFromCart({

      userId: req.user!.id,

      paymentMethod: b.data.paymentMethod,

      shippingAddress: b.data.shippingAddress

    });



    if (!result.ok) return res.status(400).json({ message: result.message });



    await ActivityLogService.record(

      "ORDER_CREATED",

      `Order placed — total $${result.order.totalPrice}`,

      activityActorFromRequest(req),

      {

        entityType: "Order",

        entityId: result.order.id,

        metadata: { totalPrice: result.order.totalPrice, paymentMethod: b.data.paymentMethod }

      }

    );



    return res.status(201).json({ order: result.order });

  }



  static async myOrders(req: Request, res: Response) {

    const orders = await OrdersService.myOrders(req.user!.id);

    return res.json({ orders });

  }



  static async all(_req: Request, res: Response) {

    const orders = await OrdersService.allOrders();

    return res.json({ orders });

  }



  static async updateStatus(req: Request, res: Response) {

    const p = idParamSchema.safeParse(req.params);

    if (!p.success) return res.status(400).json({ message: "Validation error", errors: p.error.flatten().fieldErrors });

    const b = statusSchema.safeParse(req.body);

    if (!b.success) return res.status(400).json({ message: "Validation error", errors: b.error.flatten().fieldErrors });



    try {

      const order = await OrdersService.updateStatus(p.data.id, b.data.status, b.data.adminMessage);



      await ActivityLogService.record(

        "ORDER_STATUS_UPDATED",

        `Order status changed to ${b.data.status}`,

        activityActorFromRequest(req),

        {

          entityType: "Order",

          entityId: order.id,

          metadata: { status: b.data.status, adminMessage: b.data.adminMessage ?? null }

        }

      );



      return res.json({ order });

    } catch {

      return res.status(404).json({ message: "Order not found" });

    }

  }

}

