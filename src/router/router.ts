import { Router } from "express";
import { saveReturnDataTwilio } from "../controllers/twilioReturn";
import { saveReturnDataSC } from "../controllers/sapiosChat";
import { saveEngaged } from "../controllers/updateEngage";
const router = Router();

export default router
    .post("/twilio", saveReturnDataTwilio)
    .post("/tags", saveReturnDataSC)
    .post("/engaged", saveEngaged)