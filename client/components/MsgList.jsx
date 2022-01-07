import styled from "styled-components";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import { useEffect, useRef, useState } from "react";
// import fetcher from "../fetcher";
import { QueryKeys, fetcher } from "../quertClient";
import {
  useQueryClient,
  useMutation,
  useQuery,
  useInfiniteQuery,
} from "react-query";
import { useRouter } from "next/router";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import {
  CREATE_MESSAGE,
  DELETE_MESSAGE,
  GET_MESSAGES,
  UPDATE_MESSAGE,
} from "../graphql/messages";

const ALERT = "userId가 없습니다. query에 추가하세요. ex) ?userId=roy";

const MsgList = ({ serverMsgs, serverUsers }) => {
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);
  const { query } = useRouter();
  const userId = query.userId || query.userid || ""; // 윈도우에서 카멜케이스 소문자로 바뀌는 에러 해결

  const [msgs, setMsgs] = useState([{ messages: serverMsgs }]);
  const [editingId, setEditingId] = useState(null);

  const client = useQueryClient();

  // REACT QUERY VERSION (infiniteScroll)
  const { data, error, isError, fetchNextPage, hasNextPage } = useInfiniteQuery(
    QueryKeys.MESSAGES,
    ({ pageParam = "" }) => fetcher(GET_MESSAGES, { cursor: pageParam }),
    { getNextPageParam: ({ messages }) => messages?.[messages?.length - 1]?.id }
  );

  useEffect(() => {
    if (!data?.pages) return;
    console.log("msg changed >>> ", data);
    // data의 공통된 부분(messages)를 합쳐서 하나의 배열로 만드는 함수 (데이터를 변경하게 됨)
    // const mergedMsgs = data?.pages.flatMap((m) => m.messages);
    // setMsgs(mergedMsgs || []);
    setMsgs(data.pages || []);
  }, [data?.pages]);

  if (isError) {
    console.error("err >>", error);
    return null;
  }

  useEffect(() => {
    if (intersecting && hasNextPage) fetchNextPage();
  }, [intersecting, hasNextPage]);

  // REACT QUERY VERSION (no infiniteScroll)
  // const { data, error, isError } = useQuery(QueryKeys.MESSAGES, () =>
  //   fetcher(GET_MESSAGES)
  // );

  // useEffect(() => {
  //   if (!data?.messages) return;
  //   console.log("msg changed >>> ", data);
  //   setMsgs(data.messages || []);
  // }, [data?.messages]);

  // if (isError) {
  //   console.error("err >>", error);
  //   return null;
  // }

  // REST API VERSION (infiniteScroll)
  // const [hasNext, setHasNext] = useState(true);
  // const getMsgs = async () => {
  //   const data = await fetcher("get", "/messages", {
  //     params: { cursor: msgs[msgs.length - 1]?.id || null },
  //   });
  //   if (data.length === 0) {
  //     setHasNext(false);
  //     return;
  //   }
  //   setMsgs((p) => [...p, ...data]);
  // };

  // useEffect(() => {
  //   getMsgs();
  // }, []);

  // useEffect(() => {
  //   if (intersecting && hasNext) getMsgs();
  // }, [intersecting]);

  // REACT QUERY VERSION (graphql && infiniteScroll)
  const { mutate: onCreate } = useMutation(
    ({ text }) => fetcher(CREATE_MESSAGE, { text, userId }),
    {
      onSuccess: ({ createMessage }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          return {
            pageParam: old.pageParam,
            pages: [
              { messages: [createMessage, ...old.pages[0].messages] },
              ...old.pages.slice(1),
            ],
          };
        });
      },
    }
  );

  // REACT QUERY VERSION (graphql && no infiniteScroll)
  // const { mutate: onCreate } = useMutation(
  //   ({ text }) => fetcher(CREATE_MESSAGE, { text, userId }),
  //   {
  //     onSuccess: ({ createMessage }) => {
  //       client.setQueryData(QueryKeys.MESSAGES, (old) => {
  //         return {
  //           messages: [createMessage, ...old.messages],
  //         };
  //       });
  //     },
  //   }
  // );

  // REST API VERSION
  // const onCreate = async (text) => {
  //   if (!userId) throw Error(ALERT);
  //   const newMsg = await fetcher("post", "/messages", { text, userId });
  //   if (!newMsg) throw Error("something wrong");
  //   setMsgs((msg) => [newMsg, ...msg]);
  // };

  // MOCK DATA VERSION
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

  const findTargetIndex = (pages, id) => {
    let msgIndex = -1;
    const pageIndex = pages.findIndex(({ messages }) => {
      msgIndex = messages.findIndex((msg) => msg.id === id);

      if (msgIndex > -1) {
        return true;
      }
      return false;
    });

    return { pageIndex, msgIndex };
  };

  // REACT QUERY VERSION (graphql && infiniteScroll)
  const { mutate: onUpdate } = useMutation(
    ({ text, id }) => {
      return fetcher(UPDATE_MESSAGE, { text, id, userId });
    },
    {
      onSuccess: ({ updateMessage }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          const { pageIndex, msgIndex } = findTargetIndex(
            old.pages,
            updateMessage.id
          );

          if (pageIndex < 0 || msgIndex < 0) return old;
          let newData = [...old.pages];
          newData[pageIndex].messages[msgIndex] = updateMessage;

          return {
            pageParam: old.pageParam,
            pages: newData,
          };
        });
        doneEdit();
      },
    }
  );

  // REACT QUERY VERSION (graphql && no infiniteScroll)
  // const { mutate: onUpdate } = useMutation(
  //   ({ text, id }) => {
  //     return fetcher(UPDATE_MESSAGE, { text, id, userId });
  //   },
  //   {
  //     onSuccess: ({ updateMessage }) => {
  //       client.setQueryData(QueryKeys.MESSAGES, (old) => {
  //         const targetIndex = old.messages.findIndex(
  //           (msg) => msg.id === updateMessage.id
  //         );
  //         if (targetIndex < 0) return old;
  //         const newMsgs = [...old.messages];
  //         newMsgs.splice(targetIndex, 1, updateMessage);
  //         return { messages: newMsgs };
  //       });
  //       doneEdit();
  //     },
  //   }
  // );

  // REST API VERSION
  // const onUpdate = async (text, id) => {
  //   if (!userId) throw Error(ALERT);
  //   const updateMsg = await fetcher("put", `/messages/${id}`, { text, userId });
  //   if (!updateMsg) throw Error("something wrong");
  //   setMsgs((state) => {
  //     const targetIndex = state.findIndex((msg) => msg.id === id);
  //     if (targetIndex < 0) return state;
  //     const newMsgs = [...state];
  //     newMsgs.splice(targetIndex, 1, { ...state[targetIndex], text });
  //     return newMsgs;
  //   });
  //   doneEdit();
  // };

  // MOCK DATA VERSION
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

  // REACT QUERY VERSION (graphql && infiniteScroll)
  const { mutate: onDelete } = useMutation(
    // (id) => {
    //   // console.log("get >> ", fetcher(DELETE_MESSAGE, { id, userId }));
    //   console.log("userId >> ", userId);
    //   return fetcher(DELETE_MESSAGE, { id, userId });
    // },
    (id) => fetcher(DELETE_MESSAGE, { id, userId }),

    {
      onSuccess: ({ deleteMessage: deletedId }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          const { pageIndex, msgIndex } = findTargetIndex(old.pages, deletedId);

          if (pageIndex < 0 || msgIndex < 0) return old;
          let newData = [...old.pages];
          const delMsgs = [...old.pages[pageIndex].messages];
          delMsgs.splice(msgIndex, 1);
          newData[pageIndex].messages = delMsgs;

          console.log("newData >>>", newData);

          return {
            pageParam: old.pageParam,
            pages: newData,
          };
          // const mergedPages = old?.pages?.flatMap((m) => m.messages);
          // const targetIndex = mergedPages.findIndex(
          //   (msg) => msg.id === deletedId
          // );
          // if (targetIndex < 0) return old;
          // const newMsgs = [...mergedPages];
          // newMsgs.splice(targetIndex, 1);
          // return {
          //   pageParam: old.pageParam,
          //   pages: [{ messages: newMsgs }],
          // };
        });
      },
      onError: (err) => console.log("err >>>", err),
    }
  );

  // REACT QUERY VERSION (graphql && no infiniteScroll)
  // const { mutate: onDelete } = useMutation(
  //   (id) => fetcher(DELETE_MESSAGE, { id, userId }),
  //   {
  //     onSuccess: ({ deleteMessage: deletedId }) => {
  //       client.setQueryData(QueryKeys.MESSAGES, (old) => {
  //         const targetIndex = old.messages.findIndex(
  //           (msg) => msg.id === deletedId
  //         );
  //         if (targetIndex < 0) return old;
  //         const newMsgs = [...old.messages];
  //         newMsgs.splice(targetIndex, 1);
  //         return { messages: newMsgs };
  //       });
  //     },
  //     onError: (err) => console.log("err >>>", err),
  //   }
  // );

  // REST API VERSION
  // const onDelete = async (id) => {
  //   const receivedId = await fetcher("delete", `/messages/${id}`, {
  //     params: { userId },
  //   });
  //   if (!receivedId) throw Error("something wrong");
  //   setMsgs((state) => {
  //     const targetIndex = state.findIndex(
  //       (msg) => msg.id === receivedId.toString()
  //     );
  //     if (targetIndex < 0) return state;
  //     const newMsgs = [...state];
  //     newMsgs.splice(targetIndex, 1);
  //     return newMsgs;
  //   });
  //   doneEdit();
  // };

  return (
    <>
      {userId ? <MsgInput mutate={onCreate} /> : <h3>{ALERT}</h3>}
      <Messages>
        {/* flanMap을 사용하지 않을거면 2번 map을 돌려야함  */}
        {msgs.map(({ messages }) =>
          messages.map((x) => (
            <MsgItem
              key={x.id}
              {...x}
              onUpdate={onUpdate}
              doneEdit={doneEdit}
              startEdit={() => setEditingId(x.id)}
              isEditing={editingId === x.id}
              onDelete={() => onDelete(x.id)}
              myId={userId}
              serverUser={serverUsers.find((user) => user.id === x.userId)}
            />
          ))
        )}
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
