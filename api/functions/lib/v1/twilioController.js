"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSms = void 0;
const textbytService = require("./textbytService");
const twilioService = require("./twilioService");
const twilioService_1 = require("./twilioService");
const MessagingResponse = require("twilio/lib/twiml/MessagingResponse");
const handleSms = async (req, res) => {
    const text = req.body.Body;
    if (!text) {
        // ignore empty texts
        return twiml(res);
    }
    // handle special `new` keyword
    if (text.trim().toLowerCase() == "new") {
        // create a new feed
        const feed = await textbytService.newFeed();
        return twiml(res, feed.message);
    }
    // handle special `forget` keyword
    if (text.trim().toLowerCase() == "forget") {
        await twilioService.forgetMe(req.body.From);
        return twiml(res, "Deleted saved data about '" + req.body.From + "'");
    }
    // treat it as a message
    const message = await twilioService.parseMessage(req);
    // validate that we got a feedId
    const feedId = message.feedId;
    if (!feedId) {
        return twiml(res, "Unable to send textbyt. Start your message " +
            "with the feed you want to send to e.g. '@SomeFeed123 Hello world!'");
    }
    // validate that it is a valid feed
    const feed = await textbytService.getFeed(feedId);
    if (Object.keys(feed).length == 0) {
        return twiml(res, "Unknown feed '" + feedId + "'");
    }
    // if we made it this far, deliver the message
    await textbytService.setFeed(feedId, (req.params.author || message.author || req.body.From), message.message);
    // save mapping
    const remembered = await (0, twilioService_1.rememberMe)(req.body.From, message.feedId, message.author);
    if (remembered) {
        return twiml(res, "Delivered to '" + message.feedId + "' as '" +
            message.author + "'! Remembering these settings so future texts from " +
            "this number will be delivered to this feed.");
    }
    else {
        return twiml(res, "Delivered to '" + message.feedId + "' as '" +
            message.author + "'!");
    }
};
exports.handleSms = handleSms;
const twiml = (res, message) => {
    const twiml = new MessagingResponse();
    if (message) {
        twiml.message(message);
    }
    return res.header("Content-Type", "text/xml")
        .status(200)
        .send(twiml.toString());
};
//# sourceMappingURL=twilioController.js.map