import Image from "next/image";

const Home = () => {
  return (
    <section className=" bg-gray-100 shadow-2xl rounded-2xl w-11/12 m-auto mt-10 px-5 py-5 flex flex-wrap ">
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
        <p className="px-4 text-black text-xl text-center ">
          Hey there,<br></br> I am Jamal Ibrahim Umar <br></br>A FullStack Software Engineer.
          {/* Add Social Links  */}
          {/* fix typography */}
          {/* add hamburger */}
          {/* Add previous projects images */}
          {/* Add languages and tools icons */}
          {/* Add prvious projects live and github link */}
          {/* ADD email and phone number to reach out */}
        </p>
        <div className="pt-2 flex justify-center space-x-4">
          <Image
            src="/github.svg"
            className="rounded-full shadow-2xl"
            width={35}
            height={35}
            alt="Jamal's Picture"
          />

          <Image
            src="/linkedin.svg"
            className="rounded-full shadow-2xl"
            width={35}
            height={35}
            alt="Jamal's Picture"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
