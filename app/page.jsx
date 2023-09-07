// import Image from "next/image";
// import Link from "next/link";
import Home from "@components/home";
import About from "@components/about";
import Experience from "@components/experience";
import Projects from "@components/projects";
import NavBar from "@components/navbar";
import Footer from "@components/footer";
const App = () => {
  return (
    <>
      <NavBar />
      <Home />
      <About />
      <Experience />
      <Projects />
      <section className="w-11/12 m-auto">
        <p className="px-8 py-8 text-black text-xl text-center">Reach Out</p>
      </section>

      <Footer />
    </>
  );
};
// EDUCATION
//Prestige, Danbo, Penfield, Esae Benin, ALX SE
//
//
// PROJECT LIST
// Jilticketing html css django
// kalbytes react express
// interview js express mongo
// interview py django postgres
// sbtravels nextjs
//
//LANGUAGES AND TOOLS
//Python, Javascript, TypeScript, C, RUST, BASH
//
//Django, Mysql, Postgres
//Node, Express, Mongodb
//Docker, Nginx, Linux
//
export default App;
