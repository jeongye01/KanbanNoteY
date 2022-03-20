import React from 'react';
import { Form } from './styles';
interface Props {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
}
function Input({ onSubmit, onChange, value, placeholder }: Props) {
  console.log('Input');
  return (
    <Form onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onChange} placeholder={placeholder} />
    </Form>
  );
}

export default React.memo(Input);
