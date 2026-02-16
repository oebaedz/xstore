const CheckoutProgress = ({ currentStep = 1 }) => {
  const steps = [
    { number: 1, label: "Pilih Produk", active: currentStep >= 1 },
    { number: 2, label: "Review Pesanan", active: currentStep >= 2 },
    { number: 3, label: "Info Pemesan", active: currentStep >= 3 }
  ];

  return (
    <div className="mb-8 top-20">
      <div className="flex justify-between items-center relative">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center z-10 relative ${
              step.active ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step.active ? step.number : <div className="w-3 h-3 rounded-full bg-gray-400" />}
            </div>
            <span className={`text-xs mt-1 text-center ${
              step.active ? 'font-medium text-accent' : 'text-gray-500'
            }`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={`absolute left-1/2 w-full h-1 bg-gray-300 z-0 transform -translate-y-4 ${(index === 0 || index === 1) ? 'block' : 'hidden md:block'}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutProgress;