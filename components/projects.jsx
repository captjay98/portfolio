import Image from "next/image";
import Link from "next/link";

const Projects = () => {
  return (
    <section
      id="projects"
      className=" tracking-wide w-[99%] m-auto my-4 py-14 
                rounded-lg dark:shadow-lg text-slate-800 dark:text-slate-300 text-xl text-center
                dark:bg-slate-900/30 dark:bg-gradient-to-tr from-gray-700/50 via-transparent   "
    >
      <p className="py-8 px-8 text-2xl font-semibold text-center">
        {" "}
        Recent Projects
      </p>
      <div className="flex flex-wrap justify-around font-light tracking-wide">
        <div className="flex flex-col py-4 px-4 my-4 rounded-lg shadow-2xl w-[400px] hover:shadow-gray-700">
          {" "}
          <Image
            src="/ticketer.png"
            className="m-auto w-auto h-auto rounded-md shadow-2xl"
            width={500}
            height={400}
            alt="Ticketer Picture"
          />
          <h3 className="py-2 mt-2 font-xl">Ticketer</h3>
          <p className="my-2 text-[12px]">
            I utilized Laravel and PostgreSQl for the Backend Of this project.
            The Frontend was buitlt with Inertiajs/Vue3. It is a Train Booking
            App with all the features required for a Booking Platform to work.
          </p>
          <div className="flex justify-evenly py-2 my-2">
            <Link href="https://www.github.com/captjay98/jobsite">
              <p className="py-1 px-1 w-24 tracking-wider rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-800 text-[16px] hover:text-slate-200">
                Github
              </p>
            </Link>
            <Link href="https://ticketer-captjay.koyeb.app/">
              <p className="py-1 px-1 w-24 tracking-wider rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-800 text-[16px] hover:text-slate-200">
                Live
              </p>
            </Link>
          </div>
        </div>

        <div className="flex flex-col py-4 px-4 my-4 rounded-lg shadow-2xl w-[400px] hover:shadow-gray-700">
          {" "}
          <Image
            src="/jobsite.webp"
            className="m-auto w-auto h-auto rounded-md shadow-2xl"
            width={500}
            height={400}
            alt="Ticketer Picture"
          />
          <h3 className="py-2 mt-2 font-xl">Jobsite</h3>
          <p className="my-2 text-[12px]">
            I built the Backend Of this project using Laravel and PGSQl. The
            Frontend was buitlt with Inertiajs/Vue3. It is a Jobsite with all
            the features required for a jobsite to work, Seeker, Employer and
            Admin Features.
          </p>
          <div className="flex justify-evenly py-2 my-2">
            <Link href="https://www.github.com/captjay98/jobsite">
              <p className="py-1 px-1 w-24 tracking-wider rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-800 text-[16px] hover:text-slate-200">
                Github
              </p>
            </Link>
            <Link href="https://jobsite-dev.1.us-1.fl0.io">
              <p className="py-1 px-1 w-24 tracking-wider rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-800 text-[16px] hover:text-slate-200">
                Live
              </p>
            </Link>
          </div>
        </div>

        <div className="flex flex-col py-4 px-4 my-4 rounded-lg shadow-2xl w-[400px] hover:shadow-gray-700">
          <Image
            src="/sbtravel.webp"
            className="m-auto w-auto h-auto rounded-md shadow-2xl"
            width={500}
            height={400}
            alt="SbTravel Picture"
          />

          <h3 className="py-2 mt-2 text-xl">SBTravels</h3>
          <p className="my-2 text-[12px]">
            This was built with the latest NextJs13<br></br>
            <br></br>
            <br></br>
            <br></br>
          </p>
          <div className="flex justify-evenly py-2 my-2">
            <Link href="https://www.github.com/captjay98/sbtravels">
              <p className="py-1 px-1 w-24 tracking-wider rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-800 text-[16px] hover:text-slate-200">
                Github
              </p>
            </Link>
            <Link href="https://sbtravels.vercel.app/ ">
              <p className="py-1 px-1 w-24 tracking-wider rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-800 text-[16px] hover:text-slate-200">
                {" "}
                Live
              </p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col py-4 px-4 my-4 rounded-lg shadow-2xl w-[400px] ] hover:shadow-gray-700">
          {" "}
          <Image
            src="/jil.webp"
            className="m-auto w-auto h-auto rounded-md shadow-2xl"
            width={500}
            height={400}
            alt="JILTicketing Picture"
          />
          <h3 className="py-2 mt-2 font-xl">JILTicketing</h3>
          <p className="my-2 text-[12px]">
            I built the Backend Of this project using Django and MySQL. It is a
            Platform for booking Train Tickets.
            <br></br>
            <br></br>
          </p>
          <div className="flex justify-evenly py-2 my-2">
            <Link href="https://www.github.com/captjay98/jilticketing">
              <p className="py-1 px-1 w-24 tracking-wider rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-800 text-[16px] hover:text-slate-200">
                Github
              </p>
            </Link>
            <Link href="https://jilticketing.onrender.com">
              <p className="py-1 px-1 w-24 tracking-wider rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-800 text-[16px] hover:text-slate-200">
                Live
              </p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4 px-4 my-4 rounded-lg shadow-2xl w-[400px] ] hover:shadow-gray-700">
          {" "}
          <Image
            src="/inter.webp"
            className="m-auto w-auto h-auto rounded-md shadow-2xl"
            width={500}
            height={400}
            alt="Interview Django Picture"
          />
          <h3 className="py-2 mt-2 text-xl tracking-wide">Interview Django</h3>
          <p className="py-2 text-[12px]">
            This is an Api server for a Job Platform built with, Django,
            Django-Rest-Framework and PostgreSQL. It has most of the features
            available on most Job Platforms.
            <br></br>
          </p>
          <div className="flex justify-evenly my-2">
            <Link href="https://www.github.com/captjay98/arb-prj1">
              <p className="py-1 px-1 w-24 tracking-wider rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-800 text-[16px] hover:text-slate-200">
                Github
              </p>
            </Link>
            {/* "https://jobsite-django.up.railway.app/" */}
            <Link href="https://jobsite-django.onrender.com/ ">
              <p className="py-1 px-1 w-24 tracking-wider rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-800 text-[16px] hover:text-slate-200">
                Live
              </p>
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between py-4 px-4 my-4 rounded-lg shadow-2xl w-[400px] ] hover:shadow-gray-700">
          {" "}
          <Image
            src="/inter.webp"
            className="m-auto w-auto h-auto rounded-md shadow-2xl"
            width={500}
            height={400}
            alt="Interview Node Picture"
          />
          <h3 className="py-2 mt-2 font-normal">Interview Node</h3>
          <p className="py-2 text-[12px]">
            This is the same project as the previous, built with ExpressJs and
            MongoD.<br></br>
            <br></br>
            <br></br>
          </p>
          <div className="flex relative bottom-0 justify-evenly my-2">
            <Link href="https://www.github.com/captjay98/inter-view">
              <p className="py-1 px-1 w-24 tracking-wider rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-800 text-[16px] hover:text-slate-200">
                Github
              </p>
            </Link>
            {/* "https://jobsite-express.up.railway.app/" */}
            <Link href="https://jobsite-express.onrender.com">
              <p className="py-1 px-1 w-24 tracking-wider rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-800 text-[16px] hover:text-slate-200">
                Live
              </p>
            </Link>
          </div>{" "}
        </div>

        <div className="flex flex-col justify-between py-4 px-4 my-4 rounded-lg shadow-2xl h-[600px] w-[400px] ] hover:shadow-gray-700">
          {" "}
          <Image
            src="/bitesjs.webp"
            className="rounded-md m-auto shadow-2xl w-[40%] h-auto"
            width={200}
            height={200}
            alt="Kalbites Picture"
          />
          <h3 className="py-2 my-2 font-normal">Kalbites</h3>
          <p className="py-2 m-auto text-[12px]">
            The Backend was built with NodeJs and MongoDb. There are 3 different
            frontends, one is built with jsx and bundles with the ExpressJs
            Backend. The ExpressJs Backend serves as an Api Server, for the
            other two built with React and NextJs13.It is a Goodies shopping
            Platform.
          </p>
          <div className="flex justify-evenly py-2 my-2">
            <Link href="https://www.github.com/captjay98/kalbites-js">
              <p className="py-1 px-1 w-24 tracking-wider rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-800 text-[16px] hover:text-slate-200">
                Github
              </p>
            </Link>
            <Link href="https://kalbites.vercel.app/ ">
              <p className="py-1 px-1 w-24 tracking-wider rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-800 text-[16px] hover:text-slate-200">
                Live
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
