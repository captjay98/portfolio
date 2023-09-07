import Image from "next/image";

const Experience = () => {
  return (
    <section className="w-11/12 m-auto bg-gray-100 shadow-2xl rounded-2xl">
      <p className="px-8 py-8 text-black text-xl text-center">Some Technologies I Work With</p>
      <div className=" w-11/12 m-auto text-slate-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gray-100 shadow-2xl px-8 py-4 my-4 w-72 m-auto border-2 border-t-slate-300 border-l-gray-300 rounded-lg">
          <h4 className="pb-8 px-2 text-lg font-bold  ">Frontend</h4>
          <div className="flex ">
            <Image
              src="/html5.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">HTML</p>
          </div>
          <div className="flex ">
            <Image
              src="/css3-alt.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">CSS</p>
          </div>
          <div className="flex ">
            <Image
              src="/square-js.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">JavaScript </p>
          </div>
          <div className="flex ">
            <Image
              src="/react.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">React</p>
          </div>
          <div className="flex ">
            <Image
              src="/nextjs-line.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">NextJs13</p>
          </div>
          <div className="flex ">
            <Image
              src="/tailwindcss-plain.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">TailwindCSS</p>
          </div>
          <div className="flex ">
            <Image
              src="/figma-plain.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Figma</p>
          </div>
        </div>

        <div className="bg-gray-100 shadow-2xl px-8 py-4 my-4 m-auto w-72  border-2 border-t-slate-300 border-r-gray-300 rounded-lg">
          <h4 className=" px-2 pb-4 text-lg font-bold ">Backend</h4>
          <div className="flex ">
            <Image
              src="/django-plain.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Django</p>
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
              src="/express-original.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">ExpressJs</p>
          </div>
          <div className="flex ">
            <Image
              src="/postgresql-original.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Postgres</p>
          </div>
          <div className="flex ">
            <Image
              src="/mysql-original.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">MySQL</p>
          </div>
          <div className="flex ">
            <Image
              src="/mongodb-original.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">MongoDB</p>
          </div>
        </div>

        <div className="bg-gray-100 shadow-2xl m-auto w-72 px-8 py-4 my-4 border-2 border-b-slate-300 border-l-gray-300 rounded-lg">
          <h4 className="px-2 pb-4 text-lg font-bold ">Devops</h4>
          <div className="flex ">
            <Image
              src="/linux-plain.svg"
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
              src="/nginx-original.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">NginX</p>
          </div>
          <div className="flex ">
            <Image
              src="/docker-plain.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Docker</p>
          </div>
          <div className="flex ">
            <Image
              src="/nixos-plain.svg"
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
        <div className="bg-gray-100 shadow-2xl m-auto w-72 px-8 py-4 my-4 border-2 border-b-slate-300 border-r-gray-300 rounded-lg">
          <h4 className="px-2 pb-4 text-lg font-bold ">Languages</h4>
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
              src="/square-js.svg"
              className="py-2 px-2 rounded-full shadow-2xl"
              width={40}
              height={30}
              alt="hamburger"
            />
            <p className="px-2 py-4 text-md text-center">Javascript</p>
          </div>

          <div className="flex ">
            <Image
              src="/typescript-plain.svg"
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
              src="/bash-original.svg"
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
