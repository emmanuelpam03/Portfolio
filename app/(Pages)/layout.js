import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default function PagesLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
