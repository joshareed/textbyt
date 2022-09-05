import * as functions from "firebase-functions";
import * as express from "express";
import * as textbytV1 from "./v1/textbytController";
import * as twilioV1 from "./v1/twilioController";

const app = express();
app.get("/v1", textbytV1.whoami);
app.post("/v1", textbytV1.newFeed);
app.post("/v1/twilio/:feedId?/:author?", twilioV1.handleSms);
app.get("/v1/:feedId", textbytV1.getFeed);
app.post("/v1/:feedId", textbytV1.setFeed);

exports.textbyt = functions.https.onRequest(app);
