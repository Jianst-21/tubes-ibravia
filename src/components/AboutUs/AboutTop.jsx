import backgroundImage from "@/assets/images/colection/property-page.png";

export const AboutTop = () => {
  return (
    <section
      className="
        relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden
        px-6                 /* Mobile */
        md:px-12             /* Tablet */
        lg:px-[80px]         /* 1024px */
        xl:px-[100px]        /* 1280px */
        2xl:px-[120px]       /* 1440px+ */
      "
    >
      {/* Background */}
      <img
        src={backgroundImage}
        alt="Background Bedroom"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Main Content */}
      <div
        className="
          relative z-10 flex flex-col md:flex-row items-center justify-between
          gap-10 lg:gap-16 xl:gap-20
          w-full
        "
      >
        {/* Left Image */}
        <div
          className="
            rounded-3xl overflow-hidden shadow-2xl border border-white/30
            w-[512px] max-w-full aspect-[512/344]
            mt-[40px] mb-[40px]
            md:mt-[50px] md:mb-[50px]
            lg:mt-[60px] lg:mb-[60px]
            xl:mt-[50px] xl:mb-[50px]
            2xl:mt-[70px] 2xl:mb-[70px]
          "
        >
          <img
            src="/images/block/A.png"
            alt="Modern House"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Text */}
        <div className="text-white max-w-[512px] text-left flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-[48px]">About Us, IBRAVIA</h2>

          <p className="text-base md:text-lg leading-relaxed text-gray-100 text-justify">
            Ibravia is a trusted property developer dedicated to creating modern, comfortable, and
            affordable homes for families. With a commitment to quality and customer satisfaction,
            we strive to guide every client through their journey of finding the perfect home.
          </p>
        </div>
      </div>
    </section>
  );
};
