"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Toggle from "./Toggle";
const NavBar = () => {
  const [drop, toggleDrop] = useState(false);
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <>
      <nav
        className="pt-2 mb-2 px-4 bg-background  top-0 tracking-widest w-[99%] lg:h-16 m-auto shadow-xl rounded-md flex sticky justify-between items-center align-middle bg-gray-900/10 
        font-normal text-slate-900 dark:text-slate-300  dark:bg-slate-700/30 "
      >
        <div className="justify-center logo">
          <h3 className="font-semibold tracking-widest text-[20px]">IUJ</h3>
        </div>
        <div className="md:hidden max-sm:ml-4">
          <Toggle />
        </div>
        <div className="hidden md:flex navbaritems">
          <ul className="flex space-x-3 text-[0.9rem]">
            <li className="px-2 rounded-md hover:text-blue-600 hover:underline underline-offset-4 dark:hover:underline dark:hover:decoration-slate-400 hover:decoration-slate-800 hover:decoration-2">
              <Link href="#home">Home</Link>
            </li>
            <li className="px-2 rounded-md hover:text-blue-600 hover:underline underline-offset-4 dark:hover:underline dark:hover:decoration-slate-400 hover:decoration-slate-800 hover:decoration-2">
              <Link href="#about">About</Link>
            </li>
            <li className="px-2 rounded-md hover:text-blue-600 hover:underline underline-offset-4 dark:hover:underline dark:hover:decoration-slate-400 hover:decoration-slate-800 hover:decoration-2">
              <Link href="#experience">Experience</Link>
            </li>
            <li className="px-2 rounded-md hover:text-blue-600 hover:underline underline-offset-4 dark:hover:underline dark:hover:decoration-slate-400 hover:decoration-slate-800 hover:decoration-2">
              <Link href="#projects">Projects</Link>
            </li>
            <li className="px-2 rounded-md hover:text-blue-600 hover:underline underline-offset-4 dark:hover:underline dark:hover:decoration-slate-400 hover:decoration-slate-800 hover:decoration-2">
              <Link href="#contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="flex h-16 md:hidden text-[13px]">
          <Image
            src="/hamburger.png"
            className="py-5 px-5 w-auto h-auto animate-pulse repeat-1"
            width={60}
            height={40}
            alt="hamburger"
            onClick={() => toggleDrop((prev) => !prev)}
          />
          {drop && (
            <ul className="absolute right-1 top-20 py-2 pr-6 pl-1 h-52 bg-gray-100 rounded-md shadow-xl animate-bounce repeat-1 dark:bg-slate-900/80 dark:text-slate-200">
              <li className="py-2 px-2 rounded-md hover:bg-sky-500">
                <Link href="#home">Home</Link>
              </li>
              <li className="py-2 px-2 rounded-md hover:bg-sky-500">
                <Link href="#about">About</Link>
              </li>
              <li className="py-2 px-2 rounded-md hover:bg-sky-500">
                <Link href="#experience">Experience </Link>
              </li>

              <li className="py-2 px-2 rounded-md hover:bg-sky-500">
                <Link href="#projects">Projects</Link>
              </li>
              <li className="py-2 px-2 rounded-md hover:bg-sky-500">
                <Link href="#contact">Contact</Link>
              </li>
              {/* <li className="py-2 px-2 rounded-md hover:bg-sky-500"> */}
              {/*   <Toggle /> */}
              {/*   </li> */}
            </ul>
          )}
        </div>
        <div className="max-sm:hidden">
          <Toggle />
        </div>
      </nav>
    </>
  );
};

export default NavBar;
