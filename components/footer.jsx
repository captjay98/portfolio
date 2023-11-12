const Footer = () => {
  return (
    <footer className=" w-[99%] m-auto my-8 dark:bg-slate-900 dark:border-slate-800 shadow-lg rounded-lg border-2 border-slate-200">
      <div class=" p-4 text-center text-slate-800 dark:bg-slate-900 dark:text-slate-300">
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
