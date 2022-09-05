"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeed = exports.whoami = void 0;
const whoami = async (req, res) => {
    res.status(200)
        .json({
        name: "textbyt/v1",
        version: "0.0.1",
    });
};
exports.whoami = whoami;
const getFeed = async (req, res) => {
    const { feedId } = req.params;
    res.status(200)
        .json({
        id: feedId,
        author: "admin",
        message: "Test message",
        updated_at: new Date(),
    });
};
exports.getFeed = getFeed;
//# sourceMappingURL=textbytController.js.map