import { Request, Response } from "express";
import { pool } from "../../config/db"

export async function onOffGetValue(req: Request, res: Response) {
    let coon;
    try {
        coon = await pool.getConnection();

        let result = await coon.query(`
            SELECT completo FROM 
                campaings 
            WHERE id = "1"
        `);

        delete result.meta

        return res.send({ service: true, active: result[0].completo })
    } catch (error) {

    } finally {
        if (coon) coon.release();
    }
}