import { useEffect, useState } from "react";
import axios from "axios";
import ReservationCard from "./ReservationCard";

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return;

    const fetchReservations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/reservations/user/${storedUser.id_user}`,
          { withCredentials: true }
        );
        setReservations(res.data.reservations || []);
      } catch (err) {
        console.error(" Gagal mengambil data reservasi:", err);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (!user)
    return (
      <p className="text-center mt-20 text-gray-600 dark:text-gray-300">
        Silakan login untuk melihat reservasi Anda.
      </p>
    );

  if (loading)
    return <p className="text-center mt-20 text-gray-600 dark:text-gray-300">Loading...</p>;

  if (!Array.isArray(reservations) || reservations.length === 0)
    return (
      <p className="text-center mt-20 text-gray-600 dark:text-gray-300">
        You have no active reservations.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto mt-24 px-6 space-y-6">
      {reservations.map((r) => (
        <ReservationCard key={r.id_reservasi} data={r} />
      ))}
    </div>
  );
}
