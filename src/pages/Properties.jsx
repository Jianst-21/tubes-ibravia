import { Navbar } from "../components/GlobalPage/Navbar";
import { Top } from "../components/PropertiesPage/Top";
import { Block } from "../components/PropertiesPage/Block";
import Footer from "../components/GlobalPage/Footer";

export const Properties = () => {
    return <div className=" min-h-screen overflow-x-hidden">

        {/*Navbar*/}
        <Navbar />


        {/*Main Content*/}
        <main>
            <Top />
            <Block/>
        </main>
        {/*Footer*/}
        <Footer/>


    </div>;

}