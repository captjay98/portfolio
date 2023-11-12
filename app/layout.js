import "@styles/globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Code Captain",
  description: "Jamal Ibrahim Umar's online Portfolio",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" className="bg-gray-100 dark:bg-gray-900 text-slate-200">
      <body>
        <div className="main "></div>
        <main className={montserrat.className}>{children}</main>
      </body>
    </html>
  );
};

// const poppins = Poppins({
//   weight: "400",
//   subsets: ["latin"],
// });
// import { Lato } from "next/font/google";

// import { Inter } from "next/font/google";
// import { Poppins } from "next/font/google";
// import { Raleway } from "next/font/google";

// const roboto = Roboto({
//   weight: "400",
//   subsets: ["latin"],
// });

// const poppins = Poppins({
//   weight: "400",
//   subsets: ["latin"],
// });

// const raleway = Raleway({
//   weight: "400",
//   subsets: ["latin"],
// });

// const lato = Lato({
//   weight: "400",
//   subsets: ["latin"],
// });

// const inter = Inter({
//   subsets: ["latin"],
// });

export default RootLayout;
