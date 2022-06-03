import { Request, Response } from "express";
import { pool } from "../../config/db";
import Logger from "../../config/logger";

export async function returnDataFromPhone(req: Request, res: Response) {
    let coon;
    try {
        let phone: any = req.params.phone;
        coon = await pool.getConnection();

        if (phone.length === 11) {
            let rows = await coon.query(`SELECT * FROM datacampaings WHERE phone = ${phone}`);
            delete rows.meta;
            console.log(rows);

            if (rows.length) {
                return res.status(200).json({ "return": true, "data": rows[0] });
            } else {
                return res.status(200).json({ "return": false, "error": "Information not found" });
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