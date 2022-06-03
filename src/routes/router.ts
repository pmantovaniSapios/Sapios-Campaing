import { Router } from "express";
import { saveReturnDataTwilio } from "../controllers/twilioReturn";
import { saveReturnDataSC } from "../controllers/sapiosChat";
import { saveEngaged } from "../controllers/updateEngage";
import { onOffSender } from "../controllers/onOffSender";
import { quantPerShip } from "../controllers/quantPerShip";
import { onOffGetValue } from "../controllers/onOffGetValue";
import { returnDataFromPhone } from "../controllers/returnDataFromPhone";
import { dataFromCSV } from "../controllers/dataFromCSV";
import { updateSendAgent } from "../controllers/updateSendAgent";
const router = Router();

export default router
    .post("/webhook/twilio", saveReturnDataTwilio)
    .post("/webhook/tags", saveReturnDataSC)
    .post("/webhook/engaged", saveEngaged)
    .post("/onOff", onOffSender)
    .post("/quantPerShip", quantPerShip)
    .get("/onOff", onOffGetValue)
    .get("/info/:phone", returnDataFromPhone)
    .post("/datafromcsv", dataFromCSV)
    .post("/updateSendAgent", updateSendAgent)