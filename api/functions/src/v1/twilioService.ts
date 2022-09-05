import {db} from "../config/firebase";
import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;

type Message = {
  author?: string,
  feedId?: string,
  message: string,
}

type TwilioRequest = {
  body: { Body: string, From: string },
  params: { feedId: string, author: string }
}

const collection = "twilio-remember-me";

const parseMessage = async function(req: TwilioRequest) {
  const text = req.body.Body;
  const firstWord = text.substring(0, text.indexOf(" ")).trim();

  // lookup remembered values
  const doc = db.collection(collection).doc(req.body.From);
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

const rememberMe = async function(
    from: string,
    feedId?: string,
    author?: string) {
  const doc = db.collection(collection).doc(from);
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

const forgetMe = async function(from: string) {
  const doc = db.collection(collection).doc(from);
  await doc.delete();
};

export {parseMessage, rememberMe, forgetMe, TwilioRequest, Message};
