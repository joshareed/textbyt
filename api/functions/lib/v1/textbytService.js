"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFeed = exports.getFeed = exports.newFeed = exports.feedName = void 0;
const firebase_1 = require("../config/firebase");
const unique_names_generator_1 = require("unique-names-generator");
const firebase_admin_1 = require("firebase-admin");
var Timestamp = firebase_admin_1.firestore.Timestamp;
const collection = "textbyt-v1";
const feedName = function () {
    return (0, unique_names_generator_1.uniqueNamesGenerator)({
        dictionaries: [unique_names_generator_1.colors, unique_names_generator_1.animals, unique_names_generator_1.NumberDictionary.generate({
                min: 100,
                max: 999,
            })],
        length: 3,
        separator: "",
        style: "capital",
    });
};
exports.feedName = feedName;
const newFeed = async function () {
    // find a feed that doesn't exist
    let feedId = feedName();
    let feed = await getFeed(feedId);
    while (Object.keys(feed).length > 0) {
        feedId = feedName();
        feed = await getFeed(feedId);
    }
    // generate our new feed document
    return setFeed(feedId, "textbyt", ("New feed '" + feedId + "' created!"));
};
exports.newFeed = newFeed;
const getFeed = async (id) => {
    const doc = firebase_1.db.collection(collection).doc(id);
    return (await doc.get()).data() || {};
};
exports.getFeed = getFeed;
const setFeed = async (id, author, message) => {
    const doc = firebase_1.db.collection(collection).doc(id);
    const data = {
        id,
        author,
        message,
        updated_at: Timestamp.now(),
    };
    return doc.set(data)
        .then(() => {
        return data;
    });
};
exports.setFeed = setFeed;
//# sourceMappingURL=textbytService.js.map