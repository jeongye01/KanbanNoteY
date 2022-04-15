import React from 'react';
import { SForm } from './styles';
interface Props {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
}
function Form({ onSubmit, onChange, value, placeholder }: Props) {
  return (
    <SForm onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onChange} placeholder={placeholder} />
    </SForm>
  );
}

export default React.memo(Form);
