import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ChartCard = ({ data = [] }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
        <h2 className="text-gray-800 font-semibold text-lg">Weekly Report</h2>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <span className="w-2 h-2 bg-black rounded-full inline-block" />
          Current Week
        </p>
      </div>

      {/* Chart */}
      <div className="w-full h-[190px]">
        {" "}
        {/* ⬅️ tinggi dikurangi dari 320px ke 220px */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4B5563" // abu-abu gelap, seperti contoh
              strokeWidth={1.8}
              dot={false}
              activeDot={{ r: 3, fill: "#111827" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
