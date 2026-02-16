import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../StoreContext";
import { json, Link, useNavigate } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import sendWhatsApp from "../context/sendWhatsApp";
import supabase from "./createClient";

const OrdererInfo = () => {
  const { items, setItems } = useContext(StoreContext);
  const [nama, setNama] = useState("");
  const [noHP, setNoHP] = useState("");
  const [alamat, setAlamat] = useState("");
  const [loading, setLoading] = useState(false);
  const [warn, setWarn] = useState(false);
  const [succ, setSucc] = useState(false);
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();


  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const total = items.reduce((price, item) => price + item.qty * item.price, 0);
  const diorder = items.reduce(
    (name, item) =>
      name + item.name + " : " + item.qty + " x " + item.price + ",",
    ""
  );

  const itemsList = items.reduce((acc, item) =>{
    const subtotal = item.qty * item.price;
    return acc + `* ${item.qty} x *${item.name}* = ${subtotal.toLocaleString("id-ID")}\n`},""
  );
  

  const message = `Terima kasih, pesanan Anda telah kami terima dengan rincian sebagai berikut:\n\nNama: *${nama}*\nNo. HP: *${noHP}*\nAlamat: *${alamat}*\nOrderan:\n${itemsList}\nTotal Harga: *Rp ${total.toLocaleString("id-ID")}*\n\nMohon lakukan pembayaran DP minimal 50% ke rekening berikut:\nBRI a/n: A. JAMIL HIDAYATULLAH\nNo. Rekening: 0582-0102-0919-50-4\n\nSetelah melakukan pembayaran, silakan konfirmasi melalui WhatsApp di https://wa.me/6282228326870\n\nTerima kasih atas kepercayaan Anda kepada kami!`;

  // trying submit
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbwmGJQ99vDQrP7v3xUyGWejWoLLLQI3h8eGpvvSzsLnJkfBlxARTk6Bb_LNTTxUCfDg/exec";

  const form = document.forms["preorder-form"];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate phone number format
    if (noHP && !noHP.match(/^62\d{8,}$/)) {
      setWarn(true);
      setAlert("Nomor HP harus diawali dengan 62 dan berisi minimal 10 digit");
      setTimeout(() => setWarn(false), 7000);
      return;
    }

    if (!nama || !noHP || !alamat) {
      setWarn(true);
      setAlert("Lengkapi data Anda!");
      setTimeout(() => {
        setWarn(false);
      }, 7000);
    } else if (!items.length) {
      setWarn(true);
      setAlert("Pilih produk dulu!");
      setTimeout(() => {
        setWarn(false);
      }, 7000);
    } else {
      setLoading(true);

      // Create a new FormData object based on the form and add individual product fields
      const formData = new FormData(form);

      // Add individual item fields separately for better organization
      items.forEach((item, index) => {
        formData.append(`produk_nama_${index}`, item.name);
        formData.append(`produk_jumlah_${index}`, item.qty);
        formData.append(`produk_harga_satuan_${index}`, item.price);
        formData.append(`produk_subtotal_${index}`, item.qty * item.price);
      });

      // Insert data into Supabase

      async function insertData() {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert([
            {
              nama: nama,
              no_hp: noHP,
              alamat: alamat,
              total_harga: total,
              status: 'belum bayar',
            }
          ])
          .select();
        
        if (orderError) {
          setLoading(false);
          return "Gagal simpan data: " + orderError.message
        }

        const orderId = orderData[0].id;
        console.log("Order ID:", orderId);
        console.log("Items to insert:", items.map(item => item.id));
        
        // 2. Mapping Items (Gunakan data varian jika ada)
        const itemsToInsert = items.map(item => ({
          order_id: orderId,
          product_id: item.productId,
          variant_id: item.id,
          price: item.price,
          qty: item.qty,
          // variant_lengan: item.price,
          // variant_size: item.price,
          subtotal: item.qty * item.price,
        }));
        
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(itemsToInsert);
        
        if (itemsError) {
          setLoading(false);
          // Catatan: Idealnya di sini ada logika "Rollback" jika items gagal tapi order sudah terlanjur masuk
          return "Gagal simpan item: " + itemsError.message;
        }

        setSucc(true);
        sendWhatsApp(noHP, message);

        setNama("");
        setNoHP("");
        setAlamat("");
        setItems([]);

        setTimeout(() => {
          setSucc(false);
          navigate("/");
        }, 5000);
        
        setLoading(false);          
      }

      insertData();
    }
  };

  // submit joss

  const Warning = () => {
    return (
      <div className="my-8 p-4 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
        <h3 className="font-bold text-xl mb-3 text-blue-800 flex items-center dark:text-blue-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Pembayaran
        </h3>
        <p className="mb-2 dark:text-gray-300">
          Untuk masuk dalam <b className="dark:text-white">List Preorder</b>, diperlukan pembayaran <b className="dark:text-white">DP minimal 50%</b> dari total harga.
        </p>
        <div className="bg-white p-4 rounded border border-blue-300 dark:bg-gray-800 dark:border-blue-700">
          <p className="font-medium mb-1 dark:text-gray-200">Rekening Pembayaran:</p>
          <p className="font-bold text-lg dark:text-white">BRI a/n: A. JAMIL HIDAYATULLAH</p>
          <p className="font-bold text-lg dark:text-white">No. Rekening: 0582-0102-0919-50-4</p>
        </div>
        <div className="mt-3 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="dark:text-gray-300"><b className="dark:text-white">Konfirmasi pembayaran wajib dilakukan</b> melalui <Link target="blank" to="https://wa.me/6282228326870" className="text-green-700 underline dark:text-green-400">WhatsApp</Link> setelah melakukan pembayaran</p>
        </div>
      </div>
    );
  };

  const SuccessAlert = () => {
    return (
      <div role="alert" className="alert alert-success mb-10 flex flex-row items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="dark:text-white">
          <p>Selamat! Pesanan Anda terkirim.</p>
          <p>Jangan lupa DP 50% atau bayar lunas.</p>
        </div>
        <button
          onClick={() => setSucc(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
            <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
          </svg>
        </button>
      </div>
    );
  };

  const WarnAlert = ({ alert }) => {
    return (
      <div role="alert" className="alert alert-warning mb-10 flex flex-row justify-between">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span className="dark:text-white">{alert}</span>
        <button
          onClick={() => setWarn(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
            <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
          </svg>
        </button>
      </div>
    );
  };

  if (items.length === 0) {
    return (
      <div className="px-6 md:px-[138px] bg-slate-50 min-h-screen flex flex-col items-center justify-center dark:bg-gray-900">
        <div className="my-12 text-center">
          <h3 className="font-medium text-3xl mb-4 dark:text-white">Keranjang Kosong</h3>
          <p className="italic mb-6 dark:text-gray-300">
            Silahkan pilih produk terlebih dahulu
          </p>
          <Link to="/" className="btn btn-accent">
            Pilih Produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-[138px] bg-slate-50 min-h-screen pt-16 dark:bg-gray-900"> {/* Add top padding to account for fixed navbar */}
      <Breadcrumb />
      <div className="space-y-4 dark:text-white">
        <h3 className="font-medium text-3xl dark:text-white">Informasi Pemesan</h3>
        <form name="preorder-form" className="mt-12">
          <div className="mb-12 md:flex gap-4">
          <label className="form-control w-full">
            <div className="label flex flex-row justify-between">
              <span className="label-text text-lg font-medium dark:text-white">Nama</span>
              {nama.trim() && (
                <span className="text-xs text-green-600 flex items-center dark:text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Terisi
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="Masukkan nama lengkap Anda"
              className={`input input-bordered w-full ${nama.trim() ? 'input-success' : ''} dark:bg-gray-700 dark:text-white dark:border-gray-600`}
              onChange={(e) => setNama(e.target.value)}
              value={nama}
              name="nama"
            />
          </label>
          <label className="form-control w-full">
            <div className="label flex flex-row justify-between">
              <p className="label-text text-lg font-medium dark:text-white">
                No. HP / WhatsApp
              </p>
              {noHP.trim() && (
                <span className={`text-xs ${noHP.match(/^62\d{8,}$/) ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'} flex items-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${noHP.match(/^62\d{8,}$/) ? 'block' : 'hidden'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${!noHP.match(/^62\d{8,}$/) ? 'block' : 'hidden'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {noHP.match(/^62\d{8,}$/) ? 'Valid' : 'Masukkan nomor yang valid'}
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="Masukkan nomor HP (contoh: 6281234567890)"
              className={`input input-bordered w-full ${noHP.match(/^62\d{8,}$/) ? 'input-success' : (noHP.trim() ? 'input-error' : '')} dark:bg-gray-700 dark:text-white dark:border-gray-600`}
              onChange={(e) => setNoHP(e.target.value)}
              value={noHP}
              name="noHP"
            />
            <p className="font-light text-sm ml-1 pt-2">
              No. HP diawali dengan angka 62
            </p>
          </label>
          <label className="form-control w-full">
            <div className="label flex flex-row justify-between">
              <span className="label-text text-lg font-medium dark:text-white">Alamat</span>
              {alamat.trim() && (
                <span className="text-xs text-green-600 flex items-center dark:text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Terisi
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="Masukkan alamat lengkap"
              className={`input input-bordered w-full ${alamat.trim() ? 'input-success' : ''} dark:bg-gray-700 dark:text-white dark:border-gray-600`}
              onChange={(e) => setAlamat(e.target.value)}
              value={alamat}
              name="alamat"
            />
          </label>
          <input
            type="text"
            readOnly
            value={total}
            name="totalHarga"
            className="hidden"
          />
          <input
            type="text"
            readOnly
            value={diorder}
            name="orderan"
            className="hidden"
          />
        </div>
        {items.length ? <Warning /> : ""}
        {warn && <WarnAlert alert={alert} />}
        {succ && <SuccessAlert />}
        <button
          type="submit"
          className="btn btn-accent w-full md:w-48 mb-20"
          onClick={handleSubmit}
          name="submit"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner"></span>
              Mengirim...
            </>
          ) : (
            <p className="font-medium md:text-lg">Kirim Pesanan</p>
          )}
        </button>
      </form>
    </div>
  </div>
  );
};

export default OrdererInfo;
