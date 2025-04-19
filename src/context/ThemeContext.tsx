
// import React, { createContext, useContext, useEffect, useState } from "react";

// type Theme = "light" | "dark" | "system";

// type ThemeProviderProps = {
//   children: React.ReactNode;
//   defaultTheme?: Theme;
// };

// type ThemeProviderState = {
//   theme: Theme;
//   setTheme: (theme: Theme) => void;
// };

// const initialState: ThemeProviderState = {
//   theme: "system",
//   setTheme: () => null,
// };

// const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// export function ThemeProvider({
//   children,
//   defaultTheme = "system",
// }: ThemeProviderProps) {
//   const [theme, setTheme] = useState<Theme>(
//     () => (localStorage.getItem("theme") as Theme) || defaultTheme
//   );

//   useEffect(() => {
//     const root = window.document.documentElement;
    
//     root.classList.remove("light", "dark");
    
//     if (theme === "system") {
//       const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
//         .matches
//         ? "dark"
//         : "light";
      
//       root.classList.add(systemTheme);
//       return;
//     }
    
//     root.classList.add(theme);
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const value = {
//     theme,
//     setTheme,
//   };

//   return (
//     <ThemeProviderContext.Provider value={value}>
//       {children}
//     </ThemeProviderContext.Provider>
//   );
// }

// export { ThemeProviderContext };


import React, { createContext, useState, useContext, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}