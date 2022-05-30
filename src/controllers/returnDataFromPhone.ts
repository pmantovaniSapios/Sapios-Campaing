import { Request, Response } from "express";
import { pool } from "../../config/db";
import Logger from "../../config/logger";

export async function returnDataFromPhone(req: Request, res: Response) {
    try {
        let phone = req.params.phone;

        if(phone.length === 11) {
            pool.getConnection()
                .then(conn => {
                    conn.query(`SELECT * FROM datacampaings WHERE phone = ${phone}`)
                        .then((rows) => {
                            delete rows.meta
                            return res.status(200).json({ "return": true, "data": rows[0] });
                        })
                        .catch(err => {
                            Logger.error(err);
                            conn.end();
                            return res.status(200).json({ "return": false, "error": "Information not found" })
                        })
                }).catch(err => {
                    Logger.error(err);
                    return res.status(200).json({ "return": false, "error": "Problem with database" })
                });
        } else {
            return res.status(200).json({ "return": false, "error": "Unexpected phone" })
        }
    } catch (error: any) {
        Logger.error(error);
        return res.status(200).json({ "return": false })
    }
}