import type { Request, Response } from "express";
import { AdminDashboardService } from "../services/admin-dashboard.service";

export class AdminDashboardController {
  static async stats(_req: Request, res: Response) {
    const stats = await AdminDashboardService.getStats();
    return res.json({ stats });
  }

  static async recentOrders(_req: Request, res: Response) {
    const orders = await AdminDashboardService.getRecentOrders(10);
    return res.json({ orders });
  }
}
