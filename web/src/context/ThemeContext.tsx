import React from 'react';

type ThemeColor = {
  name: string;
  primary: string;
  glow: string;
  bg: string;
  surface: string;
  text: string;
  card: string;
};

const themes: ThemeColor[] = [
  { 
    name: 'CYPHEIR', 
    primary: '#CCFF00', 
    glow: 'rgba(204, 255, 0, 0.4)',
    bg: '#000000',
    surface: 'rgba(255, 255, 255, 0.1)',
    text: '#FFFFFF',
    card: 'rgba(0, 0, 0, 0.6)'
  },
  { 
    name: 'LIGHT', 
    primary: '#1A1A1A', 
    glow: 'rgba(0, 0, 0, 0.1)',
    bg: '#D6D3C1', 
    surface: 'rgba(0, 0, 0, 0.25)',
    text: '#000000',
    card: 'rgba(255, 255, 255, 0.5)'
  },
  { 
    name: 'GOLDEN', 
    primary: '#FFB800', 
    glow: 'rgba(255, 184, 0, 0.4)',
    bg: '#0B2418',
    surface: 'rgba(255, 255, 255, 0.05)',
    text: '#FFFFFF',
    card: 'rgba(0, 0, 0, 0.6)'
  },
];

interface ThemeContextType {
  currentTheme: ThemeColor;
  setTheme: (name: string) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentThemeState] = React.useState<ThemeColor>(themes[0]);

  const setTheme = (name: string) => {
    const theme = themes.find(t => t.name === name);
    if (theme) {
      setCurrentThemeState(theme);
      const root = document.documentElement;
      root.style.setProperty('--primary-color', theme.primary);
      root.style.setProperty('--primary-glow', theme.glow);
      root.style.setProperty('--bg-color', theme.bg);
      root.style.setProperty('--surface-border', theme.surface);
      root.style.setProperty('--text-main', theme.text);
      root.style.setProperty('--card-bg', theme.card);
      
      // Update data-theme for conditional styling if needed
      root.setAttribute('data-theme', theme.name.toLowerCase());
    }
  };

  React.useEffect(() => {
    // Initialize with default
    setTheme('CYPHEIR');
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
