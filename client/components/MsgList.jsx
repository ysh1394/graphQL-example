import styled from "styled-components";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import { useEffect, useRef, useState } from "react";
import fetcher from "../fetcher";
import { useRouter } from "next/router";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const ALERT = "userId가 없습니다. query에 추가하세요. ex) ?userId=roy";

const MsgList = ({ serverMsgs, serverUsers }) => {
  const fetchMoreEl = useRef(null);
  const { query } = useRouter();
  const userId = query.userId || query.userid || ""; // 윈도우에서 카멜케이스 소문자로 바뀌는 에러 해결

  const [msgs, setMsgs] = useState(serverMsgs);
  const [editingId, setEditingId] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const getMsgs = async () => {
    const data = await fetcher("get", "/messages", {
      params: { cursor: msgs[msgs.length - 1]?.id || null },
    });
    if (data.length === 0) {
      setHasNext(false);
      return;
    }
    setMsgs((p) => [...p, ...data]);
  };

  // useEffect(() => {
  //   getMsgs();
  // }, []);

  useEffect(() => {
    if (intersecting && hasNext) getMsgs();
  }, [intersecting]);

  const onCreate = async (text) => {
    if (!userId) throw Error(ALERT);
    const newMsg = await fetcher("post", "/messages", { text, userId });
    if (!newMsg) throw Error("something wrong");
    setMsgs((msg) => [newMsg, ...msg]);
  };

  // const onCreate = (text) => {
  //   const newMsg = {
  //     id: msgs.length + 1,
  //     userId: randomIds(),
  //     timestamp: Date.now(),
  //     text: `${msgs.length + 1} ${text}`,
  //   };
  //   setMsgs((msg) => [newMsg, ...msg]);
  // };

  const doneEdit = () => setEditingId(null);

  const onUpdate = async (text, id) => {
    if (!userId) throw Error(ALERT);
    const updateMsg = await fetcher("put", `/messages/${id}`, { text, userId });
    if (!updateMsg) throw Error("something wrong");
    setMsgs((state) => {
      const targetIndex = state.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return state;
      const newMsgs = [...state];
      newMsgs.splice(targetIndex, 1, { ...state[targetIndex], text });
      return newMsgs;
    });
    doneEdit();
  };

  // const onUpdate = (text, id) => {
  //   setMsgs((state) => {
  //     const targetIndex = state.findIndex((msg) => msg.id === id);
  //     if (targetIndex < 0) return state;
  //     const newMsgs = [...state];
  //     newMsgs.splice(targetIndex, 1, { ...state[targetIndex], text });
  //     return newMsgs;
  //   });
  //   doneEdit();
  // };

  const onDelete = async (id) => {
    const receivedId = await fetcher("delete", `/messages/${id}`, {
      params: { userId },
    });
    if (!receivedId) throw Error("something wrong");
    setMsgs((state) => {
      const targetIndex = state.findIndex(
        (msg) => msg.id === receivedId.toString()
      );
      if (targetIndex < 0) return state;
      const newMsgs = [...state];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
    doneEdit();
  };

  return (
    <>
      {userId ? (
        <MsgInput mutate={onCreate} />
      ) : (
        <h3>userId가 없습니다. query에 추가하세요. ex) ?userId=roy</h3>
      )}
      <Messages>
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            onUpdate={onUpdate}
            doneEdit={doneEdit}
            startEdit={() => setEditingId(x.id)}
            isEditing={editingId === x.id}
            onDelete={() => onDelete(x.id)}
            myId={userId}
            serverUser={serverUsers[x.userId]}
          />
        ))}
      </Messages>

      <div ref={fetchMoreEl} />
    </>
  );
};

const Messages = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export default MsgList;
