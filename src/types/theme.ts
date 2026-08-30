export type ThemeColors = {
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  steel: string;
  graphite: string;
  line: string;
};

export type ThemeTokens = {
  colors: ThemeColors;
  fonts: {
    heading: string;
    body: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
  };
};
