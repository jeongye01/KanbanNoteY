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
    //${(props) => props.theme.innerbgColor};
    color:${(props) => props.theme.textColor};
    font-size:16px;
  }
  a{
    text-decoration:none;
    color:inherit;
  }
  button{
    all:unset;
  }
`;

export const theme: DefaultTheme = {
  darkBlue: '#4DA555',
  lightBlue: '#7DCB3A',
  deepBlue: '#70C075',
  yellow: '#FFC83D',
  innerbgColor: '#F6F6F6',
  textColor: 'black',
  accentColor: '#93D42E',
  buttonColor: '#86B775',
};
/*
export const theme: DefaultTheme = {
  darkBlue: '#032D7C',
  lightBlue: '#3E5DD1',
  deepBlue: '#012260',
  innerbgColor: '#F5F8FE',
  textColor: 'black',
  accentColor: '#93D42E',
  buttonColor: '#ffc312',
};*/

export default GlobalStyle;
