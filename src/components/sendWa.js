
  const kirimPesan = async (tgt, msg) => {
    // setStatus('Sedang mengirim...');

    const notifyGrup = '120363162312659029@g.us'; // Nomor grup tujuan
    const notifyIndividu = '085320561697'; // Nomor individu tujuan
    
    const token = 'BrrM4ajyRyU83W5P2hvM'; // Ambil dari dashboard Fonnte
    const target = tgt || notifyIndividu; // Nomor tujuan
    const message = msg || 'Halo! Ini pesan otomatis dari React JS.';

    try {
      
      // Menggunakan FormData karena Fonnte memerlukannya
      const data = new FormData();
      data.append('target', target);
      data.append('message', message);

      const result = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': token,
        },
        body: data,
      });

      console.log(result);

      const resJson = await result.json();

      if (resJson.status) {
        console.log('Pesan terkirim!');
      } else {
        console.log('Gagal: ' + resJson.reason);
      }
    } catch (error) {
      console.log('Terjadi kesalahan jaringan.');
    }
  };

export default kirimPesan