import Image from "next/image";

const Experience = () => {
  return (
    <section
      id="experience"
      className="w-[99%] tracking-wide m-auto pt-5 pb-10 my-4 rounded-lg dark:shadow-lg text-slate-800 
            dark:text-slate-300  dark:bg-slate-900/30 dark:bg-gradient-to-br from-gray-700/50 via-transparent  

      "
    >
      <p className="px-8 py-8 text-2xl font-semibold text-center dark:text-slate-300">
        Some Technologies I Work With
      </p>
      <div className=" font-light tracking-wide w-11/12 m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div
          className="px-4 py-4 my-4 w-10/12 m-auto rounded-lg
           shadow-2xl shadow-current dark:shadow-gray-700 
           from-gray-500/50 bg-gray-100/10 bg-gradient-to-tl
           dark:bg-gray-700/50 dark:bg-gradient-to-tr dark:from-gray-700/50 via-transparent"
        >
          <h4 className="pb-4 px-2 text-lg font-bold dark:text-slate-400">Frontend</h4>
          <div className="flex ">
            <Image
              src="/html5.svg"
              className=" py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">HTML</p>
          </div>
          <div className="flex ">
            <Image
              src="/css3.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">CSS</p>
          </div>
          <div className="flex ">
            <Image
              src="/javascript.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">JavaScript </p>
          </div>
          <div className="flex ">
            <Image
              src="/vue.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Vue.js</p>
          </div>

          <div className="flex ">
            <Image
              src="/react.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">React.js</p>
          </div>
          <div className="flex ">
            <Image
              src="/next.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Next.js</p>
          </div>
          <div className="flex ">
            <Image
              src="/tailwind.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">TailwindCSS</p>
          </div>
          {/* <div className="flex "> */}
          {/*   <Image */}
          {/*     src="/figma.svg" */}
          {/*     className="py-2 px-2 rounded-full shadow-2xl" */}
          {/*     width={40} */}
          {/*     height={30} */}
          {/*     alt="hamburger" */}
          {/*   /> */}
          {/*   <p className="px-2 py-4 text-md text-center">Figma</p> */}
          {/* </div> */}
        </div>

        <div
          className="px-4 py-4 my-4 w-10/12 m-auto rounded-lg
           shadow-2xl shadow-current dark:shadow-gray-700 
           from-gray-500/50 bg-gray-100/10 bg-gradient-to-tl
           dark:bg-gray-700/50 dark:bg-gradient-to-tr dark:from-gray-700/50 via-transparent"
        >
          <h4 className=" px-2 pb-4 text-lg font-bold  dark:text-slate-400">Backend</h4>
          <div className="flex ">
            <Image
              src="/django.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Django</p>
          </div>
          <div className="flex ">
            <Image
              src="/laravel.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Laravel</p>
          </div>
          <div className="flex ">
            <Image
              src="/node-js.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">NodeJs</p>
          </div>
          <div className="flex ">
            <Image
              src="/express.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">ExpressJs</p>
          </div>
          <div className="flex ">
            <Image
              src="/postgresql.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Postgres</p>
          </div>
          <div className="flex ">
            <Image
              src="/mysql.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">MySQL</p>
          </div>
          <div className="flex ">
            <Image
              src="/mongodb.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">MongoDB</p>
          </div>
        </div>

        <div
          className="px-4 py-4 my-4 w-10/12 m-auto rounded-lg
           shadow-2xl shadow-current dark:shadow-gray-700 
           from-gray-500/50 bg-gray-100/10 bg-gradient-to-tl
           dark:bg-gray-700/50 dark:bg-gradient-to-tr dark:from-gray-700/50 via-transparent"
        >
          <h4 className="px-2 pb-4 text-lg font-bold  dark:text-slate-400">Devops</h4>
          <div className="flex ">
            <Image
              src="/linux.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Linux</p>
          </div>
          <div className="flex ">
            <Image
              src="/github.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Git</p>
          </div>
          <div className="flex ">
            <Image
              src="/nginx.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">NginX</p>
          </div>
          <div className="flex ">
            <Image
              src="/nginx.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Apache</p>
          </div>
          <div className="flex ">
            <Image
              src="/docker.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Docker</p>
          </div>
          <div className="flex ">
            <Image
              src="/nixos.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Nix</p>
          </div>

          {/* <p>Haproxy</p> */}
          {/* <p>Gunicorn</p> */}
        </div>
        <div
          className="px-4 py-4 my-4 w-10/12 m-auto rounded-lg
           shadow-2xl shadow-current dark:shadow-gray-700 
           from-gray-500/50 bg-gray-100/10 bg-gradient-to-tl
           dark:bg-gray-700/50 dark:bg-gradient-to-tr dark:from-gray-700/50 via-transparent"
        >
          <h4 className="px-2 pb-4 text-lg font-bold  dark:text-slate-400">Languages</h4>
          <div className="flex ">
            <Image
              src="/python.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Python</p>
          </div>

          <div className="flex ">
            <Image
              src="/php.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">PHP</p>
          </div>

          <div className="flex ">
            <Image
              src="/javascript.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Javascript</p>
          </div>

          <div className="flex ">
            <Image
              src="/typescript.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">TypeScript</p>
          </div>

          <div className="flex ">
            <Image
              src="/c-solid.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">C</p>
          </div>
          <div className="flex ">
            <Image
              src="/rust.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Rust</p>
          </div>

          <div className="flex ">
            <Image
              src="/bash.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Bash</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
