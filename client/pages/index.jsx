import styled from "styled-components";
import MsgList from "../components/MsgList";
import fetcher from "../fetcher";

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
  const serverMsgs = await fetcher("get", "/messages");
  const serverUsers = await fetcher("get", "/users");

  return {
    props: { serverMsgs, serverUsers },
  };
};

export default Home;
