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
    <div className="w-full bg-white rounded-2xl shadow-md border border-gray-200 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-800 font-semibold text-lg">Weekly Report</h2>

        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <span className="w-2 h-2 bg-black rounded-full" />
          Current Week
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />

            <XAxis
              dataKey="name"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />

            <Tooltip
              cursor={{ stroke: "#9CA3AF", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                fontSize: "12px",
                padding: "6px 10px",
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#4B5563" // warna garis sesuai figma (abu gelap)
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#111827" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
