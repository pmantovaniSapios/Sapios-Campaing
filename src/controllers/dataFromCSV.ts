import { Request, Response } from "express";
import { pool } from "../../config/db";
import Logger from "../../config/logger";

export async function dataFromCSV(req: Request, res: Response) {
    let csvData = req.body;
    console.log(csvData);

    await pool.getConnection()
        .then(conn => {

            for (let index = 0; index < csvData.length; index++) {
                conn.query(`INSERT INTO datacampaings SET 
                                    campaingsId=1, 
                                    nome="${csvData[index].nome}", 
                                    phone="${csvData[index].phone}", 
                                    field01="${csvData[index].field01}", 
                                    field02="${csvData[index].field02}", 
                                    field03="${csvData[index].field03}", 
                                    field04="${csvData[index].field04}", 
                                    field05="${csvData[index].field05}",
                                    field06="${csvData[index].field06}",
                                    field07="${csvData[index].field07}",
                                    field08="${csvData[index].field08}",
                                    field09="${csvData[index].field09}",
                                    field10="${csvData[index].field10}",
                                    field11="${csvData[index].field11}",
                                    field12="${csvData[index].field12}",
                                    field13="${csvData[index].field13}",
                                    field14="${csvData[index].field14}",
                                    field15="${csvData[index].field15}",
                                    field16="${csvData[index].field16}",
                                    field17="${csvData[index].field17}",
                                    field18="${csvData[index].field18}",
                                    field19="${csvData[index].field19}",
                                    field20="${csvData[index].field20}"
                                        ON DUPLICATE KEY UPDATE 
                                            nome="${csvData[index].nome}", 
                                            phone="${csvData[index].phone}", 
                                            field01="${csvData[index].field01}", 
                                            field02="${csvData[index].field02}", 
                                            field03="${csvData[index].field03}", 
                                            field04="${csvData[index].field04}", 
                                            field05="${csvData[index].field05}",
                                            field06="${csvData[index].field06}", 
                                            field07="${csvData[index].field07}", 
                                            field08="${csvData[index].field08}", 
                                            field09="${csvData[index].field09}", 
                                            field10="${csvData[index].field10}",
                                            field11="${csvData[index].field11}", 
                                            field12="${csvData[index].field12}", 
                                            field13="${csvData[index].field13}", 
                                            field14="${csvData[index].field14}", 
                                            field15="${csvData[index].field15}",
                                            field16="${csvData[index].field16}", 
                                            field17="${csvData[index].field17}", 
                                            field18="${csvData[index].field18}", 
                                            field19="${csvData[index].field19}", 
                                            field20="${csvData[index].field20}"`)
                    .then((res: any) => {
                        conn.end();
                    })
                    .catch(err => {
                        Logger.error(err)
                        conn.end();
                    })
            }

        }).catch((err: any) => {
            Logger.error(err)
        });

    return { finished: true }
}