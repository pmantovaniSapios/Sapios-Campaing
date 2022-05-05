"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const twilioReturn_1 = require("../controllers/twilioReturn");
const sapiosChat_1 = require("../controllers/sapiosChat");
const updateEngage_1 = require("../controllers/updateEngage");
const router = (0, express_1.Router)();
exports.default = router
    .post("/twilio", twilioReturn_1.saveReturnDataTwilio)
    .post("/tags", sapiosChat_1.saveReturnDataSC)
    .post("/engaged", updateEngage_1.saveEngaged);
//# sourceMappingURL=router.js.map