import Image from "next/image";
import Link from "next/link";

const Projects = () => {
  return (
    <section
      id="projects"
      className=" tracking-wide w-[99%] m-auto my-8 py-14 bg-gray-100 dark:bg-slate-900 rounded-lg shadow-lg text-slate-800 dark:text-slate-300 text-xl text-center"
    >
      <p className="px-8 py-8 text-2xl font-semibold text-center"> Recent Projects</p>
      <div className="font-light tracking-wide flex flex-wrap justify-around">
        <div className="px-8 py-4 my-4 border-slate-200 dark:border-slate-800 border-2 rounded-lg">
          <Image
            src="/sbtravel.JPG"
            className="rounded-2xl m-auto shadow-2xl"
            width={450}
            height={150}
            alt="SbTravel Picture"
          />

          <h3 className="py-4 text-xl font-">SBTravels</h3>
          <p className="text-sm py-2">This was built with the latest NextJs13</p>
          <div className="my-2 py-2 flex justify-evenly">
            <Link href="https://www.github.com/captjay98/sbtravels">
              <p className="py-2 px-2  rounded-2xl border-2 border-gray-200 dark:border-slate-800 hover:bg-slate-300 hover:translate-x-2">
                Github
              </p>
            </Link>
            <Link href="https://sbtravels.vercel.app/ ">
              <p className="py-2 px-2 w-20 rounded-2xl border-2 border-gray-200 dark:border-slate-800 hover:bg-slate-300 hover:translate-x-2">
                Live
              </p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col px-8 py-4 my-4 border-slate-200 dark:border-slate-800 border-2 rounded-lg">
          <Image
            src="/jil.JPG"
            className="rounded-2xl m-auto shadow-2xl"
            width={450}
            height={150}
            alt="JILTicketing Picture"
          />
          <h3 className="py-4 font-xl">JILTicketing</h3>
          <p className="my-2 text-sm">
            I built the Backend Of this project using Django and Mysql.<br></br>
            It is a Platform for booking Train Tickets.
          </p>
          <div className="my-2 flex justify-evenly">
            <Link href="https://www.github.com/captjay98/jilticketing">
              <p className="py-2 px-2 rounded-2xl border-2 border-gray-200 dark:border-slate-800 hover:bg-slate-300 hover:translate-x-2">
                Github
              </p>
            </Link>
            <Link href="https://jilticketing.onrender.com">
              <p className="py-2 px-2 w-20 rounded-2xl border-2 border-gray-200 dark:border-slate-800 hover:bg-slate-300 hover:translate-x-2">
                Live
              </p>
            </Link>
          </div>
        </div>
        <div className="px-8 py-4 my-4 border-slate-200 dark:border-slate-800 border-2 rounded-lg">
          <Image
            src="/inter.JPG"
            className="rounded-2xl m-auto shadow-2xl"
            width={450}
            height={150}
            alt="Interview Django Picture"
          />
          <h3 className="py-4 text-xl tracking-wide">Interview Django</h3>
          <p className="text-sm py-4">
            This is an Api server for a Job Platform <br></br> built with, Django,
            Django-Rest-Framework and Postgres-Sql.
            <br></br>It has most of the features available on most Job Platforms.
          </p>
          <div className="my-2 flex justify-evenly">
            <Link href="https://www.github.com/captjay98/arb-prj1">
              <p className="py-2 px-2 rounded-2xl border-2 border-gray-200 dark:border-slate-800 hover:bg-slate-300 hover:translate-x-2">
                Github
              </p>
            </Link>
            <Link href="https://ab-prj1-production.up.railway.app/ ">
              <p className="py-2 px-2 w-20 rounded-2xl border-2 border-gray-200 dark:border-slate-800 hover:bg-slate-300 hover:translate-x-2">
                Live
              </p>
            </Link>
          </div>
        </div>

        <div className="px-8 py-4 my-4 border-slate-200 border-2 dark:border-slate-800 rounded-lg">
          <Image
            src="/inter.JPG"
            className="rounded-2xl m-auto shadow-2xl"
            width={450}
            height={150}
            alt="Interview Node Picture"
          />
          <h3 className="py-4 font-normal">Interview Node</h3>
          <p className="text-sm py-4">
            This is the same project as the previous, built with ExpressJs and MongoD.<br></br>
          </p>
          <div className="my-2 flex justify-evenly">
            <Link href="https://www.github.com/captjay98/inter-view">
              <p className="py-2 px-2 rounded-2xl border-2 border-gray-200 dark:border-slate-800 hover:bg-slate-300  hover:translate-x-2">
                Github
              </p>
            </Link>
            <Link href="https://inter-view-production.up.railway.app/">
              <p className="py-2 px-2 w-20 rounded-2xl border-2 border-gray-200 dark:border-slate-800 hover:bg-slate-300  hover:translate-x-2">
                Live
              </p>
            </Link>
          </div>{" "}
        </div>

        <div className="px-8 py-4 my-4 border-slate-200 dark:border-slate-800  border-2 rounded-lg">
          <Image
            src="/bitesjs.JPG"
            className="rounded-2xl m-auto shadow-2xl"
            width={250}
            height={100}
            alt="Kalbites Picture"
          />

          <h3 className="py-4 font-normal">Kalbites</h3>
          <p className="text-sm/6 w-10/12 m-auto py-2">
            The Backend was built with NodeJs and MongoDb.
            <br></br>
            There are 3 different frontends,
            <br></br>
            one is built with jsx and bundles with the ExpressJs Backend.
            <br></br>
            The ExpressJs Backend serves as an Api Server, <br></br>for the other two built with
            React and NextJs13.<br></br>It is a Goodies shopping Platform.
          </p>
          <div className="my-2 py-2 flex justify-evenly">
            <Link href="https://www.github.com/captjay98/kalbites-js">
              <p className="py-2 px-2 rounded-2xl border-2 border-gray-200 dark:border-slate-800 hover:bg-slate-300  hover:translate-x-2">
                Github
              </p>
            </Link>
            <Link href="https://kalbites.vercel.app/ ">
              <p className="py-2 px-2 w-20 rounded-2xl border-2 border-gray-200 dark:border-slate-800 hover:bg-slate-300 hover:translate-x-2">
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
