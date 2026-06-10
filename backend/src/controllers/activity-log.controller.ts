import type { Request, Response } from "express";
import { ActivityLogService } from "../services/activity-log.service";

export class ActivityLogController {
  static async list(req: Request, res: Response) {
    const parsed = ActivityLogService.parseListQuery(req.query);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten().fieldErrors });
    }

    const result = await ActivityLogService.list(parsed.data);
    return res.json(result);
  }
}
