import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

const AmbilOrder = () => {
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(decodedText) {
      setScanResult(decodedText); // Isinya adalah order_id
      scanner.clear(); // Hentikan kamera setelah sukses scan
    }

    function onScanError(err) { /* Biarkan saja untuk scanning berkelanjutan */ }

    return () => scanner.clear();
  }, []);

  return (
    <div className="p-4 pb-20 space-y-6">
      <div id="reader" className="overflow-hidden rounded-[32px] border-none shadow-2xl"></div>
      
      {/* Popup Konfirmasi Muncul Setelah Scan */}
      {scanResult && (
        <div className="bg-slate-900 p-6 rounded-[32px] text-white animate-in slide-in-from-bottom-5">
          <h4 className="font-black text-sm uppercase text-indigo-400">Pesanan Ditemukan!</h4>
          {/* Di sini panggil data order berdasarkan ID dan tampilkan detailnya */}
          <button 
            onClick={() => handleSerahkanBarang(scanResult)}
            className="w-full mt-4 py-4 bg-green-500 rounded-2xl font-black uppercase text-sm"
          >
            Serahkan Barang & Selesai
          </button>
        </div>
      )}
    </div>
  );
};

export default AmbilOrder