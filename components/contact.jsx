import Image from "next/image";

const Contact = () => {
  return (
    <section
      id="contact"
      className="w-[99%] dark:shadow-lg rounded-lg m-auto my-4 py-14
         bg-gray-900/10
          dark:bg-slate-700/50 from-gray-700/50 via-gray   "
    >
      <p className="px-8 py-4 text-xl text-slate-800 dark:text-slate-300  text-center">Reach Out</p>

      <div className="flex items-center justify-center text-slate-800 dark:text-slate-300 ">
        <a
          className="px-8 py-4 "
          href="mailto:captjay98@gmail.com?subject=Contact/Inquiry&body=Hello Jamal."
        >
          <p className="text-center py-2">Email</p>
          <Image
            src="/envelope.svg"
            className="py-2 px-2 rounded-full shadow-2xl"
            width={60}
            height={30}
            alt="hamburger"
          />
        </a>
        <a
          className="px-8 py-4 "
          href="tel:+2348137443466
"
        >
          <p className="text-center py-2">Call</p>
          <Image
            src="/phone.svg"
            className="py-2 px-2 rounded-full shadow-2xl"
            width={60}
            height={30}
            alt="hamburger"
          />
        </a>
      </div>
    </section>
  );
};
export default Contact;
