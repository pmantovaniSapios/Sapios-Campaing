import { Request, Response } from "express";
import { pool } from "../../config/db";
import Logger from "../../config/logger";

export async function quantPerShip(req: Request, res: Response) {
    let coon;
    try {
        const data = req.body;

        coon = await pool.getConnection();

        if (typeof data.quantidadePorEnvio === 'number') {
            await coon.query(`
                    UPDATE parameters SET
                        quantidadePorEnvio = ${data.quantidadePorEnvio}
                    WHERE id = "1"
                `);
            return res.send({ "error": false, "message": "Quantidade alterada" });
        } else {
            return res.send({ "error": true, "message": "Apenas mande números no campo quantidadePorEnvio" });
        }

    } catch (error) {
        Logger.error(error);
    } finally {
        if (coon) coon.release();
    }
}