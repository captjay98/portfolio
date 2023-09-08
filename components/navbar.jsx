"use client";
import { useState } from "react";
import Image from "next/image";

const NavBar = () => {
  const [drop, toggleDrop] = useState(false);
  return (
    <>
      <nav
        className=" font-light tracking-wide w-11/12 h-20 m-auto shadow-xl rounded-2xl flex sticky justify-around
        text-slate-800 dark:text-slate-200"
      >
        <div className="logo">
          <h3 className="py-4 px-2 text-2xl dark:text-slate-200">Capt Jay</h3>
        </div>
        <div className="md:flex hidden navbaritems">
          <ul className="py-5 px-2 mb-4 flex space-x-3 ">
            <li
              className="px-2 underline-offset-4 hover:py-2 hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-600 rounded-lg"
            >
              Home
            </li>
            <li
              className="px-2 underline-offset-4 hover:py-2 hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-600 rounded-lg"
            >
              About
            </li>
            <li
              className="px-2  underline-offset-4 hover:py-2 hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-600 rounded-lg"
            >
              Experience
            </li>
            <li
              className="px-2 underline-offset-4 hover:py-2 hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-600 rounded-lg"
            >
              Projects
            </li>
            <li
              className="px-2 underline-offset-4 hover:py-2 hover:underline hover:decoration-slate-800 hover:decoration-2
               dark:hover:underline dark:hover:decoration-slate-400  dark:hover:text-slate-600  rounded-lg"
            >
              Contact
            </li>
          </ul>
        </div>
        <div className="md:hidden flex h-16 ">
          <Image
            src="/bars.svg"
            className="py-5 px-5 animate-pulse"
            width={60}
            height={40}
            alt="hamburger"
            onClick={() => toggleDrop((prev) => !prev)}
          />
          {drop && (
            <ul className=" h-56 animate-bounce repeat-1 shadow-2xl pl-1 pr-5 py-2 rounded-lg mr-6 absolute top-20">
              <li className="px-2 py-2 hover:bg-sky-500 rounded-lg">Home</li>
              <li className="px-2 py-2 hover:bg-sky-500 rounded-lg">About</li>
              <li className="px-2 py-2 hover:bg-sky-500 rounded-lg">Experience</li>
              <li className="px-2 py-2 hover:bg-sky-500 rounded-lg">Projects</li>
              <li className="px-2 py-2 hover:bg-sky-500 rounded-lg">Contact</li>
            </ul>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
