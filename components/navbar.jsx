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
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <>
      <nav
        className="pt-2 mb-2 px-4 bg-background  top-0 tracking-wide w-[99%] lg:h-16 m-auto shadow-xl rounded-md flex sticky justify-between items-center align-middle
                 bg-gray-900/10 
        text-slate-800 dark:text-slate-300  dark:bg-slate-700/30 "
      >
        <div className="logo justify-center">
          <h3 className=" text-[20px] font-semibold tracking-widest ">IUJ</h3>
        </div>
        <div className="md:hidden max-sm:ml-4">
          <Toggle />
        </div>
        <div className="md:flex hidden navbaritems   ">
          <ul className="flex space-x-3 ">
            <li
              className="px-2 underline-offset-4 hover:text-blue-600  hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-400 rounded-md"
            >
              <Link href="#home">Home</Link>
            </li>
            <li
              className="px-2 underline-offset-4  hover:text-blue-600  hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-400 rounded-md"
            >
              <Link href="#about">About</Link>
            </li>
            <li
              className="px-2  underline-offset-4  hover:text-blue-600  hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-400 rounded-md"
            >
              <Link href="#experience">Experience</Link>
            </li>
            <li
              className="px-2 underline-offset-4  hover:text-blue-600  hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-400 rounded-md"
            >
              <Link href="#projects">Projects</Link>
            </li>
            <li
              className="px-2 underline-offset-4  hover:text-blue-600  hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-400  rounded-md"
            >
              <Link href="#contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="md:hidden flex h-16 text-[13px]">
          <Image
            src="/hamburger.png"
            className="py-5 px-5 animate-pulse repeat-1 w-auto h-auto"
            width={60}
            height={40}
            alt="hamburger"
            onClick={() => toggleDrop((prev) => !prev)}
          />
          {drop && (
            <ul className=" h-52 animate-bounce repeat-1 bg-gray-100 dark:bg-slate-900/80 dark:text-slate-200 shadow-xl pl-1 pr-6 py-2 rounded-md  absolute right-1 top-20">
              <li className="px-2 py-2 hover:bg-sky-500 rounded-md">
                <Link href="#home">Home</Link>
              </li>
              <li className="px-2 py-2 hover:bg-sky-500 rounded-md">
                <Link href="#about">About</Link>
              </li>
              <li className="px-2 py-2 hover:bg-sky-500 rounded-md">
                <Link href="#experience">Experience </Link>
              </li>

              <li className="px-2 py-2 hover:bg-sky-500 rounded-md">
                <Link href="#projects">Projects</Link>
              </li>
              <li className="px-2 py-2 hover:bg-sky-500 rounded-md">
                <Link href="#contact">Contact</Link>
              </li>
              {/* <li className="px-2 py-2 hover:bg-sky-500 rounded-md"> */}
              {/*   <Toggle /> */}
              {/*   </li> */}
            </ul>
          )}
        </div>
        <div className=" max-sm:hidden">
          <Toggle />
        </div>
      </nav>
    </>
  );
};

export default NavBar;
