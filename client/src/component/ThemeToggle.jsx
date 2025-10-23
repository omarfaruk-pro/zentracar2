
import { useState } from "react";
import { IoMdSunny } from "react-icons/io";
import { IoMdMoon } from "react-icons/io";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);


  const toggleTheme = () => {
     if (isDark) {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }
    const newTheme = !isDark ? "light" : "night";
    document.documentElement.setAttribute("data-theme", newTheme);
    setIsDark(!isDark);
  };
  return (
    <div className="fixed top-1/2 right-0 z-10">
      <button
        onClick={toggleTheme}
        className="text-4xl bg-primary dark:bg-gray-900  p-4 rounded-tl-md rounded-bl-md text-white"
      >
        {isDark ? <IoMdSunny /> : <IoMdMoon />}
      </button>
    </div>
  );
}