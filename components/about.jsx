import Image from "next/image";

const About = () => {
  return (
    <section
      id="about"
      className="w-11/12 animate-bounce repeat-1 m-auto my-8 bg-gray-100 dark:bg-slate-900 rounded-2xl shadow-2xl py-4 text-slate-800 dark:text-slate-200"
    >
      <div className="mx-5 mt-5 ">
        <p className="px-8 py-2 font-normal text-sm text-center">A little More</p>
        <p className="px-8 mb-6 font-normal text-2xl text-center">About Me</p>
      </div>

      <div className="my-4 flex flex-wrap justify-around font-light tracking-wide">
        <div
          className="bg-gray-100 dark:bg-slate-900 flex w-76 flex-col shadow-2xl dark:shadow-2xl rounded-2xl px-4 py-8 my-4 
          border-2 border-t-slate-300 border-l-gray-300 dark:border-slate-800 "
        >
          <h4 className="pb-4 font-normal text-center ">Experience</h4>
          <p className="text-md/4 py-2 px-2">2+ Years Backend Development</p>
          <p className="text-md/4 py-2 px-2">2+ Years Frontend Development</p>
          <p className="text-md/4 py-2 px-2">2+ Years Devops</p>
        </div>
        <div className=" my-4 ">
          <Image
            src="/jamal2.jpg"
            className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl "
            width={200}
            height={150}
            alt="Jamal's Picture"
          />
        </div>

        <div
          className="bg-gray-100 dark:bg-slate-900 my-4 w-76 shadow-2xl dark:shadow-2xl px-4 py-8
          border-2 border-b-slate-300 border-r-gray-300 rounded-2xl dark:border-slate-800"
        >
          <h4 className="pb-4 text-lg font-normal text-center">Education</h4>
          <p className="text-md/4 py-2 px-2">B.S.c Computer Science</p>
          <p className="text-md/4 py-2 px-2">ALX SE Certified Software Engineer</p>
        </div>
      </div>
      <div className="mx-5 my-4 ">
        <p
          className="indent-4 w-11/12 px-8 py-8 m-auto bg-gray-100 dark:bg-slate-900 text-center 
         text-sm/6 border-white shadow-2xl  dark:shadow-2xl rounded-2xl dark:border-slate-800"
        >
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
