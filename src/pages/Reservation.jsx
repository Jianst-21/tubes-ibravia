import { Navbar } from "../components/GlobalPage/Navbar";
import MyReservations from "../components/ReservationPage/MyReservations";
import Footer from "../components/GlobalPage/Footer";

export const Reservation = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/*Navbar*/}
      <Navbar />

      {/*Main Content*/}
      <main className="flex-grow">
        <MyReservations />
      </main>

      {/*Footer*/}
      <Footer />
    </div>
  );
};
