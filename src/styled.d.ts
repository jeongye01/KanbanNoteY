import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    outerbgColor: string;
    innerbgColor: string;
    textColor: string;
    accentColor: string;
    buttonColor: string;
  }
}
