var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
require("dotenv").config();
var mariadb = require('mariadb');
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var twilioclient = require('twilio')(accountSid, authToken);
var pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sapios',
    database: 'campaing',
    port: 3306,
    connectionLimit: 5
});
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var coon, onOff, parametros, dados, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, 10, 11]);
                    return [4 /*yield*/, pool.getConnection()];
                case 1:
                    coon = _a.sent();
                    return [4 /*yield*/, coon.query("SELECT completo FROM campaings where id = 1")];
                case 2:
                    onOff = _a.sent();
                    delete onOff.meta;
                    if (!(onOff[0].completo === 0)) return [3 /*break*/, 3];
                    console.log("Serviço desligado");
                    return [3 /*break*/, 8];
                case 3: return [4 /*yield*/, coon.query("SELECT quantidadePorEnvio FROM parameters where id = 1")];
                case 4:
                    parametros = _a.sent();
                    delete parametros.meta;
                    console.log(parametros[0].quantidadePorEnvio);
                    return [4 /*yield*/, coon.query("SELECT nome, phone FROM datacampaings where sent = 0 LIMIT ".concat(parametros[0].quantidadePorEnvio))];
                case 5:
                    dados = _a.sent();
                    delete dados.meta;
                    console.log(dados);
                    if (!(dados.length === 0)) return [3 /*break*/, 6];
                    console.log("Todos dados já foram enviados");
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, dados.map(function (x) {
                        var twilioSendMessage = {
                            from: "whatsapp:+5511933058090",
                            body: "Telesul: houve um ".concat(x.nome, " no processamento de seus dados: ").concat(x.phone),
                            to: "whatsapp:+55".concat(x.phone)
                        };
                        twilioclient.messages
                            .create(twilioSendMessage)
                            .then(function (message) {
                            var data = new Date();
                            var dia = String(data.getDate()).padStart(2, '0');
                            var mes = String(data.getMonth() + 1).padStart(2, '0');
                            var ano = data.getFullYear();
                            var hora = String(data.getHours()).padStart(2, '0');
                            var minuto = String(data.getMinutes()).padStart(2, '0');
                            var dataAtual = "".concat(dia, "-").concat(mes, "-").concat(ano, " ").concat(hora, ":").concat(minuto);
                            try {
                                console.log(message);
                                coon.query("UPDATE datacampaings SET campaingsId=1, sent=true, sid=\"".concat(message.sid, "\", statusSend=\"").concat(message.status, "\", dateSent=\"").concat(dataAtual, "\", errorCode=\"").concat(message.ErrorCode, "\", errorMessage=\"").concat(message.ErrorMessage, "\", price=\"").concat(message.price, "\", priceUnit=\"").concat(message.priceUnit, "\", lastupdate=NOW() WHERE phone = \"").concat(x.phone, "\""));
                            }
                            catch (error) {
                                console.error(error);
                            }
                        })["catch"](function (err) {
                            console.error("error " + err);
                        })
                            .done();
                    })];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [3 /*break*/, 11];
                case 9:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 11];
                case 10:
                    if (coon)
                        coon.release();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
setInterval(function () {
    var data = new Date();
    console.log("Reiniciando " + data);
    main();
}, 1000);
// Para mudar o tempo de envio mude o tempo do setInterval acima. (lembre de colocar em milesegundos) 60000
// result()
