import Image from "next/image";

const About = () => {
  return (
    <section className="bg-gray-100 shadow-2xl rounded-2xl w-11/12 m-auto my-8 py-4 text-slate-700">
      <div className="mx-5 mt-5 ">
        <p className="px-8 py-2  text-slate-700 text-md text-center">A little More</p>
        <p className="px-8 mb-6 text-slate-700 text-2xl text-center">About Me</p>
      </div>

      <div className="my-4 flex flex-wrap justify-around ">
        <div className="bg-gray-100 flex w-72 flex-col shadow-2xl px-4 py-8 my-4 border-2 border-t-slate-300 border-l-gray-300 rounded-2xl">
          <h4 className="pb-4 text-base font-bold text-center ">Experience</h4>
          <p>2+ Years Backend Development</p>
          <p>2+ Years Frontend Development</p>
          <p>2+ Years Devops</p>
          <p></p>
        </div>
        <div className=" my-4 ">
          <Image
            src="/jamal2.jpg"
            className="rounded-2xl border-2 border-slate-200 shadow-2xl "
            width={200}
            height={150}
            alt="Jamal's Picture"
          />
        </div>

        <div className="bg-gray-100 my-4 w-72 shadow-2xl px-4 py-8 border-2 border-b-slate-300 border-r-gray-300 rounded-2xl">
          <h4 className="pb-4 text-lg font-bold text-center">Education</h4>
          <p>BSc Computer Science</p>
          <p>ALX SE Certified Software Engineer</p>
        </div>
      </div>
      <div className="mx-5 my-4 ">
        <p className="w-11/12 px-8 py-4 m-auto bg-gray-100 text-center border-white shadow-2xl rounded-2xl">
          I have been a tech geek since i was a kid, I knew from an early age i will have a future
          in tech, i just couldn't figure out what i wanted to do. I spent years playing with custom
          roms and kernels on my devices. It was in 2019 i decided to go into software engineering,
          after university, i enrolled in Alx Se and i have been expanding my horizon.
        </p>
      </div>
    </section>
  );
};

export default About;
