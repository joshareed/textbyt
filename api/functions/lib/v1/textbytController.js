"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFeed = exports.getFeed = exports.newFeed = exports.whoami = void 0;
const textbyt = require("./textbytService");
const firebase_admin_1 = require("firebase-admin");
var Timestamp = firebase_admin_1.firestore.Timestamp;
const whoami = async (req, res) => {
    return res.status(200)
        .json({
        name: "textbyt/v1",
        version: "0.0.1",
    });
};
exports.whoami = whoami;
const newFeed = async (req, res) => {
    const feed = await textbyt.newFeed();
    return res.status(200)
        .json(payload(feed.id, feed));
};
exports.newFeed = newFeed;
const getFeed = async (req, res) => {
    const { feedId } = req.params;
    const feed = await textbyt.getFeed(feedId);
    if (Object.keys(feed).length == 0) {
        // invalid feed
        return res.status(404)
            .json(notFound(feedId));
    }
    else {
        return res.status(200)
            .json(payload(feedId, feed));
    }
};
exports.getFeed = getFeed;
const setFeed = async (req, res) => {
    const { feedId } = req.params;
    const { author, message } = req.body;
    const feed = await textbyt.getFeed(feedId);
    if (Object.keys(feed).length == 0) {
        // invalid feed
        return res.status(404)
            .json(notFound(feedId));
    }
    else {
        const update = await textbyt.setFeed(feedId, author, message);
        return res.status(200)
            .json(payload(feedId, update));
    }
};
exports.setFeed = setFeed;
const notFound = function (id) {
    return {
        error: true,
        message: "Invalid feed '" + id + "'",
    };
};
const payload = function (id, doc) {
    const feed = doc;
    return {
        id: feed.id,
        author: feed.author || "unknown",
        message: feed.message || "",
        updated_at: (feed.updated_at || Timestamp.now()).toDate(),
    };
};
//# sourceMappingURL=textbytController.js.map