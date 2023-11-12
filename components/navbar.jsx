"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
  const [drop, toggleDrop] = useState(false);
  return (
    <>
      <nav
        className="pt-2 px-4 bg-gray-100 dark:bg-gray-900 top-0 tracking-wide w-[99%] h-20 m-auto shadow-xl rounded-lg flex sticky justify-between
        text-slate-800 dark:text-slate-300"
      >
        <div className="logo">
          <h3 className="py-4 px-2 text-2xl font-semibold tracking-widest ">Capt Jay</h3>
        </div>
        <div className="md:flex hidden navbaritems">
          <ul className="py-5 px-2 mb-4 flex space-x-3 ">
            <li
              className="px-2 underline-offset-4 hover:translate-y-1 hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-600 rounded-lg"
            >
              <Link href="#home">Home</Link>
            </li>
            <li
              className="px-2 underline-offset-4 hover:translate-y-1 hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-600 rounded-lg"
            >
              <Link href="#about">About</Link>
            </li>
            <li
              className="px-2  underline-offset-4 hover:translate-y-1 hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-600 rounded-lg"
            >
              <Link href="#experience">Experience</Link>
            </li>
            <li
              className="px-2 underline-offset-4 hover:translate-y-1 hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-600 rounded-lg"
            >
              <Link href="#projects">Projects</Link>
            </li>
            <li
              className="px-2 underline-offset-4 hover:translate-y-1 hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-600  rounded-lg"
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
            <ul className=" h-56 animate-bounce repeat-1 bg-gray-100 dark:bg-slate-900 dark:text-slate-200 shadow-xl pl-1 pr-6 py-2 rounded-lg  absolute right-1 top-20">
              <li className="px-2 py-2 hover:bg-sky-500 rounded-lg">
                <Link href="#home">Home</Link>
              </li>
              <li className="px-2 py-2 hover:bg-sky-500 rounded-lg">
                <Link href="#about">About</Link>
              </li>
              <li className="px-2 py-2 hover:bg-sky-500 rounded-lg">
                <Link href="#experience">Experience </Link>
              </li>

              <li className="px-2 py-2 hover:bg-sky-500 rounded-lg">
                <Link href="#projects">Projects</Link>
              </li>
              <li className="px-2 py-2 hover:bg-sky-500 rounded-lg">
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
