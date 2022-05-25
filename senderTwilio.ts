require("dotenv").config();
const mariadb = require('mariadb');
const pool = mariadb.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE, connectionLimit: 5});
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

let twilioclient = require('twilio')(accountSid, authToken);

async function main() {
    let coon: any;
    try {

        coon = await pool.getConnection()
        let onOff = await coon.query(`SELECT completo FROM campaings where id = 1`);
        delete onOff.meta;

        if (onOff[0].completo === 0) {
            console.log("Serviço desligado");
        } else {
            let parametros = await coon.query(`SELECT quantidadePorEnvio FROM parameters where id = 1`);
            delete parametros.meta;
            console.log(parametros[0].quantidadePorEnvio);

            let dados = await coon.query(`SELECT nome, phone FROM datacampaings where sent = 0 LIMIT ${parametros[0].quantidadePorEnvio}`);
            delete dados.meta;
            console.log(dados)

            if (dados.length === 0) {
                console.log("Todos dados já foram enviados");
            } else {
                await dados.map((x: any) => {
                    let twilioSendMessage = {
                        from: process.env.TWILIO_PHONE,
                        body: `Olá ${x.nome}, sou o atendente virtual da Hapvida, prazer! 

                        Vi que você solicitou o cancelamento do seu plano e gostaria de te encaminhar para um dos nossos consultores te apresentar uma proposta exclusiva baseada no seu perfil, quer conhecer? `,
                        to: `whatsapp:+55${x.phone}`
                    };

                    twilioclient.messages
                        .create(twilioSendMessage)
                        .then((message: any) => {
                            let data = new Date();
                            let dia = String(data.getDate()).padStart(2, '0');
                            let mes = String(data.getMonth() + 1).padStart(2, '0');
                            let ano = data.getFullYear();
                            let hora = String(data.getHours()).padStart(2, '0');
                            let minuto = String(data.getMinutes()).padStart(2, '0');
                            let dataAtual = `${dia}-${mes}-${ano} ${hora}:${minuto}`;
                            try {
                                console.log(message);
                                coon.query(`UPDATE datacampaings SET campaingsId=1, sent=true, sid="${message.sid}", statusSend="${message.status}", dateSent="${dataAtual}", errorCode="${message.ErrorCode}", errorMessage="${message.ErrorMessage}", price="${message.price}", priceUnit="${message.priceUnit}", lastupdate=NOW() WHERE phone = "${x.phone}"`)
                            } catch (error) {
                                console.error(error)
                            }
                        }).catch((err: any) => {
                            console.error("error " + err);
                        })
                        .done();
                });
            }
        }


    } catch (error) {
        console.log(error);
    } finally {
        if (coon) coon.release();
    }

}



setInterval(() => {
    let data = new Date()
    console.log("Reiniciando " + data);
    main()
}, 60000);
// Para mudar o tempo de envio mude o tempo do setInterval acima. (lembre de colocar em milesegundos) 60000
// result()