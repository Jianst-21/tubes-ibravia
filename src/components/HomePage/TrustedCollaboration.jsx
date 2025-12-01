import { motion } from "framer-motion";
import ptBangunPersada from "../../assets/images/pt/Persada.png";
import ptBumiMoroAgung from "../../assets/images/pt/BumiMoro.png";
import ptTotalBumiArtha from "../../assets/images/pt/Total.png";

const partners = [
  { id: 1, name: "PT Bangun Persada Property", logo: ptBangunPersada },
  { id: 2, name: "PT Bumi Moro Agung", logo: ptBumiMoroAgung },
  { id: 3, name: "PT Total Bumi Artha Raya", logo: ptTotalBumiArtha },
];

export const TrustedCollaboration = () => {
  return (
    <section className="pt-12 pb-20 bg-[hsl(var(--background))] text-foreground">
      {/* Container dengan margin horizontal responsif */}
      <div className="w-full px-4 sm:px-8 lg:px-[120px] mx-auto">

        {/* Heading */}
        <div className="text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            We Proudly Present
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12">
            Our Trusted Collaboration
          </h2>
        </div>

        {/* Grid PT responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 md:gap-x-24 pt-16 justify-center">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="w-full max-w-[309px] aspect-[309/306] bg-[hsl(var(--background))] rounded-2xl 
              shadow-[0_4px_12px_rgba(0,0,0,0.25)] 
              transition-transform duration-300 hover:scale-105 
              flex flex-col items-center justify-center mx-auto"
            >
              <div className="w-36 h-36 mb-6 rounded-full overflow-hidden shadow-md">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                />
              </div>
              <p className="text-base font-semibold text-center">{partner.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
