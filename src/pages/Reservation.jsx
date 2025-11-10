import { Navbar } from "../components/GlobalPage/Navbar";
import MyReservations from "../components/ReservationPage/MyReservations";


export const Reservation = () => {
    return <div className=" min-h-screen overflow-x-hidden">

        {/* Theme Toggle */}
        {/* <ThemeToggle /> */}

        {/*Navbar*/}
        <Navbar />


        {/*Main Content*/}
        <main>
            <MyReservations />
            {/* <HeroSection />
            <TrustedCollaboration />
            <WhyChooseUs />
            <HouseCollections /> */}
        </main>
        {/*Footer*/}


    </div>;

}