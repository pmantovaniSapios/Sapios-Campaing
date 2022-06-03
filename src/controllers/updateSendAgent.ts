import { Request, Response } from "express";
import { pool } from "../../config/db";
import Logger from "../../config/logger";

export async function updateSendAgent(req: Request, res: Response) {
    let coon;
    try {
        let { phone, sendtoagent }: any = req.body;
        coon = await pool.getConnection();

        if (phone.length === 11) {
            // let rows = await coon.query(`SELECT * FROM datacampaings WHERE phone = ${phone}`);
            let rows = await coon.query(`UPDATE datacampaings SET sendToAgent="${sendtoagent}", lastupdate=NOW() WHERE phone = "${phone}"`);
            
            if (rows.affectedRows === 1) {
                return res.status(200).json({ "return": true });
            } else {
                return res.status(200).json({ "return": false, "error": "Problems to update" });
            }
        } else {
            return res.status(200).json({ "return": false, "error": "Unexpected phone" })
        }
    } catch (error: any) {
        Logger.error(error);
        return res.status(200).json({ "return": false });
    } finally {
        if (coon) coon.release();
    }
}