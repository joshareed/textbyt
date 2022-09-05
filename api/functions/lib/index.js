"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express = require("express");
const textbytV1 = require("./v1/textbytController");
const twilioV1 = require("./v1/twilioController");
const app = express();
app.get("/v1", textbytV1.whoami);
app.post("/v1", textbytV1.newFeed);
app.post("/v1/twilio/:feedId?/:author?", twilioV1.handleSms);
app.get("/v1/:feedId", textbytV1.getFeed);
app.post("/v1/:feedId", textbytV1.setFeed);
exports.textbyt = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map