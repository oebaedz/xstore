const DepositInfo = ({ total }) => {
  const dpAmount = Math.ceil(total * 0.5);
  
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            <strong>Pembayaran DP (Down Payment)</strong><br/>
            Total pesanan Anda: <strong>Rp {Number(total).toLocaleString()}</strong><br/>
            DP minimal yang dibutuhkan: <strong>Rp {dpAmount.toLocaleString()} (50%)</strong><br/>
            <span className="pt-2 block">
              Silakan transfer DP ke:
            </span>
          </p>
          <div className="mt-2 bg-white p-3 rounded border">
            <p className="text-sm"><strong>No Rekening BRI a/n:</strong></p>
            <p className="font-bold md:text-lg">A. JAMIL HIDAYATULLAH</p>
            <p className="font-bold md:text-lg">0582-0102-0919-50-4</p>
            <p className="mt-2 text-sm">
              Konfirmasi pembayaran via{' '}
              <a 
                href="https://wa.me/6282228326870" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-800 underline hover:text-green-900"
              >
                WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositInfo;