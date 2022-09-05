import {db} from "../config/firebase";
import {
  animals,
  colors,
  NumberDictionary,
  uniqueNamesGenerator,
} from "unique-names-generator";
import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;

const collection = "textbyt-v1";

const feedName = function() {
  return uniqueNamesGenerator({
    dictionaries: [colors, animals, NumberDictionary.generate({
      min: 100,
      max: 999,
    })],
    length: 3,
    separator: "",
    style: "capital",
  });
};

const newFeed = async function() {
  // find a feed that doesn't exist
  let feedId = feedName();
  let feed = await getFeed(feedId);
  while (Object.keys(feed).length > 0) {
    feedId = feedName();
    feed = await getFeed(feedId);
  }

  // generate our new feed document
  return setFeed(
      feedId,
      "textbyt",
      ("New feed '" + feedId + "' created!")
  );
};

const getFeed = async (id: string) => {
  const doc = db.collection(collection).doc(id);
  return (await doc.get()).data() || {};
};

const setFeed = async (id: string, author: string, message: string) => {
  const doc = db.collection(collection).doc(id);
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

export {feedName, newFeed, getFeed, setFeed};
