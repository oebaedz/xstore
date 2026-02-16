import React from "react";

export default function Countdown() {
  const items = [
    { label: "HARI", value: "12" },
    { label: "JAM", value: "08" },
    { label: "MENIT", value: "45" },
    { label: "DETIK", value: "21" },
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
