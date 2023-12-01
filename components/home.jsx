import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <section
      id="home"
      className="lg:h-auto w-[99%] animate-pulse repeat-1 my-2 m-auto rounded-md shadow-2xl mt-0 px-8 py-1 flex flex-wrap
      bg-gray-900/10
         dark:bg-slate-900/30 dark:bg-gradient-to-br from-gray-700/50 via-transparent   "
    >
      <div className="flex flex-col max-sm:mt-28 max-sm:mx-2 max-sm:w-full justify-center m-auto my-4  py-10 ">
        <p className="md:text-[21px] lg:text-3xl lg:leading-tight max-sm:text-[21px] font-light tracking-wide leading-normal text-black dark:text-slate-400  text- ">
          Hey there,<br></br> I am{" "}
          <span className="text-blue-600 font-italic max-sm:text-[26px] md:text-[28px] lg:text-[40px]">
            Jamal Ibrahim Umar,
          </span>{" "}
          <br></br>
          <span class="leading-loose ">A FullStack Software Engineer.</span>
        </p>
        <div className="pt-6 h-20 flex justify-center space-x-4">
          <Link href="https://www.github.com/captjay98">
            <Image
              src="/github.svg"
              className=" dark:bg-blue-500/70 rounded-full shadow-2xl shadow-blue-500 w-10 h-auto"
              width={35}
              height={35}
              alt="Jamal's Picture"
            />
          </Link>
          <Link href="https://www.linkedin.com/in/captjay98">
            <Image
              src="/linkedin.svg"
              className=" dark:bg-blue-500/70 rounded-full shadow-2xl shadow-blue-500 w-10 hover:w-12 h-auto"
              width={35}
              height={35}
              loading="eager"
              alt="Jamal's Picture"
            />
          </Link>
        </div>
      </div>
      <div className="m-auto my-8  max-sm:my-1 max-sm:w-[350px] lg:w-[350px] ">
        <Image
          src="/jamal.webp"
          className="rounded-md shadow-2xl w-full h-auto"
          width={350}
          height={350}
          alt="A picture of Jamal wearing glasses"
          loading="eager"
        />
      </div>
    </section>
  );
};

export default Home;
