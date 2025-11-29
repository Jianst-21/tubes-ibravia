import { ThemeToggle } from "../components/GlobalPage/ThemeTooggle";
import { Navbar } from "../components/GlobalPage/Navbar";
import { HeroSection } from "../components/HomePage/HeroSection";
import { TrustedCollaboration } from "../components/HomePage/TrustedCollaboration";
import { WhyChooseUs } from "../components/HomePage/WhyChooseUs";
import { HouseCollections } from "../components/HomePage/HouseCollections";

import Footer from "../components/GlobalPage/Footer";

export const Home = () => {
  return (
    <div className=" min-h-screen overflow-x-hidden">
      {/* Theme Toggle */}
      {/* <ThemeToggle /> */}

      {/*Navbar*/}
      <Navbar />

      {/*Main Content*/}
      <main className="flex-grow">
        <HeroSection />
        <TrustedCollaboration />
        <WhyChooseUs />

        <HouseCollections />
      </main>
      {/*Footer*/}
      <Footer />
    </div>
  );
};
