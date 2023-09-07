import "@styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "The Code Captain",
  description: "Jamal Ibrahim Umar's online Portfolio",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" className="bg-gray-100 dark:bg-slate-900 text-slate-200">
      <body>
        <div className="main py-5"></div>
        <main className={inter.className}>{children}</main>
      </body>
    </html>
  );
};

// const poppins = Poppins({
//   weight: "400",
//   subsets: ["latin"],
// });

export default RootLayout;
