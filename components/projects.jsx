import Image from "next/image";
import Link from "next/link";

const Projects = () => {
  return (
    <section className=" w-11/12 m-auto text-black text-xl text-center">
      <p className="px-8 py-8 text-black text-xl text-center"> Recent Projects</p>
      <div className="flex flex-wrap justify-around">
        <div className="flex flex-col px-8 py-4 my-4 border-slate-200 border-2 rounded-lg">
          <Image
            src="/sbt.jpg"
            className="rounded-2xl m-auto shadow-2xl"
            width={250}
            height={100}
            alt="Jamal's Picture"
          />
          <h3 className="mt-4">JILTicketing</h3>
          <p className="my-2 text-sm">
            I built the Backend Of this project using Django and Mysql.<br></br>
            It is a Platform for booking Train Tickets.
          </p>
          <div className="my-2 flex justify-evenly">
            <Link href="https://www.github.com/captjay98/jilticketing">
              <p className="py-2 px-2 w-20 rounded-2xl border-2 border-gray-200 hover:bg-slate-300 hover:text-sm">
                Github
              </p>
            </Link>
            <Link href="https://www.jilticketing.onrender.com/">
              <p className="py-2 px-2 w-20 rounded-2xl border-2 border-gray-200 hover:bg-slate-300 hover:text-sm">
                Live
              </p>
            </Link>
          </div>
        </div>
        <div className="px-8 py-4 my-4 border-slate-200 border-2 rounded-lg">
          <Image
            src="/js.jpg"
            className="rounded-2xl m-auto shadow-2xl"
            width={250}
            height={100}
            alt="Jamal's Picture"
          />

          <h3>Kalbites</h3>
          <p className="text-sm">
            The Backend was built with NodeJs and MongoDb, there are 3 different frontends,
            <br></br>
            One is built with jsx and bundles with the ExpressJs Backend, <br></br>
            The ExpressJs Backend serves as an Api Server in the other two built with React and
            NextJs13.<br></br>It is a Goodies shopping Platform.
            {/* https://kalbites.vercel.app/ */}
          </p>
          <div className="my-2 flex justify-evenly">
            <p className="py-2 px-2 w-20 rounded-2xl border-2 border-gray-200 hover:bg-slate-300 hover:text-sm">
              Github
            </p>
            <p className="py-2 px-2 w-20 rounded-2xl border-2 border-gray-200 hover:bg-slate-300 hover:text-sm">
              Live
            </p>
          </div>
        </div>
        <div className="px-8 py-4 my-4 border-slate-200 border-2 rounded-lg">
          <Image
            src="/sbt.jpg"
            className="rounded-2xl m-auto shadow-2xl"
            width={250}
            height={100}
            alt="Jamal's Picture"
          />
          {/* https://sbtravels.vercel.app/ */}

          <h3>SBTravels</h3>
          <p className="text-sm">This was built with the latest NextJs13</p>
          <div className="my-2 flex justify-evenly">
            <p className="py-2 px-2 w-20 rounded-2xl border-2 border-gray-200 hover:bg-slate-300 hover:text-sm">
              Github
            </p>
            <p className="py-2 px-2 w-20 rounded-2xl border-2 border-gray-200 hover:bg-slate-300 hover:text-sm">
              Live
            </p>
          </div>
        </div>

        <div className="px-8 py-4 my-4 border-slate-200 border-2 rounded-lg">
          <Image
            src="/sbt.jpg"
            className="rounded-2xl m-auto shadow-2xl"
            width={250}
            height={100}
            alt="Jamal's Picture"
          />

          <h3>Interview Node</h3>
          <p className="text-sm">
            This is an Api server for a Job Platform built with ExpressJs and MongoD.<br></br>
            It has most of the feature available on most Job Platforms.
            {/* https://inter-view-production.up.railway.app/ */}
          </p>
          <div className="my-2 flex justify-evenly">
            <p className="py-2 px-2 w-20 rounded-2xl border-2 border-gray-200 hover:bg-slate-300 hover:text-sm">
              Github
            </p>
            <p className="py-2 px-2 w-20 rounded-2xl border-2 border-gray-200 hover:bg-slate-300 hover:text-sm">
              Live
            </p>
          </div>
        </div>
        <div className="px-8 py-4 my-4 border-slate-200 border-2 rounded-lg">
          <Image
            src="/js.jpg"
            className="rounded-2xl m-auto shadow-2xl"
            width={250}
            height={100}
            alt="Jamal's Picture"
          />
          <h3>Interview Django</h3>
          <p className="text-sm">
            This is the same project as the previous one, built with Django, Django-Rest-Framework
            and Postgres-Sql.
            {/* https://ab-prj1-production.up.railway.app/ */}
          </p>
          <div className="my-2 flex justify-evenly">
            <p className="py-2 px-2 w-20 rounded-2xl border-2 border-gray-200 hover:bg-slate-300 hover:text-sm">
              Github
            </p>
            <p className="py-2 px-2 w-20 rounded-2xl border-2 border-gray-200 hover:bg-slate-300 hover:text-sm">
              Live
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
