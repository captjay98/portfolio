import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <section
      id="home"
      className="lg:h-auto w-[99%] md:py-10 animate-pulse repeat-1 my-2 m-auto rounded-md shadow-2xl mt-0 px-8 py-1 flex flex-wrap
      bg-gray-900/10
         dark:bg-slate-900/30 dark:bg-gradient-to-br from-gray-700/50 via-transparent   "
    >
      <div className="flex flex-col justify-center py-10 m-auto my-4 max-sm:mt-28 max-sm:mx-2 max-sm:w-full">
        <p className="font-light tracking-wide leading-normal text-black lg:text-3xl lg:leading-tight max-sm:text-[1.2rem] text- md:text-[21px] dark:text-slate-400">
          Hey there,<br></br> I am{" "}
          <span className="text-blue-600 font-italic max-sm:text-[1.6rem] md:text-[28px] lg:text-[40px]">
            Jamal Ibrahim Umar,
          </span>{" "}
          <br></br>
          <span class="leading-loose">A FullStack Software Engineer.</span>
        </p>
        <div className="flex justify-center pt-6 space-x-4 h-20">
          <Link href="https://www.github.com/captjay98">
            <Image
              src="/github.svg"
              className="w-10 h-auto rounded-full shadow-2xl hover:w-12 shadow-blue-500 dark:bg-blue-500/70"
              width={35}
              height={35}
              alt="Github Logo"
            />
          </Link>
          <Link href="https://www.linkedin.com/in/captjay98">
            <Image
              src="/linkedin.svg"
              className="w-10 w-full h-auto h-full rounded-full shadow-2xl hover:w-12 shadow-blue-500 dark:bg-blue-500/70"
              width={35}
              height={35}
              loading="eager"
              alt="Linkedin Logo"
            />
          </Link>
        </div>
      </div>
      <div className="m-auto rounded-full max-sm:my-1 max-sm:w-[350px] lg:w-[350px]">
        <Image
          src="/jamalbaby.webp"
          className="m-auto rounded-md shadow-2xl shadow-gray-900"
          width={300}
          height={200}
          alt="A picture of Jamal "
          loading="eager"
        />
        {/* jamal.webp */}
      </div>
    </section>
  );
};

export default Home;
