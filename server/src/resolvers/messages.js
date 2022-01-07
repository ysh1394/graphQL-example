import { v4 } from "uuid";
import { writeDB } from "../dbController.js";

const setMsgs = (data) => writeDB("messages", data);

/*
parent : parent 객체. 거의 사용 x
args: Query에 필요한 필드에 제공되는 인수(파라미터)
context: 로그인한 사용자. DB Access 등 중요한 정보들 (src/index.js 에 context 안에 models || db도 사용)
*/

const messageResolver = {
  Query: {
    messages: (parent, args, context) => {
      const { db } = context;
      // 콘솔 찍어보기 위해 구조분해 함
      console.log({ parent, args, context });
      return db.messages;
    },
    message: (parent, { id = "" }, { db }) => {
      return db.messages.find((msg) => msg.id === id);
    },
  },
  Mutation: {
    createMessage: (parent, { text, userId }, { db }) => {
      const newMsg = {
        id: v4(),
        text,
        userId,
        timestamp: Date.now(),
      };
      db.messages.unshift(newMsg);
      setMsgs(db.messages);
      return newMsg;
    },
    updateMessage: (parent, { id, userId, text }, { db }) => {
      try {
        const targetIndex = db.messages.findIndex((msg) => msg.id === id);
        if (targetIndex < 0) throw Error("메시지가 없습니다.");
        if (db.messages[targetIndex].userId !== userId)
          throw Error("사용자가 다릅니다.");

        const updateMsg = { ...db.messages[targetIndex], text };
        db.messages.splice(targetIndex, 1, updateMsg);
        setMsgs(db.messages);

        return updateMsg;
      } catch (err) {
        throw Error(err);
        // res.status(500).send({ error: err });
      }
    },
    deleteMessage: (parent, { id, userId }, { db }) => {
      try {
        const targetIndex = db.messages.findIndex((msg) => msg.id === id);
        if (targetIndex < 0) throw Error("메시지가 없습니다.");
        if (db.messages[targetIndex].userId !== userId)
          throw Error("사용자가 다릅니다.");

        db.messages.splice(targetIndex, 1);
        setMsgs(db.messages);

        return id;
      } catch (err) {
        throw Error(err);
      }
    },
  },
};

export default messageResolver;
