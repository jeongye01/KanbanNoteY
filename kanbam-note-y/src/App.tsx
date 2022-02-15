import React from 'react';
import Home from './Home';
import { RecoilRoot } from 'recoil';
import GlobalStyle, { theme } from './Styles';
import { ThemeProvider } from 'styled-components';
function App() {
  return (
    <>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Home />
        </ThemeProvider>
      </RecoilRoot>
    </>
  );
}

export default App;
