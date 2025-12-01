import { Link } from "react-router-dom";
import a02Image from "../../../src/assets/images/colection/a02.png";
import f08Image from "../../../src/assets/images/colection/f08.png";
import c04Image from "../../../src/assets/images/colection/c04.png";
import e07Image from "../../../src/assets/images/colection/e07.png";
import ptBangunPersada from "../../assets/images/pt/Persada.png";
import ptBumiMoroAgung from "../../assets/images/pt/BumiMoro.png";
import ptTotalBumiArtha from "../../assets/images/pt/Total.png";

export const HouseCollections = () => {
  const houses = [
    {
      id_house: 2,
      id_block: 1,
      image: a02Image,
      category: "A 2",
      title: "Villa Ijen Nebraska",
      desc: "2 Bedrooms, 1 Bathroom, Living Room, Kitchen, Garage",
      price: "IDR 280.000.000",
      developer: "PT Bumi Moro Agung",
      pt: ptBumiMoroAgung,
    },
    {
      id_house: 699,
      id_block: 25,
      image: f08Image,
      category: "F 8",
      title: "Villa Ijen Delima",
      desc: "2 Bedrooms, 1 Bathroom, Living Room, Kitchen, Garage",
      price: "IDR 153.000.000",
      developer: "PT Total Bumi Artha Raya",
      pt: ptBangunPersada,
    },
    {
      id_house: 958,
      id_block: 35,
      image: c04Image,
      category: "P 7",
      title: "Villa Ijen Gold 3",
      desc: "2 Bedrooms, 1 Bathroom, Living Room, Kitchen, Garage",
      price: "IDR 210.000.000",
      developer: "PT Bumi Moro Agung",
      pt: ptTotalBumiArtha,
    },
    {
      id_house: 414,
      id_block: 15,
      image: e07Image,
      category: "E 7",
      title: "Villa Ijen Raya",
      desc: "2 Bedrooms, 1 Bathroom, Living Room, Kitchen, Garage",
      price: "IDR 165.000.000",
      developer: "PT Bumi Bangun Persada Property",
      pt: ptBumiMoroAgung,
    },
  ];

  return (
    <section className="py-20 bg-background text-foreground transition-colors duration-300 font-[var(--font-body)]">
      <div className="container mx-auto px-6">
        {/* Subheading */}
        <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2 font-[var(--font-subheader)] text-center">
          Find the home that fits your lifestyle and future
        </p>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground font-[var(--font-headline)] text-center">
          House Collections
        </h2>

        {/* Grid Cards */}
        <div className="grid gap-4 justify-items-center 
            grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">


          {houses.map((house) => (
            <Link
              key={house.id_house}
              to={`/Detail-Properties/${house.id_block}`}
              className="group card-hover bg-card rounded-xl text-left block 
              font-[var(--font-body)] transition-all duration-300 h-[456px] 
              flex flex-col p-4 shadow-md hover:shadow-lg"
            >
              {/* Gambar */}
              <div className="w-full h-[220px] overflow-hidden rounded-lg">
                <img
                  src={house.image}
                  alt={house.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Konten */}
              <div className="mt-4 flex-grow space-y-2">
                <p className="text-sm text-primary font-medium">
                  {house.category}
                </p>

                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                  {house.title}
                </h3>

                {/* DESC — sudah diganti dari HSL ke text-muted-foreground */}
                <p className="text-sm pt-4 text-muted-foreground leading-snug">
                  {house.desc}
                </p>

                <div className="pt-4 border-t border-border mt-auto">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={house.pt}
                        alt="developer"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {house.price}
                      </p>

                      {/* Developer — ganti ke text-muted-foreground */}
                      <p className="text-sm text-muted-foreground font-subheader">
                        {house.developer}
                      </p>

                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tombol */}
        <div className="mt-12 text-center">
          <Link
            to="/properties"
            className="ibravia-button text-[20px] px-8 py-3 font-subheader"
          >
            Explore More
          </Link>
        </div>
      </div>
    </section>
  );
};
