import * as csv from '@fast-csv/parse';
import { pool } from "../../config/db";
import fs from "fs";

export async function csvToJsonAndUpload(filepath: any) {
    let stream = fs.createReadStream(filepath);
    let csvData: Array<any> = [];
    let csvStream = csv
        .parse({ headers: true })
        .transform(
            (data: any) => ({
                id: data.id,
                nome: data.nome,
                phone: data.phone,
                field01: data.field01,
                field02: data.field02,
                field03: data.field03,
                field04: data.field04,
                field05: data.field05,
                field06: data.field06,
                field07: data.field07,
                field08: data.field08,
                field09: data.field09,
                field10: data.field10,
                field11: data.field11,
                field12: data.field12,
                field13: data.field13,
                field14: data.field14,
                field15: data.field15,
                field16: data.field16,
                field17: data.field17,
                field18: data.field18,
                field19: data.field19,
                field20: data.field20,
            })
        )
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", async function () {
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
                                            field20="${csvData[index].field20}"
                            `).then((res: any) => {
                            // TODO- Adicionando cada mudança em um array para retornar depois
                            // LOG - console.log(`affectedRows: ${res.affectedRows}, insertId: ${res.insertId}, warningStatus: ${res.warningStatus}`); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
                            console.log(res);
                            conn.end();
                        })
                            .catch(err => {
                                // TODO - Tratar o erro na query e retornar
                                // LOG - console.log("Caiu Aqui: " + err);
                                console.log(err);
                                conn.end();
                            })
                    }
                    // TODO - Retornar o Array com todas alterações
                }).catch((err: any) => {
                    // TODO - Retornar problema de conexão com o DB
                    // LOG - console.error("Erro de Conexão com o DB: " + err);
                    console.log(err);
                    
                });
            fs.unlinkSync(filepath)
        });
    stream.pipe(csvStream);
}