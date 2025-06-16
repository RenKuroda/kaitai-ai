
import React from 'react';

interface ImageUploadAreaProps {
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({ onImageUpload, disabled }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 border-2 border-dashed border-slate-600 rounded-lg text-center bg-slate-700 hover:border-sky-500 transition-colors">
      <input
        type="file"
        multiple
        accept="image/jpeg, image/png, image/webp"
        onChange={onImageUpload}
        className="hidden"
        ref={fileInputRef}
        disabled={disabled}
      />
      <button
        onClick={handleButtonClick}
        disabled={disabled}
        className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 ease-in-out inline-flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
        画像を選択 (最大10枚)
      </button>
      <p className="mt-3 text-sm text-slate-400">JPEG, PNG, WEBP形式の画像をアップロードしてください。</p>
    </div>
  );
};
