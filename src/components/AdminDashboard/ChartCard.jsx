import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Customized,
} from "recharts";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getCeilingAndStep(maxVal) {
  if (maxVal <= 5) return { upper: 5, step: 1 };
  if (maxVal <= 20) return { upper: 20, step: 5 };
  if (maxVal <= 50) return { upper: 50, step: 10 };

  const upper = Math.ceil(maxVal / 50) * 50;
  return { upper, step: 10 };
}

function buildTicks(upper, step) {
  const ticks = [];
  for (let v = 0; v <= upper; v += step) ticks.push(v);
  return ticks;
}

const ChartBorder = ({ offset }) => {
  if (!offset) return null;
  const { left, top, width, height } = offset;

  return (
    <rect
      x={left}
      y={top}
      width={width}
      height={height}
      fill="none"
      stroke="#D1D5DB"
      strokeWidth={1}
    />
  );
};

const ChartCard = ({ data = [] }) => {
  const values = (data ?? []).map((d) => Number(d?.value) || 0);
  const maxVal = Math.max(0, ...values);

  const { upper, step } = getCeilingAndStep(maxVal);
  const ticks = buildTicks(upper, step);

  const now = new Date();
  const monthYear = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(now);

  const weekOfMonth = Math.ceil(now.getDate() / 7);

  return (
    <div className="w-full bg-white rounded-2xl shadow-md border border-gray-200 p-8">
      {/* Header (ikut style Vercel) */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-800 font-semibold text-lg">Week {weekOfMonth}</h2>
        <div className="text-gray-800 text-sm font-bold">{monthYear}</div>
      </div>

      {/* Chart (ikut height Vercel) */}
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" vertical horizontal />

            <XAxis
              dataKey="day"
              ticks={[1, 2, 3, 4, 5, 6, 7]}
              tickFormatter={(v) => (DAYS[v - 1] ? DAYS[v - 1] : "")}
              interval={0}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[0, upper]}
              ticks={ticks}
              allowDecimals={false}
              padding={{ top: 12, bottom: 0 }}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{ stroke: "#9CA3AF", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                fontSize: "12px",
                padding: "6px 10px",
              }}
              labelFormatter={(label) => DAYS[label - 1] ?? label}
            />

            <Customized component={ChartBorder} />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#4B5563"
              strokeWidth={2}   // ikut Vercel
              dot={false}
              activeDot={{ r: 4, fill: "#111827" }} // ikut Vercel
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;
