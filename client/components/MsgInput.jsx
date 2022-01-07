import styled from "styled-components";
import { useRef } from "react";

const MsgInput = ({ mutate, text = "", id = undefined }) => {
  const textRef = useRef(null);
  const onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const text = textRef.current.value;
    textRef.current.value;
    mutate({ text, id });
  };
  return (
    <Form onSubmit={onSubmit}>
      <textarea
        ref={textRef}
        defaultValue={text}
        placeholder='내용을 입력하세요.'
      />
      <button type='submit'>완료</button>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  width: 80%;
  max-width: 700px;
  min-width: 400px;
  margin: 0 auto 10px;
  textarea {
    padding: 10px;
    flex-grow: 1;
  }
  button {
    margin-left: 5px;
    width: 60px;
  }
`;

export default MsgInput;
