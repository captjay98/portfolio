import Image from "next/image";
import Link from "next/link";

const Projects = () => {
  const projects = [
    {
      name: "Kalbites",
      src: "/kalbites.jpg",
      alt: "Kalbites Picture",
      description:
        "Backend is currently built with Hono running on Bun with PostgreSQl as DB. The Backend was previously built with Express.js running on NodeJs with MongoDb as DB. The frontend is still React, previous one was built with JSX.",
      github: "https://www.github.com/captjay98/kalbites_frontend",
      live: "https://kalbites.vercel.app/",
    },

    {
      name: "Ticketer",
      src: "/ticketer.jpg",
      alt: "Ticketer Picture",
      description:
        "I utilized Laravel and PostgreSQl for the Backend Of this project. The Frontend was buitlt with Inertiajs/Vue3. It is a Train Booking App with all the features required for a Booking Platform to work.",
      github: "https://www.github.com/captjay98/jobsite",
      live: "https://ticketer.fly.dev/",
    },

    {
      name: "Raffle Suites",
      src: "/rafflesuites.webp",
      alt: "Raffle Suites Picture",
      description:
        "This is a Full-Stack App cooked up with nextjs14 with Top Notch SEO. It is also visually appealing and also has all the basic features required for a Hotel Website to work, with room for additional features.",
      github: "https://www.github.com/captjay98/rafflesuites",
      live: "https://raffle-suites.vercel.app/",
    },
    {
      name: "Bumsa Election Portal",
      src: "/bumsa.webp",
      alt: "Bumsa Picture",
      description:
        "I utilized Laravel and PostgreSQl for the Backend Of this project. The Frontend was buitlt with Inertiajs/Vue3. It is a Voting platform for BUK Medical Students Association Elections.",
      github: "https://www.github.com/captjay98/bumsa",
      live: "https://bumsa.fly.dev/",
    },

    {
      name: "Abata Crafts",
      src: "/abatacrafts.webp",
      alt: "AbataCrafs Picture",
      description:
        "This is an online Shop built with Medusajs. I added a Paytack Integration for payment, and also built a custom fullfillment provider for delivery from Kaduna using Public Transport delivery or Gig Logistics.",
      github: "https://www.github.com/captjay98/abatacrafts-storefront",
      live: "https://abatacrafts.vercel.app/",
    },
    {
      name: "Jobsite",
      src: "/jobsite.webp",
      alt: "Ticketer Picture",
      description:
        "I built the Backend Of this project using Laravel and PGSQl. The Frontend was buitlt with Inertiajs/Vue3. It is a Jobsite with all the features required for a jobsite to work, Seeker, Employer and Admin Features.",
      github: "https://www.github.com/captjay98/jobsite",
      live: "https://jobsiter.fly.dev",
    },

    {
      name: "SBTravels",
      src: "/sbtravel.webp",
      alt: "SBTravels Picture",
      description:
        "I built this  with the NextJs13. It is a website for a Trvael Agency, that wants to expand their reach and visibility. It is mostly an SSG site for now. But I left room for future Intergrations and Updates.",
      github: "https://www.github.com/captjay98/sbtravels",
      live: "https://sbtravels.vercel.app/",
    },

    {
      name: "Interview Django",
      src: "/inter.webp",
      alt: "Interview Django Picture",
      description:
        "This is an Api server for a Job Platform built with, Django, Django-Rest-Framework and PostgreSQL. It has most of the features available on most Job Platforms.",
      github: "https://www.github.com/captjay98/jobsite-django",
      live: "https://jobsite-django.onrender.com/",
    },
    {
      name: "Interview Node",
      src: "/inter.webp",
      alt: "Interview Node Picture",
      description:
        "This is the same project as the previous, built with ExpressJs and MongoDb. It has most of the features available on most Job Platforms.",
      github: "https://www.github.com/captjay98/jobsite-express",
      live: "https://jobsite-express.onrender.com",
    },
    {
      name: "JILTicketing",
      src: "/jil.webp",
      alt: "JILTicketing Picture",
      description:
        "I built the Backend Of this project using Django and MySQL. It is a Platform for booking Train Tickets In Nigeria(A dummy). A friend built the frontend",
      github: "https://www.github.com/captjay98/jilticketing",
      live: "https://jilticketing.onrender.com",
    },
  ];

  return (
    <section
      id="projects"
      className="tracking-wide w-[99%] m-auto my-4 py-14 
                rounded-lg dark:shadow-lg text-slate-800 dark:text-slate-300 text-xl text-center
                dark:bg-slate-900/30 dark:bg-gradient-to-tr from-gray-700/50 via-transparent   "
    >
      <p className="py-2 px-8 text-2xl font-semibold text-center"> Recent Projects</p>
      <div className="flex flex-wrap justify-around font-light tracking-wide">
        {projects.map((project) => (
          <div
            key={project.name}
            className="flex flex-col py-4 px-4 my-4 rounded-lg shadow-2xl max-h-[550px] w-[400px] hover:shadow-gray-700"
          >
            <Image
              src={project.src}
              className="m-auto w-auto max-h-[50%] rounded-md shadow-2xl"
              width={400}
              height={300}
              alt={project.alt}
            />
            <h3 className="py-2 mt-2 font-xl">{project.name}</h3>
            <p className="my-2 text-[12px]">{project.description}</p>
            <div className="flex justify-evenly py-2 my-2">
              <Link href={project.github}>
                <p className="py-1 px-1 w-24 tracking-wider rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-800 text-[16px] hover:text-slate-200">
                  Github
                </p>
              </Link>
              <Link href={project.live}>
                <p className="py-1 px-1 w-24 tracking-wider rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-800 text-[16px] hover:text-slate-200">
                  Live
                </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
