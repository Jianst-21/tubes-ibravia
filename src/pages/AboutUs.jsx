import { Navbar } from "../components/GlobalPage/Navbar";
import { AboutTop } from "../components/AboutUs/AboutTop";
import { VillaSection } from "../components/AboutUs/VillaSection";
export const AboutUs = () => {
    return <div className=" min-h-screen overflow-x-hidden">

        {/* Theme Toggle */}
        {/* <ThemeToggle /> */}

        {/*Navbar*/}
        <Navbar />


        {/*Main Content*/}
        <main>
            <AboutTop />
            <VillaSection />

        </main>
        {/*Footer*/}


    </div>;

}