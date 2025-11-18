import backgroundImage from "@/assets/images/colection/property-page.png";
import houseImage from "@/assets/images/colection/hero-bg.jpg";

export const AboutTop = () => {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <img
        src={backgroundImage}
        alt="Background Bedroom"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Konten utama */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full">
        {/* Gambar di kiri */}
        <div
          className="flex-shrink-0 rounded-3xl overflow-hidden shadow-2xl border 
          border-white/30 max-w-sm md:max-w-md lg:max-w-lg"
          style={{
            marginLeft: "52px",
            marginRight: "105px",
            marginTop: "70px",
            marginBottom: "70px",
          }}
        >
          <img
            src="/images/block/A.png"
            alt="Modern House"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Teks di kanan */}
        <div
          className="text-white max-w-[600px] text-left flex flex-col justify-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-[48px]">
            About Us, IBRAVIA
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-gray-100">
            Ibravia is a trusted property developer dedicated to creating modern, 
            comfortable, and affordable homes for families. With a commitment to 
            quality and customer satisfaction, we strive to guide every client through
             their journey of finding the perfect home.
          </p>
        </div>
      </div>
    </section>
  );
};
