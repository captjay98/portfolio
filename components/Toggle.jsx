import React, { useEffect, useState } from "react";

const Toggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.theme;
    setIsDarkMode(storedTheme === "dark");
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  const handleToggle = () => {
    const updatedMode = isDarkMode ? "light" : "dark";
    localStorage.theme = updatedMode;
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  return (
    <button
      onClick={handleToggle}
      // className={`border-2 border-gray-400  dark:border-gray-500 rounded-md text-black dark:text-slate-300 text-[12px] px-2 py-1  hover:bg-gray-800 hover:text-gray-300 dark:hover:bg-gray-300 dark:hover:text-gray-800 `}
    >
      💡
      {/* {isDarkMode ? "Go Light" : "Go Dark"} */}
    </button>
  );
};

export default Toggle;
