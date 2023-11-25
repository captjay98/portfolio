import Image from "next/image";

const About = () => {
  return (
    <section
      id="about"
      className="w-[99%] tracking-wide animate-pulse repeat-1 m-auto my-8 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-2xl py-4 text-slate-800 dark:text-slate-200"
    >
      <div className="mx-5 mt-5 ">
        <p className="px-8 py-2 font-normal text-md tracking-wide text-center">A little More</p>
        <p className="px-8 mb-6 text-2xl text-center font-semibold tracking-wide">About Me</p>
      </div>

      <div
        className="flex flex-wrap xl:ml-36 xl: justify-center
        rounded-md items-center
        font-light tracking-wide "
      >
        <div
          className="
           md:w-[330px] max-sm:w-[99%] flex flex-col lg:h-[400px] justify-around rounded-md"
        >
          <div
            className="px-4 py-8  border dark:border-gray-800 dark:shadow-2xl rounded-md flex flex-col   
           "
          >
            <h4 className="pb-4 font-semibold text-center ">Experience</h4>
            <p className="text-md/4 py-4 px-2">3+ Years Backend Development</p>
            <p className="text-md/4 py-2 px-2">3+ Years Frontend Development</p>
            <p className="text-md/4 py-2 px-2">2+ Years Devops</p>
          </div>
          <div className="px-4 py-8   border dark:border-gray-800 dark:shadow-2xl rounded-md  flex flex-col">
            <h4 className="pb-4 text-lg font-semibold text-center">Education</h4>
            <p className="text-md/4 py-2 px-2">BSc Computer Science</p>
            <p className="text-md/4 py-2 px-2">ALX Certified Software Engineer</p>
          </div>
        </div>

        {/* <div className="w-96 my-4 bg-green-200"> */}
        {/*   <Image */}
        {/*     src="/jamal2.webp" */}
        {/*     className="rounded-lg border-2 border-slate-200 dark:border-slate-800 shadow-xl  w-auto h-auto" */}
        {/*     width={350} */}
        {/*     height={150} */}
        {/*     alt="Jamal's Picture" */}
        {/*   /> */}
        {/* </div> */}
        <div
          className="md:w-[550px] lg:w-[600px] w-[700px] overflow-auto h-[770px]
                    max-sm:w-[99%] max-sm:my-8
                    px-4 py-6 xl:ml-36 rounded-md"
        >
          <div
            className="rounded-md border dark:border-gray-800
            dark:shadow-2xl xl:px-12 px-4 flex flex-col
            justify-center items-center text-[14px]
            max-sm:px-4 py-8 max-sm:my-8 m-auto
            "
          >
            <p className="indent-8">
              Since my childhood, I've been a tech geek with an insatiable curiosity for all things,
              especially digital. It was clear to me from an early age that my future lay in the
              world of technology; I just hadn't quite figured out the specific path I wanted to
              take. My proper journey into the tech world, began with me spending countless hours
              tinkering with custom ROMs, bricking and unbricking my devices.
              <br></br>
              <br></br>
            </p>
            <p className="indent-8">
              This hands-on experience not only further fueled my passion for technology but also
              sparked my desire to dive deeper into the realm of software development. In 2019, I
              made the decision to pursue a career in software engineering. Following my university
              education, I embarked on a transformative journey by enrolling in the ALX Software
              Engineering program.
              <br></br>
              <br></br>
            </p>
            <p className="indent-8">
              Since then, I've been dedicated to expanding my knowledge and skills, constantly
              pushing the boundaries of what I can achieve in the world of software. Today, I
              proudly stand as a Software Engineer with a deep-rooted passion for technology, a
              commitment to lifelong learning, and a desire to make a meaningful impact through my
              work. Join me on this exciting journey as we explore the endless possibilities of the
              tech world together.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
