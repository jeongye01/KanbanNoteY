import { createGlobalStyle, DefaultTheme } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
  *{
    box-sizing:border-box;
  }
  body{
    font-family: 'Source Sans Pro', sans-serif;
    background-color:${(props) => props.theme.bgColor};
    color:${(props) => props.theme.textColor};
    font-size:16px;
  }
  a{
    text-decoration:none;
    color:inherit;
  }
`;

export const theme: DefaultTheme = {
  bgColor: '#FAFAFA',
  textColor: 'black',
  accentColor: '#fbc531',
};
export default GlobalStyle;
