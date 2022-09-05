"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetMe = exports.rememberMe = exports.parseMessage = void 0;
const firebase_1 = require("../config/firebase");
const firebase_admin_1 = require("firebase-admin");
var Timestamp = firebase_admin_1.firestore.Timestamp;
const collection = "twilio-remember-me";
const parseMessage = async function (req) {
    const text = req.body.Body;
    const firstWord = text.substring(0, text.indexOf(" ")).trim();
    // lookup remembered values
    const doc = firebase_1.db.collection(collection).doc(req.body.From);
    const remembered = (await doc.get()).data() || {};
    // no @ so assume whole message and try to use request/remembered values
    const at = firstWord.indexOf("@");
    if (at < 0) {
        return {
            author: (req.params.author || remembered.author),
            feedId: (req.params.feedId || remembered.feedId),
            message: text,
        };
    }
    // parse the message in the form of 'author@feedId The message'
    const author = firstWord.substring(0, at);
    const feedId = firstWord.substring(at + 1);
    const message = text.substring(text.indexOf(" ")).trim();
    return {
        author: (author || req.params.author || remembered.author || req.body.From),
        feedId: feedId,
        message: message,
    };
};
exports.parseMessage = parseMessage;
const rememberMe = async function (from, feedId, author) {
    const doc = firebase_1.db.collection(collection).doc(from);
    const existing = (await doc.get()).data() || {};
    if (existing.feedId != feedId || existing.author != author) {
        await doc.set({
            id: from,
            feedId: feedId,
            author: author,
            updated_at: Timestamp.now(),
        });
        return true;
    }
    return false;
};
exports.rememberMe = rememberMe;
const forgetMe = async function (from) {
    const doc = firebase_1.db.collection(collection).doc(from);
    await doc.delete();
};
exports.forgetMe = forgetMe;
//# sourceMappingURL=twilioService.js.map