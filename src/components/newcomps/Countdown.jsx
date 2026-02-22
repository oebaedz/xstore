import { useEffect, useState } from "react";

export default function Countdown() {
  const closingDate = new Date("2026-02-29T23:59:59");
  const [timeLeft, setTimeLeft] = useState(closingDate - new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const timeDiff = closingDate - now;
      setTimeLeft(timeDiff);
      if (timeDiff <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
      } else {
        setTimeLeft(timeDiff);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [closingDate]);
  
  const items = [
    { label: "HARI", value: Math.floor(timeLeft / (1000 * 60 * 60 * 24)).toString().padStart(2, "0") },
    { label: "JAM", value: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, "0") },
    { label: "MENIT", value: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0") },
    { label: "DETIK", value: Math.floor((timeLeft % (1000 * 60)) / 1000).toString().padStart(2, "0") },
  ];

  return (
    <div>
      <h1 className="font-display text-xl md:text-3xl text-gold text-center mb-5">
            Pre-Order Ditutup Dalam
        </h1>
      <div className="flex gap-2 md:gap-6 justify-center">
        {items.map((item) => (
          <div
            key={item.label}
            className="
              bg-gradient-to-br from-primary to-primary-dark
              border border-gold/40
              rounded-sm
              p-4 md:p-6
              min-w-[70px] md:min-w-[100px]
              text-center
            "
          >
            {/* Number */}
            <span className="font-display font-bold text-2xl md:text-5xl text-gold">
              {item.value}
            </span>

            {/* Label */}
            <span className="text-[8px] block md:text-sm mt-1 text-white/60 tracking-wider font-body">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
