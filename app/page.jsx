// import Image from "next/image";
// import Link from "next/link";
import Home from "@components/home";
import About from "@components/about";
import Experience from "@components/experience";
import Projects from "@components/projects";
import Contact from "@components/contact";
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
      <Contact />
      <Footer />
    </>
  );
};
export default App;
