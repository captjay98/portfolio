const Footer = () => {
  return (
    <footer className=" w-[99%]  bg-gray-900/10 m-auto my-4 shadow-lg rounded-lg border-slate-200                                                    dark:bg-slate-900/30 dark:bg-gradient-to-br from-gray-700/50 via-transparent  ">
      <div class=" p-4 text-center text-slate-800 dark:text-slate-300">
        © 2023 Copyright
        <p class="text-slate-800 dark:text-slate-400">Jamal Ibrahim Umar</p>
      </div>
      <p className="px-2 py-2 text-xs text-slate-600 relative top-1 text-right">
        powered by nextjs13
      </p>

      <p className="px-2 py-2 text-xs text-slate-600 relative  bottom-1 text-right">
        built by thecodecaptain
      </p>
    </footer>
  );
};

export default Footer;
