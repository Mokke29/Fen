import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  status: {
    danger: '#eb6e80',
  },
  palette: {
    primary: {
      main: '#eb6e80',
      darker: '#053e85',
    },
    secondary: {
      main: '#6eebd9',
    },
    info: {
      main: '#FFFFFF',
    },
  },
});

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: React.CSSProperties['color'];
    };
  }

  interface PaletteColor {
    darker?: string;
  }
  interface SimplePaletteColorOptions {
    darker?: string;
  }
  interface ThemeOptions {
    status: {
      danger: React.CSSProperties['color'];
    };
  }
}
