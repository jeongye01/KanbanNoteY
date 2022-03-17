import { useState } from 'react';
import styled from 'styled-components';
const Form = styled.form`
  input {
    color: #322d39;
    outline: none;
    padding: 0.3rem;
    border: 2px solid ${(props) => props.theme.accentColor};

    &:focus {
      border-color: orange;
    }
  }
`;
interface Props {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
}
function Input({ onSubmit, onChange, value, placeholder }: Props) {
  return (
    <Form onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onChange} placeholder={placeholder} />
    </Form>
  );
}

export default Input;
