import backgroundImage from "../../../src/assets/images/colection/property-page.png";

export const Top = () => {
  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] lg:h-[85vh] 
    flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src={backgroundImage}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay lembut */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Kotak transparan sedikit lebih solid */}
      <div className="relative z-10 flex flex-col items-center justify-center 
      bg-white/50 px-20 py-16 bordershadow-md max-w-4xl text-center rounded-[20px]">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-18">
          Discover Your Perfect Property
        </h1>
        <p className="text-lg md:text-xl text-gray-900 leading-relaxed max-w-xl">
          Start your journey by exploring our curated homes and residences.
        </p>
      </div>
    </section>
  );
};
