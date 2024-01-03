import { Analytics } from "@vercel/analytics/react";
import "@styles/globals.css";
import { Raleway } from "next/font/google";
const raleway = Raleway({
  weight: "400,500,600,700",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Code Captain",
  description: "Jamal Ibrahim Umar's online Portfolio",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-black text-slate-200">
        <div className="main"></div>
        <main className={raleway.className}>
          {children} <Analytics />
        </main>
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
// import { Montserrat } from "next/font/google";
//
//const montserrat = Montserrat({
//   weight: "400",
//   subsets: ["latin"],
// });

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
