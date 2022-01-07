import styled from "styled-components";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import { useState } from "react";

const UserIds = ["roy", "jay"];
const randomIds = () => UserIds[Math.round(Math.random())];

const mockMsgs = Array(50)
  .fill(0)
  .map((_, i) => ({
    id: 50 - i,
    userId: randomIds(),
    timestamp: 1234567890123 + (50 - i) * 1000 * 60,
    text: `${50 - i} mock test`,
  }));

// console.log(JSON.stringify(mockMsgs)); 목데이터 복사 용

const MsgList = () => {
  const [msgs, setMsgs] = useState(mockMsgs);
  const [editingId, setEditingId] = useState(null);

  const onCreate = (text) => {
    const newMsg = {
      id: msgs.length + 1,
      userId: randomIds(),
      timestamp: Date.now(),
      text: `${msgs.length + 1} ${text}`,
    };
    setMsgs((msg) => [newMsg, ...msg]);
  };

  const doneEdit = () => setEditingId(null);

  const onUpdate = (text, id) => {
    setMsgs((state) => {
      const targetIndex = state.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return state;
      const newMsgs = [...state];
      newMsgs.splice(targetIndex, 1, { ...state[targetIndex], text });
      return newMsgs;
    });
    doneEdit();
  };

  const onDelete = (id) => {
    setMsgs((state) => {
      const targetIndex = state.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return state;
      const newMsgs = [...state];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
    doneEdit();
  };

  return (
    <>
      <MsgInput mutate={onCreate} />
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
          />
        ))}
      </Messages>
    </>
  );
};

const Messages = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export default MsgList;
