import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
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
    background-color:${(props) => props.theme.innerbgColor};
    color:${(props) => props.theme.textColor};
    font-size:16px;
  }
  a{
    text-decoration:none;
    color:inherit;
  }
`;

export const theme: DefaultTheme = {
  outerbgColor: '#93D42E',
  innerbgColor: '#FAFAFA',
  textColor: 'black',
  accentColor: '#93D42E',
};
export default GlobalStyle;
