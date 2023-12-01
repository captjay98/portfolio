const About = () => {
  return (
    <section
      id="about"
      className="w-[99%] h-auto tracking-wide animate-pulse repeat-1 m-auto my-8 
      bg-gray-500/10
      rounded-lg dark:shadow-2xl py-4 text-slate-800 dark:text-slate-200
       dark:bg-slate-900/30 dark:bg-gradient-to-tr from-gray-700/50 via-transparent "
    >
      <div className="mx-5 mt-5 dark:text-slate-400">
        <p className="px-8 py-2 font-normal text-md tracking-wide text-center">A little More</p>
        <p className="px-8 mb-6 text-2xl text-center font-semibold tracking-wide">About Me</p>
      </div>

      <div
        className="flex flex-wrap xl:ml-36 mb-12 justify-center
        rounded-md items-center
        font-light tracking-wide "
      >
        <div
          className="
          md:w-[320px] lg:w-[330px] max-sm:w-[99%]  lg:-[400px] flex flex-wrap justify-around rounded-md mx-4"
        >
          <div
            className="h-60 mb-8 px-4 py-4 rounded-md flex flex-col justify-center 
            from-gray-500/50 bg-gray-100/10 bg-gradient-to-tl shadow-2xl dark:shadow-gray-800
            dark:text-slate-300 dark:bg-slate-900/30 dark:bg-gradient-to-br dark:from-gray-700/50 via-transparent                          "
          >
            <h4 className="pb-4 px-2 font-semibold text-left ">Experience</h4>
            <p className="text-md/2 py-2 pl-2">3+ Years Backend Development</p>
            <p className="text-md/2 py-2 pl-2">3+ Years Frontend Development</p>
            <p className="text-md/4 py-2 pl-2">2+ Years Devops</p>
          </div>
          <div
            className="h-60 px-4 py-4 rounded-md  flex flex-col justify-center dark:text-gray-300
            from-gray-500/50 bg-slate-100/10 bg-gradient-to-bl  shadow-2xl dark:shadow-gray-800
            dark:bg-slate-900/30 dark:bg-gradient-to-br dark:from-gray-700/50 via-transparent               "
          >
            <h4 className="pb-4 px-2 text-lg font-semibold text-left">Education</h4>
            <p className="text-md/4 py-2 pl-2">BSc Computer Science</p>
            <p className="text-md/4 py-2 pl-2">ALX Certified Software Engineer</p>
            <p className="text-md/4 py-2 pl-2">Youtube Champ</p>
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
          className="md:w-[400px] lg:w-[550px] w-[700px]h-[770px]
                    max-sm:w-[99%] max-sm:my-8  overflow-auto 
                    px-4 py-6 xl:ml-36 rounded-md"
        >
          <div
            className="rounded-md 
            xl:px-12 px-4 flex flex-col
            justify-center items-center text-[14px] dark:text-slate-300 
            max-sm:px-4 py-8 max-sm:my-8 m-auto
            from-gray-500/50  bg-gray-100/10 bg-gradient-to-tl dark:shadow-gray-800 dark:shadow-xl
            dark:bg-slate-900/30 dark:bg-gradient-to-br dark:from-gray-700/50 via-transparent   "
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
