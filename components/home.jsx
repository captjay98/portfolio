import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <section
      id="home"
      className="lg:h-screen w-[99%] animate-pulse repeat-1 my-2 m-auto bg-gray-100 dark:bg-gray-900 rounded-lg shadow-2xl mt-0 px-8 py-1 flex flex-wrap "
    >
      <div className="flex flex-col max-sm:h-96 justify-center m-auto my-4 py-10 ">
        <p className=" text-3xl max-sm:text-xl pt-y px-4 font-light tracking-wide leading-normal text-black dark:text-slate-200  text-center ">
          Hey there,<br></br> I am{" "}
          <span className="text-blue-400 font-italic max-sm:text-[25px] text-[40px]">
            Jamal Ibrahim Umar,{" "}
          </span>{" "}
          <br></br>A FullStack Software Engineer.
        </p>
        <div className="pt-6 flex justify-center space-x-4">
          <Link href="https://www.github.com/captjay98">
            <Image
              src="/github.svg"
              className="rounded-full shadow-2xl w-auto h-auto"
              width={35}
              height={35}
              loading="eager"
              alt="Jamal's Picture"
            />
          </Link>
          <Link href="https://www.linkedin.com/in/captjay98">
            <Image
              src="/linkedin.svg"
              className="rounded-full shadow-2xl w-auto h-auto"
              width={35}
              height={35}
              loading="eager"
              alt="Jamal's Picture"
            />
          </Link>
        </div>
      </div>
      <div className="m-auto my-8  w-[350px] ">
        <Image
          src="/jamal.webp"
          className="rounded-lg shadow-2xl w-full h-auto"
          width={350}
          height={350}
          alt="A picture of Jamal wearing glasses"
        />
      </div>
    </section>
  );
};

export default Home;
