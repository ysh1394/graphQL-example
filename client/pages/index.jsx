import styled from "styled-components";
import MsgList from "../components/MsgList";
import { GET_MESSAGES } from "../graphql/messages";
import { GET_USERS } from "../graphql/users";
import { fetcher } from "../quertClient";

const Home = ({ serverMsgs, serverUsers }) => {
  return (
    <>
      <Title>SIMPLE SNS</Title>
      <MsgList serverMsgs={serverMsgs} serverUsers={serverUsers} />
    </>
  );
};

const Title = styled.h1`
  text-align: center;
  margin: 20px 0;
`;

export const getServerSideProps = async () => {
  // const { messages: serverMsgs } = await fetcher(GET_MESSAGES);
  // const { users: serverUsers } = await fetcher(GET_USERS);

  // 아래는 개선된 방법
  const [{ messages: serverMsgs }, { users: serverUsers }] = await Promise.all([
    fetcher(GET_MESSAGES),
    fetcher(GET_USERS),
  ]);

  console.log({
    serverMsgs,
    serverUsers,
  });

  return {
    props: { serverMsgs, serverUsers },
  };
};

export default Home;
