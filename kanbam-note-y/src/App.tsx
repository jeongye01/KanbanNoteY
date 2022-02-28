import React, { FC } from 'react';
import Router from './Router';
import { RecoilRoot } from 'recoil';
import GlobalStyle, { theme } from './Styles';
import { ThemeProvider } from 'styled-components';
const App: FC = () => {
  return (
    <>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Router />
        </ThemeProvider>
      </RecoilRoot>
    </>
  );
};

export default App;
