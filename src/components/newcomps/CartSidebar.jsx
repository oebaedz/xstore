import React from 'react';

const CartSidebar = ({ isOpen, onClose, items, setItems, onCheckout }) => {
  
  // Logic Update Quantity (Sesuai Context kamu)
  const updateQty = (id, delta) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  // Logic Hapus Item
  const removeItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const total = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <>
      {/* Overlay Backdrop dengan Blur Efek */}
      <div 
        className={`fixed inset-0 bg-primary/40 backdrop-blur-sm z-[60] transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className={`fixed right-0 top-0 h-full w-full md:w-[450px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-[70] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header: Deep Emerald with Pattern */}
        <div className="relative bg-primary px-8 py-4 border-b border-gold text-white overflow-hidden">
          <div className="arabesque-pattern absolute inset-0 opacity-20"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-gold">Keranjang</h2>
              <p className="text-gold/60 text-xs tracking-widest uppercase mt-1">
                {items.length} Barang Terpilih
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="flex items-center justify-center text-gold hover:text-gold/70 transition-all duration-300"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col h-[calc(100vh-150px)]">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 md:space-y-6 custom-scrollbar">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="font-display text-xl text-primary/40">Belum ada koleksi terpilih</p>
                <button onClick={onClose} className="text-accent-green-dark font-bold text-sm tracking-widest underline underline-offset-8">
                  MULAI BELANJA
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="group flex gap-4 pb-2 md:pb-6 border-b border-gray-100 last:border-0">
                  {/* Item Image Placeholder */}
                  <div className="w-20 h-20 bg-gray-50 flex justify-center relative overflow-hidden group-hover:bg-accent-green/5 transition-colors">
                    <img className='h-full object-contain' src={item.image} alt={item.name} />
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-body text-xs md:text-sm font-bold text-primary group-hover:text-accent-green-dark transition-colors">
                          {item.name}
                        </h4>
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="text-red-500 hover:text-gray-500 transition-colors"
                        >
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-[10px] md:text-xs text-gray-600 tracking-widest mt-1">
                        {item.variantName}
                      </p>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      {/* Qty Controller */}
                      <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden">
                        <button 
                          onClick={() => updateQty(item.id, -1)} 
                          className="px-2 md:px-3 md:py-1 bg-gray-50 hover:bg-primary hover:text-white transition-colors"
                        >
                          &minus;
                        </button>
                        <span className="px-4 text-[9px] text-primary/80 md:text-sm font-bold w-4 md:w-12 text-center">{item.qty}</span>
                        <button 
                          onClick={() => updateQty(item.id, 1)} 
                          className="px-2 md:px-3 md:py-1 bg-gray-50 hover:bg-primary hover:text-white transition-colors"
                        >
                          +
                        </button>
                        </div>
                          <div className="text-left">
                            <p className="text-primary font-body font-bold text:sm md:text-lg">
                              Rp {(item.price * item.qty).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      </div>
                </div>
              ))
            )}
          </div>

          {/* Sticky Footer Area */}
          <div className="p-8 py-2 bg-gray-50 border-t border-gray-200">
            <div className="mt-1 md:mt-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-body text-lg md:text-xl font-bold text-primary uppercase">Total</span>
                <span className="font-body text-lg md:text-xl font-bold text-primary leading-none">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button 
                disabled={items.length === 0}
                onClick={onCheckout}
                className={`group relative overflow-hidden py-3 md:py-4 font-bold tracking-[0.3em] transition-all duration-500 ${
                  items.length > 0 
                  ? 'bg-accent-green text-white hover:bg-green-700 active:scale-95' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="relative text-xs md:text-lg z-10">LANJUT KE CHECKOUT</span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              </button>
              
              <button 
                onClick={onClose} 
                className="py-3 md:py-4 bg-white text-[10px] md:text-sm text-primary font-bold uppercase tracking-widest hover:text-accent-green transition-colors border border-accent-green-dark hover:border-accent/30"
              >
                &larr; Tambah Produk Lain
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;