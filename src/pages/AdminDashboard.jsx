import React, { useEffect, useState, useLayoutEffect } from "react";
import Sidebar from "../components/AdminDashboard/Sidebar";
import { BookText, BookCheck, BookX } from "lucide-react";
import ChartCard from "../components/AdminDashboard/ChartCard";
import axios from "axios";

/* ===============================
   COMPONENT: STAT CARD
================================= */
const StatCard = ({ title, value, type }) => {
  const icons = {
    reserved: (
      <BookText size={65} strokeWidth={1.5} className="text-white/90" />
    ),
    sold: <BookCheck size={65} strokeWidth={1.5} className="text-white/90" />,
    cancelled: <BookX size={65} strokeWidth={1.5} className="text-white/90" />,
  };

  const formatValue = (val) => {
    if (val === 0) return "0";
    if (val < 10) return `0${val}`;
    return val;
  };

  return (
    <div className="bg-[#0B3C78] text-white rounded-2xl shadow-md flex items-center justify-between p-4 sm:p-6 md:p-8 h-28 sm:h-32 md:h-36 transition-all duration-300">
      <div className="flex-shrink-0 opacity-90">{icons[type]}</div>
      <div className="text-right flex flex-col justify-center">
        <p className="text-sm md:text-base font-semibold tracking-wider uppercase opacity-80 mb-1">
          {title}
        </p>
        <p className="text-5xl md:text-6xl font-bold leading-none tracking-tight">
          {formatValue(parseInt(value))}
        </p>
      </div>
    </div>
  );
};

/* ===============================
   COMPONENT: ADMIN DASHBOARD
================================= */
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    reserved: 0,
    sold: 0,
    cancelled: 0,
    weeklydata: [],
  });
  const [residenceName, setResidenceName] = useState("");

  // 🔒 Lock body scroll
  useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDashboard = async () => {
      try {
        const res = await apiAdmin.get("/dashboard");


        const result = res.data?.data || {};
        setStats({
          reserved: result.reserved_houses ?? 0,
          sold: result.total_houses ?? 0,
          cancelled: result.cancelled_reservations ?? 0,
          weeklydata:
            result.latest_reservations?.map((r, i) => ({
              name: `Resv ${i + 1}`,
              value: parseInt(r?.house?.number_block || 0),
            })) ?? [],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const fetchResidenceName = async () => {
      try {
        const res = await apiAdmin.get("/residence-info");
        console.log(res.data);

        setResidenceName(res.data.name || "Unknown Residence");
      } catch (error) {
        console.error("Error fetching residence name:", error);
      }
    };

    fetchDashboard();
    fetchResidenceName();
  }, []);

  return (
    <>
      {/* ✅ Sidebar tetap fix di kiri */}
      <Sidebar />

      {/* ✅ Area kanan: tidak scroll, fix penuh */}
      <div className="fixed inset-y-0 left-64 right-0 bg-gray-50 flex flex-col justify-between overflow-hidden">
        <div className="px-6 sm:px-8 py-6 flex-1 flex flex-col">
          <div>
            {/* ===== TITLE ===== */}
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Dashboard {residenceName || ""}
            </h1>

            {/* ===== CHART SECTION ===== */}
            <div className="mb-8">
              <ChartCard data={stats.weeklydata} />
            </div>

            {/* ===== STAT CARD SECTION ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 md:gap-14 lg:gap-[54px]">
              <StatCard
                title="RESERVED"
                value={stats.reserved}
                type="reserved"
              />
              <StatCard title="SOLD" value={stats.sold} type="sold" />
              <StatCard
                title="CANCELLED"
                value={stats.cancelled}
                type="cancelled"
              />
            </div>
          </div>

          {/* ===== EXTRA SPACE ===== */}
          <div className="pb-5" />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
