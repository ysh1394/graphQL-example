import styled from "styled-components";
import MsgList from "../components/MsgList";

const Home = () => {
  return (
    <>
      <Title>SIMPLE SNS</Title>
      <MsgList />
    </>
  );
};

const Title = styled.h1`
  text-align: center;
  margin: 20px 0;
`;

export default Home;
