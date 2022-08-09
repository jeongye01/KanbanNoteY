import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import styled from '@emotion/styled';

const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

interface Props {
  open: boolean;
  handleClose: () => void;
}

export default function FormDialog({ open, handleClose }: Props) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <Form>
        <DialogTitle>yanban✅</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" id="name" label="이메일" type="email" fullWidth variant="filled" />
          <TextField autoFocus margin="dense" id="name" label="비밀번호" type="password" fullWidth variant="filled" />
        </DialogContent>

        <span>계정이 아직 없으신가요? 회원가입</span>
        <DialogActions>
          <Button onClick={handleClose}>로그인</Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
