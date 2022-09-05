import {Response} from "express";
import * as textbyt from "./textbytService";
import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;

type Feed = {
  id: string,
  author: string,
  message: string,
  updated_at: Timestamp
}

type Request = {
  body: Feed,
  params: { feedId: string }
}

const whoami = async (req: Request, res: Response) => {
  return res.status(200)
      .json({
        name: "textbyt/v1",
        version: "0.0.1",
      });
};

const newFeed = async (req: Request, res: Response) => {
  const feed = await textbyt.newFeed();
  return res.status(200)
      .json(payload(feed.id, feed));
};

const getFeed = async (req: Request, res: Response) => {
  const {feedId} = req.params;
  const feed = await textbyt.getFeed(feedId);

  if (Object.keys(feed).length == 0) {
    // invalid feed
    return res.status(404)
        .json(notFound(feedId));
  } else {
    return res.status(200)
        .json(payload(feedId, feed));
  }
};

const setFeed = async (req: Request, res: Response) => {
  const {feedId} = req.params;
  const {author, message} = req.body;

  const feed = await textbyt.getFeed(feedId);

  if (Object.keys(feed).length == 0) {
    // invalid feed
    return res.status(404)
        .json(notFound(feedId));
  } else {
    const update = await textbyt.setFeed(feedId, author, message);
    return res.status(200)
        .json(payload(feedId, update));
  }
};

const notFound = function(id: string) {
  return {
    error: true,
    message: "Invalid feed '" + id + "'",
  };
};

const payload = function(id: string, doc: any) {
  const feed: Feed = doc;
  return {
    id: feed.id,
    author: feed.author || "unknown",
    message: feed.message || "",
    updated_at: (feed.updated_at || Timestamp.now()).toDate(),
  };
};

export {whoami, newFeed, getFeed, setFeed};
