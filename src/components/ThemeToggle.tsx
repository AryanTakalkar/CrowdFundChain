
import React from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  return (
    <motion.button
      className="relative h-10 w-10 rounded-full flex items-center justify-center glass hover:ring-2 hover:ring-primary/20 transition-all duration-300"
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute"
        initial={false}
        animate={{ 
          opacity: theme === "dark" ? 0 : 1,
          y: theme === "dark" ? -10 : 0,
          rotate: theme === "dark" ? -30 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <Sun className="h-5 w-5" />
      </motion.div>
      
      <motion.div
        className="absolute"
        initial={false}
        animate={{ 
          opacity: theme === "dark" ? 1 : 0,
          y: theme === "dark" ? 0 : 10,
          rotate: theme === "dark" ? 0 : 30,
        }}
        transition={{ duration: 0.2 }}
      >
        <Moon className="h-5 w-5" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
