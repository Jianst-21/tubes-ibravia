import backgroundImage from "@/assets/images/colection/property-page.png";

export const AboutTop = () => {
  return (
    <section
      className="
        relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden
        px-6
        md:px-[60px]
        lg:px-[80px]
        xl:px-[100px]
        2xl:px-[120px]
      "
    >
      {/* Background */}
      <img
        src={backgroundImage}
        alt="Background Bedroom"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Konten utama */}
      <div
        className="
          relative z-10 flex flex-col md:flex-row items-center
          justify-center w-full max-w-[1400px]
          gap-y-10 gap-x-[150px] /* jarak horizontal 150px */
        "
      >
        {/* Gambar di kiri */}
        <div
          className="
          w-[512px] aspect-[512/343]
          rounded-3xl overflow-hidden shadow-2xl border border-white/30
        "
        >
          <img
            src="/images/block/A.png"
            alt="Modern House"
            className="w-full h-full object-cover"
          />
        </div>


        {/* Teks di kanan */}
        <div
          className="
            text-white max-w-[600px] text-left flex flex-col justify-center
            mb-[80px]
            md:mb-[120px]
            lg:mb-[150px]
          "
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 md:mb-12">
            About Us, IBRAVIA
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-gray-100">
            Ibravia is a trusted property developer dedicated to creating modern,
            comfortable, and affordable homes for families. With a commitment to
            quality and customer satisfaction, we strive to guide every client
            through their journey of finding the perfect home.
          </p>
        </div>
      </div>
    </section>
  );
};
