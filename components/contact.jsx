import Image from "next/image";

const Contact = () => {
  return (
    <section className="w-11/12 bg-gray-100 dark:bg-slate-900 shadow-2xl rounded-2xl m-auto my-8">
      <p className="px-8 py-4 text-xl text-slate-800 dark:text-slate-300  text-center">Reach Out</p>

      <div className="flex items-center justify-center">
        <a
          className="px-8 py-4 "
          href="mailto:captjay98@gmail.com?subject=Contact/Inquiry&body=Hello Jamal."
        >
          <Image
            src="/envelope.svg"
            className="py-2 px-2 rounded-full shadow-2xl"
            width={40}
            height={30}
            alt="hamburger"
          />
        </a>
        <a
          className="px-8 py-4 "
          href="tel:+2348137443466
"
        >
          <Image
            src="/phone.svg"
            className="py-2 px-2 rounded-full shadow-2xl"
            width={40}
            height={30}
            alt="hamburger"
          />
        </a>
      </div>
    </section>
  );
};
export default Contact;
