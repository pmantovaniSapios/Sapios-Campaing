require("dotenv").config();
const mariadb = require('mariadb');
const winston = require('winston');

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
}
const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white"
}
winston.addColors(colors)

const format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info: any) => `${info.timestamp} - ${info.level} : ${info.message}`
    )
);

let today = new Date();
let date = today.getFullYear()+'-'+(today.getMonth()+1);

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `./src/logs/campaing_info_${date}.log` }),
    new winston.transports.File({
        filename: `./src/logs/campaing_error_${date}.log`,
        level: "error"
    })
];

const Logger = winston.createLogger({
    levels,
    format,
    transports
});

const pool = mariadb.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE, connectionLimit: 5});
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const interval: any = process.env.INTERVAL_CALL_SENDER

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

            let dados = await coon.query(`SELECT campaingsId, nome, phone FROM datacampaings where sent = 0 LIMIT ${parametros[0].quantidadePorEnvio}`);
            delete dados.meta;
            console.log(dados)

            if (dados.length === 0) {
                console.log("Todos dados já foram enviados");
            } else {
                await dados.map((x: any) => {
                    let twilioSendMessage = {
                        from: process.env.TWILIO_PHONE,
                        body: `Olá ${x.nome}, sou o atendente virtual da Hapvida, prazer! 

                        Vi que você solicitou o cancelamento do seu plano e gostaria de te encaminhar para um dos nossos consultores te apresentar uma proposta exclusiva baseada no seu perfil, quer conhecer?`,
                        to: `whatsapp:+55${x.phone}`
                    };

                    twilioclient.messages
                        .create(twilioSendMessage)
                        .then((message: any) => {
                            try {
                                Logger.info(message)
                                coon.query(`UPDATE datacampaings SET
                                                sent=true, 
                                                sid="${message.sid}", 
                                                statusSend="${message.status}", 
                                                dateSent=NOW(), 
                                                errorCode="${message.ErrorCode}", 
                                                errorMessage="${message.ErrorMessage}", 
                                                price="${message.price}", 
                                                priceUnit="${message.priceUnit}", 
                                                lastupdate=NOW() 
                                                    WHERE 
                                                phone = "${x.phone}" and sent=false`)
                            } catch (error) {
                                Logger.error(error)
                            }
                        }).catch((error: any) => {
                            Logger.error(error)
                        })
                        .done();
                });
            }
        }

    } catch (error) {
        Logger.log(error);
    } finally {
        if (coon) coon.release();
    }

}

setInterval(() => {
    main()
}, interval);