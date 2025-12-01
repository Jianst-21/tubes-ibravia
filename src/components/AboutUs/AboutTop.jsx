import backgroundImage from "@/assets/images/colection/property-page.png";

export const AboutTop = () => {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden px-6">
      
      {/* Background */}
      <img
        src={backgroundImage}
        alt="Background Bedroom"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="
        relative z-10 flex flex-col md:flex-row items-center justify-center
        gap-10 lg:gap-16 xl:gap-20
        w-full
      ">

        {/* LEFT IMAGE */}
        <div
          className="
            rounded-3xl overflow-hidden shadow-2xl border border-white/30
            w-[512px] max-w-full aspect-[512/344]
            mx-auto
            mt-[40px] mb-[40px]         /* mobile */
            md:mt-[50px] md:mb-[50px]   /* tablet */
            lg:mt-[60px] lg:mb-[60px]   /* laptop */
            xl:mt-[50px] xl:mb-[50px]   /* 1280px turunin 20px */
            2xl:mt-[70px] 2xl:mb-[70px] /* 1440+ sesuai Figma */
          "
        >
          <img
            src="/images/block/A.png"
            alt="Modern House"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT TEXT */}
        <div className="
          text-white
          max-w-[512px]  /* ⛔ teks tidak bisa melebihi gambar */
          text-left
          flex flex-col justify-center
          px-2
        ">
          <h2 className="text-4xl md:text-5xl font-bold mb-[48px]">
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
