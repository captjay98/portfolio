import "@styles/globals.css";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Code Captain",
  description: "Jamal Ibrahim Umar' online Portfolio",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" className=" bg-gradient-to-r from-gray-900 via-blue-900 to-slate-900">
      <body>
        <div className="main"></div>
        <main className={roboto.className}>{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
