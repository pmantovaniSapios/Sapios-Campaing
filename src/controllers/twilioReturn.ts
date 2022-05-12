import { Request, Response } from "express";
import { pool } from "../../config/db"

export async function saveReturnDataTwilio(req: Request, res: Response) {
    let coon;
    try {
        const data = req.body;
        console.log(data);

        coon = await pool.getConnection()

        await coon.query(`
                UPDATE datacampaings SET 
                    statusSend="${data.MessageStatus}",
                    errorCode="${data.ErrorCode}",
                    errorMessage="${data.ErrorMessage}",
                    price="${data.price}",
                    priceUnit="${data.priceUnit}",
                    lastupdate= NOW()
                WHERE
                    sid = "${data.SmsSid}"
        `)

        res.end()
    } catch (error) {
        console.log(error)
    } finally {
        if (coon) coon.release();
    }

}