import { Request, Response } from "express";
import { stringify } from "querystring";
import { pool } from "../../config/db"

export async function saveReturnDataSC(req: Request, res: Response) {
    let coon;
    try {

        const data = req.body;
        let tag = data.tags;
        let phone = data.visitor.phone[0].phoneNumber;
        let _id = data._id;

        stringify(tag).replace(/[\[\]']+/g, '')

        coon = await pool.getConnection()

        await coon.query(`
                UPDATE datacampaings SET 
                    finishedStatus="${tag}",
                    transbordo="${_id}",
                    lastupdate= NOW()
                WHERE
                    phone = "${phone}"
        `)

        res.end()

    } catch (error) {
        console.log(error);
    } finally {
        if (coon) coon.release();
    }
}