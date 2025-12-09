import { useRef } from "react";
import { VillaButton } from "../GlobalPage/VillaButton";
import { VillaSlider } from "./VillaSlider";

export const VillaSection = () => {
  const villas = [
    {
      id: "N001",
      name: "Villa Ijen Nebraska",
      slides: [
        {
          title: "Villa Ijen Nebraska",
          desc: "Villa Ijen Nebraska is a modern residential project by PT Bumi Moro Agung, designed for families who value both comfort and practicality. Located in a strategic area with easy access to main roads and daily necessities, this housing complex offers a calm and secure living environment.",
          img: "/images/block/M.png",
        },
        {
          title: "Vision & Mission",
          desc: "Our vision is to provide a harmonious living space that combines functionality, aesthetics, and sustainability. Our mission is to build homes that bring long-term value and happiness to every homeowner.",
          img: "/images/block/M.png",
        },
        {
          title: "Housing Overview",
          desc: "Villa Ijen Nebraska consists of 48 exclusive units located in a strategic area at C2, Raya Jember Street, Kalirejo Housing Complex, Banyuwangi Regency, East Java. With easy access to shopping centers, hospitals, and major roads, it offers both comfort and everyday convenience for families.",
          img: "/images/block/M.png",
        },
      ],
    },
    {
      id: "R001",
      name: "Villa Ijen Raya",
      slides: [
        {
          title: "Villa Ijen Raya",
          desc: "Villa Ijen Raya presents a residential environment that reflects simplicity and elegance. Developed by PT Bumi Moro Agung, this project aims to create a balanced lifestyle between modern design and natural surroundings, ideal for growing families.",
          img: "/images/block/A.png",
        },
        {
          title: "Vision & Mission",
          desc: "Our vision is to develop quality housing that enhances the way people live. Our mission is to provide affordable yet high-quality homes with reliable infrastructure and excellent accessibility.",
          img: "/images/block/A.png",
        },
        {
          title: "Housing Overview",
          desc: "Villa Ijen Raya offers 38 thoughtfully designed housing units located at C2, Raya Jember Street, Kalirejo Housing Complex, Banyuwangi Regency, East Java. The complex enjoys a strategic location close to public amenities such as schools, local markets, and major roads.",
          img: "/images/block/A.png",
        },
      ],
    },
    {
      id: "D001",
      name: "Villa Ijen Delima",
      slides: [
        {
          title: "Villa Ijen Delima",
          desc: "Villa Ijen Delima is a residential complex developed by PT Bumi Bangun Persada Property, offering homes with a modern minimalist touch. Part of a new neighborhood, this residence is built with functionality and aesthetics in mind. It provides the ideal space for modern family living.",
          img: "/images/block/E.png",
        },
        {
          title: "Vision & Mission",
          desc: "Our vision is to create sustainable communities where every resident feels a sense of belonging. Our mission is to deliver quality housing with comfort, beauty, and long-term value.",
          img: "/images/block/E.png",
        },
        {
          title: "Housing Overview",
          desc: "Villa Ijen Delima offers 38 thoughtfully designed housing units located at Sumberayu Street, RT 03 / RW 011, Muncar District, Banyuwangi Regency, East Java. The complex enjoys a strategic location close to public amenities such as schools, local markets, and major roads.",
          img: "/images/block/E.png",
        },
      ],
    },
    {
      id: "G001",
      name: "Villa Ijen Gold 3",
      slides: [
        {
          title: "Villa Ijen Gold 3",
          desc: "Villa Ijen Gold 3 is the latest housing project by PT Total Bumi Artha Raya, continuing the legacy of quality and trust from previous developments. Designed to provide comfort, accessibility, and a modern lifestyle, this residence is perfect for families.",
          img: "/images/block/Q.png",
        },
        {
          title: "Vision & Mission",
          desc: "Our vision is to develop homes that inspire a better way of living. Our mission is to combine quality construction, modern design, and a strategic location to deliver the best residential experience for every homeowner.",
          img: "/images/block/Q.png",
        },
        {
          title: "Housing Overview",
          desc: "Villa Ijen Gold 3 features 54 modern housing units, each built with attention to comfort and style. Nestled in a prime area on Ikan Layur Street, Taman Puring Asri Housing Complex, Block A-6, Sobo, Banyuwangi Regency, East Java, residents can enjoy seamless access to shopping districts, public facilities, and main transport routes.",
          img: "/images/block/Q.png",
        },
      ],
    },
  ];

  const sectionRefs = useRef([]);

  const scrollToVilla = (id) => {
    const target = sectionRefs.current.find((ref) => ref?.id === id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="w-full bg-background text-foreground py-16 transition-colors duration-500">
      {/* Header */}
      <div className="text-center mb-10 px-6 md:px-16">
        <h3 className="text-[16px] font-medium opacity-80 text-primary">
          Find the home that fits your lifestyle and future
        </h3>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">House Collections</h1>
      </div>

      {/* Tombol Villa */}
      <div className="flex flex-wrap justify-center gap-8 px-6 md:px-16 mb-12">
        {villas.map((villa) => (
          <VillaButton key={villa.id} name={villa.name} onClick={() => scrollToVilla(villa.id)} />
        ))}
      </div>

      {/* Villa Slides */}
      <div className="flex flex-col gap-20">
        {villas.map((villa, index) => (
          <div key={villa.id} id={villa.id} ref={(el) => (sectionRefs.current[index] = el)}>
            <VillaSlider
              name={villa.name}
              slides={villa.slides}
              reversed={index % 2 === 1}
              blueTheme={index % 2 === 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
