import Footer from "./components/Footer";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function Layout() {
  return (
    <>
      <Header />
      <Toaster position="top-right" richColors />
      <div className="pt-16">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
