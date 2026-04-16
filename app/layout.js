import { Outfit, Ovo } from "next/font/google";
import "@/app/globals.css";

import { ToastProvider } from "@/app/components/ToastProvider";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ovo = Ovo({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "Portfolio Emmanuel Pam",
  description: "My Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${outfit.className} ${ovo.className} antialiased leading-8 overflow-x-hidden`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
