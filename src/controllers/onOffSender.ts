import { Request, Response } from "express";
import { pool } from "../../config/db"
import Logger from "../../config/logger";

export async function onOffSender(req: Request, res: Response) {
    let coon;
    try {
        const data = req.body;

        coon = await pool.getConnection();

        if (typeof data.onOff === 'number' && data.onOff === 1) {
            await coon.query(`
            UPDATE campaings SET
                completo = ${data.onOff}
            WHERE id = "1"
        `);
            res.send({ "error": false, "message": "Capanha retomada" });
        } else if (typeof data.onOff === 'number' && data.onOff === 0) {
            await coon.query(`
            UPDATE campaings SET
                completo = ${data.onOff}
            WHERE id = "1"
        `);
            return res.send({ "error": false, "message": "Campanha pausada" });
        } else {
            return res.send({ "error": true, "message": "Informações cedidas não batem com o sistema" });
        }
    } catch (error) {
        Logger.error(error)
    } finally {
        if (coon) coon.release();
    }
}