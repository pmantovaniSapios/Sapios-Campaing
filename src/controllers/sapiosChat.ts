import { Request, Response } from "express";
import { stringify } from "querystring";
import Lookups from "twilio/lib/rest/Lookups";
import { pool } from "../../config/db"
import Logger from "../../config/logger";

export async function saveReturnDataSC(req: Request, res: Response) {
    let coon;
    try {

        coon = await pool.getConnection()

        const data = req.body;
        let tag = data.tags;
        let phone = data.visitor.phone[0].phoneNumber;
        let _id = data._id;

        stringify(tag).replace(/[\[\]']+/g, '')
        Logger.info(tag)

        if (tag == "" || phone == "") {
            Logger.error(`Error: ${_id} sent user without tag`);
            await coon.query(`
                    UPDATE datacampaings SET
                        transbordo="${_id}",
                        lastupdate=NOW()
                    WHERE
                        phone = "${phone}"
            `)
        } else {
            await coon.query(`
                    UPDATE datacampaings SET 
                        finishedStatus="${tag}",
                        transbordo="${_id}",
                        lastupdate= NOW()
                    WHERE
                        phone = "${phone}"
            `)
        }

        res.end()

    } catch (error) {
        Logger.error(error);
    } finally {
        if (coon) coon.release();
    }
}