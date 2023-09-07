"use client";
import { useState } from "react";
import Image from "next/image";

const NavBar = () => {
  const [drop, toggleDrop] = useState(false);
  return (
    <>
      <nav className="w-11/12 m-auto bg-gray-100 shadow-2xl rounded-2xl flex sticky justify-around text-gray-900 ">
        <div className="logo">
          <h3 className="bg-gray-100  py-4 px-2 text-2xl">Capt Jay</h3>
        </div>

        <div className="md:flex hidden navbaritems">
          <ul className="py-5 px-2 flex space-x-3 ">
            <li className="px-2 hover:border-b-2 hover:border-l-2 hover:border-slate-900 hover:text-slate-900 hover:px-2 rounded-lg">
              Home
            </li>
            <li className="px-2 hover:border-b-2 hover:border-slate-900 hover:text-slate-900 hover:px-2  rounded-lg">
              About
            </li>
            <li className="px-2 hover:border-b-2 hover:border-slate-900 hover:text-slate-900 hover:px-2  rounded-lg">
              Experience
            </li>
            <li className="px-2 hover:border-b-2 hover:border-slate-900 hover:text-slate-900 hover:px-2  rounded-lg">
              Projects
            </li>
            <li className="px-2 hover:border-b-2 hover:border-r-2 hover:border-slate-900 hover:text-slate-900 hover:px-2 rounded-lg">
              Contact
            </li>
          </ul>
        </div>
        <div className="md:hidden  flex h-16 ">
          <Image
            src="/bars.svg"
            className="py-5 px-5"
            width={60}
            height={40}
            alt="hamburger"
            onClick={() => toggleDrop((prev) => !prev)}
          />
          {drop && (
            <ul className=" h-56 shadow-2xl pl-1 pr-5 py-2 rounded-lg mr-6 absolute top-20">
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
