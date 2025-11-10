import { Home } from "lucide-react";

export const VillaButton = ({ name, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-2xl border text-sm sm:text-base 
    font-medium shadow-sm transition-all duration-300 cursor-pointer
    ${active
          ? "bg-primary text-primary-foreground scale-[1.02] shadow-glow"
          : "bg-card text-foreground border-dynamic hover:scale-[1.02]"
        }`}
      style={{
        width: "240px",  
        height: "240px", 
        flexShrink: 0,
      }}
    >
      <div
        className="flex items-center justify-center rounded-full border-2 mb-3 transition-all duration-300"
        style={{
          width: "120px",
          height: "120px",
          borderColor: "hsl(var(--primary))",
          backgroundColor: active
            ? "hsl(var(--card))"
            : "transparent",
        }}
      >
        <Home
          size={64}
          strokeWidth={2.2}
          style={{
            color: "hsl(var(--primary))",
            transition: "transform 0.3s ease",
          }}
        />
      </div>
      <span className="text-center font-semibold leading-tight text-base">
        {name}
      </span>
    </button>

  );
};
