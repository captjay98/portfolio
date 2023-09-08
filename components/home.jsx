import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <section className=" w-11/12 animate-pulse repeat-1 my-8 m-auto bg-gray-100 dark:bg-slate-900 rounded-2xl shadow-2xl mt-10 px-5 py-5 flex flex-wrap ">
      <div className="m-auto ">
        <Image
          src="/jamal.jpg"
          className="rounded-full shadow-2xl"
          width={250}
          height={100}
          alt="A picture of Jamal wearing glasses"
        />
      </div>
      <div className=" flex flex-col justify-center m-auto my-4 py-8 ">
        <p className="px-4 font-light tracking-wide text-black dark:text-slate-200 text-xl text-center ">
          Hey there,<br></br> I am Jamal Ibrahim Umar <br></br>A FullStack Software Engineer.
          {/* Add Social Links  */}
          {/* fix typography */}
          {/* add hamburger */}
          {/* Add previous projects images */}
          {/* Add languages and tools icons */}
          {/* Add prvious projects live and github link */}
          {/* ADD email and phone number to reach out */}
        </p>
        <div className="pt-6 flex justify-center space-x-4">
          <Link href="https://www.github.com/captjay98">
            <Image
              src="/github.svg"
              className="rounded-full shadow-2xl"
              width={35}
              height={35}
              alt="Jamal's Picture"
            />
          </Link>
          <Link href="https://www.linkedin.com/in/captjay98">
            <Image
              src="/linkedin.svg"
              className="rounded-full shadow-2xl"
              width={35}
              height={35}
              alt="Jamal's Picture"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
