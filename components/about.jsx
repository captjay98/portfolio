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
          <p className="text-md/4 py-2 px-2">BSc Computer Science</p>
          <p className="text-md/4 py-2 px-2">ALX SE Certified Software Engineer</p>
        </div>
      </div>
      <div className="mx-5 my-4 ">
        <p
          className="indent-4 w-11/12 my-4 px-8 py-8 m-auto bg-gray-100 dark:bg-slate-900 text-center 
         text-sm/6 border-white shadow-2xl  dark:shadow-2xl rounded-2xl dark:border-slate-800"
        >
          Since my childhood, I've been a tech geek with an insatiable curiosity for all things,
          especially digital. It was clear to me from an early age that my future lay in the world
          of technology; I just hadn't quite figured out the specific path I wanted to take. My
          proper journey into the tech world, began with me spending countless hours tinkering with
          custom ROMs, bricking and unbricking my devices.{" "}
        </p>
        <p
          className="indent-4 w-11/12 my-4 px-8 py-8 m-auto bg-gray-100 dark:bg-slate-900 text-center 
         text-sm/6 border-white shadow-2xl  dark:shadow-2xl rounded-2xl dark:border-slate-800"
        >
          This hands-on experience not only further fueled my passion for technology but also
          sparked my desire to dive deeper into the realm of software development. In 2019, I made
          the pivotal decision to pursue a career in software engineering. Following my university
          education, I embarked on a transformative journey by enrolling in the ALX Software
          Engineering program.{" "}
        </p>
        <p
          className="indent-4 w-11/12 my-4 px-8 py-8 m-auto bg-gray-100 dark:bg-slate-900 text-center 
         text-sm/6 border-white shadow-2xl  dark:shadow-2xl rounded-2xl dark:border-slate-800"
        >
          Since then, I've been dedicated to expanding my knowledge and skills, constantly pushing
          the boundaries of what I can achieve in the world of software. Today, I proudly stand as a
          software engineer with a deep-rooted passion for technology, a commitment to lifelong
          learning, and a desire to make a meaningful impact through my work. Join me on this
          exciting journey as we explore the endless possibilities of the tech world together.
        </p>
      </div>
    </section>
  );
};

export default About;
