import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Plus, Loader2 } from 'lucide-react';
import supabase from '../createClient';

const ImageUploader = ({ folder = 'general', onUploadSuccess, aspectRatio = 'aspect-square' }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Logic Kompresi & Konversi WebP
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
        fileType: 'image/webp'
      };

      const compressedFile = await imageCompression(file, options);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const filePath = `${folder}/${fileName}`;

      // 2. Upload ke Storage
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      // 3. Ambil URL Publik
      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      // 4. Kirim URL ke Parent Component
      onUploadSuccess(publicUrl);

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Gagal mengunggah gambar");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <label className={`cursor-pointer ${aspectRatio} rounded-[24px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all overflow-hidden relative`}>
      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-indigo-600" size={24} />
          <span className="text-[10px] font-black text-slate-400 uppercase">Optimizing...</span>
        </div>
      ) : (
        <>
          <Plus className="text-slate-400" size={24} />
          <span className="text-[10px] font-black text-slate-400 uppercase mt-1">Add Photo</span>
        </>
      )}
      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={isUploading} />
    </label>
  );
};

export default ImageUploader;