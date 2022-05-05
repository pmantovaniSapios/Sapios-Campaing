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
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveReturnDataTwilio = void 0;
const db_1 = require("../../config/db");
function saveReturnDataTwilio(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let coon;
        try {
            const data = req.body;
            coon = yield db_1.pool.getConnection();
            yield coon.query(`
                UPDATE datacampaings SET 
                    statusSend="${data.MessageStatus}",
                    errorCode="${data.errorCode}",
                    errorMessage="${data.errorMessage}",
                    price="${data.price}",
                    priceUnit="${data.priceUnit}",
                    lastupdate= NOW()
                WHERE
                    sid = "${data.SmsSid}"
        `);
            res.end();
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
exports.saveReturnDataTwilio = saveReturnDataTwilio;
//# sourceMappingURL=twilioReturn.js.map