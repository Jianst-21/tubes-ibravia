import { Navbar } from "../components/GlobalPage/Navbar";
import { AboutTop } from "../components/AboutUs/AboutTop";
import { VillaSection } from "../components/AboutUs/VillaSection";
import Footer from "../components/GlobalPage/Footer";
export const AboutUs = () => {
  return (
    <div className=" min-h-screen overflow-x-hidden">
      {/* Theme Tzoggle */}
      {/* <ThemeToggle /> */}

      {/*Navbar*/}
      <Navbar />

      {/*Main Content*/}
      <main>
        <AboutTop />
        <VillaSection />
      </main>
      {/*Footer*/}
      <Footer />
    </div>
  );
};
