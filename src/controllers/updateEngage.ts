import { Request, Response } from "express";
import { pool } from "../../config/db"
import Logger from "../../config/logger";

export async function saveEngaged(req: Request, res: Response) {
    let coon;
    try {
        const data = req.body;
        Logger.info(data);

        coon = await pool.getConnection();

        await coon.query(`
                UPDATE datacampaings SET
                    engaged="${data.engaged}",
                    lastupdate=NOW()
                WHERE
                    phone = "${data.phone}"
        `);

        res.end();

    } catch (error) {
        Logger.error(error);
    } finally {
        if (coon) coon.release();
    }
}