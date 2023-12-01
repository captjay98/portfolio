"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
  const [drop, toggleDrop] = useState(false);
  return (
    <>
      <nav
        className="pt-2 lg:my-1 xl:pr-24 xl:pl-16 px-4 bg-background  top-0 tracking-wide w-[99%] lg:h-16 m-auto shadow-xl rounded-md flex sticky justify-between
                 bg-gray-700/10 
        text-slate-800 dark:text-slate-300  dark:bg-slate-900/30 dark:bg-gradient-to-br from-gray-700/50 via-transparent "
      >
        <div className="logo">
          <h3 className="py-2 px-2 text-[20px] font-semibold tracking-widest ">IUJ</h3>
        </div>
        <div className="md:flex hidden navbaritems   ">
          <ul className="py-3 px-2 mb-4 flex space-x-3 ">
            <li
              className="px-2 underline-offset-4  hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-400 rounded-md"
            >
              <Link href="#home">Home</Link>
            </li>
            <li
              className="px-2 underline-offset-4  hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-400 rounded-md"
            >
              <Link href="#about">About</Link>
            </li>
            <li
              className="px-2  underline-offset-4  hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-400 rounded-md"
            >
              <Link href="#experience">Experience</Link>
            </li>
            <li
              className="px-2 underline-offset-4  hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-400 rounded-md"
            >
              <Link href="#projects">Projects</Link>
            </li>
            <li
              className="px-2 underline-offset-4  hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-400  rounded-md"
            >
              <Link href="#contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="md:hidden flex h-16 ">
          <Image
            src="/bars.svg"
            className="py-5 px-5 animate-pulse w-auto h-auto"
            width={60}
            height={40}
            alt="hamburger"
            onClick={() => toggleDrop((prev) => !prev)}
          />
          {drop && (
            <ul className=" h-56 animate-bounce repeat-1 bg-gray-100 dark:bg-slate-900 dark:text-slate-200 shadow-xl pl-1 pr-6 py-2 rounded-md  absolute right-1 top-20">
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
            </ul>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
