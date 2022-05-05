"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require("dotenv").config();
const mariadb = require('mariadb');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
let twilioclient = require('twilio')(accountSid, authToken);
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sapios',
    database: 'campaing',
    port: 3306,
    connectionLimit: 5
});
function result() {
    return __awaiter(this, void 0, void 0, function* () {
        let coon;
        try {
            coon = yield pool.getConnection();
            // Para alterar a quantidade de envio mude o LIMIT da query abaixo
            let dados = yield coon.query(`SELECT nome, phone FROM datacampaings where sent = 0 LIMIT 3`);
            delete dados.meta;
            // console.log(dados)
            dados.map((x) => {
                let twilioSendMessage = {
                    from: "whatsapp:+5511933058090",
                    body: `Olá ${x.nome}, sou o atendente virtual da Hapvida, prazer! 

            Vi que você solicitou o cancelamento do seu plano e gostaria de te encaminhar para um dos nossos consultores te apresentar uma proposta exclusiva baseada no seu perfil, quer conhecer? `,
                    to: `whatsapp:+55${x.phone}`
                };
                twilioclient.messages
                    .create(twilioSendMessage)
                    .then((message) => {
                    let data = new Date();
                    let dia = String(data.getDate()).padStart(2, '0');
                    let mes = String(data.getMonth() + 1).padStart(2, '0');
                    let ano = data.getFullYear();
                    let hora = String(data.getHours()).padStart(2, '0');
                    let minuto = String(data.getMinutes()).padStart(2, '0');
                    let dataAtual = `${dia}-${mes}-${ano} ${hora}:${minuto}`;
                    try {
                        console.log(message);
                        coon.query(`UPDATE datacampaings SET sent=true, sid="${message.sid}", statusSend="${message.status}", dateSent="${dataAtual}", errorCode="${message.errorCode}", errorMessage="${message.errorMessage}", price="${message.price}", priceUnit="${message.priceUnit}", lastupdate=NOW() WHERE phone = "${x.phone}"`);
                    }
                    catch (error) {
                        console.error(error);
                    }
                }).catch((err) => {
                    console.error("error " + err);
                })
                    .done();
            });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            if (coon)
                coon.release();
        }
    });
}
setInterval(() => {
    let data = new Date();
    console.log("Reiniciando " + data);
    result();
}, 180000);
// Para mudar o tempo de envio mude o tempo do setInterval acima. (lembre de colocar em milesegundos)
//# sourceMappingURL=senderTwilio.js.map